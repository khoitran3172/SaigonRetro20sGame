// Giao dien HTML phu tren canvas: dang nhap, HUD, chat, hoi thoai, tui do, trang bi, LED.
import {
  CLASSES, DOLL_SLOTS, ECON, FORMAT, INV, ITEMS, POIS, QUESTS, RARITY, SKINS, SLOTS, WORLD, ZONES, zoneAt,
} from '/shared/config.js';
import { CookView } from './cook.js';
import { GmPanel } from './gm.js';
import { HomeView, furnDesc } from './home.js';
import { JobGame } from './jobs.js';
import { MallView } from './mall.js';
import { MarketView } from './market.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const vnd = FORMAT.vnd;
// Ten nhan vat: chuan hoa NFC (ban phim dien thoai co the go dau to hop), bo ky tu an, gop khoang trang.
// Giong kiem tra o server (server/game.js).
const cleanName = (t) => String(t ?? '').normalize('NFC').replace(/[\p{Cc}\p{Cf}]/gu, '').replace(/\s+/g, ' ').trim();
function nameError(name) {
  if ([...name].length < 2 || [...name].length > 16) return 'Tên cần 2–16 ký tự.';
  const bad = [...name].filter((c) => !/[\p{L}\p{M}\p{N} _.-]/u.test(c));
  if (bad.length) return `Tên không dùng được ký tự: ${[...new Set(bad)].join(' ')} — chỉ chữ, số, khoảng trắng, dấu . _ -`;
  return null;
}
const WEATHER = { sunny: '🌤️ Trời đẹp', hot: '🔥 Nắng gắt', rain: '🌧️ Mưa ngập' };
const ZONE_COLORS = { daihoc: '#5f9e54', phoam: '#d98a3a', cbd: '#4f8fc9', ngoaio: '#8a7458' };
const CLASS_DESC = {
  sv: 'Điểm danh, cày net, phụ quán, nhặt ve chai. Tiền ít nhưng tự do.',
  vp: 'Chấm công, làm KPI, lương đều về tài khoản. Khách hàng sộp.',
  tt: 'Nhập hàng, chế biến, bày bán ở Chợ Sạp Hàng Hóa. Động cơ của cả khu chợ.',
};
const DEFAULT_SKIN = { sv: 'sv_male', vp: 'vp_male', tt: 'baba_female' };
// Chan dung hoi thoai theo POI (assets/ui/portrait_*.png). Com tam / tra sua: art ve sai nguoi — cho ve lai
const PORTRAIT = { banhmi: 'banhmi', cafe: 'cafe', kiot: 'taphoa', mechanic: 'mechanic', junkyard: 'vechai', buudien: 'buuta' };
const EMOTES = ['😀', '😂', '😍', '😡', '😭', '👍', '🙏', '🍻', '💸', '🔥'];

export class UI {
  constructor(net, { chars, icons }) {
    this.net = net;
    this.chars = chars;
    this.icons = new Set(icons);
    this.self = null;
    this.chatTab = 'all';
    this.ledQueue = [];
    this.ledBusy = false;
    this.pick = { cls: 'sv', skin: 'sv_male' };
    this.invTab = 'all';
    this.invSel = null;
    this.hotbar = null;
    this.jobs = new JobGame(net, this);
    this.home = new HomeView(net, this);
    this.cook = new CookView(net, this);
    this.mall = new MallView(net, this);
    this.market = new MarketView(net, this);
    this.gm = new GmPanel(net, this);

    net.on('error', (m) => this.loginError(m.msg));
    net.on('self', (m) => this.setSelf(m.self));
    net.on('toast', (m) => this.toast(m.msg, m.kind));
    net.on('chat', (m) => this.addChat(m));
    net.on('led', (m) => this.led(m));
    net.on('dialog', (m) => this.openDialog(m));
    net.on('dialog_close', () => this.hide('dialog'));
    net.on('time', (m) => this.setWorld(m));

    this.bindHud();
  }

  // Mini-game man rieng hoac dang trong phong -> khoa di chuyen / phim tat
  get locked() {
    return this.jobs.active || this.home.active || this.mall.active || this.market.active;
  }

  // Icon art (assets/icons/<id>.png; noi that dung chinh anh mon do); chua co art thi dung emoji
  icon(id, fallback, size = 28) {
    const own = ITEMS[id]?.img;
    const ico = ITEMS[id]?.ico || id; // mon nau 2–3 sao dung chung icon mon goc
    if (!own && !this.icons.has(ico)) return el('span', 'emo', fallback);
    const img = el('img', 'icon');
    img.src = own ? `assets/${own}` : `assets/icons/${ico}.png`;
    if (own) img.style.objectFit = 'contain';
    img.width = size;
    img.height = size;
    img.alt = '';
    return img;
  }

  get typing() {
    const a = document.activeElement;
    return a && (a.tagName === 'INPUT' || a.tagName === 'SELECT' || a.tagName === 'TEXTAREA');
  }

