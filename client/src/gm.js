// Bang GM (chi hien khi server bao self.gm — chay o may, khong co tren ban online):
// cong / tru tien mat, ngan hang, Kim cuong · hoi day chi so · them vat pham bat ky vao tui.
import { FORMAT, ITEMS } from '/shared/config.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const WALLETS = [
  ['cash', '💵 Tiền mặt', [100000, 1000000, 100000000]],
  ['bank', '💳 Ngân hàng', [1000000, 100000000, 2000000000]],
  ['diamonds', '💎 Kim cương', [10, 100]],
];
const TYPE = {
  food: 'Ăn uống', ingredient: 'Nguyên liệu', equip: 'Trang bị', furn: 'Nội thất', tool: 'Dụng cụ', book: 'Sách',
  material: 'Vật liệu', collectible: 'Sưu tầm', data: 'Gói cước',
};
const short = (n) => (n >= 1e9 ? `${n / 1e9} tỷ` : n >= 1e6 ? `${n / 1e6}tr` : n >= 1000 ? `${n / 1000}k` : `${n}`);

export class GmPanel {
  constructor(net, ui) {
    this.net = net;
    this.ui = ui;
  }

  send(a, extra) {
    this.net.send({ t: 'gm', a, ...extra });
  }

  toggle() {
    const box = $('gm');
    if (!box.classList.contains('hidden')) return box.classList.add('hidden');
    this.ui.closePanels();
    box.classList.remove('hidden');
    this.render();
  }

  render() {
    const body = $('gm-body');
    body.textContent = '';
    // Tien
    for (const [w, name, quick] of WALLETS) {
      const row = el('div', 'gm-row');
      row.append(el('b', null, name));
      const inp = el('input');
      inp.type = 'number';
      inp.value = quick[0];
      const add = el('button', 'btn small', '＋');
      add.onclick = () => this.send('money', { wallet: w, amount: Number(inp.value) });
      const sub = el('button', 'btn small', '－');
      sub.onclick = () => this.send('money', { wallet: w, amount: -Number(inp.value) });
      row.append(inp, add, sub);
      for (const q of quick) {
        const b = el('button', 'btn small', `+${short(q)}`);
        b.onclick = () => this.send('money', { wallet: w, amount: q });
        row.append(b);
      }
      body.append(row);
    }
    // Chi so
    const st = el('button', 'btn', '⚡ Hồi đầy năng lượng · no bụng · tinh thần');
    st.onclick = () => this.send('stats');
    body.append(st);
    // Vat pham
    body.append(el('h4', null, '🎁 Thêm vật phẩm'));
    const row = el('div', 'gm-row');
    const q = el('input');
    q.placeholder = 'Lọc tên...';
    const sel = el('select');
    const fill = () => {
      sel.textContent = '';
      const k = q.value.trim().toLowerCase();
      const groups = {};
      for (const [id, d] of Object.entries(ITEMS)) {
        if (k && !d.name.toLowerCase().includes(k) && !id.includes(k)) continue;
        (groups[d.type] ??= []).push([id, d]);
      }
      for (const [t, list] of Object.entries(groups)) {
        const og = document.createElement('optgroup');
        og.label = TYPE[t] || t;
        for (const [id, d] of list) og.append(new Option(`${d.name} (${FORMAT.vnd(d.base || 0)})`, id));
        sel.append(og);
      }
    };
    q.oninput = fill;
    fill();
    const n = el('input');
    n.type = 'number';
    n.value = 1;
    n.min = 1;
    n.max = 99;
    n.className = 'qty';
    const add = el('button', 'btn small', 'Thêm vào túi');
    add.onclick = () => sel.value && this.send('item', { id: sel.value, qty: Number(n.value) });
    row.append(q, sel, n, add);
    body.append(row);
    body.append(el('div', 'muted', 'Chỉ có khi chạy ở máy (không có DATABASE_URL) — bản online không có nút này.'));
  }
}
