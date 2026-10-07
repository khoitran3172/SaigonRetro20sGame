// He thong nghe (GAMEPLAY_V2 G11, G43): lam 1 ca = 1 mini-game.
// Server sinh de (tasks), client choi roi gui dap an, server tu cham diem -> khong the tu khai diem.
// - IT / Phuc vu / Tra sua: cham ca loat luc het ca (scoreJob).
// - Gia su / thi chung chi: tung cau gui len, server cham ngay (dap an khong gui xuong client).
// - To roi / Shipper (street): lam tren pho, server kiem tra vi tri nguoi choi.
import { EXAMS, FLYER, ITEMS, JOBS, JOB_XP, POIS, SHIP, SPEED, WORLD, walkerPos, zoneAt } from '../shared/config.js';
import { EconError } from './economy.js';
import { homeDoor, homeOf, roomStats } from './home.js';

const POI_RANGE = 170;
const QUIZ_GAP = 1200; // ms toi thieu giua 2 cau tra loi
const FLYER_GAP = 500;
const rnd = (n) => Math.floor(Math.random() * n);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// So lua chon cua tung mini-game (client ve theo dung thu tu nay)
export const JOB_GAME = {
  it: { colors: 6 },
  waiter: { tables: 6, dishes: 6 },
  milktea: { sizes: 3, teas: 3, tops: 4 },
};

export function jobLevel(xp) {
  let lvl = 1;
  for (let i = 0; i < JOB_XP.length; i++) if (xp >= JOB_XP[i]) lvl = i + 1;
  return lvl;
}

export function jobInfo(p, id) {
  const xp = p.jobs?.[id]?.xp || 0;
  const lvl = jobLevel(xp);
  return { xp, lvl, next: JOB_XP[lvl] ?? null };
}

// ---------------------------------------------------------------- cau hoi gia su
const ANTONYM = [['nóng', 'lạnh'], ['cao', 'thấp'], ['nhanh', 'chậm'], ['giàu', 'nghèo'], ['sáng', 'tối'], ['vui', 'buồn'],
  ['mới', 'cũ'], ['to', 'nhỏ'], ['dài', 'ngắn'], ['xa', 'gần'], ['khỏe', 'yếu'], ['đầy', 'vơi'], ['siêng năng', 'lười biếng'], ['thật thà', 'gian dối']];
const ENGLISH = [['apple', 'quả táo'], ['teacher', 'giáo viên'], ['market', 'cái chợ'], ['street', 'con đường'], ['rain', 'cơn mưa'],
  ['rice', 'cơm / gạo'], ['friend', 'người bạn'], ['money', 'tiền'], ['house', 'ngôi nhà'], ['book', 'quyển sách'],
  ['coffee', 'cà phê'], ['bus', 'xe buýt'], ['hungry', 'đói bụng'], ['tired', 'mệt mỏi'], ['happy', 'vui vẻ']];

function numQuestion(q, a) {
  const set = new Set([a]);
  const spread = Math.max(3, Math.round(Math.abs(a) * 0.2));
  while (set.size < 4) {
    const v = a + (rnd(2 * spread + 1) - spread);
    if (v >= 0 && v !== a) set.add(v);
  }
  const opts = shuffle([...set]);
  return { q, opts: opts.map(String), a: opts.indexOf(a) };
}

function wordQuestion(q, right, pool) {
  const wrong = shuffle(pool.filter((w) => w !== right)).slice(0, 3);
  const opts = shuffle([right, ...wrong]);
  return { q, opts, a: opts.indexOf(right) };
}

export function quizQuestion(level) {
  const r = Math.random();
  if (r < 0.15) {
    const [w, ant] = ANTONYM[rnd(ANTONYM.length)];
    return wordQuestion(`Từ trái nghĩa với "${w}" là gì?`, ant, ANTONYM.map((x) => x[1]));
  }
  if (r < 0.3) {
    const [en, vi] = ENGLISH[rnd(ENGLISH.length)];
    return wordQuestion(`Tiếng Anh "${en}" nghĩa là gì?`, vi, ENGLISH.map((x) => x[1]));
  }
  const lim = [20, 50, 100, 200, 500][clamp(level, 1, 5) - 1];
  const kind = rnd(Math.min(6, 2 + level));
  if (kind === 0) {
    const a = 1 + rnd(lim);
    const b = 1 + rnd(lim);
    return numQuestion(`${a} + ${b} = ?`, a + b);
  }
  if (kind === 1) {
    const a = 1 + rnd(lim);
    const b = rnd(a);
    return numQuestion(`${a} − ${b} = ?`, a - b);
  }
  if (kind === 2) {
    const a = 2 + rnd(8);
    const b = 2 + rnd(level > 2 ? 18 : 8);
    return numQuestion(`${a} × ${b} = ?`, a * b);
  }
  if (kind === 3) {
    const b = 2 + rnd(8);
    const x = 2 + rnd(12);
    return numQuestion(`${b * x} ÷ ${b} = ?`, x);
  }
  if (kind === 4) {
    const a = 1 + rnd(lim);
    const x = 1 + rnd(lim);
    return numQuestion(`Tìm x: x + ${a} = ${a + x}`, x);
  }
  const a = 2 + rnd(9);
  const x = 2 + rnd(15);
  return numQuestion(`Tìm x: ${a} × x = ${a * x}`, x);
}