  // ------------------------------------------------------------ dang nhap
  showLogin() {
    const token = localStorage.getItem('hr_token');
    const name = localStorage.getItem('hr_name');
    if (token && name) {
      $('resume').classList.remove('hidden');
      $('create').classList.add('hidden');
      $('btn-resume').textContent = `Tiếp tục với "${name}"`;
      $('btn-resume').onclick = () => this.net.send({ t: 'hello', token });
      $('btn-new').onclick = () => {
        $('resume').classList.add('hidden');
        $('create').classList.remove('hidden');
      };
    }
    const classes = $('classes');
    for (const [id, c] of Object.entries(CLASSES)) {
      const b = el('button', 'choice');
      b.append(el('b', null, c.name), el('small', null, CLASS_DESC[id]));
      b.onclick = () => {
        this.pick.cls = id;
        this.pick.skin = DEFAULT_SKIN[id];
        this.refreshChoices();
      };
      b.dataset.cls = id;
      classes.append(b);
    }
    const skins = $('skins');
    for (const [id, label] of Object.entries(SKINS)) {
      const meta = this.chars[id];
      const b = el('button', 'choice');
      const prev = el('div', 'skin-prev');
      prev.style.width = `${meta.frameWidth}px`;
      prev.style.backgroundImage = `url(assets/chars/${id}.png)`;
      b.append(prev, el('small', null, label));
      b.dataset.skin = id;
      b.onclick = () => {
        this.pick.skin = id;
        this.refreshChoices();
      };
      skins.append(b);
    }
    this.refreshChoices();
    const play = () => {
      $('login-err').textContent = '';
      $('name-err').textContent = '';
      const name = cleanName($('in-name').value);
      const bad = nameError(name);
      if (bad) return this.loginError(bad);
      this.net.send({ t: 'hello', name, cls: this.pick.cls, skin: this.pick.skin });
    };
    $('btn-play').onclick = play;
    // Khong tra ve gia tri: handler tra false se huy phim (chan go chu, nhat la tren ban phim ao iOS)
    $('in-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') play();
    });
  }

  // Loi dang nhap: hien ngay duoi o ten va cuon toi (tren dien thoai dong loi cuoi khung bi khuat)
  loginError(msg) {
    $('name-err').textContent = msg;
    $('in-name').scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  refreshChoices() {
    for (const b of $('classes').children) b.classList.toggle('on', b.dataset.cls === this.pick.cls);
    for (const b of $('skins').children) b.classList.toggle('on', b.dataset.skin === this.pick.skin);
  }

  start(m) {
    $('login').classList.add('hidden');
    $('hud').classList.remove('hidden');
    this.setSelf(m.self);
    this.setWorld(m.world);
    this.buildMinimap();
    for (const n of m.news) this.addChat({ ch: 'news', from: 'Bưu tá', text: n });
    this.addChat({ ch: 'system', text: 'Chào mừng tới Hàng Rong! Nhấn H để xem hướng dẫn.' });
  }

  disconnected(msg) {
    $('login').classList.remove('hidden');
    $('hud').classList.add('hidden');
    $('create').classList.add('hidden');
    $('resume').classList.remove('hidden');
    $('btn-resume').textContent = 'Kết nối lại';
    $('btn-resume').onclick = () => location.reload();
    $('btn-new').classList.add('hidden');
    $('login-err').textContent = msg || 'Mất kết nối tới máy chủ.';
  }

  // ------------------------------------------------------------ HUD
  bindHud() {
    for (const b of document.querySelectorAll('[data-close]')) {
      b.onclick = () => b.parentElement.classList.add('hidden');
    }
    $('phone-x').onclick = () => this.hide('phone');
    $('phone-home').onclick = () => {
      if (this.phoneApp && this.phoneApp !== 'home') this.net.send({ t: 'act', poi: 'phone', act: 'back' });
      this.phoneHome();
    };
    setInterval(() => {
      if (this.world) $('phone-time').textContent = FORMAT.clock(this.world.minute);
    }, 1000);
    for (const b of document.querySelectorAll('#actions button')) {
      b.onclick = () => this.action(b.dataset.act);
    }
    for (const b of document.querySelectorAll('#chat .tabs button[data-tab]')) {
      b.onclick = () => {
        this.chatTab = b.dataset.tab;
        for (const o of document.querySelectorAll('#chat .tabs button[data-tab]')) o.classList.toggle('on', o === b);
        for (const line of $('chat-log').children) this.filterLine(line);
      };
    }
    const emotes = $('emotes');
    for (const e of EMOTES) {
      const b = el('button', null, e);
      b.onclick = () => {
        this.net.send({ t: 'emote', e });
        emotes.classList.add('hidden');
      };
      emotes.append(b);
    }
    $('chat-form').onsubmit = (e) => {
      e.preventDefault();
      const text = $('chat-in').value.trim();
      if (!text) return $('chat-in').blur();
      const ch = $('chat-ch').value;
      if (ch === 'led') this.net.send({ t: 'led', text });
      else this.net.send({ t: 'chat', ch, text });
      $('chat-in').value = '';
    };
    window.addEventListener('keydown', (e) => {
      if (!this.self) return;
      if (this.locked) return;
      if (e.key === 'Escape') {
        document.activeElement?.blur();
        this.closePanels();
        return;
      }
      if (this.typing) return;
      const k = e.key.toLowerCase();
      if (e.key === 'Enter') {
        e.preventDefault();
        $('chat-in').focus();
      } else if (k >= '1' && k <= '5') this.useHotbar(Number(k) - 1);
      else if (k === 'i') this.action('inv');
      else if (k === 'c') this.action('equip');
      else if (k === 'q') this.action('quests');
      else if (k === 'p') this.action('phone');
      else if (k === 'b') this.action('stall');
      else if (k === 'h') this.action('help');
    });
  }

  hide(id) {
    $(id).classList.add('hidden');
  }

  toggle(id) {
    const e = $(id);
    e.classList.toggle('hidden');
    return !e.classList.contains('hidden');
  }

  action(a) {
    if (a === 'inv') {
      this.hide('equip');
      if (this.toggle('inv')) this.renderInv();
    } else if (a === 'equip') {
      this.hide('inv');
      if (this.toggle('equip')) this.renderEquip();
    } else if (a === 'help') this.toggle('help');
    else if (a === 'emote') this.toggle('emotes');
    else if (a === 'chat') {
      // Phai focus ngay trong su kien cham thi iOS moi bat ban phim ao
      const open = document.body.classList.toggle('chat-open');
      if (open) $('chat-in').focus();
      else document.activeElement?.blur();
    }
    else if (a === 'phone') this.togglePhone();
    else if (a === 'quests') {
      if (!this.self.equip.phone) return this.toggleQuestsDialog();
      this.net.send({ t: 'poi', id: 'phone' });
      this.net.send({ t: 'act', poi: 'phone', act: 'app', args: { app: 'quests' } });
    }
    else if (a === 'gm') this.gm.toggle();
    else if (a === 'stall') {
      // Cho Sap Hang Hoa: xem tu xa bang dien thoai, toi cho thi thao tac duoc
      if (!this.self.equip.phone) return this.toast('Tới Chợ Sạp Hàng Hóa (Khu 1) để thuê sạp, mua bán.');
      this.net.send({ t: 'market', a: 'view' });
    }
  }

  setSelf(s) {
    this.self = s;
    if (this.home.active && this.home.edit) this.home.renderTray();
    if (this.mall.active) this.mall.refresh();
    if (this.market.active) this.market.refresh();
    $('btn-gm').classList.toggle('hidden', !s.gm);
    $('h-name').textContent = s.name;
    $('h-title').textContent = s.title ? `「${s.title}」` : '';
    $('h-class').textContent = `${s.clsName} · ${s.rankName}`;
    const bar = (key, v, max = 100) => {
      $(`b-${key}`).style.width = `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
      $(`v-${key}`).textContent = Math.round(v);
    };
    bar('hunger', s.stats.hunger ?? 100);
    bar('stamina', s.stats.stamina);
    bar('mood', 100 - s.stats.stress);
    $('l-cls').textContent = s.statName;
    bar('cls', s.stats[s.statKey], s.rank === 0 ? 40 : 100);
    $('m-cash').textContent = vnd(s.cash);
    $('m-bank').textContent = vnd(s.bank);
    $('m-dia').textContent = s.diamonds;
    $('m-social').textContent = s.social;
    $('m-data').textContent = s.data;
    const extra = [`Thu hút ${s.calc.charisma}`, `Tốc độ ${s.calc.speed}`];
    if (s.mail) extra.push(`📬 ${s.mail} thư`);
    if ((s.stats.hunger ?? 100) < 20) extra.push('⚠️ Đói bụng');
    if (s.stats.stamina < 10) extra.push('⚠️ Kiệt sức');
    if (s.stats.stress >= 90) extra.push('⚠️ Tinh thần sa sút');
    $('m-extra').textContent = extra.join(' · ');
    const left = (s.daily.q || []).filter((q) => !q.done).length;
    $('q-badge').textContent = left;
    $('q-badge').classList.toggle('hidden', !left);
    // Chi ve lai tui / trang bi khi do dac thay doi (tranh nut bi thay lien tuc khi dang bam)
    const sig = JSON.stringify([s.inv, s.equip, s.cash, s.calc, s.buffs.length]);
    if (sig === this.invSig) return;
    this.invSig = sig;
    this.renderHotbar();
    if (!$('inv').classList.contains('hidden')) this.renderInv();
    if (!$('equip').classList.contains('hidden')) this.renderEquip();
  }

  // Khong co dien thoai: xem nhiem vu trong hop thoai thuong
  toggleQuestsDialog() {
    const q = this.self.daily.q || [];
    this.openDialog({
      title: '📜 Nhiệm vụ hôm nay',
      text: q.map((x) => {
        const def = QUESTS[x.id];
        return `${x.done ? '✅' : '⬜'} ${def.name} (${def.key === 'earn' ? `${vnd(x.have)}/${vnd(def.need)}` : `${x.have}/${def.need}`}) · +${vnd(def.reward)}`;
      }).join('\n'),
      options: [],
    });
  }

  setWorld(w) {
    this.world = w;
    $('clock').textContent = `Ngày ${w.day} · ${FORMAT.clock(w.minute)} · ${WEATHER[w.weather]} · 👥 ${w.online ?? ''}`;
  }

  setPosition(x) {
    const z = zoneAt(x);
    if (this.zoneId !== z.id) {
      this.zoneId = z.id;
      $('zone').textContent = `📍 ${z.name}`;
      this.toast(`Bạn đã đến ${z.name}`, 'info');
    }
    if (this.mmMe) this.mmMe.style.left = `${(x / WORLD.width) * 100}%`;
  }

  buildMinimap() {
    const mm = $('minimap');
    mm.textContent = '';
    for (const z of ZONES) {
      const d = el('div', 'z');
      d.style.width = `${((z.x1 - z.x0) / WORLD.width) * 100}%`;
      d.style.background = ZONE_COLORS[z.id];
      d.title = z.name;
      mm.append(d);
    }
    this.mmMe = el('div', 'me');
    mm.append(this.mmMe);
  }

  toast(msg, kind = 'info') {
    const t = el('div', `toast ${kind}`, msg);
    $('toasts').prepend(t);
    while ($('toasts').children.length > 5) $('toasts').lastChild.remove();
    setTimeout(() => t.remove(), kind === 'bad' ? 7000 : 5000);
  }

  // ------------------------------------------------------------ chat
  addChat(m) {
    const line = el('div', `m ${m.ch}`);
    line.dataset.ch = m.ch;
    if (m.ch === 'near') line.append(el('b', null, `${m.from}: `), m.text);
    else if (m.ch === 'global') line.append(el('span', 'tag', '[TG] '), el('b', null, `${m.from}${m.title ? ` 「${m.title}」` : ''}: `), m.text);
    else if (m.ch === 'news') line.append(`📮 ${m.text}`);
    else if (m.ch === 'led') line.append(`🌈 ${m.from}: ${m.text}`);
    else line.append(m.text);
    this.filterLine(line);
    const log = $('chat-log');
    const atBottom = log.scrollTop + log.clientHeight >= log.scrollHeight - 30;
    log.append(line);
    while (log.children.length > 150) log.firstChild.remove();
    if (atBottom) log.scrollTop = log.scrollHeight;
  }

  filterLine(line) {
    const ch = line.dataset.ch;
    const show = this.chatTab === 'all' || ch === this.chatTab || (this.chatTab === 'global' && ch === 'led');
    line.classList.toggle('hidden', !show);
  }

  led(m) {
    this.addChat({ ch: 'led', from: m.from, text: m.text });
    this.ledQueue.push(`${m.system ? '📢' : '🌈'} ${m.from}: ${m.text}`);
    if (!this.ledBusy) this.nextLed();
  }

  nextLed() {
    const text = this.ledQueue.shift();
    const box = $('led');
    if (!text) {
      this.ledBusy = false;
      box.classList.add('hidden');
      return;
    }
    this.ledBusy = true;
    box.classList.remove('hidden');
    const track = $('led-track');
    track.textContent = text;
    const w = track.offsetWidth + window.innerWidth;
    const dur = Math.max(7000, w * 9);
    track.animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${w}px)` }], { duration: dur, easing: 'linear' })
      .onfinish = () => this.nextLed();
  }

  // ------------------------------------------------------------ hoi thoai
  openDialog(d) {
    if (d.poi === 'phone') return this.renderPhone(d);
    this.dialog = d;
    const face = PORTRAIT[d.poi];
    $('dlg-portrait').classList.toggle('hidden', !face);
    if (face) $('dlg-portrait').src = `assets/ui/portrait_${face}.png`;
    $('dlg-title').textContent = d.title;
    $('dlg-text').textContent = d.text || '';
    const box = $('dlg-opts');
    box.textContent = '';
    box.append(this.optionRows(d));
    $('dialog').classList.remove('hidden');
  }

  optionRows(d) {
    const box = document.createDocumentFragment();
    for (const o of d.options || []) {
      const row = el('div', `opt${o.inputs?.length ? ' has-in' : ''}`);
      const fields = {};
      for (const inp of o.inputs || []) {
        let f;
        if (inp.type === 'select') {
          f = el('select');
          for (const op of inp.options) {
            const oe = el('option', null, op.l);
            oe.value = op.v;
            f.append(oe);
          }
        } else {
          f = el('input');
          f.type = inp.type === 'number' ? 'number' : 'text';
          if (inp.ph) f.placeholder = inp.ph;
          if (inp.value != null) f.value = inp.value;
          if (inp.min != null) f.min = inp.min;
          if (inp.max != null) f.max = inp.max;
        }
        if (inp.w) f.style.width = `${inp.w}px`;
        fields[inp.name] = f;
        row.append(f);
      }
      const b = el('button', null, o.label);
      b.disabled = !!o.disabled;
      b.onclick = () => {
        const inputs = Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, f.value]));
        this.net.send({ t: 'act', poi: o.poi || d.poi, act: o.act, args: o.args || {}, inputs });
      };
      row.prepend(b);
      box.append(row);
    }
    return box;
  }

  // ------------------------------------------------------------ tui do dang luoi (INVENTORY_V2)
  invCapacity() {
    const s = this.self;
    const bag = s.equip.lung && s.inv.some((i) => i.uid === s.equip.lung);
    return INV.base + (bag ? INV.bag : 0);
  }

  renderInv() {
    const s = this.self;
    const equipped = new Set(Object.values(s.equip));
    const cap = this.invCapacity();
    const tabs = $('inv-tabs');
    if (!tabs.childElementCount) {
      for (const t of INV_TABS) {
        const b = el('button');
        b.title = t.name;
        b.dataset.tab = t.id;
        const img = el('img');
        img.src = `assets/ui/tab_${t.icon}.png`;
        img.alt = t.name;
        b.append(img);
        b.onclick = () => {
          this.invTab = t.id;
          this.renderInv();
        };
        tabs.append(b);
      }
      $('inv-sort').onclick = () => this.net.send({ t: 'inv_sort' });
    }
    for (const b of tabs.children) b.classList.toggle('on', b.dataset.tab === this.invTab);

    $('inv-count').textContent = `${s.inv.length}/${cap}`;
    $('inv-count').classList.toggle('over', s.inv.length > cap);
    $('inv-cash').textContent = `💵 ${vnd(s.cash)}`;

    const tab = INV_TABS.find((t) => t.id === this.invTab);
    const items = s.inv.filter((it) => tab.match(ITEMS[it.id]));
    const grid = $('inv-grid');
    grid.textContent = '';
    const total = this.invTab === 'all' ? Math.max(INV.base + INV.bag, s.inv.length) : Math.max(cap, items.length);
    for (let i = 0; i < total; i++) {
      const it = items[i];
      const cell = el('div', 'cell');
      if (!it) {
        if (this.invTab === 'all' && i >= cap) {
          cell.classList.add('lock');
          cell.title = 'Đeo balo để mở thêm 10 ô';
        }
        grid.append(cell);
        continue;
      }
      const def = ITEMS[it.id];
      if (def.type === 'equip') cell.classList.add(`r-${def.rar || 'common'}`);
      if (it.uid === this.invSel) cell.classList.add('sel');
      cell.append(this.icon(it.id, def.icon, 34));
      if (def.type !== 'equip' && it.qty > 1) cell.append(el('span', 'q', it.qty));
      if (it.lvl) cell.append(el('span', 'lv', `+${it.lvl}`));
      if (equipped.has(it.uid)) cell.append(el('span', 'on', '✅'));
      if (def.type === 'equip') cell.append(this.durBar(it));
      cell.onclick = () => {
        // Cam ung khong co bam dup (o bi ve lai sau lan cham dau): cham lan 2 vao o dang chon = dung/mac
        if (document.body.classList.contains('touch') && this.invSel === it.uid) return this.useOrEquip(it);
        this.invSel = it.uid;
        this.renderInv();
      };
      cell.ondblclick = () => this.useOrEquip(it);
      this.tipOn(cell, () => this.itemTip(it));
      grid.append(cell);
    }
    this.renderInvDetail(s.inv.find((i) => i.uid === this.invSel), equipped);
  }

  durBar(it) {
    const dur = el('div', 'dur');
    const bar = el('i');
    bar.style.width = `${it.dur}%`;
    if (it.dur < 30) bar.style.background = 'var(--red)';
    dur.append(bar);
    return dur;
  }

  useOrEquip(it) {
    const def = ITEMS[it.id];
    if (def.type === 'equip') {
      if (Object.values(this.self.equip).includes(it.uid)) this.net.send({ t: 'unequip', slot: def.slot });
      else this.net.send({ t: 'equip', uid: it.uid });
    } else if (['food', 'data', 'book'].includes(def.type)) this.net.send({ t: 'use', uid: it.uid });
  }

  renderInvDetail(it, equipped) {
    const s = this.self;
    const box = $('inv-detail');
    box.textContent = '';
    if (!it) {
      box.append(el('div', 'muted', 'Bấm một ô để xem và thao tác. Bấm đúp để dùng / mặc. Rê chuột để xem thông tin. Bày bán ở Chợ Sạp Hàng Hóa.'));
      return;
    }
    const def = ITEMS[it.id];
    const on = equipped.has(it.uid);
    const nm = el('div', `nm rar-${def.type === 'equip' ? def.rar || 'common' : 'common'}`, `${def.name}${it.lvl ? ` +${it.lvl}` : ''}${def.type !== 'equip' ? ` ×${it.qty}` : ''}`);
    box.append(nm, el('div', 'desc', this.itemDesc(def)));
    const row = el('div', 'row');
    const btn = (label, fn) => {
      const b = el('button', null, label);
      b.onclick = fn;
      row.append(b);
      return b;
    };
    if (['food', 'data', 'book'].includes(def.type)) btn(def.type === 'book' ? 'Đọc' : 'Dùng', () => this.net.send({ t: 'use', uid: it.uid }));
    if (def.type === 'equip') {
      if (on) btn('Tháo', () => this.net.send({ t: 'unequip', slot: def.slot }));
      else btn('Trang bị', () => this.net.send({ t: 'equip', uid: it.uid }));
    }
    if (def.type === 'food' || def.type === 'data') btn('Thêm vào thanh nhanh', () => this.addHotbar(it.id));
    if (!on) {
      btn('Vứt', () => {
        if (confirm(`Vứt bỏ ${def.name}?`)) this.net.send({ t: 'drop', uid: it.uid });
      });
    }
    box.append(row);
  }

  itemDesc(def) {
    if (def.type === 'furn') return `${furnDesc(def)} · giá gốc ${vnd(def.base)} · đặt trong phòng trọ (Sắp xếp)`;
    if (def.type === 'equip') {
      return `${SLOTS[def.slot]} · ${RARITY[def.rar || 'common']} · ${Object.entries(def.st).map(([k, v]) => `${STAT_NAME[k]} ${v}`).join(', ')}`;
    }
    const parts = [TYPE_NAME[def.type]];
    if (def.eff) parts.push(Object.entries(def.eff).map(([k, v]) => effText(k, v)).join(', '));
    if (def.base) parts.push(`giá gốc ${vnd(def.base)}`);
    return parts.join(' · ');
  }

  // O thong tin (I6): ten mau theo do hiem, cong dung, so sanh voi mon dang mac
  itemTip(it) {
    const s = this.self;
    const def = ITEMS[it.id];
    const rar = def.type === 'equip' ? def.rar || 'common' : 'common';
    const w = el('div');
    w.append(el('b', `rar-${rar}`, `${def.name}${it.lvl ? ` +${it.lvl}` : ''}`));
    w.append(el('div', 'muted', def.type === 'equip' ? `${SLOTS[def.slot]} · ${RARITY[rar]}` : TYPE_NAME[def.type]));
    if (def.eff) for (const [k, v] of Object.entries(def.eff)) w.append(el('div', null, effText(k, v)));
    if (def.furn) w.append(el('div', null, furnDesc(def)));
    if (def.type === 'equip') {
      const cur = s.inv.find((i) => i.uid === s.equip[def.slot]);
      const curSt = cur && cur.uid !== it.uid ? ITEMS[cur.id].st : null;
      for (const k of new Set([...Object.keys(def.st), ...Object.keys(curSt || {})])) {
        const v = def.st[k] || 0;
        const line = el('div', null, `${STAT_NAME[k]} ${v}`);
        if (curSt) {
          const d = v - (curSt[k] || 0);
          if (d) line.append(el('span', d > 0 ? 'up' : 'down', `  (${d > 0 ? '+' : ''}${d})`));
        }
        w.append(line);
      }
      w.append(el('div', 'muted', `Độ bền ${Math.round(it.dur)}%`));
    }
    if (def.base) w.append(el('div', 'muted', `Bán lại khoảng ${vnd(def.base * 0.5)}`));
    return w;
  }

  tipOn(node, build) {
    const tip = $('tip');
    node.onmouseenter = (e) => {
      tip.textContent = '';
      tip.append(build());
      tip.classList.remove('hidden');
      node.onmousemove(e);
    };
    node.onmousemove = (e) => {
      const x = Math.min(e.clientX + 16, window.innerWidth - tip.offsetWidth - 8);
      const y = Math.min(e.clientY + 16, window.innerHeight - tip.offsetHeight - 8);
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    };
    node.onmouseleave = () => tip.classList.add('hidden');
  }

  // ------------------------------------------------------------ thanh dung nhanh (I5)
  loadHotbar() {
    try {
      const v = JSON.parse(localStorage.getItem(`hr_hotbar_${this.self.name}`) || '[]');
      this.hotbar = Array.from({ length: 5 }, (_, i) => (ITEMS[v[i]] ? v[i] : null));
    } catch {
      this.hotbar = [null, null, null, null, null];
    }
  }

  saveHotbar() {
    try {
      localStorage.setItem(`hr_hotbar_${this.self.name}`, JSON.stringify(this.hotbar));
    } catch { /* trinh duyet chan luu tru */ }
  }

  addHotbar(id) {
    if (this.hotbar.includes(id)) return this.toast('Món này đã có trên thanh nhanh.');
    const i = this.hotbar.indexOf(null);
    if (i < 0) return this.toast('Thanh nhanh đã đầy — bấm chuột phải vào một ô để gỡ.', 'warn');
    this.hotbar[i] = id;
    this.saveHotbar();
    this.renderHotbar();
  }

  useHotbar(i) {
    const id = this.hotbar[i];
    if (!id) return;
    const st = this.self.inv.find((it) => it.id === id);
    if (!st) return this.toast(`Hết ${ITEMS[id].name} rồi.`, 'warn');
    this.net.send({ t: 'use', uid: st.uid });
  }

  renderHotbar() {
    if (!this.hotbar) this.loadHotbar();
    const bar = $('hotbar');
    bar.textContent = '';
    this.hotbar.forEach((id, i) => {
      const hs = el('div', 'hs');
      hs.style.left = `${HOTBAR_X[i]}%`;
      hs.append(el('span', 'k', i + 1));
      if (id) {
        const n = this.self.inv.filter((it) => it.id === id).reduce((a, it) => a + it.qty, 0);
        hs.append(this.icon(id, ITEMS[id].icon, 34));
        hs.append(el('span', 'q', n));
        if (!n) hs.classList.add('out');
        hs.title = `${ITEMS[id].name} (phím ${i + 1}) — chuột phải / nhấn giữ để gỡ`;
        const unset = () => {
          this.hotbar[i] = null;
          this.saveHotbar();
          this.renderHotbar();
        };
        hs.oncontextmenu = (e) => {
          e.preventDefault();
          unset();
        };
        // Cam ung: nhan giu 600ms de go khoi thanh nhanh
        let hold = null;
        hs.addEventListener('pointerdown', (e) => {
          if (e.pointerType === 'mouse') return;
          hold = setTimeout(() => {
            hold = 'done';
            unset();
          }, 600);
        });
        for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) {
          hs.addEventListener(ev, () => {
            if (hold && hold !== 'done') clearTimeout(hold);
          });
        }
      }
      hs.onclick = () => this.useHotbar(i);
      bar.append(hs);
    });
  }

  // ------------------------------------------------------------ trang bi: bup be giay
  renderEquip() {
    const s = this.self;
    const doll = $('doll');
    doll.textContent = '';
    for (const slot of DOLL_SLOTS) {
      const it = s.inv.find((i) => i.uid === s.equip[slot]);
      const [x, y] = DOLL_POS[slot];
      const d = el('div', 'ds');
      d.style.left = `${x}%`;
      d.style.top = `${y}%`;
      if (it) {
        const def = ITEMS[it.id];
        d.classList.add('full', `r-${def.rar || 'common'}`);
        d.append(this.icon(it.id, def.icon, 40));
        if (it.lvl) d.append(el('span', 'lv', `+${it.lvl}`));
        d.append(this.durBar(it));
        d.onclick = () => this.net.send({ t: 'unequip', slot });
        this.tipOn(d, () => {
          const w = this.itemTip(it);
          w.append(el('div', 'muted', 'Bấm để tháo'));
          return w;
        });
      } else {
        d.title = `${SLOTS[slot]} — trống. Mở Túi đồ để mặc.`;
        d.onclick = () => this.action('inv');
      }
      doll.append(d);
    }
    // O cu chua co tren bup be giay: chi hien khi dang mac do
    const extra = $('equip-extra');
    extra.textContent = '';
    for (const slot of Object.keys(SLOTS).filter((k) => !DOLL_SLOTS.includes(k))) {
      const it = s.inv.find((i) => i.uid === s.equip[slot]);
      if (!it) continue;
      const def = ITEMS[it.id];
      const d = el('div', 'ex');
      d.append(this.icon(it.id, def.icon, 20), `${SLOTS[slot]}: ${def.name}${it.lvl ? ` +${it.lvl}` : ''}`);
      d.title = 'Bấm để tháo';
      d.onclick = () => this.net.send({ t: 'unequip', slot });
      extra.append(d);
    }
    const total = Object.values(s.equip).reduce((n, uid) => {
      const it = s.inv.find((i) => i.uid === uid);
      return n + (it ? ITEMS[it.id].base : 0);
    }, 0);
    const worn = DOLL_SLOTS.map((k) => s.inv.find((i) => i.uid === s.equip[k])).filter(Boolean)
      .sort((a, b) => a.dur - b.dur)[0];
    const stats = $('equip-stats');
    stats.textContent = '';
    const st = (label, v) => {
      const d = el('div', 'st');
      d.append(el('span', null, label), el('b', null, v));
      stats.append(d);
    };
    st('✨ Thu hút', s.calc.charisma);
    st('🏃 Tốc độ đi', s.calc.speed);
    st('⚡ Tiết kiệm NL', `${Math.round(s.calc.staminaSave)}%`);
    st('🎒 Sức chứa túi', this.invCapacity());
    st('💰 Giá trị đồ mặc', vnd(total));
    if (worn) st('🔧 Bền thấp nhất', `${SLOTS[ITEMS[worn.id].slot]} ${Math.round(worn.dur)}%`);
    const buffs = s.buffs.map((b) => `${b.name} (${Math.floor(b.left / 60)}h${b.left % 60}p)`);
    $('equip-buffs').textContent = buffs.length
      ? `Hiệu ứng: ${buffs.join(', ')}`
      : `Cường hóa / sửa đồ tại Chú Sửa Xe (cần ⚙️ linh kiện). Loa LED: ${ECON.ledCost}💎.`;
  }

  // ------------------------------------------------------------ dien thoai (G58)
  togglePhone() {
    if (!$('phone').classList.contains('hidden')) return this.hide('phone');
    if (!this.self.equip.phone) return this.toast('Bạn chưa trang bị điện thoại', 'bad');
    this.net.send({ t: 'poi', id: 'phone' });
  }

  phoneHome() {
    this.phoneApp = 'home';
    const body = $('phone-body');
    body.textContent = '';
    const grid = el('div', 'apps');
    for (const a of PHONE_APPS) {
      const b = el('button', 'app');
      const img = el('img');
      img.src = `assets/ui/app_${a.icon}.png`;
      img.alt = '';
      b.append(img, el('span', null, a.name));
      b.onclick = () => {
        if (a.client) this[a.client]();
        else this.net.send({ t: 'act', poi: 'phone', act: 'app', args: { app: a.id } });
      };
      grid.append(b);
    }
    body.append(grid);
    const s = this.self;
    body.append(el('div', 'phone-hello', `${s.name} · ${s.clsName}\n4G: ${s.data} tin · 💎 ${s.diamonds}`));
  }

  phoneShell(title, iconId) {
    const body = $('phone-body');
    body.textContent = '';
    const w = el('div', 'phone-app');
    const h = el('h4');
    const img = el('img');
    img.src = `assets/ui/app_${iconId}.png`;
    h.append(img, title);
    w.append(h);
    body.append(w);
    return w;
  }

  renderPhone(d) {
    $('phone').classList.remove('hidden');
    this.hide('dialog');
    this.dialog = d;
    if (!d.app || d.app === 'home') return this.phoneHome();
    this.phoneApp = d.app;
    const meta = PHONE_APPS.find((a) => a.id === d.app);
    const w = this.phoneShell(d.title.replace(/^\S+\s/, ''), meta?.icon || 'settings');
    if (d.text) w.append(el('div', 'txt', d.text));
    w.append(this.optionRows(d));
  }

  // App Ban do: bam dia diem -> nhan vat tu di toi
  phoneMap() {
    this.phoneApp = 'map';
    const w = this.phoneShell('Bản đồ', 'map');
    w.append(el('div', 'txt', 'Bấm một địa điểm để tự đi bộ tới.'));
    for (const z of ZONES) {
      const zh = el('div', 'map-zone', z.name);
      zh.style.background = ZONE_COLORS[z.id];
      w.append(zh);
      for (const p of POIS.filter((x) => x.x >= z.x0 && x.x < z.x1 && !x.hidden && !HIDDEN_POI.has(x.kind))) {
        const b = el('button', 'map-poi', `${POI_EMOJI[p.kind] || '📍'} ${p.name}`);
        b.onclick = () => {
          this.hide('phone');
          this.onNavigate?.(p);
        };
        w.append(b);
      }
    }
  }

  phoneSettings() {
    this.phoneApp = 'settings';
    const w = this.phoneShell('Cài đặt', 'settings');
    const help = el('button', 'btn', '❓ Hướng dẫn chơi');
    help.onclick = () => {
      this.hide('phone');
      this.action('help');
    };
    const out = el('button', 'btn', '🚪 Đăng xuất (đổi nhân vật)');
    out.onclick = () => {
      if (!confirm('Đăng xuất khỏi nhân vật này? Lần sau vào lại bằng nút "Tiếp tục" sẽ không còn — hãy nhớ tên nhân vật.')) return;
      try {
        localStorage.removeItem('hr_token');
        localStorage.removeItem('hr_name');
      } catch { /* bo qua */ }
      location.reload();
    };
    for (const b of [help, out]) {
      b.style.cssText = 'width:100%;margin-top:6px';
      w.append(b);
    }
  }

  closePanels() {
    for (const id of ['dialog', 'inv', 'equip', 'help', 'emotes', 'phone', 'gm']) this.hide(id);
    $('tip').classList.add('hidden');
  }
}

