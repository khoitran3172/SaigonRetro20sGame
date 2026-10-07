# Nhật ký phát triển — Hàng Rong (Phố Thị Online)

> Ghi lại từng chặng phát triển game: làm gì, vì sao, còn vướng gì. Mới nhất ở **dưới cùng**.
> Mỗi phiên làm việc thêm một mục mới (ngày · commit · tóm tắt · quyết định · việc còn lại).
> Tài liệu liên quan: [ROADMAP](ROADMAP.md) · [GAMEPLAY_V2](GAMEPLAY_V2.md) · [ASSET_STATUS](ASSET_STATUS.md) · [DEVELOPMENT](DEVELOPMENT.md)

## Tổng quan

| Ngày | Commit | Chặng |
|---|---|---|
| 2026-10-06 | `89ec3f4` | Vertical slice đầu tiên: MMO life-sim phố Sài Gòn |
| 2026-10-06 | `570ff02` | Lưu trữ PostgreSQL (Neon) |
| 2026-10-06 | `27da7ec` | Đặc tả asset + prompt tạo ảnh |
| 2026-10-06 | `833c21c` | Dựng lại game với art thật của người dùng |
| 2026-10-06 | `e8a932e` · `a3e1e41` | README quảng cáo, tách docs, file bàn giao CLAUDE.md, bản chơi online |
| 2026-10-06 | `1b91b67` | Thiết kế lại gameplay V2 (chờ duyệt) + trang copy prompt asset |
| 2026-10-07 | `cbd4d26` | Gameplay V2 đợt 1 theo art mới: UI kit, điện thoại, nghề + mini-game, túi đồ lưới |
| 2026-10-07 | `e7ce286` | Hộp thoại NPC tự đóng khi đi xa · nhật ký phát triển |
| 2026-10-07 | `83c182b` | README mới có ảnh chụp game, dẫn link sang nhật ký |
| 2026-10-07 | `977ec5b` · `29706c6` | Nhập 68 ảnh V2 lần 2: nhà ống, vựa ve chai, xe buýt & trạm, chân dung NPC, 60 icon, cắt sẵn nội thất / phòng / UI |
| 2026-10-07 | _(chưa commit)_ | Code theo art lần 2: nghề tờ rơi / shipper / gia sư + thi chứng chỉ, phòng trọ & nội thất, ngủ, nấu ăn, TTTM + Gacha |

---

## 2026-10-06 · `89ec3f4` — Vertical slice đầu tiên

**Mục tiêu:** từ GDD người dùng viết, dựng một bản chơi được để thử cảm giác "sống ở phố Sài Gòn".

**Đã làm (~6.200 dòng):**
- Server Node.js + WebSocket, client Phaser 3. Bản đồ ngang 6.800px, 4 khu: Làng Đại Học · Phố Ẩm Thực & Chợ Đêm · Trung Tâm Tài Chính · Ngoại Ô.
- 3 tầng lớp (Sinh viên / Nhân viên văn phòng / Tiểu thương), mỗi lớp một chỉ số riêng (Điểm danh / KPI / Uy tín) và 3 bậc thăng tiến.
- Kinh tế: tiền mặt (bị trộm được) vs ngân hàng (an toàn, có lãi), ATM có phí, lương 17:00, sổ cái giao dịch, mọi thao tác tiền/đồ nguyên tử (`server/economy.js`).
- Sạp P2P 3 cấp, ô quy hoạch, thuế 5%, khách NPC; chế biến bánh mì / trà đá / nước mía.
- NPC động: Cảnh sát tuần tra & phạt lấn chiếm, Ăn trộm nhắm người cầm nhiều tiền mặt, Giang hồ đòi bảo kê, Bưu tá.
- Ngày/đêm, mưa ngập, nắng gắt; chat gần theo cự ly, chat thế giới tốn cước 4G, Loa LED RGB; đấu giá 20:00.
- Server chặn tốc độ di chuyển (chống dịch chuyển), hội thoại do server dựng (client chỉ hiển thị).
- Art: cắt tạm từ các concept sheet cũ + ảnh vẽ bằng code (`client/src/textures.js`).

## 2026-10-06 · `570ff02` — PostgreSQL

