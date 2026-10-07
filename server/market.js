// Cho Sap Hang Hoa (GAMEPLAY_V2 G24, G55–G57): moi nguoi choi thue 1 sap theo tuan trong toa Cho,
// bay hang tu tui, tu dat gia / sua gia / thu hoi. Sap ban ca khi chu offline: tien (tru thue) vao ngan hang chu sap.
// Du lieu: db.data.world.market = { stalls: { [ten thuong]: stall }, prices: { [id]: [gia gan day] } }
// (nam trong world de PostgreSQL luu cung — pgdb chi ghi players + world)
import { ITEMS, MARKET, POIS, RECIPES } from '../shared/config.js';
import { EconError, newUid } from './economy.js';

const POI = POIS.find((p) => p.id === 'market');
const RANGE = 200;
const walletFor = (price) => (price >= 100000 ? 'bank' : 'cash');

// Khoang gia hop le cho 1 mon (G57)
export function priceRange(id) {
  const base = ITEMS[id]?.base || 0;
  if (!base) return MARKET.free;
  return [Math.max(1000, Math.round(base * MARKET.price[0])), Math.round(base * MARKET.price[1])];
}

export class Market {
  constructor(game) {
    this.g = game;
    const w = game.db.data.world;
    w.market ??= { stalls: {}, prices: {} };
    this.data = w.market;
  }

  get stalls() {
    return this.data.stalls;
  }

  near(s) {
    if (Math.hypot(POI.x - s.x, POI.y - s.y) > RANGE) throw new EconError('Hãy vào Chợ Sạp Hàng Hóa');
  }

  playerOf(name) {
    return this.g.sessionByName(name)?.p || this.g.db.data.players[name.toLowerCase()];
  }

  // Trang thai gui client: tat ca sap (de xem / mua) + sap cua minh + gia trung binh gan day
  state(s, extra = {}) {
    const avg = {};
    for (const [id, arr] of Object.entries(this.data.prices)) {
      if (arr.length) avg[id] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }
    const stalls = Object.values(this.stalls).map((st) => ({
      owner: st.owner, size: st.size, spot: st.spot, until: st.until, sold: st.sold, earned: st.earned,
      listings: st.listings.map((l) => ({ lid: l.lid, id: l.stack.id, qty: l.stack.qty, lvl: l.stack.lvl || 0, price: l.price })),
    }));
    return { t: 'market', day: this.g.day, stalls, avg, me: s.p.name, inv: s.p.inv, equip: s.p.equip, ...extra };
  }

  push(s, extra) {
    s.dirty = true;
    this.g.db.markDirty();
    this.g.send(s, this.state(s, extra));
  }

  handle(s, m) {
    const a = String(m.a || '');
    // Xem cho tu xa qua dien thoai (chi xem)
    if (a === 'view') {
      if (!this.g.hasPhone(s.p)) throw new EconError('Bạn chưa trang bị điện thoại');
      return this.g.send(s, this.state(s, { remote: true }));
    }
    this.near(s);
    if (a === 'enter') return this.push(s);
    if (a === 'rent') return this.rent(s, Number(m.size));
    if (a === 'list') return this.list(s, String(m.uid || ''), Number(m.qty), Number(m.price));
    if (a === 'price') return this.setPrice(s, Number(m.lid), Number(m.price));
    if (a === 'recall') return this.recall(s, Number(m.lid));
    if (a === 'buy') return this.buy(s, String(m.owner || ''), Number(m.lid), Number(m.qty));
    if (a === 'craft') return this.craft(s, String(m.id || ''));
  }

  // Thue moi / gia han 7 ngay / doi co sap
  rent(s, size) {
    const sz = MARKET.sizes[size];
    if (!sz) return;
    const p = s.p;
    const st = this.stalls[p.name];
    if (st && st.listings.length > sz.slots) throw new EconError(`Thu bớt hàng về còn ${sz.slots} món rồi mới đổi sạp nhỏ hơn`);
    let spot = st?.spot;
    if (spot == null) {
      const taken = new Set(Object.values(this.stalls).map((x) => x.spot));
      spot = MARKET.spots.findIndex((_, i) => !taken.has(i));
      if (spot < 0) throw new EconError('Chợ đã hết sạp trống, quay lại sau nhé');
    }
    this.g.econ.pay(p, sz.rent, 'bank', 'market_rent');
    const from = Math.max(this.g.day, st && st.size === size ? st.until : this.g.day);
    this.stalls[p.name] = {
      owner: p.name, spot, size, until: from + MARKET.days, listings: st?.listings || [], seq: st?.seq || 1,
      sold: st?.sold || 0, earned: st?.earned || 0,
    };
    this.g.toast(s, `🧺 Đã thuê ${sz.name} tới hết ngày ${from + MARKET.days} (${this.g.vnd(sz.rent)}).`, 'good');
    this.push(s);
  }

  mine(s) {
    const st = this.stalls[s.p.name];
    if (!st) throw new EconError('Bạn chưa thuê sạp');
    return st;
  }

