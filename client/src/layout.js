// Bo cuc cho may tinh (laptop van phong / cua so nho): tu co giao dien, the nhan vat gon, chat thu gon duoc.
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* bo qua */ } },
};

// Co giao dien lien tuc theo chieu rong/cao cua so: 1440x820 tro len = 100%, nho hon thi thu theo ti le (toi thieu 55%)
function fitScale() {
  const s = Math.min(1, window.innerWidth / 1440, window.innerHeight / 820);
  document.documentElement.style.setProperty('--ui', Math.max(0.55, s).toFixed(3));
  // Giao dien dang bi thu nho -> the nhan vat gon
  document.body.classList.toggle('hud-compact', s < 0.96);
}

// Gom HUD vao 2 dock flex-wrap (tren/duoi): het cho thi tu xuong dong, khong the de nhau
function buildDocks() {
  const hud = document.getElementById('hud');
  const top = Object.assign(document.createElement('div'), { className: 'dock-top' });
  const bottom = Object.assign(document.createElement('div'), { className: 'dock-bottom' });
  const $ = (id) => document.getElementById(id);
  top.append($('card'), $('topbar')); // thong bao giu o ngoai dock de noi tren panel (z-index 30)
  bottom.append($('chat'), $('hotbar'), $('actions'));
  hud.prepend(top, bottom);
}

export function setupDesktopLayout() {
  const body = document.body;
  buildDocks();
  fitScale();
  window.addEventListener('resize', fitScale);

  // The nhan vat: bam de mo rong / thu gon
  document.getElementById('card').addEventListener('click', () => body.classList.toggle('card-open'));

  // Chat thu gon: chi con o nhap (tin nhan van hien tren dau nhan vat); nho lua chon, mac dinh thu gon neu man hinh thap
  const chat = document.getElementById('chat');
  const btn = document.getElementById('chat-min');
  const saved = store.get('hr_chat_min');
  const apply = (min) => {
    chat.classList.toggle('min', min);
    btn.textContent = min ? '▲' : '▼';
    btn.title = min ? 'Mở khung chat' : 'Thu gọn khung chat';
  };
  apply(saved === null ? body.classList.contains('hud-compact') : saved === '1');
  btn.addEventListener('click', () => {
    const min = !chat.classList.contains('min');
    apply(min);
    store.set('hr_chat_min', min ? '1' : '0');
  });
}