- Có `DATABASE_URL` thì lưu Postgres (Neon), không có thì `data/db.json`.
- Game chạy trong bộ nhớ, ghi theo lô mỗi 5s (`server/pgdb.js`) → sập đột ngột mất tối đa 5s.
- Thêm test Postgres (chỉ chạy khi đặt `TEST_DATABASE_URL`).

## 2026-10-06 · `27da7ec` — Đặc tả asset

- `docs/ASSET_PROMPTS.md`: quy chuẩn tạo ảnh bằng AI — nền magenta `#FF00FF`, 1 ảnh = 1 hành động = 6 frame, không chữ, kèm prompt từng nhân vật / công trình / NPC / xe / icon.
- **Quyết định:** người dùng tự tạo art bằng AI; AI lập trình **không vẽ art bằng code** nữa, chỉ ghi lại phần thiếu.

## 2026-10-06 · `833c21c` — Dựng lại game với art thật

- Pipeline nhập ảnh từ `asset_new_by_Khoit/`: tách nền magenta, tách frame, chuẩn hóa chiều cao 86px, lật frame quay phải (`tools/import_new_art.py`, `tools/new_manifest.py`, `tools/contact_new.py`).
- Đưa vào game: `sv_male` đủ 6 dải, `sv_female` 5 dải, 8 công trình (biển hiệu để trống, game tự in chữ tiếng Việt), 10 NPC đang làm việc, 8 xe, sạp 3 cấp, 56 icon, ~27 props, ảnh nền đăng nhập.
- **Bài học:** AI hay vẽ nhân vật quay phải, hay dính watermark ✦ Gemini, hay thiếu frame → pipeline tự lật, tự bỏ đốm nhỏ, và ghi lỗi để người dùng tạo lại thay vì sửa tay.

## 2026-10-06 · `e8a932e` · `a3e1e41` — Tài liệu & bản online

- README chỉ để quảng cáo game; chi tiết kỹ thuật chuyển sang `docs/` (DEVELOPMENT, ROADMAP).
- Deploy Render + Neon: https://saigon-retro-20s.onrender.com/
- `CLAUDE.md` bàn giao để AI khác mở project là làm tiếp được; danh sách asset thiếu luôn kèm prompt.

## 2026-10-06 · `1b91b67` — Thiết kế gameplay V2 (chờ duyệt)

**Vì sao:** bản slice rộng nhưng nông (3 lớp, xe máy, giải trí…), người dùng muốn tập trung một vòng chơi sâu.

- Viết `GAMEPLAY_V2.md` (G1–G64), `ANIMATION_V2.md` (A1–A14), `INVENTORY_V2.md` (I1–I15). Người dùng duyệt theo mã.
- **Đã chốt:** 3 nhu cầu (G6), 3 nhiệm vụ/ngày (G7), hóa đơn cuối tuần (G8), mục tiêu dài hạn (G9), **bỏ toàn bộ xe máy** (G32), bỏ bày sạp vỉa hè → Chợ Sạp Hàng Hóa (G53), bỏ nghề Grab (G54).
- **Hướng V2:** một Sinh viên nam làm nhiều nghề bất kỳ lúc nào (mỗi ca một mini-game) → nấu ăn, ngủ, trang trí phòng → mua bán ở Chợ Sạp Hàng Hóa; nội thất 3 phân khúc + tiền điện; trang bị mua ở quầy + Gacha; chỉ xe buýt + taxi.
- `tools/asset_todo.py` sinh `docs/ASSET_TODO.md` + trang `docs/asset_todo.html` (nút Copy từng prompt, tự đánh dấu đã dùng). Thêm hướng dẫn Gem Gemini "Họa sĩ Hàng Rong" (`docs/GEMINI_GEM.md`).

## 2026-10-07 · `cbd4d26` — Gameplay V2 đợt 1 theo art mới

**Bối cảnh:** người dùng gửi 17 ảnh V2 (hết lượt tạo ảnh giữa chừng) và chốt nguyên tắc: **làm phần nào có art, phần chưa có thì tạm ẩn; nhân vật giữ art & UI cũ.**

