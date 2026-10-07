// Nau an (GAMEPLAY_V2 G44–G48): sach cong thuc -> mat bep (anh 948x526) -> bam bat nguyen lieu dung thu tu,
// dung luc kim lua o vung xanh. Client gui thoi diem bam, server tinh lai kim lua va cham sao.
import { DISHES, FORMAT, ITEMS } from '/shared/config.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const BW = 948;
const BH = 526;
// Tam 5 bat tren anh mat bep, cho do an trong chao
const BOWL_XY = [[363, 372], [470, 372], [578, 372], [684, 372], [790, 372]];
const PAN_XY = [718, 160];
const needleAt = (t, period) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / period);
const icon = (id, cls = 'ci') => {
  const img = el('img', cls);
  img.src = `assets/icons/${ITEMS[id]?.ico || id}.png`;
  img.alt = ITEMS[id]?.name || id;
  return img;
};

export class CookView {
  constructor(net, ui) {
    this.net = net;
    this.ui = ui;
    this.cur = null;
    net.on('cook_go', (m) => this.play(m));
    net.on('cook_result', (m) => this.result(m));
    $('cook-x').onclick = () => this.close();
  }

  get open() {
    return !$('cook').classList.contains('hidden');
  }

  // Bep dang dat trong phong (theo du lieu phong client dang giu)
  kitchen() {
    let stove = 0;
    let rice = false;
    for (const pl of this.ui.home.data?.placed || []) {
      const f = ITEMS[pl.id]?.furn;
      if (f?.type === 'stove') stove = Math.max(stove, f.tier);
      if (f?.type === 'ricecooker') rice = true;
    }
    return { stove, rice };
  }

  have(id) {
    return this.ui.self.inv.filter((it) => it.id === id).reduce((n, it) => n + it.qty, 0);
  }

  openBook() {
    if (this.cur && !this.cur.done) return;
    this.cur = null;
    $('cook').classList.remove('hidden');
    $('cook-title').textContent = '📖 Sách công thức';
    $('cook-info').textContent = '';
    const stage = $('cook-stage');
    stage.className = 'book';
    stage.textContent = '';
    const k = this.kitchen();
    const self = this.ui.self;
    for (const [id, d] of Object.entries(DISHES)) {
      const card = el('div', 'recipe');
      const locked = d.book && !self.cookbook;
      card.append(icon(id, 'cdish'));
      const body = el('div', 'rbody');
      body.append(el('b', null, locked ? `🔒 ${d.name}` : d.name));
      const ings = el('div', 'ings');
      const need = {};
      for (const ing of d.in) need[ing] = (need[ing] || 0) + 1;
      let enough = true;
      d.in.forEach((ing, i) => {
        const w = el('span', 'ing');
        w.append(el('small', null, `${i + 1}`), icon(ing));
        const ok = this.have(ing) >= need[ing];
        if (!ok) {
          w.classList.add('miss');
          enough = false;
        }
        w.title = `${ITEMS[ing].name} (có ${this.have(ing)})`;
        ings.append(w);
      });
      body.append(ings);
      const why = locked ? 'Cần Sách công thức (Tạp hóa)'
        : k.stove < d.stove ? (k.stove ? 'Cần bếp gas đôi trở lên' : 'Phòng chưa có bếp')
          : d.rice && !k.rice ? 'Cần nồi cơm điện' : !enough ? 'Thiếu nguyên liệu — mua ở Tạp hóa' : '';
      const eff = Object.entries(ITEMS[id].eff).map(([e, v]) => `${{ hunger: 'No', stamina: 'NL', stress: 'Tinh thần' }[e]} ${e === 'stress' ? `+${-v}` : `+${v}`}`).join(' · ');
      body.append(el('div', 'muted', why || `${eff} · bán ~${FORMAT.vnd(ITEMS[id].base)}`));
      card.append(body);
      const b = el('button', 'btn small', 'Nấu');
      b.disabled = !!why;
      b.onclick = () => this.net.send({ t: 'cook', a: 'start', dish: id });
      card.append(b);
      stage.append(card);
    }
    $('cook-hint').textContent = 'Nguyên liệu đánh số theo thứ tự cho vào chảo. Món ⭐⭐⭐ hồi nhiều hơn và bán được giá ở chợ.';
  }

