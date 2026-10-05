// Scene the gioi: ban do 4 khu, nhan vat, NPC, sap hang, giao thong, ngay/dem, thoi tiet.
import { BUILDINGS, CHAT, PLOTS, POIS, WORLD, ZONES } from '/shared/config.js';
import { genBuilding, genGround, genMisc, genTubeHouse } from './textures.js';

const FONT = '"Be Vietnam Pro", system-ui, sans-serif';
const CLASS_COLOR = { sv: '#a8f0a0', vp: '#9fd8ff', tt: '#ffc77a' };
const NPC_STYLE = {
  police: { skin: 'vp_male', tint: 0xc4d488, color: '#bff0ff', label: '🚓 Cảnh sát' },
  thief: { skin: 'sv_male', tint: 0x6c6c92, color: '#ff9a85' },
  gang: { image: 'npc_thanhnien', tint: 0xd9c0b0, color: '#ff7a6a', label: '😠 Giang hồ' },
  scrap: { image: 'scrap', color: '#ffe680', label: '' },
};
const POI_ICON = {
  school: '🏫', tro: '🏠', net: '🖥️', veso: '🎫', buudien: '📮', cafe: '☕', banhmi: '🥖', bangdia: '📼', bida: '🎱',
  barber: '💈', cho: '🧺', mechanic: '🔧', atm: '🏧', bank: '🏦', office: '🏢', auction: '🔨', showroom: '🛵',
  fashion: '👗', junk: '♻️',
};
const SEND_HZ = 15;
const INTERACT_RANGE = 120;
const lerp = (a, b, t) => a + (b - a) * t;

