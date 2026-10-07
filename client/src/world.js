// Scene the gioi: ban do 4 khu, nhan vat, NPC, sap hang, giao thong, ngay/dem, thoi tiet.
import { BUILDINGS, CHAT, FLYER, POIS, WORLD, ZONES, walkerPos } from '/shared/config.js';
import { TouchControls, isTouchDevice } from './touch.js';
import { genBuilding, genGround, genMisc, genTubeHouse } from './textures.js';

const FONT = '"Be Vietnam Pro", system-ui, sans-serif';
const CLASS_COLOR = { sv: '#a8f0a0', vp: '#9fd8ff', tt: '#ffc77a' };
const NPC_STYLE = {
  police: { skin: 'vp_male', tint: 0xc4d488, color: '#bff0ff', label: '🚓 Cảnh sát' },
  thief: { skin: 'sv_male', tint: 0x6c6c92, color: '#ff9a85' },
  scrap: { image: 'scrap_pickup', color: '#ffe680', label: '' },
};
const POI_ICON = {
  school: '🏫', tro: '🏠', net: '🖥️', veso: '🎫', buudien: '📮', cafe: '☕', banhmi: '🥖', bangdia: '📼', market: '🧺',
  barber: '💈', cho: '🛒', mechanic: '🔧', atm: '🏧', bank: '🏦', office: '🏢', auction: '🔨', showroom: '🛵',
  fashion: '👗', junk: '♻️', comtam: '🍛', trasua: '🧋', tutor: '📚', mall: '🛍️', apartment: '🏢',
};
// Vi tri nguoi ngoi tren xe (theo ty le anh xe): dx > 0 = tien ve dau xe, dy = nang len
export const RIDE_FIT = { scale: 0.75, dx: -0.05, dy: 0.32 };
// Xe nguoi choi dang lai -> anh xe (dau xe quay PHAI)
const VEHICLE_SPRITE = { xe_cub: 'veh_cub', xe_ga: 'veh_ga', xe_pkl: 'veh_pkl', xe_dap: 'veh_dap' };
// Giao thong trang tri: [anh, trong so]. Chi con taxi + xe buyt (G32: bo xe may)
const TRAFFIC = [['veh_taxi', 2], ['veh_taxi2', 2], ['veh_bus', 1]];
const SEND_HZ = 15;
const INTERACT_RANGE = 120;
const DIALOG_CLOSE_RANGE = 200; // xa hon tam tuong tac cua server (170) mot chut
const lerp = (a, b, t) => a + (b - a) * t;

export class WorldScene extends Phaser.Scene {
  init(data) {
    Object.assign(this, data);
    this.avatars = new Map();
    this.npcObjs = new Map();
    this.lamps = [];
    this.traffic = [];
    this.moveTarget = null;
    this.pending = null;
    this.lastSend = 0;
    this.lastSent = '';
    this.darkness = 0;
    this.weather = 'sunny';
  }

  preload() {
    const { chars, props, anims } = this.manifests;
    // Thanh tien do tai asset
    const { width, height } = this.scale;
    const bar = this.add.rectangle(width / 2 - 150, height / 2, 0, 10, 0xe8a33c).setOrigin(0, 0.5).setScrollFactor(0);
    const txt = this.add.text(width / 2, height / 2 - 24, 'Đang tải phố phường...', { fontFamily: FONT, fontSize: '15px', color: '#f4ead8' })
      .setOrigin(0.5).setScrollFactor(0);
    this.load.on('progress', (v) => bar.setSize(300 * v, 10));
    this.load.once('complete', () => {
      bar.destroy();
      txt.destroy();
    });
    for (const [k, m] of Object.entries(chars)) {
      this.load.spritesheet(k, `assets/chars/${k}.png`, { frameWidth: m.frameWidth, frameHeight: m.frameHeight });
    }
    for (const k of Object.keys(props)) this.load.image(k, `assets/props/${k}.png`);
    for (const b of BUILDINGS) if (b.v2) this.load.image(b.sprite, `assets/v2/bld/${b.sprite}.png`);
    for (const [k, m] of Object.entries(anims)) {
      this.load.spritesheet(k, `assets/anim/${k}.png`, { frameWidth: m.frameWidth, frameHeight: m.frameHeight });
    }
  }

