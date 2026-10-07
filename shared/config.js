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
  { id: 'cbd', name: 'Khu 2 · Trung Tâm Tài Chính', x0: 4200, x1: 6020, crime: 0.3, police: 2 },
  { id: 'ngoaio', name: 'Khu 4 · Ngoại Ô & Bãi Phế Liệu', x0: 6020, x1: 6800, crime: 1.6, police: 0 },
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
  banhmi: { name: 'Bánh mì thịt', icon: '🥖', type: 'food', base: 15000, eff: { hunger: 40, stamina: 25 } },
  tra_da: { name: 'Trà đá', icon: '🧋', type: 'food', base: 3000, eff: { stress: -10, stamina: 5, hunger: 3 } },
  ca_phe: { name: 'Cà phê sữa đá', icon: '☕', type: 'food', base: 12000, eff: { stamina: 20, stress: -8, hunger: 3 } },
  nuoc_mia: { name: 'Nước mía', icon: '🥤', type: 'food', base: 8000, eff: { stamina: 15, stress: -5, hunger: 8 }, hot: 2 },
  com_suon: { name: 'Cơm tấm sườn', icon: '🍛', type: 'food', base: 35000, eff: { hunger: 70, stamina: 20, stress: -6 } },
  com_bi_cha: { name: 'Cơm tấm bì chả', icon: '🍛', type: 'food', base: 30000, eff: { hunger: 60, stamina: 15, stress: -4 } },
  canh_chua: { name: 'Chén canh', icon: '🥣', type: 'food', base: 10000, eff: { hunger: 15, stress: -5 } },
  trung_op_la: { name: 'Trứng ốp la', icon: '🍳', type: 'food', base: 8000, eff: { hunger: 20, stamina: 5 } },
  tra_sua: { name: 'Trà sữa trân châu', icon: '🧋', type: 'food', base: 25000, eff: { stress: -15, stamina: 5, hunger: 10 } },

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
  ao_somi: { name: 'Áo sơ mi công sở', icon: '👔', type: 'equip', slot: 'ao', base: 150000, rar: 'good', st: { charisma: 5 } },
  quan_jean: { name: 'Quần jean', icon: '👖', type: 'equip', slot: 'quan', base: 120000, st: { charisma: 3 } },
  dep_lao: { name: 'Dép lào', icon: '🩴', type: 'equip', slot: 'giay', base: 20000, st: { speed: 3 } },
  giay_tt: { name: 'Giày thể thao', icon: '👟', type: 'equip', slot: 'giay', base: 250000, rar: 'good', st: { speed: 8, staminaSave: 5 } },
  non_la: { name: 'Nón lá', icon: '👒', type: 'equip', slot: 'non', base: 30000, st: { staminaSave: 8 } },
  non_bh: { name: 'Nón bảo hiểm', icon: '⛑️', type: 'equip', slot: 'non', base: 80000, st: { charisma: 1, staminaSave: 3 } },
  kinh_ram: { name: 'Kính râm', icon: '🕶️', type: 'equip', slot: 'kinh', base: 90000, st: { charisma: 4 } },
  khuyen_tai: { name: 'Khuyên tai bạc', icon: '💍', type: 'equip', slot: 'khuyentai', base: 200000, rar: 'good', st: { charisma: 6 } },
  dong_ho: { name: 'Đồng hồ cơ', icon: '⌚', type: 'equip', slot: 'dongho', base: 400000, rar: 'good', st: { charisma: 8 } },
  balo: { name: 'Balo vải', icon: '🎒', type: 'equip', slot: 'lung', base: 120000, st: { charisma: 2, staminaSave: 4 } },
  hao_quang: { name: 'Hào quang neon', icon: '✨', type: 'equip', slot: 'dacbiet', base: 0, premium: 20, rar: 'limited', st: { charisma: 10 } },
  xe_cub: { name: 'Xe Cub 50', icon: '🛵', type: 'equip', slot: 'xe', base: 800000, st: { vehicle: 1.7 } },
  xe_dap: { name: 'Xe đạp cũ', icon: '🚲', type: 'equip', slot: 'xe', base: 150000, st: { vehicle: 1.3 } },
  xe_pkl: { name: 'Xe phân khối lớn', icon: '🏍️', type: 'equip', slot: 'xe', base: 8000000, rar: 'rare', st: { vehicle: 2.5, charisma: 20 } },
  ao_dai_do: { name: 'Áo dài đỏ', icon: '👘', type: 'equip', slot: 'ao', base: 350000, rar: 'good', st: { charisma: 7 } },
  tui_xach: { name: 'Túi xách da', icon: '👜', type: 'equip', slot: 'lung', base: 250000, rar: 'good', st: { charisma: 5 } },
  non_ket: { name: 'Nón kết', icon: '🧢', type: 'equip', slot: 'non', base: 50000, st: { charisma: 2, staminaSave: 2 } },
  dep_quai: { name: 'Dép quai hậu', icon: '🩴', type: 'equip', slot: 'giay', base: 60000, st: { speed: 4 } },
  xe_ga: { name: 'Xe tay ga', icon: '🛵', type: 'equip', slot: 'xe', base: 2500000, st: { vehicle: 2.1, charisma: 8 } },
  dien_thoai: { name: 'Điện thoại cảm ứng', icon: '📱', type: 'equip', slot: 'phone', base: 300000, rar: 'good', st: { charisma: 3 } },
  bien_so_dep: { name: 'Biển số 59-X1 999.99', icon: '🔢', type: 'equip', slot: 'dacbiet', base: 0, rar: 'limited', st: { charisma: 15 } },
  meo_quy: { name: 'Mèo Anh lông ngắn', icon: '🐈', type: 'equip', slot: 'dacbiet', base: 0, rar: 'rare', st: { charisma: 12 } },
  ao_limited: { name: 'Áo khoác Limited', icon: '🧥', type: 'equip', slot: 'ao', base: 0, rar: 'limited', st: { charisma: 14 } },
};

