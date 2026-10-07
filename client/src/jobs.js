// Mini-game cac nghe (GAMEPLAY_V2 G34). Server gui de (tasks) -> choi -> gui dap an, server tu cham.
// Toa do diem bam tinh theo anh nen goc 1024x572 (doi ra %).
import { FORMAT, JOBS, ZONES } from '/shared/config.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const pct = (v, total) => `${(v / total) * 100}%`;
const BW = 1024;
const BH = 572;

// Hop [x0, y0, x1, y1] tren anh nen -> phan tu dinh vi theo %
function box(parent, [x0, y0, x1, y1], cls = 'hot', tag) {
  const d = el('div', cls);
  Object.assign(d.style, { left: pct(x0, BW), top: pct(y0, BH), width: pct(x1 - x0, BW), height: pct(y1 - y0, BH) });
  if (tag) d.append(el('span', 'tag', tag));
  parent.append(d);
  return d;
}

// ---- J1 IT: 6 mau khoi lenh (theo thu tu anh it_block_0..5)
const IT_COLORS = ['#6aa39a', '#c0503d', '#ecc85a', '#ef9443', '#6f9e4f', '#8aa7d8'];

// ---- J2 Phuc vu
const DISHES = [
  { img: 'dish_com_suon', name: 'Cơm sườn' }, { img: 'dish_com_bicha', name: 'Cơm bì chả' }, { img: 'dish_canh', name: 'Canh' },
  { img: 'dish_tra_da', name: 'Trà đá' }, { img: 'dish_trung', name: 'Trứng ốp la' }, { img: 'dish_nuoc_mam', name: 'Nước mắm' },
];
const TABLES = [[210, 230], [510, 230], [815, 230], [210, 425], [512, 425], [815, 425]];
const COUNTER_X = [120, 265, 410, 555, 700, 845];
const PATIENCE = 14000;

// ---- J3 Tra sua (anh quay pha che)
const MT = {
  sizes: [{ name: 'Ly lớn (L)', box: [222, 22, 282, 128] }, { name: 'Ly vừa (M)', box: [176, 124, 232, 216] }, { name: 'Ly nhỏ (S)', box: [166, 336, 224, 436] }],
  teas: [{ name: 'Trà đen', box: [302, 0, 428, 186] }, { name: 'Trà ô long', box: [446, 0, 576, 186] }, { name: 'Trà xanh', box: [592, 0, 722, 186] }],
  tops: [{ name: 'Trân châu đen', box: [296, 420, 404, 572] }, { name: 'Thạch đen', box: [404, 420, 510, 572] },
    { name: 'Pudding', box: [512, 420, 618, 572] }, { name: 'Trân châu cam', box: [620, 420, 728, 572] }],
  seal: [764, 36, 990, 390],
  trash: [676, 296, 744, 434],
};

// ---- Gia su / thi chung chi: 4 the dap an
const CARDS = ['red', 'blue', 'green', 'yellow'];
const QUIZ_GAP = 1300; // >= nhip toi thieu server (1200ms)

// ---- Shipper: ban do thanh pho (anh 956x484) — 4 cot tu trai qua phai = 4 khu theo truc x
const MAP_COLS = [[18, 238], [252, 472], [486, 706], [720, 940]];
const V2 = 'assets/v2';

export class JobGame {
  constructor(net, ui) {
    this.net = net;
    this.ui = ui;
    this.cur = null;
    net.on('job', (m) => this.start(m));
    net.on('job_result', (m) => this.result(m));
    net.on('job_ack', (m) => this.cur?.jid === m.jid && this.cur.onAck?.(m));
    net.on('job_leg', (m) => this.cur?.jid === m.jid && this.cur.onLeg?.(m));
    $('job-quit').onclick = () => this.finish();
    $('jobhud-quit').onclick = () => this.finish();
    $('jobhud-map').onclick = () => $('shipmap').classList.toggle('hidden');
    $('shipmap').onclick = () => $('shipmap').classList.add('hidden');
  }

  // Mini-game mo man rieng thi khoa di chuyen; nghe tren pho (to roi, ship) van di lai binh thuong
  get active() {
    return !!this.cur && !this.cur.street;
  }

