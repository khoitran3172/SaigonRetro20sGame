import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { APARTMENT, ECON, MARKET, POIS, walkerPos } from '../../shared/config.js';
import { JsonDB } from '../db.js';
import { needleAt as cookNeedle } from '../cook.js';
import { Game } from '../game.js';

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hangrong-'));
  const g = new Game(new JsonDB(path.join(dir, 'db.json')));
  const join = (name, cls, skin = 'sv_male') => {
    const ws = { readyState: 1, out: [], send(d) { this.out.push(JSON.parse(d)); }, on() {}, close() {} };
    const s = g.connect(ws);
    g.onMessage(s, JSON.stringify({ t: 'hello', name, cls, skin }));
    assert.ok(s.p, `join ${name}`);
    return s;
  };
  const msg = (s, m) => g.onMessage(s, JSON.stringify(m));
  const toasts = (s) => s.ws.out.filter((m) => m.t === 'toast').map((m) => m.msg);
  return { g, join, msg, toasts };
}

const money = (...ps) => ps.reduce((n, p) => n + p.cash + p.bank, 0);

test('ATM: phi giao dich va khong cho rut qua so du', () => {
  const { g, join, msg, toasts } = setup();
  const a = join('An', 'sv');
  Object.assign(a, { x: 4290, y: 480 }); // canh ATM VietBank
  const before = money(a.p);
  msg(a, { t: 'act', poi: 'atm2', act: 'deposit', inputs: { amount: 50000 } });
  assert.equal(a.p.bank, 100000 + 50000);
  assert.equal(money(a.p), before - ECON.atmFeeMin);
  msg(a, { t: 'act', poi: 'atm2', act: 'withdraw', inputs: { amount: 999999999 } });
  assert.equal(a.p.bank, 150000);
  assert.match(toasts(a).at(-1), /không đủ/);
  // o xa ATM thi khong giao dich duoc
  Object.assign(a, { x: 100, y: 1000 });
  msg(a, { t: 'act', poi: 'atm2', act: 'deposit', inputs: { amount: 1000 } });
  assert.equal(a.p.bank, 150000);
});

test('Cho Sap Hang Hoa: thue sap, che bien, bay ban trong khung gia, mua ca khi chu offline, het han tra hang', () => {
  const { g, join, msg, toasts } = setup();
  const seller = join('Ba Bay', 'tt', 'baba_female');
  const buyer = join('Khach', 'vp', 'vp_male');
  Object.assign(seller, { x: 3290, y: 490 });
  Object.assign(buyer, { x: 3290, y: 490 });
  // phai thue sap truoc
  msg(seller, { t: 'market', a: 'craft', id: 'banhmi' });
  assert.match(toasts(seller).at(-1), /chưa thuê sạp/);
  const bank = seller.p.bank;
  msg(seller, { t: 'market', a: 'rent', size: 0 });
  const st = g.market.stalls['Ba Bay'];
  assert.ok(st && st.until === g.day + MARKET.days);
  assert.equal(seller.p.bank, bank - MARKET.sizes[0].rent);
  // che bien o sap (tieu thuong co san nguyen lieu)
  msg(seller, { t: 'market', a: 'craft', id: 'banhmi' });
  assert.equal(g.econ.count(seller.p, 'banhmi'), 4);
  const stack = seller.p.inv.find((i) => i.id === 'banhmi');
  // gia ngoai khung (G57) -> tu choi
  msg(seller, { t: 'market', a: 'list', uid: stack.uid, qty: 3, price: 1000000 });
  assert.match(toasts(seller).at(-1), /phải từ/);
  msg(seller, { t: 'market', a: 'list', uid: stack.uid, qty: 3, price: 20000 });
  assert.equal(st.listings[0].stack.qty, 3);
  assert.equal(g.econ.count(seller.p, 'banhmi'), 1);

  // chu sap offline van ban duoc, tien (tru thue) vao ngan hang
  g.disconnect(seller);
  const p = seller.p;
  const before = p.bank;
  const cash = buyer.p.cash;
  msg(buyer, { t: 'market', a: 'buy', owner: 'Ba Bay', lid: st.listings[0].lid, qty: 2 });
  assert.equal(g.econ.count(buyer.p, 'banhmi'), 2);
  assert.equal(buyer.p.cash, cash - 40000);
  assert.equal(p.bank, before + 40000 - Math.round(40000 * MARKET.tax));
  assert.ok(p.mail.some((m) => /mua Bánh mì/.test(m.text)), 'bao cho chu sap khi offline');
  // mua qua so luong -> khong mat gi
  const snap = buyer.p.cash;
  msg(buyer, { t: 'market', a: 'buy', owner: 'Ba Bay', lid: st.listings[0].lid, qty: 5 });
  assert.equal(buyer.p.cash, snap);
  // gia trung binh gan day
  assert.deepEqual(g.market.data.prices.banhmi, [20000]);
  // het han thue: hang con lai ve tui
  g.day += MARKET.days + 1;
  g.market.onNewDay();
  assert.ok(!g.market.stalls['Ba Bay']);
  assert.equal(g.econ.count(p, 'banhmi'), 2);
  // ngoai cho khong thao tac duoc
  Object.assign(buyer, { x: 600, y: 490 });
  msg(buyer, { t: 'market', a: 'rent', size: 0 });
  assert.match(toasts(buyer).at(-1), /Chợ Sạp Hàng Hóa/);
});

