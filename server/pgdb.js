// Luu tru PostgreSQL (vd. Neon). Cung giao dien voi JsonDB:
//   data.players / data.world dung trong bo nho, save() ghi theo lo trong 1 transaction.
// Chi nguoi choi co thay doi moi duoc ghi (so sanh voi ban da luu lan truoc).
import pg from 'pg';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS players (
  name_key   TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  cash       BIGINT NOT NULL,
  bank       BIGINT NOT NULL,
  data       JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS world (
  id   INT PRIMARY KEY,
  data JSONB NOT NULL
);
CREATE TABLE IF NOT EXISTS ledger (
  id     BIGSERIAL PRIMARY KEY,
  ts     TIMESTAMPTZ NOT NULL,
  kind   TEXT NOT NULL,
  player TEXT,
  data   JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS ledger_player_ts ON ledger (player, ts);
`;

export class PgDB {
  static async open(connectionString) {
    const pool = new pg.Pool({ connectionString, max: 4 });
    await pool.query(SCHEMA);
    const db = new PgDB(pool);
    const players = await pool.query('SELECT name_key, data FROM players');
    for (const row of players.rows) {
      db.data.players[row.name_key] = row.data;
      db.saved.set(row.name_key, JSON.stringify(row.data));
    }
    const world = await pool.query('SELECT data FROM world WHERE id = 1');
    if (world.rows[0]) {
      db.data.world = world.rows[0].data;
      db.savedWorld = JSON.stringify(db.data.world);
    }
    return db;
  }

  constructor(pool) {
    this.pool = pool;
    this.data = { players: {}, world: {} };
    this.saved = new Map();
    this.savedWorld = '';
    this.pendingLedger = [];
    this.saving = null;
    this.dirty = false;
  }

  markDirty() {
    this.dirty = true;
  }

  ledger(entry) {
    const { kind, player, ...rest } = entry;
    this.pendingLedger.push([new Date(), kind, player ?? null, JSON.stringify(rest)]);
  }

  // Ghi cac thay doi. Neu lan ghi truoc chua xong thi doi no (khong ghi chong cheo).
  async save() {
    if (this.saving) await this.saving;
    this.saving = this.flush().finally(() => {
      this.saving = null;
    });
    return this.saving;
  }

  async flush() {
    const changed = [];
    for (const [key, p] of Object.entries(this.data.players)) {
      const json = JSON.stringify(p);
      if (this.saved.get(key) !== json) changed.push([key, p, json]);
    }
    const worldJson = JSON.stringify(this.data.world);
    const worldChanged = worldJson !== this.savedWorld;
    const ledger = this.pendingLedger.splice(0);
    if (!changed.length && !worldChanged && !ledger.length) return;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const [key, p, json] of changed) {
        await client.query(
          `INSERT INTO players (name_key, name, token, cash, bank, data, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, now())
           ON CONFLICT (name_key) DO UPDATE
           SET cash = EXCLUDED.cash, bank = EXCLUDED.bank, data = EXCLUDED.data, updated_at = now()`,
          [key, p.name, p.token, Math.round(p.cash), Math.round(p.bank), json],
        );
      }
      if (worldChanged) {
        await client.query(
          'INSERT INTO world (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data',
          [worldJson],
        );
      }
      // Ghi so cai theo lo (toi da 500 dong moi cau lenh)
      for (let i = 0; i < ledger.length; i += 500) {
        const chunk = ledger.slice(i, i + 500);
        const values = chunk.map((_, j) => `($${j * 4 + 1}, $${j * 4 + 2}, $${j * 4 + 3}, $${j * 4 + 4})`).join(',');
        await client.query(`INSERT INTO ledger (ts, kind, player, data) VALUES ${values}`, chunk.flat());
      }
      await client.query('COMMIT');
      for (const [key, , json] of changed) this.saved.set(key, json);
      if (worldChanged) this.savedWorld = worldJson;
      this.dirty = false;
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      // Giu lai so cai de lan sau ghi lai; nguoi choi se duoc so sanh lai tu dau
      this.pendingLedger.unshift(...ledger);
      throw e;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.save();
    await this.pool.end();
  }
}
