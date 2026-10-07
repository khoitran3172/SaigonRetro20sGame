// Hoi thoai cua cac diem tuong tac (POI). Server dung UI -> client chi hien thi.
// Moi kind: open(g, s, ctx) -> {title, text, options}; acts[act](g, s, args, inputs, ctx) -> string (toast)
import {
  APARTMENT, CLASSES, ECON, EXAMS, ITEMS, JOBS, JOBS_SOON, PROMOTION, QUESTS, QUEST_BONUS, RECIPES, SLOTS, zoneAt,
} from '../shared/config.js';
import { EconError } from './economy.js';
import { homeOf } from './home.js';
import { jobInfo } from './jobs.js';

const opt = (label, act, args = {}, extra = {}) => ({ label, act, args, ...extra });
const hour = (g) => Math.floor(g.minute / 60);
const vnd = (n) => `${Math.round(n).toLocaleString('vi-VN')}đ`;

function cooldown(g, s, key, minutes) {
  const until = s.p.cd[key] || 0;
  if (until > g.absMinute()) throw new EconError(`Hãy đợi thêm ${until - g.absMinute()} phút (giờ game).`);
  s.p.cd[key] = g.absMinute() + minutes;
}

function needStamina(s, n) {
  if (s.p.stats.stamina < n) throw new EconError('Bạn quá mệt. Hãy ăn uống hoặc nghỉ ngơi.');
}

function addStat(p, key, d, max = 100) {
  p.stats[key] = Math.max(0, Math.min(max, p.stats[key] + d));
}

function shop(items, markup, walletFor = () => 'cash') {
  return {
    options: (g, s) => items.map((id) => {
      const it = ITEMS[id];
      const price = Math.round(it.base * markup);
      const w = walletFor(price);
      return opt(`${it.icon} ${it.name} — ${vnd(price)}${w === 'bank' ? ' (thẻ)' : ''}`, 'buy', { id },
        { inputs: [{ name: 'qty', type: 'number', value: 1, min: 1, max: 20, w: 60 }] });
    }),
    buy(g, s, args, inputs) {
      if (!items.includes(args.id)) throw new EconError('Không bán món này');
      const price = Math.round(ITEMS[args.id].base * markup);
      const qty = Math.max(1, Math.min(20, Math.floor(Number(inputs?.qty) || 1)));
      g.econ.buyFromNpc(s.p, args.id, qty, price, walletFor(price));
      return `Đã mua ${qty} × ${ITEMS[args.id].name}`;
    },
  };
}

// Nut "lam 1 ca" (mo mini-game). Tra ve false -> server khong mo lai hop thoai.
function jobOption(g, s, id) {
  const def = JOBS[id];
  const info = jobInfo(s.p, id);
  const pay = def.pay[info.lvl - 1];
  const locked = def.needCert && !s.p.certs?.[def.needCert];
  return opt(`${def.icon} Làm 1 ca ${def.name} · Cấp ${info.lvl} · ${id === 'ship' ? 'khoảng' : 'tới'} ${vnd(pay)} (−${def.energy} năng lượng)`, 'job', { id }, { disabled: locked });
}
const jobAct = (g, s, a) => {
  g.jobs.start(s, a.id);
  return false;
};

const cafeShop = shop(['tra_da', 'ca_phe', 'nuoc_mia'], 1.3);
const comtamShop = shop(['com_suon', 'com_bi_cha', 'canh_chua', 'trung_op_la', 'tra_da'], 1);
const trasuaShop = shop(['tra_sua'], 1);
const banhmiShop = shop(['banhmi'], 1.2);
const choShop = shop(['phoi_banh', 'thit_nguoi', 'rau_thom', 'tra_kho', 'da_vien', 'cay_mia'], 1);
// Nguyen lieu nau an o nha (G44) + sach cong thuc
const kitchenShop = shop([...Object.keys(ITEMS).filter((id) => id.startsWith('nl_')), 'sach_cong_thuc'], 1);
const showroomShop = shop(['xe_dap', 'xe_cub', 'xe_ga', 'xe_pkl', 'non_bh'], 1, (price) => (price >= 100000 ? 'bank' : 'cash'));
const fashionShop = shop(['ao_thun', 'ao_somi', 'ao_dai_do', 'quan_jean', 'dep_lao', 'dep_quai', 'giay_tt', 'non_la', 'non_ket',
  'kinh_ram', 'khuyen_tai', 'dong_ho', 'balo', 'tui_xach', 'dien_thoai'], 1, (price) => (price >= 100000 ? 'bank' : 'cash'));

const atmOptions = (g, s, fee) => [
  opt('Gửi tiền mặt vào tài khoản', 'deposit', {}, { inputs: [{ name: 'amount', type: 'number', value: Math.max(0, s.p.cash - 20000), w: 110 }] }),
  opt('Rút tiền mặt', 'withdraw', {}, { inputs: [{ name: 'amount', type: 'number', value: 50000, w: 110 }] }),
  ...(fee === 'counter' ? [opt('Chuyển khoản (miễn phí tại quầy)', 'transfer', {}, {
    inputs: [{ name: 'to', type: 'text', ph: 'Tên người nhận', w: 120 }, { name: 'amount', type: 'number', value: 10000, w: 90 }],
  })] : []),
];