// ---------------------------------------------------------------- de cac mini-game
function makeTasks(job, lvl, s) {
  if (job === 'it') {
    // Tung vong: day khoi lenh can go lai dung thu tu (dai dan)
    return Array.from({ length: 14 }, (_, i) => Array.from({ length: Math.min(6, 3 + Math.floor(i / 3)) }, () => rnd(JOB_GAME.it.colors)));
  }
  if (job === 'waiter') {
    // Hang order: ban nao goi mon gi (khong trung ban dang cho lien tiep)
    const out = [];
    for (let i = 0; i < 40; i++) {
      let t;
      do t = rnd(JOB_GAME.waiter.tables); while (out.slice(-3).some((o) => o.table === t));
      out.push({ table: t, dish: rnd(JOB_GAME.waiter.dishes) });
    }
    return out;
  }
  if (job === 'milktea') return Array.from({ length: 20 }, () => ({ size: rnd(3), tea: rnd(3), top: rnd(4) }));
  if (job === 'tutor') return Array.from({ length: 40 }, () => quizQuestion(lvl));
  if (job === 'flyer') {
    // Nguoi di duong quanh cho bat dau ca, di qua lai tren via he
    return Array.from({ length: FLYER.walkers }, (_, i) => {
      const top = Math.random() < 0.5;
      const span = 160 + rnd(360);
      const x0 = clamp(s.x - FLYER.spread + rnd(2 * FLYER.spread - span), WORLD.walk.x0 + 10, WORLD.walk.x1 - 10 - span);
      return {
        i, sk: FLYER.skins[i % FLYER.skins.length], x0, x1: x0 + span,
        y: top ? 485 + rnd(65) : 830 + rnd(250), sp: 26 + rnd(22), ph: rnd(2 * span),
      };
    });
  }
  return [];
}

// -> { correct, wrong }  (chi cho cac mini-game cham ca loat)
export function scoreJob(job, tasks, answers, elapsedMs) {
  if (!Array.isArray(answers)) answers = [];
  // gioi han nhip: khong the tra loi nhanh hon nguoi that
  const minGap = { it: 1500, waiter: 1100, milktea: 1800 }[job];
  const maxAnswers = Math.floor(elapsedMs / minGap) + 1;
  answers = answers.slice(0, Math.min(maxAnswers, 60));
  let correct = 0;
  let wrong = 0;
  if (job === 'it') {
    answers.forEach((a, i) => {
      const t = tasks[i];
      if (t && Array.isArray(a) && a.length === t.length && a.every((v, k) => v === t[k])) correct++;
      else wrong++;
    });
  } else if (job === 'waiter') {
    const done = new Set();
    for (const a of answers) {
      const o = tasks[Number(a?.o)];
      if (o && !done.has(Number(a.o)) && o.table === Number(a.table) && o.dish === Number(a.dish)) {
        done.add(Number(a.o));
        correct++;
      } else wrong++;
    }
  } else {
    answers.forEach((a, i) => {
      const t = tasks[i];
      if (t && Number(a?.size) === t.size && Number(a?.tea) === t.tea && Number(a?.top) === t.top) correct++;
      else wrong++;
    });
  }
  return { correct, wrong };
}

// Cac nghe cham tung buoc tren server
const LIVE = new Set(['tutor', 'flyer', 'ship']);

export class Jobs {
  constructor(game) {
    this.g = game;
    this.seq = 1;
  }

