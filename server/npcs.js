// NPC dong cua the gioi: Canh sat tuan tra, An trom, Giang ho doi bao ke, diem ve chai.
import { ECON, WORLD, ZONES, zoneAt } from '../shared/config.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const rand = (a, b) => a + Math.random() * (b - a);
const clampX = (x) => Math.max(WORLD.walk.x0, Math.min(WORLD.walk.x1, x));
const SIDEWALK_Y = () => (Math.random() < 0.5 ? rand(470, 560) : rand(800, 1120));

let npcSeq = 1;

export class NpcSystem {
  constructor(game) {
    this.g = game;
    this.list = new Map();
    this.gangEvent = null;
    for (const z of ZONES) {
      for (let i = 0; i < z.police; i++) {
        this.add({ kind: 'police', label: 'Cảnh sát', zone: z.id, unit: i, speed: 85,
          x: rand(z.x0 + 100, z.x1 - 100), y: SIDEWALK_Y(), state: 'patrol' });
      }
    }
    for (let i = 0; i < 6; i++) this.spawnScrap();
  }

  add(n) {
    n.id = `n${npcSeq++}`;
    n.dir = 'down';
    n.moving = false;
    n.tx = n.x;
    n.ty = n.y;
    this.list.set(n.id, n);
    return n;
  }

  remove(n) {
    this.list.delete(n.id);
  }

  of(kind) {
    return [...this.list.values()].filter((n) => n.kind === kind);
  }

  visible(n) {
    return n.kind !== 'police' || n.onDuty !== false || n.state === 'dispatch';
  }

  isNight() {
    const h = Math.floor(this.g.minute / 60);
    return h >= 19 || h < 5;
  }

  moveTo(n, tx, ty, dt) {
    const dx = tx - n.x;
    const dy = ty - n.y;
    const d = Math.hypot(dx, dy);
    const step = n.speed * dt;
    if (d <= step || d < 1) {
      n.x = tx;
      n.y = ty;
      n.moving = false;
      return true;
    }
    n.x += (dx / d) * step;
    n.y += (dy / d) * step;
    n.moving = true;
    n.dir = Math.abs(dx) > Math.abs(dy) * 0.6 ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
    return false;
  }

  nearestPolice(pos, range) {
    let best = null;
    for (const c of this.of('police')) {
      if (!this.visible(c)) continue;
      const d = dist(c, pos);
      if (d < range && (!best || d < best.d)) best = { c, d };
    }
    return best?.c || null;
  }

  // ------------------------------------------------------------------ update moi tick
  update(dt) {
    const g = this.g;
    for (const n of [...this.list.values()]) {
      switch (n.kind) {
        case 'police': this.updatePolice(n, dt); break;
        case 'thief': this.updateThief(n, dt); break;
        case 'gang': this.updateGang(n, dt); break;
        default: break;
      }
    }
    if (this.gangEvent && Date.now() > this.gangEvent.deadline) this.resolveGang('timeout');
    void g;
  }

  updatePolice(n, dt) {
    if (n.state === 'dispatch') {
      const ev = this.gangEvent;
      if (!ev || ev.police !== n.id) {
        n.state = 'patrol';
        n.speed = 85;
        return;
      }
      if (this.moveTo(n, ev.x + 40, ev.y + 10, dt)) this.resolveGang('police');
      return;
    }
    if (n.onDuty === false) return;
    const z = ZONES.find((zz) => zz.id === n.zone);
    if (this.moveTo(n, n.tx, n.ty, dt)) {
      n.tx = rand(z.x0 + 60, z.x1 - 60);
      n.ty = SIDEWALK_Y();
    }
    // Tran ap: an trom gan canh sat bo chay
    for (const t of this.of('thief')) {
      if (t.state === 'stalk' && dist(t, n) < 350) this.thiefFlee(t, 'police');
    }
    // Lan chiem long le duong: phat sap bay ngoai o quy hoach
    for (const st of this.g.stalls.values()) {
      if (st.plot || st.finedDay === this.g.day) continue;
      if (dist(st, n) < 220) this.g.fineStall(st);
    }
  }