// Noi that (G22, G51): 20 loai x 3 phan khuc (Binh dan · Tam trung · Cao cap), anh v2/furn/<loai>_<1..3>.png.
// comfort: diem thoai mai phong · power: tien dien/ngay (d) · sleep: he so hoi nang luong khi ngu (giuong)
// cool: lam mat (ngu khi nang gat) · relax: tinh than khi xem TV · it: +giay ca IT. Chua co art: cay canh, rem, tranh, dong ho.
export const FURN_TYPES = {
  bed: 'Giường', wardrobe: 'Tủ quần áo', chest: 'Rương', fridge: 'Tủ lạnh', stove: 'Bếp', ricecooker: 'Nồi cơm điện',
  microwave: 'Lò vi sóng', sink: 'Bồn rửa', dining: 'Bàn ăn', desk: 'Bàn học', pc: 'Máy tính', bookshelf: 'Kệ sách',
  sofa: 'Sofa', coffeetable: 'Bàn trà', tv: 'TV', fan: 'Quạt', aircon: 'Máy lạnh', washer: 'Máy giặt', lamp: 'Đèn', rug: 'Thảm',
};
const FURN_DATA = {
  bed: [['Nệm trải sàn', 300000, { comfort: 2, sleep: 1 }], ['Giường gỗ đơn', 2000000, { comfort: 6, sleep: 1.4 }], ['Giường đôi nệm lò xo', 9000000, { comfort: 14, sleep: 1.8 }]],
  wardrobe: [['Tủ vải khung sắt', 250000, { comfort: 1 }], ['Tủ gỗ 2 cánh', 2500000, { comfort: 4 }], ['Tủ 3 cánh có gương', 8000000, { comfort: 8 }]],
  chest: [['Thùng nhựa chồng', 120000, { comfort: 0 }], ['Rương gỗ khóa đồng', 900000, { comfort: 2 }], ['Rương gỗ tếch chạm', 5000000, { comfort: 6 }]],
  fridge: [['Tủ mini Gió Đông 50L', 2000000, { comfort: 1, power: 3000 }], ['Tủ 2 cửa Sương Mai 180L', 6000000, { comfort: 2, power: 4000 }], ['Side-by-side Bắc Cực 500L', 20000000, { comfort: 5, power: 6000 }]],
  stove: [['Bếp gas mini 1 lò', 250000, { comfort: 0 }], ['Bếp gas đôi', 1500000, { comfort: 1 }], ['Bếp từ đôi cao cấp', 12000000, { comfort: 4, power: 3000 }]],
  ricecooker: [['Nồi cơm nhôm cũ', 200000, { comfort: 0, power: 1000 }], ['Nồi cơm điện Bông Lúa', 800000, { comfort: 0, power: 1000 }], ['Nồi cơm cao tần', 4000000, { comfort: 1, power: 1000 }]],
  microwave: [['Lò vi sóng núm vặn', 600000, { comfort: 0, power: 1000 }], ['Lò vi sóng nút bấm', 1800000, { comfort: 1, power: 1000 }], ['Lò nướng đối lưu', 6000000, { comfort: 2, power: 2000 }]],
  sink: [['Thau nhựa kê gỗ', 100000, { comfort: 0 }], ['Bồn rửa inox', 1200000, { comfort: 1 }], ['Bồn đôi đá cẩm thạch', 7000000, { comfort: 3 }]],
  dining: [['Bàn xếp + ghế nhựa', 250000, { comfort: 1 }], ['Bàn gỗ 2 ghế', 2000000, { comfort: 3 }], ['Bàn kính 4 ghế nệm', 9000000, { comfort: 7 }]],
  desk: [['Bàn xếp + ghế đẩu', 200000, { comfort: 1 }], ['Bàn học gỗ + ghế xoay', 1800000, { comfort: 3 }], ['Bàn chữ L + ghế công thái học', 7000000, { comfort: 6 }]],
  pc: [['PC cũ màn CRT', 2500000, { comfort: 0, power: 3000, it: 0 }], ['PC văn phòng', 9000000, { comfort: 1, power: 3000, it: 10 }], ['PC gaming 2 màn RGB', 30000000, { comfort: 3, power: 6000, it: 25 }]],
  bookshelf: [['Kệ nhựa', 150000, { comfort: 1 }], ['Kệ gỗ 5 tầng', 1500000, { comfort: 3 }], ['Tủ sách đèn LED', 6000000, { comfort: 6, power: 1000 }]],
  sofa: [['Ghế tre đôi', 400000, { comfort: 2 }], ['Sofa vải 2 chỗ', 4000000, { comfort: 6 }], ['Sofa da chữ L', 18000000, { comfort: 12 }]],
  coffeetable: [['Ghế nhựa làm bàn', 50000, { comfort: 0 }], ['Bàn trà gỗ', 800000, { comfort: 2 }], ['Bàn trà đá chân vàng', 6000000, { comfort: 5 }]],
  tv: [['TV đít bự cũ', 500000, { comfort: 1, power: 2000, relax: 6 }], ['TV phẳng 32 inch', 5000000, { comfort: 2, power: 2000, relax: 10 }], ['TV 65 inch + loa', 25000000, { comfort: 4, power: 4000, relax: 16 }]],
  fan: [['Quạt bàn Gió Lùa', 150000, { comfort: 0, power: 1000, cool: 1 }], ['Quạt cây Sương Mai', 600000, { comfort: 1, power: 1000, cool: 2 }], ['Quạt tháp không cánh', 3500000, { comfort: 2, power: 1000, cool: 3 }]],
  aircon: [['Máy lạnh cũ Gió Lùa 1HP', 1200000, { comfort: 2, power: 8000, cool: 3 }], ['Sương Mai Inverter 1HP', 6000000, { comfort: 4, power: 4000, cool: 6 }], ['Bắc Cực Inverter 2HP', 15000000, { comfort: 6, power: 5000, cool: 10 }]],
  washer: [['Máy giặt 2 lồng cũ', 1000000, { comfort: 1, power: 2000 }], ['Máy giặt cửa trên', 5000000, { comfort: 2, power: 2000 }], ['Máy giặt cửa trước', 12000000, { comfort: 4, power: 2000 }]],
  lamp: [['Bóng đèn kẹp', 60000, { comfort: 0, power: 500 }], ['Đèn cây chụp vải', 700000, { comfort: 2, power: 1000 }], ['Đèn cần câu thiết kế', 4000000, { comfort: 5, power: 1000 }]],
  rug: [['Chiếu cói', 80000, { comfort: 1 }], ['Thảm vải hoa văn', 900000, { comfort: 3 }], ['Thảm lông Ba Tư', 6000000, { comfort: 7 }]],
};
// Nau an (G44–G48). Nguyen lieu ban o Tap hoa (sau nay ca Sieu thi); mon nau ra co 1–3 sao.
const NL = {
  nl_gao: ['Gạo (1 lon)', 4000], nl_trung: ['Trứng gà', 3000], nl_rau_muong: ['Rau muống', 5000], nl_thit_ba_chi: ['Thịt ba chỉ', 15000],
  nl_ca: ['Cá basa', 18000], nl_ca_chua: ['Cà chua', 4000], nl_dau_hu: ['Đậu hũ', 4000], nl_mi_goi: ['Mì gói', 4000],
  nl_banh_pho: ['Bún / bánh phở', 6000], nl_hanh_toi: ['Hành tỏi', 2000], nl_nuoc_mam: ['Nước mắm', 3000], nl_dau_an: ['Dầu ăn', 3000],
};
for (const [id, [name, base]] of Object.entries(NL)) ITEMS[id] = { name, icon: '🥬', type: 'ingredient', base };
ITEMS.sach_cong_thuc = { name: 'Sách công thức Món Nhà Làm', icon: '📕', type: 'book', base: 60000 };

