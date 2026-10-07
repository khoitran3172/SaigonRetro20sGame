// Phong o (GAMEPLAY_V2 G19, G21, G49–G52): xem phong, sap xep noi that (keo tha), ngu, xem TV.
// Server giu trang thai (p.home.placed); client chi ve va gui thao tac. Toa do theo anh nen 1024x572.
import { FORMAT, FURN_FLAT, FURN_TIER, FURN_TYPES, FURN_WALL, ITEMS, ROOMS, SLEEP } from '/shared/config.js';

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

// Mo ta ngan mot mon noi that (dung ca o tui do)
export function furnDesc(def) {
  const f = def.furn;
  const parts = [`${FURN_TYPES[f.type]} · ${FURN_TIER[f.tier - 1]}`, `Thoải mái +${f.comfort}`];
  if (f.sleep) parts.push(`Ngủ hồi ×${f.sleep}`);
  if (f.cool) parts.push(`Làm mát ${f.cool}`);
  if (f.relax) parts.push(`Xem TV +${f.relax} tinh thần`);
  if (f.it) parts.push(`Ca IT +${f.it}s`);
  if (f.power) parts.push(`Điện ${vnd(f.power)}/ngày`);
  return parts.join(' · ');
}

export class HomeView {
  constructor(net, ui) {
    this.net = net;
    this.ui = ui;
    this.data = null;
    this.edit = false;
    this.sel = null;
    net.on('home', (m) => this.show(m));
    net.on('home_close', () => this.hide());
    $('room-leave').onclick = () => this.send('leave');
    $('room-edit').onclick = () => {
      this.edit = !this.edit;
      this.sel = null;
      this.render();
    };
  }

  get active() {
    return !!this.data;
  }

  send(a, extra = {}) {
    this.net.send({ t: 'home', a, ...extra });
  }

  show(m) {
    const first = !this.data;
    this.data = m;
    if (first) {
      this.ui.closePanels();
      this.edit = false;
    }
    if (m.sel != null) this.sel = m.sel;
    $('room').classList.remove('hidden');
    this.render();
  }

  hide() {
    this.data = null;
    this.sel = null;
    $('room').classList.add('hidden');
    $('room-menu').classList.add('hidden');
  }

  // Do o xa (y nho) ve nho hon de co chieu sau
  scale(id, y) {
    const r = ROOMS[this.data.room];
    if (FURN_WALL.includes(ITEMS[id].furn.type)) return 1.3;
    return 1.15 + (0.45 * (y - r.floor[0])) / (BH - r.floor[0]);
  }

  render() {
    const d = this.data;
    if (!d) return;
    $('room-title').textContent = `🏠 ${d.name}`;
    $('room-stats').textContent = `🛋️ Thoải mái ${d.comfort} · ⚡ Điện ${vnd(d.power)}/ngày · 😴 Ngủ hồi ${d.rate} NL/giờ`;
    $('room-edit').textContent = this.edit ? '✔ Xong' : '🪑 Sắp xếp';
    $('room-edit').classList.toggle('on', this.edit);
    const stage = $('room-stage');
    stage.textContent = '';
    stage.classList.toggle('edit', this.edit);
    const bg = el('img', 'bg');
    bg.src = `assets/${d.bg}`;
    stage.append(bg);
    d.placed.forEach((pl, i) => stage.append(this.piece(pl, i)));
    if (d.sleep) stage.append(this.sleepOverlay(d.sleep));
    $('room-menu').classList.add('hidden');
    this.renderTray();
    $('room-hint').textContent = this.edit
      ? 'Kéo thả để di chuyển · bấm một món để Lật / Cất vào túi · bấm đồ ở khay dưới để đặt vào phòng.'
      : 'Bấm vào đồ để dùng: giường → ngủ, TV → xem, máy tính → làm IT.';
  }

  piece(pl, i) {
    const def = ITEMS[pl.id];
    const img = el('img', 'furn');
    img.src = `assets/${def.img}`;
    img.alt = def.name;
    img.draggable = false;
    img.onload = () => {
      img.style.width = `${((img.naturalWidth * this.scale(pl.id, pl.y)) / BW) * 100}%`;
    };
    Object.assign(img.style, {
      left: `${(pl.x / BW) * 100}%`, top: `${(pl.y / BH) * 100}%`,
      zIndex: FURN_FLAT.includes(def.furn.type) ? 1 : 10 + Math.round(pl.y),
      transform: `translate(-50%, -100%)${pl.f ? ' scaleX(-1)' : ''}`,
    });
    if (this.edit && this.sel === i) img.classList.add('sel');
    img.title = `${def.name} — ${furnDesc(def)}`;
    if (this.edit) this.dragable(img, pl, i);
    else img.onclick = (e) => this.use(pl, e);
    return img;
  }