**Asset** (`tools/ui_manifest.py`, nối vào `npm run assets`): khung giấy-gỗ + thanh tiêu đề + nút đóng, 8 ô túi (trống / chọn / khóa / 4 độ hiếm / ô nhanh), 6 tab, nút 4 trạng thái, tooltip, thanh nhanh, búp bê giấy, 8 icon HUD, khung điện thoại + 8 app, Quán Cơm Tấm, Tiệm Trà Sữa, mini-game IT / phục vụ / quầy trà sữa, bàn pha cà phê.

**Gameplay & giao diện:**
- **3 nhu cầu (G6):** thêm chỉ số *No bụng* giảm dần; đói thì hao năng lượng và tinh thần. HUD hiện No bụng / Năng lượng / Tinh thần có icon.
- **Nhiệm vụ ngày (G7):** bốc 3 nhiệm vụ mỗi ngày (làm ca, ăn uống, nhặt ve chai, chat…), xong cả 3 thưởng thêm 💎.
- **Nghề + mini-game (G11, G43):** cấp nghề 1–5, lương theo cấp × độ chính xác. Server sinh đề, client chơi, server tự chấm và giới hạn nhịp trả lời → không khai điểm được (`server/jobs.js`).
  - J1 IT (phòng trọ, cần thuê): nhớ rồi bấm lại thứ tự khối lệnh.
  - J2 Phục vụ (Quán Cơm Tấm): bưng đúng món ra đúng bàn trước khi khách bỏ đi.
  - J3 Trà sữa (Tiệm Trà Sữa): chọn ly → trà → topping → ép nắp theo phiếu order.
- **Túi đồ lưới (I1–I7):** 20 ô (+10 khi đeo balo), tab lọc, sắp xếp (server), chọn / bấm đúp, ô thông tin so sánh với món đang mặc, viền theo độ hiếm. **Thanh dùng nhanh** phím 1–5.
- **Búp bê giấy (I11, I12, I14):** 8 ô quanh hình nhân + bảng chỉ số.
- **Điện thoại (G58):** Việc Làm, Ngân hàng, Bản đồ (bấm địa điểm là tự đi tới), Chợ, Nhiệm vụ, Bạn bè, Cài đặt.
- Món ăn mới: cơm tấm sườn, cơm bì chả, canh, trứng ốp la, trà sữa. Dời Nhà trọ & Net Cỏ sang trái để chừa chỗ Tiệm Trà Sữa.

**Tạm ẩn (chưa có art):** nghề J4–J8, app Taxi, tab Nội thất, icon nhà / ngủ / tiền điện.

**Lỗi art ghi nhận:** `job_milktea_items.png` gửi nhầm ảnh quầy (đang dùng làm quầy); watermark ✦ trên 2 ảnh nền kín; bàn cà phê vẽ nhìn nghiêng nên chưa làm được mini-game J4.

**Kiểm thử:** 7/7 test (thêm test nghề & nhiệm vụ: chấm đúng/sai, chặn trả lời quá nhanh, IT cần thuê phòng); chơi thử trong trình duyệt cả 3 mini-game, túi đồ, trang bị, điện thoại.

## 2026-10-07 · Hộp thoại NPC tự đóng

- Panel NPC / cửa hàng / sạp chỉ hiện khi bấm vào (nhân vật tự đi tới rồi mở), **tự đóng khi đi xa quá 200px** (rộng hơn tầm thao tác 170px của server để không chớp tắt). Điện thoại, đấu giá từ xa, Giang hồ, bảng nhiệm vụ không bị đóng.
- Thêm nhật ký phát triển này.

## 2026-10-07 · README mới

- Làm lại README cho đẹp: nút "Chơi ngay", huy hiệu, icon pixel của chính game làm tiêu đề mục, ảnh chụp thật (phố, quán cơm tấm, 3 mini-game, túi đồ, trang bị, điện thoại), bảng phím tắt, mục **Nhật ký phát triển** dẫn sang file này.
- Ảnh chụp lưu ở `docs/screenshots/` (chụp bằng Playwright 1280×720, ẩn khung chat/thông báo).

## 2026-10-07 · Nhập 68 ảnh V2 lần 2

Người dùng tải 68 ảnh lên thẳng GitHub (`977ec5b`, thư mục `asset_new_by_Khoit/`).

