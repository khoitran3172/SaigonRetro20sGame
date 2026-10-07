// Trung Tam Mua Sam (GAMEPLAY_V2 G25–G28, G60–G64): sanh (anh room_mall 1024x572) co 5 quay + nhan vien,
// bam quay -> luoi san pham (noi that xep 3 phan khuc canh nhau de so sanh), may Gacha o quay Thoi trang.
import { FORMAT, FURN_TIER, FURN_TYPES, GACHA, ITEMS, MALL, RARITY, SLOTS } from '/shared/config.js';
import { furnDesc } from './home.js';

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
const at = (node, x, y) => Object.assign(node.style, { left: `${(x / BW) * 100}%`, top: `${(y / BH) * 100}%` });
const boxAt = (node, [x0, y0, x1, y1]) => Object.assign(node.style, {
  left: `${(x0 / BW) * 100}%`, top: `${(y0 / BH) * 100}%`, width: `${((x1 - x0) / BW) * 100}%`, height: `${((y1 - y0) / BH) * 100}%`,
});
const STAT = { charisma: 'Thu hút', speed: 'Tốc độ %', staminaSave: 'Tiết kiệm NL %' };

function itemImg(id) {
  const def = ITEMS[id];
  const img = el('img');
  img.src = def.img ? `assets/${def.img}` : `assets/icons/${def.ico || id}.png`;
  img.alt = def.name;
  return img;
}

function itemInfo(id) {
  const def = ITEMS[id];
  if (def.furn) return furnDesc(def);
  if (def.type === 'equip') return `${SLOTS[def.slot]} · ${RARITY[def.rar || 'common']} · ${Object.entries(def.st).map(([k, v]) => `${STAT[k] || k} +${v}`).join(', ')}`;
  if (def.type === 'tool') return `Ca IT +${def.it}s (để trong túi)`;
  if (def.type === 'book') return 'Đọc để học 7 món mới';
  return 'Nguyên liệu nấu ăn';
}

export class MallView {
  constructor(net, ui) {
    this.net = net;
    this.ui = ui;
    this.gacha = null;
    net.on('mall', (m) => this.onMsg(m));
    $('mall-x').onclick = () => this.close();
    $('mall-back').onclick = () => this.lobby();
  }

  get active() {
    return !$('mall').classList.contains('hidden');
  }

  onMsg(m) {
    this.gacha = m.gacha;
    if (!this.active) {
      this.ui.closePanels();
      $('mall').classList.remove('hidden');
      this.lobby();
    }
    if (m.spin) this.reveal(m.spin);
    else if (this.view === 'gacha') this.gachaPanel();
  }

  close() {
    $('mall').classList.add('hidden');
    this.view = null;
  }

  head(title, back) {
    $('mall-title').textContent = title;
    $('mall-back').classList.toggle('hidden', !back);
    this.refresh();
  }

  // Cap nhat so du khi mua (goi tu UI.setSelf)
  refresh() {
    $('mall-info').textContent = `💵 ${vnd(this.ui.self.cash)} · 💳 ${vnd(this.ui.self.bank)}`;
  }

  // Sanh: 5 quay, bien hieu, nhan vien, may gacha
  lobby() {
    this.view = 'lobby';
    this.head('🛍️ Trung Tâm Mua Sắm Phố Thị', false);
    const st = $('mall-stage');
    st.className = 'lobby';
    st.textContent = '';
    const bg = el('img', 'bg');
    bg.src = 'assets/v2/rooms/room_mall.png';
    st.append(bg);
    for (const [id, c] of Object.entries(MALL)) {
      const sign = el('div', 'mall-sign', c.name.toUpperCase());
      boxAt(sign, c.sign);
      st.append(sign);
      const hot = el('div', 'hot');
      boxAt(hot, c.box);
      hot.append(el('span', 'tag', `Quầy ${c.name}`));
      hot.onclick = () => this.counter(id);
      st.append(hot);
      const [anim, x, y] = c.staff;
      const npc = el('div', 'mall-staff');
      npc.style.backgroundImage = `url(assets/v2/anim/${anim}.png)`;
      npc.style.animationDelay = `${-Math.random() * 2}s`;
      at(npc, x, y);
      npc.onclick = () => this.counter(id);
      st.append(npc);
      if (c.gacha) {
        const mc = el('img', 'mall-gacha');
        mc.src = 'assets/v2/props/gacha_machine.png';
        mc.title = 'Máy Gacha';
        at(mc, ...c.gacha);
        mc.onclick = () => this.gachaPanel();
        st.append(mc);
      }
    }
    $('mall-hint').textContent = 'Bấm vào quầy hoặc nhân viên để xem hàng. Máy Gacha ở cạnh quầy Thời trang. Đồ từ 100.000đ trả bằng thẻ ngân hàng.';
  }