  // Che do sap xep: keo tha (pointer), tha tay -> gui vi tri moi
  dragable(img, pl, i) {
    img.onpointerdown = (e) => {
      e.preventDefault();
      const stage = $('room-stage');
      const r = stage.getBoundingClientRect();
      const k = BW / r.width;
      const r0 = { x: e.clientX, y: e.clientY, px: pl.x, py: pl.y };
      let moved = false;
      img.setPointerCapture(e.pointerId);
      img.onpointermove = (ev) => {
        const dx = (ev.clientX - r0.x) * k;
        const dy = (ev.clientY - r0.y) * k;
        if (Math.hypot(dx, dy) > 4) moved = true;
        const { x, y } = this.clamp(pl.id, r0.px + dx, r0.py + dy);
        img.style.left = `${(x / BW) * 100}%`;
        img.style.top = `${(y / BH) * 100}%`;
        img.dataset.x = x;
        img.dataset.y = y;
      };
      img.onpointerup = () => {
        img.onpointermove = null;
        img.onpointerup = null;
        if (moved) this.send('move', { i, x: Number(img.dataset.x), y: Number(img.dataset.y), f: pl.f });
        else {
          this.sel = this.sel === i ? null : i;
          this.render();
          if (this.sel === i) this.editMenu(pl, i, img);
        }
      };
    };
  }

  clamp(id, x, y) {
    const r = ROOMS[this.data.room];
    const [y0, y1] = FURN_WALL.includes(ITEMS[id].furn.type) ? r.wall : r.floor;
    return { x: Math.round(Math.max(r.x[0], Math.min(r.x[1], x))), y: Math.round(Math.max(y0, Math.min(y1, y))) };
  }

  menu(anchor, items) {
    const m = $('room-menu');
    m.textContent = '';
    for (const [label, fn, disabled] of items) {
      const b = el('button', 'btn small', label);
      b.disabled = !!disabled;
      b.onclick = (e) => {
        e.stopPropagation();
        m.classList.add('hidden');
        fn?.();
      };
      m.append(b);
    }
    const r = $('room-box').getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    m.style.left = `${a.left + a.width / 2 - r.left}px`;
    m.style.top = `${a.top - r.top}px`;
    m.classList.remove('hidden');
  }

  editMenu(pl, i) {
    const img = $('room-stage').querySelectorAll('img.furn')[i];
    this.menu(img, [
      ['↔️ Lật', () => this.send('move', { i, x: pl.x, y: pl.y, f: pl.f ? 0 : 1 })],
      ['📦 Cất vào túi', () => this.send('store', { i })],
    ]);
  }

  use(pl, e) {
    const def = ITEMS[pl.id];
    const t = def.furn.type;
    const items = [];
    if (t === 'bed') for (const h of SLEEP.hours) items.push([`😴 Ngủ ${h} giờ`, () => this.send('sleep', { hours: h })]);
    if (t === 'tv') items.push(['📺 Xem TV', () => this.send('tv')]);
    if (t === 'pc') items.push(['💻 Làm 1 ca IT', () => this.net.send({ t: 'job_start', job: 'it' })]);
    if (t === 'stove') items.push(['🍳 Nấu ăn', () => this.ui.cook.openBook()]);
    items.push([`ℹ️ ${def.name}: ${furnDesc(def)}`, null, true]);
    this.menu(e.currentTarget, items);
  }

  sleepOverlay(sl) {
    const o = el('div', 'room-sleep');
    o.append(el('div', 'zzz', 'Z z z'));
    o.append(el('div', null, `Đang ngủ... dậy lúc ${FORMAT.clock(sl.until % 1440)}`));
    const b = el('button', 'btn', '⏰ Thức dậy');
    b.onclick = () => this.send('wake');
    o.append(b);
    return o;
  }

  // Khay do noi that trong tui (che do sap xep)
  renderTray() {
    const tray = $('room-tray');
    tray.textContent = '';
    tray.classList.toggle('hidden', !this.edit);
    if (!this.edit) return;
    const own = this.ui.self.inv.filter((it) => ITEMS[it.id]?.type === 'furn');
    if (!own.length) tray.append(el('span', 'muted', 'Túi chưa có đồ nội thất. Mua ở Trung Tâm Mua Sắm (sắp mở).'));
    const r = ROOMS[this.data.room];
    for (const it of own) {
      const def = ITEMS[it.id];
      const b = el('button', 'tray-item');
      const img = el('img');
      img.src = `assets/${def.img}`;
      b.append(img, el('span', null, `${def.name}${it.qty > 1 ? ` ×${it.qty}` : ''}`));
      b.title = furnDesc(def);
      b.disabled = this.data.placed.length >= r.max;
      b.onclick = () => {
        const wall = FURN_WALL.includes(def.furn.type);
        this.send('place', { id: it.id, x: 512, y: wall ? Math.round((r.wall[0] + r.wall[1]) / 2) : Math.round((r.floor[0] + r.floor[1]) / 2) });
      };
      tray.append(b);
    }
    tray.append(el('span', 'muted', `${this.data.placed.length}/${r.max} món`));
  }
}
