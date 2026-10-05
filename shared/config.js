// Cau hinh dung chung cho server (Node) va client (trinh duyet).
// Moi so lieu can bang game nam o day de de tinh chinh.

export const WORLD = {
  width: 6400,
  height: 1200,
  buildingBase: 440,     // chan mat tien cong trinh
  sidewalkTop: [440, 580],
  road: [580, 780],
  walk: { x0: 20, x1: 6380, y0: 452, y1: 1180 },
};

export const ZONES = [
  { id: 'daihoc', name: 'Khu 3 · Làng Đại Học', x0: 0, x1: 1600, crime: 0.6, police: 1 },
  { id: 'phoam', name: 'Khu 1 · Phố Ẩm Thực & Chợ Đêm', x0: 1600, x1: 3800, crime: 1.0, police: 1 },
  { id: 'cbd', name: 'Khu 2 · Trung Tâm Tài Chính', x0: 3800, x1: 5200, crime: 0.3, police: 2 },
  { id: 'ngoaio', name: 'Khu 4 · Ngoại Ô & Bãi Phế Liệu', x0: 5200, x1: 6400, crime: 1.6, police: 0 },
];

export function zoneAt(x) {
  return ZONES.find((z) => x >= z.x0 && x < z.x1) || ZONES[0];
}

// 1 gio trong game = 60 giay thuc  ->  1 ngay = 24 phut thuc
export const TIME = { msPerGameMinute: 1000, startMinute: 7 * 60 };

export const SPEED = {
  walk: 165,
  vehicleBase: 165,
  exhausted: 0.55,  // stamina < 10
  rainVehicle: 0.5, // mua ngap: xe cham 50%
};

export const ECON = {
  atmFeeRate: 0.01, atmFeeMin: 1000,
  appTransferFeeRate: 0.02,
  stallTax: 0.05,
  plotRent: 5000,
  fineIllegalStall: 50000,
  protectionFee: 20000,
  interestRate: 0.005, interestCap: 50000,
  rentPerDay: 30000,
  mailFee: 2000,
  callPoliceFee: 2000,
  auctionTax: 0.05,
  lotteryPrice: 10000,
  ledCost: 10,           // kim cuong
  dailyDiamonds: 3,
  globalCooldownMs: 8000,
  maxCash: 50_000_000,
};

export const CLASSES = {
  sv: {
    name: 'Sinh viên', skin: 'sv_male', cash: 80000, bank: 100000,
    ranks: ['Sinh viên', 'Thực tập sinh', 'Khởi nghiệp'],
    statKey: 'attendance', statName: 'Điểm danh',
  },
  vp: {
    name: 'Nhân viên văn phòng', skin: 'vp_male', cash: 60000, bank: 400000,
    ranks: ['NVVP mới vào', 'Quản lý / PM', 'Giám đốc điều hành'],
    statKey: 'kpi', statName: 'KPI',
  },
  tt: {
    name: 'Tiểu thương', skin: 'baba_female', cash: 150000, bank: 150000,
    ranks: ['Bán rong vỉa hè', 'Chủ kiot', 'Chuỗi thương hiệu'],
    statKey: 'reputation', statName: 'Uy tín quán',
  },
};

// Dieu kien thang tien: [stat can dat, so tien phai co trong ngan hang]
export const PROMOTION = [
  null,
  { stat: 40, bank: 500000 },
  { stat: 100, bank: 3000000 },
];

export const SKINS = {
  sv_male: 'Nam · Áo thun',
  vp_male: 'Nam · Sơ mi công sở',
  baba_female: 'Nữ · Áo bà ba',
  aodai_female: 'Nữ · Áo dài cách tân',
};

export const SLOTS = {
  ao: 'Áo', quan: 'Quần', giay: 'Giày/Dép', non: 'Nón', kinh: 'Kính',
  khuyentai: 'Khuyên tai', dongho: 'Đồng hồ', lung: 'Đeo lưng',
  dacbiet: 'Đặc biệt', xe: 'Phương tiện', phone: 'Điện thoại',
};

