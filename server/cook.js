// Nau an (GAMEPLAY_V2 G44–G48): o bep trong phong, chon cong thuc -> mini-game cho nguyen lieu dung thu tu
// dung luc kim lua o vung xanh. Server sinh nhip kim lua, client gui thoi diem bam, server tinh lai & cham sao.
import { COOK, DISHES, ITEMS } from '../shared/config.js';
import { EconError } from './economy.js';

const BOWLS = 5;
const rnd = (n) => Math.floor(Math.random() * n);

// Bep dang dat trong phong: cap bep cao nhat, co noi com dien khong
export function kitchen(p) {
  let stove = 0;
  let rice = false;
  for (const pl of p.home?.placed || []) {
    const f = ITEMS[pl.id]?.furn;
    if (f?.type === 'stove') stove = Math.max(stove, f.tier);
    if (f?.type === 'ricecooker') rice = true;
  }
  return { stove, rice };
}

export function needleAt(t, period) {
  return 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / period);
}

// clicks: [{ ing, t }] t = ms tu luc bat dau. -> { perfect, ok, wrong, done, stars }
export function scoreCook(steps, clicks, period, zone, elapsedMs) {
  let k = 0;
  let perfect = 0;
  let ok = 0;
  let wrong = 0;
  let last = -Infinity;
  for (const c of Array.isArray(clicks) ? clicks.slice(0, 30) : []) {
    const t = Number(c?.t);
    // nhip toi thieu + khong bam "trong tuong lai"
    if (!Number.isFinite(t) || t < last + COOK.minGap || t > elapsedMs + 500) continue;
    last = t;
    if (k >= steps.length) break;
    if (c.ing !== steps[k]) {
      wrong++;
      continue;
    }
    const v = needleAt(t, period);
    if (v >= zone[0] - 0.03 && v <= zone[1] + 0.03) perfect++;
    else ok++;
    k++;
  }
  const done = k === steps.length;
  const score = (2 * perfect + ok - wrong) / (2 * steps.length);
  const stars = !done ? 0 : score >= 0.85 ? 3 : score >= 0.5 ? 2 : 1;
  return { perfect, ok, wrong, done, stars };
}

export class Cook {
  constructor(game) {
    this.g = game;
    this.seq = 1;
  }

  handle(s, m) {
    const a = String(m.a || '');
    if (a === 'start') return this.start(s, String(m.dish || ''));
    if (a === 'done') return this.done(s, m);
  }

  start(s, dish) {
    const g = this.g;
    const p = s.p;
    const d = DISHES[dish];
    if (!d) return;
    if (!s.inHome) throw new EconError('Vào phòng trọ để nấu ăn');
    if (s.cook || s.sleep || s.job) throw new EconError('Bạn đang bận');
    if (d.book && !p.cookbook) throw new EconError('Chưa biết món này — đọc Sách công thức (mua ở Tạp hóa)');
    const k = kitchen(p);
    if (!k.stove) throw new EconError('Phòng chưa có bếp');
    if (k.stove < d.stove) throw new EconError('Món này cần bếp gas đôi trở lên');
    if (d.rice && !k.rice) throw new EconError('Món này cần nồi cơm điện');
    if (p.stats.stamina < COOK.stamina) throw new EconError('Mệt quá, nghỉ chút rồi nấu');
    const need = {};
    for (const id of d.in) need[id] = (need[id] || 0) + 1;
    for (const [id, n] of Object.entries(need)) {
      if (g.econ.count(p, id) < n) throw new EconError(`Thiếu ${ITEMS[id].name}`);
    }
    g.econ.removeItems(p, need); // nguyen lieu mat khi bat dau (bo ngang = hong mon)
    p.stats.stamina -= COOK.stamina;
    // 5 bat: nguyen lieu cua mon + vai thu khac cho roi mat
    const bowls = [...new Set(d.in)];
    const others = Object.keys(ITEMS).filter((id) => id.startsWith('nl_') && !bowls.includes(id));
    while (bowls.length < BOWLS) bowls.push(others.splice(rnd(others.length), 1)[0]);
    bowls.sort(() => Math.random() - 0.5);
    const tier = k.stove - 1;
    const secs = d.in.length * COOK.secsPerStep + 6;
    s.cook = { cid: this.seq++, dish, steps: d.in, period: COOK.period[tier], zone: COOK.zone[tier], started: Date.now(), secs };
    g.db.markDirty();
    s.dirty = true;
    g.send(s, { t: 'cook_go', cid: s.cook.cid, dish, steps: d.in, bowls, period: s.cook.period, zone: s.cook.zone, secs });
  }

  done(s, m) {
    const g = this.g;
    const c = s.cook;
    if (!c || Number(m.cid) !== c.cid) return;
    s.cook = null;
    const elapsed = Date.now() - c.started;
    const r = elapsed > (c.secs + 10) * 1000
      ? { perfect: 0, ok: 0, wrong: 0, done: false, stars: 0 }
      : scoreCook(c.steps, m.clicks, c.period, c.zone, elapsed);
    let item = null;
    if (r.stars) {
      item = r.stars === 1 ? c.dish : `${c.dish}_s${r.stars}`;
      g.econ.addItem(s.p, item, 1);
      g.questProgress(s, 'cook', 1);
    }
    g.db.markDirty();
    s.dirty = true;
    g.send(s, { t: 'cook_result', ...r, item, dish: c.dish });
  }

  // Doc sach cong thuc: mo khoa cac mon can sach
  learn(s) {
    const p = s.p;
    if (p.cookbook) throw new EconError('Bạn đã thuộc hết công thức trong sách');
    this.g.econ.removeItems(p, { sach_cong_thuc: 1 });
    p.cookbook = true;
    const n = Object.values(DISHES).filter((d) => d.book).length;
    this.g.toast(s, `📕 Đã học ${n} món mới! Vào bếp trong phòng để nấu.`, 'good');
  }
}
