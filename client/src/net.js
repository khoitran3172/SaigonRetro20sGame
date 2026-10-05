// WebSocket client mong: on(type, fn) / send(msg)
export class Net {
  constructor() {
    this.handlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      this.ws = new WebSocket(`${proto}://${location.host}/ws`);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onclose = () => this.emit({ t: 'close' });
      this.ws.onmessage = (e) => this.emit(JSON.parse(e.data));
    });
  }

  emit(m) {
    for (const fn of this.handlers.get(m.t) || []) fn(m);
  }

  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type).push(fn);
  }

  send(msg) {
    if (this.ws?.readyState === 1) this.ws.send(JSON.stringify(msg));
  }
}
