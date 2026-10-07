// Nha o (GAMEPLAY_V2 G19–G21, G49–G52): phong tro / chung cu, sap xep noi that, ngu, xem TV, tien dien.
// p.home = { room: 'tro' | 'apartment', placed: [{ id, x, y, f }] } — do da dat (rut khoi tui); toa do theo anh nen 1024x572.
// Chi o 1 noi: p.renting (tro, tra theo ngay) hoac p.apartment = { owned, until } (chung cu). Chuyen nha mang theo noi that.
import { APARTMENT, FURN_WALL, HOME, ITEMS, POIS, ROOMS, SLEEP } from '../shared/config.js';
import { addStat } from './dialogs.js';
import { EconError } from './economy.js';

const DOOR = { tro: POIS.find((p) => p.id === 'tro'), apartment: POIS.find((p) => p.id === 'apartment') };

// Noi dang o: 'apartment' (da mua / con han thue), 'tro' (dang thue tro) hoac null
export function homeOf(p, day) {
  if (p.apartment && (p.apartment.owned || p.apartment.until >= day)) return 'apartment';
  return p.renting ? 'tro' : null;
}

export function homeDoor(room) {
  return DOOR[room];
}

export function ensureHome(p) {
  p.home ??= { room: 'tro', placed: [] };
  return p.home;
}

// Tong hop chi so phong tu do dang dat
export function roomStats(p) {
  const placed = p.home?.placed || [];
  let comfort = 0;
  let power = 0;
  let cool = 0;
  let sleep = 0;
  let relax = 0;
  let it = 0;
  for (const pl of placed) {
    const f = ITEMS[pl.id]?.furn;
    if (!f) continue;
    comfort += f.comfort;
    power += f.power;
    cool = Math.max(cool, f.cool || 0);
    sleep = Math.max(sleep, f.sleep || 0);
    relax = Math.max(relax, f.relax || 0);
    it = Math.max(it, f.it ?? -1);
  }
  return { comfort, power, cool, sleep, relax, it };
}

// So nang luong hoi moi gio game khi ngu
export function sleepRate(p, weather) {
  const st = roomStats(p);
  let r = SLEEP.rate * (st.sleep || SLEEP.noBed) * (1 + Math.min(st.comfort, 60) / 100);
  if (weather === 'hot' && st.cool < SLEEP.coolNeed) r *= SLEEP.hotNoCool;
  return r;
}

function validPos(room, id, x, y) {
  const r = ROOMS[room];
  const [y0, y1] = FURN_WALL.includes(ITEMS[id].furn.type) ? r.wall : r.floor;
  return Number.isFinite(x) && Number.isFinite(y) && x >= r.x[0] && x <= r.x[1] && y >= y0 && y <= y1;
}

export class Home {
  constructor(game) {
    this.g = game;
  }

  state(s, extra = {}) {
    const p = s.p;
    const home = ensureHome(p);
    const room = ROOMS[home.room];
    const st = roomStats(p);
    return {
      t: 'home', room: home.room, name: room.name, bg: room.bg, max: room.max, placed: home.placed, ...st,
      rate: Math.round(sleepRate(p, this.g.weather) * 10) / 10,
      sleep: s.sleep ? { until: s.sleep.until, now: this.g.absMinute() } : null, ...extra,
    };
  }

  push(s, extra) {
    s.dirty = true;
    this.g.db.markDirty();
    this.g.send(s, this.state(s, extra));
  }

  need(s) {
    if (!s.inHome || homeOf(s.p, this.g.day) !== ensureHome(s.p).room) throw new EconError('Bạn đang không ở trong phòng');
  }

  handle(s, m) {
    const a = String(m.a || '');
    if (a === 'enter') return this.enter(s, m.room === 'apartment' ? 'apartment' : 'tro');
    if (a === 'leave') return this.leave(s);
    this.need(s);
    if (a === 'place') return this.place(s, m);
    if (a === 'move') return this.move(s, m);
    if (a === 'store') return this.store(s, Number(m.i));
    if (a === 'sleep') return this.sleep(s, Number(m.hours));
    if (a === 'wake') return this.wake(s, 'Bạn đã dậy.');
    if (a === 'tv') return this.tv(s);
  }