  // ------------------------------------------------------------------ An trom
  updateThief(n, dt) {
    const g = this.g;
    if (n.state === 'stalk') {
      const t = g.sessions.get(n.target);
      if (!t || Date.now() > n.giveUpAt) return this.thiefFlee(n, 'timeout');
      if (this.nearestPolice(n, 350)) return this.thiefFlee(n, 'police');
      this.moveTo(n, t.x, t.y, dt);
      if (dist(n, t) < 30) {
        const amount = Math.min(Math.floor(t.p.cash * 0.25), 200000);
        if (amount > 0) {
          g.econ.pay(t.p, amount, 'cash', 'thief');
          t.dirty = true;
          g.toast(t, `🦹 Bạn bị móc túi mất ${g.vnd(amount)} tiền mặt! Hãy gửi tiền vào ATM.`, 'bad');
          g.news(`Có người bị móc túi tại ${zoneAt(t.x).name}. Cẩn thận tiền mặt!`);
        }
        this.thiefFlee(n, 'done');
      }
    } else if (this.moveTo(n, n.tx, n.ty, dt) || Date.now() > n.despawnAt) {
      this.remove(n);
    }
  }

  thiefFlee(n, why) {
    n.state = 'flee';
    n.speed = 220;
    n.tx = n.x < WORLD.width / 2 ? 0 : WORLD.width;
    n.ty = n.y;
    n.despawnAt = Date.now() + 15000;
    n.label = why === 'chased' ? 'Ăn trộm (bỏ chạy!)' : 'Ăn trộm';
  }

  chase(s, npcId) {
    const n = this.list.get(npcId);
    if (!n || n.kind !== 'thief' || n.state !== 'stalk') return this.g.toast(s, 'Không có gì để đuổi.');
    if (dist(n, s) > 160) return this.g.toast(s, 'Lại gần hơn để đuổi trộm!');
    this.thiefFlee(n, 'chased');
    s.p.social += 10;
    s.p.counters.thiefChased = (s.p.counters.thiefChased || 0) + 1;
    s.dirty = true;
    this.g.toast(s, '💪 Bạn đã đuổi được tên trộm! +10 Điểm Danh Vọng', 'good');
    const victim = this.g.sessions.get(n.target);
    if (victim && victim !== s) this.g.toast(victim, `${s.p.name} vừa đuổi tên trộm bám theo bạn!`, 'good');
  }

  // ------------------------------------------------------------------ Giang ho
  updateGang(n, dt) {
    const g = this.g;
    if (n.state === 'approach') {
      const st = g.stalls.get(n.target);
      if (!st) return this.gangLeave(n);
      if (this.moveTo(n, st.x - 45, st.y + 8, dt)) this.startExtortion(n, st);
    } else if (n.state === 'extort') {
      n.moving = false;
    } else if (this.moveTo(n, n.tx, n.ty, dt) || Date.now() > n.despawnAt) {
      this.remove(n);
    }
  }

  gangLeave(n) {
    n.state = 'leave';
    n.speed = 160;
    n.tx = n.x < WORLD.width / 2 ? 0 : WORLD.width;
    n.ty = n.y;
    n.despawnAt = Date.now() + 15000;
  }

  startExtortion(n, st) {
    const g = this.g;
    n.state = 'extort';
    const owner = g.sessionByName(st.owner);
    this.gangEvent = {
      npc: n.id, owner: st.owner, x: st.x, y: st.y,
      deadline: Date.now() + 25000, helpers: new Set(), police: null,
    };
    if (owner) {
      g.pushDialog(owner, {
        title: '😠 Giang hồ đòi tiền bảo kê!',
        text: `"Sạp này ở địa bàn tụi tao. Nộp ${g.vnd(ECON.protectionFee)} tiền bảo kê, không thì dẹp!"\nBạn có 25 giây để quyết định.`,
        options: [
          { label: `Nộp tiền (${g.vnd(ECON.protectionFee)})`, poi: 'gang', act: 'pay' },
          { label: `Gọi Cảnh sát (${g.vnd(ECON.callPoliceFee)} cước)`, poi: 'gang', act: 'police' },
          { label: 'Kêu gọi người chơi xung quanh giúp', poi: 'gang', act: 'help' },
        ],
      });
    }
  }