export class WorldScene extends Phaser.Scene {
  init(data) {
    Object.assign(this, data);
    this.avatars = new Map();
    this.npcObjs = new Map();
    this.stallObjs = new Map();
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
    for (const [k, m] of Object.entries(chars)) {
      this.load.spritesheet(k, `assets/chars/${k}.png`, { frameWidth: m.frameWidth, frameHeight: m.frameHeight });
    }
    for (const k of Object.keys(props)) this.load.image(k, `assets/props/${k}.png`);
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
    this.overlay?.setSize(this.scale.width, this.scale.height);
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
      this.anims.create({ key: k, frames: this.anims.generateFrameNumbers(k, { start: 0, end: m.frames - 1 }), frameRate: 2.5, repeat: -1 });
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
        const cbd = x > 3700 && x < 5300;
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
    for (const cx of [700, 1650, 2650, 3790, 4500, 5250]) {
      for (let y = 596; y < 764; y += 22) r.fillRect(cx - 40, y, 80, 12);
    }
    // san bong mini (Khu 3)
    r.lineStyle(4, 0xf2f2f2, 0.85);
    r.strokeRect(160, 890, 700, 270);
    r.lineBetween(510, 890, 510, 1160);
    r.strokeCircle(510, 1025, 50);
    this.add.image(160, 1060, 'goal').setDepth(1060);
    this.add.image(860, 1060, 'goal').setFlipX(true).setDepth(1060);
    // o quy hoach bay sap
    PLOTS.forEach((pl, i) => {
      r.lineStyle(3, 0xffd34d, 0.9);
      r.strokeRect(pl.x - 58, pl.y - 52, 116, 64);
      r.fillStyle(0xffd34d, 0.12);
      r.fillRect(pl.x - 58, pl.y - 52, 116, 64);
      this.add.text(pl.x, pl.y + 14, `Ô ${i + 1}`, { fontFamily: FONT, fontSize: '11px', color: '#ffe680', fontStyle: '800' })
        .setOrigin(0.5, 0).setDepth(-880);
    });
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
        key = `bld_${b.id}`;
        genBuilding(this, key, b.gen);
      }
      const img = this.add.image(b.x, base, key).setOrigin(0.5, 1).setDepth(WORLD.buildingBase);
      used.push([b.x - img.width / 2, b.x + img.width / 2]);
      if (b.gen?.neon) {
        const glow = this.add.image(b.x, base - img.height + 44, 'glow').setScale(img.width / 200, 0.5)
          .setTint(b.gen.neon).setBlendMode(Phaser.BlendModes.ADD).setDepth(5001).setAlpha(0);
        this.lamps.push({ img: glow, max: 0.7 });
      }
    }
    // lap khoang trong bang nha ong / cay (ngoai o)
    let seed = 1;
    const free = (x0, x1) => used.every(([a, b]) => x1 < a - 4 || x0 > b + 4);
    for (let x = 0; x < WORLD.width;) {
      if (x > 5200) {
        if (free(x, x + 80)) this.add.image(x + 40, 446, 'tree').setOrigin(0.5, 1).setDepth(439);
        x += 90;
        continue;
      }
      const key = `tube_${seed}`;
      const { w } = genTubeHouse(this, key, seed * 7919);
      if (free(x, x + w)) {
        this.add.image(x + w / 2, base, key).setOrigin(0.5, 1).setDepth(WORLD.buildingBase - 1);
        used.push([x, x + w]);
        x += w;
        seed++;
      } else {
        x += 10;
      }
    }
  }

  prop(key, x, y, opts = {}) {
    const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(opts.depth ?? y);
    if (opts.scale) img.setScale(opts.scale);
    if (opts.flip) img.setFlipX(true);
    if (opts.tint) img.setTint(opts.tint);
    return img;
  }

  buildProps() {
    // cot dien + den duong
    for (let x = 160; x < WORLD.width; x += 420) {
      const pole = this.prop('power_pole', x, 586);
      const glow = this.add.image(x + 6, 586 - pole.height + 26, 'glow').setScale(0.9)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(5001).setAlpha(0);
      const pool = this.add.image(x, 600, 'glow').setScale(1.6, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(5001).setAlpha(0);
      this.lamps.push({ img: glow, max: 0.9 }, { img: pool, max: 0.5 });
    }
    // cay via he duoi (tranh khu o quy hoach)
    for (let x = 120; x < WORLD.width; x += 330) {
      if (x > 1780 && x < 3700) continue;
      this.prop('tree', x, 812);
    }
    // Khu 3
    this.prop('flowers', 650, 470);
    this.prop('flowers', 190, 470);
    this.prop('plants_pair', 1150, 470);
    this.prop('ganh_hang', 1120, 1010, { scale: 0.9 });
    this.prop('books', 980, 1000);
    // Khu 1: cafe + gia dinh + tre con
    this.prop('stool_blue', 2170, 562);
    this.prop('stool_red', 2300, 566);
    this.prop('stool_small', 2340, 560);
    this.prop('stools_family', 2600, 1060);
    this.bob(this.prop('npc_girl', 2730, 1040));
    this.bob(this.prop('npc_boy', 2775, 1046));
    this.prop('cart_hoaquynh', 3200, 1080);
    this.prop('npc_ngoi', 3285, 572);
    this.prop('plant_tall', 3060, 470);
    this.prop('stool_pink', 2560, 1100);
    // Khu 2
    this.prop('plant_tall', 3870, 470);
    this.prop('plant_tall', 4370, 470);
    this.prop('plant_tall', 4870, 470);
    this.prop('cub', 4330, 900, { scale: 0.9 });
    this.prop('cub', 4180, 905, { scale: 0.9, tint: 0xb0c8ff });
    // Khu 4: bai phe lieu
    for (const [x, y] of [[5380, 1000], [5560, 1120], [5990, 940], [6240, 1080], [6150, 560], [5560, 560]]) this.prop('tires', x, y);
    this.prop('roof_tin', 5700, 900);
    this.prop('roof_tin', 6100, 1150, { flip: true });
    this.prop('cub', 5800, 1060, { tint: 0x9a9080 });
    this.prop('tv', 5480, 880);
  }

  bob(img) {
    this.tweens.add({ targets: img, y: img.y - 3, duration: 600 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    return img;
  }

  buildPois() {
    const kiosk = (key, sign, bg, wall) => genBuilding(this, key, { w: 190, h: 130, wall, roof: bg, sign, signBg: bg, windows: 'shop' });
    kiosk('kiosk_showroom', 'SHOWROOM XE', 0x1f4a7a, 0xdfe6ee);
    kiosk('kiosk_fashion', 'THỜI TRANG', 0x7a1f4f, 0xf2d6e6);

    for (const poi of POIS) {
      if (poi.kind === 'showroom') this.prop('kiosk_showroom', poi.x, poi.y - 14);
      if (poi.kind === 'fashion') this.prop('kiosk_fashion', poi.x, poi.y - 14);
      if (poi.kind === 'atm') this.prop('atm', poi.x, poi.y < 600 ? 452 : poi.y - 10);
      if (poi.prop) this.prop(poi.prop, poi.x + (poi.propDx || 0), poi.y + (poi.propDy || 0));
      if (poi.npc) this.bob(this.prop(poi.npc, poi.x + (poi.npcDx || 0), poi.y + 4));
      if (poi.anim) this.add.sprite(poi.x, poi.y + 6, poi.anim).setOrigin(0.5, 1).setDepth(poi.y + 6).play(poi.anim);

      const label = this.add.text(poi.x, poi.y - (poi.y < 600 ? 120 : 140), `${POI_ICON[poi.kind] || '❔'} ${poi.name}`, {
        fontFamily: FONT, fontSize: '12px', color: '#fff6dc', fontStyle: '800',
        backgroundColor: 'rgba(30,22,16,0.72)', padding: { x: 6, y: 3 },
      }).setOrigin(0.5, 1).setDepth(4000);
      this.tweens.add({ targets: label, y: label.y - 4, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      poi.label = label;

      const zone = this.add.zone(poi.x, poi.y - 50, 140, 130).setInteractive({ useHandCursor: true }).setDepth(poi.y);
      zone.on('pointerdown', () => this.goInteract(poi.x, poi.y + 24, () => this.net.send({ t: 'poi', id: poi.id })));
      zone.on('pointerover', () => label.setColor('#ffd34d'));
      zone.on('pointerout', () => label.setColor('#fff6dc'));
    }
  }

  // ================================================================ khong khi: ngay dem, mua, nang
  setupAtmosphere() {
    this.overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a1030, 0)
      .setOrigin(0).setScrollFactor(0).setDepth(5000);
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
    this.input.on('pointerdown', (pointer, objs) => {
      if (objs.length) return;
      this.pending = null;
      this.moveTarget = { x: pointer.worldX, y: pointer.worldY };
    });
    this.input.keyboard.on('keydown-E', () => {
      if (this.ui.typing) return;
      let best = null;
      for (const poi of POIS) {
        const d = Phaser.Math.Distance.Between(poi.x, poi.y, this.me.x, this.me.y);
        if (d < 160 && (!best || d < best.d)) best = { poi, d };
      }
      if (best) this.net.send({ t: 'poi', id: best.poi.id });
    });
  }

  goInteract(x, y, fn, range = INTERACT_RANGE) {
    this.moveTarget = { x, y };
    this.pending = { x, y, fn, range };
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
    net.on('fx', (m) => this.floatText(m.x, m.y - 70, m.text, '#7dff8a'));
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

    const seenS = new Set();
    for (const s of m.st) {
      seenS.add(s.o);
      let o = this.stallObjs.get(s.o);
      if (o && o.u !== s.u) {
        this.destroyStall(o);
        o = null;
      }
      if (!o) o = this.spawnStall(s);
      o.label.setText(`🧺 ${s.o}${s.lg ? '' : ' ⚠️'} · ${s.c} món`);
    }
    for (const [k, o] of this.stallObjs) if (!seenS.has(k)) this.destroyStall(o);
  }

  // ================================================================ thuc the
  spawnAvatar(d, isMe) {
    const shadow = this.add.image(d.x, d.y, 'shadow');
    const sprite = this.add.sprite(d.x, d.y, d.sk, 0).setOrigin(0.5, 1);
    const rider = this.add.image(d.x, d.y, 'cub_rider').setOrigin(0.5, 1).setVisible(false);
    const aura = this.add.image(d.x, d.y, 'aura').setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
    const label = this.add.text(d.x, d.y, d.n, {
      fontFamily: FONT, fontSize: '12px', fontStyle: '800', color: isMe ? '#ffe680' : CLASS_COLOR[d.c] || '#fff',
      stroke: '#1a120c', strokeThickness: 4,
    }).setOrigin(0.5, 1);
    const titleText = this.add.text(d.x, d.y, d.ti ? `「${d.ti}」` : '', {
      fontFamily: FONT, fontSize: '10px', color: '#ffd34d', stroke: '#1a120c', strokeThickness: 3,
    }).setOrigin(0.5, 1);
    const a = {
      id: d.id, isMe, sprite, shadow, rider, aura, label, titleText, skin: d.sk, title: d.ti,
      x: d.x, y: d.y, tx: d.x, ty: d.y, dir: 'down', moving: false, bubbles: [], anim: '',
    };
    this.avatars.set(d.id, a);
    return a;
  }

  removeAvatar(id) {
    const a = this.avatars.get(id);
    if (!a || a.isMe) return;
    for (const o of [a.sprite, a.shadow, a.rider, a.aura, a.label, a.titleText, ...a.bubbles]) o.destroy();
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
        this.goInteract(n.x, n.y + 4, () => this.net.send({ t: 'poi', id: `scrap:${n.id}` }), 60));
    } else if (n.k === 'thief') {
      sprite.setInteractive({ useHandCursor: true }).on('pointerdown', () =>
        this.goInteract(o.x, o.y, () => this.net.send({ t: 'poi', id: `thief:${n.id}` }), 140));
    }
    this.npcObjs.set(n.id, o);
    return o;
  }

  spawnStall(s) {
    const img = this.add.image(s.x, s.y + 4, s.u ? 'ganh_hang' : 'stall').setOrigin(0.5, 1).setDepth(s.y);
    if (s.u) img.setScale(0.75);
    const label = this.add.text(s.x, s.y - img.displayHeight - 4, '', {
      fontFamily: FONT, fontSize: '11px', fontStyle: '800', color: s.lg ? '#ffe680' : '#ff9a85',
      backgroundColor: 'rgba(30,22,16,0.75)', padding: { x: 5, y: 2 },
    }).setOrigin(0.5, 1).setDepth(4000);
    img.setInteractive({ useHandCursor: true }).on('pointerdown', () =>
      this.goInteract(s.x, s.y + 30, () => this.net.send({ t: 'poi', id: `stall:${s.o}` }), 150));
    const o = { img, label, u: s.u };
    this.stallObjs.set(s.o, o);
    return o;
  }

  destroyStall(o) {
    o.img.destroy();
    o.label.destroy();
    for (const [k, v] of this.stallObjs) if (v === o) this.stallObjs.delete(k);
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
    const img = this.add.image(x, y, 'cub_rider').setOrigin(0.5, 1).setDepth(y).setFlipX(left);
    img.setTint([0xffffff, 0xd8e6ff, 0xffe0d0, 0xe0ffe0, 0xf0e0ff][Math.floor(Math.random() * 5)]);
    const speed = (150 + Math.random() * 120) * (this.weather === 'rain' ? 0.5 : 1);
    this.traffic.push({ img, vx: left ? -speed : speed });
  }

  // ================================================================ vong lap
  update(time, deltaMs) {
    const dt = Math.min(0.05, deltaMs / 1000);
    this.updateMe(dt, time);
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
      } else if (o.k === 'gang') {
        o.sprite.setFlipX(o.dir === 'left');
        if (o.moving) o.sprite.y -= Math.abs(Math.sin(time / 90)) * 3;
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
    if (!moving) return dir === 'down' ? `${skin}_idle` : null;
    return `${skin}_${dir === 'left' || dir === 'right' ? 'side' : dir}`;
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
    a.sprite.setVisible(!riding);
    a.rider.setVisible(riding);
    let top;
    if (riding) {
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
    if (!this.ui.typing) {
      const k = this.keys;
      if (k.A.isDown || k.LEFT.isDown) vx -= 1;
      if (k.D.isDown || k.RIGHT.isDown) vx += 1;
      if (k.W.isDown || k.UP.isDown) vy -= 1;
      if (k.S.isDown || k.DOWN.isDown) vy += 1;
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