- **Pipeline mới `tools/v2_manifest.py`** (gọi từ `npm run assets`): tự tách blob theo nền magenta, xếp trên→dưới, trái→phải rồi gán tên; gộp blob chồng nhau theo trục x (máy hút khói + bếp, quầng đèn + đèn); bỏ người mẫu tham chiếu. Sai số phần tách được → dừng build và báo tên file.
- **Vào game ngay:** vựa ve chai thay ảnh tạm; 7 nhà ống thay ảnh tạm, đặt lùi sau công trình nên khe hẹp nào cũng thấy nhà (phố dày hơn hẳn); xe buýt mới không watermark; 4 trạm buýt + 2 điểm đón taxi (trang trí); chân dung NPC trong hộp thoại (6 NPC).
- **Cắt sẵn chờ tính năng** (`client/assets/v2/`, không nạp lúc vào game): 60 nội thất, 4 nền phòng, 3 tòa nhà, gacha, sạp chợ, nhân viên TTTM, đồ nghề J5/J6/J8, toàn bộ UI trường / ATM / bưu điện / nấu ăn / gacha / TTTM / chợ. 60 icon vật phẩm vào `assets/icons/` (chưa có vật phẩm tương ứng).
- `asset_todo.py`: bỏ ảnh đã nhận, thêm ảnh xin vẽ lại → còn **51 ảnh V2** (trước 132).

**Quyết định:** chỉ gắn những art thay thẳng ảnh tạm / trang trí; tính năng mới (nấu ăn, nội thất, TTTM, gacha, chợ, buýt) chưa code — chờ người dùng chọn thứ tự.

**Lỗi art ghi nhận:** chân dung chủ quán cơm tấm & trà sữa vẽ sai người; nhân viên quầy Nội thất áo cam (cần nâu); ✦ trên 4 ảnh phòng; chữ & người mẫu trong vài sheet (pipeline tự bỏ). Chi tiết: ASSET_STATUS.

**Kiểm thử:** 7 test logic pass (`node --test server/tests/*.js`; `npm test` lỗi tham số thư mục trên Node 24 — có từ trước); chạy thử trong trình duyệt: phố có nhà ống, vựa ve chai, trạm buýt, hộp thoại có chân dung.


## 2026-10-07 · Code theo art lần 2 — nghề, nhà, nấu ăn, TTTM

**Người dùng chốt:** thứ tự *mini-game các nghề → nhà → nấu ăn → TTTM*; G1/G2 giữ nguyên chưa đụng; gỡ bày sạp vỉa hè khi Chợ xong (G53); Gacha theo thiết kế G64. TTTM chỉ có 2 ảnh nhân viên → dùng chung cho cả 5 quầy; đồ thiếu art để "chưa mở bán".

**Nghề (`server/jobs.js`, `client/src/jobs.js`):**
- **J5 Phát tờ rơi** — làm ở đâu cũng được; 16 người đi đường (dùng sprite các nhân vật sẵn có) chỉ người làm ca thấy, đi qua lại theo hàm `walkerPos` dùng chung server/client; server kiểm tra người chơi đứng gần (150px) mới tính. Bấm vào người hoặc phím E.
- **J6 Shipper** — nhận ở Bưu Điện, cần điện thoại; 3 đơn/ca, mỗi đơn hạn = quãng đường ÷ tốc độ đi bộ × 1,7 + 12s; tới nơi (140px) server tự tính giao xong, trễ hạn thì hủy đơn. Lương theo quãng đường. HUD nhỏ + mốc chỉ đường + mũi tên mép màn hình + bản đồ thành phố (4 cột = 4 khu).
- **J8 Gia sư** — Nhà học sinh (Khu 2, x=4735), cần **Chứng chỉ Gia sư**: thi ở Giảng đường (50.000đ, đúng 7/10). Câu hỏi toán / trái nghĩa / tiếng Anh; **đáp án không gửi xuống client**, server chấm từng câu, chặn trả lời nhanh hơn 1,2s.
- Nghề trên phố không khóa di chuyển (`ui.locked` chỉ khóa khi mở màn riêng / phòng / TTTM).