  get scene() {
    return this.ui.worldScene;
  }

  start(m) {
    this.ui.closePanels();
    const def = { ...JOBS[m.job], name: m.name, icon: m.icon };
    this.cur = { ...m, def, answers: [], correct: 0, wrong: 0, t0: performance.now(), timers: [], done: false };
    if (m.street) return this.startStreet(m);
    $('job').classList.remove('hidden');
    $('job-title').textContent = m.job === 'exam' ? `${def.icon} Thi ${def.name}` : `${def.icon} ${def.name} · Cấp ${m.lvl}`;
    $('job-quit').disabled = false;
    $('job-quit').textContent = 'Nghỉ ca';
    const stage = $('job-stage');
    stage.textContent = '';
    stage.onpointermove = null;
    stage.onclick = null;
    this[`start_${m.job}`](stage, m);
    this.score();
    this.tick();
  }

  later(fn, ms) {
    const id = setTimeout(fn, ms);
    this.cur.timers.push(id);
  }

  tick() {
    const c = this.cur;
    if (!c || c.done) return;
    const left = Math.max(0, (c.legUntil ?? c.t0 + c.secs * 1000) - performance.now()) / 1000;
    $(c.street ? 'jobhud-time' : 'job-time').textContent = `${Math.ceil(left)}s`;
    // Ship: het han tung don do server xu ly; cac nghe khac het gio la nop
    if (left <= 0 && c.job !== 'ship') return this.finish();
    c.raf = requestAnimationFrame(() => this.tick());
    c.onTick?.();
  }

  score() {
    const c = this.cur;
    if (c.street) {
      if (c.job === 'flyer') $('jobhud-text').textContent = `Đã phát ${c.correct}/${c.target} tờ — bấm vào người đi đường`;
      return;
    }
    $('job-score').textContent = `✅ ${c.correct}/${c.target}${c.wrong ? ` · ❌ ${c.wrong}` : ''}`;
  }

  flash(text, color = '#fff') {
    const f = el('div', 'flash', text);
    f.style.color = color;
    $('job-stage').append(f);
    setTimeout(() => f.remove(), 800);
  }

  hint(t) {
    $('job-hint').textContent = t;
  }

  finish() {
    const c = this.cur;
    if (!c || c.done) return;
    c.done = true;
    cancelAnimationFrame(c.raf);
    for (const t of c.timers) clearTimeout(t);
    $('job-quit').disabled = true;
    $('jobhud-quit').disabled = true;
    this.net.send({ t: 'job_end', jid: c.jid, answers: c.answers });
    if (c.street) return;
    const r = el('div', 'result');
    r.append(el('div', null, 'Đang chấm điểm...'));
    $('job-stage').append(r);
  }

  // Ket qua ca do server gui (ca cham xong / tu ket thuc). Nghe tren pho: mo khung ket qua luc nay.
  result(m) {
    const c = this.cur;
    if (!c) return;
    c.done = true;
    cancelAnimationFrame(c.raf);
    for (const t of c.timers) clearTimeout(t);
    if (c.street) this.stopStreet();
    $('job').classList.remove('hidden');
    $('job-time').textContent = '';
    if (c.street) {
      $('job-title').textContent = `${c.def.icon} ${c.def.name}`;
      $('job-score').textContent = '';
      $('job-stage').textContent = '';
      $('job-hint').textContent = '';
    }
    const stage = $('job-stage');
    stage.querySelector('.result')?.remove();
    const r = el('div', 'result');
    const card = el('div');
    const row = el('div');
    row.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-top:8px';
    const close = el('button', 'btn', 'Về');
    close.onclick = () => this.close();
    if (m.job === 'exam') {
      card.append(el('h4', null, m.pass ? '🎓 Đậu rồi!' : 'Chưa đậu'));
      card.append(el('div', null, `Đúng ${m.correct} · Sai ${m.wrong} (cần ${m.need})`));
      card.append(el('div', null, m.pass ? `Đã có ${c.def.name}. Tới Nhà học sinh (Khu 2) để dạy kèm!` : 'Ôn lại rồi thi lần sau nhé.'));
      row.append(close);
    } else {
      card.append(el('h4', null, m.correct ? 'Hết ca!' : 'Nghỉ ca'));
      card.append(el('div', null, c.job === 'ship' ? `Giao được ${m.correct} · Trễ ${m.wrong}` : `Đúng ${m.correct} · Sai ${m.wrong}`));
      card.append(el('div', null, `💵 Lương ca: ${FORMAT.vnd(m.pay)}`));
      card.append(el('div', null, `${c.def.name} cấp ${m.lvl}${m.up ? ' 🎉 LÊN CẤP!' : ''} · ${m.next ? `${m.xp}/${m.next} KN` : 'cấp tối đa'}`));
      const again = el('button', 'btn', 'Làm ca nữa');
      again.onclick = () => this.net.send({ t: 'job_start', job: c.job });
      row.append(again, close);
    }
    card.append(row);
    r.append(card);
    stage.append(r);
    $('job-quit').textContent = 'Đóng';
    $('job-quit').disabled = false;
    $('job-quit').onclick = () => this.close();
  }