test('Chong dich chuyen tuc thoi', () => {
  const { join, msg } = setup();
  const a = join('Nhanh', 'sv');
  const { x, y } = a;
  msg(a, { t: 'move', x: x + 3000, y, d: 'right', m: 1 });
  assert.equal(a.x, x);
  assert.equal(a.ws.out.at(-1).t, 'correct');
});

test('Gui thu: loi thi khong mat do (nguyen tu)', () => {
  const { g, join, msg } = setup();
  const a = join('Gui', 'sv');
  join('Nhan', 'sv');
  Object.assign(a, { x: 2060, y: 480 });
  const cassette = g.econ.addItem(a.p, 'bang_cassette', 1);
  void cassette;
  const uid = a.p.inv.find((i) => i.id === 'bang_cassette').uid;
  // gui kem qua nhieu tien -> that bai, bang cassette van con
  msg(a, { t: 'act', poi: 'buudien', act: 'send', inputs: { to: 'Nhan', text: 'hi', cash: 99999999, uid } });
  assert.equal(g.econ.count(a.p, 'bang_cassette'), 1);
  msg(a, { t: 'act', poi: 'buudien', act: 'send', inputs: { to: 'Nhan', text: 'hi', cash: 1000, uid } });
  assert.equal(g.econ.count(a.p, 'bang_cassette'), 0);
  const inbox = g.db.data.players.nhan.mail.at(-1);
  assert.equal(inbox.stack.id, 'bang_cassette');
  assert.equal(inbox.cash, 1000);
});

test('Dau gia: ky quy va hoan tien khi bi tra gia cao hon', () => {
  const { g, join, msg } = setup();
  const a = join('Dai Gia', 'vp', 'vp_male');
  const b = join('Tieu Thu', 'vp', 'vp_male');
  g.auction.queue.push({ seller: null, stack: { uid: 'x1', id: 'meo_quy', qty: 1, dur: 100, lvl: 0 }, start: 100000 });
  g.auction.next();
  msg(a, { t: 'act', poi: 'auction', act: 'bid', inputs: { amount: 100000 } }); // tu xa qua dien thoai
  assert.equal(a.p.bank, 300000);
  msg(b, { t: 'act', poi: 'auction', act: 'bid', inputs: { amount: 105000 } }); // thap hon buoc gia
  assert.equal(b.p.bank, 400000);
  msg(b, { t: 'act', poi: 'auction', act: 'bid', inputs: { amount: 120000 } });
  assert.equal(a.p.bank, 400000, 'nguoi cu duoc hoan ky quy');
  assert.equal(b.p.bank, 280000);
  g.auction.lot.endsAt = 0;
  g.auction.tick();
  assert.ok(b.p.inv.some((i) => i.id === 'meo_quy'));
  assert.equal(g.auction.lot, null);
});