  // Thue phong: phong co san nem, quat, bep gas mini
  furnishStarter(p) {
    const home = ensureHome(p);
    const got = home.starter === true ? 2 : home.starter || 0; // ban dau chi co nem + quat
    for (const [id, x, y] of HOME.starter.slice(got)) home.placed.push({ id, x, y, f: 0 });
    home.starter = HOME.starter.length;
  }

  // Tra phong: do dang dat ve lai tui
  vacate(p) {
    const home = ensureHome(p);
    for (const pl of home.placed.splice(0)) this.g.econ.addItem(p, pl.id, 1);
  }

  // Chuyen noi that sang phong moi: thua cho thi ve tui, vi tri ep vao trong phong moi
  moveIn(p, room) {
    const home = ensureHome(p);
    if (home.room === room) return;
    home.room = room;
    const r = ROOMS[room];
    for (const pl of home.placed.splice(r.max)) this.g.econ.addItem(p, pl.id, 1);
    for (const pl of home.placed) {
      const [y0, y1] = FURN_WALL.includes(ITEMS[pl.id].furn.type) ? r.wall : r.floor;
      pl.x = Math.max(r.x[0], Math.min(r.x[1], pl.x));
      pl.y = Math.max(y0, Math.min(y1, pl.y));
    }
  }

  enter(s, where) {
    const p = s.p;
    if (homeOf(p, this.g.day) !== where) throw new EconError(where === 'tro' ? 'Bạn chưa thuê phòng trọ' : 'Bạn chưa thuê / mua căn hộ');
    if (s.job) throw new EconError('Đang làm ca, chưa vào phòng được');
    const door = DOOR[where];
    if (Math.hypot(door.x - s.x, door.y - s.y) > HOME.enterRange) throw new EconError(`Hãy tới ${door.name}`);
    if (where === 'tro') this.furnishStarter(p); // nguoi da thue tu truoc khi co tinh nang nay
    this.moveIn(p, where);
    s.inHome = true;
    this.g.closeDialog(s);
    this.push(s);
  }

  leave(s) {
    if (s.sleep) this.wake(s, null);
    s.cook = null;
    s.inHome = false;
    this.g.send(s, { t: 'home_close' });
  }

  place(s, m) {
    const p = s.p;
    const id = String(m.id || '');
    const def = ITEMS[id];
    if (def?.type !== 'furn') throw new EconError('Không phải đồ nội thất');
    const home = ensureHome(p);
    if (home.placed.length >= ROOMS[home.room].max) throw new EconError('Phòng đã chật, cất bớt đồ trước');
    const x = Math.round(Number(m.x));
    const y = Math.round(Number(m.y));
    if (!validPos(home.room, id, x, y)) throw new EconError('Không đặt được ở chỗ đó');
    this.g.econ.removeItems(p, { [id]: 1 });
    home.placed.push({ id, x, y, f: m.f ? 1 : 0 });
    this.push(s, { sel: home.placed.length - 1 });
  }

  move(s, m) {
    const home = ensureHome(s.p);
    const pl = home.placed[Number(m.i)];
    if (!pl) return;
    const x = Math.round(Number(m.x));
    const y = Math.round(Number(m.y));
    if (!validPos(home.room, pl.id, x, y)) throw new EconError('Không đặt được ở chỗ đó');
    Object.assign(pl, { x, y, f: m.f ? 1 : 0 });
    this.push(s, { sel: Number(m.i) });
  }

  store(s, i) {
    const home = ensureHome(s.p);
    const [pl] = home.placed.splice(i, 1);
    if (!pl) return;
    this.g.econ.addItem(s.p, pl.id, 1);
    this.push(s);
  }

  sleep(s, hours) {
    if (!SLEEP.hours.includes(hours)) return;
    if (s.sleep) return;
    const st = roomStats(s.p);
    s.sleep = { until: this.g.absMinute() + hours * 60 };
    this.push(s);
    if (!st.sleep) this.g.toast(s, 'Không có giường — ngủ dưới sàn hồi rất chậm.', 'warn');
  }