  close() {
    if (this.cur && !this.cur.done) return this.finish();
    this.cur = null;
    $('job').classList.add('hidden');
    $('job-quit').onclick = () => this.finish();
  }

  // ================================================================ Gia su / thi chung chi
  // Tung cau gui len server cham (client khong co dap an). Bang + vo ghi chep + 4 the dap an.
  start_tutor(stage, m) {
    this.quiz(stage, m, false);
  }

  start_exam(stage, m) {
    this.quiz(stage, m, true);
  }

  quiz(stage, m, exam) {
    const c = this.cur;
    this.hint(exam
      ? `Trả lời ${m.count} câu trên bảng đen — đúng từ ${m.target} câu trở lên là đậu.`
      : 'Học sinh hỏi bài trên bảng — bấm thẻ có đáp án đúng để giảng cho học sinh.');
    const wrap = el('div', `quiz ${exam ? 'exam' : 'tutor'}`);
    const board = el('div', 'quiz-board');
    const q = el('div', 'quiz-q');
    board.append(q);
    const book = el('div', 'quiz-book');
    const log = el('div', 'quiz-log');
    book.append(log);
    const cards = el('div', 'quiz-cards');
    const btns = CARDS.map((color, k) => {
      const b = el('button', 'quiz-card');
      b.style.backgroundImage = `url(${V2}/ui/card_${color}.png)`;
      b.onclick = () => pick(k);
      cards.append(b);
      return b;
    });
    wrap.append(board, ...(exam ? [] : [book]), cards);
    stage.append(wrap);
    let i = 0;
    let wait = true;
    let lastAt = 0;
    const show = () => {
      const t = m.tasks[i];
      if (!t || c.done) return;
      q.textContent = '';
      q.append(el('small', null, exam ? `Câu ${i + 1}/${m.count}` : `Học sinh hỏi · câu ${i + 1}`), el('div', null, t.q));
      btns.forEach((b, k) => {
        b.textContent = t.opts[k];
        b.className = 'quiz-card';
        b.disabled = false;
      });
      wait = false;
    };
    const pick = (k) => {
      if (wait || c.done) return;
      wait = true;
      lastAt = performance.now();
      btns.forEach((b) => { b.disabled = true; });
      btns[k].classList.add('picked');
      this.net.send({ t: 'job_act', jid: c.jid, i, pick: k });
    };
    c.onAck = (a) => {
      c[a.ok ? 'correct' : 'wrong']++;
      btns[a.a]?.classList.add('right');
      if (!a.ok) btns.forEach((b) => b.classList.contains('picked') && b.classList.add('bad'));
      this.flash(a.ok ? (exam ? 'Chính xác!' : 'Học sinh hiểu bài! ✔') : 'Sai rồi!', a.ok ? '#9fe58a' : '#ff9a85');
      if (!exam) {
        const t = m.tasks[i];
        log.prepend(el('div', a.ok ? 'ok' : 'bad', `${a.ok ? '✔' : '✘'} ${t.q}  →  ${t.opts[a.a]}`));
        while (log.children.length > 7) log.lastChild.remove();
      }
      this.score();
      i++;
      this.later(show, Math.max(700, QUIZ_GAP - (performance.now() - lastAt)));
    };
    show();
  }

