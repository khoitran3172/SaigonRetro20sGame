// Trung Tam Mua Sam (GAMEPLAY_V2 G25–G28, G60–G64): 5 quay ban gia co dinh + may Gacha o quay Thoi trang.
// Gacha chi tra bang tien kiem trong game; ty le cong khai, bao hiem (pity), do trung phan ra thanh Manh lap lanh.
import { GACHA, ITEMS, MALL, POIS } from '../shared/config.js';
import { EconError } from './economy.js';

const POI = POIS.find((p) => p.id === 'mall');
const RANGE = 200;
const TIER = { common: 1, good: 2, rare: 3, limited: 4 };
const walletFor = (price) => (price >= 100000 ? 'bank' : 'cash');

export function rollRarity(g, rand = Math.random) {
  if (g.sinceLimited + 1 >= GACHA.pityLimited) return 'limited';
  if (g.sinceRare + 1 >= GACHA.pityRare) return rand() < GACHA.rates[0][1] / (GACHA.rates[0][1] + GACHA.rates[1][1]) ? 'limited' : 'rare';
  let r = rand();
  for (const [rar, p] of GACHA.rates) {
    if (r < p) return rar;
    r -= p;
  }
  return 'common';
}

export class Mall {
  constructor(game) {
    this.g = game;
  }

  near(s) {
    if (Math.hypot(POI.x - s.x, POI.y - s.y) > RANGE) throw new EconError('Hãy vào Trung Tâm Mua Sắm');
  }

  gacha(p) {
    p.gacha ??= { n: 0, sinceRare: 0, sinceLimited: 0 };
    return p.gacha;
  }

  state(s) {
    const gc = this.gacha(s.p);
    return { t: 'mall', gacha: { ...gc, price: GACHA.price, pityRare: GACHA.pityRare, pityLimited: GACHA.pityLimited } };
  }

  handle(s, m) {
    const a = String(m.a || '');
    this.near(s);
    if (a === 'enter') return this.g.send(s, this.state(s));
    if (a === 'buy') return this.buy(s, String(m.counter || ''), String(m.id || ''), Number(m.qty));
    if (a === 'gacha') return this.spin(s);
    if (a === 'exchange') return this.exchange(s, String(m.kind || ''));
  }

  buy(s, counter, id, qty) {
    const c = MALL[counter];
    if (!c?.items.includes(id)) throw new EconError('Quầy không bán món này');
    const def = ITEMS[id];
    qty = Math.max(1, Math.min(def.type === 'ingredient' ? 20 : 5, Math.floor(qty) || 1));
    this.g.econ.buyFromNpc(s.p, id, qty, def.base, walletFor(def.base));
    s.dirty = true;
    this.g.db.markDirty();
    // G28: do lon giao tan noi — tam thoi vao thang tui, dat trong phong o che do Sap xep
    this.g.toast(s, `🛍️ Đã mua ${qty} × ${def.name}${def.type === 'furn' ? ' — đặt trong phòng trọ (Sắp xếp)' : ''}`, 'good');
  }

  spin(s) {
    const g = this.g;
    const p = s.p;
    const gc = this.gacha(p);
    // Quay truoc (chua ghi gi), kiem tra cho + tien roi moi ghi
    const rar = rollRarity(gc);
    const kind = GACHA.kinds[Math.floor(Math.random() * GACHA.kinds.length)];
    const id = `gear_${kind}_${TIER[rar]}`;
    // Do trung (da co trong tui) -> phan ra thanh Manh lap lanh (G63)
    const dup = p.inv.some((it) => it.id === id);
    const shards = dup ? GACHA.shards[rar] : 0;
    g.econ.assertRoom(p, [dup ? ['gacha_manh', shards] : [id, 1]]);
    g.econ.pay(p, GACHA.price, 'cash', 'gacha');
    gc.n++;
    gc.sinceRare = TIER[rar] >= 3 ? 0 : gc.sinceRare + 1;
    gc.sinceLimited = rar === 'limited' ? 0 : gc.sinceLimited + 1;
    if (dup) g.econ.addItem(p, 'gacha_manh', shards);
    else g.econ.addItem(p, id, 1);
    if (TIER[rar] >= 3) g.news(`🎰 ${p.name} vừa quay Gacha ra ${ITEMS[id].name} (${rar === 'limited' ? 'Giới hạn' : 'Hiếm'})!`);
    s.dirty = true;
    g.db.markDirty();
    g.send(s, { ...this.state(s), spin: { id, rar, dup, shards } });
  }

  // Doi manh lay 1 mon Hiem tu chon
  exchange(s, kind) {
    if (!GACHA.kinds.includes(kind)) return;
    const g = this.g;
    if (g.econ.count(s.p, 'gacha_manh') < GACHA.exchange) throw new EconError(`Cần ${GACHA.exchange} Mảnh lấp lánh`);
    const id = `gear_${kind}_3`;
    g.econ.assertRoom(s.p, [[id, 1]], { gacha_manh: GACHA.exchange });
    g.econ.removeItems(s.p, { gacha_manh: GACHA.exchange });
    g.econ.addItem(s.p, id, 1);
    s.dirty = true;
    g.db.markDirty();
    g.toast(s, `✨ Đã đổi ${GACHA.exchange} mảnh lấy ${ITEMS[id].name}!`, 'good');
    g.send(s, this.state(s));
  }
}