  wake(s, msg) {
    if (!s.sleep) return;
    s.sleep = null;
    if (msg) this.g.toast(s, msg, 'good');
    if (s.inHome) this.push(s);
  }

  tv(s) {
    const p = s.p;
    const st = roomStats(p);
    if (!st.relax) throw new EconError('Phòng chưa có TV');
    if (s.sleep) return;
    const until = p.cd.tv || 0;
    const now = this.g.absMinute();
    if (until > now) throw new EconError(`Xem TV hoài mỏi mắt, đợi ${until - now} phút (giờ game) nữa.`);
    p.cd.tv = now + HOME.tvMinutes;
    addStat(p, 'stress', -st.relax);
    this.g.toast(s, `📺 Xem TV thư giãn: tinh thần +${st.relax}`, 'good');
    this.push(s);
  }

  // Moi phut game: nguoi dang ngu hoi nang luong + tinh than; het gio thi day
  onMinute() {
    const g = this.g;
    for (const s of g.sessions.values()) {
      if (!s.sleep) continue;
      const p = s.p;
      const st = roomStats(p);
      addStat(p, 'stamina', sleepRate(p, g.weather) / 60);
      addStat(p, 'stress', -(SLEEP.stress + st.comfort / 10) / 60);
      if (g.absMinute() >= s.sleep.until) this.wake(s, '⏰ Reng reng! Bạn đã ngủ dậy, tràn đầy năng lượng.');
    }
  }

  // Tien dien moi ngay theo do dien dang dat (G52)
  dailyPower(p) {
    return homeOf(p, this.g.day) ? roomStats(p).power : 0;
  }

  // ---------------------------------------------------------------- chung cu (G20)
  rentApartment(s) {
    const p = s.p;
    const a = p.apartment;
    if (a?.owned) throw new EconError('Căn hộ này của bạn rồi');
    this.g.econ.pay(p, APARTMENT.rent, 'bank', 'apartment_rent');
    const from = Math.max(this.g.day, a?.until ?? 0);
    p.apartment = { owned: false, until: from + APARTMENT.days };
    const moved = this.switchFromTro(p);
    return `🏢 Đã thuê căn hộ tới hết ngày ${p.apartment.until}.${moved}`;
  }

  buyApartment(s) {
    const p = s.p;
    if (p.apartment?.owned) throw new EconError('Căn hộ này của bạn rồi');
    this.g.econ.pay(p, APARTMENT.price, 'bank', 'apartment_buy');
    p.apartment = { owned: true, until: null };
    const moved = this.switchFromTro(p);
    this.g.news(`🏢 ${p.name} vừa tậu căn hộ Chung Cư Phố Thị!`);
    return `🏢 Chúc mừng! Căn hộ giờ là của bạn — chỉ còn tiền điện.${moved}`;
  }

  // Dang thue tro -> thoi thue, noi that chuyen sang can ho
  switchFromTro(p) {
    if (p.renting) p.renting = false;
    const had = ensureHome(p).placed.length;
    this.moveIn(p, 'apartment');
    return had ? ' Đồ đạc đã chuyển sang căn hộ.' : '';
  }

  leaveApartment(s) {
    const p = s.p;
    if (!p.apartment || p.apartment.owned) return;
    p.apartment = null;
    if (s.inHome) this.leave(s);
    this.vacate(p);
    return 'Đã trả căn hộ, đồ đạc về lại túi.';
  }

  // Ngay moi: het han thue chung cu -> tra phong, do ve tui
  onNewDay(p) {
    const a = p.apartment;
    if (!a || a.owned || a.until >= this.g.day) return;
    p.apartment = null;
    if (ensureHome(p).room === 'apartment') this.vacate(p);
    p.mail.push({ from: 'Ban quản lý chung cư', text: 'Hết hạn thuê căn hộ, phòng đã thu hồi. Đồ đạc đã trả về túi.', cash: 0 });
    const s = this.g.sessionByName(p.name);
    if (s?.inHome) this.leave(s);
  }
}
