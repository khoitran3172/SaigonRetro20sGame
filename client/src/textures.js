// Ve thu tuc (Canvas 2D) cac texture chua co trong concept art:
// toa nha theo phong cach pho Viet, nha ong, via he, mat co, den duong...
const hex = (n) => `#${n.toString(16).padStart(6, '0')}`;
const FONT = '"Be Vietnam Pro", system-ui, sans-serif';

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(color, f) {
  const r = Math.min(255, Math.max(0, Math.round(((color >> 16) & 255) * f)));
  const g = Math.min(255, Math.max(0, Math.round(((color >> 8) & 255) * f)));
  const b = Math.min(255, Math.max(0, Math.round((color & 255) * f)));
  return `rgb(${r},${g},${b})`;
}

function canvas(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex.getContext();
  ctx.imageSmoothingEnabled = false;
  draw(ctx, w, h);
  tex.refresh();
}

function stains(ctx, w, h, rand, color) {
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = shade(color, 0.82 + rand() * 0.1);
    ctx.globalAlpha = 0.35;
    const x = rand() * w;
    ctx.fillRect(x, rand() * h * 0.6, 4 + rand() * 18, 20 + rand() * 70);
  }
  ctx.globalAlpha = 1;
}

function signBoard(ctx, x, y, w, h, bg, text, neon) {
  ctx.fillStyle = '#1b140f';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = hex(bg);
  ctx.fillRect(x, y, w, h);
  ctx.font = `800 ${Math.min(h * 0.62, (w / text.length) * 1.7)}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (neon) {
    ctx.shadowColor = hex(neon);
    ctx.shadowBlur = 8;
    ctx.fillStyle = hex(neon);
  } else {
    ctx.fillStyle = '#fff3d6';
  }
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
  ctx.shadowBlur = 0;
}

function shutterWindow(ctx, x, y, w, h, color = '#3f6e4c') {
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let yy = y + 3; yy < y + h; yy += 4) ctx.fillRect(x + 1, yy, w - 2, 1);
  ctx.fillRect(x + w / 2 - 1, y, 2, h);
  ctx.fillStyle = '#d8ccb0';
  ctx.fillRect(x - 3, y + h + 2, w + 6, 3);
}

function glassPanel(ctx, x, y, w, h, rand) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#9fd3ef');
  g.addColorStop(0.5, '#3c7ea8');
  g.addColorStop(1, '#22506e');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  if (rand() < 0.6) ctx.fillRect(x + 3, y + 2, 3, h - 4);
}

function door(ctx, cx, base, w, h, glass) {
  ctx.fillStyle = '#1e1813';
  ctx.fillRect(cx - w / 2 - 3, base - h - 3, w + 6, h + 3);
  if (glass) {
    const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
    g.addColorStop(0, '#2b5470');
    g.addColorStop(1, '#8cc4e0');
    ctx.fillStyle = g;
  } else ctx.fillStyle = '#3a2a1e';
  ctx.fillRect(cx - w / 2, base - h, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(cx - 1, base - h, 2, h);
}

export function genBuilding(scene, key, c) {
  const { w, h } = c;
  canvas(scene, key, w, h, (ctx) => {
    const rand = rng(w * 31 + h);
    ctx.fillStyle = hex(c.wall);
    ctx.fillRect(0, 14, w, h - 14);
    stains(ctx, w, h, rand, c.wall);
    // mai / goi dau
    ctx.fillStyle = hex(c.roof);
    ctx.fillRect(-2, 0, w + 4, 16);
    ctx.fillStyle = shade(c.roof, 0.7);
    ctx.fillRect(0, 16, w, 4);
    const base = h - 10;
    // nen via he chan nha
    ctx.fillStyle = '#8f8678';
    ctx.fillRect(0, base, w, 10);
    ctx.fillStyle = '#6f675b';
    ctx.fillRect(0, base, w, 2);

    const signH = c.windows === 'glass' ? 30 : 26;
    const signW = Math.min(w - 30, Math.max(140, c.sign.length * 13));
    const signY = 30;
    if (c.windows === 'glass') {
      const cols = Math.floor((w - 30) / 34);
      for (let r = 0; r < Math.floor((base - 150) / 38); r++) {
        for (let i = 0; i < cols; i++) glassPanel(ctx, 15 + i * 34, signY + signH + 18 + r * 38, 30, 34, rand);
      }
      ctx.fillStyle = shade(c.wall, 0.7);
      ctx.fillRect(0, base - 90, w, 6);
      for (let i = 0; i < 4; i++) glassPanel(ctx, w / 2 - 120 + i * 62, base - 80, 56, 80, rand);
      door(ctx, w / 2, base, 60, 64, true);
    } else if (c.windows === 'grid') {
      const cols = Math.floor((w - 40) / 62);
      for (let r = 0; r < 2; r++) {
        for (let i = 0; i < cols; i++) {
          const x = 30 + i * 62;
          if (r === 1 && Math.abs(x + 15 - w / 2) < 60) continue;
          shutterWindow(ctx, x, signY + signH + 26 + r * 92, 32, 54);
        }
      }
      // cot cong truong
      ctx.fillStyle = shade(c.wall, 1.1);
      ctx.fillRect(w / 2 - 70, base - 110, 14, 110);
      ctx.fillRect(w / 2 + 56, base - 110, 14, 110);
      ctx.fillStyle = hex(c.roof);
      ctx.fillRect(w / 2 - 80, base - 120, 160, 12);
      door(ctx, w / 2, base, 90, 86, false);
      ctx.fillStyle = '#c23b2b';
      ctx.fillRect(w / 2 + 90, base - 150, 3, 150);
      ctx.fillRect(w / 2 + 93, base - 150, 26, 17);
      ctx.fillStyle = '#ffd34d';
      ctx.fillRect(w / 2 + 103, base - 145, 6, 6);
    } else if (c.windows === 'balcony') {
      for (let f = 0; f < 3; f++) {
        const y = signY + signH + 20 + f * 62;
        if (y > base - 70) break;
        for (let i = 0; i < Math.floor((w - 20) / 70); i++) {
          const x = 20 + i * 70;
          shutterWindow(ctx, x + 8, y, 30, 40, '#6a8a5a');
          ctx.fillStyle = '#4a4440';
          ctx.fillRect(x, y + 40, 52, 3);
          for (let k = 0; k < 52; k += 6) ctx.fillRect(x + k, y + 32, 2, 10);
          if (rand() < 0.7) {
            const colors = ['#e65a5a', '#5a8de6', '#f2d14a', '#f2f2f2', '#7ac46a'];
            for (let k = 0; k < 3; k++) {
              ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
              ctx.fillRect(x + 6 + k * 15, y + 26, 10, 12);
            }
          }
        }
      }
      door(ctx, w / 2, base, 48, 70, false);
    } else if (c.windows === 'shop') {
      ctx.fillStyle = '#231c16';
      ctx.fillRect(16, base - 92, w - 32, 92);
      ctx.fillStyle = c.neon ? '#26213a' : '#4a3a2a';
      ctx.fillRect(20, base - 88, w - 40, 88);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let y = base - 88; y < base - 50; y += 5) ctx.fillRect(20, y, w - 40, 2);
      if (c.neon) {
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = '#0d0d14';
          ctx.fillRect(30 + i * ((w - 60) / 5), base - 46, 34, 24);
          ctx.fillStyle = ['#39ff88', '#5fd0ff', '#ff5fa8'][i % 3];
          ctx.fillRect(33 + i * ((w - 60) / 5), base - 43, 28, 18);
        }
      } else {
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = ['#d94f3d', '#e8c04a', '#5aa0d8', '#7ac46a'][i % 4];
          ctx.fillRect(28 + i * ((w - 56) / 6), base - 40, 26, 30);
        }
      }
      for (let i = 0; i < Math.floor((w - 40) / 60); i++) shutterWindow(ctx, 30 + i * 60, signY + signH + 18, 28, 36, '#5a6e8a');
    } else if (c.windows === 'arch') {
      for (let i = 0; i < 3; i++) {
        const x = 40 + i * ((w - 80) / 3) + 10;
        ctx.fillStyle = '#2a2420';
        ctx.beginPath();
        ctx.arc(x + 16, signY + signH + 50, 18, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(x - 2, signY + signH + 50, 36, 60);
        ctx.fillStyle = '#c99a3a';
        ctx.beginPath();
        ctx.arc(x + 16, signY + signH + 50, 15, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(x + 1, signY + signH + 50, 30, 56);
      }
      door(ctx, w / 2, base, 70, 80, false);
      ctx.fillStyle = '#7a1a1a';
      ctx.fillRect(w / 2 - 50, base - 4, 100, 4);
    } else if (c.windows === 'shed') {
      ctx.fillStyle = '#6d6a66';
      ctx.fillRect(0, 14, w, h - 24);
      for (let x = 0; x < w; x += 8) {
        ctx.fillStyle = x % 16 ? '#7d7a74' : '#5c5955';
        ctx.fillRect(x, 20, 4, base - 20);
      }
      ctx.fillStyle = 'rgba(140,80,40,0.45)';
      for (let i = 0; i < 12; i++) ctx.fillRect(rand() * w, 30 + rand() * (base - 60), 20 + rand() * 40, 8 + rand() * 30);
      ctx.fillStyle = '#1f1a16';
      ctx.fillRect(w / 2 - 110, base - 100, 220, 100);
      ctx.fillStyle = '#3a2f24';
      for (let i = 0; i < 9; i++) ctx.fillRect(w / 2 - 100 + rand() * 180, base - 30 - rand() * 50, 16 + rand() * 20, 14 + rand() * 20);
    }
    signBoard(ctx, (w - signW) / 2, signY, signW, signH, c.signBg, c.sign, c.neon);
    ctx.strokeStyle = '#1b140f';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
  });
}

// Nha ong pho Viet: hep, cao, ban cong, bang hieu nho
export function genTubeHouse(scene, key, seed) {
  const rand = rng(seed);
  const w = 92 + Math.floor(rand() * 30);
  const h = 210 + Math.floor(rand() * 90);
  const palette = [0xe8c36a, 0xd98c7a, 0x9cc6c0, 0xe6dcc0, 0xb7c98a, 0xd6a5c9, 0xa3b8d9, 0xf0e2a8];
  const wall = palette[Math.floor(rand() * palette.length)];
  const signs = ['TẠP HÓA', 'PHỞ', 'CƠM TẤM', 'SỬA ĐT', 'GỘI ĐẦU', 'BÚN BÒ', 'PHOTO', 'TRÀ SỮA', 'HỦ TIẾU', 'NHÀ THUỐC', 'BIA HƠI', 'GIẶT ỦI'];
  const sign = signs[Math.floor(rand() * signs.length)];
  canvas(scene, key, w, h, (ctx) => {
    ctx.fillStyle = hex(wall);
    ctx.fillRect(0, 10, w, h - 10);
    stains(ctx, w, h, rand, wall);
    ctx.fillStyle = shade(wall, 0.65);
    ctx.fillRect(-2, 0, w + 4, 12);
    const base = h - 8;
    ctx.fillStyle = '#8f8678';
    ctx.fillRect(0, base, w, 8);
    // tang tren: cua so + ban cong + cay
    for (let y = 26; y < base - 120; y += 64) {
      shutterWindow(ctx, w / 2 - 18, y, 36, 40, rand() < 0.5 ? '#3f6e4c' : '#4a5f8a');
      ctx.fillStyle = '#3a3532';
      ctx.fillRect(6, y + 44, w - 12, 3);
      for (let k = 6; k < w - 6; k += 6) ctx.fillRect(k, y + 34, 2, 12);
      if (rand() < 0.6) {
        ctx.fillStyle = '#4f8f3a';
        ctx.beginPath();
        ctx.arc(14, y + 30, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#9a5a3a';
        ctx.fillRect(9, y + 34, 10, 8);
      }
      if (rand() < 0.4) {
        ctx.fillStyle = '#dcdcdc';
        ctx.fillRect(w - 26, y + 6, 18, 12);
        ctx.fillStyle = '#9a9a9a';
        ctx.fillRect(w - 24, y + 9, 14, 1);
      }
    }
    // bang hieu
    signBoard(ctx, 6, base - 118, w - 12, 22, [0xb03a2e, 0x1f5a8a, 0x2e7a3a, 0x8a5a1a][Math.floor(rand() * 4)], sign);
    // cua cuon tang tret
    ctx.fillStyle = '#231c16';
    ctx.fillRect(8, base - 90, w - 16, 90);
    ctx.fillStyle = rand() < 0.5 ? '#9a9690' : '#4a3a2c';
    ctx.fillRect(11, base - 87, w - 22, 87);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let y = base - 87; y < base - 40; y += 4) ctx.fillRect(11, y, w - 22, 1);
    ctx.fillStyle = '#3a2a1e';
    ctx.fillRect(11, base - 40, w - 22, 40);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = ['#d94f3d', '#e8c04a', '#5aa0d8', '#7ac46a', '#e6e6e6'][Math.floor(rand() * 5)];
      ctx.fillRect(16 + i * ((w - 32) / 3), base - 32, (w - 40) / 3 - 4, 22);
    }
    ctx.strokeStyle = '#1b140f';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
  });
  return { w, h };
}

function tile(scene, key, size, draw) {
  canvas(scene, key, size, size, (ctx) => draw(ctx, size, rng(key.length * 97)));
}

export function genGround(scene) {
  tile(scene, 'tile_sidewalk', 64, (ctx, s, rand) => {
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        ctx.fillStyle = shade(0xb5a68e, 0.92 + rand() * 0.12);
        ctx.fillRect(x * 32, y * 32, 32, 32);
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        for (let i = 0; i < 6; i++) ctx.fillRect(x * 32 + rand() * 28, y * 32 + rand() * 28, 3, 2);
      }
    }
    ctx.fillStyle = '#857761';
    ctx.fillRect(0, 0, s, 2);
    ctx.fillRect(0, 32, s, 2);
    ctx.fillRect(0, 0, 2, s);
    ctx.fillRect(32, 0, 2, s);
  });
  tile(scene, 'tile_plaza', 64, (ctx, s, rand) => {
    ctx.fillStyle = '#c4a57e';
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 2; x++) {
        const off = y % 2 ? 16 : 0;
        ctx.fillStyle = shade(0xb88f63, 0.9 + rand() * 0.2);
        ctx.fillRect(((x * 32 + off) % s) + 1, y * 16 + 1, 30, 14);
      }
    }
  });
  tile(scene, 'tile_stone', 64, (ctx, s, rand) => {
    ctx.fillStyle = '#cfd3d6';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = shade(0xbfc4c8, 0.95 + rand() * 0.08);
    ctx.fillRect(1, 1, 62, 62);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(4, 4, 20, 2);
  });
  tile(scene, 'tile_grass', 64, (ctx, s, rand) => {
    ctx.fillStyle = '#6b9a4a';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = rand() < 0.5 ? '#5d8a3f' : '#7cab57';
      ctx.fillRect(rand() * s, rand() * s, 2, 4);
    }
  });
  tile(scene, 'tile_dirt', 64, (ctx, s, rand) => {
    ctx.fillStyle = '#7d6a50';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = rand() < 0.5 ? '#6c5a42' : '#8f7b5e';
      ctx.fillRect(rand() * s, rand() * s, 3 + rand() * 4, 2 + rand() * 3);
    }
  });
  tile(scene, 'tile_road', 64, (ctx, s, rand) => {
    ctx.fillStyle = '#45444a';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = rand() < 0.5 ? '#3d3c42' : '#504f56';
      ctx.fillRect(rand() * s, rand() * s, 2, 2);
    }
  });
}

export function genMisc(scene) {
  // quang sang den duong
  canvas(scene, 'glow', 256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,220,150,0.9)');
    g.addColorStop(0.35, 'rgba(255,190,110,0.35)');
    g.addColorStop(1, 'rgba(255,170,80,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  });
  canvas(scene, 'aura', 128, 64, (ctx) => {
    const g = ctx.createRadialGradient(64, 32, 4, 64, 32, 60);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(64, 32, 60, 28, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  canvas(scene, 'shadow', 64, 20, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(32, 10, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  canvas(scene, 'raindrop', 3, 16, (ctx) => {
    ctx.fillStyle = 'rgba(200,220,255,0.7)';
    ctx.fillRect(1, 0, 1, 16);
  });
}
