// Cho Sap Hang Hoa (GAMEPLAY_V2 G24, G55–G57, G59): 3 tab — Trong cho (anh room_market, cac sap dat theo o),
// Mua (tim / loc / sap xep moi mon dang bay, gia trung binh), Sap cua toi (thue, bay hang, sua gia, thu hoi, che bien).
import { FORMAT, ITEMS, MARKET, RECIPES } from '/shared/config.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const BW = 1024;
const BH = 572;
const vnd = FORMAT.vnd;
const TYPES = { all: 'Tất cả', food: 'Ăn uống', ingredient: 'Nguyên liệu', equip: 'Trang bị', furn: 'Nội thất', other: 'Khác' };
const typeOf = (id) => {
  const t = ITEMS[id].type;
  return TYPES[t] ? t : 'other';
};

// Khoang gia hop le (giong server/market.js)
function priceRange(id) {
  const base = ITEMS[id]?.base || 0;
  if (!base) return MARKET.free;
  return [Math.max(1000, Math.round(base * MARKET.price[0])), Math.round(base * MARKET.price[1])];
}

export class MarketView {
  constructor(net, ui) {
    this.net = net;
    this.ui = ui;
    this.data = null;
    this.tab = 'hall';
    this.filter = { q: '', type: 'all', sort: 'new' };
    net.on('market', (m) => this.onMsg(m));
    $('market-x').onclick = () => this.close();
    for (const b of document.querySelectorAll('#market-tabs button')) {
      b.onclick = () => {
        this.tab = b.dataset.tab;
        this.render();
      };
    }
  }

  get active() {
    return !$('market').classList.contains('hidden');
  }

  onMsg(m) {
    const first = !this.active;
    this.data = m;
    if (first) {
      this.ui.closePanels();
      $('market').classList.remove('hidden');
      this.tab = m.remote ? 'buy' : 'hall';
      this.stallOf = null;
    }
    this.render();
  }

  close() {
    $('market').classList.add('hidden');
    this.data = null;
  }

  send(a, extra = {}) {
    this.net.send({ t: 'market', a, ...extra });
  }

  get mine() {
    return this.data.stalls.find((s) => s.owner === this.data.me);
  }

  render() {
    const d = this.data;
    if (!d) return;
    $('market-title').textContent = d.remote ? '🧺 Chợ Sạp Hàng Hóa (xem từ xa)' : '🧺 Chợ Sạp Hàng Hóa';
    this.refresh();
    for (const b of document.querySelectorAll('#market-tabs button')) {
      b.classList.toggle('on', b.dataset.tab === this.tab);
      b.disabled = d.remote && b.dataset.tab !== 'buy';
    }
    const st = $('market-stage');
    st.textContent = '';
    st.className = this.tab;
    this[`render_${this.tab}`](st);
  }

  // So du (goi tu UI.setSelf — khong ve lai ca man de khong mat so dang go)
  refresh() {
    $('market-info').textContent = `💵 ${vnd(this.ui.self.cash)} · 💳 ${vnd(this.ui.self.bank)}`;
  }

  // ------------------------------------------------------------ trong cho: cac sap theo o
  render_hall(st) {
    const bg = el('img', 'bg');
    bg.src = 'assets/v2/rooms/room_market.png';
    st.append(bg);
    for (const s of this.data.stalls) {
      const [x, y] = MARKET.spots[s.spot] || MARKET.spots[0];
      const k = 0.75 + (0.35 * (y - 240)) / (BH - 240); // sap o xa nho hon
      const sz = MARKET.sizes[s.size];
      const img = el('img', 'mk-stall');
      img.src = `assets/v2/props/${sz.img}.png`;
      img.onload = () => { img.style.width = `${((img.naturalWidth * k * 1.3) / BW) * 100}%`; };
      Object.assign(img.style, { left: `${(x / BW) * 100}%`, top: `${(y / BH) * 100}%`, zIndex: y });
      img.title = `Sạp của ${s.owner}`;
      img.onclick = () => this.openStall(s.owner);
      const tag = el('div', `mk-tag${s.owner === this.data.me ? ' me' : ''}`, `${s.owner} · ${s.listings.length} món`);
      Object.assign(tag.style, { left: `${(x / BW) * 100}%`, top: `${(y / BH) * 100}%`, zIndex: 1000 });
      tag.onclick = () => this.openStall(s.owner);
      st.append(img, tag);
    }
    const free = MARKET.spots.length - this.data.stalls.length;
    $('market-hint').textContent = `${this.data.stalls.length} sạp đang thuê · còn ${free} chỗ trống. Bấm vào sạp để xem hàng. Thuê sạp ở tab "Sạp của tôi".`;
    if (this.stallOf) this.openStall(this.stallOf);
  }