// in: nguyen lieu theo DUNG thu tu cho vao · stove: cap bep toi thieu · rice: can noi com dien · book: phai doc sach moi biet
export const DISHES = {
  mon_com_trang: { name: 'Cơm trắng', in: ['nl_gao'], stove: 1, rice: true, eff: { hunger: 35, stamina: 5 }, base: 8000 },
  mon_trung_op_la: { name: 'Trứng chiên', in: ['nl_dau_an', 'nl_trung', 'nl_nuoc_mam'], stove: 1, eff: { hunger: 25, stamina: 10 }, base: 12000 },
  mon_rau_muong_xao: { name: 'Rau muống xào tỏi', in: ['nl_dau_an', 'nl_hanh_toi', 'nl_rau_muong', 'nl_nuoc_mam'], stove: 1, eff: { hunger: 20, stress: -6 }, base: 18000 },
  mon_mi_trung: { name: 'Mì gói trứng', in: ['nl_mi_goi', 'nl_trung'], stove: 1, eff: { hunger: 35, stamina: 10 }, base: 12000 },
  mon_chao: { name: 'Cháo trắng hành', in: ['nl_gao', 'nl_hanh_toi', 'nl_nuoc_mam'], stove: 1, eff: { hunger: 30, stamina: 15 }, base: 12000 },
  mon_mi_xao: { name: 'Mì xào thịt', in: ['nl_dau_an', 'nl_mi_goi', 'nl_thit_ba_chi', 'nl_rau_muong'], stove: 1, eff: { hunger: 50, stamina: 15 }, base: 35000, book: true },
  mon_com_chien: { name: 'Cơm chiên trứng', in: ['nl_dau_an', 'nl_gao', 'nl_trung', 'nl_hanh_toi'], stove: 1, rice: true, eff: { hunger: 55, stamina: 15 }, base: 25000, book: true },
  mon_dau_hu_sot_ca: { name: 'Đậu hũ sốt cà', in: ['nl_dau_an', 'nl_dau_hu', 'nl_ca_chua', 'nl_nuoc_mam'], stove: 1, eff: { hunger: 40, stress: -8 }, base: 25000, book: true },
  mon_bun_xao: { name: 'Bún xào thịt', in: ['nl_dau_an', 'nl_banh_pho', 'nl_thit_ba_chi', 'nl_rau_muong'], stove: 1, eff: { hunger: 50, stamina: 15 }, base: 38000, book: true },
  mon_canh_chua: { name: 'Canh chua cá', in: ['nl_ca_chua', 'nl_ca', 'nl_nuoc_mam'], stove: 2, eff: { hunger: 30, stress: -12 }, base: 40000, book: true },
  mon_thit_kho_trung: { name: 'Thịt kho trứng', in: ['nl_thit_ba_chi', 'nl_trung', 'nl_nuoc_mam'], stove: 2, eff: { hunger: 55, stamina: 15, stress: -8 }, base: 45000, book: true },
  mon_ca_kho_to: { name: 'Cá kho tộ', in: ['nl_ca', 'nl_hanh_toi', 'nl_nuoc_mam'], stove: 2, eff: { hunger: 50, stamina: 15, stress: -8 }, base: 50000, book: true },
};
// Sao: he so hieu qua / gia ban. Bep cap cao: kim lua cham hon, vung xanh rong hon (+sao)
export const COOK = {
  stars: [null, { eff: 1, base: 1, tag: '' }, { eff: 1.3, base: 1.6, tag: ' ⭐⭐' }, { eff: 1.6, base: 2.5, tag: ' ⭐⭐⭐' }],
  period: [1500, 1700, 2000], zone: [[0.62, 0.84], [0.6, 0.86], [0.56, 0.9]], stamina: 4, secsPerStep: 6, minGap: 350,
};
for (const [id, d] of Object.entries(DISHES)) {
  for (let s = 1; s <= 3; s++) {
    const k = COOK.stars[s];
    ITEMS[s === 1 ? id : `${id}_s${s}`] = {
      name: `${d.name}${k.tag}`, icon: '🍲', ico: id, type: 'food', base: Math.round((d.base * k.base) / 1000) * 1000,
      eff: Object.fromEntries(Object.entries(d.eff).map(([e, v]) => [e, Math.round(v * k.eff)])), cooked: s,
    };
  }
}

