import { Net } from './net.js';
import { UI } from './ui.js';
import { WorldScene } from './world.js';
import { isTouchDevice } from './touch.js';
import { setupDesktopLayout } from './layout.js';

// Gan som de bo cuc cam ung ap dung ngay ca khi dang tai game
if (isTouchDevice()) document.body.classList.add('touch');
else setupDesktopLayout();

const load = (n) => fetch(`assets/${n}.json`).then((r) => r.json());
const [chars, props, anims, icons] = await Promise.all([load('chars'), load('props'), load('anim'), load('icons')]);
// Bang hieu ve bang canvas can font tieng Viet san sang truoc
await Promise.race([document.fonts.load('800 20px "Be Vietnam Pro"'), new Promise((r) => setTimeout(r, 2500))]).catch(() => {});

const net = new Net();
const ui = new UI(net, { chars, icons });
let game = null;

net.on('close', () => ui.disconnected());
net.on('kicked', (m) => ui.disconnected(m.msg));

net.on('welcome', (m) => {
  localStorage.setItem('hr_token', m.token);
  localStorage.setItem('hr_name', m.self.name);
  ui.start(m);
  if (game) return;
  game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#2a241e',
    scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
    render: { antialias: true, roundPixels: false },
    scene: [],
  });
  game.scene.add('world', WorldScene, true, { net, ui, manifests: { chars, props, anims }, welcome: m });
  window.hangrong = game; // tien debug trong console
});

try {
  await net.connect();
  ui.showLogin();
} catch {
  ui.disconnected('Không kết nối được máy chủ. Hãy chạy "npm start" rồi tải lại trang.');
}