// ------------------------------------------------------------ du lieu hien thi
const INV_TABS = [
  { id: 'all', name: 'Tất cả', icon: 'all', match: () => true },
  { id: 'food', name: 'Ăn uống', icon: 'food', match: (d) => d.type === 'food' },
  { id: 'ingredient', name: 'Nguyên liệu', icon: 'ingredient', match: (d) => d.type === 'ingredient' },
  { id: 'equip', name: 'Trang bị', icon: 'equip', match: (d) => d.type === 'equip' },
  { id: 'furn', name: 'Nội thất', icon: 'furniture', match: (d) => d.type === 'furn' },
  { id: 'other', name: 'Khác', icon: 'other', match: (d) => !['food', 'ingredient', 'equip', 'furn'].includes(d.type) },
];
const TYPE_NAME = {
  furn: 'Nội thất', book: 'Sách', tool: 'Dụng cụ', food: 'Ăn uống', ingredient: 'Nguyên liệu', material: 'Vật liệu', collectible: 'Sưu tầm', data: 'Gói cước', equip: 'Trang bị',
};
const STAT_NAME = { charisma: 'Thu hút', speed: 'Tốc độ %', staminaSave: 'Tiết kiệm NL %', vehicle: 'Xe ×' };
const EFF_NAME = { hunger: 'No bụng', stamina: 'Năng lượng', stress: 'Tinh thần' };
// stress noi bo = nguoc voi Tinh than
const effText = (k, v) => {
  const d = k === 'stress' ? -v : v;
  return `${EFF_NAME[k] || k} ${d > 0 ? '+' : ''}${d}`;
};
// Vi tri 5 o tren anh thanh dung nhanh (% chieu ngang)
const HOTBAR_X = [7.4, 25.6, 43.0, 60.6, 77.7];
// Vi tri 8 o tren anh bup be giay (% goc tren-trai)
const DOLL_POS = {
  non: [40.5, 7.7], kinh: [70.6, 12.6], ao: [10.6, 32.4], dongho: [70.6, 32.4],
  quan: [10.6, 52.9], lung: [70.6, 52.9], giay: [10.6, 73.6], phone: [70.6, 73.6],
};
// App dien thoai. client: mo ngay o client (khong can server). Taxi tam an (chua co he thong taxi).
const PHONE_APPS = [
  { id: 'jobs', name: 'Việc Làm', icon: 'jobs' },
  { id: 'bank', name: 'Ngân hàng', icon: 'bank' },
  { id: 'map', name: 'Bản đồ', icon: 'map', client: 'phoneMap' },
  { id: 'market', name: 'Chợ', icon: 'market' },
  { id: 'quests', name: 'Nhiệm vụ', icon: 'quests' },
  { id: 'friends', name: 'Bạn bè', icon: 'friends' },
  { id: 'settings', name: 'Cài đặt', icon: 'settings', client: 'phoneSettings' },
];
const POI_EMOJI = {
  school: '🏫', tro: '🏠', net: '🖥️', veso: '🎫', buudien: '📮', cafe: '☕', banhmi: '🥖', bangdia: '📼', market: '🧺', mall: '🛍️', tutor: '📚', apartment: '🏢',
  barber: '💈', cho: '🧺', mechanic: '🔧', atm: '🏧', bank: '🏦', office: '🏢', auction: '🔨', showroom: '🛵',
  fashion: '👗', junk: '♻️', comtam: '🍛', trasua: '🧋',
};
const HIDDEN_POI = new Set();