  // ================================================================ Nghe tren pho: to roi, shipper
  // Khong mo man rieng: hien thanh HUD nho, nguoi choi van di lai; server kiem tra vi tri.
  startStreet(m) {
    const c = this.cur;
    $('job').classList.add('hidden');
    $('job-quit').onclick = () => this.finish();
    $('jobhud').classList.remove('hidden');
    $('jobhud-quit').disabled = false;
    $('jobhud-title').textContent = `${c.def.icon} ${c.def.name} · Cấp ${m.lvl}`;
    $('jobhud-img').src = `${V2}/jobs/${m.job === 'ship' ? 'ship_box' : 'flyer_stack'}.png`;
    $('jobhud-map').classList.toggle('hidden', m.job !== 'ship');
    if (m.job === 'flyer') {
      this.scene?.showWalkers(m.tasks, (w) => this.net.send({ t: 'job_act', jid: c.jid, w }));
      c.onAck = (a) => {
        if (a.ok) {
          c.correct++;
          this.scene?.walkerGot(a.w);
        } else if (a.far) this.ui.toast('Lại gần người đó hơn chút nữa!', 'info');
        this.score();
      };
    } else {
      $('jobhud-text').textContent = 'Đang nhận đơn...';
      c.onLeg = (l) => {
        c.legUntil = performance.now() + l.secs * 1000;
        const zone = ZONES.find((z) => z.id === l.zone);
        $('jobhud-text').textContent = `Đơn ${l.n}/${l.of}: giao tới ${l.name} (${zone?.name || ''})`;
        this.scene?.setJobTarget({ x: l.x, y: l.y, label: `📦 Giao: ${l.name}` });
        this.drawShipMap(l, zone);
        this.ui.toast(`📦 Đơn mới: giao tới ${l.name} trong ${l.secs}s`, 'info');
      };
      c.onAck = (a) => {
        c[a.ok ? 'correct' : 'wrong']++;
        this.ui.toast(a.ok ? `✅ Giao xong đơn ${a.leg}!` : `⌛ Trễ hạn đơn ${a.leg}, khách hủy đơn.`, a.ok ? 'good' : 'bad');
        this.scene?.setJobTarget(null);
      };
    }
    this.score();
    this.tick();
  }

  stopStreet() {
    $('jobhud').classList.add('hidden');
    $('shipmap').classList.add('hidden');
    this.scene?.showWalkers(null);
    this.scene?.setJobTarget(null);
  }

  // Ban do thanh pho: ghim diem giao theo khu (cot) va phia duong (tren / duoi)
  drawShipMap(l, zone) {
    const zi = Math.max(0, ZONES.indexOf(zone));
    const z = ZONES[zi];
    const [c0, c1] = MAP_COLS[zi];
    const mx = c0 + 16 + ((l.x - z.x0) / (z.x1 - z.x0)) * (c1 - c0 - 32);
    const my = l.y < 680 ? 150 : 330;
    const pin = $('shipmap-pin');
    pin.style.left = `${(mx / 956) * 100}%`;
    pin.style.top = `${(my / 484) * 100}%`;
    $('shipmap-label').textContent = `📦 ${l.name} — ${z.name}`;
  }