// type: food | ingredient | material | collectible | equip | data | stall
export const ITEMS = {
  banhmi: { name: 'Bánh mì thịt', icon: '🥖', type: 'food', base: 15000, eff: { stamina: 35 } },
  tra_da: { name: 'Trà đá', icon: '🧋', type: 'food', base: 3000, eff: { stress: -10, stamina: 5 } },
  ca_phe: { name: 'Cà phê sữa đá', icon: '☕', type: 'food', base: 12000, eff: { stamina: 20, stress: -8 } },
  nuoc_mia: { name: 'Nước mía', icon: '🥤', type: 'food', base: 8000, eff: { stamina: 15, stress: -5 }, hot: 2 },

  phoi_banh: { name: 'Phôi bánh mì', icon: '🍞', type: 'ingredient', base: 3000 },
  thit_nguoi: { name: 'Thịt nguội', icon: '🥓', type: 'ingredient', base: 5000 },
  rau_thom: { name: 'Rau thơm', icon: '🌿', type: 'ingredient', base: 1000 },
  tra_kho: { name: 'Trà khô', icon: '🍂', type: 'ingredient', base: 2000 },
  da_vien: { name: 'Đá viên', icon: '🧊', type: 'ingredient', base: 1000 },
  cay_mia: { name: 'Cây mía', icon: '🎋', type: 'ingredient', base: 3000 },

  ve_chai: { name: 'Ve chai', icon: '🥫', type: 'material', base: 2000 },
  linh_kien: { name: 'Linh kiện cũ (đá cường hóa)', icon: '⚙️', type: 'material', base: 6000 },
  bang_cassette: { name: 'Băng cassette cũ', icon: '📼', type: 'collectible', base: 8000 },

  the_4g: { name: 'Gói cước 4G (30 tin)', icon: '📶', type: 'data', base: 10000, data: 30 },
  du_che: { name: 'Dù che sạp', icon: '⛱️', type: 'stall', base: 50000 },

  ao_thun: { name: 'Áo thun in hình', icon: '👕', type: 'equip', slot: 'ao', base: 60000, st: { charisma: 2 } },
  ao_somi: { name: 'Áo sơ mi công sở', icon: '👔', type: 'equip', slot: 'ao', base: 150000, st: { charisma: 5 } },
  quan_jean: { name: 'Quần jean', icon: '👖', type: 'equip', slot: 'quan', base: 120000, st: { charisma: 3 } },
  dep_lao: { name: 'Dép lào', icon: '🩴', type: 'equip', slot: 'giay', base: 20000, st: { speed: 3 } },
  giay_tt: { name: 'Giày thể thao', icon: '👟', type: 'equip', slot: 'giay', base: 250000, st: { speed: 8, staminaSave: 5 } },
  non_la: { name: 'Nón lá', icon: '👒', type: 'equip', slot: 'non', base: 30000, st: { staminaSave: 8 } },
  non_bh: { name: 'Nón bảo hiểm', icon: '⛑️', type: 'equip', slot: 'non', base: 80000, st: { charisma: 1, staminaSave: 3 } },
  kinh_ram: { name: 'Kính râm', icon: '🕶️', type: 'equip', slot: 'kinh', base: 90000, st: { charisma: 4 } },
  khuyen_tai: { name: 'Khuyên tai bạc', icon: '💍', type: 'equip', slot: 'khuyentai', base: 200000, st: { charisma: 6 } },
  dong_ho: { name: 'Đồng hồ cơ', icon: '⌚', type: 'equip', slot: 'dongho', base: 400000, st: { charisma: 8 } },
  balo: { name: 'Balo vải', icon: '🎒', type: 'equip', slot: 'lung', base: 120000, st: { charisma: 2, staminaSave: 4 } },
  hao_quang: { name: 'Hào quang neon', icon: '✨', type: 'equip', slot: 'dacbiet', base: 0, premium: 20, st: { charisma: 10 } },
  xe_cub: { name: 'Xe Cub 50', icon: '🛵', type: 'equip', slot: 'xe', base: 800000, st: { vehicle: 1.7 } },
  xe_ga: { name: 'Xe tay ga', icon: '🛵', type: 'equip', slot: 'xe', base: 2500000, st: { vehicle: 2.1, charisma: 8 } },
  dien_thoai: { name: 'Điện thoại cảm ứng', icon: '📱', type: 'equip', slot: 'phone', base: 300000, st: { charisma: 3 } },
  bien_so_dep: { name: 'Biển số 59-X1 999.99', icon: '🔢', type: 'equip', slot: 'dacbiet', base: 0, st: { charisma: 15 } },
  meo_quy: { name: 'Mèo Anh lông ngắn', icon: '🐈', type: 'equip', slot: 'dacbiet', base: 0, st: { charisma: 12 } },
  ao_limited: { name: 'Áo khoác Limited', icon: '🧥', type: 'equip', slot: 'ao', base: 0, st: { charisma: 14 } },
};

export const RECIPES = {
  banhmi: { name: 'Làm 4 ổ bánh mì thịt', in: { phoi_banh: 4, thit_nguoi: 2, rau_thom: 2 }, out: { banhmi: 4 }, stamina: 8 },
  tra_da: { name: 'Pha 6 ly trà đá', in: { tra_kho: 1, da_vien: 2 }, out: { tra_da: 6 }, stamina: 4 },
  nuoc_mia: { name: 'Ép 3 ly nước mía', in: { cay_mia: 2, da_vien: 1 }, out: { nuoc_mia: 3 }, stamina: 6 },
};

