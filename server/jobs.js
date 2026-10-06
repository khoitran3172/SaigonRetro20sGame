// He thong nghe (GAMEPLAY_V2 G11, G43): lam 1 ca = 1 mini-game.
// Server sinh de (tasks), client choi roi gui dap an, server tu cham diem -> khong the tu khai diem.
import { JOBS, JOB_XP, POIS } from '../shared/config.js';
import { EconError } from './economy.js';

const POI_RANGE = 170;
const rnd = (n) => Math.floor(Math.random() * n);

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

function makeTasks(job) {
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
  return Array.from({ length: 20 }, () => ({ size: rnd(3), tea: rnd(3), top: rnd(4) }));
}

// -> { correct, wrong }
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

export class Jobs {
  constructor(game) {
    this.g = game;
    this.seq = 1;
  }

  start(s, id) {
    const g = this.g;
    const p = s.p;
    const def = JOBS[id];
    if (!def) return;
    if (s.job) throw new EconError('Bạn đang làm một ca khác');
    const poi = POIS.find((x) => x.id === def.poi);
    if (Math.hypot(poi.x - s.x, poi.y - s.y) > POI_RANGE) throw new EconError(`Hãy tới ${def.place} để làm ca này`);
    if (def.needRent && !p.renting) throw new EconError('Cần thuê phòng trọ để có chỗ ngồi làm IT');
    if (p.stats.stamina < def.energy) throw new EconError('Bạn hết năng lượng. Ăn uống hoặc nghỉ ngơi đã!');
    if ((p.stats.hunger ?? 100) < 5) throw new EconError('Đói quá, không làm nổi. Ăn gì đi đã!');
    // Tru nang luong ngay khi vao ca (bo ngang van mat)
    p.stats.stamina -= def.energy;
    p.stats.hunger = Math.max(0, (p.stats.hunger ?? 100) - def.hunger);
    p.stats.stress = Math.min(100, p.stats.stress + def.stress);
    const tasks = makeTasks(id);
    s.job = { jid: this.seq++, id, tasks, started: Date.now() };
    const info = jobInfo(p, id);
    g.closeDialog(s);
    g.send(s, { t: 'job', jid: s.job.jid, job: id, secs: def.secs, target: def.target, lvl: info.lvl, tasks });
  }

  end(s, m) {
    const g = this.g;
    const job = s.job;
    if (!job || Number(m.jid) !== job.jid) return;
    s.job = null;
    const def = JOBS[job.id];
    const elapsed = Date.now() - job.started;
    if (elapsed > (def.secs + 30) * 1000) return g.toast(s, 'Ca làm đã quá giờ, không được tính.', 'bad');
    const { correct, wrong } = scoreJob(job.id, job.tasks, m.answers, elapsed);
    const p = s.p;
    p.jobs ??= {};
    const rec = (p.jobs[job.id] ??= { xp: 0, shifts: 0 });
    const before = jobLevel(rec.xp);
    const acc = Math.max(0, Math.min(1, (correct - wrong * 0.5) / def.target));
    const pay = correct ? Math.round((def.pay[before - 1] * (0.3 + 0.7 * acc)) / 100) * 100 : 0;
    rec.xp += correct;
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
}