  gangAction(s, act) {
    const g = this.g;
    const ev = this.gangEvent;
    if (act === 'assist') {
      if (!ev) return g.toast(s, 'Sự việc đã kết thúc.');
      if (s.p.name === ev.owner) return;
      if (dist(s, ev) > 260) return g.toast(s, 'Bạn cần đứng gần sạp hàng để hỗ trợ!');
      ev.helpers.add(s.p.name);
      g.toast(s, 'Bạn đứng ra bênh vực chủ sạp!', 'good');
      if (ev.helpers.size >= 1) this.resolveGang('help');
      return;
    }
    if (!ev || ev.owner !== s.p.name) return g.toast(s, 'Không có giang hồ nào đang làm phiền bạn.');
    if (act === 'pay') {
      g.econ.pay(s.p, ECON.protectionFee, s.p.cash >= ECON.protectionFee ? 'cash' : 'bank', 'protection');
      s.dirty = true;
      this.resolveGang('paid');
    } else if (act === 'police') {
      g.econ.pay(s.p, ECON.callPoliceFee, s.p.cash >= ECON.callPoliceFee ? 'cash' : 'bank', 'call_police');
      s.dirty = true;
      let cop = null;
      let best = Infinity;
      for (const c of this.of('police')) {
        const d = dist(c, ev);
        if (d < best) { best = d; cop = c; }
      }
      if (!cop) return g.toast(s, 'Không liên lạc được cảnh sát!', 'bad');
      cop.state = 'dispatch';
      cop.speed = 280;
      ev.police = cop.id;
      ev.deadline = Math.max(ev.deadline, Date.now() + 12000);
      g.toast(s, `🚓 Đã báo Cảnh sát. Họ đang tới (${Math.round(best)}m)...`);
    } else if (act === 'help') {
      ev.deadline = Math.max(ev.deadline, Date.now() + 15000);
      let n = 0;
      for (const o of g.sessions.values()) {
        if (o === s || dist(o, ev) > 1200) continue;
        n++;
        g.pushDialog(o, {
          title: '🆘 Cần giúp đỡ!',
          text: `Giang hồ đang quấy sạp của ${s.p.name}. Chạy tới gần sạp và bấm hỗ trợ để đuổi chúng đi (+15 Danh Vọng).`,
          options: [{ label: 'Hỗ trợ ngay', poi: 'gang', act: 'assist' }],
        });
      }
      g.chatNear(s, `🆘 Ai giúp với! Giang hồ quấy sạp của tôi!`);
      g.toast(s, n ? `Đã kêu gọi ${n} người chơi gần đó.` : 'Không có ai ở gần... thử gọi cảnh sát!');
    }
  }

  resolveGang(how) {
    const g = this.g;
    const ev = this.gangEvent;
    if (!ev) return;
    this.gangEvent = null;
    const n = this.list.get(ev.npc);
    if (n) this.gangLeave(n);
    const owner = g.sessionByName(ev.owner);
    const op = owner?.p || g.db.data.players[ev.owner.toLowerCase()];
    const st = g.stalls.get(ev.owner);
    if (st) st.gangImmuneUntil = g.absMinute() + 360;
    if (how === 'paid') {
      if (owner) g.toast(owner, 'Giang hồ nhận tiền rồi bỏ đi.', 'info');
    } else if (how === 'police') {
      if (op) op.stats.reputation += 3;
      if (owner) g.toast(owner, '🚓 Cảnh sát đã tới, giang hồ bỏ chạy! +3 Uy tín', 'good');
      g.news(`Cảnh sát vừa giải tán nhóm giang hồ quấy rối sạp của ${ev.owner}.`);
    } else if (how === 'help') {
      if (op) op.stats.reputation += 2;
      for (const name of ev.helpers) {
        const h = g.sessionByName(name);
        if (!h) continue;
        h.p.social += 15;
        h.dirty = true;
        g.toast(h, '🤝 Bạn đã giúp đuổi giang hồ! +15 Danh Vọng', 'good');
      }
      if (owner) g.toast(owner, `Mọi người đã giúp bạn đuổi giang hồ! (${[...ev.helpers].join(', ')})`, 'good');
      g.news(`${[...ev.helpers].join(', ')} đã cùng nhau đuổi giang hồ khỏi sạp của ${ev.owner}. Tình làng nghĩa xóm!`);
    } else if (how === 'timeout' && op) {
      const lost = Math.min(Math.floor(op.cash * 0.4), 100000);
      if (lost > 0) g.econ.pay(op, lost, 'cash', 'gang_robbery');
      if (st) g.closeStall(st, 'Sạp bị giang hồ đập phá!');
      if (owner) g.toast(owner, `💥 Giang hồ đập sạp và lấy mất ${g.vnd(lost)}!`, 'bad');
    }
    if (owner) {
      owner.dirty = true;
      g.closeDialog(owner);
    }
    for (const c of this.of('police')) {
      if (c.state === 'dispatch') { c.state = 'patrol'; c.speed = 85; }
    }
  }