test('Nghe: mini-game do server cham, khong khai diem duoc; nhiem vu ngay tra thuong', async () => {
  const { g, join, msg, toasts } = setup();
  const a = join('Phuc Vu', 'sv');
  Object.assign(a, { x: 3905, y: 490 }); // truoc Quan Com Tam
  a.p.daily.q = [{ id: 'job2', have: 0, done: false }, { id: 'eat3', have: 0, done: false }, { id: 'chat3', have: 0, done: false }];
  const stamina = a.p.stats.stamina;
  msg(a, { t: 'act', poi: 'comtam', act: 'job', args: { id: 'waiter' } });
  const job = a.ws.out.find((m) => m.t === 'job');
  assert.ok(job, 'nhan de mini-game');
  assert.equal(a.p.stats.stamina, stamina - 12);
  // tra loi dung 5 order dau, them 1 lan giao sai; gia lap da choi 30 giay
  a.job.started -= 30000;
  const answers = job.tasks.slice(0, 5).map((o, i) => ({ o: i, table: o.table, dish: o.dish }));
  answers.push({ o: 9, table: (job.tasks[9].table + 1) % 6, dish: job.tasks[9].dish });
  const cash = a.p.cash;
  msg(a, { t: 'job_end', jid: job.jid, answers });
  const res = a.ws.out.find((m) => m.t === 'job_result');
  assert.equal(res.correct, 5);
  assert.equal(res.wrong, 1);
  assert.ok(res.pay > 0 && a.p.cash >= cash + res.pay);
  assert.equal(a.p.jobs.waiter.xp, 5);
  assert.equal(a.p.daily.q[0].have, 1);
  // gui dap an qua nhanh (vua bat dau) -> bi cat bot
  msg(a, { t: 'act', poi: 'comtam', act: 'job', args: { id: 'waiter' } });
  const job2 = a.ws.out.filter((m) => m.t === 'job').at(-1);
  msg(a, { t: 'job_end', jid: job2.jid, answers: job2.tasks.map((o, i) => ({ o: i, table: o.table, dish: o.dish })) });
  assert.ok(a.ws.out.filter((m) => m.t === 'job_result').at(-1).correct <= 1);
  assert.ok(a.p.daily.q[0].done, 'xong nhiem vu 2 ca');
  assert.ok(toasts(a).some((t) => /Hoàn thành nhiệm vụ/.test(t)));
  // IT can thue phong tro
  Object.assign(a, { x: 910, y: 490 });
  msg(a, { t: 'job_start', job: 'it' });
  assert.match(toasts(a).at(-1), /thuê phòng/);
});

test('Gia su: phai thi chung chi o Truong; dap an khong gui xuong client, server cham tung cau', () => {
  const { g, join, msg, toasts } = setup();
  const a = join('Gia Su', 'sv');
  a.p.cash = 200000;
  Object.assign(a, { x: 4735, y: 490 }); // Nha hoc sinh
  msg(a, { t: 'job_start', job: 'tutor' });
  assert.match(toasts(a).at(-1), /Chứng chỉ Gia sư/);
  // Thi o Giang duong: mat le phi, 10 cau
  Object.assign(a, { x: 420, y: 490 });
  msg(a, { t: 'act', poi: 'school_gate', act: 'exam', args: { id: 'tutor' } });
  const exam = a.ws.out.findLast((m) => m.t === 'job');
  assert.equal(exam.job, 'exam');
  assert.equal(a.p.cash, 200000 - 50000);
  assert.ok(exam.tasks.every((t) => t.a === undefined && t.opts.length === 4), 'khong lo dap an');
  // tra loi qua nhanh -> bo qua
  msg(a, { t: 'job_act', jid: exam.jid, i: 0, pick: 0 });
  msg(a, { t: 'job_act', jid: exam.jid, i: 1, pick: 0 });
  assert.equal(a.ws.out.filter((m) => m.t === 'job_ack').length, 1);
  // tra loi dung het (lay dap an tu server), gia lap nhip 1.3s
  for (let i = 1; i < 10; i++) {
    a.job.last -= 1300;
    msg(a, { t: 'job_act', jid: exam.jid, i, pick: a.job.tasks[i].a });
  }
  const res = a.ws.out.findLast((m) => m.t === 'job_result');
  assert.equal(res.job, 'exam');
  assert.ok(res.pass && a.p.certs.tutor);
  // Day kem
  Object.assign(a, { x: 4735, y: 490 });
  msg(a, { t: 'act', poi: 'tutor', act: 'job', args: { id: 'tutor' } });
  const job = a.ws.out.findLast((m) => m.t === 'job');
  assert.equal(job.job, 'tutor');
  for (let i = 0; i < 6; i++) {
    a.job.last -= 1300;
    const t = a.job.tasks[i];
    msg(a, { t: 'job_act', jid: job.jid, i, pick: i < 5 ? t.a : (t.a + 1) % 4 });
  }
  msg(a, { t: 'job_end', jid: job.jid, answers: [] });
  const r2 = a.ws.out.findLast((m) => m.t === 'job_result');
  assert.equal(r2.correct, 5);
  assert.equal(r2.wrong, 1);
  assert.ok(r2.pay > 0);
});

