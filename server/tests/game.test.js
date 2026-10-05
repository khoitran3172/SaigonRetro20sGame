import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { ECON, PLOTS } from '../../shared/config.js';
import { JsonDB } from '../db.js';
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

test('Sap hang P2P: che bien, bay ban, mua; tien bao toan tru thue', () => {
  const { g, join, msg } = setup();
  const seller = join('Ba Bay', 'tt', 'baba_female');
  const buyer = join('Khach', 'vp', 'vp_male');
  const plot = PLOTS[0];
  Object.assign(seller, { x: plot.x, y: plot.y + 20 });
  Object.assign(buyer, { x: plot.x, y: plot.y + 60 });
  msg(seller, { t: 'stall_open' });
  const st = g.stalls.get('Ba Bay');
  assert.ok(st?.plot, 'mo sap tai o quy hoach');
  msg(seller, { t: 'act', poi: 'stall:Ba Bay', act: 'cook', args: { id: 'banhmi' } });
  assert.equal(g.econ.count(seller.p, 'banhmi'), 4);
  const stack = seller.p.inv.find((i) => i.id === 'banhmi');
  msg(seller, { t: 'stall_list', uid: stack.uid, qty: 3, price: 20000 });
  assert.equal(st.listings[0].stack.qty, 3);
  assert.equal(g.econ.count(seller.p, 'banhmi'), 1);

  const total = money(seller.p, buyer.p);
  msg(buyer, { t: 'act', poi: 'stall:Ba Bay', act: 'buy', args: { lid: st.listings[0].lid }, inputs: { qty: 2 } });
  assert.equal(g.econ.count(buyer.p, 'banhmi'), 2);
  assert.equal(st.listings[0].stack.qty, 1);
  const tax = Math.round(40000 * ECON.stallTax);
  assert.equal(money(seller.p, buyer.p), total - tax);

  // mua qua so luong -> bi tu choi, khong mat gi
  const snapshot = money(seller.p, buyer.p);
  msg(buyer, { t: 'act', poi: 'stall:Ba Bay', act: 'buy', args: { lid: st.listings[0].lid }, inputs: { qty: 5 } });
  assert.equal(money(seller.p, buyer.p), snapshot);

  // dong sap: hang con lai tra ve tui
  msg(seller, { t: 'act', poi: 'stall:Ba Bay', act: 'close' });
  assert.equal(g.stalls.size, 0);
  assert.equal(g.econ.count(seller.p, 'banhmi'), 2);
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

test('Canh sat phat sap lan chiem', () => {
  const { g, join, msg } = setup();
  const a = join('Lan Chiem', 'tt', 'baba_female');
  Object.assign(a, { x: 1500, y: 1000 });
  msg(a, { t: 'stall_open' });
  const st = g.stalls.get('Lan Chiem');
  assert.equal(st.plot, null);
  const before = money(a.p);
  const cop = g.npcs.of('police')[0];
  cop.onDuty = true;
  Object.assign(cop, { x: st.x + 50, y: st.y, tx: st.x + 50, ty: st.y });
  g.npcs.update(0.1);
  assert.equal(g.stalls.size, 0);
  assert.equal(money(a.p), before - ECON.fineIllegalStall);
});
