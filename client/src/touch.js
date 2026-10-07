// Dieu khien cam ung (iOS / Android): nut huong + nut tuong tac + nang khung chat theo ban phim ao

export function isTouchDevice() {
  const ua = navigator.userAgent || '';
  const iPadDesktopMode = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return window.matchMedia('(pointer: coarse)').matches || /iPhone|iPad|iPod|Android/i.test(ua) || iPadDesktopMode;
}

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export class TouchControls {
  constructor() {
    document.body.classList.add('touch');
    this.dir = { x: 0, y: 0 };
    this.held = new Map(); // pointerId -> ten huong
    this.talk = document.getElementById('btn-talk');
    this.talkFn = null;
    this.talkKey = '';

    for (const b of document.querySelectorAll('#dpad button')) {
      const [dx, dy] = DIRS[b.dataset.d];
      const press = (e) => {
        e.preventDefault();
        try { b.setPointerCapture(e.pointerId); } catch { /* pointer da ket thuc */ }
        this.held.set(e.pointerId, [dx, dy]);
        b.classList.add('on');
        this.recalc();
      };
      const release = (e) => {
        this.held.delete(e.pointerId);
        b.classList.remove('on');
        this.recalc();
      };
      b.addEventListener('pointerdown', press);
      b.addEventListener('pointerup', release);
      b.addEventListener('pointercancel', release);
      b.addEventListener('lostpointercapture', release);
      b.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    this.talk.addEventListener('click', () => this.talkFn?.());

    // Mat ngon tay ma khong co pointerup (doi app, Control Center): nha het nut huong
    const reset = () => {
      this.held.clear();
      for (const b of document.querySelectorAll('#dpad .on')) b.classList.remove('on');
      this.recalc();
    };
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', () => document.hidden && reset());

    // Menu ☰: mo/dong nhom nut chuc nang; chon xong tu dong dong
    const body = document.body;
    document.getElementById('btn-menu').addEventListener('click', () => body.classList.toggle('menu-open'));
    document.getElementById('actions').addEventListener('click', (e) => {
      if (e.target.closest('button')) body.classList.remove('menu-open');
    });
    document.getElementById('chat-x').addEventListener('click', () => {
      body.classList.remove('chat-open');
      document.activeElement?.blur();
    });
    // The trang thai: cham de mo rong / thu gon
    document.getElementById('card').addEventListener('click', () => body.classList.toggle('card-open'));

    // Ban phim ao che khung chat: nang theo visualViewport
    const vv = window.visualViewport;
    if (vv) {
      const sync = () => {
        const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        document.documentElement.style.setProperty('--kb', `${Math.round(kb)}px`);
      };
      vv.addEventListener('resize', sync);
      vv.addEventListener('scroll', sync);
      sync();
    }
    // iOS tu cuon trang khi focus o nhap -> tra lai sau khi dong ban phim
    document.addEventListener('focusout', () => setTimeout(() => {
      const a = document.activeElement;
      if (!a || !['INPUT', 'SELECT', 'TEXTAREA'].includes(a.tagName)) window.scrollTo(0, 0);
    }, 60));
  }

  recalc() {
    let x = 0;
    let y = 0;
    for (const [dx, dy] of this.held.values()) {
      x += dx;
      y += dy;
    }
    this.dir = { x: Math.sign(x), y: Math.sign(y) };
  }

  // best: { label, fn } | null — hien nut "noi chuyen" khi dung gan NPC/dia diem
  setInteract(best) {
    const key = best ? best.label : '';
    this.talkFn = best ? best.fn : null;
    if (key === this.talkKey) return;
    this.talkKey = key;
    this.talk.classList.toggle('hidden', !best);
    this.talk.textContent = best ? best.label : '';
  }
}