  checkPrice(id, price) {
    const [lo, hi] = priceRange(id);
    if (!(price >= lo && price <= hi)) throw new EconError(`Giá ${ITEMS[id].name} phải từ ${this.g.vnd(lo)} đến ${this.g.vnd(hi)}`);
  }

  list(s, uid, qty, price) {
    const p = s.p;
    const st = this.mine(s);
    if (st.listings.length >= MARKET.sizes[st.size].slots) throw new EconError('Sạp đã đầy ô — thuê sạp lớn hơn hoặc thu bớt');
    if (Object.values(p.equip).includes(uid)) throw new EconError('Tháo đồ ra trước khi bày bán');
    const it = this.g.econ.findStack(p, uid);
    if (!it) return;
    price = Math.floor(price);
    this.checkPrice(it.id, price);
    const stack = this.g.econ.takeStack(p, uid, Number.isFinite(qty) ? qty : undefined);
    st.listings.push({ lid: st.seq++, stack, price });
    s.stats = this.g.computeStats(p);
    this.g.toast(s, `Đã bày ${ITEMS[stack.id].name} ×${stack.qty} giá ${this.g.vnd(price)}/món`, 'good');
    this.push(s);
  }

  setPrice(s, lid, price) {
    const l = this.mine(s).listings.find((x) => x.lid === lid);
    if (!l) return;
    price = Math.floor(price);
    this.checkPrice(l.stack.id, price);
    l.price = price;
    this.push(s);
  }

  recall(s, lid) {
    const st = this.mine(s);
    const i = st.listings.findIndex((x) => x.lid === lid);
    if (i < 0) return;
    const [l] = st.listings.splice(i, 1);
    this.g.econ.putStack(s.p, l.stack);
    this.push(s);
  }

  buy(s, owner, lid, qty) {
    const g = this.g;
    const st = this.stalls[owner];
    if (!st) throw new EconError('Sạp này đã dẹp');
    if (owner === s.p.name) throw new EconError('Không tự mua hàng của mình');
    const l = st.listings.find((x) => x.lid === lid);
    if (!l) throw new EconError('Món này vừa bán hết');
    qty = Math.floor(qty) || 1;
    if (!(qty >= 1 && qty <= l.stack.qty)) throw new EconError('Số lượng không hợp lệ');
    const seller = this.playerOf(owner);
    const total = l.price * qty;
    // Nguoi mua tra tien mat (mon re) hoac the; chu sap nhan vao ngan hang (tru thue)
    const { net } = g.econ.transfer(s.p, walletFor(total), seller, 'bank', total, `market:${l.stack.id}`, MARKET.tax);
    if (qty === l.stack.qty) {
      st.listings.splice(st.listings.indexOf(l), 1);
      g.econ.putStack(s.p, l.stack);
    } else {
      l.stack.qty -= qty;
      g.econ.putStack(s.p, { ...l.stack, uid: newUid(), qty });
    }
    st.sold += qty;
    st.earned += net;
    if (seller.cls === 'tt') seller.stats.reputation += 0.5 * qty;
    const hist = (this.data.prices[l.stack.id] ??= []);
    hist.push(l.price);
    if (hist.length > MARKET.history) hist.shift();
    s.stats = g.computeStats(s.p);
    g.toast(s, `Đã mua ${ITEMS[l.stack.id].name} ×${qty} (${g.vnd(total)})`, 'good');
    const os = g.sessionByName(owner);
    const msg = `💰 ${s.p.name} mua ${ITEMS[l.stack.id].name} ×${qty} ở sạp của bạn: +${g.vnd(net)} vào tài khoản`;
    if (os) {
      os.dirty = true;
      g.toast(os, msg, 'good');
    } else if (seller.mail.length < 30) seller.mail.push({ from: 'Chợ Sạp Hàng Hóa', text: msg, cash: 0 });
    this.push(s);
  }

  // Che bien banh mi / tra da / nuoc mia de bay ban (truoc day lam o sap via he)
  craft(s, id) {
    const r = RECIPES[id];
    if (!r) return;
    const p = s.p;
    this.mine(s);
    if (p.stats.stamina < r.stamina) throw new EconError('Bạn quá mệt để chế biến');
    this.g.econ.assertRoom(p, r.out, r.in);
    this.g.econ.removeItems(p, r.in);
    for (const [out, n] of Object.entries(r.out)) this.g.econ.addItem(p, out, n);
    p.stats.stamina -= r.stamina;
    this.g.toast(s, `Đã chế biến: ${r.name}`, 'good');
    this.push(s);
  }

  // Het han thue: hang tra ve tui chu sap
  onNewDay() {
    const g = this.g;
    for (const [name, st] of Object.entries(this.stalls)) {
      if (st.until >= g.day) continue;
      const p = this.playerOf(name);
      if (p) {
        for (const l of st.listings) g.econ.putStack(p, l.stack);
        if (p.mail.length < 30) p.mail.push({ from: 'Chợ Sạp Hàng Hóa', text: `Hết hạn thuê sạp. ${st.listings.length} món chưa bán đã trả về túi.`, cash: 0 });
      }
      delete this.stalls[name];
    }
    g.db.markDirty();
  }
}
