import crypto from 'node:crypto';
import {
  CHAT, CLASSES, ECON, FORMAT, ITEMS, JOBS, POIS, QUEST_BONUS, QUESTS, SKINS, SLOTS, SPEED, TIME, WORLD, zoneAt,
} from '../shared/config.js';
import { Auction } from './auction.js';
import { DIALOGS, addStat } from './dialogs.js';
import { EconError, Economy } from './economy.js';
import { Cook } from './cook.js';
import { GM_ENABLED, Gm } from './gm.js';
import { Home, homeOf } from './home.js';
import { Mall } from './mall.js';
import { Market } from './market.js';
import { Jobs, jobInfo } from './jobs.js';
import { NpcSystem } from './npcs.js';

const AOI_CELL = 640;
const POI_RANGE = 170;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cleanText = (t, max) => String(t ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);

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
    this.seq = 1;
    this.tickN = 0;
    this.tokenIndex = new Map(Object.values(db.data.players).map((p) => [p.token, p]));
    this.npcs = new NpcSystem(this);
    this.auction = new Auction(this);
    this.jobs = new Jobs(this);
    this.home = new Home(this);
    this.cook = new Cook(this);
    this.mall = new Mall(this);
    this.market = new Market(this);
    this.gm = new Gm(this);
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
        case 'emote': return this.chatNear(s, cleanText(m.e, 8), true);
        case 'job_start': return this.jobs.start(s, String(m.job || ''));
        case 'job_end': return this.jobs.end(s, m);
        case 'job_act': return this.jobs.act(s, m);
        case 'inv_sort': return this.sortInv(s);
        case 'home': return this.home.handle(s, m);
        case 'cook': return this.cook.handle(s, m);
        case 'mall': return this.mall.handle(s, m);
        case 'market': return this.market.handle(s, m);
        case 'gm': return this.gm.handle(s, m);
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
      // Ban phim dien thoai co the go dau to hop (NFD) / chen ky tu an -> chuan hoa truoc khi kiem tra
      const name = String(m.name ?? '').normalize('NFC').replace(/[\p{Cc}\p{Cf}]/gu, '').replace(/\s+/g, ' ').trim();
      if (!/^[\p{L}\p{M}\p{N} _.-]{2,16}$/u.test(name)) {
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
    p.stats.hunger ??= 80;
    p.jobs ??= {};
    p.certs ??= {};
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
      stats: { stamina: 100, stress: 10, hunger: 100, charisma: 0, attendance: 0, kpi: 0, reputation: 0 },
      inv: [], equip: {}, buffs: [], cd: {}, daily: { day: this.day }, renting: false, jobs: {},
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
    p.daily.q ??= this.pickQuests(p);
  }

  // ================================================================ nhiem vu ngay (G7)
  pickQuests(p) {
    const pool = Object.entries(QUESTS).filter(([, q]) => (!q.cls || q.cls === p.cls) && (!q.rent || homeOf(p, this.day)) && (!q.cert || p.certs?.[q.cert]));
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 3).map(([id]) => ({ id, have: 0, done: false }));
  }

  questProgress(s, key, n = 1) {
    const p = s.p;
    this.ensureDaily(p);
    for (const q of p.daily.q) {
      const def = QUESTS[q.id];
      if (!def || q.done || def.key !== key) continue;
      q.have = Math.min(def.need, q.have + n);
      if (q.have < def.need) continue;
      q.done = true;
      this.econ.grant(p, def.reward, 'cash', `quest:${q.id}`);
      p.social += 2;
      this.toast(s, `📜 Hoàn thành nhiệm vụ "${def.name}" · +${this.vnd(def.reward)}, +2 Danh Vọng`, 'good');
    }
    if (!p.daily.qBonus && p.daily.q.every((q) => q.done)) {
      p.daily.qBonus = true;
      p.diamonds += QUEST_BONUS.diamonds;
      p.social += QUEST_BONUS.social;
      this.toast(s, `🎁 Xong cả 3 nhiệm vụ hôm nay! +${QUEST_BONUS.diamonds} 💎, +${QUEST_BONUS.social} Danh Vọng`, 'good');
    }
    s.dirty = true;
    this.db.markDirty();
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
    const c = CLASSES[p.cls];
    return {
      name: p.name, cls: p.cls, clsName: c.name, rank: p.rank, rankName: c.ranks[p.rank], skin: p.skin,
      cash: p.cash, bank: p.bank, social: p.social, diamonds: p.diamonds, data: p.data,
      stats: Object.fromEntries(Object.entries(p.stats).map(([k, v]) => [k, Math.round(v)])),
      statKey: c.statKey, statName: c.statName,
      calc: s.stats, inv: p.inv, equip: p.equip, title: p.title, titles: p.titles, renting: p.renting,
      buffs: p.buffs.map((b) => ({ name: b.name, left: b.until - this.absMinute() })),
      daily: p.daily, mail: p.mail.length,
      jobs: Object.fromEntries(Object.keys(JOBS).map((id) => [id, jobInfo(p, id)])),
      certs: p.certs || {}, cookbook: !!p.cookbook, gm: GM_ENABLED,
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
      // Di bo khong ton nang luong; chi con xe tu lai hao chut it (nang luong de danh cho di lam, nau an)
      if (veh) p.stats.stamina = Math.max(0, p.stats.stamina - d * 0.0025 * 0.15 * hot * (1 - s.stats.staminaSave / 100));
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
    if (s.job) this.jobs.onMove(s);
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
    if (m.ch !== 'global') {
      this.questProgress(s, 'chat', 1);
      return this.chatNear(s, text);
    }
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
    if (id.startsWith('scrap:')) return this.npcs.pickScrap(s, id.slice(6));
    if (id.startsWith('thief:')) return this.npcs.chase(s, id.slice(6));
    if (id === 'phone') {
      if (!this.hasPhone(s.p)) throw new EconError('Bạn chưa trang bị điện thoại');
      s.phoneApp = 'home';
      return this.pushDialog(s, { ...DIALOGS.phone.open(this, s), poi: 'phone' });
    }
    const poi = this.findPoi(id);
    if (!poi || poi.hidden) return;
    if (dist(poi, s) > POI_RANGE) throw new EconError(`Hãy lại gần ${poi.name} hơn`);
    if (poi.kind === 'mall') return this.mall.handle(s, { a: 'enter' });
    if (poi.kind === 'market') return this.market.handle(s, { a: 'enter' });
    const dlg = DIALOGS[poi.kind].open(this, s, poi);
    this.pushDialog(s, { poi: id, ...dlg });
  }

  act(s, m) {
    const poiId = String(m.poi || '');
    const act = String(m.act || '');
    const args = m.args && typeof m.args === 'object' ? m.args : {};
    const inputs = m.inputs && typeof m.inputs === 'object' ? m.inputs : {};
    s.lastInput = Date.now();

    let kind;
    if (poiId === 'phone') {
      if (!this.hasPhone(s.p)) throw new EconError('Bạn chưa trang bị điện thoại');
      kind = 'phone';
    } else {
      const poi = this.findPoi(poiId);
      if (!poi) return;
      const remoteOk = poi.kind === 'auction' && this.hasPhone(s.p);
      if (poi.hidden && !remoteOk) return;
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
      this.questProgress(s, 'eat', 1);
    } else if (def.type === 'book') {
      this.cook.learn(s);
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

  // Gom & xep tui theo loai (INVENTORY_V2 I3). Server sap xep -> client chi hien thi.
  sortInv(s) {
    const order = { food: 0, ingredient: 1, equip: 2, furn: 3, tool: 4, book: 5, material: 6, collectible: 7, data: 8 };
    const key = (it) => [order[ITEMS[it.id].type] ?? 9, ITEMS[it.id].slot || '', ITEMS[it.id].name];
    s.p.inv.sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      return ka[0] - kb[0] || ka[1].localeCompare(kb[1]) || ka[2].localeCompare(kb[2], 'vi');
    });
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

  // ================================================================ thoi gian
  onMinute() {
    this.minute++;
    if (this.minute >= 1440) {
      this.minute = 0;
      this.day++;
      this.onNewDay();
    }
    if (this.minute % 60 === 0) this.onHour(this.minute / 60);
    this.home.onMinute();
    const hot = this.weather === 'hot' ? 1.5 : 1;
    const h = Math.floor(this.minute / 60);
    const now = this.absMinute();
    for (const s of this.sessions.values()) {
      const p = s.p;
      this.ensureDaily(p);
      p.stats.stamina = Math.max(0, p.stats.stamina - 0.03 * hot);
      // No bung (G6): giam dan; doi la -> hao nang luong va tinh than
      const wasHungry = p.stats.hunger < 20;
      p.stats.hunger = Math.max(0, p.stats.hunger - 0.06);
      if (!wasHungry && p.stats.hunger < 20) this.toast(s, '🍚 Bạn đang đói bụng. Kiếm gì ăn đi!', 'warn');
      if (p.stats.hunger <= 0) {
        p.stats.stamina = Math.max(0, p.stats.stamina - 0.05);
        p.stats.stress = Math.min(100, p.stats.stress + 0.03);
      }
      const workHours = p.cls === 'vp' && h >= 8 && h < 18 ? 0.03 : 0;
      p.stats.stress = Math.min(100, p.stats.stress + 0.02 + workHours);
      const before = p.buffs.length;
      p.buffs = p.buffs.filter((b) => b.until > now);
      if (p.buffs.length !== before) this.toast(s, 'Một hiệu ứng tạm thời đã hết.');
      s.stats = this.computeStats(p);
      s.dirty = true;
    }
    this.npcs.onMinute();
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
          hot: '🔥 Nắng gắt 38°C! Thể lực hao nhanh hơn, ngủ không quạt khó hồi sức. Nhớ uống nước mát.',
          rain: '🌧️ Trời mưa to, đường trơn ướt. Nhớ mang dù.',
        }[next];
        this.news(msg);
        for (const s of this.sessions.values()) this.toast(s, msg);
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
      this.home.onNewDay(p); // het han thue chung cu
      // Chung cu: chi tien dien (tien thue tra truoc theo tuan)
      if (homeOf(p, this.day) === 'apartment') {
        const power = Math.min(p.bank, this.home.dailyPower(p));
        if (power > 0) this.econ.pay(p, power, 'bank', 'power');
      }
      if (p.renting) {
        // Tien tro + tien dien (G52) theo do dien dang dat trong phong
        const power = this.home.dailyPower(p);
        if (p.bank >= ECON.rentPerDay + power) {
          this.econ.pay(p, ECON.rentPerDay, 'bank', 'rent');
          if (power) this.econ.pay(p, power, 'bank', 'power');
        } else {
          p.renting = false;
          this.home.vacate(p);
          p.mail.push({ from: 'Chủ trọ', text: 'Tài khoản không đủ tiền trọ + tiền điện, phòng đã bị thu hồi. Đồ đạc đã trả về túi.', cash: 0 });
        }
      }
      // Khau hao trang bi dang mac
      for (const uid of Object.values(p.equip)) {
        const it = p.inv.find((i) => i.uid === uid);
        if (it && !it.id.startsWith('xe')) it.dur = Math.max(0, it.dur - 3);
      }
    }
    this.market.onNewDay();
    this.news(`📅 Ngày ${this.day} bắt đầu. Ngân hàng đã trả lãi tiền gửi.`);
  }

  // ================================================================ dong bo (AOI)
  tick(dt) {
    this.tickN++;
    this.npcs.update(dt);
    this.auction.tick();
    this.jobs.tick();

    // Luoi AOI theo truc x (ban do dang dai)
    const cells = new Map();
    const put = (x, kind, obj) => {
      const k = Math.floor(x / AOI_CELL);
      if (!cells.has(k)) cells.set(k, { p: [], n: [] });
      cells.get(k)[kind].push(obj);
    };
    for (const s of this.sessions.values()) {
      put(s.x, 'p', {
        id: s.id, n: s.p.name, x: Math.round(s.x), y: Math.round(s.y), d: s.dir, m: s.moving ? 1 : 0,
        sk: s.p.skin, c: s.p.cls, ti: s.p.title, v: s.stats.vehicle, a: s.stats.aura,
      });
    }
    for (const n of this.npcs.list.values()) if (this.npcs.visible(n)) put(n.x, 'n', this.npcs.snapshot(n));
    const sendSelf = this.tickN % 5 === 0;
    for (const s of this.sessions.values()) {
      const k = Math.floor(s.x / AOI_CELL);
      const snap = { t: 'snap', p: [], n: [] };
      for (let c = k - 2; c <= k + 2; c++) {
        const cell = cells.get(c);
        if (!cell) continue;
        snap.p.push(...cell.p);
        snap.n.push(...cell.n);
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
