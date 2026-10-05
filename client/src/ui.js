// Giao dien HTML phu tren canvas: dang nhap, HUD, chat, hoi thoai, tui do, trang bi, LED.
import { CLASSES, ECON, FORMAT, ITEMS, SKINS, SLOTS, WORLD, ZONES, zoneAt } from '/shared/config.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const vnd = FORMAT.vnd;
const WEATHER = { sunny: '🌤️ Trời đẹp', hot: '🔥 Nắng gắt', rain: '🌧️ Mưa ngập' };
const ZONE_COLORS = { daihoc: '#5f9e54', phoam: '#d98a3a', cbd: '#4f8fc9', ngoaio: '#8a7458' };
const CLASS_DESC = {
  sv: 'Điểm danh, cày net, phụ quán, nhặt ve chai. Tiền ít nhưng tự do.',
  vp: 'Chấm công, làm KPI, lương đều về tài khoản. Khách hàng sộp.',
  tt: 'Nhập hàng, chế biến, bày sạp. Động cơ của cả khu chợ.',
};
const DEFAULT_SKIN = { sv: 'sv_male', vp: 'vp_male', tt: 'baba_female' };
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

    net.on('error', (m) => { $('login-err').textContent = m.msg; });
    net.on('self', (m) => this.setSelf(m.self));
    net.on('toast', (m) => this.toast(m.msg, m.kind));
    net.on('chat', (m) => this.addChat(m));
    net.on('led', (m) => this.led(m));
    net.on('dialog', (m) => this.openDialog(m));
    net.on('dialog_close', () => this.hide('dialog'));
    net.on('time', (m) => this.setWorld(m));

    this.bindHud();
  }

  // Icon art (assets/icons/<id>.png); chua co art thi dung emoji
  icon(id, fallback, size = 28) {
    if (!this.icons.has(id)) return el('span', 'emo', fallback);
    const img = el('img', 'icon');
    img.src = `assets/icons/${id}.png`;
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
      this.net.send({ t: 'hello', name: $('in-name').value, cls: this.pick.cls, skin: this.pick.skin });
    };
    $('btn-play').onclick = play;
    $('in-name').onkeydown = (e) => e.key === 'Enter' && play();
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
    for (const b of document.querySelectorAll('#actions button')) {
      b.onclick = () => this.action(b.dataset.act);
    }
    for (const b of document.querySelectorAll('#chat .tabs button')) {
      b.onclick = () => {
        this.chatTab = b.dataset.tab;
        for (const o of document.querySelectorAll('#chat .tabs button')) o.classList.toggle('on', o === b);
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
      if (e.key === 'Escape') {
        document.activeElement?.blur();
        for (const id of ['dialog', 'inv', 'equip', 'help', 'emotes']) this.hide(id);
        return;
      }
      if (this.typing) return;
      const k = e.key.toLowerCase();
      if (e.key === 'Enter') {
        e.preventDefault();
        $('chat-in').focus();
      } else if (k === 'i') this.action('inv');
      else if (k === 'c') this.action('equip');
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
    else if (a === 'phone') this.net.send({ t: 'poi', id: 'phone' });
    else if (a === 'stall') {
      if (this.self.stall) this.net.send({ t: 'poi', id: `stall:${this.self.name}` });
      else this.net.send({ t: 'stall_open' });
    }
  }

  setSelf(s) {
    this.self = s;
    $('h-name').textContent = s.name;
    $('h-title').textContent = s.title ? `「${s.title}」` : '';
    $('h-class').textContent = `${s.clsName} · ${s.rankName}`;
    const bar = (key, v, max = 100) => {
      $(`b-${key}`).style.width = `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
      $(`v-${key}`).textContent = Math.round(v);
    };
    bar('stamina', s.stats.stamina);
    bar('stress', s.stats.stress);
    $('l-cls').textContent = s.statName;
    bar('cls', s.stats[s.statKey], s.rank === 0 ? 40 : 100);
    $('m-cash').textContent = vnd(s.cash);
    $('m-bank').textContent = vnd(s.bank);
    $('m-dia').textContent = s.diamonds;
    $('m-social').textContent = s.social;
    $('m-data').textContent = s.data;
    const extra = [`Thu hút ${s.calc.charisma}`, `Tốc độ ${s.calc.speed}`];
    if (s.mail) extra.push(`📬 ${s.mail} thư`);
    if (s.stats.stamina < 10) extra.push('⚠️ Kiệt sức');
    if (s.stats.stress >= 90) extra.push('⚠️ Quá căng thẳng');
    $('m-extra').textContent = extra.join(' · ');
    if (!$('inv').classList.contains('hidden')) this.renderInv();
    if (!$('equip').classList.contains('hidden')) this.renderEquip();
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
    this.dialog = d;
    $('dlg-title').textContent = d.title;
    $('dlg-text').textContent = d.text || '';
    const box = $('dlg-opts');
    box.textContent = '';
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
    $('dialog').classList.remove('hidden');
  }

  // ------------------------------------------------------------ tui do / trang bi
  renderInv() {
    const s = this.self;
    const list = $('inv-list');
    list.textContent = '';
    const equipped = new Set(Object.values(s.equip));
    if (s.stall) {
      list.append(el('div', 'muted', `🧺 Sạp đang mở${s.stall.legal ? '' : ' (lấn chiếm!)'}: ${s.stall.listings.length}/8 món. Nhấn "Bày bán" để đưa hàng lên sạp.`));
    } else {
      list.append(el('div', 'muted', 'Mẹo: đứng vào ô quy hoạch (khung vàng ở vỉa hè dưới, Khu 1) rồi nhấn B để mở sạp hợp pháp.'));
    }
    if (!s.inv.length) list.append(el('div', 'muted', 'Túi trống.'));
    for (const it of s.inv) {
      const def = ITEMS[it.id];
      const row = el('div', `item${equipped.has(it.uid) ? ' on' : ''}`);
      const ic = el('div', 'ic');
      ic.append(this.icon(it.id, def.icon, 34));
      row.append(ic);
      const info = el('div');
      const nm = el('div', 'nm', `${def.name} `);
      if (it.lvl) nm.append(el('span', 'lv', `+${it.lvl}`));
      info.append(nm);
      const meta = [];
      if (def.type === 'equip') {
        meta.push(SLOTS[def.slot]);
        meta.push(Object.entries(def.st).map(([k, v]) => `${{ charisma: 'Thu hút', speed: 'Tốc độ%', staminaSave: 'Tiết kiệm thể lực%', vehicle: 'Xe ×' }[k]} ${v}`).join(', '));
        if (equipped.has(it.uid)) meta.push('✅ đang dùng');
      } else {
        meta.push(`×${it.qty}`);
        if (def.eff) meta.push(Object.entries(def.eff).map(([k, v]) => `${k === 'stamina' ? 'Thể lực' : 'Stress'} ${v > 0 ? '+' : ''}${v}`).join(', '));
        meta.push(`giá gốc ${vnd(def.base)}`);
      }
      info.append(el('div', 'meta', meta.join(' · ')));
      if (def.type === 'equip') {
        const dur = el('div', 'dur');
        const bar = el('i');
        bar.style.width = `${it.dur}%`;
        if (it.dur < 30) bar.style.background = 'var(--red)';
        dur.append(bar);
        dur.title = `Độ bền ${Math.round(it.dur)}%`;
        info.append(dur);
      }
      row.append(info);
      const btns = el('div', 'btns');
      const btn = (label, fn) => {
        const b = el('button', null, label);
        b.onclick = fn;
        btns.append(b);
      };
      if (def.type === 'food' || def.type === 'data') btn('Dùng', () => this.net.send({ t: 'use', uid: it.uid }));
      if (def.type === 'equip') {
        if (equipped.has(it.uid)) btn('Tháo', () => this.net.send({ t: 'unequip', slot: def.slot }));
        else btn('Trang bị', () => this.net.send({ t: 'equip', uid: it.uid }));
      }
      if (s.stall && !equipped.has(it.uid)) {
        const qty = el('input');
        qty.type = 'number';
        qty.value = it.qty;
        qty.min = 1;
        qty.max = it.qty;
        qty.title = 'Số lượng';
        const price = el('input');
        price.type = 'number';
        price.value = def.base || 100000;
        price.title = 'Giá mỗi món';
        if (it.qty > 1) btns.append(qty);
        btns.append(price);
        btn('Bày bán', () => this.net.send({ t: 'stall_list', uid: it.uid, qty: Number(qty.value), price: Number(price.value) }));
      }
      if (!equipped.has(it.uid)) {
        btn('Vứt', () => {
          if (confirm(`Vứt bỏ ${def.name}?`)) this.net.send({ t: 'drop', uid: it.uid });
        });
      }
      row.append(btns);
      list.append(row);
    }
  }

  renderEquip() {
    const s = this.self;
    const stats = $('equip-stats');
    stats.textContent = '';
    stats.append(
      el('div', null, `✨ Thu hút: ${s.calc.charisma}`),
      el('div', null, `🏃 Tốc độ: ${s.calc.speed}`),
      el('div', null, `💪 Tiết kiệm thể lực: ${Math.round(s.calc.staminaSave)}%`),
    );
    const slots = $('equip-slots');
    slots.textContent = '';
    for (const [slot, name] of Object.entries(SLOTS)) {
      const it = s.inv.find((i) => i.uid === s.equip[slot]);
      const d = el('div', `slot${it ? ' full' : ''}`);
      d.append(el('small', null, name));
      if (it) {
        const def = ITEMS[it.id];
        const line = el('div', 'slot-item');
        line.append(this.icon(it.id, def.icon, 22), ` ${def.name}${it.lvl ? ` +${it.lvl}` : ''}`);
        d.append(line);
        d.title = 'Click để tháo';
        d.onclick = () => this.net.send({ t: 'unequip', slot });
      } else d.append(el('div', 'muted', '—'));
      slots.append(d);
    }
    const buffs = s.buffs.map((b) => `${b.name} (${Math.floor(b.left / 60)}h${b.left % 60}p)`);
    $('equip-buffs').textContent = buffs.length ? `Hiệu ứng: ${buffs.join(', ')}` : `Cường hóa trang bị tại Chú Sửa Xe (cần ⚙️ linh kiện). Loa LED: ${ECON.ledCost}💎.`;
  }
}
