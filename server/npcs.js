// NPC dong cua the gioi: Canh sat tuan tra, An trom, diem ve chai. (Giang ho doi bao ke sap via he da bo — G53)
import { WORLD, ZONES, zoneAt } from '../shared/config.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const rand = (a, b) => a + Math.random() * (b - a);
const clampX = (x) => Math.max(WORLD.walk.x0, Math.min(WORLD.walk.x1, x));
const SIDEWALK_Y = () => (Math.random() < 0.5 ? rand(470, 560) : rand(800, 1120));

let npcSeq = 1;

export class NpcSystem {
  constructor(game) {
    this.g = game;
    this.list = new Map();
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
    return n.kind !== 'police' || n.onDuty !== false;
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
        default: break;
      }
    }
    void g;
  }

  updatePolice(n, dt) {
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

  // ------------------------------------------------------------------ Ve chai
  spawnScrap() {
    const inJunk = Math.random() < 0.75;
    this.add({
      kind: 'scrap', label: 'Ve chai', speed: 0,
      x: inJunk ? rand(6100, 6740) : rand(200, 5500),
      y: inJunk ? rand(800, 1150) : rand(820, 1150),
    });
  }

  pickScrap(s, npcId) {
    const g = this.g;
    const n = this.list.get(npcId);
    if (!n || n.kind !== 'scrap') return;
    if (dist(n, s) > 90) return g.toast(s, 'Lại gần hơn để nhặt.');
    if (s.p.stats.stamina < 3) return g.toast(s, 'Bạn quá mệt để nhặt ve chai.', 'bad');
    const rare = Math.random() < 0.3;
    try {
      g.econ.assertRoom(s.p, [[rare ? 'linh_kien' : 've_chai', 1]]);
    } catch (e) {
      return g.toast(s, e.message, 'bad');
    }
    this.remove(n);
    s.p.stats.stamina -= 3;
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
  }

  snapshot(n) {
    return { id: n.id, k: n.kind, x: Math.round(n.x), y: Math.round(n.y), d: n.dir, m: n.moving ? 1 : 0, l: n.label };
  }
}