  openStall(owner) {
    const s = this.data.stalls.find((x) => x.owner === owner);
    $('market-stage').querySelector('.mk-pop')?.remove();
    this.stallOf = s ? owner : null;
    if (!s) return;
    const pop = el('div', 'mk-pop');
    const head = el('div', 'mk-pophead');
    head.append(el('b', null, `🧺 Sạp của ${owner} · ${MARKET.sizes[s.size].name}`));
    const x = el('button', 'btn small', '✕');
    x.onclick = () => {
      this.stallOf = null;
      pop.remove();
    };
    head.append(x);
    pop.append(head);
    const list = el('div', 'mk-grid');
    for (const l of s.listings) list.append(this.card(s, l));
    if (!s.listings.length) list.append(el('div', 'muted', 'Sạp chưa bày hàng.'));
    pop.append(list);
    $('market-stage').append(pop);
  }

  // The hang: icon, ten, so luong, gia (nhan giay), nguoi ban, gia TB gan day, nut mua
  card(s, l) {
    const def = ITEMS[l.id];
    const c = el('div', `mk-card r-${def.type === 'equip' ? def.rar || 'common' : 'common'}`);
    c.append(this.ui.icon(l.id, def.icon, 40));
    c.append(el('b', null, `${def.name}${l.lvl ? ` +${l.lvl}` : ''}`));
    c.append(el('div', 'muted', `×${l.qty} · ${s.owner}`));
    const price = el('div', 'mk-price');
    const tag = el('img');
    tag.src = 'assets/v2/ui/market_tag.png';
    price.append(tag, vnd(l.price));
    c.append(price);
    const avg = this.data.avg[l.id];
    if (avg) c.append(el('div', 'muted', `TB gần đây ${vnd(avg)}`));
    if (s.owner === this.data.me) {
      c.append(el('div', 'muted', 'Hàng của bạn'));
      return c;
    }
    const row = el('div', 'buy');
    const q = el('input');
    q.type = 'number';
    q.min = 1;
    q.max = l.qty;
    q.value = 1;
    const b = el('button', 'btn small', 'Mua');
    b.disabled = !!this.data.remote;
    b.title = this.data.remote ? 'Tới chợ để mua' : '';
    b.onclick = () => {
      this.send('buy', { owner: s.owner, lid: l.lid, qty: Number(q.value) });
      this.stamp(c);
    };
    if (l.qty > 1) row.append(q);
    row.append(b);
    c.append(row);
    return c;
  }

  stamp(node) {
    const s = el('img', 'mk-stamp');
    s.src = 'assets/v2/ui/market_stamp.png';
    node.append(s);
    setTimeout(() => s.remove(), 900);
  }

  // ------------------------------------------------------------ mua: tim / loc / sap xep
  render_buy(st) {
    const bar = el('div', 'mk-bar');
    const search = el('div', 'mk-search');
    const q = el('input');
    q.placeholder = 'Tìm món...';
    q.value = this.filter.q;
    q.oninput = () => {
      this.filter.q = q.value;
      draw();
    };
    search.append(q);
    const type = el('select');
    for (const [k, v] of Object.entries(TYPES)) type.append(new Option(v, k));
    type.value = this.filter.type;
    type.onchange = () => {
      this.filter.type = type.value;
      draw();
    };
    const sort = el('select');
    for (const [k, v] of Object.entries({ new: 'Mới bày', asc: 'Giá tăng dần', desc: 'Giá giảm dần' })) sort.append(new Option(v, k));
    sort.value = this.filter.sort;
    sort.onchange = () => {
      this.filter.sort = sort.value;
      draw();
    };
    bar.append(search, type, sort);
    const grid = el('div', 'mk-grid');
    st.append(bar, grid);
    const draw = () => {
      grid.textContent = '';
      const f = this.filter;
      let rows = this.data.stalls.flatMap((s) => s.listings.map((l) => ({ s, l })));
      if (f.type !== 'all') rows = rows.filter(({ l }) => typeOf(l.id) === f.type);
      if (f.q) rows = rows.filter(({ l }) => ITEMS[l.id].name.toLowerCase().includes(f.q.toLowerCase()));
      if (f.sort === 'asc') rows.sort((a, b) => a.l.price - b.l.price);
      else if (f.sort === 'desc') rows.sort((a, b) => b.l.price - a.l.price);
      else rows.sort((a, b) => b.l.lid - a.l.lid);
      for (const { s, l } of rows) grid.append(this.card(s, l));
      if (!rows.length) grid.append(el('div', 'muted', 'Không có món nào khớp.'));
    };
    draw();
    $('market-hint').textContent = this.data.remote
      ? 'Đang xem từ xa qua điện thoại — tới Chợ (Khu 1) để mua.'
      : 'Món dưới 100.000đ trả tiền mặt, từ 100.000đ trả bằng thẻ. Người bán chịu thuế 5%.';
  }