// Trang bi theo do hiem (G60): icon gear_<loai>_<1..4> = Thuong · Tot · Hiem · Gioi han.
// Quay Thoi trang ban cap 1–2; cap 3–4 chi co tu Gacha (hoac mua lai o cho).
const GEAR = {
  ao: ['ao', 80000, { charisma: 2 }, ['Áo thun rêu', 'Áo thun cam', 'Sơ mi xanh cổ vịt', 'Sơ mi lụa kem']],
  quan: ['quan', 100000, { charisma: 2 }, ['Quần kaki rêu', 'Quần kaki cam', 'Quần jean xanh', 'Quần tây kem']],
  giay: ['giay', 120000, { speed: 3 }, ['Giày vải nâu', 'Sneaker rêu', 'Sneaker đỏ', 'Giày da kem']],
  non: ['non', 50000, { staminaSave: 3, charisma: 1 }, ['Nón kết cam', 'Nón kết lá', 'Nón kết đỏ', 'Nón kết thêu vàng']],
  kinh: ['kinh', 90000, { charisma: 3 }, ['Kính mát gọng cam', 'Kính mát rêu', 'Kính mát đỏ', 'Kính mắt mèo hồng']],
  dongho: ['dongho', 150000, { charisma: 4 }, ['Đồng hồ dây xanh', 'Đồng hồ quân đội', 'Đồng hồ thể thao đỏ', 'Đồng hồ vàng']],
  balo: ['lung', 120000, { staminaSave: 3, charisma: 1 }, ['Balo vải rêu', 'Balo du lịch cam', 'Balo leo núi', 'Balo da kem']],
};
const GEAR_RAR = [['common', 1, 1], ['good', 1.8, 3], ['rare', 3, 8], ['limited', 4.5, 20]]; // [do hiem, he so chi so, he so gia]
for (const [kind, [slot, base, st, names]] of Object.entries(GEAR)) {
  GEAR_RAR.forEach(([rar, k, kp], i) => {
    ITEMS[`gear_${kind}_${i + 1}`] = {
      name: names[i], icon: '👕', type: 'equip', slot, rar, base: base * kp,
      st: Object.fromEntries(Object.entries(st).map(([s, v]) => [s, Math.round(v * k)])),
    };
  });
}
// Do dien tu (quay Dien tu): dien thoai la trang bi; laptop la dung cu (+giay ca IT nhu may tinh)
Object.assign(ITEMS, {
  dt_cu: { name: 'Điện thoại cục gạch', icon: '📱', type: 'equip', slot: 'phone', base: 300000, st: { charisma: 1 } },
  dt_tamtrung: { name: 'Điện thoại Sương Mai S5', icon: '📱', type: 'equip', slot: 'phone', base: 2500000, rar: 'good', st: { charisma: 4 } },
  dt_caocap: { name: 'Điện thoại Bắc Cực Pro', icon: '📱', type: 'equip', slot: 'phone', base: 15000000, rar: 'rare', st: { charisma: 9 } },
  laptop_cu: { name: 'Laptop cũ', icon: '💻', type: 'tool', base: 3000000, it: 5 },
  laptop_vanphong: { name: 'Laptop văn phòng', icon: '💻', type: 'tool', base: 9000000, it: 12 },
  laptop_gaming: { name: 'Laptop gaming', icon: '💻', type: 'tool', base: 25000000, it: 22 },
  gacha_manh: { name: 'Mảnh lấp lánh', icon: '✨', type: 'material', base: 5000 },
});