  // id: ma nghe trong JOBS, hoac 'exam:<ma>' de thi chung chi o Truong
  start(s, id) {
    const g = this.g;
    const p = s.p;
    const examId = id.startsWith('exam:') ? id.slice(5) : null;
    const def = examId ? EXAMS[examId] : JOBS[id];
    if (!def) return;
    if (s.job) throw new EconError('Bạn đang làm một ca khác');
    if (s.sleep) throw new EconError('Bạn đang ngủ');
    if (s.cook) throw new EconError('Bạn đang nấu ăn');
    // IT lam o nha: phong tro hoac can ho dang o
    const home = def.needRent ? homeOf(p, g.day) : null;
    if (def.needRent && !home) throw new EconError('Cần chỗ ở (thuê phòng trọ hoặc chung cư) để có bàn ngồi làm IT');
    const poiId = examId ? 'school_gate' : home ? homeDoor(home).id : def.poi;
    if (poiId) {
      const poi = POIS.find((x) => x.id === poiId);
      if (Math.hypot(poi.x - s.x, poi.y - s.y) > POI_RANGE) throw new EconError(`Hãy tới ${examId ? 'Giảng đường' : poi.name} để làm ca này`);
    }
    p.certs ??= {};
    if (examId && p.certs[examId]) throw new EconError(`Bạn đã có ${def.name} rồi`);
    if (def.needPhone && !g.hasPhone(p)) throw new EconError('Shipper cần trang bị Điện thoại để nhận đơn');
    if (def.needCert && !p.certs[def.needCert]) throw new EconError(`Cần ${EXAMS[def.needCert].name} — thi ở Giảng đường (Khu 3)`);
    // Trang bi "Tiet kiem NL" giam nang luong ton moi ca
    const energy = Math.round(def.energy * (1 - (s.stats?.staminaSave || 0) / 100));
    if (p.stats.stamina < energy) throw new EconError('Bạn hết năng lượng. Ăn uống hoặc nghỉ ngơi đã!');
    if ((p.stats.hunger ?? 100) < 5) throw new EconError('Đói quá, không làm nổi. Ăn gì đi đã!');
    if (examId) g.econ.pay(p, def.fee, 'cash', `exam:${examId}`);
    // Tru nang luong ngay khi vao ca (bo ngang van mat)
    p.stats.stamina -= energy;
    p.stats.hunger = Math.max(0, (p.stats.hunger ?? 100) - def.hunger);
    p.stats.stress = Math.min(100, p.stats.stress + def.stress);
    const lvl = examId ? 3 : jobInfo(p, id).lvl;
    const tasks = examId ? Array.from({ length: def.count }, () => quizQuestion(3)) : makeTasks(id, lvl, s);
    // IT: may tinh trong phong hoac laptop trong tui cho them thoi gian (G43)
    const laptop = Math.max(0, ...p.inv.map((it) => ITEMS[it.id]?.it || 0));
    const secs = def.secs + (id === 'it' ? Math.max(0, roomStats(p).it, laptop) : 0);
    const job = { jid: this.seq++, id: examId ? 'exam' : id, examId, tasks, started: Date.now(), secs };
    if (s.inHome) g.home.leave(s);
    if (examId || LIVE.has(id)) Object.assign(job, { live: { correct: 0, wrong: 0 }, idx: 0, last: 0 });
    s.job = job;
    g.closeDialog(s);
    // Dap an trac nghiem khong gui xuong client
    const pub = examId || id === 'tutor' ? tasks.map(({ q, opts }) => ({ q, opts })) : tasks;
    const target = examId ? def.pass : def.target;
    if (id === 'ship') {
      job.secs = 900;
      job.done = [];
      job.used = new Set();
    }
    g.send(s, { t: 'job', jid: job.jid, job: job.id, name: def.name, icon: def.icon, secs: job.secs, target, lvl, tasks: pub, street: !!def.street, count: def.count });
    if (id === 'ship') this.nextLeg(s);
  }

  // Shipper: chon dia chi giao tiep theo, han theo quang duong
  nextLeg(s) {
    const job = s.job;
    const pool = POIS.filter((x) => !x.hidden && x.id !== 'buudien' && !job.used.has(x.id) && Math.hypot(x.x - s.x, x.y - s.y) >= SHIP.minDist);
    const poi = pool[rnd(pool.length)] || POIS.find((x) => x.id === 'buudien');
    job.used.add(poi.id);
    const dist = Math.hypot(poi.x - s.x, poi.y - s.y);
    const secs = Math.ceil((dist / SPEED.walk) * SHIP.slack + SHIP.extraSecs);
    job.leg = { n: job.done.length + job.live.wrong + 1, poi: poi.id, name: poi.name, x: poi.x, y: poi.y, dist, until: Date.now() + secs * 1000 };
    this.g.send(s, { t: 'job_leg', jid: job.jid, n: job.leg.n, of: JOBS.ship.target, name: poi.name, zone: zoneAt(poi.x).id, x: poi.x, y: poi.y, secs });
  }

  legDone(s, ok) {
    const job = s.job;
    if (ok) {
      job.live.correct++;
      job.done.push(job.leg.dist);
    } else job.live.wrong++;
    this.g.send(s, { t: 'job_ack', jid: job.jid, ok, leg: job.leg.n });
    job.leg = null;
    if (job.live.correct + job.live.wrong >= JOBS.ship.target) return this.end(s, { jid: job.jid });
    this.nextLeg(s);
  }