  // ================================================================ J1 IT
  start_it(stage, m) {
    const c = this.cur;
    this.hint('Nhớ thứ tự các khối lệnh hiện trên màn hình, rồi bấm lại đúng thứ tự. Sai một khối là dính bug!');
    const wrap = el('div', 'it-wrap');
    const mon = el('div', 'it-mon');
    const code = el('div', 'it-code');
    mon.append(code);
    const state = el('div', 'it-state');
    const pad = el('div', 'it-pad');
    const btns = IT_COLORS.map((_, i) => {
      const b = el('button');
      b.style.backgroundImage = `url(assets/jobs/it_block_${i}.png)`;
      b.onclick = () => press(i);
      pad.append(b);
      return b;
    });
    wrap.append(mon, pad, state);
    stage.append(wrap);
    let round = -1;
    let input = [];
    let lines = [];
    const setPad = (on) => btns.forEach((b) => { b.disabled = !on; });
    const bug = (ok) => {
      const b = el('img', 'it-bug');
      b.src = `assets/jobs/it_bug_${ok ? 'green' : 'red'}.png`;
      b.style.left = `${20 + Math.random() * 60}%`;
      b.style.top = `${20 + Math.random() * 40}%`;
      mon.append(b);
      requestAnimationFrame(() => {
        b.style.left = `${Math.random() * 90}%`;
        b.style.top = `${Math.random() * 60}%`;
      });
      this.later(() => b.remove(), 1500);
    };
    const next = () => {
      round++;
      const seq = m.tasks[round];
      if (!seq) return this.finish();
      input = [];
      code.textContent = '';
      lines = seq.map(() => {
        const l = el('div', 'it-line ph');
        code.append(l);
        return l;
      });
      setPad(false);
      state.textContent = `Lỗi #${round + 1}: nhớ ${seq.length} khối lệnh...`;
      seq.forEach((v, i) => this.later(() => {
        lines[i].classList.remove('ph');
        lines[i].style.background = IT_COLORS[v];
      }, 350 + i * 480));
      this.later(() => {
        for (const l of lines) {
          l.classList.add('ph');
          l.style.background = '';
        }
        state.textContent = 'Gõ lại theo đúng thứ tự!';
        setPad(true);
      }, 350 + seq.length * 480 + 500);
    };
    const press = (v) => {
      const seq = m.tasks[round];
      if (!seq || c.done) return;
      const i = input.length;
      input.push(v);
      lines[i].classList.remove('ph');
      lines[i].style.background = IT_COLORS[v];
      if (v !== seq[i]) {
        c.answers.push(input);
        c.wrong++;
        bug(false);
        this.flash('Bug! 🐞', '#ff9a85');
        setPad(false);
        this.score();
        return this.later(next, 700);
      }
      if (input.length === seq.length) {
        c.answers.push(input);
        c.correct++;
        bug(true);
        this.flash('Fix xong! ✔', '#9fe58a');
        setPad(false);
        this.score();
        this.later(next, 600);
      }
    };
    next();
  }

  // ================================================================ J2 Phuc vu
  start_waiter(stage, m) {
    const c = this.cur;
    this.hint('Bấm món ở quầy để bưng lên khay, rồi bấm vào bàn đang gọi đúng món đó. Khách chờ lâu sẽ bỏ đi.');
    const bg = el('img', 'bg');
    bg.src = 'assets/jobs/waiter_floor.png';
    stage.append(bg);
    let carry = null;
    const carryImg = el('img', 'carry');
    carryImg.style.display = 'none';
    stage.append(carryImg);
    stage.onpointermove = (e) => {
      const r = stage.getBoundingClientRect();
      carryImg.style.left = `${e.clientX - r.left}px`;
      carryImg.style.top = `${e.clientY - r.top}px`;
    };
    DISHES.forEach((d, i) => {
      const img = el('img', 'dish');
      img.src = `assets/jobs/${d.img}.png`;
      img.title = d.name;
      img.style.left = pct(COUNTER_X[i], BW);
      img.style.top = pct(62, BH);
      img.onclick = (e) => {
        e.stopPropagation();
        carry = i;
        carryImg.src = img.src;
        carryImg.style.display = '';
        stage.onpointermove(e);
      };
      stage.append(img);
    });
    const active = new Map(); // table -> {o, at, bubble, bar}
    let nextOrder = 0;
    const spawn = () => {
      while (active.size < 3 && nextOrder < m.tasks.length) {
        const o = nextOrder++;
        const t = m.tasks[o];
        if (active.has(t.table)) continue;
        const [x, y] = TABLES[t.table];
        const bubble = el('div', 'ord');
        bubble.style.left = pct(x, BW);
        bubble.style.top = pct(y - 62, BH);
        const im = el('img');
        im.src = `assets/jobs/${DISHES[t.dish].img}.png`;
        const bar = el('i');
        bar.style.width = '100%';
        bubble.append(im, bar);
        stage.append(bubble);
        active.set(t.table, { o, at: performance.now(), bubble, bar });
      }
    };
    TABLES.forEach(([x, y], ti) => {
      const h = box(stage, [x - 95, y - 60, x + 95, y + 70]);
      h.onclick = (e) => {
        e.stopPropagation();
        if (carry == null || c.done) return;
        const a = active.get(ti);
        c.answers.push({ o: a ? a.o : -1, table: ti, dish: carry });
        if (a && m.tasks[a.o].dish === carry) {
          c.correct++;
          this.flash('Ngon lành! +1', '#9fe58a');
          a.bubble.remove();
          active.delete(ti);
        } else {
          c.wrong++;
          this.flash(a ? 'Sai món rồi!' : 'Bàn này chưa gọi!', '#ff9a85');
        }
        carry = null;
        carryImg.style.display = 'none';
        this.score();
        this.later(spawn, 500);
      };
    });
    c.onTick = () => {
      const now = performance.now();
      for (const [t, a] of active) {
        const left = 1 - (now - a.at) / PATIENCE;
        if (left <= 0) {
          a.bubble.remove();
          active.delete(t);
          this.later(spawn, 400);
        } else a.bar.style.width = `${left * 100}%`;
      }
    };
    spawn();
  }