// Gacha (G61–G64): chi tra bang tien kiem trong game. pity: so luot chua ra -> lan ke chac chan
export const GACHA = {
  price: 30000, rates: [['limited', 0.02], ['rare', 0.10], ['good', 0.28], ['common', 0.60]],
  pityRare: 40, pityLimited: 100, kinds: Object.keys(GEAR),
  shards: { common: 1, good: 2, rare: 5, limited: 10 }, exchange: 30, // doi 30 manh lay 1 mon Hiem tu chon
};

export const FURN_TIER = ['Bình dân', 'Tầm trung', 'Cao cấp'];
for (const [type, tiers] of Object.entries(FURN_DATA)) {
  tiers.forEach(([name, base, st], i) => {
    ITEMS[`${type}_${i + 1}`] = {
      name, icon: '🛋️', type: 'furn', base, img: `v2/furn/${type}_${i + 1}.png`,
      furn: { type, tier: i + 1, comfort: 0, power: 0, ...st },
    };
  });
}
export const FURN_WALL = ['aircon']; // treo tuong
export const FURN_FLAT = ['rug']; // nam duoi sat san, luon ve duoi cac do khac

// Phong o (G19, G21). floor/wall: khoang y dat do (theo anh nen 1024x572); x: khoang ngang; max: so mon toi da
export const ROOMS = {
  tro: { name: 'Phòng trọ 15m²', bg: 'v2/rooms/room_tro.png', floor: [330, 560], wall: [70, 300], x: [70, 860], max: 12 },
};
// Trung Tam Mua Sam (G25–G28): 5 quay trong anh sanh room_mall (1024x572).
// box: vung bam · sign: o bien hieu trong · staff: nhan vien [anim, x chan, y chan] · soon: hang chua co art (chua mo ban)
const furnOf = (...types) => types.flatMap((t) => [1, 2, 3].map((i) => `${t}_${i}`));
export const MALL = {
  giadung: { name: 'Gia dụng', box: [35, 215, 238, 410], sign: [62, 122, 172, 186], staff: ['npc_mall_giadung', 250, 440],
    items: furnOf('stove', 'ricecooker', 'microwave', 'fridge', 'sink', 'washer') },
  noithat: { name: 'Nội thất', box: [255, 220, 412, 338], sign: [272, 184, 393, 216], staff: ['npc_mall_noithat', 345, 410],
    items: furnOf('bed', 'wardrobe', 'chest', 'dining', 'desk', 'bookshelf', 'sofa', 'coffeetable', 'lamp', 'rug'),
    soon: ['Cây cảnh', 'Rèm cửa', 'Tranh treo tường', 'Đồng hồ treo tường'] },
  dientu: { name: 'Điện tử', box: [424, 220, 612, 338], sign: [457, 184, 573, 216], staff: ['npc_mall_giadung', 530, 410],
    items: [...furnOf('tv', 'pc', 'fan', 'aircon'), 'laptop_cu', 'laptop_vanphong', 'laptop_gaming', 'dt_cu', 'dt_tamtrung', 'dt_caocap'],
    soon: ['Tai nghe', 'Loa bluetooth', 'Sạc dự phòng'] },
  thoitrang: { name: 'Thời trang', box: [624, 220, 778, 338], sign: [642, 184, 763, 216], staff: ['npc_mall_noithat', 680, 410],
    items: Object.keys(GEAR).flatMap((k) => [`gear_${k}_1`, `gear_${k}_2`]), gacha: [790, 372] },
  sieuthi: { name: 'Siêu thị', box: [794, 238, 1018, 432], sign: [857, 122, 971, 186], staff: ['npc_mall_giadung', 850, 470],
    items: [...Object.keys(NL), 'sach_cong_thuc'] },
};