  create() {
    genGround(this);
    genMisc(this);
    this.makeAnims();
    this.buildGround();
    this.buildBuildings();
    this.buildProps();
    this.buildPois();
    this.setupAtmosphere();
    this.setupInput();
    this.ui.onNavigate = (poi) => this.navigateTo(poi);
    this.ui.worldScene = this;
    this.setupNet();

    const w = this.welcome;
    this.myId = w.id;
    this.me = this.spawnAvatar({ id: w.id, n: w.self.name, x: w.x, y: w.y, sk: w.self.skin, c: w.self.cls, ti: w.self.title }, true);
    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD.width, WORLD.height);
    cam.startFollow(this.me.sprite, true, 0.12, 0.12, 0, 40);
    this.fitZoom();
    this.scale.on('resize', () => this.fitZoom());
    this.applyWorld(w.world, true);
    this.time.addEvent({ delay: 1400, loop: true, callback: () => this.spawnTraffic() });
  }

  fitZoom() {
    const h = this.scale.height;
    this.cameras.main.setZoom(Phaser.Math.Clamp(h / 900, 0.7, 1.4));
    this.sizeOverlay();
  }

  sizeOverlay() {
    if (!this.overlay) return;
    const { width, height } = this.scale;
    this.overlay.setPosition(width / 2, height / 2).setSize(width * 3, height * 3);
    this.overlay.setOrigin(0.5);
  }

  // ================================================================ anim
  makeAnims() {
    for (const [skin, m] of Object.entries(this.manifests.chars)) {
      for (const [name, frames] of Object.entries(m.anims)) {
        this.anims.create({
          key: `${skin}_${name}`,
          frames: this.anims.generateFrameNumbers(skin, { frames }),
          frameRate: name === 'idle' ? 4 : 9,
          repeat: -1,
        });
      }
    }
    for (const [k, m] of Object.entries(this.manifests.anims)) {
      this.anims.create({ key: k, frames: this.anims.generateFrameNumbers(k, { start: 0, end: m.frames - 1 }), frameRate: 5, repeat: -1 });
    }
  }

  // ================================================================ dung ban do
  buildGround() {
    const W = WORLD.width;
    // troi + skyline phia sau
    const g = this.add.graphics().setDepth(-1000);
    g.fillGradientStyle(0x86b5d9, 0x86b5d9, 0xc9dbe6, 0xc9dbe6, 1);
    g.fillRect(0, 0, W, WORLD.buildingBase);
    const rnd = new Phaser.Math.RandomDataGenerator(['skyline']);
    for (const [color, minH, maxH] of [[0x8197ad, 140, 300], [0x6b8199, 80, 220]]) {
      g.fillStyle(color, 1);
      for (let x = 0; x < W;) {
        const w = rnd.between(60, 160);
        const cbd = x > 4100 && x < 5700;
        const h = rnd.between(minH, maxH) + (cbd ? 140 : 0);
        g.fillRect(x, WORLD.buildingBase - h, w, h);
        x += w + rnd.between(0, 20);
      }
    }
    const tileFor = { daihoc: 'tile_grass', phoam: 'tile_plaza', cbd: 'tile_stone', ngoaio: 'tile_dirt' };
    this.add.tileSprite(0, 440, W, 140, 'tile_sidewalk').setOrigin(0).setDepth(-900);
    this.add.tileSprite(0, 580, W, 200, 'tile_road').setOrigin(0).setDepth(-900);
    this.add.tileSprite(0, 784, W, 56, 'tile_sidewalk').setOrigin(0).setDepth(-900);
    for (const z of ZONES) this.add.tileSprite(z.x0, 840, z.x1 - z.x0, 360, tileFor[z.id]).setOrigin(0).setDepth(-900);
    const r = this.add.graphics().setDepth(-890);
    r.fillStyle(0x6f675b, 1);
    r.fillRect(0, 576, W, 6);
    r.fillRect(0, 778, W, 6);
    r.fillStyle(0xe8e4d8, 0.85);
    for (let x = 0; x < W; x += 70) r.fillRect(x, 678, 36, 4);
    r.fillStyle(0xe8c04a, 0.9);
    r.fillRect(0, 590, W, 3);
    r.fillRect(0, 766, W, 3);
    // vach qua duong
    r.fillStyle(0xf2f2f2, 0.9);
    for (const cx of [700, 1650, 2720, 4190, 4900, 5650]) {
      for (let y = 596; y < 764; y += 22) r.fillRect(cx - 40, y, 80, 12);
    }
    // san bong mini (Khu 3)
    r.lineStyle(4, 0xf2f2f2, 0.85);
    r.strokeRect(160, 890, 700, 270);
    r.lineBetween(510, 890, 510, 1160);
    r.strokeCircle(510, 1025, 50);
    this.prop('goal_mini', 190, 1062);
    this.prop('goal_mini', 830, 1062, { flip: true });
    // nhan khu vuc
    for (const z of ZONES) {
      this.add.text((z.x0 + z.x1) / 2, 1180, z.name.toUpperCase(), {
        fontFamily: FONT, fontSize: '22px', color: '#ffffff', fontStyle: '800', stroke: '#000', strokeThickness: 4,
      }).setOrigin(0.5, 1).setAlpha(0.55).setDepth(-870);
    }
  }

  buildBuildings() {
    const base = WORLD.buildingBase + 6;
    const used = [];
    for (const b of BUILDINGS) {
      let key = b.sprite;
      if (b.gen) {
        // anh tam (chua co art) — xem docs/ASSET_PROMPTS.md muc 6
        key = `bld_${b.id}`;
        genBuilding(this, key, b.gen);
      }
      const img = this.add.image(b.x, base, key).setOrigin(0.5, 1).setDepth(WORLD.buildingBase).setScale(b.scale || 1);
      const bw = img.displayWidth;
      const bh = img.displayHeight;
      const left = b.x - bw / 2;
      const top = base - bh;
      used.push([left, left + bw]);
      if (b.sign) this.signText(b.sign, left, top, bw, bh);
      const neon = b.gen?.neon ?? (b.sign?.neon ? Phaser.Display.Color.HexStringToColor(b.sign.neon).color : null);
      if (neon != null) {
        const sy = b.sign ? top + (bh * (b.sign.box[1] + b.sign.box[3])) / 2 : top + 44;
        const glow = this.add.image(b.x, sy, 'glow').setScale(bw / 200, 0.5)
          .setTint(neon).setBlendMode(Phaser.BlendModes.ADD).setDepth(5001).setAlpha(0);
        this.lamps.push({ img: glow, max: 0.7 });
      }
    }
    // Lap khe giua cong trinh bang nha ong (art tube_1..8; chua co art thi dung anh tam): dat lui sau,
    // khe hep thi hai mep khuat sau cong trinh ben canh. Ngoai o (x > 5600) trong cay.
    const tubes = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `tube_${i}`).filter((k) => this.textures.exists(k));
    let seed = 1;
    const nextTube = () => {
      seed++;
      if (tubes.length) {
        const key = tubes[(seed * 3) % tubes.length];
        return { key, w: this.textures.get(key).getSourceImage().width };
      }
      const key = `tube_${seed}`;
      return { key, w: genTubeHouse(this, key, seed * 7919).w };
    };
    const CITY_END = 5590; // sau Nha Dau Gia: TTTM roi den Ngoai o (trong cay)
    const gaps = [];
    let prev = 0;
    for (const [a, b] of [...used].sort((p, q) => p[0] - q[0])) {
      if (a - prev >= 20) gaps.push([prev, Math.min(a, CITY_END)]);
      prev = Math.max(prev, b);
    }
    if (prev < CITY_END) gaps.push([prev, CITY_END]);
    for (const [a, b] of gaps) {
      for (let x = a; b - x >= 20;) {
        const { key, w } = nextTube();
        const cx = b - x < w ? (x + b) / 2 : x + w / 2;
        this.add.image(cx, base, key).setOrigin(0.5, 1).setDepth(WORLD.buildingBase - 1);
        x += w;
      }
    }
    const free = (x0, x1) => used.every(([a, b]) => x1 < a - 4 || x0 > b + 4);
    for (let x = CITY_END; x < WORLD.width; x += 110) {
      if (free(x, x + 90)) this.prop(seed++ % 2 ? 'tree_bang' : 'tree_me', x + 45, 446, { depth: 439, scale: 0.85 });
    }
  }

  // In chu tieng Viet len bien hieu trong cua art
  signText(sign, left, top, w, h) {
    const [x0, y0, x1, y1] = sign.box;
    const bw = (x1 - x0) * w;
    const bh = (y1 - y0) * h;
    const t = this.add.text(left + ((x0 + x1) / 2) * w, top + ((y0 + y1) / 2) * h, sign.text, {
      fontFamily: FONT, fontStyle: '800', fontSize: `${Math.round(bh * 0.55)}px`,
      color: sign.neon || '#7a2a18', stroke: sign.neon ? '#0b1a10' : '#f6ecd2', strokeThickness: sign.neon ? 3 : 1,
    }).setOrigin(0.5).setDepth(WORLD.buildingBase + 0.5);
    if (t.width > bw * 0.9) t.setScale((bw * 0.9) / t.width);
  }

  prop(key, x, y, opts = {}) {
    const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(opts.depth ?? y);
    if (opts.scale) img.setScale(opts.scale);
    if (opts.flip) img.setFlipX(true);
    if (opts.tint) img.setTint(opts.tint);
    return img;
  }

  lampGlow(x, y) {
    const glow = this.add.image(x, y, 'glow').setScale(0.9).setBlendMode(Phaser.BlendModes.ADD).setDepth(5001).setAlpha(0);
    const pool = this.add.image(x, 640, 'glow').setScale(1.6, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(5001).setAlpha(0);
    this.lamps.push({ img: glow, max: 0.9 }, { img: pool, max: 0.45 });
  }

  buildProps() {
    // Cot dien xen den duong doc mep via he tren
    for (let i = 0, x = 160; x < WORLD.width; x += 420, i++) {
      if (i % 2 === 0) {
        const pole = this.prop('power_pole_v2', x, 590);
        this.lampGlow(x - pole.width * 0.32, 590 - pole.height * 0.79);
      } else {
        const lamp = this.prop('street_lamp', x, 590);
        this.lampGlow(x + lamp.width * 0.3, 590 - lamp.height + 10);
      }
    }
    // Tram xe buyt (G29: moi khu 1 tram) + diem don taxi — hien chi trang tri, chua co he thong buyt/taxi
    // Cay via he duoi (tranh khu o quy hoach), thung rac, nap cong
    for (let i = 0, x = 120; x < WORLD.width; x += 330, i++) {
      if (x > 1780 && x < 3620) continue;
      this.prop(i % 2 ? 'tree_me' : 'tree_bang', x, 818, { scale: 0.8 });
    }
    for (const x of [980, 2380, 3700, 4760, 5560]) this.prop('trash_bin', x, 830);
    for (const x of [520, 1900, 3300, 4600, 6000]) this.prop('manhole', x, 700, { depth: -880 });
    // Khu 3: lang dai hoc
    this.prop('plant_pots', 1150, 472);
    this.prop('ganh_hang_v2', 1120, 1010);
    this.prop('bench', 1000, 1120);
    this.prop('bench', 1300, 1120);
    // Khu 1: ban tra da, co tuong, gia dinh, tre con
    this.prop('sign_stand', 2700, 470);
    this.prop('stool_blue_v2', 2420, 1000);
    this.prop('table_co_tuong', 2470, 1010);
    this.prop('stool_red_v2', 2525, 1000);
    this.prop('stools_family', 2700, 1080);
    this.bob(this.prop('npc_girl', 2830, 1060));
    this.bob(this.prop('npc_boy', 2875, 1066));
    this.prop('cart_mia', 3300, 1090);
    this.prop('stool_green', 3360, 1100);
    this.prop('stool_pink_v2', 3240, 1104);
    this.prop('bench', 3800, 1120);
    this.prop('tires_v2', 4255, 575);
    // Khu 2
    this.prop('plant_pots', 4250, 472);
    this.prop('plant_pots', 4760, 472);
    this.prop('plant_pots', 5260, 472);
    this.prop('veh_cub', 4560, 905);
    this.prop('veh_ga', 4740, 905);
    this.prop('bench', 5000, 1110);
    // Khu 4: bai phe lieu
    for (const [x, y] of [[5780, 1000], [5960, 1120], [6390, 940], [6640, 1080], [6560, 560]]) this.prop('tires_v2', x, y);
    for (const [x, y] of [[5900, 900], [6200, 1060], [6500, 1150], [6120, 560]]) this.prop('junk_pile', x, y);
    this.prop('veh_cub', 6000, 1100, { tint: 0x9a9080 });
  }

  bob(img) {
    this.tweens.add({ targets: img, y: img.y - 3, duration: 600 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    return img;
  }

  buildPois() {
    // Showroom / thoi trang: anh tam (chua co art)
    const kiosk = (key, sign, bg, wall) => genBuilding(this, key, { w: 190, h: 130, wall, roof: bg, sign, signBg: bg, windows: 'shop' });
    kiosk('kiosk_showroom', 'SHOWROOM XE', 0x1f4a7a, 0xdfe6ee);
    kiosk('kiosk_fashion', 'THỜI TRANG', 0x7a1f4f, 0xf2d6e6);

    for (const poi of POIS) {
      if (poi.hidden) continue;
      if (poi.kind === 'showroom') this.prop('kiosk_showroom', poi.x, poi.y - 14);
      if (poi.kind === 'fashion') this.prop('kiosk_fashion', poi.x, poi.y - 14);
      if (poi.kind === 'atm') this.prop('atm_v2', poi.x, poi.y < 600 ? 456 : poi.y - 10);
      if (poi.prop) this.prop(poi.prop, poi.x + (poi.propDx || 0), poi.y + (poi.propDy || 0));
      if (poi.npc) this.bob(this.prop(poi.npc, poi.x + (poi.npcDx || 0), poi.y + 4));
      if (poi.work) {
        const y = poi.y + 6 + (poi.workDy || 0);
        this.add.sprite(poi.x + (poi.workDx || 0), y, poi.work).setOrigin(0.5, 1).setDepth(y).play(poi.work);
      }

      const label = this.add.text(poi.x, poi.y - (poi.y < 600 ? 120 : 140), `${POI_ICON[poi.kind] || '❔'} ${poi.name}`, {
        fontFamily: FONT, fontSize: '12px', color: '#fff6dc', fontStyle: '800',
        backgroundColor: 'rgba(30,22,16,0.72)', padding: { x: 6, y: 3 },
      }).setOrigin(0.5, 1).setDepth(4000);
      this.tweens.add({ targets: label, y: label.y - 4, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      poi.label = label;

      const zone = this.add.zone(poi.x, poi.y - 50, 140, 130).setInteractive({ useHandCursor: true }).setDepth(poi.y);
      zone.on('pointerdown', () => this.tapInteract(poi.x, poi.y + 24, () => this.net.send({ t: 'poi', id: poi.id })));
      zone.on('pointerover', () => label.setColor('#ffd34d'));
      zone.on('pointerout', () => label.setColor('#fff6dc'));
    }
  }

  // ================================================================ khong khi: ngay dem, mua, nang
  setupAtmosphere() {
    // Phu rong gap 3 man hinh: camera zoom van co tac dung len doi tuong scrollFactor 0
    this.overlay = this.add.rectangle(0, 0, 1, 1, 0x0a1030, 0).setOrigin(0.5).setScrollFactor(0).setDepth(5000);
    this.sizeOverlay();
    this.rain = this.add.particles(0, 0, 'raindrop', {
      x: { min: -100, max: 2600 }, y: -20, lifespan: 1100, speedY: { min: 700, max: 900 }, speedX: -90,
      quantity: 4, frequency: 12, alpha: { start: 0.7, end: 0.3 }, emitting: false,
    }).setScrollFactor(0).setDepth(5002);
  }

  applyWorld(w, instant = false) {
    this.weather = w.weather;
    this.ui.setWorld(w);
    const h = w.minute / 60;
    let dark;
    if (h < 5) dark = 0.62;
    else if (h < 7) dark = (0.62 * (7 - h)) / 2;
    else if (h < 17) dark = 0;
    else if (h < 20) dark = (0.62 * (h - 17)) / 3;
    else dark = 0.62;
    let color = 0x0a1030;
    if (h >= 16.5 && h < 19) color = 0x5a2a10;
    if (h >= 5 && h < 7) color = 0x3a2a40;
    let alpha = dark;
    if (w.weather === 'rain') {
      alpha = Math.max(alpha, 0.28);
      if (!dark) color = 0x2a3440;
    } else if (w.weather === 'hot' && !dark) {
      color = 0xff9a2a;
      alpha = 0.1;
    }
    this.darkness = dark;
    this.overlay.fillColor = color;
    if (instant) this.overlay.fillAlpha = alpha;
    else this.tweens.add({ targets: this.overlay, fillAlpha: alpha, duration: 900 });
    const lampAlpha = Math.min(1, dark / 0.45);
    for (const l of this.lamps) l.img.setAlpha(l.max * lampAlpha);
    this.rain.emitting = w.weather === 'rain';
  }

  // ================================================================ input
  setupInput() {
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E', false);
    if (isTouchDevice()) this.touch = new TouchControls();
    this.input.on('pointerdown', (pointer, objs) => {
      // Cham vao khung game thi dong ban phim ao (canvas khong tu lam mat focus o nhap)
      if (this.ui.typing) document.activeElement.blur();
      if (objs.length) return;
      this.pending = null;
      this.moveTarget = { x: pointer.worldX, y: pointer.worldY };
    });
    this.input.keyboard.on('keydown-E', () => {
      if (this.ui.typing || this.ui.locked) return;
      this.nearestInteract()?.fn();
    });
  }

  // Doi tuong tuong tac gan nhat (E tren may tinh, nut "Noi chuyen" tren cam ung)
  nearestInteract() {
    const me = this.me;
    if (!me) return null;
    const w = this.nearestWalker(); // dang phat to roi: uu tien phat cho nguoi gan nhat
    if (w) return { d: 0, label: '📄 Phát tờ rơi', fn: () => this.jobWalkers.onGive(w.w.i) };
    let best = null;
    const consider = (d, label, fn) => {
      if (!best || d < best.d) best = { d, label, fn };
    };
    for (const poi of POIS) {
      if (poi.hidden) continue;
      const d = Phaser.Math.Distance.Between(poi.x, poi.y, me.x, me.y);
      if (d < 160) consider(d, `${POI_ICON[poi.kind] || '💬'} ${poi.name}`, () => this.net.send({ t: 'poi', id: poi.id }));
    }
    for (const [id, o] of this.npcObjs) {
      const range = o.k === 'scrap' ? 90 : o.k === 'thief' ? 140 : 0;
      if (!range) continue;
      const d = Phaser.Math.Distance.Between(o.x, o.y, me.x, me.y);
      if (d < range) consider(d, o.k === 'scrap' ? '♻️ Nhặt ve chai' : '🦹 Đuổi trộm', () => this.net.send({ t: 'poi', id: `${o.k}:${id}` }));
    }
    return best;
  }

  // Cham vao NPC / cua hang: may tinh -> di toi roi tu mo; cam ung -> chi di toi, den gan thi hien nut "Noi chuyen"
  tapInteract(x, y, fn, range = INTERACT_RANGE, track = null) {
    if (!this.touch) return this.goInteract(x, y, fn, range, track);
    this.pending = null;
    this.moveTarget = { x, y };
  }

  // App Ban do tren dien thoai: tu di toi dia diem roi mo hop thoai
  navigateTo(poi) {
    this.goInteract(poi.x, poi.y + 24, () => this.net.send({ t: 'poi', id: poi.id }));
  }

  // track: ham tra vi tri moi (doi tuong dang di chuyen) -> bam theo
  goInteract(x, y, fn, range = INTERACT_RANGE, track = null) {
    this.moveTarget = { x, y };
    this.pending = { x, y, fn, range, track };
  }

  // ================================================================ nghe tren pho
  // Phat to roi: nguoi di duong chi nguoi dang lam ca moi thay (server gui danh sach, vi tri tinh theo walkerPos)
  showWalkers(list, onGive) {
    for (const o of this.jobWalkers?.objs || []) for (const g of [o.sprite, o.shadow, o.label]) g.destroy();
    this.jobWalkers = null;
    if (!list) return;
    const objs = list.map((w) => {
      const shadow = this.add.image(w.x0, w.y, 'shadow');
      const sprite = this.add.sprite(w.x0, w.y, w.sk, 0).setOrigin(0.5, 1).setInteractive({ useHandCursor: true });
      const label = this.add.text(w.x0, w.y, '📄?', {
        fontFamily: FONT, fontSize: '13px', fontStyle: '800', color: '#ffe680', stroke: '#1a120c', strokeThickness: 4,
      }).setOrigin(0.5, 1);
      const o = { w, sprite, shadow, label, skin: w.sk, x: w.x0, y: w.y, anim: '', got: false };
      sprite.on('pointerdown', () => {
        if (o.got) return;
        this.tapInteract(o.x, o.y, () => onGive(w.i), 90, () => (o.got ? null : { x: o.x, y: o.y }));
      });
      return o;
    });
    this.jobWalkers = { objs, onGive, t0: performance.now() };
  }

  walkerGot(i) {
    const o = this.jobWalkers?.objs.find((x) => x.w.i === i);
    if (!o) return;
    o.got = true;
    o.label.setText('✅').setColor('#9fe58a');
    o.sprite.disableInteractive();
    this.floatText(o.x, o.y - 90, '+1 tờ rơi', '#ffe680');
  }

  nearestWalker() {
    if (!this.jobWalkers) return null;
    let best = null;
    for (const o of this.jobWalkers.objs) {
      const d = Phaser.Math.Distance.Between(o.x, o.y, this.me.x, this.me.y);
      if (!o.got && d < FLYER.range - 20 && (!best || d < best.d)) best = { w: o.w, d };
    }
    return best;
  }

  updateWalkers(time) {
    const jw = this.jobWalkers;
    if (!jw) return;
    const ms = performance.now() - jw.t0;
    for (const o of jw.objs) {
      const p = walkerPos(o.w, ms);
      o.x = p.x;
      o.y = p.y;
      o.sprite.setPosition(p.x, p.y).setDepth(p.y);
      o.shadow.setPosition(p.x, p.y).setDepth(p.y - 1);
      o.label.setPosition(p.x, p.y - o.sprite.displayHeight - 4 - Math.abs(Math.sin(time / 300)) * 3).setDepth(4000);
      this.playAnim(o, this.animKey(o.skin, p.dir, true), p.dir);
    }
  }

  // Shipper: moc chi diem giao (nhan tren dia diem + mui ten o mep man hinh khi o xa)
  setJobTarget(t) {
    this.jobTarget?.mark.destroy();
    this.jobTarget?.arrow.destroy();
    this.jobTarget = null;
    if (!t) return;
    const style = { fontFamily: FONT, fontSize: '15px', fontStyle: '800', color: '#ffe680', backgroundColor: 'rgba(122,40,20,0.85)', padding: { x: 8, y: 4 } };
    const mark = this.add.text(t.x, t.y - 70, `${t.label} ▼`, style).setOrigin(0.5, 1).setDepth(4200);
    const arrow = this.add.text(0, 0, '', style).setOrigin(0.5).setDepth(4200);
    this.jobTarget = { ...t, mark, arrow };
  }

  updateJobTarget(time) {
    const t = this.jobTarget;
    if (!t) return;
    t.mark.y = t.y - 70 - Math.abs(Math.sin(time / 250)) * 8;
    const view = this.cameras.main.worldView;
    const off = t.x < view.left + 40 || t.x > view.right - 40;
    t.arrow.setVisible(off);
    if (off) {
      const left = t.x < view.left;
      const m = Math.round(Math.abs(t.x - this.me.x) / 10);
      t.arrow.setText(left ? `◀ 📦 ${m}m` : `📦 ${m}m ▶`);
      t.arrow.setPosition(left ? view.left + t.arrow.width / 2 + 12 : view.right - t.arrow.width / 2 - 12, view.top + view.height * 0.45);
    }
  }

  // ================================================================ mang
  setupNet() {
    const net = this.net;
    net.on('snap', (m) => this.onSnap(m));
    net.on('time', (m) => this.applyWorld(m));
    net.on('correct', (m) => {
      this.me.x = m.x;
      this.me.y = m.y;
      this.moveTarget = null;
    });
    net.on('leave', (m) => this.removeAvatar(m.id));
    net.on('chat', (m) => {
      if (m.ch !== 'near') return;
      const a = this.avatars.get(m.id);
      if (a) this.bubble(a, m.text, m.dist, m.emote);
    });
  }

  onSnap(m) {
    const seen = new Set();
    for (const p of m.p) {
      seen.add(p.id);
      let a = this.avatars.get(p.id);
      if (!a) a = this.spawnAvatar(p, false);
      if (p.id !== this.myId) {
        a.tx = p.x;
        a.ty = p.y;
        a.dir = p.d;
        a.moving = !!p.m;
      }
      if (a.title !== p.ti) {
        a.title = p.ti;
        a.titleText.setText(p.ti ? `「${p.ti}」` : '');
      }
      a.vehicleId = p.v;
      a.auraKind = p.a;
    }
    for (const id of [...this.avatars.keys()]) if (!seen.has(id) && id !== this.myId) this.removeAvatar(id);

    const seenN = new Set();
    for (const n of m.n) {
      seenN.add(n.id);
      let o = this.npcObjs.get(n.id);
      if (!o) o = this.spawnNpc(n);
      o.tx = n.x;
      o.ty = n.y;
      o.dir = n.d;
      o.moving = !!n.m;
      if (n.k === 'thief') o.label.setText(n.l === 'Kẻ khả nghi' ? '🦹 Kẻ khả nghi — click để đuổi!' : `🦹 ${n.l}`);
    }
    for (const [id, o] of this.npcObjs) {
      if (!seenN.has(id)) {
        o.sprite.destroy();
        o.label.destroy();
        o.shadow.destroy();
        this.npcObjs.delete(id);
      }
    }

  }

  // ================================================================ thuc the
  spawnAvatar(d, isMe) {
    const shadow = this.add.image(d.x, d.y, 'shadow');
    const sprite = this.add.sprite(d.x, d.y, d.sk, 0).setOrigin(0.5, 1);
    const rider = this.add.image(d.x, d.y, 'cub_rider').setOrigin(0.5, 1).setVisible(false);
    const veh = this.add.image(d.x, d.y, 'veh_cub').setOrigin(0.5, 1).setVisible(false);
    const aura = this.add.image(d.x, d.y, 'aura').setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
    const label = this.add.text(d.x, d.y, d.n, {
      fontFamily: FONT, fontSize: '12px', fontStyle: '800', color: isMe ? '#ffe680' : CLASS_COLOR[d.c] || '#fff',
      stroke: '#1a120c', strokeThickness: 4,
    }).setOrigin(0.5, 1);
    const titleText = this.add.text(d.x, d.y, d.ti ? `「${d.ti}」` : '', {
      fontFamily: FONT, fontSize: '10px', color: '#ffd34d', stroke: '#1a120c', strokeThickness: 3,
    }).setOrigin(0.5, 1);
    const a = {
      id: d.id, isMe, sprite, shadow, rider, veh, aura, label, titleText, skin: d.sk, title: d.ti,
      x: d.x, y: d.y, tx: d.x, ty: d.y, dir: 'down', moving: false, bubbles: [], anim: '',
    };
    this.avatars.set(d.id, a);
    return a;
  }

  removeAvatar(id) {
    const a = this.avatars.get(id);
    if (!a || a.isMe) return;
    for (const o of [a.sprite, a.shadow, a.rider, a.veh, a.aura, a.label, a.titleText, ...a.bubbles]) o.destroy();
    this.avatars.delete(id);
  }

  spawnNpc(n) {
    const st = NPC_STYLE[n.k] || NPC_STYLE.scrap;
    const shadow = this.add.image(n.x, n.y, 'shadow').setScale(n.k === 'scrap' ? 0.5 : 1);
    let sprite;
    if (st.skin) sprite = this.add.sprite(n.x, n.y, st.skin, 0).setOrigin(0.5, 1).setTint(st.tint);
    else sprite = this.add.image(n.x, n.y, st.image).setOrigin(0.5, 1);
    if (st.image && st.tint) sprite.setTint(st.tint);
    const label = this.add.text(n.x, n.y, st.label ?? n.l, {
      fontFamily: FONT, fontSize: '11px', fontStyle: '800', color: st.color, stroke: '#1a120c', strokeThickness: 4,
    }).setOrigin(0.5, 1);
    const o = { k: n.k, st, sprite, label, shadow, x: n.x, y: n.y, tx: n.x, ty: n.y, dir: 'down', moving: false, anim: '' };
    if (n.k === 'scrap') {
      this.tweens.add({ targets: sprite, alpha: 0.55, duration: 500, yoyo: true, repeat: -1 });
      sprite.setInteractive({ useHandCursor: true }).on('pointerdown', () =>
        this.tapInteract(n.x, n.y + 4, () => this.net.send({ t: 'poi', id: `scrap:${n.id}` }), 60));
    } else if (n.k === 'thief') {
      sprite.setInteractive({ useHandCursor: true }).on('pointerdown', () =>
        this.tapInteract(o.x, o.y, () => this.net.send({ t: 'poi', id: `thief:${n.id}` }), 140));
    }
    this.npcObjs.set(n.id, o);
    return o;
  }

  bubble(a, text, dist = 0, emote = false) {
    const k = 1 - Math.min(1, dist / CHAT.nearRadius);
    const b = this.add.text(a.x, a.y, text, {
      fontFamily: FONT, fontSize: emote ? '28px' : '13px', color: '#2a1a0c',
      backgroundColor: emote ? null : '#fffbe8', padding: emote ? 0 : { x: 7, y: 4 },
      wordWrap: { width: 220, useAdvancedWrap: true },
    }).setOrigin(0.5, 1).setDepth(4500).setScale(0.65 + 0.35 * k).setAlpha(0.55 + 0.45 * k);
    a.bubbles.push(b);
    if (a.bubbles.length > 3) a.bubbles.shift().destroy();
    this.time.delayedCall(5500, () => {
      this.tweens.add({
        targets: b, alpha: 0, duration: 400,
        onComplete: () => {
          a.bubbles = a.bubbles.filter((x) => x !== b);
          b.destroy();
        },
      });
    });
  }

  floatText(x, y, text, color) {
    const t = this.add.text(x, y, text, {
      fontFamily: FONT, fontSize: '15px', fontStyle: '800', color, stroke: '#1a120c', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(4600);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 1600, onComplete: () => t.destroy() });
  }

  // Giao thong: thuan tuy trang tri phia client
  spawnTraffic() {
    const cam = this.cameras.main;
    const view = cam.worldView;
    if (this.traffic.length > 8) return;
    const left = Math.random() < 0.5;
    const y = left ? 660 : 750;
    const x = left ? view.right + 150 : view.left - 150;
    const total = TRAFFIC.reduce((n, [, w]) => n + w, 0);
    let r = Math.random() * total;
    const key = TRAFFIC.find(([, w]) => (r -= w) < 0)[0];
    const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y).setFlipX(left);
    const speed = (key === 'veh_bus' ? 110 : 150 + Math.random() * 120) * (this.weather === 'rain' ? 0.5 : 1);
    this.traffic.push({ img, vx: left ? -speed : speed });
  }

  // Hop thoai NPC / cua hang / sap tu dong khi nguoi choi di xa (hop thoai tu xa nhu dau gia qua dien thoai thi giu)
  autoCloseDialog() {
    const d = this.ui.dialog;
    const box = document.getElementById('dialog');
    if (!d || box.classList.contains('hidden') || d.remote || !this.me) return;
    const at = POIS.find((p) => p.id === d.poi);
    if (!at) return;
    if (Phaser.Math.Distance.Between(at.x, at.y, this.me.x, this.me.y) > DIALOG_CLOSE_RANGE) {
      box.classList.add('hidden');
      this.ui.dialog = null;
    }
  }

  // ================================================================ vong lap
  update(time, deltaMs) {
    const dt = Math.min(0.05, deltaMs / 1000);
    this.updateWalkers(time);
    this.updateMe(dt, time);
    this.updateJobTarget(time);
    this.autoCloseDialog();
    for (const a of this.avatars.values()) {
      if (!a.isMe) {
        const k = Math.min(1, dt * 10);
        a.x = lerp(a.x, a.tx, k);
        a.y = lerp(a.y, a.ty, k);
      }
      this.drawAvatar(a, time);
    }
    for (const o of this.npcObjs.values()) {
      const k = Math.min(1, dt * 10);
      o.x = lerp(o.x, o.tx, k);
      o.y = lerp(o.y, o.ty, k);
      o.sprite.setPosition(o.x, o.y).setDepth(o.y);
      o.shadow.setPosition(o.x, o.y).setDepth(o.y - 1);
      o.label.setPosition(o.x, o.y - o.sprite.displayHeight - 4).setDepth(4000);
      if (o.st.skin) {
        const key = this.animKey(o.st.skin, o.dir, o.moving);
        this.playAnim(o, key, o.dir);
      }
    }
    const view = this.cameras.main.worldView;
    this.traffic = this.traffic.filter((t) => {
      t.img.x += t.vx * dt;
      if (t.img.x < view.left - 400 || t.img.x > view.right + 400) {
        t.img.destroy();
        return false;
      }
      t.img.y = (t.vx < 0 ? 660 : 750) - Math.abs(Math.sin(time / 120 + t.vx)) * 1.5;
      return true;
    });
  }

  animKey(skin, dir, moving) {
    const side = dir === 'left' || dir === 'right';
    if (!moving) {
      if (dir === 'down') return `${skin}_idle`;
      const key = `${skin}_${side ? 'idle_side' : 'idle_up'}`;
      return this.anims.exists(key) ? key : null; // art cu: dung frame dau
    }
    return `${skin}_${side ? 'side' : dir}`;
  }

  playAnim(o, key, dir) {
    const sprite = o.sprite;
    sprite.setFlipX(dir === 'right');
    if (!key) {
      // dung yen quay huong: dung frame dau cua anim tuong ung
      const still = `${o.st?.skin || o.skin}_${dir === 'up' ? 'up' : 'side'}`;
      if (o.anim !== `still:${still}`) {
        sprite.stop();
        sprite.setFrame(this.anims.get(still).frames[0].frame.name);
        o.anim = `still:${still}`;
      }
      return;
    }
    if (o.anim !== key) {
      sprite.play(key);
      o.anim = key;
    }
  }

  drawAvatar(a, time) {
    const riding = !!a.vehicleId;
    if (a.dir === 'left' || a.dir === 'right') a.face = a.dir;
    const face = a.face || 'left';
    // Art moi co tu the ngoi lai rieng -> ghep len xe; art cu -> anh nguoi di Cub chung
    const rideKey = `${a.skin}_ride`;
    const ownRide = riding && this.anims.exists(rideKey);
    a.sprite.setVisible(!riding || ownRide);
    a.rider.setVisible(riding && !ownRide);
    a.veh.setVisible(ownRide);
    let top;
    if (ownRide) {
      const bob = a.moving ? Math.abs(Math.sin(time / 80)) * 1.5 : 0;
      const R = RIDE_FIT;
      a.veh.setTexture(VEHICLE_SPRITE[a.vehicleId] || 'veh_cub');
      a.veh.setScale(R.scale).setPosition(a.x, a.y - bob).setDepth(a.y).setFlipX(face === 'left');
      const dx = a.veh.displayWidth * R.dx * (face === 'left' ? -1 : 1);
      a.sprite.setPosition(a.x + dx, a.y - a.veh.displayHeight * R.dy - bob).setDepth(a.y + 0.5).setFlipX(face === 'right');
      if (a.anim !== rideKey) {
        a.sprite.play(rideKey);
        a.anim = rideKey;
      }
      top = Math.min(a.veh.y - a.veh.displayHeight, a.sprite.y - a.sprite.displayHeight);
    } else if (riding) {
      a.rider.setPosition(a.x, a.y - (a.moving ? Math.abs(Math.sin(time / 80)) * 1.5 : 0)).setDepth(a.y);
      a.rider.setFlipX(a.dir === 'left');
      a.rider.setTint(a.vehicleId === 'xe_ga' ? 0xb8d4ff : 0xffffff);
      top = a.y - a.rider.displayHeight;
    } else {
      a.sprite.setPosition(a.x, a.y).setDepth(a.y);
      this.playAnim(a, this.animKey(a.skin, a.dir, a.moving), a.dir);
      top = a.y - a.sprite.displayHeight;
    }
    a.shadow.setPosition(a.x, a.y).setDepth(a.y - 1).setScale(riding ? 1.8 : 0.9, 1);
    a.aura.setVisible(!!a.auraKind).setPosition(a.x, a.y - 4).setDepth(a.y - 2);
    if (a.auraKind) {
      a.aura.setTint(a.auraKind === 'neon' ? Phaser.Display.Color.HSVToRGB((time / 2000) % 1, 0.8, 1).color : 0xffd34d);
      a.aura.setAlpha(0.55 + Math.sin(time / 250) * 0.25);
    }
    a.label.setPosition(a.x, top - 2).setDepth(4100);
    a.titleText.setPosition(a.x, top - 18).setDepth(4100);
    let by = top - (a.title ? 34 : 20);
    for (let i = a.bubbles.length - 1; i >= 0; i--) {
      const b = a.bubbles[i];
      b.setPosition(a.x, by);
      by -= b.displayHeight + 4;
    }
  }

  updateMe(dt, time) {
    const me = this.me;
    const self = this.ui.self;
    if (!me || !self) return;
    let vx = 0;
    let vy = 0;
    if (this.pending?.track) {
      const p = this.pending.track();
      if (!p) {
        this.pending = null;
        this.moveTarget = null;
      } else {
        Object.assign(this.pending, p);
        this.moveTarget = { ...p };
      }
    }
    if (!this.ui.typing && !this.ui.locked) {
      const k = this.keys;
      if (k.A.isDown || k.LEFT.isDown) vx -= 1;
      if (k.D.isDown || k.RIGHT.isDown) vx += 1;
      if (k.W.isDown || k.UP.isDown) vy -= 1;
      if (k.S.isDown || k.DOWN.isDown) vy += 1;
    }
    if (this.touch) {
      // Nut huong cam ung khong bi chan boi o nhap (iOS giu focus o <select> sau khi chon)
      if (!this.ui.locked) {
        vx += this.touch.dir.x;
        vy += this.touch.dir.y;
      }
      if (time - (this.lastTalkCheck || 0) > 150) {
        this.lastTalkCheck = time;
        const dialogOpen = !document.getElementById('dialog').classList.contains('hidden');
        this.touch.setInteract(this.ui.locked || dialogOpen ? null : this.nearestInteract());
      }
    }
    if (vx || vy) {
      this.moveTarget = null;
      this.pending = null;
    } else if (this.moveTarget) {
      const dx = this.moveTarget.x - me.x;
      const dy = this.moveTarget.y - me.y;
      const d = Math.hypot(dx, dy);
      const stopAt = this.pending ? Math.max(4, this.pending.range * 0.6) : 4;
      if (d <= stopAt) this.moveTarget = null;
      else {
        vx = dx / d;
        vy = dy / d;
      }
    }
    if (this.pending && Math.hypot(this.pending.x - me.x, this.pending.y - me.y) <= this.pending.range) {
      const fn = this.pending.fn;
      this.pending = null;
      this.moveTarget = null;
      vx = 0;
      vy = 0;
      fn();
    }
    const len = Math.hypot(vx, vy);
    me.moving = len > 0;
    if (me.moving) {
      vx /= len;
      vy /= len;
      const speed = self.calc.speed;
      me.x = Phaser.Math.Clamp(me.x + vx * speed * dt, WORLD.walk.x0, WORLD.walk.x1);
      me.y = Phaser.Math.Clamp(me.y + vy * speed * dt, WORLD.walk.y0, WORLD.walk.y1);
      me.dir = Math.abs(vx) > Math.abs(vy) * 0.6 ? (vx < 0 ? 'left' : 'right') : vy < 0 ? 'up' : 'down';
    }
    me.tx = me.x;
    me.ty = me.y;
    this.ui.setPosition(me.x);
    if (time - this.lastSend > 1000 / SEND_HZ) {
      const msg = { t: 'move', x: Math.round(me.x), y: Math.round(me.y), d: me.dir, m: me.moving ? 1 : 0 };
      const key = `${msg.x},${msg.y},${msg.d},${msg.m}`;
      if (key !== this.lastSent) {
        this.net.send(msg);
        this.lastSent = key;
      }
      this.lastSend = time;
    }
  }
}