test('To roi & shipper: server kiem tra vi tri nguoi choi', () => {
  const { g, join, msg, toasts } = setup();
  const a = join('Pho Phuong', 'sv');
  Object.assign(a, { x: 3000, y: 520 });
  msg(a, { t: 'job_start', job: 'flyer' });
  const job = a.ws.out.findLast((m) => m.t === 'job');
  assert.ok(job.street && job.tasks.length >= 10);
  // phat tu xa -> khong tinh
  Object.assign(a, { x: 6700, y: 1100 });
  msg(a, { t: 'job_act', jid: job.jid, w: 0 });
  assert.equal(a.job.live.correct, 0);
  // dung ngay canh tung nguoi -> tinh, du 10 to thi tu ket thuc ca
  for (const w of job.tasks.slice(0, 10)) {
    a.job.last -= 600;
    const { x, y } = walkerPos(w, Date.now() - a.job.started);
    Object.assign(a, { x, y });
    msg(a, { t: 'job_act', jid: job.jid, w: w.i });
  }
  const res = a.ws.out.findLast((m) => m.t === 'job_result');
  assert.equal(res.job, 'flyer');
  assert.equal(res.correct, 10);
  assert.ok(res.pay > 0);

  // Shipper: nhan don o Buu dien, toi dung dia chi thi giao xong
  Object.assign(a, { x: 2060, y: 490 });
  msg(a, { t: 'act', poi: 'buudien', act: 'job', args: { id: 'ship' } });
  for (let n = 0; n < 3; n++) {
    const leg = a.ws.out.findLast((m) => m.t === 'job_leg');
    assert.equal(leg.n, n + 1);
    if (n === 1) {
      a.job.leg.until = Date.now() - 1; // tre han don 2
      g.jobs.tick();
    } else {
      Object.assign(a, { x: leg.x, y: leg.y + 20 });
      a.lastMoveAt -= 100000;
      msg(a, { t: 'move', x: leg.x, y: leg.y + 20, d: 'down', m: 0 });
    }
  }
  const r2 = a.ws.out.findLast((m) => m.t === 'job_result');
  assert.equal(r2.job, 'ship');
  assert.equal(r2.correct, 2);
  assert.equal(r2.wrong, 1);
  assert.ok(r2.pay > 0);
  assert.ok(!toasts(a).some((t) => /quá giờ/.test(t)));
});

test('Shipper: don giao khong tro toi POI hidden', () => {
  const { g, join, msg } = setup();
  const a = join('Ship Test', 'sv');
  Object.assign(a, { x: 2060, y: 490 });
  msg(a, { t: 'act', poi: 'buudien', act: 'job', args: { id: 'ship' } });
  assert.equal(a.job?.id, 'ship');
  const hidden = new Set(POIS.filter((p) => p.hidden).map((p) => p.id));
  assert.ok(hidden.size > 0);
  for (let i = 0; i < 30; i++) {
    a.job.used = new Set();
    Object.assign(a, { x: 500 + (i % 6) * 1000, y: 520 });
    g.jobs.nextLeg(a);
    assert.ok(!hidden.has(a.job.leg.poi), `don ${i} toi POI hidden ${a.job.leg.poi}`);
  }
});