  // ================================================================ J3 Tra sua
  start_milktea(stage, m) {
    const c = this.cur;
    this.hint('Đọc phiếu order: chọn ly → trà → topping, rồi bấm máy ép nắp để giao. Bấm thùng rác để làm lại ly.');
    const bg = el('img', 'bg');
    bg.src = 'assets/jobs/milktea_counter.png';
    stage.append(bg);
    const ticket = el('div', 'ticket');
    stage.append(ticket);
    let idx = 0;
    let cup = {};
    const hots = { size: [], tea: [], top: [] };
    const draw = () => {
      const o = m.tasks[idx];
      if (!o) return;
      ticket.textContent = '';
      ticket.append(el('b', null, `🧾 Order #${idx + 1}`));
      const line = (label, want, got, names) => {
        const d = el('div', got === want ? 'ok' : null, `${got === want ? '✔' : '•'} ${label}: ${names[want].name}`);
        ticket.append(d);
      };
      line('Ly', o.size, cup.size, MT.sizes);
      line('Trà', o.tea, cup.tea, MT.teas);
      line('Topping', o.top, cup.top, MT.tops);
      for (const k of ['size', 'tea', 'top']) hots[k].forEach((h, i) => h.classList.toggle('picked', cup[k] === i));
    };
    const pick = (k, i) => {
      if (c.done) return;
      if (k !== 'size' && cup.size == null) return this.flash('Lấy ly trước đã!', '#ffe08a');
      cup[k] = i;
      draw();
    };
    MT.sizes.forEach((s, i) => { hots.size.push(box(stage, s.box, 'hot', s.name)); hots.size[i].onclick = () => pick('size', i); });
    MT.teas.forEach((s, i) => { hots.tea.push(box(stage, s.box, 'hot', s.name)); hots.tea[i].onclick = () => pick('tea', i); });
    MT.tops.forEach((s, i) => { hots.top.push(box(stage, s.box, 'hot', s.name)); hots.top[i].onclick = () => pick('top', i); });
    box(stage, MT.trash, 'hot', 'Đổ bỏ').onclick = () => {
      cup = {};
      draw();
    };
    box(stage, MT.seal, 'hot', 'Ép nắp & giao').onclick = () => {
      if (c.done) return;
      if (cup.size == null || cup.tea == null || cup.top == null) return this.flash('Ly chưa đủ thành phần!', '#ffe08a');
      const o = m.tasks[idx];
      c.answers.push({ ...cup });
      if (cup.size === o.size && cup.tea === o.tea && cup.top === o.top) {
        c.correct++;
        this.flash('Chuẩn vị! 🧋', '#9fe58a');
      } else {
        c.wrong++;
        this.flash('Sai order!', '#ff9a85');
      }
      this.score();
      idx++;
      cup = {};
      if (!m.tasks[idx]) return this.finish();
      draw();
    };
    draw();
  }
}