  // ------------------------------------------------------------------ Ve chai
  spawnScrap() {
    const inJunk = Math.random() < 0.75;
    this.add({
      kind: 'scrap', label: 'Ve chai', speed: 0,
      x: inJunk ? rand(5660, 6740) : rand(200, 5500),
      y: inJunk ? rand(800, 1150) : rand(820, 1150),
    });
  }

  pickScrap(s, npcId) {
    const g = this.g;
    const n = this.list.get(npcId);
    if (!n || n.kind !== 'scrap') return;
    if (dist(n, s) > 90) return g.toast(s, 'Lại gần hơn để nhặt.');
    if (s.p.stats.stamina < 3) return g.toast(s, 'Bạn quá mệt để nhặt ve chai.', 'bad');
    this.remove(n);
    s.p.stats.stamina -= 3;
    const rare = Math.random() < 0.3;
    g.econ.addItem(s.p, rare ? 'linh_kien' : 've_chai', 1);
    s.dirty = true;
    g.toast(s, rare ? 'Nhặt được ⚙️ Linh kiện cũ!' : 'Nhặt được 🥫 Ve chai', 'good');
    g.questProgress(s, 'scrap', 1);
  }

  // ------------------------------------------------------------------ moi phut trong game
  onMinute() {
    const g = this.g;
    const night = this.isNight();
    // Canh sat: ban dem chi con tuan tra o CBD (the gioi ngam hoat dong manh)
    for (const c of this.of('police')) {
      c.onDuty = !night || c.zone === 'cbd' || c.unit > 0;
    }
    if (this.of('scrap').length < 10 && Math.random() < 0.5) this.spawnScrap();

    // An trom
    if (this.of('thief').length < 2) {
      for (const s of g.sessions.values()) {
        const z = zoneAt(s.x);
        if (s.p.cash < 30000 || z.crime <= 0) continue;
        if (this.of('thief').some((t) => t.target === s.id)) continue;
        const afk = Date.now() - s.lastInput > 60000 ? 3 : 1;
        const p = 0.006 * z.crime * Math.min(4, s.p.cash / 50000) * afk * (night ? 2.5 : 1);
        if (Math.random() < p) {
          const side = Math.random() < 0.5 ? -1 : 1;
          this.add({
            kind: 'thief', label: 'Kẻ khả nghi', state: 'stalk', target: s.id, speed: 120,
            x: clampX(s.x + side * 650), y: s.y, giveUpAt: Date.now() + 90000,
          });
          if (g.hasPhone(s.p)) g.toast(s, '📱 Báo động trộm: có kẻ khả nghi đang bám theo bạn!', 'warn');
          break;
        }
      }
    }

    // Giang ho
    if (!this.gangEvent && this.of('gang').length === 0) {
      for (const st of g.stalls.values()) {
        if ((st.gangImmuneUntil || 0) > g.absMinute()) continue;
        const z = zoneAt(st.x);
        if (Math.random() < 0.004 * z.crime * (night ? 2 : 1) * (st.plot ? 1 : 1.5)) {
          this.add({
            kind: 'gang', label: 'Giang hồ', state: 'approach', target: st.owner, speed: 110,
            x: clampX(st.x + (Math.random() < 0.5 ? -700 : 700)), y: st.y,
          });
          break;
        }
      }
    }
  }

  snapshot(n) {
    return { id: n.id, k: n.kind, x: Math.round(n.x), y: Math.round(n.y), d: n.dir, m: n.moving ? 1 : 0, l: n.label };
  }
}