test('Nha tro: vao phong, dat / cat noi that, ngu hoi nang luong, tien dien', () => {
  const { g, join, msg, toasts } = setup();
  const a = join('Chu Phong', 'sv');
  Object.assign(a, { x: 910, y: 490 });
  msg(a, { t: 'home', a: 'enter' });
  assert.match(toasts(a).at(-1), /chưa thuê/);
  msg(a, { t: 'act', poi: 'tro', act: 'rent' });
  assert.ok(a.p.renting);
  msg(a, { t: 'act', poi: 'tro', act: 'enter' });
  let st = a.ws.out.findLast((m) => m.t === 'home');
  assert.ok(a.inHome && st.placed.length === 3, 'phong co san nem, quat, bep gas');
  // dat them TV tu tui, sai cho -> loi, khong mat do
  g.econ.addItem(a.p, 'tv_1', 1);
  msg(a, { t: 'home', a: 'place', id: 'tv_1', x: 500, y: 100 });
  assert.equal(g.econ.count(a.p, 'tv_1'), 1);
  msg(a, { t: 'home', a: 'place', id: 'tv_1', x: 500, y: 420 });
  st = a.ws.out.findLast((m) => m.t === 'home');
  assert.equal(st.placed.length, 4);
  assert.equal(g.econ.count(a.p, 'tv_1'), 0);
  assert.equal(st.power, 1000 + 2000);
  // xem TV giam cang thang, co hoi chieu
  a.p.stats.stress = 50;
  msg(a, { t: 'home', a: 'tv' });
  assert.equal(a.p.stats.stress, 44);
  msg(a, { t: 'home', a: 'tv' });
  assert.match(toasts(a).at(-1), /mỏi mắt/);
  // ngu 1 gio game
  a.p.stats.stamina = 10;
  msg(a, { t: 'home', a: 'sleep', hours: 1 });
  for (let i = 0; i < 60; i++) g.onMinute();
  assert.ok(!a.sleep, 'tu day sau 1 gio');
  assert.ok(a.p.stats.stamina > 18, `hoi nang luong: ${a.p.stats.stamina}`);
  // cat TV ve tui; tien dien tru luc sang ngay moi
  msg(a, { t: 'home', a: 'store', i: 3 });
  assert.equal(g.econ.count(a.p, 'tv_1'), 1);
  const paid = [];
  const pay = g.econ.pay.bind(g.econ);
  g.econ.pay = (p, amount, wallet, reason) => {
    if (p === a.p) paid.push([reason, amount]);
    return pay(p, amount, wallet, reason);
  };
  g.onNewDay();
  assert.deepEqual(paid, [['rent', ECON.rentPerDay], ['power', 1000]]);
  assert.ok(a.p.renting);
  // tra phong: do dat trong phong ve tui
  msg(a, { t: 'act', poi: 'tro', act: 'unrent' });
  assert.equal(g.econ.count(a.p, 'bed_1'), 1);
  assert.equal(g.econ.count(a.p, 'fan_1'), 1);
  assert.equal(g.econ.count(a.p, 'stove_1'), 1);
});

