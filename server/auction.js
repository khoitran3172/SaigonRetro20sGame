// Dau gia cong khai: phien bat dau 20:00 gio game, cac lo chay noi tiep nhau.
// Dat gia = ky quy ngay tu tai khoan ngan hang (hoan lai khi bi tra gia cao hon) -> khong the dupe tien.
import { AUCTION, ECON, ITEMS } from '../shared/config.js';
import { EconError } from './economy.js';
import { newUid } from './economy.js';

const vnd = (n) => `${Math.round(n).toLocaleString('vi-VN')}đ`;
const SYSTEM_LOTS = ['bien_so_dep', 'meo_quy', 'ao_limited'];

export class Auction {
  constructor(game) {
    this.g = game;
    const w = game.db.data.world;
    w.auctionQueue ??= [];
    this.queue = w.auctionQueue; // [{seller, stack, start}]
  }

  // Lo dang dau luu trong DB de khoan ky quy khong mat khi server khoi dong lai
  get lot() {
    return this.g.db.data.world.auctionLot || null; // {seller, stack, start, top, topBidder, endsAt}
  }

  set lot(v) {
    this.g.db.data.world.auctionLot = v;
  }

  playerByName(name) {
    return this.g.db.data.players[name?.toLowerCase()];
  }

  onHour(h) {
    if (h === AUCTION.startHour) {
      const n = 2;
      for (let i = 0; i < n; i++) {
        const id = SYSTEM_LOTS[Math.floor(Math.random() * SYSTEM_LOTS.length)];
        this.queue.push({ seller: null, stack: { uid: newUid(), id, qty: 1, dur: 100, lvl: 0 }, start: 200000 + Math.floor(Math.random() * 4) * 100000 });
      }
      this.g.news(`🔨 Phiên đấu giá tối nay bắt đầu tại Nhà Đấu Giá (Khu 2)! ${this.queue.length} lô hàng. Đấu giá từ xa qua điện thoại.`, true);
      this.next();
    }
  }

  next() {
    const item = this.queue.shift();
    if (!item) {
      this.lot = null;
      return;
    }
    this.lot = { ...item, top: 0, topBidder: null, endsAt: Date.now() + AUCTION.lotSeconds * 1000 };
    const def = ITEMS[item.stack.id];
    this.g.news(`🔨 Lô mới: ${def.icon} ${def.name} — giá khởi điểm ${vnd(item.start)}`);
    this.g.db.markDirty();
  }

  tick() {
    if (!this.lot || Date.now() < this.lot.endsAt) return;
    const lot = this.lot;
    const def = ITEMS[lot.stack.id];
    const g = this.g;
    if (lot.topBidder) {
      const winner = this.playerByName(lot.topBidder);
      g.econ.putStack(winner, lot.stack);
      if (lot.seller) {
        const seller = this.playerByName(lot.seller);
        const tax = Math.round(lot.top * ECON.auctionTax);
        seller.bank += lot.top - tax;
        g.econ.log('auction_sale', seller, { amount: lot.top, tax, buyer: winner.name, item: lot.stack.id });
      } else {
        g.econ.log('sink', winner, { wallet: 'bank', amount: lot.top, reason: 'auction_system_lot' });
      }
      g.news(`🎉 ${lot.topBidder} thắng ${def.icon} ${def.name} với giá ${vnd(lot.top)}!`, true);
      const ws = g.sessionByName(lot.topBidder);
      if (ws) ws.dirty = true;
    } else if (lot.seller) {
      // Khong ai mua -> tra lai qua buu dien
      this.playerByName(lot.seller)?.mail.push({ from: 'Nhà Đấu Giá', text: `Lô ${def.name} không có người mua, trả lại.`, stack: lot.stack });
      g.news(`Lô ${def.name} không có người trả giá.`);
    } else {
      g.news(`Lô ${def.name} không có người trả giá.`);
    }
    g.db.markDirty();
    this.next();
  }

  minBid() {
    const l = this.lot;
    return l.top ? Math.ceil(l.top * (1 + AUCTION.minStep)) : l.start;
  }