// Ngu (G49, G50): moi gio game hoi stamina = rate x he so giuong x thoai mai x nong. Khong giuong -> noBed
export const SLEEP = { rate: 12, noBed: 0.4, hotNoCool: 0.6, coolNeed: 2, stress: 3, hours: [1, 2, 4, 8] };
// starter: do co san khi thue phong (id, x, y) — them mon moi thi nguoi da thue cung nhan khi vao phong
export const HOME = { starter: [['bed_1', 330, 470], ['fan_1', 170, 520], ['stove_1', 720, 380]], tvMinutes: 60, enterRange: 170 };

// Do hiem (INVENTORY_V2 I7) — vien o theo mau. Mac dinh 'common'.
export const RARITY = { common: 'Thường', good: 'Tốt', rare: 'Hiếm', limited: 'Giới hạn' };

// 8 o trang bi tren man "bup be giay" (I11). Cac o con lai tam an (chi hien khi dang mac do).
export const DOLL_SLOTS = ['non', 'kinh', 'ao', 'dongho', 'quan', 'lung', 'giay', 'phone'];

// Tui do dang luoi o (I1): 20 o, deo balo/tui +10 (chua chan khi day — chi hien thi)
export const INV = { base: 20, bag: 10 };

export const RECIPES = {
  banhmi: { name: 'Làm 4 ổ bánh mì thịt', in: { phoi_banh: 4, thit_nguoi: 2, rau_thom: 2 }, out: { banhmi: 4 }, stamina: 8 },
  tra_da: { name: 'Pha 6 ly trà đá', in: { tra_kho: 1, da_vien: 2 }, out: { tra_da: 6 }, stamina: 4 },
  nuoc_mia: { name: 'Ép 3 ly nước mía', in: { cay_mia: 2, da_vien: 1 }, out: { nuoc_mia: 3 }, stamina: 6 },
};

// Cong trinh. sprite: art tu asset_new_by_khoit (sign = bien hieu trong, game in chu; box = ty le trong anh)
// gen: anh tam ve bang code — CHO ART (xem docs/ASSET_PROMPTS.md muc 6)
export const BUILDINGS = [
  { id: 'school', x: 420, sprite: 'b_school', sign: { text: 'TRƯỜNG ĐẠI HỌC', box: [0.39, 0.55, 0.61, 0.63] } },
  { id: 'tro', x: 910, sprite: 'b_tro' },
  { id: 'net', x: 1210, sprite: 'b_net', sign: { text: 'NET CỎ 24/7', box: [0.09, 0.01, 0.89, 0.28], neon: '#39ff88' } },
  { id: 'trasua', x: 1545, sprite: 'b_trasua', sign: { text: 'TRÀ SỮA MÂY', box: [0.04, 0.19, 0.76, 0.385] } },
  { id: 'buudien', x: 2060, sprite: 'b_buudien', sign: { text: 'BƯU ĐIỆN', box: [0.36, 0.37, 0.6, 0.51] } },
  { id: 'cafe', x: 2570, sprite: 'b_cafe' },
  { id: 'bangdia', x: 2900, sprite: 'b_bangdia', sign: { text: 'BĂNG ĐĨA CŨ', box: [0.05, 0.01, 0.93, 0.22] } },
  { id: 'bida', x: 3220, sprite: 'b_bida', sign: { text: 'CLB BIDA', box: [0.12, 0.02, 0.88, 0.27], neon: '#5fd0ff' } },
  { id: 'taphoa', x: 3530, sprite: 'b_taphoa', sign: { text: 'TẠP HÓA CÔ BA', box: [0.06, 0.01, 0.92, 0.24] } },
  { id: 'comtam', x: 3905, sprite: 'b_comtam', sign: { text: 'CƠM TẤM SÀI GÒN', box: [0.378, 0.12, 0.778, 0.317] } },
  { id: 'bank', x: 4480, gen: { w: 420, h: 380, wall: 0x9fc4d8, roof: 0x24495e, sign: 'VIETBANK', signBg: 0x0d2a4a, neon: 0xffd34d, windows: 'glass' } },
  { id: 'office', x: 5020, gen: { w: 480, h: 400, wall: 0xa9b8c9, roof: 0x2f3b4a, sign: 'TECHCORP TOWER', signBg: 0x202a36, neon: 0x5fd0ff, windows: 'glass' } },
  { id: 'auction', x: 5440, gen: { w: 300, h: 300, wall: 0xc9a86a, roof: 0x5a3d1a, sign: 'NHÀ ĐẤU GIÁ', signBg: 0x5a1a1a, neon: 0xff5fa8, windows: 'arch' } },
  // v2: anh trong client/assets/v2/bld (nap rieng), scale: phong to so voi anh cat
  { id: 'mall', x: 5800, sprite: 'b_mall', v2: true, scale: 1.35, sign: { text: 'TTTM PHỐ THỊ', box: [0.3, 0.555, 0.69, 0.645] } },
  { id: 'junk', x: 6250, sprite: 'b_vechai', sign: { text: 'VỰA VE CHAI CHÚ TƯ', box: [0.28, 0.13, 0.75, 0.32] } },
];