  counter(id) {
    this.view = id;
    const c = MALL[id];
    this.head(`🛍️ Quầy ${c.name}`, true);
    const st = $('mall-stage');
    st.className = 'shop';
    st.textContent = '';
    const banner = el('img', 'mall-banner');
    banner.src = `assets/v2/ui/mall_${id}.png`;
    st.append(banner);
    const list = el('div', 'mall-list');
    // Noi that: moi loai mot hang 3 phan khuc de so sanh (G27)
    const groups = new Map();
    for (const it of c.items) {
      const f = ITEMS[it].furn;
      const key = f ? f.type : ITEMS[it].type === 'equip' && ITEMS[it].slot !== 'phone' ? `gear:${ITEMS[it].slot}` : it.startsWith('laptop') ? 'laptop' : it.startsWith('dt_') ? 'phone' : 'misc';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    }
    for (const [key, ids] of groups) {
      const row = el('div', key === 'misc' ? 'mall-row wrap' : 'mall-row');
      if (key !== 'misc') row.append(el('div', 'mall-cat', FURN_TYPES[key] || { laptop: 'Laptop', phone: 'Điện thoại' }[key] || SLOTS[key.split(':')[1]] || ''));
      for (const it of ids) row.append(this.card(id, it));
      list.append(row);
    }
    for (const name of c.soon || []) {
      const s = el('div', 'mall-card soon');
      s.append(el('b', null, name), el('div', 'muted', 'Chưa mở bán'));
      list.append(s);
    }
    st.append(list);
    $('mall-hint').textContent = id === 'thoitrang'
      ? `Quầy bán đồ Thường và Tốt. Đồ Hiếm / Giới hạn chỉ có từ máy Gacha (${vnd(GACHA.price)}/lượt).`
      : 'Nội thất mua xong vào túi — vào phòng trọ, bấm "Sắp xếp" để đặt.';
  }

  card(counter, id) {
    const def = ITEMS[id];
    const card = el('div', `mall-card r-${def.rar || 'common'}`);
    card.append(itemImg(id));
    const tier = def.furn ? FURN_TIER[def.furn.tier - 1] : def.type === 'equip' ? RARITY[def.rar || 'common'] : '';
    card.append(el('b', null, def.name));
    if (tier) card.append(el('small', 'tier', tier));
    card.append(el('div', 'muted', itemInfo(id)));
    const row = el('div', 'buy');
    const qty = el('input');
    qty.type = 'number';
    qty.min = 1;
    qty.max = def.type === 'ingredient' ? 20 : 5;
    qty.value = 1;
    const b = el('button', 'btn small', `${vnd(def.base)}${def.base >= 100000 ? ' 💳' : ''}`);
    b.onclick = () => this.net.send({ t: 'mall', a: 'buy', counter, id, qty: Number(qty.value) });
    if (def.type === 'ingredient') row.append(qty);
    row.append(b);
    card.append(row);
    return card;
  }

  // May Gacha: ty le cong khai, bao hiem, manh lap lanh
  gachaPanel() {
    this.view = 'gacha';
    const gc = this.gacha;
    this.head('🎰 Máy Gacha Thời Trang', true);
    const st = $('mall-stage');
    st.className = 'gacha';
    st.textContent = '';
    const left = el('div', 'gacha-machine');
    const mc = el('img');
    mc.src = 'assets/v2/props/gacha_machine.png';
    left.append(mc);
    const right = el('div', 'gacha-info');
    right.append(el('h4', null, 'Tỉ lệ công khai'));
    for (const [rar, p] of [...GACHA.rates].reverse()) right.append(el('div', `r-${rar}`, `${RARITY[rar]}: ${Math.round(p * 100)}%`));
    right.append(el('div', 'muted', `Bảo hiểm: ${GACHA.pityRare} lượt chắc chắn Hiếm (còn ${gc.pityRare - gc.sinceRare}) · ${GACHA.pityLimited} lượt chắc chắn Giới hạn (còn ${gc.pityLimited - gc.sinceLimited}).`));
    right.append(el('div', 'muted', `Đã quay ${gc.n} lượt. Đồ trùng phân rã thành ✨ Mảnh lấp lánh.`));
    const spin = el('button', 'btn', `🎰 Quay 1 lượt (${vnd(GACHA.price)} tiền mặt)`);
    spin.onclick = () => {
      spin.disabled = true;
      setTimeout(() => { spin.disabled = false; }, 1500); // loi (thieu tien) thi server khong gui lai
      this.net.send({ t: 'mall', a: 'gacha' });
    };
    right.append(spin);
    const shards = this.ui.self.inv.filter((i) => i.id === 'gacha_manh').reduce((n, i) => n + i.qty, 0);
    const ex = el('div', 'gacha-ex');
    ex.append(el('span', null, `✨ ${shards}/${GACHA.exchange} mảnh → đổi 1 món Hiếm:`));
    const sel = el('select');
    for (const k of GACHA.kinds) sel.append(new Option(ITEMS[`gear_${k}_3`].name, k));
    const go = el('button', 'btn small', 'Đổi');
    go.disabled = shards < GACHA.exchange;
    go.onclick = () => this.net.send({ t: 'mall', a: 'exchange', kind: sel.value });
    ex.append(sel, go);
    right.append(ex);
    right.append(el('div', 'muted', 'Chỉ dùng tiền kiếm được trong game — không dùng Kim cương hay tiền thật.'));
    st.append(left, right);
    $('mall-hint').textContent = '';
  }

  // Hoat anh: vien nang lac -> nut -> mo, nen sang theo do hiem
  reveal(sp) {
    this.gachaPanel();
    const box = el('div', 'gacha-reveal');
    const cap = el('img', 'cap');
    box.append(cap);
    $('mall-stage').append(box);
    let f = 1;
    const step = () => {
      cap.src = `assets/v2/ui/gacha_open_${f}.png`;
      if (f++ < 6) return setTimeout(step, 170);
      setTimeout(() => {
        box.textContent = '';
        box.style.backgroundImage = `url(assets/v2/ui/reveal_${sp.rar}.png)`;
        box.classList.add('done', `r-${sp.rar}`);
        box.append(itemImg(sp.id), el('b', null, ITEMS[sp.id].name), el('div', null, RARITY[sp.rar]));
        if (sp.dup) box.append(el('div', 'muted', `Trùng đồ đã có → +${sp.shards} ✨ Mảnh lấp lánh`));
        const ok = el('button', 'btn small', 'OK');
        ok.onclick = () => box.remove();
        box.append(ok);
      }, 250);
    };
    step();
  }
}