// Cong trinh. sprite: anh tach tu concept; gen: ve thu tuc o client.
export const BUILDINGS = [
  { id: 'school', x: 420, gen: { w: 620, h: 300, wall: 0xd9c9a3, roof: 0x8a3b2e, sign: 'ĐẠI HỌC BÁCH KHOA PHỐ', signBg: 0x1f3d7a, windows: 'grid' } },
  { id: 'tro', x: 1010, gen: { w: 360, h: 250, wall: 0xc7d3b8, roof: 0x5a6b4a, sign: 'NHÀ TRỌ SINH VIÊN', signBg: 0x3d5a3a, windows: 'balcony' } },
  { id: 'net', x: 1390, gen: { w: 300, h: 210, wall: 0x6f6a80, roof: 0x2e2b3a, sign: 'NET CỎ 24/7', signBg: 0x111111, neon: 0x39ff88, windows: 'shop' } },
  { id: 'buudien', x: 2100, sprite: 'bld_buudien' },
  { id: 'bida', x: 2800, sprite: 'bld_bida' },
  { id: 'kiot', x: 3420, gen: { w: 330, h: 230, wall: 0xe0b98a, roof: 0x7b4a2a, sign: 'TẠP HÓA CÔ BA', signBg: 0x9b2c2c, windows: 'shop' } },
  { id: 'bank', x: 4080, gen: { w: 420, h: 380, wall: 0x9fc4d8, roof: 0x24495e, sign: 'VIETBANK', signBg: 0x0d2a4a, neon: 0xffd34d, windows: 'glass' } },
  { id: 'office', x: 4620, gen: { w: 480, h: 400, wall: 0xa9b8c9, roof: 0x2f3b4a, sign: 'TECHCORP TOWER', signBg: 0x202a36, neon: 0x5fd0ff, windows: 'glass' } },
  { id: 'auction', x: 5040, gen: { w: 300, h: 300, wall: 0xc9a86a, roof: 0x5a3d1a, sign: 'NHÀ ĐẤU GIÁ', signBg: 0x5a1a1a, neon: 0xff5fa8, windows: 'arch' } },
  { id: 'junk', x: 5850, gen: { w: 520, h: 200, wall: 0x7a6a55, roof: 0x4a3f33, sign: 'VỰA VE CHAI CHÚ TƯ', signBg: 0x3a2f22, windows: 'shed' } },
];

// Diem tuong tac. kind quyet dinh hop thoai phia server.
export const POIS = [
  { id: 'school_gate', kind: 'school', name: 'Giảng đường', x: 420, y: 470 },
  { id: 'tro', kind: 'tro', name: 'Nhà trọ', x: 1010, y: 470 },
  { id: 'net', kind: 'net', name: 'Quán Net Cỏ', x: 1390, y: 470 },
  { id: 'veso', kind: 'veso', name: 'Ông Lão Vé Số', x: 1730, y: 545, npc: 'npc_onglao', prop: 'cart_veso', propDx: -70 },
  { id: 'buudien', kind: 'buudien', name: 'Bưu Điện (Bưu tá)', x: 1985, y: 470, npc: 'npc_buuta', npcDx: 60 },
  { id: 'cafe', kind: 'cafe', name: 'Cà Phê Vỉa Hè', x: 2240, y: 480 },
  { id: 'banhmi', kind: 'banhmi', name: 'Bà Cụ Bánh Mì', x: 2470, y: 545, npc: 'npc_bacu', prop: 'cart_banhmi', propDx: 75 },
  { id: 'bangdia', kind: 'bangdia', name: 'Tiệm Băng Đĩa Cũ', x: 2670, y: 470 },
  { id: 'bida', kind: 'bida', name: 'CLB Bida', x: 2930, y: 470 },
  { id: 'barber', kind: 'barber', name: 'Ông Thợ Cắt Tóc', x: 3200, y: 560, anim: 'anim_catoc' },
  { id: 'kiot', kind: 'cho', name: 'Tạp Hóa (Nguyên liệu)', x: 3420, y: 470 },
  { id: 'mechanic', kind: 'mechanic', name: 'Chú Sửa Xe', x: 3640, y: 565, anim: 'anim_suaxe' },
  { id: 'atm1', kind: 'atm', name: 'Cây ATM', x: 3740, y: 870 },
  { id: 'atm2', kind: 'atm', name: 'Cây ATM VietBank', x: 3930, y: 470 },
  { id: 'bank', kind: 'bank', name: 'Quầy Giao Dịch VietBank', x: 4130, y: 470 },
  { id: 'office', kind: 'office', name: 'TechCorp (Chấm công)', x: 4620, y: 470 },
  { id: 'auction', kind: 'auction', name: 'Nhà Đấu Giá', x: 5040, y: 470 },
  { id: 'showroom', kind: 'showroom', name: 'Showroom Xe Máy', x: 4250, y: 900, prop: 'cub', propDx: 0, propDy: -6 },
  { id: 'fashion', kind: 'fashion', name: 'Shop Thời Trang', x: 4800, y: 900 },
  { id: 'junkyard', kind: 'junk', name: 'Vựa Ve Chai', x: 5850, y: 470 },
];

// O quy hoach bay sap (hop phap, mat phi thue). Bay ngoai o -> co the bi phat.
export const PLOTS = Array.from({ length: 10 }, (_, i) => ({ id: `plot${i}`, x: 1900 + i * 170, y: 860 }));

export const CHAT = { nearRadius: 700, maxLen: 120 };

export const AUCTION = { startHour: 20, lotSeconds: 45, antiSnipe: 10, minStep: 0.1 };

export const FORMAT = {
  vnd(n) {
    return `${Math.round(n).toLocaleString('vi-VN')}đ`;
  },
  clock(min) {
    const m = ((min % 1440) + 1440) % 1440;
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  },
};