const atmActs = {
  deposit(g, s, a, inp) {
    const fee = g.econ.deposit(s.p, Number(inp?.amount));
    return `Đã gửi ${vnd(inp.amount)} (phí ${vnd(fee)})`;
  },
  withdraw(g, s, a, inp) {
    const fee = g.econ.withdraw(s.p, Number(inp?.amount));
    return `Đã rút ${vnd(inp.amount)} (phí ${vnd(fee)})`;
  },
  transfer(g, s, a, inp) {
    return g.bankTransfer(s, inp?.to, Number(inp?.amount), 0);
  },
};

function promoteOption(g, s) {
  const p = s.p;
  const cls = CLASSES[p.cls];
  const next = PROMOTION[p.rank + 1];
  if (!next) return opt(`🏆 Đã đạt cấp cao nhất: ${cls.ranks[p.rank]}`, 'noop', {}, { disabled: true });
  return opt(`⬆️ Thăng tiến → ${cls.ranks[p.rank + 1]} (cần ${cls.statName} ${next.stat}, ngân hàng ${vnd(next.bank)})`, 'promote');
}

function promote(g, s) {
  const p = s.p;
  const cls = CLASSES[p.cls];
  const next = PROMOTION[p.rank + 1];
  if (!next) throw new EconError('Đã ở cấp cao nhất');
  if (p.stats[cls.statKey] < next.stat) throw new EconError(`Cần ${cls.statName} ≥ ${next.stat}`);
  if (p.bank < next.bank) throw new EconError(`Cần số dư ngân hàng ≥ ${vnd(next.bank)}`);
  p.rank++;
  g.news(`🎉 Chúc mừng ${p.name} đã thăng tiến lên "${cls.ranks[p.rank]}"!`);
  return `Bạn đã trở thành ${cls.ranks[p.rank]}!`;
}

const TITLES = [
  { id: 'nguoi_tot', name: 'Người Tốt Việc Tốt', cost: 50 },
  { id: 'hiep_si', name: 'Hiệp Sĩ Đường Phố', cost: 150 },
  { id: 'tinh_lang', name: 'Tình Làng Nghĩa Xóm', cost: 300 },
];