test('Nau an: can bep + nguyen lieu, server cham sao theo thu tu & nhip kim lua', () => {
  const { g, join, msg, toasts } = setup();
  const a = join('Dau Bep', 'sv');
  Object.assign(a, { x: 910, y: 490 });
  msg(a, { t: 'act', poi: 'tro', act: 'rent' });
  msg(a, { t: 'home', a: 'enter' });
  // thieu nguyen lieu
  msg(a, { t: 'cook', a: 'start', dish: 'mon_trung_op_la' });
  assert.match(toasts(a).at(-1), /Thiếu/);
  // mon can sach cong thuc
  msg(a, { t: 'cook', a: 'start', dish: 'mon_canh_chua' });
  assert.match(toasts(a).at(-1), /Sách công thức/);
  for (const id of ['nl_dau_an', 'nl_trung', 'nl_nuoc_mam']) g.econ.addItem(a.p, id, 2);
  msg(a, { t: 'cook', a: 'start', dish: 'mon_trung_op_la' });
  const go = a.ws.out.findLast((m) => m.t === 'cook_go');
  assert.deepEqual(go.steps, ['nl_dau_an', 'nl_trung', 'nl_nuoc_mam']);
  assert.equal(go.bowls.length, 5);
  assert.equal(g.econ.count(a.p, 'nl_trung'), 1, 'tru nguyen lieu khi bat dau');
  // bam dung thu tu, dung luc kim o vung xanh -> 3 sao
  const inZone = (from) => {
    for (let t = from; ; t += 10) {
      const v = cookNeedle(t, go.period);
      if (v > go.zone[0] + 0.02 && v < go.zone[1] - 0.02) return t;
    }
  };
  a.cook.started -= 20000;
  let t = 0;
  const clicks = go.steps.map((ing) => {
    t = inZone(t + 400);
    return { ing, t };
  });
  msg(a, { t: 'cook', a: 'done', cid: go.cid, clicks });
  const r = a.ws.out.findLast((m) => m.t === 'cook_result');
  assert.equal(r.stars, 3);
  assert.equal(g.econ.count(a.p, 'mon_trung_op_la_s3'), 1);
  // lan 2: bam sai thu tu roi bo do -> hong mon
  msg(a, { t: 'cook', a: 'start', dish: 'mon_trung_op_la' });
  const go2 = a.ws.out.findLast((m) => m.t === 'cook_go');
  msg(a, { t: 'cook', a: 'done', cid: go2.cid, clicks: [{ ing: 'nl_trung', t: 100 }] });
  assert.equal(a.ws.out.findLast((m) => m.t === 'cook_result').stars, 0);
});

test('TTTM: mua o quay (gia co dinh, do dat tra the), gacha co bao hiem + phan ra do trung', () => {
  const { g, join, msg, toasts } = setup();
  const a = join('Di Mua Sam', 'sv');
  Object.assign(a, { x: 5800, y: 490 });
  a.p.cash = 1000000;
  a.p.bank = 5000000;
  msg(a, { t: 'poi', id: 'mall' });
  assert.ok(a.ws.out.findLast((m) => m.t === 'mall'), 'vao TTTM');
  msg(a, { t: 'mall', a: 'buy', counter: 'noithat', id: 'bed_2', qty: 1 });
  assert.equal(g.econ.count(a.p, 'bed_2'), 1);
  assert.equal(a.p.bank, 5000000 - 2000000);
  msg(a, { t: 'mall', a: 'buy', counter: 'noithat', id: 'gear_ao_3' });
  assert.match(toasts(a).at(-1), /không bán/);
  msg(a, { t: 'mall', a: 'buy', counter: 'sieuthi', id: 'nl_trung', qty: 3 });
  assert.equal(g.econ.count(a.p, 'nl_trung'), 3);
  // 40 luot chua ra Hiem -> luot 40 chac chan Hiem tro len
  a.p.gacha = { n: 0, sinceRare: 39, sinceLimited: 0 };
  msg(a, { t: 'mall', a: 'gacha' });
  const r = a.ws.out.findLast((m) => m.t === 'mall').spin;
  assert.ok(['rare', 'limited'].includes(r.rar));
  assert.equal(a.p.gacha.sinceRare, 0);
  assert.equal(a.p.cash, 1000000 - 3 * 3000 - 30000);
  // quay trung mon da co -> manh
  const owned = r.id;
  let dupSeen = false;
  for (let i = 0; i < 200 && !dupSeen; i++) {
    msg(a, { t: 'mall', a: 'gacha' });
    const sp = a.ws.out.findLast((m) => m.t === 'mall').spin;
    if (sp.dup) dupSeen = sp.shards > 0;
    a.p.cash = 1000000;
  }
  assert.ok(dupSeen, 'co luot trung do');
  assert.ok(g.econ.count(a.p, 'gacha_manh') > 0);
  assert.ok(g.econ.count(a.p, owned) === 1, 'do trung khong nhan them');
  // doi manh
  g.econ.addItem(a.p, 'gacha_manh', 30);
  msg(a, { t: 'mall', a: 'exchange', kind: 'kinh' });
  assert.ok(g.econ.count(a.p, 'gear_kinh_3') >= 1);
  // ngoai TTTM khong mua duoc
  Object.assign(a, { x: 3000, y: 490 });
  msg(a, { t: 'mall', a: 'gacha' });
  assert.match(toasts(a).at(-1), /Trung Tâm Mua Sắm/);
});

