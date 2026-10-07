// Cong cu dev: "che do xem bo cuc" cho nguoi lam map/art. Chi bat khi URL co ?layout=1.
// Phim: [ ] cuon camera +-500px | - = zoom 0.3..1.5 | 0 theo nhan vat | L bat/tat lop.
import { BUILDINGS, POIS, WORLD, ZONES } from '/shared/config.js';

const ZONE_COLORS = [0xff6b6b, 0x4ecdc4, 0xffd93d, 0xa78bfa];
const hex = (c) => `#${c.toString(16).padStart(6, '0')}`;

export function initLayoutView(scene) {
  let on = false;
  try { on = new URLSearchParams(location.search).get('layout') === '1'; } catch (e) { /* ignore */ }
  if (!on) return;

  const D = 9000;
  const W = WORLD.width;
  const H = WORLD.height;
  const texts = [];
  const mk = (x, y, s, color = '#fff', ox = 0, oy = 0, size = 12) => {
    const t = scene.add.text(x, y, s, {
      fontFamily: 'monospace', fontSize: `${size}px`, color, backgroundColor: 'rgba(0,0,0,0.55)', padding: { x: 2, y: 1 },
    }).setOrigin(ox, oy).setDepth(D + 2);
    texts.push(t);
    return t;
  };

  const g = scene.add.graphics().setDepth(D);
  // 1. luoi
  for (let x = 0; x <= W; x += 100) {
    const major = x % 500 === 0;
    g.lineStyle(major ? 2 : 1, 0xffffff, major ? 0.4 : 0.12).lineBetween(x, 0, x, H);
    if (major) mk(x + 2, 0, String(x), '#ffe08a', 0, 0);
  }
  for (let y = 0; y <= H; y += 100) {
    const major = y % 500 === 0;
    g.lineStyle(major ? 2 : 1, 0xffffff, major ? 0.4 : 0.12).lineBetween(0, y, W, y);
    if (major) mk(2, y + 2, `y${y}`, '#ffe08a', 0, 0);
  }

  // 2. ranh khu
  ZONES.forEach((z, i) => {
    const c = ZONE_COLORS[i % ZONE_COLORS.length];
    g.lineStyle(3, c, 0.9).lineBetween(z.x0, 0, z.x0, H);
    mk(z.x0 + 6, 24, z.name, hex(c), 0, 0, 14);
  });
  g.lineStyle(3, 0xffffff, 0.5).lineBetween(W, 0, W, H);

  // 4. khung cong trinh + khe
  const base = WORLD.buildingBase + 6;
  const boxes = BUILDINGS.map((b) => {
    const key = b.gen ? `bld_${b.id}` : b.sprite;
    let w = b.gen?.w || 0;
    let h = b.gen?.h || 0;
    if (scene.textures.exists(key)) {
      const src = scene.textures.get(key).getSourceImage();
      w = src.width * (b.scale || 1);
      h = src.height * (b.scale || 1);
    }
    return { b, w, h, l: b.x - w / 2, r: b.x + w / 2 };
  }).sort((p, q) => p.l - q.l);
  boxes.forEach((o, i) => {
    const next = boxes[i + 1];
    const gap = next ? Math.round(next.l - o.r) : null;
    const bad = gap != null && (gap > 30 || gap < 0);
    g.lineStyle(2, bad ? 0xff3030 : 0x44ff88, 0.9).strokeRect(o.l, base - o.h, o.w, o.h);
    if (bad && gap > 0) g.fillStyle(0xff3030, 0.25).fillRect(o.r, base - 40, gap, 40);
    if (bad && gap < 0) g.fillStyle(0xff3030, 0.35).fillRect(next.l, base - 40, -gap, 40);
    mk(o.l + 3, base - o.h + 3, `${o.b.sprite || o.b.id} ${Math.round(o.w)}x${Math.round(o.h)}`, '#9dffc0');
    if (gap != null) mk(o.r, base + 4, `khe ${gap}`, bad ? '#ff8080' : '#9dffc0', 0.5, 0, 11);
  });

  // 5. POI
  for (const p of POIS) {
    const c = p.hidden ? 0x999999 : 0x66ccff;
    g.fillStyle(c, 0.9).fillCircle(p.x, p.y, 5);
    g.lineStyle(1, c, 0.6).strokeCircle(p.x, p.y, 120);
    g.lineStyle(1, c, 0.35).strokeCircle(p.x, p.y, 160);
    mk(p.x, p.y + 8, p.id + (p.hidden ? ' (hidden)' : ''), p.hidden ? '#aaaaaa' : '#a8e0ff', 0.5, 0, 11);
  }

  // 3. thuoc chuan (ve lai theo camera moi khung)
  const ruler = scene.add.graphics().setDepth(D + 1);
  const rulerTxt = mk(0, 0, 'nguoi 86 / cua 110', '#ffffff', 0, 1);
  const redraw = () => {
    const v = scene.cameras.main.worldView;
    const x = v.x + 30;
    const y = v.bottom - 30;
    ruler.clear();
    ruler.lineStyle(3, 0xffcc00, 1).lineBetween(x, y, x, y - 86);
    ruler.lineBetween(x - 6, y, x + 6, y);
    ruler.lineBetween(x - 6, y - 86, x + 6, y - 86);
    ruler.lineStyle(3, 0xff66cc, 1).lineBetween(x + 24, y, x + 24, y - 110);
    ruler.lineBetween(x + 18, y, x + 30, y);
    ruler.lineBetween(x + 18, y - 110, x + 30, y - 110);
    rulerTxt.setPosition(x + 40, y);
    // chu giu kich thuoc man hinh co dinh khi zoom
    const k = 1 / scene.cameras.main.zoom;
    for (const t of texts) t.setScale(k);
  };
  scene.events.on('postupdate', redraw);

  // 6. phim tat
  const layers = [g, ruler, ...texts];
  const cam = () => scene.cameras.main;
  const onKey = (e) => {
    if (/INPUT|TEXTAREA/.test(e.target?.tagName || '') || e.target?.isContentEditable) return;
    const c = cam();
    if (e.key === 'l' || e.key === 'L') {
      on = !on;
      for (const o of layers) o.setVisible(on);
    } else if (e.key === '[' || e.key === ']') {
      c.stopFollow();
      c.setScroll(c.scrollX + (e.key === ']' ? 500 : -500), c.scrollY);
    } else if (e.key === '-' || e.key === '=') {
      c.setZoom(Phaser.Math.Clamp(c.zoom * (e.key === '=' ? 1.15 : 1 / 1.15), 0.3, 1.5));
    } else if (e.key === '0') {
      if (scene.me?.sprite) c.startFollow(scene.me.sprite, true, 0.12, 0.12, 0, 40);
      scene.fitZoom?.();
    }
  };
  on = true;
  window.addEventListener('keydown', onKey);
  const stop = () => {
    window.removeEventListener('keydown', onKey);
    scene.events.off('postupdate', redraw);
  };
  scene.events.once('shutdown', stop);
  scene.events.once('destroy', stop);
  console.info('[layout] ?layout=1 bat: [ ] cuon, - = zoom, 0 theo nhan vat, L bat/tat');
}