export const DIALOGS = {
  // ---------------------------------------------------------------- Khu 3
  school: {
    open(g, s) {
      const p = s.p;
      const isSv = p.cls === 'sv';
      return {
        title: '🏫 Giảng đường',
        text: isSv
          ? `Điểm danh: 07:00–11:00. Hôm nay: ${p.daily.attended ? '✅ đã điểm danh' : '❌ chưa điểm danh'}.\nĐiểm danh: ${p.stats.attendance} · Đủ điểm có thể thăng tiến lên Thực tập sinh và nộp CV vào TechCorp.`
          : 'Giảng đường dành cho Sinh viên. Bạn có thể ghé thăm trường cũ.',
        options: [
          ...(isSv ? [
            opt('📋 Điểm danh (+ tiền hỗ trợ SV)', 'attend'),
            opt('📚 Ôn thi / làm đồ án (1 giờ)', 'study'),
            promoteOption(g, s),
          ] : []),
          // Khoa hoc ky nang (G10): mo cho moi tang lop
          ...Object.entries(EXAMS).map(([id, e]) => (p.certs?.[id]
            ? opt(`${e.icon} ${e.name} — ✅ đã có`, 'exam', { id }, { disabled: true })
            : opt(`${e.icon} Thi ${e.name} (lệ phí ${vnd(e.fee)} · đúng ${e.pass}/${e.count} câu là đậu)`, 'exam', { id }))),
        ],
      };
    },
    acts: {
      exam(g, s, a) {
        g.jobs.start(s, `exam:${a.id}`);
        return false;
      },
      attend(g, s) {
        const p = s.p;
        if (p.cls !== 'sv') throw new EconError('Chỉ dành cho sinh viên');
        if (p.daily.attended) throw new EconError('Hôm nay đã điểm danh rồi');
        const h = hour(g);
        if (h < 7 || h >= 11) throw new EconError('Ngoài giờ điểm danh (07:00–11:00)');
        p.daily.attended = true;
        addStat(p, 'attendance', 3, 999);
        addStat(p, 'stress', 5);
        const support = 25000 * (1 + p.rank * 0.5);
        g.econ.grant(p, support, 'cash', 'sv_support');
        g.questProgress(s, 'attend', 1);
        return `Điểm danh thành công! +3 điểm danh, nhận ${vnd(support)} hỗ trợ.`;
      },
      study(g, s) {
        const p = s.p;
        if (p.stats.stress >= 90) throw new EconError('Căng thẳng quá, không học nổi! Đi uống trà đá đi.');
        needStamina(s, 15);
        cooldown(g, s, 'study', 60);
        addStat(p, 'stamina', -15);
        addStat(p, 'stress', 10);
        addStat(p, 'attendance', 2, 999);
        return 'Bạn đã ôn bài chăm chỉ. +2 điểm danh';
      },
      promote,
    },
  },

  tro: {
    open(g, s) {
      const p = s.p;
      return {
        title: '🏠 Nhà trọ sinh viên',
        text: p.renting
          ? `Bạn đang thuê phòng 15m² gác lửng (${vnd(ECON.rentPerDay)}/ngày + tiền điện ${vnd(g.home.dailyPower(p))}/ngày, tự trừ ngân hàng lúc 00:00).\nVào phòng để ngủ, xem TV, sắp xếp nội thất.`
          : `Phòng trọ ${vnd(ECON.rentPerDay)}/ngày (+ tiền điện theo đồ dùng). Có sẵn nệm và quạt — vào ngủ, trang trí theo ý thích.`,
        options: [
          ...(p.renting ? [opt('🚪 Vào phòng', 'enter')] : []),
          p.renting ? opt('Trả phòng (đồ đạc về lại túi)', 'unrent') : opt(`Thuê phòng (${vnd(ECON.rentPerDay)}/ngày)`, 'rent'),
          ...(p.renting ? [] : [opt('🪑 Ngồi nghỉ ở bậc thềm', 'rest')]),
          ...(p.renting ? [jobOption(g, s, 'it')] : []),
        ],
      };
    },
    acts: {
      job: jobAct,
      rent(g, s) {
        if (homeOf(s.p, g.day) === 'apartment') throw new EconError('Bạn đang ở chung cư rồi — trả căn hộ trước nếu muốn về trọ');
        g.econ.pay(s.p, ECON.rentPerDay, 'bank', 'rent_first_day');
        s.p.renting = true;
        g.home.furnishStarter(s.p);
        return 'Đã thuê phòng! Ngày đầu đã trả. Bấm "Vào phòng" để nghỉ ngơi.';
      },
      unrent(g, s) {
        s.p.renting = false;
        if (s.p.home?.room !== 'apartment') g.home.vacate(s.p);
        return 'Đã trả phòng, đồ đạc đã về lại túi.';
      },
      enter(g, s) {
        g.home.enter(s, 'tro');
        return false;
      },
      rest(g, s) {
        if (s.p.renting) throw new EconError('Vào phòng mà ngủ cho ngon!');
        cooldown(g, s, 'rest', 30);
        addStat(s.p, 'stamina', 15);
        addStat(s.p, 'stress', -10);
        return 'Nghỉ một chút cho đỡ mệt.';
      },
    },
  },

  // Chung cu (G20): thue tra truoc 7 ngay hoac mua dut; chi o 1 noi, chuyen nha mang theo noi that
  apartment: {
    open(g, s) {
      const p = s.p;
      const a = p.apartment;
      const mine = homeOf(p, g.day) === 'apartment';
      const status = a?.owned ? '🔑 Căn hộ của bạn (đã mua) — chỉ trả tiền điện.'
        : mine ? `Đang thuê tới hết ngày ${a.until} (hôm nay ngày ${g.day}). Hết hạn không gia hạn thì phải trả phòng.`
          : `Căn hộ 45m², rộng gấp đôi phòng trọ (đặt tới 25 món nội thất).`;
      return {
        title: '🏢 Chung Cư Phố Thị',
        text: `${status}\nThuê ${vnd(APARTMENT.rent)}/${APARTMENT.days} ngày (trả trước bằng thẻ) hoặc mua đứt ${vnd(APARTMENT.price)}. Tiền điện trừ hằng ngày.${p.renting ? '\nĐang thuê trọ: chuyển sang đây thì thôi thuê trọ, đồ đạc mang theo.' : ''}`,
        options: [
          ...(mine ? [opt('🚪 Vào nhà', 'enter'), jobOption(g, s, 'it')] : []),
          ...(a?.owned ? [] : [
            opt(mine ? `📅 Gia hạn ${APARTMENT.days} ngày (${vnd(APARTMENT.rent)})` : `📝 Thuê ${APARTMENT.days} ngày (${vnd(APARTMENT.rent)})`, 'rent'),
            opt(`🔑 Mua đứt căn hộ (${vnd(APARTMENT.price)})`, 'buy'),
          ]),
          ...(mine && !a?.owned ? [opt('Trả căn hộ (đồ đạc về lại túi)', 'leave')] : []),
        ],
      };
    },
    acts: {
      job: jobAct,
      enter(g, s) {
        g.home.enter(s, 'apartment');
        return false;
      },
      rent: (g, s) => g.home.rentApartment(s),
      buy: (g, s) => g.home.buyApartment(s),
      leave: (g, s) => g.home.leaveApartment(s),
    },
  },

  net: {
    open(g, s) {
      const n = s.p.counters.net || 0;
      return {
        title: '🖥️ Quán Net Cỏ 24/7',
        text: `Cày game giả lập 8-bit. Đã cày: ${n} lượt. Đạt 10 lượt nhận danh hiệu "Thần Net Cỏ".`,
        options: [opt('🎮 Cày game 1 giờ (5.000đ)', 'play')],
      };
    },
    acts: {
      play(g, s) {
        const p = s.p;
        needStamina(s, 5);
        cooldown(g, s, 'net', 20);
        g.econ.pay(p, 5000, 'cash', 'net');
        addStat(p, 'stress', -15);
        addStat(p, 'stamina', -5);
        p.counters.net = (p.counters.net || 0) + 1;
        if (p.counters.net === 10) {
          p.titles.push('Thần Net Cỏ');
          p.title = 'Thần Net Cỏ';
          g.news(`👾 ${p.name} vừa leo rank máy chủ ảo và nhận danh hiệu "Thần Net Cỏ"!`);
        }
        const rank = 1 + Math.floor(Math.random() * 100);
        return `Bạn leo hạng ${rank} trên máy chủ ảo. Stress giảm!`;
      },
    },
  },

  // ---------------------------------------------------------------- Khu 1
  veso: {
    open(g, s) {
      const mine = s.p.lotto.filter((t) => t.day === g.day).map((t) => t.num).join(', ') || 'chưa có';
      return {
        title: '🎫 Ông Lão Bán Vé Số',
        text: `"Mua giùm ông tờ vé số đi con!"\nXổ lúc 18:00 mỗi ngày. Trúng 3 số: 2.000.000đ · 2 số cuối: 100.000đ · số cuối: 15.000đ.\nVé hôm nay của bạn: ${mine}`,
        options: [opt(`Mua 1 tờ (${vnd(ECON.lotteryPrice)})`, 'buy')],
      };
    },
    acts: {
      buy(g, s) {
        if (hour(g) >= 18) throw new EconError('Đã qua giờ xổ, mai mua nhé con.');
        if (s.p.lotto.filter((t) => t.day === g.day).length >= 5) throw new EconError('Mỗi ngày tối đa 5 tờ.');
        g.econ.pay(s.p, ECON.lotteryPrice, 'cash', 'lottery');
        const num = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        s.p.lotto.push({ day: g.day, num });
        return `Bạn mua vé số ${num}. Chúc may mắn!`;
      },
    },
  },

  tutor: {
    open(g, s) {
      const has = s.p.certs?.tutor;
      return {
        title: '📚 Nhà học sinh',
        text: has
          ? 'Phụ huynh: "Cháu đang chờ thầy/cô đó! Kèm cháu toán, tiếng Việt với tiếng Anh nha."\nTrả lời đúng câu hỏi của học sinh để được trả công.'
          : `Phụ huynh: "Nhà tôi chỉ nhận gia sư có ${EXAMS.tutor.name}. Thi ở Giảng đường (Khu 3) nhé!"`,
        options: [jobOption(g, s, 'tutor')],
      };
    },
    acts: { job: jobAct },
  },

  buudien: {
    open(g, s) {
      const p = s.p;
      const items = p.inv.filter((it) => !Object.values(p.equip).includes(it.uid));
      return {
        title: '📮 Bưu Điện Thành Phố',
        text: `Bưu tá: "Gửi thư, bưu phẩm cho bạn bè, phí ${vnd(ECON.mailFee)}."\nHộp thư của bạn: ${p.mail.length} thư. Danh Vọng: ${p.social} điểm.`,
        options: [
          opt(`📬 Nhận thư & bưu phẩm (${p.mail.length})`, 'collect', {}, { disabled: !p.mail.length }),
          opt('✉️ Gửi thư', 'send', {}, {
            inputs: [
              { name: 'to', type: 'text', ph: 'Người nhận', w: 100 },
              { name: 'text', type: 'text', ph: 'Lời nhắn', w: 160 },
              { name: 'cash', type: 'number', ph: 'Kèm tiền', value: 0, w: 80 },
              { name: 'uid', type: 'select', options: [{ v: '', l: '(không gửi đồ)' },
                ...items.map((it) => ({ v: it.uid, l: `${ITEMS[it.id].icon} ${ITEMS[it.id].name} ×${it.qty}` }))] },
            ],
          }),
          opt(`📶 Mua gói cước 4G +30 tin (${vnd(10000)})`, 'data'),
          jobOption(g, s, 'ship'),
          ...TITLES.filter((t) => !p.titles.includes(t.name)).map((t) =>
            opt(`🏅 Đổi danh hiệu "${t.name}" (${t.cost} Danh Vọng)`, 'title', { id: t.id }, { disabled: p.social < t.cost })),
          opt('📰 Bảng tin thành phố', 'newsboard'),
        ],
      };
    },
    acts: {
      job: jobAct,
      collect(g, s) {
        const p = s.p;
        let n = 0;
        for (const m of p.mail.splice(0)) {
          if (m.cash) p.cash += m.cash;
          if (m.stack) g.econ.putStack(p, m.stack);
          n++;
          g.toast(s, `✉️ Thư từ ${m.from}: "${m.text || '...'}"${m.cash ? ` + ${vnd(m.cash)}` : ''}${m.stack ? ` + ${ITEMS[m.stack.id].name} ×${m.stack.qty}` : ''}`, 'info');
        }
        g.db.markDirty();
        return `Đã nhận ${n} thư.`;
      },
      send(g, s, a, inp) {
        return g.sendMail(s, inp || {});
      },
      data(g, s) {
        g.econ.pay(s.p, 10000, 'cash', 'data_pack');
        s.p.data += 30;
        return 'Đã nạp 30 tin nhắn 4G.';
      },
      title(g, s, a) {
        const t = TITLES.find((x) => x.id === a.id);
        if (!t) throw new EconError('Danh hiệu không tồn tại');
        if (s.p.social < t.cost) throw new EconError('Không đủ Danh Vọng');
        s.p.social -= t.cost;
        s.p.titles.push(t.name);
        s.p.title = t.name;
        return `Bạn nhận danh hiệu "${t.name}"!`;
      },
      newsboard(g, s) {
        g.pushDialog(s, { title: '📰 Bảng tin thành phố', text: g.newsLog.slice(-12).reverse().join('\n') || 'Chưa có tin.', options: [] });
        return false;
      },
    },
  },

  cafe: {
    open: (g, s) => ({
      title: '☕ Cà Phê Vỉa Hè',
      text: 'Ghế nhựa, trà đá, cà phê phin. Nơi tụ tập tán gẫu của cả phố.',
      options: [...cafeShop.options(g, s), opt('💬 Ngồi tán gẫu (giảm stress)', 'chill')],
    }),
    acts: {
      buy: cafeShop.buy,
      chill(g, s) {
        cooldown(g, s, 'chill', 30);
        addStat(s.p, 'stress', -6);
        g.chatNear(s, '*kéo ghế nhựa ngồi xuống tán gẫu*');
        return 'Ngồi tán gẫu một lúc, thấy nhẹ người.';
      },
    },
  },

  comtam: {
    open: (g, s) => ({
      title: '🍛 Quán Cơm Tấm Sài Gòn',
      text: '"Cơm tấm sườn bì chả nóng hổi đây! Đông khách quá, phụ cô bưng mâm một ca nha con."\nĂn no bụng để có sức đi làm.',
      options: [...comtamShop.options(g, s), jobOption(g, s, 'waiter')],
    }),
    acts: { buy: comtamShop.buy, job: jobAct },
  },

  trasua: {
    open: (g, s) => ({
      title: '🧋 Tiệm Trà Sữa Mây',
      text: '"Trà sữa trân châu đường đen mới về! Cần người pha chế part-time, làm không em?"',
      options: [...trasuaShop.options(g, s), jobOption(g, s, 'milktea')],
    }),
    acts: { buy: trasuaShop.buy, job: jobAct },
  },

  banhmi: {
    open: (g, s) => ({
      title: '🥖 Bà Cụ Bán Bánh Mì',
      text: '"Bánh mì nóng giòn đây con! Phụ bà bán một lát bà trả công nha."',
      options: [...banhmiShop.options(g, s), opt('🧑‍🍳 Phụ bán bánh mì (part-time, +15.000đ)', 'work')],
    }),
    acts: {
      buy: banhmiShop.buy,
      work(g, s) {
        needStamina(s, 12);
        cooldown(g, s, 'parttime', 45);
        addStat(s.p, 'stamina', -12);
        addStat(s.p, 'stress', 4);
        g.econ.grant(s.p, 15000, 'cash', 'parttime');
        return 'Bà cụ trả công 15.000đ. "Cảm ơn con nhiều!"';
      },
    },
  },

  bangdia: {
    open: (g, s) => ({
      title: '📼 Tiệm Băng Đĩa Cũ',
      text: 'Băng cassette, VCD đời cũ cho dân sưu tầm.',
      options: [
        opt(`📼 Mua băng cassette (${vnd(8000)})`, 'buy'),
        opt(`Bán lại băng cũ (${vnd(4000)})`, 'sell', {}, { disabled: g.econ.count(s.p, 'bang_cassette') === 0 }),
      ],
    }),
    acts: {
      buy(g, s) {
        g.econ.buyFromNpc(s.p, 'bang_cassette', 1, 8000);
        return 'Mua được một cuộn băng cũ.';
      },
      sell(g, s) {
        g.econ.sellToNpc(s.p, 'bang_cassette', 1, 4000);
        return 'Đã bán lại.';
      },
    },
  },

  barber: {
    open: () => ({
      title: '💈 Ông Thợ Cắt Tóc',
      text: 'Đổi kiểu tóc mới tăng Độ Thu Hút trong 1 ngày.',
      options: [opt('✂️ Cắt tóc thời thượng (30.000đ) · +10 Thu Hút', 'cut'), opt('🪒 Cạo râu (10.000đ) · +3 Thu Hút', 'shave')],
    }),
    acts: {
      cut(g, s) {
        g.econ.pay(s.p, 30000, 'cash', 'haircut');
        g.addBuff(s.p, 'haircut', 'Tóc mới', { charisma: 10 }, 1440);
        return 'Kiểu tóc mới bảnh bao! +10 Thu Hút (1 ngày)';
      },
      shave(g, s) {
        g.econ.pay(s.p, 10000, 'cash', 'shave');
        g.addBuff(s.p, 'shave', 'Cạo râu', { charisma: 3 }, 1440);
        return 'Mặt mũi sáng sủa! +3 Thu Hút';
      },
    },
  },

  cho: {
    open: (g, s) => ({
      title: '🧺 Tạp Hóa Cô Ba (Nguyên liệu)',
      text: `🍳 Đồ nấu ăn ở nhà (cần thuê phòng trọ có bếp):\n${s.p.cls === 'tt'
        ? '🧺 Nguyên liệu bánh mì / trà đá / nước mía — chế biến ở sạp trong Chợ Sạp Hàng Hóa (tab Sạp của tôi).'
        : '🧺 Nguyên liệu chế biến để bày bán ở Chợ — ai cũng mua được.'}`,
      options: [...kitchenShop.options(g, s), ...choShop.options(g, s), ...(s.p.cls === 'tt' ? [promoteOption(g, s)] : [])],
    }),
    acts: {
      buy: (g, s, a, inp) => (ITEMS[a.id]?.type === 'ingredient' && a.id.startsWith('nl_') || a.id === 'sach_cong_thuc'
        ? kitchenShop.buy(g, s, a, inp) : choShop.buy(g, s, a, inp)),
      promote,
    },
  },

  mechanic: {
    open(g, s) {
      const p = s.p;
      const worn = p.inv.filter((it) => ITEMS[it.id].type === 'equip' && it.dur < 100);
      const repairCost = worn.reduce((sum, it) => sum + (100 - it.dur) * (it.id.startsWith('xe') ? 400 : 100), 0);
      const equips = p.inv.filter((it) => ITEMS[it.id].type === 'equip');
      return {
        title: '🔧 Chú Sửa Xe & May Vá',
        text: `Sửa xe, vá đồ, cường hóa trang bị. Bạn có ${g.econ.count(p, 'linh_kien')} ⚙️ linh kiện.\nCường hóa thất bại chỉ giảm cấp, không vỡ đồ. Cấp +5 trở lên mở hiệu ứng hào quang.`,
        options: [
          opt(`🛠️ Sửa/vá tất cả đồ hỏng (${vnd(repairCost)})`, 'repair', {}, { disabled: !repairCost }),
          opt(`⚙️ Mua linh kiện (${vnd(9000)})`, 'buyparts'),
          ...equips.map((it) => {
            const c = g.enhanceCost(it);
            return opt(`✨ Cường hóa ${ITEMS[it.id].icon} ${ITEMS[it.id].name} +${it.lvl} → +${it.lvl + 1} (${c.parts}⚙️ + ${vnd(c.money)}, ${Math.round(c.rate * 100)}%)`,
              'enhance', { uid: it.uid }, { disabled: it.lvl >= 10 });
          }),
        ],
      };
    },
    acts: {
      repair(g, s) {
        const worn = s.p.inv.filter((it) => ITEMS[it.id].type === 'equip' && it.dur < 100);
        const cost = worn.reduce((sum, it) => sum + (100 - it.dur) * (it.id.startsWith('xe') ? 400 : 100), 0);
        if (!cost) throw new EconError('Không có gì cần sửa');
        g.econ.pay(s.p, cost, s.p.cash >= cost ? 'cash' : 'bank', 'repair');
        for (const it of worn) it.dur = 100;
        return 'Đồ đạc đã như mới!';
      },
      buyparts(g, s) {
        g.econ.buyFromNpc(s.p, 'linh_kien', 1, 9000);
        return 'Mua 1 linh kiện.';
      },
      enhance(g, s, a) {
        return g.enhance(s, a.uid);
      },
    },
  },

  // ---------------------------------------------------------------- Khu 2
  atm: {
    open: (g, s) => ({
      title: '🏧 Cây ATM',
      text: `Tiền mặt: ${vnd(s.p.cash)} · Tài khoản: ${vnd(s.p.bank)}\nPhí giao dịch ${ECON.atmFeeRate * 100}% (tối thiểu ${vnd(ECON.atmFeeMin)}). Tiền trong ngân hàng an toàn tuyệt đối và sinh lãi ${ECON.interestRate * 100}%/ngày.`,
      options: atmOptions(g, s),
    }),
    acts: atmActs,
  },

  bank: {
    open: (g, s) => ({
      title: '🏦 VietBank — Quầy giao dịch',
      text: `Tiền mặt: ${vnd(s.p.cash)} · Tài khoản: ${vnd(s.p.bank)}\nLãi suất ${ECON.interestRate * 100}%/ngày (tối đa ${vnd(ECON.interestCap)}), trả lúc 00:00.`,
      options: atmOptions(g, s, 'counter'),
    }),
    acts: atmActs,
  },

  office: {
    open(g, s) {
      const p = s.p;
      if (p.cls === 'sv') {
        return {
          title: '🏢 TechCorp Tower — Tuyển dụng',
          text: `Sinh viên đạt "Thực tập sinh" và điểm danh ≥ 60 có thể nộp CV để trở thành Nhân viên văn phòng.\nĐiểm danh hiện tại: ${p.stats.attendance}`,
          options: [opt('📄 Nộp CV', 'cv', {}, { disabled: p.rank < 1 || p.stats.attendance < 60 })],
        };
      }
      if (p.cls !== 'vp') return { title: '🏢 TechCorp Tower', text: 'Bảo vệ: "Anh/chị tìm ai ạ?"', options: [] };
      const d = p.daily;
      return {
        title: '🏢 TechCorp Tower — Chấm công',
        text: `Giờ vào làm: 07:30–09:00 (trễ tới 12:00 bị trừ KPI). Lương nhận lúc 17:00 vào tài khoản.\nHôm nay: ${d.checkin ? (d.late ? '⚠️ đi trễ' : '✅ đúng giờ') : '❌ chưa chấm công'} · Ca làm: ${d.worked || 0} · KPI: ${p.stats.kpi}`,
        options: [
          opt('🕘 Chấm công', 'checkin', {}, { disabled: d.checkin }),
          opt('💻 Làm việc 1 giờ (+KPI)', 'work', {}, { disabled: !d.checkin }),
          promoteOption(g, s),
        ],
      };
    },
    acts: {
      checkin(g, s) {
        const p = s.p;
        if (p.cls !== 'vp') throw new EconError('Bạn không phải nhân viên công ty');
        if (p.daily.checkin) throw new EconError('Đã chấm công hôm nay');
        const m = g.minute;
        if (m < 7 * 60 + 30 || m >= 12 * 60) throw new EconError('Ngoài giờ chấm công (07:30–12:00)');
        p.daily.checkin = true;
        p.daily.late = m >= 9 * 60;
        addStat(p, 'kpi', p.daily.late ? -2 : 3, 999);
        return p.daily.late ? 'Đi trễ! KPI -2. Lần sau đi sớm hơn nhé.' : 'Chấm công đúng giờ! KPI +3';
      },
      work(g, s) {
        const p = s.p;
        if (!p.daily.checkin) throw new EconError('Chưa chấm công');
        if (p.stats.stress >= 90) throw new EconError('Burnout rồi! Nghỉ ngơi đi đã.');
        const h = hour(g);
        if (h < 8 || h >= 18) throw new EconError('Ngoài giờ làm việc (08:00–18:00)');
        needStamina(s, 10);
        cooldown(g, s, 'work', 60);
        addStat(p, 'stamina', -10);
        addStat(p, 'stress', 8);
        addStat(p, 'kpi', 2, 999);
        p.daily.worked = (p.daily.worked || 0) + 1;
        return 'Hoàn thành task! KPI +2';
      },
      cv(g, s) {
        const p = s.p;
        if (p.cls !== 'sv' || p.rank < 1 || p.stats.attendance < 60) throw new EconError('Chưa đủ điều kiện');
        p.cls = 'vp';
        p.rank = 0;
        g.news(`🎓 ${p.name} đã tốt nghiệp và được TechCorp tuyển dụng!`);
        return 'Chúc mừng! Bạn đã trở thành Nhân viên văn phòng.';
      },
      promote,
    },
  },

  auction: {
    open: (g, s) => g.auction.dialog(s),
    acts: {
      bid: (g, s, a, inp) => g.auction.bid(s, Number(inp?.amount)),
      consign: (g, s, a, inp) => g.auction.consign(s, inp?.uid, Number(inp?.start)),
    },
  },

  showroom: {
    open: (g, s) => ({
      title: '🛵 Showroom Xe Máy',
      text: 'Xe giúp di chuyển nhanh hơn nhiều. Giao dịch lớn thanh toán bằng thẻ ngân hàng.\nTrời mưa ngập đường xe chỉ chạy 50% tốc độ và hao mòn nhanh.',
      options: showroomShop.options(g, s),
    }),
    acts: { buy: showroomShop.buy },
  },

  fashion: {
    open: (g, s) => ({
      title: '👗 Shop Thời Trang',
      text: 'Trang bị tăng Độ Thu Hút, tốc độ và giảm tiêu hao thể lực. Đồ ≥ 100.000đ thanh toán bằng thẻ.',
      options: [
        ...fashionShop.options(g, s),
        opt(`✨ Hào quang neon (${ITEMS.hao_quang.premium} 💎)`, 'premium', { id: 'hao_quang' }),
      ],
    }),
    acts: {
      buy: fashionShop.buy,
      premium(g, s, a) {
        const it = ITEMS[a.id];
        if (!it?.premium) throw new EconError('Không bán');
        if (s.p.diamonds < it.premium) throw new EconError('Không đủ Kim Cương');
        s.p.diamonds -= it.premium;
        g.econ.addItem(s.p, a.id, 1);
        g.econ.log('premium', s.p, { item: a.id, diamonds: it.premium });
        return `Đã mua ${it.name}!`;
      },
    },
  },

  // ---------------------------------------------------------------- Khu 4
  junk: {
    open: (g, s) => ({
      title: '♻️ Vựa Ve Chai Chú Tư',
      text: `Nhặt ve chai quanh bãi phế liệu (điểm lấp lánh) rồi mang tới đây bán.\nBạn có: ${g.econ.count(s.p, 've_chai')} 🥫 · ${g.econ.count(s.p, 'linh_kien')} ⚙️`,
      options: [
        opt(`Bán toàn bộ ve chai (${vnd(ITEMS.ve_chai.base)}/cái)`, 'sell', { id: 've_chai' }, { disabled: !g.econ.count(s.p, 've_chai') }),
        opt(`Bán toàn bộ linh kiện (${vnd(ITEMS.linh_kien.base)}/cái)`, 'sell', { id: 'linh_kien' }, { disabled: !g.econ.count(s.p, 'linh_kien') }),
      ],
    }),
    acts: {
      sell(g, s, a) {
        if (!['ve_chai', 'linh_kien'].includes(a.id)) throw new EconError('Vựa không thu mua món này');
        const n = g.econ.count(s.p, a.id);
        g.econ.sellToNpc(s.p, a.id, n, ITEMS[a.id].base);
        return `Bán ${n} món được ${vnd(n * ITEMS[a.id].base)}.`;
      },
    },
  },

  // ---------------------------------------------------------------- Dien thoai (UI portal)
  // Dien thoai (G58): man hinh chinh (luoi app) ve o client; moi app la mot hop thoai co `app`.
  // s.phoneApp nho app dang mo de sau mot thao tac (chuyen khoan...) hien lai dung app.
  phone: {
    open(g, s) {
      const app = PHONE_APPS[s.phoneApp] ? s.phoneApp : 'home';
      if (app === 'home') {
        const p = s.p;
        return { app, title: '📱 Điện thoại', text: `4G: ${p.data} tin · 💎 ${p.diamonds} · Danh Vọng ${p.social}`, options: [] };
      }
      return { app, ...PHONE_APPS[app](g, s) };
    },
    acts: {
      app(g, s, a) {
        s.phoneApp = PHONE_APPS[a.app] ? a.app : 'home';
      },
      back(g, s) {
        s.phoneApp = 'home';
      },
      transfer: (g, s, a, inp) => g.bankTransfer(s, inp?.to, Number(inp?.amount), ECON.appTransferFeeRate),
      data(g, s) {
        g.econ.pay(s.p, 10000, 'bank', 'data_pack_app');
        s.p.data += 30;
        return 'Đã nạp 30 tin 4G.';
      },
      job: jobAct,
      auction(g, s) {
        g.pushDialog(s, { ...g.auction.dialog(s), poi: 'auction', remote: true });
        return false;
      },
      marketview(g, s) {
        g.closeDialog(s);
        g.market.handle(s, { a: 'view' });
        return false;
      },
      promote,
    },
  },
};

