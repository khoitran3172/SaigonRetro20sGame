// Luu tru JSON don gian cho ban prototype.
// Ghi atomic (file tam + rename). Production: thay bang PostgreSQL (xem README).
import fs from 'node:fs';
import path from 'node:path';

export class JsonDB {
  constructor(file) {
    this.file = file;
    this.data = { players: {}, world: {} };
    this.dirty = false;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (fs.existsSync(file)) {
      this.data = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    this.ledgerFile = path.join(path.dirname(file), 'ledger.log');
  }

  markDirty() {
    this.dirty = true;
  }

  save(force = false) {
    if (!this.dirty && !force) return;
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.data));
    fs.renameSync(tmp, this.file);
    this.dirty = false;
  }

  // So cai: moi bien dong tien deu duoc ghi lai de doi soat chong dupe.
  ledger(entry) {
    fs.appendFile(this.ledgerFile, `${JSON.stringify({ ts: Date.now(), ...entry })}\n`, () => {});
  }
}
