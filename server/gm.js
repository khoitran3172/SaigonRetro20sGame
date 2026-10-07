// Cong cu GM (admin) de test tinh nang: cong / tru tien, hoi chi so, them vat pham.
// CHI bat khi chay o may (khong co DATABASE_URL va khong chay tren Render) — ban online khong co GM.
import { ITEMS } from '../shared/config.js';
import { EconError } from './economy.js';

export const GM_ENABLED = !process.env.DATABASE_URL && !process.env.RENDER;

const WALLETS = { cash: 'tiền mặt', bank: 'ngân hàng', diamonds: 'Kim cương' };
const MAX = 10_000_000_000;

export class Gm {
  constructor(game) {
    this.g = game;
  }

  handle(s, m) {
    if (!GM_ENABLED) return;
    const g = this.g;
    const p = s.p;
    const a = String(m.a || '');
    if (a === 'money') {
      const w = String(m.wallet || '');
      const amount = Math.round(Number(m.amount));
      if (!WALLETS[w] || !Number.isFinite(amount) || Math.abs(amount) > MAX) throw new EconError('Số không hợp lệ');
      p[w] = Math.max(0, p[w] + amount);
      g.econ.log('gm', p, { wallet: w, amount });
      g.toast(s, `🛠️ GM: ${amount >= 0 ? '+' : ''}${amount.toLocaleString('vi-VN')} ${WALLETS[w]}`, 'good');
    } else if (a === 'stats') {
      Object.assign(p.stats, { stamina: 100, hunger: 100, stress: 0 });
      g.toast(s, '🛠️ GM: hồi đầy năng lượng, no bụng, tinh thần', 'good');
    } else if (a === 'item') {
      const id = String(m.id || '');
      const qty = Math.max(1, Math.min(99, Math.floor(Number(m.qty)) || 1));
      if (!ITEMS[id]) throw new EconError('Không có vật phẩm này');
      g.econ.addItem(p, id, qty);
      g.econ.log('gm', p, { item: id, qty });
      g.toast(s, `🛠️ GM: +${qty} × ${ITEMS[id].name}`, 'good');
    } else return;
    s.stats = g.computeStats(p);
    s.dirty = true;
    g.db.markDirty();
  }
}