  // Goi sau moi lan nguoi choi di chuyen
  onMove(s) {
    const job = s.job;
    if (job?.id === 'ship' && job.leg && Math.hypot(job.leg.x - s.x, job.leg.y - s.y) <= SHIP.range) this.legDone(s, true);
  }

  // Goi moi tick: het han don ship, het gio ca tren pho
  tick() {
    const now = Date.now();
    for (const s of this.g.sessions.values()) {
      const job = s.job;
      if (!job?.live) continue;
      if (job.id === 'ship') {
        if (job.leg && now > job.leg.until) this.legDone(s, false);
      } else if (now - job.started > job.secs * 1000 + 2000) this.end(s, { jid: job.jid });
    }
  }

  // Mot buoc cua mini-game cham truc tiep: tra loi 1 cau / phat 1 to roi
  act(s, m) {
    const job = s.job;
    if (!job?.live || Number(m.jid) !== job.jid) return;
    const now = Date.now();
    if (job.id === 'flyer') {
      if (now - job.last < FLYER_GAP) return;
      const w = job.tasks[Number(m.w)];
      job.given ??= new Set();
      if (!w || job.given.has(w.i)) return;
      job.last = now;
      const pos = walkerPos(w, now - job.started);
      const ok = Math.hypot(pos.x - s.x, pos.y - s.y) <= FLYER.range;
      if (ok) {
        job.given.add(w.i);
        job.live.correct++;
      }
      this.g.send(s, { t: 'job_ack', jid: job.jid, ok, w: w.i, far: !ok });
      if (job.live.correct >= JOBS.flyer.target) this.end(s, { jid: job.jid });
      return;
    }
    if (job.id !== 'tutor' && job.id !== 'exam') return;
    if (Number(m.i) !== job.idx || now - job.last < QUIZ_GAP) return;
    const t = job.tasks[job.idx];
    if (!t) return;
    job.last = now;
    const ok = Number(m.pick) === t.a;
    job.live[ok ? 'correct' : 'wrong']++;
    job.idx++;
    this.g.send(s, { t: 'job_ack', jid: job.jid, i: job.idx - 1, ok, a: t.a });
    if (!job.tasks[job.idx]) this.end(s, { jid: job.jid });
  }

  end(s, m) {
    const g = this.g;
    const job = s.job;
    if (!job || Number(m.jid) !== job.jid) return;
    s.job = null;
    const elapsed = Date.now() - job.started;
    if (elapsed > (job.secs + 30) * 1000) return g.toast(s, 'Ca làm đã quá giờ, không được tính.', 'bad');
    const { correct, wrong } = job.live || scoreJob(job.id, job.tasks, m.answers, elapsed);
    const p = s.p;
    if (job.examId) return this.endExam(s, job, correct, wrong);
    const def = JOBS[job.id];
    p.jobs ??= {};
    const rec = (p.jobs[job.id] ??= { xp: 0, shifts: 0 });
    const before = jobLevel(rec.xp);
    let pay;
    if (job.id === 'ship') {
      // Luong theo quang duong tung don giao duoc
      const base = def.pay[before - 1] / def.target;
      pay = Math.round(job.done.reduce((sum, d) => sum + base * clamp(d / 1800, 0.6, 1.8), 0) / 100) * 100;
    } else {
      const acc = Math.max(0, Math.min(1, (correct - wrong * 0.5) / def.target));
      pay = correct ? Math.round((def.pay[before - 1] * (0.3 + 0.7 * acc)) / 100) * 100 : 0;
    }
    rec.xp += job.id === 'ship' ? correct * 3 : correct;
    rec.shifts++;
    const after = jobLevel(rec.xp);
    if (pay) g.econ.grant(p, pay, 'cash', `job:${job.id}`);
    if (correct) {
      g.questProgress(s, 'job', 1);
      g.questProgress(s, `job_${job.id}`, 1);
      g.questProgress(s, 'earn', pay);
    }
    g.db.markDirty();
    s.stats = g.computeStats(p);
    s.dirty = true;
    g.send(s, { t: 'job_result', job: job.id, correct, wrong, pay, lvl: after, up: after > before, xp: rec.xp, next: JOB_XP[after] ?? null });
    if (after > before) g.news(`🎉 ${p.name} vừa lên cấp ${after} nghề ${def.name}!`);
  }

  endExam(s, job, correct, wrong) {
    const g = this.g;
    const def = EXAMS[job.examId];
    const pass = correct >= def.pass;
    if (pass) {
      s.p.certs[job.examId] = true;
      g.news(`🎓 ${s.p.name} vừa nhận ${def.name}!`);
    }
    g.db.markDirty();
    s.dirty = true;
    g.send(s, { t: 'job_result', job: 'exam', exam: job.examId, correct, wrong, pass, need: def.pass, pay: 0 });
  }
}
