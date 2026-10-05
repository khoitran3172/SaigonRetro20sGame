import crypto from 'node:crypto';
import {
  CHAT, CLASSES, ECON, FORMAT, ITEMS, PLOTS, POIS, RECIPES, SKINS, SLOTS, SPEED, TIME, WORLD, zoneAt,
} from '../shared/config.js';
import { Auction } from './auction.js';
import { DIALOGS, addStat } from './dialogs.js';
import { EconError, Economy, newUid } from './economy.js';
import { NpcSystem } from './npcs.js';

const AOI_CELL = 640;
const POI_RANGE = 170;
const STALL_RANGE = 180;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cleanText = (t, max) => String(t ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
const isRoad = (y) => y > WORLD.road[0] && y < WORLD.road[1];

const STARTER = {
  sv: { items: ['ao_thun', 'quan_jean', 'dep_lao', 'dien_thoai'], stack: {} },
  vp: { items: ['ao_somi', 'quan_jean', 'dien_thoai'], stack: { ca_phe: 1 } },
  tt: { items: ['non_la', 'dep_lao', 'dien_thoai'], stack: { phoi_banh: 4, thit_nguoi: 2, rau_thom: 2, tra_kho: 1, da_vien: 2 } },
};

export class Game {
  constructor(db) {
    this.db = db;
    this.econ = new Economy(db);
    const w = db.data.world;
    w.minute ??= TIME.startMinute;
    w.day ??= 1;
    w.weather ??= 'sunny';
    w.news ??= [];
    this.newsLog = w.news;
    this.sessions = new Map();
    this.stalls = new Map();
    this.seq = 1;
    this.tickN = 0;
    this.tokenIndex = new Map(Object.values(db.data.players).map((p) => [p.token, p]));
    this.npcs = new NpcSystem(this);
    this.auction = new Auction(this);
  }

  get minute() { return this.db.data.world.minute; }
  set minute(v) { this.db.data.world.minute = v; }
  get day() { return this.db.data.world.day; }
  set day(v) { this.db.data.world.day = v; }
  get weather() { return this.db.data.world.weather; }
  set weather(v) { this.db.data.world.weather = v; }
  absMinute() { return this.day * 1440 + this.minute; }
  vnd(n) { return FORMAT.vnd(n); }

  // ================================================================ ket noi
  connect(ws) {
    const s = {
      id: `p${this.seq++}`, ws, p: null, x: 0, y: 0, dir: 'down', moving: false,
      lastInput: Date.now(), lastMoveAt: Date.now(), lastGlobal: 0, msgWindow: Date.now(), msgCount: 0,
      dirty: true, stats: null,
    };
    ws.on('message', (raw) => this.onMessage(s, raw));
    ws.on('close', () => this.disconnect(s));
    return s;
  }

  send(s, msg) {
    if (s.ws.readyState === 1) s.ws.send(JSON.stringify(msg));
  }

  broadcast(msg) {
    const data = JSON.stringify(msg);
    for (const s of this.sessions.values()) if (s.ws.readyState === 1) s.ws.send(data);
  }

  toast(s, msg, kind = 'info') {
    this.send(s, { t: 'toast', msg, kind });
  }

  pushDialog(s, dlg) {
    this.send(s, { t: 'dialog', ...dlg });
  }

  closeDialog(s) {
    this.send(s, { t: 'dialog_close' });
  }

  news(text, led = false) {
    this.newsLog.push(`[${FORMAT.clock(this.minute)}] ${text}`);
    if (this.newsLog.length > 60) this.newsLog.splice(0, this.newsLog.length - 60);
    this.broadcast({ t: 'chat', ch: 'news', from: 'Bưu tá', text });
    if (led) this.broadcast({ t: 'led', from: 'Thành phố', text, system: true });
    this.db.markDirty();
  }

  sessionByName(name) {
    if (!name) return null;
    const key = name.toLowerCase();
    for (const s of this.sessions.values()) if (s.p.name.toLowerCase() === key) return s;
    return null;
  }

  hasPhone(p) {
    return !!p.equip.phone;
  }

  disconnect(s) {
    if (!s.p) return;
    const st = this.stalls.get(s.p.name);
    if (st) this.closeStall(st, null);
    s.p.x = s.x;
    s.p.y = s.y;
    this.sessions.delete(s.id);
    this.broadcast({ t: 'leave', id: s.id });
    this.db.markDirty();
  }

  onMessage(s, raw) {
    const now = Date.now();
    if (now - s.msgWindow > 1000) {
      s.msgWindow = now;
      s.msgCount = 0;
    }
    if (++s.msgCount > 40) return;
    let m;
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    if (!s.p && m.t !== 'hello') return;
    try {
      switch (m.t) {
        case 'hello': return this.hello(s, m);
        case 'move': return this.move(s, m);
        case 'chat': return this.chat(s, m);
        case 'led': return this.led(s, m);
        case 'poi': return this.openPoi(s, String(m.id || ''));
        case 'act': return this.act(s, m);
        case 'use': return this.useItem(s, m.uid);
        case 'equip': return this.equip(s, m.uid);
        case 'unequip': return this.unequip(s, m.slot);
        case 'drop': return this.drop(s, m.uid);
        case 'stall_open': return this.openStall(s);
        case 'stall_list': return this.listOnStall(s, m);
        case 'emote': return this.chatNear(s, cleanText(m.e, 8), true);
        default: return undefined;
      }
    } catch (e) {
      if (e instanceof EconError) this.toast(s, e.message, 'bad');
      else console.error(e);
    } finally {
      if (m.t !== 'move') s.dirty = true;
    }
  }

  // ================================================================ dang nhap
  hello(s, m) {
    if (s.p) return;
    let p = m.token ? this.tokenIndex.get(String(m.token)) : null;
    if (!p) {
      const name = cleanText(m.name, 16).replace(/\s+/g, ' ');
      if (!/^[\p{L}\p{N} _.-]{2,16}$/u.test(name)) {
        return this.send(s, { t: 'error', msg: 'Tên 2–16 ký tự (chữ, số, khoảng trắng).' });
      }
      if (this.db.data.players[name.toLowerCase()]) {
        return this.send(s, { t: 'error', msg: 'Tên này đã có người dùng. Chọn tên khác.' });
      }
      if (!CLASSES[m.cls] || !SKINS[m.skin]) return this.send(s, { t: 'error', msg: 'Lựa chọn không hợp lệ.' });
      p = this.newPlayer(name, m.cls, m.skin);
    }
    const old = this.sessionByName(p.name);
    if (old) {
      this.send(old, { t: 'kicked', msg: 'Tài khoản đăng nhập ở nơi khác.' });
      old.ws.close();
      this.disconnect(old);
    }
    s.p = p;
    s.x = clamp(p.x, WORLD.walk.x0, WORLD.walk.x1);
    s.y = clamp(p.y, WORLD.walk.y0, WORLD.walk.y1);
    this.ensureDaily(p);
    if (p.lastLoginDay !== this.day) {
      p.lastLoginDay = this.day;
      p.diamonds += ECON.dailyDiamonds;
    }
    s.stats = this.computeStats(p);
    this.sessions.set(s.id, s);
    this.send(s, {
      t: 'welcome', id: s.id, token: p.token, x: s.x, y: s.y, self: this.selfState(s),
      world: this.worldState(), news: this.newsLog.slice(-6),
    });
    this.broadcast({ t: 'chat', ch: 'system', text: `${p.name} (${CLASSES[p.cls].name}) đã vào thành phố.` });
  }

  newPlayer(name, cls, skin) {
    const c = CLASSES[cls];
    const p = {
      name, token: crypto.randomBytes(16).toString('hex'), cls, skin, rank: 0,
      x: cls === 'sv' ? 600 : cls === 'vp' ? 4800 : 2300, y: 620,
      cash: c.cash, bank: c.bank, social: 0, diamonds: 30, data: 30,
      stats: { stamina: 100, stress: 10, charisma: 0, attendance: 0, kpi: 0, reputation: 0 },
      inv: [], equip: {}, buffs: [], cd: {}, daily: { day: this.day }, renting: false,
      title: '', titles: [], lotto: [], mail: [], counters: {}, created: Date.now(), lastLoginDay: this.day,
    };
    const st = STARTER[cls];
    for (const id of st.items) {
      const [it] = this.econ.addItem(p, id, 1);
      p.equip[ITEMS[id].slot] = it.uid;
    }
    for (const [id, n] of Object.entries(st.stack)) this.econ.addItem(p, id, n);
    p.mail.push({ from: 'Bưu tá', text: `Chào mừng ${name} tới thành phố! Đi dạo, làm quen hàng xóm và nhớ gửi tiền vào ATM nhé.`, cash: 0 });
    this.db.data.players[name.toLowerCase()] = p;
    this.tokenIndex.set(p.token, p);
    this.econ.log('new_player', p, { cash: p.cash, bank: p.bank });
    return p;
  }

  ensureDaily(p) {
    if (p.daily.day !== this.day) p.daily = { day: this.day };
  }

  worldState() {
    return { minute: this.minute, day: this.day, weather: this.weather, online: this.sessions.size };
  }

  // ================================================================ chi so
  equipped(p, slot) {
    const uid = p.equip[slot];
    return uid ? p.inv.find((i) => i.uid === uid) : null;
  }

  computeStats(p) {
    let ch = p.stats.charisma || 0;
    let spd = 0;
    let save = 0;
    let veh = null;
    let aura = null;
    for (const [slot, uid] of Object.entries(p.equip)) {
      const it = p.inv.find((i) => i.uid === uid);
      if (!it) {
        delete p.equip[slot];
        continue;
      }
      const def = ITEMS[it.id];
      const mul = (1 + 0.1 * it.lvl) * (it.dur > 0 ? 1 : 0.5);
      ch += (def.st.charisma || 0) * mul;
      spd += (def.st.speed || 0) * mul;
      save += (def.st.staminaSave || 0) * mul;
      if (def.st.vehicle) veh = { id: it.id, mult: def.st.vehicle * (1 + 0.03 * it.lvl), dur: it.dur };
      if (it.lvl >= 5 && !aura) aura = 'gold';
      if (it.id === 'hao_quang') aura = 'neon';
    }
    for (const b of p.buffs) ch += b.st.charisma || 0;
    let speed = SPEED.walk * (1 + spd / 100);
    if (veh) {
      speed = SPEED.vehicleBase * veh.mult * (veh.dur > 0 ? 1 : 0.7);
      if (this.weather === 'rain') speed *= SPEED.rainVehicle;
    }
    if (p.stats.stamina < 10) speed *= SPEED.exhausted;
    return { charisma: Math.round(ch), speed: Math.round(speed), staminaSave: Math.min(60, save), vehicle: veh?.id || null, aura };
  }

  addBuff(p, id, name, st, minutes) {
    p.buffs = p.buffs.filter((b) => b.id !== id);
    p.buffs.push({ id, name, st, until: this.absMinute() + minutes });
  }

  selfState(s) {
    const p = s.p;
    const st = this.stalls.get(p.name);
    const c = CLASSES[p.cls];
    return {
      name: p.name, cls: p.cls, clsName: c.name, rank: p.rank, rankName: c.ranks[p.rank], skin: p.skin,
      cash: p.cash, bank: p.bank, social: p.social, diamonds: p.diamonds, data: p.data,
      stats: Object.fromEntries(Object.entries(p.stats).map(([k, v]) => [k, Math.round(v)])),
      statKey: c.statKey, statName: c.statName,
      calc: s.stats, inv: p.inv, equip: p.equip, title: p.title, titles: p.titles, renting: p.renting,
      buffs: p.buffs.map((b) => ({ name: b.name, left: b.until - this.absMinute() })),
      daily: p.daily, mail: p.mail.length,
      stall: st ? { x: st.x, y: st.y, legal: !!st.plot, listings: st.listings.map((l) => ({ lid: l.lid, id: l.stack.id, qty: l.stack.qty, price: l.price, lvl: l.stack.lvl })) } : null,
    };
  }

  // ================================================================ di chuyen
  move(s, m) {
    const x = Number(m.x);
    const y = Number(m.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const now = Date.now();
    const dt = Math.min(1, (now - s.lastMoveAt) / 1000);
    s.lastMoveAt = now;
    const nx = clamp(x, WORLD.walk.x0, WORLD.walk.x1);
    const ny = clamp(y, WORLD.walk.y0, WORLD.walk.y1);
    const d = Math.hypot(nx - s.x, ny - s.y);
    if (d > s.stats.speed * dt * 1.5 + 30) {
      this.send(s, { t: 'correct', x: s.x, y: s.y });
      return;
    }
    if (d > 0) {
      const p = s.p;
      const hot = this.weather === 'hot' ? 1.5 : 1;
      const veh = s.stats.vehicle;
      const drain = d * 0.0025 * hot * (1 - s.stats.staminaSave / 100) * (veh ? 0.15 : 1);
      p.stats.stamina = Math.max(0, p.stats.stamina - drain);
      if (veh) {
        const it = this.equipped(p, 'xe');
        if (it) it.dur = Math.max(0, it.dur - (d / 400) * (this.weather === 'rain' ? 2 : 1));
      }
      s.dirty = true;
    }
    s.x = nx;
    s.y = ny;
    s.dir = ['left', 'right', 'up', 'down'].includes(m.d) ? m.d : s.dir;
    s.moving = !!m.m;
    if (s.moving) s.lastInput = now;
  }

  // ================================================================ chat
  chatNear(s, text, emote = false) {
    if (!text) return;
    for (const o of this.sessions.values()) {
      const d = dist(o, s);
      if (d <= CHAT.nearRadius) this.send(o, { t: 'chat', ch: 'near', id: s.id, from: s.p.name, text, dist: Math.round(d), emote });
    }
  }

  chat(s, m) {
    const text = cleanText(m.text, CHAT.maxLen);
    if (!text) return;
    s.lastInput = Date.now();
    if (m.ch !== 'global') return this.chatNear(s, text);
    const p = s.p;
    if (!this.hasPhone(p)) throw new EconError('Cần trang bị Điện thoại để chat Thế giới');
    if (p.data <= 0) throw new EconError('Hết cước 4G! Mua gói cước ở Bưu điện hoặc qua app điện thoại.');
    const wait = s.lastGlobal + ECON.globalCooldownMs - Date.now();
    if (wait > 0) throw new EconError(`Chat thế giới hồi chiêu ${Math.ceil(wait / 1000)}s`);
    s.lastGlobal = Date.now();
    p.data -= 1;
    this.broadcast({ t: 'chat', ch: 'global', id: s.id, from: p.name, title: p.title, text });
  }

  led(s, m) {
    const text = cleanText(m.text, 80);
    if (!text) return;
    if (s.p.diamonds < ECON.ledCost) throw new EconError(`Loa LED cần ${ECON.ledCost} 💎 Kim Cương`);
    s.p.diamonds -= ECON.ledCost;
    this.econ.log('premium', s.p, { item: 'led', diamonds: ECON.ledCost });
    this.broadcast({ t: 'led', from: s.p.name, text });
  }

  // ================================================================ POI / hoi thoai
  findPoi(id) {
    return POIS.find((p) => p.id === id);
  }

  openPoi(s, id) {
    s.lastInput = Date.now();
    if (id.startsWith('stall:')) return this.openStallDialog(s, id.slice(6));
    if (id.startsWith('scrap:')) return this.npcs.pickScrap(s, id.slice(6));
    if (id.startsWith('thief:')) return this.npcs.chase(s, id.slice(6));
    if (id === 'phone') {
      if (!this.hasPhone(s.p)) throw new EconError('Bạn chưa trang bị điện thoại');
      return this.pushDialog(s, { ...DIALOGS.phone.open(this, s), poi: 'phone' });
    }
    const poi = this.findPoi(id);
    if (!poi) return;
    if (dist(poi, s) > POI_RANGE) throw new EconError(`Hãy lại gần ${poi.name} hơn`);
    const dlg = DIALOGS[poi.kind].open(this, s, poi);
    this.pushDialog(s, { poi: id, ...dlg });
  }

  act(s, m) {
    const poiId = String(m.poi || '');
    const act = String(m.act || '');
    const args = m.args && typeof m.args === 'object' ? m.args : {};
    const inputs = m.inputs && typeof m.inputs === 'object' ? m.inputs : {};
    s.lastInput = Date.now();
    if (poiId === 'gang') return this.npcs.gangAction(s, act);
    if (poiId.startsWith('stall:')) return this.stallAct(s, poiId.slice(6), act, args, inputs);

    let kind;
    if (poiId === 'phone') {
      if (!this.hasPhone(s.p)) throw new EconError('Bạn chưa trang bị điện thoại');
      kind = 'phone';
    } else {
      const poi = this.findPoi(poiId);
      if (!poi) return;
      const remoteOk = poi.kind === 'auction' && this.hasPhone(s.p);
      if (!remoteOk && dist(poi, s) > POI_RANGE) throw new EconError(`Hãy lại gần ${poi.name} hơn`);
      kind = poi.kind;
    }
    const handler = DIALOGS[kind].acts?.[act];
    let res;
    if (handler) {
      res = handler(this, s, args, inputs);
      if (typeof res === 'string') this.toast(s, res, 'good');
      s.stats = this.computeStats(s.p);
      this.db.markDirty();
    }
    if (res !== false) this.pushDialog(s, { poi: poiId, ...DIALOGS[kind].open(this, s, this.findPoi(poiId)) });
  }

  bankTransfer(s, to, amount, feeRate) {
    const target = this.db.data.players[cleanText(to, 16).toLowerCase()];
    if (!target) throw new EconError('Không tìm thấy người nhận');
    if (target === s.p) throw new EconError('Không thể tự chuyển cho mình');
    amount = Math.floor(amount);
    if (!(amount > 0)) throw new EconError('Số tiền không hợp lệ');
    const fee = Math.ceil(amount * feeRate);
    if (s.p.bank < amount + fee) throw new EconError('Số dư không đủ');
    s.p.bank -= amount + fee;
    target.bank += amount;
    this.econ.log('bank_transfer', s.p, { to: target.name, amount, fee });
    const ts = this.sessionByName(target.name);
    if (ts) {
      ts.dirty = true;
      this.toast(ts, `🏦 ${s.p.name} vừa chuyển khoản cho bạn ${this.vnd(amount)}`, 'good');
    }
    return `Đã chuyển ${this.vnd(amount)} cho ${target.name}${fee ? ` (phí ${this.vnd(fee)})` : ''}.`;
  }

  sendMail(s, inp) {
    const p = s.p;
    const target = this.db.data.players[cleanText(inp.to, 16).toLowerCase()];
    if (!target) throw new EconError('Không tìm thấy người nhận');
    if (target === p) throw new EconError('Không thể tự gửi cho mình');
    const cash = Math.floor(Number(inp.cash) || 0);
    if (cash < 0) throw new EconError('Số tiền không hợp lệ');
    if (p.cash < cash + ECON.mailFee) throw new EconError('Không đủ tiền mặt (gồm phí gửi)');
    if (target.mail.length >= 30) throw new EconError('Hộp thư người nhận đã đầy');
    const text = cleanText(inp.text, 100);
    // takeStack kiem tra hop le truoc khi thay doi -> neu loi thi chua co gi bi tru
    const stack = inp.uid ? this.econ.takeStack(p, String(inp.uid)) : null;
    p.cash -= cash + ECON.mailFee;
    target.mail.push({ from: p.name, text, cash, stack });
    this.econ.log('mail', p, { to: target.name, cash, fee: ECON.mailFee, item: stack?.id, qty: stack?.qty });
    const ts = this.sessionByName(target.name);
    if (ts) {
      ts.dirty = true;
      this.toast(ts, `📬 Bạn có thư mới từ ${p.name}. Ghé Bưu điện để nhận!`, 'info');
    }
    return `Đã gửi thư cho ${target.name}.`;
  }

  // ================================================================ vat pham
  useItem(s, uid) {
    const p = s.p;
    const st = this.econ.findStack(p, uid);
    if (!st) return;
    const def = ITEMS[st.id];
    if (def.type === 'food') {
      const bonus = def.hot && this.weather === 'hot' ? def.hot : 1;
      for (const [k, v] of Object.entries(def.eff)) addStat(p, k, v * (v > 0 ? bonus : 1));
      this.econ.removeItems(p, { [st.id]: 1 });
      this.toast(s, `Bạn dùng ${def.icon} ${def.name}${bonus > 1 ? ' — mát lạnh giữa trời nắng!' : ''}`, 'good');
    } else if (def.type === 'data') {
      this.econ.removeItems(p, { [st.id]: 1 });
      p.data += def.data;
      this.toast(s, `+${def.data} tin nhắn 4G`, 'good');
    } else if (def.type === 'equip') {
      return this.equip(s, uid);
    } else {
      throw new EconError('Vật phẩm này không dùng trực tiếp được');
    }
    s.stats = this.computeStats(p);
  }

  equip(s, uid) {
    const p = s.p;
    const st = this.econ.findStack(p, uid);
    if (!st || ITEMS[st.id].type !== 'equip') return;
    if (this.stalls.get(p.name)?.listings.some((l) => l.stack.uid === uid)) return;
    p.equip[ITEMS[st.id].slot] = uid;
    s.stats = this.computeStats(p);
    this.db.markDirty();
  }

  unequip(s, slot) {
    if (!SLOTS[slot]) return;
    delete s.p.equip[slot];
    s.stats = this.computeStats(s.p);
    this.db.markDirty();
  }

  drop(s, uid) {
    const st = this.econ.takeStack(s.p, String(uid));
    this.econ.log('drop', s.p, { item: st.id, qty: st.qty });
    this.toast(s, `Đã vứt ${ITEMS[st.id].name} ×${st.qty}`);
  }

  enhanceCost(it) {
    return {
      parts: 1 + Math.floor(it.lvl / 2),
      money: 5000 * (it.lvl + 1) * (it.id.startsWith('xe') ? 3 : 1),
      rate: Math.max(0.15, 0.9 - it.lvl * 0.08),
    };
  }

  enhance(s, uid) {
    const p = s.p;
    const it = this.econ.findStack(p, String(uid));
    if (!it || ITEMS[it.id].type !== 'equip') throw new EconError('Chọn trang bị để cường hóa');
    if (it.lvl >= 10) throw new EconError('Đã đạt cấp tối đa');
    const c = this.enhanceCost(it);
    if (this.econ.count(p, 'linh_kien') < c.parts) throw new EconError(`Cần ${c.parts} ⚙️ linh kiện (nhặt ở Ngoại ô)`);
    const wallet = p.cash >= c.money ? 'cash' : 'bank';
    if (p[wallet] < c.money) throw new EconError('Không đủ tiền');
    this.econ.removeItems(p, { linh_kien: c.parts });
    this.econ.pay(p, c.money, wallet, 'enhance');
    const name = ITEMS[it.id].name;
    if (Math.random() < c.rate) {
      it.lvl++;
      if (it.lvl >= 5) this.news(`✨ ${p.name} vừa cường hóa ${name} lên +${it.lvl}! Hào quang lấp lánh!`, it.lvl >= 7);
      return `Thành công! ${name} lên +${it.lvl}`;
    }
    it.lvl = Math.max(0, it.lvl - 1);
    it.dur = Math.max(0, it.dur - 10);
    return `Thất bại... ${name} giảm còn +${it.lvl} (đồ không bị vỡ).`;
  }

  // ================================================================ sap hang (P2P)
  openStall(s) {
    const p = s.p;
    if (this.stalls.has(p.name)) throw new EconError('Bạn đã có sạp đang mở');
    if (isRoad(s.y)) throw new EconError('Không thể bày sạp giữa lòng đường!');
    const taken = new Set([...this.stalls.values()].map((st) => st.plot));
    const plot = PLOTS.find((pl) => dist(pl, s) < 70 && !taken.has(pl.id));
    const pos = plot ? { x: plot.x, y: plot.y } : { x: Math.round(s.x), y: Math.round(s.y) };
    for (const st of this.stalls.values()) {
      if (dist(st, pos) < 90) throw new EconError('Quá sát sạp khác');
    }
    for (const poi of POIS) {
      if (dist(poi, pos) < 90) throw new EconError('Không bày sạp chắn lối vào cửa hàng');
    }
    if (plot) this.econ.pay(p, ECON.plotRent, 'cash', 'plot_rent');
    const st = {
      owner: p.name, ...pos, plot: plot?.id || null, listings: [], seq: 1, finedDay: null,
      umbrella: this.econ.count(p, 'du_che') > 0, sales: 0, revenue: 0,
    };
    this.stalls.set(p.name, st);
    this.toast(s, plot
      ? `Đã thuê ô quy hoạch (${this.vnd(ECON.plotRent)}). Hợp pháp, không sợ Cảnh sát!`
      : '⚠️ Bạn bày sạp ngoài ô quy hoạch (lấn chiếm lòng lề đường). Cẩn thận Cảnh sát phạt!', plot ? 'good' : 'warn');
    if (st.umbrella) this.toast(s, '⛱️ Đã bung dù che sạp — mưa cũng không sợ ế.');
  }

  closeStall(st, reason) {
    const owner = this.sessionByName(st.owner);
    const p = owner?.p || this.db.data.players[st.owner.toLowerCase()];
    for (const l of st.listings) this.econ.putStack(p, l.stack);
    this.stalls.delete(st.owner);
    this.db.markDirty();
    if (owner) {
      owner.dirty = true;
      if (reason) this.toast(owner, reason, 'bad');
      this.toast(owner, `Dọn sạp. Hôm nay bán ${st.sales} món, thu ${this.vnd(st.revenue)}.`);
    }
  }

  fineStall(st) {
    const owner = this.sessionByName(st.owner);
    const p = owner?.p || this.db.data.players[st.owner.toLowerCase()];
    st.finedDay = this.day;
    const fromCash = Math.min(p.cash, ECON.fineIllegalStall);
    const fromBank = Math.min(p.bank, ECON.fineIllegalStall - fromCash);
    p.cash -= fromCash;
    p.bank -= fromBank;
    this.econ.log('sink', p, { wallet: 'mixed', amount: fromCash + fromBank, reason: 'police_fine' });
    this.closeStall(st, `🚓 Cảnh sát phạt ${this.vnd(fromCash + fromBank)} vì lấn chiếm lòng lề đường và dẹp sạp!`);
    this.news(`Cảnh sát vừa xử phạt một sạp lấn chiếm vỉa hè tại ${zoneAt(st.x).name}.`);
  }

  listOnStall(s, m) {
    const st = this.stalls.get(s.p.name);
    if (!st) throw new EconError('Hãy mở sạp trước');
    if (dist(st, s) > 260) throw new EconError('Bạn đang ở quá xa sạp');
    if (st.listings.length >= 8) throw new EconError('Sạp tối đa 8 món');
    const price = Math.floor(Number(m.price));
    if (!(price >= 1000 && price <= 50_000_000)) throw new EconError('Giá từ 1.000đ đến 50.000.000đ');
    const stack = this.econ.takeStack(s.p, String(m.uid), m.qty);
    st.listings.push({ lid: st.seq++, stack, price });
    if (stack.id === 'du_che') st.umbrella = true;
    s.stats = this.computeStats(s.p);
    this.db.markDirty();
    this.toast(s, `Đã bày ${ITEMS[stack.id].name} ×${stack.qty} giá ${this.vnd(price)}/món`, 'good');
  }

  openStallDialog(s, owner) {
    const st = this.stalls.get(owner);
    if (!st) throw new EconError('Sạp đã dọn');
    if (dist(st, s) > STALL_RANGE) throw new EconError('Lại gần sạp hơn');
    const mine = owner === s.p.name;
    const options = [];
    for (const l of st.listings) {
      const d = ITEMS[l.stack.id];
      const label = `${d.icon} ${d.name}${l.stack.lvl ? ` +${l.stack.lvl}` : ''} ×${l.stack.qty} — ${this.vnd(l.price)}/món`;
      if (mine) options.push({ label: `Thu về: ${label}`, act: 'unlist', args: { lid: l.lid } });
      else options.push({ label, act: 'buy', args: { lid: l.lid }, inputs: [{ name: 'qty', type: 'number', value: 1, min: 1, max: l.stack.qty, w: 60 }] });
    }
    if (mine) {
      if (s.p.cls === 'tt') {
        for (const [id, r] of Object.entries(RECIPES)) {
          const need = Object.entries(r.in).map(([k, n]) => `${ITEMS[k].icon}${n}`).join(' ');
          options.push({ label: `🍳 ${r.name} (${need})`, act: 'cook', args: { id } });
        }
      }
      options.push({ label: '🧹 Dọn sạp', act: 'close' });
    }
    this.pushDialog(s, {
      poi: `stall:${owner}`,
      title: `🧺 Sạp của ${owner}${st.plot ? '' : ' ⚠️ (lấn chiếm)'}`,
      text: mine
        ? `Mở Túi đồ → "Bày bán" để đưa hàng lên sạp. Khách NPC sẽ ghé mua đồ ăn/uống nếu giá hợp lý (≤160% giá gốc).\nĐã bán: ${st.sales} món · Doanh thu: ${this.vnd(st.revenue)} · Thuế sạp ${ECON.stallTax * 100}%`
        : (st.listings.length ? 'Trả bằng tiền mặt.' : 'Sạp chưa bày hàng.'),
      options,
    });
  }

  stallAct(s, owner, act, args, inputs) {
    const st = this.stalls.get(owner);
    if (!st) throw new EconError('Sạp đã dọn');
    if (dist(st, s) > STALL_RANGE) throw new EconError('Lại gần sạp hơn');
    const mine = owner === s.p.name;
    const p = s.p;
    if (act === 'buy' && !mine) {
      const l = st.listings.find((x) => x.lid === Number(args.lid));
      if (!l) throw new EconError('Món này vừa hết');
      const qty = Math.floor(Number(inputs.qty) || 1);
      if (!(qty >= 1 && qty <= l.stack.qty)) throw new EconError('Số lượng không hợp lệ');
      const seller = this.sessionByName(owner)?.p || this.db.data.players[owner.toLowerCase()];
      const { net } = this.econ.transfer(p, 'cash', seller, 'cash', l.price * qty, `stall:${l.stack.id}`, ECON.stallTax);
      if (qty === l.stack.qty) {
        st.listings.splice(st.listings.indexOf(l), 1);
        this.econ.putStack(p, l.stack);
      } else {
        l.stack.qty -= qty;
        this.econ.putStack(p, { ...l.stack, uid: newUid(), qty });
      }
      st.sales += qty;
      st.revenue += net;
      if (seller.cls === 'tt') seller.stats.reputation += 0.5 * qty;
      this.toast(s, `Đã mua ${ITEMS[l.stack.id].name} ×${qty}`, 'good');
      const os = this.sessionByName(owner);
      if (os) {
        os.dirty = true;
        this.toast(os, `💰 ${p.name} mua ${ITEMS[l.stack.id].name} ×${qty} (+${this.vnd(net)})`, 'good');
      }
      this.fx(st, `+${this.vnd(net)}`);
    } else if (act === 'unlist' && mine) {
      const l = st.listings.find((x) => x.lid === Number(args.lid));
      if (!l) return;
      st.listings.splice(st.listings.indexOf(l), 1);
      this.econ.putStack(p, l.stack);
    } else if (act === 'cook' && mine) {
      const r = RECIPES[args.id];
      if (!r) return;
      if (p.cls !== 'tt') throw new EconError('Chỉ Tiểu thương mới chế biến được');
      if (p.stats.stamina < r.stamina) throw new EconError('Bạn quá mệt để nấu');
      this.econ.removeItems(p, r.in);
      for (const [id, n] of Object.entries(r.out)) this.econ.addItem(p, id, n);
      p.stats.stamina -= r.stamina;
      this.toast(s, `Đã chế biến: ${r.name}`, 'good');
    } else if (act === 'close' && mine) {
      this.closeStall(st, null);
      this.closeDialog(s);
      return;
    }
    this.db.markDirty();
    this.openStallDialog(s, owner);
  }

  fx(at, text) {
    for (const o of this.sessions.values()) if (dist(o, at) < 1400) this.send(o, { t: 'fx', x: at.x, y: at.y, text });
  }

  // Khach NPC ghe sap: nguon tien vao nen kinh te (ban dich vu cho NPC)
  npcCustomers() {
    const h = Math.floor(this.minute / 60);
    for (const st of this.stalls.values()) {
      if (!st.listings.length) continue;
      const z = zoneAt(st.x);
      const zf = { daihoc: 1.2, phoam: 1.5, cbd: 1.0, ngoaio: 0.5 }[z.id];
      const nightMarket = z.id === 'phoam' && h >= 18 && h < 23 ? 1.6 : 1;
      const late = h >= 1 && h < 6 ? 0.2 : 1;
      const rain = this.weather === 'rain' && !st.umbrella ? 0.2 : 1;
      const owner = this.sessionByName(st.owner);
      if (!owner) continue;
      const rep = Math.min(200, owner.p.stats.reputation);
      const chance = 0.06 * zf * nightMarket * late * rain * (1 + rep / 100) * (st.plot ? 1 : 1.2);
      if (Math.random() >= chance) continue;
      const foods = st.listings.filter((l) => ITEMS[l.stack.id].type === 'food' && l.price <= ITEMS[l.stack.id].base * 1.6);
      if (!foods.length) continue;
      const weighted = foods.flatMap((l) => (this.weather === 'hot' && ITEMS[l.stack.id].hot ? [l, l, l] : [l]));
      const l = weighted[Math.floor(Math.random() * weighted.length)];
      const tax = Math.round(l.price * ECON.stallTax);
      const net = l.price - tax;
      owner.p.cash += net;
      if (--l.stack.qty <= 0) st.listings.splice(st.listings.indexOf(l), 1);
      if (owner.p.cls === 'tt') owner.p.stats.reputation += 0.5;
      st.sales++;
      st.revenue += net;
      this.econ.log('source', owner.p, { wallet: 'cash', amount: net, tax, reason: 'npc_customer', item: l.stack.id });
      owner.dirty = true;
      this.toast(owner, `🧍 Khách vãng lai mua 1 ${ITEMS[l.stack.id].name} (+${this.vnd(net)})`, 'good');
      this.fx(st, `+${this.vnd(net)}`);
    }
  }

  // ================================================================ thoi gian
  onMinute() {
    this.minute++;
    if (this.minute >= 1440) {
      this.minute = 0;
      this.day++;
      this.onNewDay();
    }
    if (this.minute % 60 === 0) this.onHour(this.minute / 60);
    const hot = this.weather === 'hot' ? 1.5 : 1;
    const h = Math.floor(this.minute / 60);
    const now = this.absMinute();
    for (const s of this.sessions.values()) {
      const p = s.p;
      this.ensureDaily(p);
      p.stats.stamina = Math.max(0, p.stats.stamina - 0.03 * hot);
      const workHours = p.cls === 'vp' && h >= 8 && h < 18 ? 0.03 : 0;
      p.stats.stress = Math.min(100, p.stats.stress + 0.02 + workHours);
      const before = p.buffs.length;
      p.buffs = p.buffs.filter((b) => b.until > now);
      if (p.buffs.length !== before) this.toast(s, 'Một hiệu ứng tạm thời đã hết.');
      s.stats = this.computeStats(p);
      s.dirty = true;
    }
    this.npcs.onMinute();
    this.npcCustomers();
    this.broadcast({ t: 'time', ...this.worldState() });
  }

  onHour(h) {
    if (h % 3 === 0) {
      const r = Math.random();
      const next = r < 0.5 ? 'sunny' : r < 0.75 ? 'hot' : 'rain';
      if (next !== this.weather) {
        this.weather = next;
        const msg = {
          sunny: '🌤️ Trời quang mây tạnh, thời tiết dễ chịu.',
          hot: '🔥 Nắng gắt 38°C! Thể lực hao nhanh, nước mía trà đá đắt hàng.',
          rain: '🌧️ Mưa to, đường ngập! Xe máy chậm 50%, sạp không có dù che sẽ ế khách.',
        }[next];
        this.news(msg, true);
        for (const s of this.sessions.values()) s.stats = this.computeStats(s.p);
      }
    }
    if (h === 7) this.news('☀️ Chào buổi sáng! Giảng đường điểm danh 07:00–11:00 · TechCorp chấm công 07:30–09:00.');
    if (h === 17) this.paySalaries();
    if (h === 18) this.drawLottery();
    if (h === 19) this.news('🌃 Phố lên đèn, chợ đêm nhộn nhịp. Trộm cắp và giang hồ hoạt động mạnh hơn — cẩn thận tiền mặt!');
    if (h === 23) this.news('🏍️ 23:00 — Dân chơi tụ tập đua xe đêm ở Ngoại ô (sắp ra mắt).');
    this.auction.onHour(h);
  }

  paySalaries() {
    for (const p of Object.values(this.db.data.players)) {
      if (p.cls !== 'vp' || p.daily.day !== this.day || !p.daily.checkin) continue;
      const salary = Math.round(150000 * (1 + 0.6 * p.rank) * (p.daily.late ? 0.8 : 1) * (1 + Math.min(p.daily.worked || 0, 4) * 0.1));
      this.econ.grant(p, salary, 'bank', 'salary');
      const s = this.sessionByName(p.name);
      if (s) this.toast(s, `💼 Lương hôm nay ${this.vnd(salary)} đã về tài khoản!`, 'good');
    }
  }

  drawLottery() {
    const win = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const winners = [];
    for (const p of Object.values(this.db.data.players)) {
      let total = 0;
      for (const t of p.lotto.filter((x) => x.day === this.day)) {
        if (t.num === win) total += 2000000;
        else if (t.num.slice(1) === win.slice(1)) total += 100000;
        else if (t.num[2] === win[2]) total += 15000;
      }
      p.lotto = p.lotto.filter((x) => x.day === this.day);
      if (!total) continue;
      this.econ.grant(p, total, 'bank', 'lottery_prize');
      winners.push(`${p.name} (${this.vnd(total)})`);
      const s = this.sessionByName(p.name);
      if (s) this.toast(s, `🎉 Bạn trúng vé số ${this.vnd(total)}! Tiền đã vào tài khoản.`, 'good');
    }
    this.news(`🎫 Kết quả xổ số hôm nay: ${win}. ${winners.length ? `Trúng thưởng: ${winners.join(', ')}` : 'Chưa ai trúng.'}`, true);
  }

  onNewDay() {
    for (const p of Object.values(this.db.data.players)) {
      this.ensureDaily(p);
      this.econ.dailyInterest(p);
      if (p.renting) {
        if (p.bank >= ECON.rentPerDay) this.econ.pay(p, ECON.rentPerDay, 'bank', 'rent');
        else {
          p.renting = false;
          p.mail.push({ from: 'Chủ trọ', text: 'Tài khoản không đủ tiền trọ, phòng đã bị thu hồi.', cash: 0 });
        }
      }
      // Khau hao trang bi dang mac
      for (const uid of Object.values(p.equip)) {
        const it = p.inv.find((i) => i.uid === uid);
        if (it && !it.id.startsWith('xe')) it.dur = Math.max(0, it.dur - 3);
      }
    }
    this.news(`📅 Ngày ${this.day} bắt đầu. Ngân hàng đã trả lãi tiền gửi.`);
  }

  // ================================================================ dong bo (AOI)
  tick(dt) {
    this.tickN++;
    this.npcs.update(dt);
    this.auction.tick();

    // Luoi AOI theo truc x (ban do dang dai)
    const cells = new Map();
    const put = (x, kind, obj) => {
      const k = Math.floor(x / AOI_CELL);
      if (!cells.has(k)) cells.set(k, { p: [], n: [], st: [] });
      cells.get(k)[kind].push(obj);
    };
    for (const s of this.sessions.values()) {
      put(s.x, 'p', {
        id: s.id, n: s.p.name, x: Math.round(s.x), y: Math.round(s.y), d: s.dir, m: s.moving ? 1 : 0,
        sk: s.p.skin, c: s.p.cls, ti: s.p.title, v: s.stats.vehicle, a: s.stats.aura,
      });
    }
    for (const n of this.npcs.list.values()) if (this.npcs.visible(n)) put(n.x, 'n', this.npcs.snapshot(n));
    for (const st of this.stalls.values()) {
      put(st.x, 'st', { o: st.owner, x: st.x, y: st.y, c: st.listings.length, lg: st.plot ? 1 : 0, u: st.umbrella ? 1 : 0 });
    }
    const sendSelf = this.tickN % 5 === 0;
    for (const s of this.sessions.values()) {
      const k = Math.floor(s.x / AOI_CELL);
      const snap = { t: 'snap', p: [], n: [], st: [] };
      for (let c = k - 2; c <= k + 2; c++) {
        const cell = cells.get(c);
        if (!cell) continue;
        snap.p.push(...cell.p);
        snap.n.push(...cell.n);
        snap.st.push(...cell.st);
      }
      this.send(s, snap);
      if (sendSelf && s.dirty) {
        s.dirty = false;
        this.send(s, { t: 'self', self: this.selfState(s) });
      }
    }
  }

  saveAll() {
    for (const s of this.sessions.values()) {
      s.p.x = s.x;
      s.p.y = s.y;
    }
    this.db.markDirty();
    return this.db.save();
  }
}