**Nhà (`server/home.js`, `client/src/home.js`):** thuê phòng → phòng có sẵn nệm, quạt, bếp gas mini (người thuê từ trước nhận bù khi vào phòng). Chế độ Sắp xếp: kéo thả, lật, cất vào túi, đặt đồ từ khay; đồ treo tường (máy lạnh) chỉ đặt trên tường. Đồ ở xa vẽ nhỏ hơn. Ngủ 1/2/4/8 giờ game: hồi năng lượng = 12/giờ × hệ số giường × (1 + thoải mái) × nóng không quạt 0,6. Xem TV giảm căng thẳng (hồi chiêu 1 giờ). Tiền điện cộng vào tiền trọ lúc 00:00; không đủ tiền → trả phòng, đồ về túi. Máy tính / laptop cộng giờ ca IT.

**Nấu ăn (`server/cook.js`, `client/src/cook.js`):** 12 nguyên liệu bán ở Tạp hóa + Siêu thị; 12 món (5 biết sẵn, 7 món cần *Sách công thức*), món kho / canh cần bếp gas đôi, món cơm cần nồi cơm điện. Mini-game: bấm bát theo thứ tự trên phiếu đúng lúc kim lửa ở vùng xanh; server tính lại vị trí kim theo thời điểm bấm → 1–3 sao (món 2–3 sao hồi nhiều hơn, bán giá cao hơn). Bỏ ngang = hỏng món, mất nguyên liệu.

**TTTM (`server/mall.js`, `client/src/mall.js`):** tòa mới ở Khu 2 x=5800 (Khu 2 nới tới 6020). Sảnh có 5 quầy, biển hiệu in chữ, nhân viên hoạt ảnh. Nội thất xếp 3 phân khúc cạnh nhau để so sánh. Đồ ≥100.000đ trả bằng thẻ. Thời trang bán đồ Thường/Tốt; Gacha 30.000đ tiền mặt, tỉ lệ 60/28/10/2, bảo hiểm 40 lượt Hiếm / 100 lượt Giới hạn, đồ trùng → Mảnh lấp lánh, 30 mảnh đổi 1 món Hiếm; quay ra Hiếm/Giới hạn được loan tin.

**Kiểm thử:** 12 test logic pass (thêm 5 test: gia sư + chứng chỉ, tờ rơi + shipper, nhà trọ, nấu ăn, TTTM + gacha). Chạy thử trong trình duyệt với nhân vật test: cả 3 nghề với server thật, phòng / ngủ / sắp xếp, nấu Trứng chiên ⭐⭐⭐, sảnh & quầy TTTM, màn gacha + hoạt ảnh.

**Quyết định / đơn giản hóa:** tiền trọ vẫn theo ngày (G8 hóa đơn tuần chưa làm); đồ TTTM vào thẳng túi (chưa giao sau 1 giờ); chưa có chung cư.

**Dọn bản đồ (người dùng yêu cầu, trước khi làm Chợ):** gỡ trạm buýt / điểm taxi, người lái xe máy trong giao thông (còn taxi + xe buýt), bàn bán + cô bán cà phê vỉa hè, bàn trà đá vỉa hè, anh chủ quán net ngồi, cô Ba tạp hóa ngồi bán. Chỗ tương tác (hộp thoại) của các quán vẫn giữ.

---

## Việc còn mở

- **Chờ art** (51 ảnh, prompt trong `docs/asset_todo.html`): animation V2 của `sv_male`, Cảnh sát / Ăn trộm / người đi đường, NPC chủ quán cơm tấm & trà sữa, J3 ly/topping, J4 cà phê, 2 chân dung vẽ lại, 4 nội thất, 4 nhân viên TTTM, nhà ống số 5.
- **Code chờ làm (đã có art):** Chợ Sạp Hàng Hóa (G24, G55–G57; xong thì gỡ sạp vỉa hè G53), tuyến buýt (G29–G30), chung cư (G20), giao diện ATM / bưu điện / hợp đồng + hóa đơn tuần.
- **Code chưa làm dù đã chốt:** gỡ xe máy (G32), hóa đơn tuần trọ + học phí (G8), chặn nhặt/mua khi túi đầy (I1).
- `npm test` cần sửa script thành `node --test server/tests/*.js` cho Node 24.
- **Chờ duyệt:** các mã G / A / I còn mở trong tài liệu V2 (G1 chỉ Sinh viên nam, G2 ẩn giải trí…).