  // ------------------------------------------------------------ sap cua toi
  render_mine(st) {
    const s = this.mine;
    const left = el('div', 'mk-col');
    const right = el('div', 'mk-col');
    st.append(left, right);
    // Thue / gia han / doi co sap
    const sizes = el('div', 'mk-sizes');
    MARKET.sizes.forEach((sz, i) => {
      const c = el('div', `mk-size${s?.size === i ? ' on' : ''}`);
      const img = el('img');
      img.src = `assets/v2/props/${sz.img}.png`;
      c.append(img, el('b', null, sz.name), el('div', 'muted', `${sz.slots} ô · ${vnd(sz.rent)}/${MARKET.days} ngày`));
      const b = el('button', 'btn small', !s ? 'Thuê' : s.size === i ? 'Gia hạn' : 'Đổi sang');
      b.onclick = () => this.send('rent', { size: i });
      c.append(b);
      sizes.append(c);
    });
    left.append(el('h4', null, s
      ? `🧺 ${MARKET.sizes[s.size].name} · hết hạn cuối ngày ${s.until} (hôm nay ngày ${this.data.day})`
      : '🧺 Thuê một sạp (trả bằng thẻ)'), sizes);
    if (!s) {
      $('market-hint').textContent = 'Sạp vẫn bán khi bạn offline — tiền (trừ thuế 5%) vào tài khoản ngân hàng, có thư báo.';
      return;
    }
    left.append(el('div', 'muted', `Đã bán ${s.sold} món · thu về ${vnd(s.earned)} (sau thuế)`));
    // Hang dang bay
    left.append(el('h4', null, `Đang bày ${s.listings.length}/${MARKET.sizes[s.size].slots}`));
    for (const l of s.listings) {
      const row = el('div', 'mk-row');
      row.append(this.ui.icon(l.id, ITEMS[l.id].icon, 28), el('span', 'nm', `${ITEMS[l.id].name} ×${l.qty}`));
      const p = el('input');
      p.type = 'number';
      p.value = l.price;
      const [lo, hi] = priceRange(l.id);
      p.min = lo;
      p.max = hi;
      p.title = `${vnd(lo)} – ${vnd(hi)}`;
      const sp = el('button', 'btn small', 'Sửa giá');
      sp.onclick = () => this.send('price', { lid: l.lid, price: Number(p.value) });
      const rc = el('button', 'btn small', 'Thu về');
      rc.onclick = () => this.send('recall', { lid: l.lid });
      row.append(p, sp, rc);
      left.append(row);
    }
    // Bay them tu tui
    right.append(el('h4', null, 'Bày thêm từ túi'));
    // Tui do di kem goi tin cho (cap nhat cung luc voi sap)
    const equipped = new Set(Object.values(this.data.equip));
    const inv = this.data.inv.filter((it) => !equipped.has(it.uid));
    if (!inv.length) right.append(el('div', 'muted', 'Không có món nào để bày (đồ đang mặc phải tháo ra trước).'));
    for (const it of inv) {
      const row = el('div', 'mk-row');
      row.append(this.ui.icon(it.id, ITEMS[it.id].icon, 28), el('span', 'nm', `${ITEMS[it.id].name}${it.lvl ? ` +${it.lvl}` : ''} ×${it.qty}`));
      const [lo, hi] = priceRange(it.id);
      const q = el('input');
      q.type = 'number';
      q.min = 1;
      q.max = it.qty;
      q.value = it.qty;
      q.title = 'Số lượng';
      const p = el('input');
      p.type = 'number';
      p.value = this.data.avg[it.id] || ITEMS[it.id].base || lo;
      p.min = lo;
      p.max = hi;
      p.title = `Giá mỗi món: ${vnd(lo)} – ${vnd(hi)}`;
      const b = el('button', 'btn small', 'Bày');
      b.onclick = () => this.send('list', { uid: it.uid, qty: Number(q.value), price: Number(p.value) });
      if (it.qty > 1) row.append(q);
      row.append(p, b);
      right.append(row);
    }
    // Che bien (tieu thuong mang sang tu sap via he cu)
    right.append(el('h4', null, '🔪 Chế biến để bán'));
    for (const [id, r] of Object.entries(RECIPES)) {
      const need = Object.entries(r.in).map(([k, n]) => `${ITEMS[k].name} ×${n}`).join(', ');
      const b = el('button', 'btn small', `${r.name}`);
      b.title = `Cần: ${need} · −${r.stamina} năng lượng`;
      b.onclick = () => this.send('craft', { id });
      const row = el('div', 'mk-row');
      row.append(b, el('span', 'muted', need));
      right.append(row);
    }
    $('market-hint').textContent = 'Giá mỗi món phải trong khoảng 50%–300% giá gốc. Hết hạn thuê, hàng chưa bán tự về túi.';
  }
}