// Diem tuong tac. kind quyet dinh hop thoai phia server.
// work: NPC dang lam viec (anim), prop: do vat kem theo; Dx/Dy: lech so voi diem tuong tac
export const POIS = [
  { id: 'school_gate', kind: 'school', name: 'Giảng đường', x: 420, y: 470 },
  { id: 'tro', kind: 'tro', name: 'Nhà trọ', x: 910, y: 470 },
  { id: 'net', kind: 'net', name: 'Quán Net Cỏ', x: 1210, y: 470 },
  { id: 'trasua', kind: 'trasua', name: 'Tiệm Trà Sữa', x: 1545, y: 470 },
  { id: 'veso', kind: 'veso', name: 'Ông Lão Vé Số', x: 1700, y: 550, work: 'npc_veso', prop: 'cart_veso_v2', propDx: -62 },
  { id: 'buudien', kind: 'buudien', name: 'Bưu Điện (Bưu tá)', x: 2060, y: 470, npc: 'npc_buuta', npcDx: 75 },
  { id: 'cafe', kind: 'cafe', name: 'Cà Phê Vỉa Hè', x: 2570, y: 480 },
  { id: 'banhmi', kind: 'banhmi', name: 'Bà Cụ Bánh Mì', x: 2735, y: 560, work: 'npc_banhmi', prop: 'cart_banhmi_v2', propDx: 60 },
  { id: 'bangdia', kind: 'bangdia', name: 'Tiệm Băng Đĩa Cũ', x: 2900, y: 470 },
  { id: 'bida', kind: 'bida', name: 'CLB Bida', x: 3220, y: 470 },
  { id: 'kiot', kind: 'cho', name: 'Tạp Hóa (Nguyên liệu)', x: 3530, y: 470 },
  { id: 'barber', kind: 'barber', name: 'Ông Thợ Cắt Tóc', x: 3760, y: 560, work: 'npc_barber', workDx: 45, prop: 'barber_set_v2', propDx: -40 },
  { id: 'comtam', kind: 'comtam', name: 'Quán Cơm Tấm', x: 3905, y: 470 },
  { id: 'mechanic', kind: 'mechanic', name: 'Chú Sửa Xe', x: 4000, y: 565, work: 'npc_mechanic', prop: 'veh_cub', propDx: 85, propDy: 4 },
  { id: 'atm1', kind: 'atm', name: 'Cây ATM', x: 4140, y: 870 },
  { id: 'atm2', kind: 'atm', name: 'Cây ATM VietBank', x: 4290, y: 470 },
  { id: 'bank', kind: 'bank', name: 'Quầy Giao Dịch VietBank', x: 4480, y: 470, work: 'npc_guard', workDx: 70 },
  { id: 'office', kind: 'office', name: 'TechCorp (Chấm công)', x: 5020, y: 470, work: 'npc_guard', workDx: -70 },
  { id: 'auction', kind: 'auction', name: 'Nhà Đấu Giá', x: 5440, y: 470, work: 'npc_auction', workDx: 70 },
  { id: 'mall', kind: 'mall', name: 'Trung Tâm Mua Sắm', x: 5800, y: 470 },
  { id: 'tutor', kind: 'tutor', name: 'Nhà học sinh (Gia sư)', x: 4735, y: 470 },
  { id: 'showroom', kind: 'showroom', name: 'Showroom Xe Máy', x: 4650, y: 900 },
  { id: 'fashion', kind: 'fashion', name: 'Shop Thời Trang', x: 5200, y: 900 },
  { id: 'junkyard', kind: 'junk', name: 'Vựa Ve Chai', x: 6250, y: 470, work: 'npc_vechai', workDx: 90, workDy: 10 },
];

// O quy hoach bay sap (hop phap, mat phi thue). Bay ngoai o -> co the bi phat.
export const PLOTS = Array.from({ length: 10 }, (_, i) => ({ id: `plot${i}`, x: 1900 + i * 170, y: 860 }));

