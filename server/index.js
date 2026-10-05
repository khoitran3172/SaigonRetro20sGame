import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocketServer } from 'ws';
import { TIME } from '../shared/config.js';
import { JsonDB } from './db.js';
import { Game } from './game.js';
import { PgDB } from './pgdb.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const TICK_MS = 100;
const SAVE_MS = 5000;

// Co DATABASE_URL (vd. Neon) -> PostgreSQL; khong co -> file JSON de chay thu o may
const db = process.env.DATABASE_URL
  ? await PgDB.open(process.env.DATABASE_URL)
  : new JsonDB(path.join(ROOT, 'data', 'db.json'));
console.log(`Lưu trữ: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'file JSON (data/db.json)'}`);
const game = new Game(db);

const app = express();
app.use(express.static(path.join(ROOT, 'client')));
app.use('/shared', express.static(path.join(ROOT, 'shared')));
app.get('/lib/phaser.min.js', (req, res) => res.sendFile(path.join(ROOT, 'node_modules/phaser/dist/phaser.min.js')));
app.get('/api/status', (req, res) => res.json({ online: game.sessions.size, ...game.worldState() }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 8 * 1024 });
wss.on('connection', (ws) => game.connect(ws));

let last = Date.now();
setInterval(() => {
  const now = Date.now();
  game.tick(Math.min(0.25, (now - last) / 1000));
  last = now;
}, TICK_MS);
setInterval(() => game.onMinute(), TIME.msPerGameMinute);

async function persist() {
  try {
    await game.saveAll();
  } catch (e) {
    console.error('Lỗi lưu dữ liệu (sẽ thử lại):', e.message);
  }
}
setInterval(persist, SAVE_MS);

let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  console.log('\nĐang lưu dữ liệu...');
  await persist();
  await db.close?.();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, () => {
  console.log(`Hàng Rong server chạy tại http://localhost:${PORT}`);
});
