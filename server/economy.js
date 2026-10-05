// Loi kinh te: moi thao tac tien/do kiem tra truoc roi moi ghi (all-or-nothing).
// Node chay don luong nen moi ham o day la mot "transaction" nguyen tu.
import { ECON, ITEMS } from '../shared/config.js';

export class EconError extends Error {}

let uidSeq = Date.now() % 1e9;
export const newUid = () => `i${(uidSeq++).toString(36)}`;

export class Economy {
  constructor(db) {
    this.db = db;
  }

  log(kind, p, data) {
    this.db.ledger({ kind, player: p?.name, ...data });
    this.db.markDirty();
  }

  // ---- Tien ----
  // wallet: 'cash' | 'bank'
  canPay(p, amount, wallet = 'cash') {
    return Number.isFinite(amount) && amount >= 0 && p[wallet] >= amount;
  }

  pay(p, amount, wallet, reason) {
    amount = Math.round(amount);
    if (!(amount >= 0)) throw new EconError('Số tiền không hợp lệ');
    if (p[wallet] < amount) {
      throw new EconError(wallet === 'cash' ? 'Không đủ tiền mặt' : 'Số dư ngân hàng không đủ');
    }
    p[wallet] -= amount;
    this.log('sink', p, { wallet, amount, reason });
  }

  grant(p, amount, wallet, reason) {
    amount = Math.round(amount);
    if (!(amount >= 0)) throw new EconError('Số tiền không hợp lệ');
    p[wallet] += amount;
    this.log('source', p, { wallet, amount, reason });
  }

  transfer(from, fromWallet, to, toWallet, amount, reason, taxRate = 0) {
    amount = Math.round(amount);
    if (!(amount > 0)) throw new EconError('Số tiền không hợp lệ');
    if (from === to && fromWallet === toWallet) throw new EconError('Giao dịch không hợp lệ');
    if (from[fromWallet] < amount) {
      throw new EconError(fromWallet === 'cash' ? 'Không đủ tiền mặt' : 'Số dư ngân hàng không đủ');
    }
    const tax = Math.round(amount * taxRate);
    from[fromWallet] -= amount;
    to[toWallet] += amount - tax;
    this.log('transfer', from, { to: to.name, amount, tax, reason });
    return { net: amount - tax, tax };
  }

  atmFee(amount) {
    return Math.max(ECON.atmFeeMin, Math.round(amount * ECON.atmFeeRate));
  }

  deposit(p, amount) {
    amount = Math.floor(amount);
    if (!(amount > 0)) throw new EconError('Nhập số tiền lớn hơn 0');
    const fee = this.atmFee(amount);
    if (p.cash < amount + fee) throw new EconError(`Cần ${amount + fee} tiền mặt (đã gồm phí)`);
    p.cash -= amount + fee;
    p.bank += amount;
    this.log('atm_deposit', p, { amount, fee });
    return fee;
  }

  withdraw(p, amount) {
    amount = Math.floor(amount);
    if (!(amount > 0)) throw new EconError('Nhập số tiền lớn hơn 0');
    const fee = this.atmFee(amount);
    if (p.bank < amount + fee) throw new EconError('Số dư không đủ (đã gồm phí)');
    p.bank -= amount + fee;
    p.cash += amount;
    this.log('atm_withdraw', p, { amount, fee });
    return fee;
  }

  dailyInterest(p) {
    const gain = Math.min(ECON.interestCap, Math.floor(p.bank * ECON.interestRate));
    if (gain > 0) this.grant(p, gain, 'bank', 'interest');
    return gain;
  }

  // ---- Vat pham ----
  count(p, id) {
    return p.inv.filter((s) => s.id === id).reduce((n, s) => n + s.qty, 0);
  }

  findStack(p, uid) {
    return p.inv.find((s) => s.uid === uid);
  }

  addItem(p, id, qty = 1, extra = {}) {
    const def = ITEMS[id];
    if (!def) throw new EconError('Vật phẩm không tồn tại');
    this.db.markDirty();
    if (def.type === 'equip') {
      const out = [];
      for (let i = 0; i < qty; i++) {
        const s = { uid: newUid(), id, qty: 1, dur: 100, lvl: 0, ...extra };
        p.inv.push(s);
        out.push(s);
      }
      return out;
    }
    const stack = p.inv.find((s) => s.id === id);
    if (stack) stack.qty += qty;
    else p.inv.push({ uid: newUid(), id, qty });
    return [];
  }

  // Lay nguyen ven mot stack (hoac mot phan) ra khoi tui do. Tra ve stack moi.
  takeStack(p, uid, qty) {
    const s = this.findStack(p, uid);
    if (!s) throw new EconError('Không tìm thấy vật phẩm');
    if (Object.values(p.equip).includes(uid)) throw new EconError('Hãy tháo trang bị trước');
    qty = Math.floor(qty ?? s.qty);
    if (!(qty > 0) || qty > s.qty) throw new EconError('Số lượng không hợp lệ');
    if (qty === s.qty) {
      p.inv.splice(p.inv.indexOf(s), 1);
      return s;
    }
    s.qty -= qty;
    return { ...s, uid: newUid(), qty };
  }

  // Dua stack vao tui (gop neu la vat pham xep chong duoc)
  putStack(p, stack) {
    const def = ITEMS[stack.id];
    if (def.type !== 'equip') {
      const ex = p.inv.find((s) => s.id === stack.id);
      if (ex) {
        ex.qty += stack.qty;
        return;
      }
    }
    p.inv.push(stack);
  }

  removeItems(p, need) {
    for (const [id, n] of Object.entries(need)) {
      if (this.count(p, id) < n) throw new EconError(`Thiếu ${ITEMS[id].name} (cần ${n})`);
    }
    for (const [id, n] of Object.entries(need)) {
      let left = n;
      for (const s of [...p.inv]) {
        if (s.id !== id || left === 0) continue;
        const take = Math.min(left, s.qty);
        s.qty -= take;
        left -= take;
        if (s.qty === 0) p.inv.splice(p.inv.indexOf(s), 1);
      }
    }
  }

  buyFromNpc(p, id, qty, price, wallet = 'cash') {
    qty = Math.floor(qty);
    if (!(qty > 0 && qty <= 99)) throw new EconError('Số lượng không hợp lệ');
    this.pay(p, price * qty, wallet, `npc_buy:${id}`);
    this.addItem(p, id, qty);
  }

  sellToNpc(p, id, qty, price) {
    this.removeItems(p, { [id]: qty });
    this.grant(p, price * qty, 'cash', `npc_sell:${id}`);
  }
}