const PHONE_APPS = {
  home: null,
  bank: (g, s) => ({
    title: '🏦 Ngân hàng số',
    text: `Tiền mặt: ${vnd(s.p.cash)}\nTài khoản: ${vnd(s.p.bank)}\nChuyển khoản qua app phí ${ECON.appTransferFeeRate * 100}% (miễn phí tại quầy VietBank).`,
    options: [
      opt('Chuyển khoản', 'transfer', {}, {
        inputs: [{ name: 'to', type: 'text', ph: 'Người nhận', w: 100 }, { name: 'amount', type: 'number', value: 10000, w: 80 }],
      }),
      opt(`📶 Nạp 4G +30 tin (${vnd(10000)})`, 'data'),
    ],
  }),
  jobs(g, s) {
    const rows = Object.entries(JOBS).map(([id, d]) => {
      const info = jobInfo(s.p, id);
      const xp = info.next ? `${info.xp}/${info.next} KN` : 'cấp tối đa';
      const lock = d.needCert && !s.p.certs?.[d.needCert] ? ` · 🔒 cần ${EXAMS[d.needCert].name}` : '';
      return `${d.icon} ${d.name} — Cấp ${info.lvl} (${xp})\n   📍 ${d.place} · lương ${vnd(d.pay[info.lvl - 1])}/ca${lock}`;
    });
    return {
      title: '💼 Việc Làm',
      text: `${rows.join('\n')}\n🥫 Nhặt ve chai — Ngoại ô (bán ở Vựa Ve Chai)\n\nSắp có: ${JOBS_SOON.join(' · ')}\nTới đúng nơi làm rồi bấm "Làm ca" (Phát tờ rơi làm ở đâu cũng được).`,
      options: Object.keys(JOBS).map((id) => jobOption(g, s, id)),
    };
  },
  quests(g, s) {
    g.ensureDaily(s.p);
    const d = s.p.daily;
    const rows = d.q.map((q) => {
      const def = QUESTS[q.id];
      const prog = def.key === 'earn' ? `${vnd(q.have)}/${vnd(def.need)}` : `${q.have}/${def.need}`;
      return `${q.done ? '✅' : '⬜'} ${def.name} (${prog}) · +${vnd(def.reward)}`;
    });
    return {
      title: '📜 Nhiệm vụ hôm nay',
      text: `${rows.join('\n')}\n\nXong cả 3: +${QUEST_BONUS.diamonds} 💎, +${QUEST_BONUS.social} Danh Vọng${d.qBonus ? ' (đã nhận)' : ''}.\n${CLASSES[s.p.cls].name} — ${CLASSES[s.p.cls].ranks[s.p.rank]}`,
      options: [promoteOption(g, s)],
    };
  },
  friends: (g) => ({
    title: '👥 Bạn bè đang online',
    text: [...g.sessions.values()].map((o) => `• ${o.p.name} (${CLASSES[o.p.cls].name}) — ${zoneAt(o.x).name}`).join('\n'),
    options: [],
  }),
  market: (g) => {
    const stalls = Object.values(g.market.stalls);
    const n = stalls.reduce((sum, st) => sum + st.listings.length, 0);
    return {
      title: '🛒 Chợ',
      text: `Chợ Sạp Hàng Hóa (Khu 1): ${stalls.length} sạp đang thuê, ${n} món đang bày bán.\nXem từ xa được, muốn mua thì tới chợ.`,
      options: [opt('🧺 Xem hàng ở Chợ', 'marketview'), opt('🔨 Đấu giá từ xa (20:00)', 'auction')],
    };
  },
};

export { addStat, RECIPES, SLOTS };
