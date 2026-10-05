// Chay khi co Postgres that: TEST_DATABASE_URL=postgres://... npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import pg from 'pg';
import { Game } from '../game.js';
import { PgDB } from '../pgdb.js';

const URL = process.env.TEST_DATABASE_URL;

test('PostgreSQL: luu va nap lai nguoi choi, the gioi, so cai', { skip: !URL && 'chưa đặt TEST_DATABASE_URL' }, async () => {
  const admin = new pg.Pool({ connectionString: URL });
  await admin.query('DROP TABLE IF EXISTS players, world, ledger');

  const db = await PgDB.open(URL);
  const g = new Game(db);
  const ws = { readyState: 1, out: [], send(d) { this.out.push(JSON.parse(d)); }, on() {}, close() {} };
  const s = g.connect(ws);
  g.onMessage(s, JSON.stringify({ t: 'hello', name: 'Tèo Postgres', cls: 'tt', skin: 'baba_female' }));
  Object.assign(s, { x: 3930, y: 480 });
  g.onMessage(s, JSON.stringify({ t: 'act', poi: 'atm2', act: 'deposit', inputs: { amount: 50000 } }));
  g.day = 7;
  await g.saveAll();

  // Lan ghi thu 2 khong co thay doi -> khong ghi lai
  const before = (await admin.query('SELECT updated_at FROM players')).rows[0].updated_at;
  await db.save();
  const after = (await admin.query('SELECT updated_at FROM players')).rows[0].updated_at;
  assert.deepEqual(after, before);
  await db.close();

  const db2 = await PgDB.open(URL);
  const p = db2.data.players['tèo postgres'];
  assert.equal(p.name, 'Tèo Postgres');
  assert.equal(p.bank, 200000);
  assert.equal(p.cash, 150000 - 50000 - 1000);
  assert.ok(p.inv.some((i) => i.id === 'phoi_banh'));
  assert.equal(db2.data.world.day, 7);
  const kinds = (await admin.query('SELECT kind FROM ledger ORDER BY id')).rows.map((r) => r.kind);
  assert.deepEqual(kinds, ['new_player', 'atm_deposit']);

  // Dang nhap lai bang token sau khi khoi dong lai server
  const g2 = new Game(db2);
  const s2 = g2.connect({ ...ws, out: [] });
  g2.onMessage(s2, JSON.stringify({ t: 'hello', token: p.token }));
  assert.equal(s2.p, p);
  await db2.close();
  await admin.end();
});
