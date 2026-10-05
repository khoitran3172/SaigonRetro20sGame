import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocketServer } from 'ws';
import { TIME } from '../shared/config.js';
import { JsonDB } from './db.js';
import { Game } from './game.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const TICK_MS = 100;

const db = new JsonDB(path.join(ROOT, 'data', 'db.json'));
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
setInterval(() => game.saveAll(), 10000);

function shutdown() {
  console.log('\nĐang lưu dữ liệu...');
  game.saveAll();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, () => {
  console.log(`Hàng Rong server chạy tại http://localhost:${PORT}`);
});