test('Chung cu: thue tuan tu tro chuyen sang mang theo noi that, het han tra phong; mua dut; di bo khong ton nang luong', () => {
  const { g, join, msg, toasts } = setup();
  const a = join('Dan Chung Cu', 'sv');
  a.p.bank = 3_000_000_000;
  // di bo khong ton nang luong
  const stamina = a.p.stats.stamina;
  Object.assign(a, { x: 900, y: 500 });
  a.lastMoveAt -= 1000;
  msg(a, { t: 'move', x: 1050, y: 500, d: 'right', m: 1 });
  assert.equal(a.x, 1050);
  assert.equal(a.p.stats.stamina, stamina);
  // dang thue tro co nem / quat / bep
  Object.assign(a, { x: 910, y: 490 });
  msg(a, { t: 'act', poi: 'tro', act: 'rent' });
  msg(a, { t: 'act', poi: 'tro', act: 'enter' });
  msg(a, { t: 'home', a: 'leave' });
  // thue chung cu: thoi thue tro, noi that chuyen sang
  Object.assign(a, { x: 5445, y: 490 });
  msg(a, { t: 'act', poi: 'apartment', act: 'rent' });
  assert.equal(a.p.renting, false);
  assert.equal(a.p.apartment.until, g.day + APARTMENT.days);
  assert.equal(a.p.bank, 3_000_000_000 - ECON.rentPerDay - APARTMENT.rent);
  msg(a, { t: 'act', poi: 'apartment', act: 'enter' });
  const st = a.ws.out.findLast((m) => m.t === 'home');
  assert.equal(st.room, 'apartment');
  assert.equal(st.placed.length, 3);
  // khong thue tro duoc khi dang o chung cu
  msg(a, { t: 'home', a: 'leave' });
  Object.assign(a, { x: 910, y: 490 });
  msg(a, { t: 'act', poi: 'tro', act: 'rent' });
  assert.match(toasts(a).at(-1), /chung cư/);
  // het han -> tra phong, do ve tui
  g.day = a.p.apartment.until + 1;
  g.onNewDay();
  assert.equal(a.p.apartment, null);
  assert.equal(g.econ.count(a.p, 'bed_1'), 1);
  // mua dut
  Object.assign(a, { x: 5445, y: 490 });
  const bank = a.p.bank;
  msg(a, { t: 'act', poi: 'apartment', act: 'buy' });
  assert.ok(a.p.apartment.owned);
  assert.equal(a.p.bank, bank - APARTMENT.price);
  g.day += 30;
  g.onNewDay();
  assert.ok(a.p.apartment?.owned, 'mua dut thi khong het han');
  // Nha dau gia khong bam tren pho nua, van dau gia tu xa
  msg(a, { t: 'poi', id: 'auction' });
  assert.ok(!a.ws.out.some((m) => m.t === 'dialog' && m.poi === 'auction'));
});

test('GM (chi chay o may): cong / tru tien, hoi chi so, them vat pham', () => {
  const { g, join, msg } = setup();
  const a = join('Admin', 'sv');
  assert.equal(g.selfState(a).gm, true, 'test chay khong co DATABASE_URL -> bat GM');
  msg(a, { t: 'gm', a: 'money', wallet: 'bank', amount: 2000000000 });
  assert.equal(a.p.bank, 100000 + 2000000000);
  msg(a, { t: 'gm', a: 'money', wallet: 'cash', amount: -999999999 });
  assert.equal(a.p.cash, 0, 'khong am tien');
  a.p.stats.stamina = 5;
  msg(a, { t: 'gm', a: 'stats' });
  assert.equal(a.p.stats.stamina, 100);
  msg(a, { t: 'gm', a: 'item', id: 'bed_3', qty: 2 });
  assert.equal(g.econ.count(a.p, 'bed_3'), 2);
});

