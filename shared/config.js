// Cau hinh dung chung cho server (Node) va client (trinh duyet).
// Moi so lieu can bang game nam o day de de tinh chinh.

export const WORLD = {
  width: 6800,
  height: 1200,
  buildingBase: 440,     // chan mat tien cong trinh
  sidewalkTop: [440, 580],
  road: [580, 780],
  walk: { x0: 20, x1: 6780, y0: 452, y1: 1180 },
};

export const ZONES = [
  { id: 'daihoc', name: 'Khu 3 · Làng Đại Học', x0: 0, x1: 1600, crime: 0.6, police: 1 },
  { id: 'phoam', name: 'Khu 1 · Phố Ẩm Thực & Chợ Đêm', x0: 1600, x1: 4200, crime: 1.0, police: 1 },
  { id: 'cbd', name: 'Khu 2 · Trung Tâm Tài Chính', x0: 4200, x1: 5600, crime: 0.3, police: 2 },
  { id: 'ngoaio', name: 'Khu 4 · Ngoại Ô & Bãi Phế Liệu', x0: 5600, x1: 6800, crime: 1.6, police: 0 },
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
  sv_female: 'Nữ · Sinh viên',
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
  xe_dap: { name: 'Xe đạp cũ', icon: '🚲', type: 'equip', slot: 'xe', base: 150000, st: { vehicle: 1.3 } },
  xe_pkl: { name: 'Xe phân khối lớn', icon: '🏍️', type: 'equip', slot: 'xe', base: 8000000, st: { vehicle: 2.5, charisma: 20 } },
  ao_dai_do: { name: 'Áo dài đỏ', icon: '👘', type: 'equip', slot: 'ao', base: 350000, st: { charisma: 7 } },
  tui_xach: { name: 'Túi xách da', icon: '👜', type: 'equip', slot: 'lung', base: 250000, st: { charisma: 5 } },
  non_ket: { name: 'Nón kết', icon: '🧢', type: 'equip', slot: 'non', base: 50000, st: { charisma: 2, staminaSave: 2 } },
  dep_quai: { name: 'Dép quai hậu', icon: '🩴', type: 'equip', slot: 'giay', base: 60000, st: { speed: 4 } },
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

// Cong trinh. sprite: art tu asset_new_by_khoit (sign = bien hieu trong, game in chu; box = ty le trong anh)
// gen: anh tam ve bang code — CHO ART (xem docs/ASSET_PROMPTS.md muc 6)
export const BUILDINGS = [
  { id: 'school', x: 420, sprite: 'b_school', sign: { text: 'TRƯỜNG ĐẠI HỌC', box: [0.39, 0.55, 0.61, 0.63] } },
  { id: 'tro', x: 1000, sprite: 'b_tro' },
  { id: 'net', x: 1380, sprite: 'b_net', sign: { text: 'NET CỎ 24/7', box: [0.09, 0.01, 0.89, 0.28], neon: '#39ff88' } },
  { id: 'buudien', x: 2060, sprite: 'b_buudien', sign: { text: 'BƯU ĐIỆN', box: [0.36, 0.37, 0.6, 0.51] } },
  { id: 'cafe', x: 2570, sprite: 'b_cafe' },
  { id: 'bangdia', x: 2900, sprite: 'b_bangdia', sign: { text: 'BĂNG ĐĨA CŨ', box: [0.05, 0.01, 0.93, 0.22] } },
  { id: 'bida', x: 3220, sprite: 'b_bida', sign: { text: 'CLB BIDA', box: [0.12, 0.02, 0.88, 0.27], neon: '#5fd0ff' } },
  { id: 'taphoa', x: 3530, sprite: 'b_taphoa', sign: { text: 'TẠP HÓA CÔ BA', box: [0.06, 0.01, 0.92, 0.24] } },
  { id: 'bank', x: 4480, gen: { w: 420, h: 380, wall: 0x9fc4d8, roof: 0x24495e, sign: 'VIETBANK', signBg: 0x0d2a4a, neon: 0xffd34d, windows: 'glass' } },
  { id: 'office', x: 5020, gen: { w: 480, h: 400, wall: 0xa9b8c9, roof: 0x2f3b4a, sign: 'TECHCORP TOWER', signBg: 0x202a36, neon: 0x5fd0ff, windows: 'glass' } },
  { id: 'auction', x: 5440, gen: { w: 300, h: 300, wall: 0xc9a86a, roof: 0x5a3d1a, sign: 'NHÀ ĐẤU GIÁ', signBg: 0x5a1a1a, neon: 0xff5fa8, windows: 'arch' } },
  { id: 'junk', x: 6250, gen: { w: 520, h: 200, wall: 0x7a6a55, roof: 0x4a3f33, sign: 'VỰA VE CHAI CHÚ TƯ', signBg: 0x3a2f22, windows: 'shed' } },
];

// Diem tuong tac. kind quyet dinh hop thoai phia server.
// work: NPC dang lam viec (anim), prop: do vat kem theo; Dx/Dy: lech so voi diem tuong tac
export const POIS = [
  { id: 'school_gate', kind: 'school', name: 'Giảng đường', x: 420, y: 470 },
  { id: 'tro', kind: 'tro', name: 'Nhà trọ', x: 1000, y: 470 },
  { id: 'net', kind: 'net', name: 'Quán Net Cỏ', x: 1380, y: 470, work: 'npc_netco', workDx: 95, workDy: 8 },
  { id: 'veso', kind: 'veso', name: 'Ông Lão Vé Số', x: 1700, y: 550, work: 'npc_veso', prop: 'cart_veso_v2', propDx: -62 },
  { id: 'buudien', kind: 'buudien', name: 'Bưu Điện (Bưu tá)', x: 2060, y: 470, npc: 'npc_buuta', npcDx: 75 },
  { id: 'cafe', kind: 'cafe', name: 'Cà Phê Vỉa Hè', x: 2570, y: 480, work: 'npc_cafe', workDx: -70, workDy: 12 },
  { id: 'banhmi', kind: 'banhmi', name: 'Bà Cụ Bánh Mì', x: 2735, y: 560, work: 'npc_banhmi', prop: 'cart_banhmi_v2', propDx: 60 },
  { id: 'bangdia', kind: 'bangdia', name: 'Tiệm Băng Đĩa Cũ', x: 2900, y: 470 },
  { id: 'bida', kind: 'bida', name: 'CLB Bida', x: 3220, y: 470 },
  { id: 'kiot', kind: 'cho', name: 'Tạp Hóa (Nguyên liệu)', x: 3530, y: 470, work: 'npc_taphoa', workDx: 100, workDy: 6 },
  { id: 'barber', kind: 'barber', name: 'Ông Thợ Cắt Tóc', x: 3760, y: 560, work: 'npc_barber', workDx: 45, prop: 'barber_set_v2', propDx: -40 },
  { id: 'mechanic', kind: 'mechanic', name: 'Chú Sửa Xe', x: 4000, y: 565, work: 'npc_mechanic', prop: 'veh_cub', propDx: 85, propDy: 4 },
  { id: 'atm1', kind: 'atm', name: 'Cây ATM', x: 4140, y: 870 },
  { id: 'atm2', kind: 'atm', name: 'Cây ATM VietBank', x: 4290, y: 470 },
  { id: 'bank', kind: 'bank', name: 'Quầy Giao Dịch VietBank', x: 4480, y: 470, work: 'npc_guard', workDx: 70 },
  { id: 'office', kind: 'office', name: 'TechCorp (Chấm công)', x: 5020, y: 470, work: 'npc_guard', workDx: -70 },
  { id: 'auction', kind: 'auction', name: 'Nhà Đấu Giá', x: 5440, y: 470, work: 'npc_auction', workDx: 70 },
  { id: 'showroom', kind: 'showroom', name: 'Showroom Xe Máy', x: 4650, y: 900 },
  { id: 'fashion', kind: 'fashion', name: 'Shop Thời Trang', x: 5200, y: 900 },
  { id: 'junkyard', kind: 'junk', name: 'Vựa Ve Chai', x: 6250, y: 470, work: 'npc_vechai', workDx: 90, workDy: 10 },
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