  bid(s, amount) {
    const l = this.lot;
    if (!l) throw new EconError('Hiện không có lô nào đang đấu giá (phiên lúc 20:00)');
    amount = Math.floor(amount);
    const min = this.minBid();
    if (!(amount >= min)) throw new EconError(`Giá tối thiểu ${vnd(min)}`);
    if (l.topBidder === s.p.name) throw new EconError('Bạn đang giữ giá cao nhất');
    if (l.seller === s.p.name) throw new EconError('Không thể tự đấu giá đồ của mình');
    if (s.p.bank < amount) throw new EconError('Số dư ngân hàng không đủ để ký quỹ');
    // ky quy nguoi moi, hoan tien nguoi cu (cung mot buoc dong bo -> nguyen tu)
    s.p.bank -= amount;
    if (l.topBidder) {
      const prev = this.playerByName(l.topBidder);
      prev.bank += l.top;
      const ps = this.g.sessionByName(l.topBidder);
      if (ps) {
        ps.dirty = true;
        this.g.toast(ps, `Bạn bị ${s.p.name} trả giá cao hơn (${vnd(amount)}). Đã hoàn ký quỹ.`, 'warn');
      }
    }
    l.top = amount;
    l.topBidder = s.p.name;
    l.endsAt = Math.max(l.endsAt, Date.now() + AUCTION.antiSnipe * 1000);
    this.g.econ.log('auction_bid', s.p, { amount, item: l.stack.id });
    this.g.news(`🔨 ${s.p.name} trả ${vnd(amount)} cho ${ITEMS[l.stack.id].name}`);
    return `Đặt giá ${vnd(amount)} thành công (đã ký quỹ).`;
  }

  consign(s, uid, start) {
    start = Math.floor(start);
    if (!(start >= 10000)) throw new EconError('Giá khởi điểm tối thiểu 10.000đ');
    if (this.queue.filter((q) => q.seller === s.p.name).length >= 2) throw new EconError('Tối đa 2 lô ký gửi');
    const stack = this.g.econ.takeStack(s.p, uid);
    this.queue.push({ seller: s.p.name, stack, start });
    this.g.db.markDirty();
    return `Đã ký gửi ${ITEMS[stack.id].name}. Sẽ lên sàn trong phiên tối (20:00).`;
  }

  dialog(s) {
    const l = this.lot;
    const p = s.p;
    const items = p.inv.filter((it) => !Object.values(p.equip).includes(it.uid) && ['equip', 'collectible'].includes(ITEMS[it.id].type));
    const lines = [];
    if (l) {
      const def = ITEMS[l.stack.id];
      const left = Math.max(0, Math.ceil((l.endsAt - Date.now()) / 1000));
      lines.push(`ĐANG ĐẤU: ${def.icon} ${def.name} (+${l.stack.lvl || 0})`,
        `Giá cao nhất: ${l.top ? `${vnd(l.top)} — ${l.topBidder}` : `chưa có (khởi điểm ${vnd(l.start)})`}`,
        `Còn ${left}s · Người bán: ${l.seller || 'Hệ thống (bản giới hạn)'}`);
    } else {
      lines.push('Chưa có phiên. Phiên đấu giá diễn ra lúc 20:00 mỗi tối.');
    }
    lines.push(`Hàng chờ: ${this.queue.length} lô · Ký quỹ bằng tài khoản ngân hàng (${vnd(p.bank)}). Thuế người bán ${ECON.auctionTax * 100}%.`);
    return {
      title: '🔨 Nhà Đấu Giá',
      text: lines.join('\n'),
      poi: 'auction',
      options: [
        ...(l ? [{ label: 'Trả giá', act: 'bid', inputs: [{ name: 'amount', type: 'number', value: this.minBid(), w: 110 }] }] : []),
        { label: 'Ký gửi vật phẩm', act: 'consign', disabled: !items.length, inputs: [
          { name: 'uid', type: 'select', options: items.map((it) => ({ v: it.uid, l: `${ITEMS[it.id].icon} ${ITEMS[it.id].name}${it.lvl ? ` +${it.lvl}` : ''}` })) },
          { name: 'start', type: 'number', value: 50000, w: 90 },
        ] },
        { label: '🔄 Làm mới', act: 'noop' },
      ],
    };
  }
}