test('Dat ten: chap nhan tieng Viet go dau to hop (ban phim dien thoai) va ky tu an', () => {
  const { g } = setup();
  const hello = (name) => {
    const ws = { readyState: 1, out: [], send(d) { this.out.push(JSON.parse(d)); }, on() {}, close() {} };
    const s = g.connect(ws);
    g.onMessage(s, JSON.stringify({ t: 'hello', name, cls: 'sv', skin: 'sv_male' }));
    return s;
  };
  const a = hello('Tèo Bán Mía'.normalize('NFD'));
  assert.equal(a.p?.name, 'Tèo Bán Mía', 'NFD -> NFC');
  const b = hello('Cô\u200b Ba\u00a0 Tạp Hóa ');
  assert.equal(b.p?.name, 'Cô Ba Tạp Hóa', 'bo ky tu an, gop khoang trang');
  const c = hello('Tèo Bán Mía');
  assert.match(c.ws.out.at(-1).msg, /đã có người dùng/, 'trung ten sau chuan hoa');
  const d = hello('😀😀');
  assert.ok(!d.p, 'emoji khong hop le');
});

test('Tui do day (I1): khong mua / nhat them duoc, tien va hang khong mat; gop stack va balo +10 o', () => {
  const { g, join, toasts } = setup();
  const a = join('Tui Day', 'sv');
  const p = a.p;
  p.cash = 1000000;
  p.inv = [];
  g.econ.addItem(p, 'nl_trung', 1);
  for (let i = 0; p.inv.length < 20; i++) g.econ.addItem(p, 'balo', 1); // 1 stack + 19 trang bi = 20 o
  assert.equal(p.inv.length, 20);
  assert.equal(g.econ.invCapacity(p), 20);
  // (a) do moi khi day -> bi tu choi, khong tru tien, tui khong doi
  const before = JSON.stringify(p.inv);
  assert.throws(() => g.econ.buyFromNpc(p, 'nl_dau_an', 1, 3000), /Túi đồ đầy/);
  assert.throws(() => g.econ.buyFromNpc(p, 'balo', 2, 1000), /Túi đồ đầy/);
  assert.equal(p.cash, 1000000);
  assert.equal(JSON.stringify(p.inv), before);
  // (b) da co stack cung id -> gop duoc du tui day
  g.econ.buyFromNpc(p, 'nl_trung', 5, 3000);
  assert.equal(g.econ.count(p, 'nl_trung'), 6);
  assert.equal(p.inv.length, 20);
  assert.equal(p.cash, 1000000 - 15000);
  // (c) deo balo -> 30 o
  const bag = p.inv.find((i) => i.id === 'balo');
  p.equip.lung = bag.uid;
  assert.equal(g.econ.invCapacity(p), 30);
  g.econ.buyFromNpc(p, 'nl_dau_an', 1, 3000);
  assert.equal(p.inv.length, 21);
  // gop id trung trong wants: 2 trang bi khi chi con 9 o -> du; 10 -> khong
  assert.doesNotThrow(() => g.econ.assertRoom(p, [['balo', 4], ['balo', 5]]));
  assert.throws(() => g.econ.assertRoom(p, [['balo', 4], ['balo', 6]]), /còn 9 ô trống, cần 10/);
  // (d) nhat ve chai khi day: bi tu choi, NPC con do, nang luong khong tru
  p.equip.lung = null;
  p.inv = p.inv.slice(0, 20);
  for (const i of p.inv) if (i.id === 'nl_dau_an') p.inv.splice(p.inv.indexOf(i), 1);
  while (p.inv.length < 20) g.econ.addItem(p, 'balo', 1);
  g.econ.removeItems(p, {}); // no-op
  p.inv = p.inv.filter((i) => i.id !== 've_chai' && i.id !== 'linh_kien');
  const stam = p.stats.stamina;
  g.npcs.spawnScrap();
  const n = g.npcs.of('scrap').at(-1);
  Object.assign(a, { x: n.x, y: n.y });
  g.npcs.pickScrap(a, n.id);
  assert.ok(g.npcs.list.has(n.id), 've chai con do');
  assert.equal(p.stats.stamina, stam);
  assert.match(toasts(a).at(-1), /Túi đồ đầy/);
  p.inv.pop();
  g.npcs.pickScrap(a, n.id);
  assert.ok(!g.npcs.list.has(n.id), 've chai da nhat');
});