  play(m) {
    const d = DISHES[m.dish];
    this.cur = { ...m, t0: performance.now(), clicks: [], k: 0, done: false, timers: [] };
    const c = this.cur;
    $('cook').classList.remove('hidden');
    $('cook-title').textContent = `🍳 ${d.name}`;
    const stage = $('cook-stage');
    stage.className = 'stove';
    stage.textContent = '';
    const bg = el('img', 'bg');
    bg.src = 'assets/v2/ui/cooking_stove_v2.png';
    stage.append(bg);
    const pct = (x, y, node) => Object.assign(node.style, { left: `${(x / BW) * 100}%`, top: `${(y / BH) * 100}%` });
    // Phieu cong thuc tren thot: thu tu nguyen lieu
    const card = el('div', 'cook-card');
    const rows = m.steps.map((ing, i) => {
      const row = el('div', null);
      row.append(el('small', null, `${i + 1}.`), icon(ing), el('span', null, ITEMS[ing].name));
      card.append(row);
      return row;
    });
    stage.append(card);
    const pan = el('div', 'cook-pan');
    pct(...PAN_XY, pan);
    stage.append(pan);
    // Bat nguyen lieu
    m.bowls.forEach((ing, i) => {
      const b = el('button', 'bowl');
      pct(...BOWL_XY[i], b);
      b.append(icon(ing));
      b.title = ITEMS[ing].name;
      b.onclick = () => this.add(ing, b);
      stage.append(b);
    });
    // Thuoc nhiet: kim chay qua lai, vung xanh = lua vua
    const gauge = el('div', 'heat');
    const zone = el('i', 'zone');
    Object.assign(zone.style, { left: `${m.zone[0] * 100}%`, width: `${(m.zone[1] - m.zone[0]) * 100}%` });
    const needle = el('b', 'needle');
    gauge.append(zone, needle, el('span', null, '🔥 Lửa'));
    stage.append(gauge);
    c.rows = rows;
    c.pan = pan;
    const tick = () => {
      if (c.done) return;
      const t = performance.now() - c.t0;
      needle.style.left = `${needleAt(t, m.period) * 100}%`;
      const left = Math.max(0, m.secs - t / 1000);
      $('cook-info').textContent = `⏱ ${Math.ceil(left)}s · bước ${Math.min(c.k + 1, m.steps.length)}/${m.steps.length}`;
      if (left <= 0) return this.finish();
      c.raf = requestAnimationFrame(tick);
    };
    this.mark();
    tick();
    $('cook-hint').textContent = 'Bấm bát nguyên liệu theo đúng thứ tự trên phiếu — đúng lúc kim lửa nằm trong vùng xanh để món ngon nhất!';
  }

  mark() {
    const c = this.cur;
    c.rows.forEach((r, i) => { r.className = i < c.k ? 'done' : i === c.k ? 'now' : ''; });
  }

  add(ing, bowl) {
    const c = this.cur;
    if (!c || c.done) return;
    const t = Math.round(performance.now() - c.t0);
    const last = c.clicks.at(-1);
    if (last && t - last.t < 360) return; // nhip toi thieu (server 350ms)
    c.clicks.push({ ing, t });
    const v = needleAt(t, c.period);
    if (ing !== c.steps[c.k]) {
      this.flash('Sai nguyên liệu!', '#ff9a85', bowl);
      return;
    }
    const good = v >= c.zone[0] && v <= c.zone[1];
    this.flash(good ? 'Xèo xèo! 👌' : v < c.zone[0] ? 'Lửa nhỏ quá' : 'Lửa to quá!', good ? '#9fe58a' : '#ffe08a', bowl);
    c.pan.append(icon(ing, 'drop'));
    c.k++;
    this.mark();
    if (c.k >= c.steps.length) this.later(() => this.finish(), 500);
  }

  later(fn, ms) {
    this.cur.timers.push(setTimeout(fn, ms));
  }

  flash(text, color, near) {
    const f = el('div', 'flash', text);
    f.style.color = color;
    if (near) {
      f.style.left = near.style.left;
      f.style.top = `calc(${near.style.top} - 12%)`;
    }
    $('cook-stage').append(f);
    setTimeout(() => f.remove(), 800);
  }

  finish() {
    const c = this.cur;
    if (!c || c.done) return;
    c.done = true;
    cancelAnimationFrame(c.raf);
    for (const t of c.timers) clearTimeout(t);
    this.net.send({ t: 'cook', a: 'done', cid: c.cid, clicks: c.clicks });
  }

  result(m) {
    const c = this.cur;
    if (!c) return;
    c.done = true;
    cancelAnimationFrame(c.raf);
    const box = el('div', 'result');
    const card = el('div');
    if (m.stars) {
      card.append(el('h4', null, ['', 'Ăn được!', 'Ngon lắm!', 'Xuất sắc!'][m.stars]));
      const stars = el('div', 'stars');
      for (let i = 0; i < 3; i++) {
        const s = el('img');
        s.src = 'assets/v2/ui/star_full.png';
        if (i >= m.stars) s.className = 'off';
        stars.append(s);
      }
      card.append(stars, icon(m.item, 'cdish'), el('div', null, `${ITEMS[m.item].name} đã vào túi đồ.`));
      card.append(el('div', 'muted', `Đúng lửa ${m.perfect} · lệch lửa ${m.ok}${m.wrong ? ` · bấm nhầm ${m.wrong}` : ''}`));
    } else {
      card.append(el('h4', null, 'Hỏng món rồi! 😵'), el('div', null, 'Chưa cho đủ nguyên liệu kịp giờ — nguyên liệu đã mất.'));
    }
    const row = el('div', 'row');
    const again = el('button', 'btn', '📖 Nấu món khác');
    again.onclick = () => this.openBook();
    const close = el('button', 'btn', 'Đóng');
    close.onclick = () => this.close();
    row.append(again, close);
    card.append(row);
    box.append(card);
    $('cook-stage').append(box);
  }

  close() {
    if (this.cur && !this.cur.done) this.finish();
    $('cook').classList.add('hidden');
  }
}