// He thong nghe (GAMEPLAY_V2 G11, G43). Lam 1 ca = 1 mini-game, khong gioi han gio, ton nang luong + lam doi.
// pay: luong co ban theo cap 1..5 (nhan theo do chinh xac). target: so diem de dat 100%.
export const JOBS = {
  it: { name: 'IT freelance', icon: '💻', poi: 'tro', place: 'Phòng trọ (đang thuê)', pay: [40000, 60000, 85000, 115000, 150000], energy: 14, hunger: 6, stress: 6, secs: 60, target: 8, needRent: true },
  waiter: { name: 'Phục vụ quán cơm', icon: '🍽️', poi: 'comtam', place: 'Quán Cơm Tấm (Khu 1)', pay: [20000, 30000, 40000, 50000, 60000], energy: 12, hunger: 10, stress: 4, secs: 60, target: 10 },
  milktea: { name: 'Pha trà sữa', icon: '🧋', poi: 'trasua', place: 'Tiệm Trà Sữa (Khu 3)', pay: [25000, 35000, 45000, 57000, 70000], energy: 10, hunger: 8, stress: 4, secs: 75, target: 6 },
  // street: lam ngay tren pho (khong mo man rieng), server tu kiem tra vi tri
  flyer: { name: 'Phát tờ rơi', icon: '📄', poi: null, place: 'Bất kỳ đâu trên phố', pay: [15000, 20000, 27000, 33000, 40000], energy: 10, hunger: 8, stress: 3, secs: 90, target: 10, street: true },
  ship: { name: 'Shipper', icon: '📦', poi: 'buudien', place: 'Bưu Điện (Khu 1)', pay: [20000, 32000, 47000, 63000, 80000], energy: 14, hunger: 10, stress: 5, secs: 0, target: 3, street: true, needPhone: true },
  tutor: { name: 'Gia sư', icon: '📚', poi: 'tutor', place: 'Nhà học sinh (Khu 2)', pay: [40000, 55000, 75000, 95000, 120000], energy: 12, hunger: 6, stress: 8, secs: 60, target: 8, needCert: 'tutor' },
};
export const JOB_XP = [0, 20, 60, 130, 250]; // kinh nghiem tich luy de dat cap 1..5
// Nghe da thiet ke nhung chua du art -> tam an (app Viec Lam ghi "sap co")
export const JOBS_SOON = ['☕ Pha cà phê'];
// Shipper: moi don giao toi 1 dia diem, han = quang duong / toc do di bo x he so + du phong
export const SHIP = { minDist: 700, slack: 1.7, extraSecs: 12, range: 140 };
// Phat to roi: so nguoi di duong sinh quanh cho bat dau, tam phat to
export const FLYER = { walkers: 16, spread: 1100, range: 150, skins: ['sv_female', 'vp_male', 'baba_female', 'aodai_female', 'sv_male'] };
// Vi tri nguoi di duong sau ms ke tu luc vao ca: di qua lai giua x0..x1 (server & client tinh giong nhau)
export function walkerPos(w, ms) {
  const span = w.x1 - w.x0;
  const d = (w.ph + (w.sp * ms) / 1000) % (2 * span);
  return d < span ? { x: w.x0 + d, y: w.y, dir: 'right' } : { x: w.x1 - (d - span), y: w.y, dir: 'left' };
}

// Khoa hoc o Truong (G10): thi trac nghiem, dat thi nhan chung chi (mo nghe can chung chi)
export const EXAMS = {
  tutor: { name: 'Chứng chỉ Gia sư', icon: '🎓', fee: 50000, count: 10, pass: 7, secs: 90, energy: 8, hunger: 4, stress: 10 },
};

// Nhiem vu hang ngay (G7): moi ngay boc 3 nhiem vu. key = bo dem trong p.daily.q
export const QUESTS = {
  job2: { name: 'Làm 2 ca việc bất kỳ', key: 'job', need: 2, reward: 20000 },
  eat3: { name: 'Ăn uống 3 lần', key: 'eat', need: 3, reward: 10000 },
  scrap5: { name: 'Nhặt 5 ve chai / linh kiện', key: 'scrap', need: 5, reward: 15000 },
  waiter1: { name: 'Phục vụ 1 ca ở Quán Cơm Tấm', key: 'job_waiter', need: 1, reward: 15000 },
  milktea1: { name: 'Pha trà sữa 1 ca', key: 'job_milktea', need: 1, reward: 15000 },
  it1: { name: 'Làm 1 ca IT ở phòng trọ', key: 'job_it', need: 1, reward: 20000, rent: true },
  flyer1: { name: 'Phát tờ rơi 1 ca', key: 'job_flyer', need: 1, reward: 10000 },
  cook1: { name: 'Tự nấu 1 món ở nhà', key: 'cook', need: 1, reward: 10000, rent: true },
  ship1: { name: 'Giao hàng 1 ca (Bưu Điện)', key: 'job_ship', need: 1, reward: 15000 },
  tutor1: { name: 'Dạy kèm 1 ca', key: 'job_tutor', need: 1, reward: 20000, cert: 'tutor' },
  earn60: { name: 'Kiếm 60.000đ từ đi làm', key: 'earn', need: 60000, reward: 20000 },
  attend: { name: 'Điểm danh ở Giảng đường', key: 'attend', need: 1, reward: 10000, cls: 'sv' },
  chat3: { name: 'Trò chuyện (chat Gần) 3 lần', key: 'chat', need: 3, reward: 5000 },
};
export const QUEST_BONUS = { diamonds: 2, social: 3 };

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
