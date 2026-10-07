# CLAUDE.md — Bàn giao dự án Hàng Rong (Phố Thị Online)

File này để AI (Claude Code hoặc trợ lý khác) mở project là tiếp tục làm việc được ngay. **Đọc hết trước khi làm.**

## 1. Dự án là gì

Game web **2D top-down MMORPG / Life-Sim đô thị Sài Gòn**, pixel art. 3 tầng lớp: Sinh viên, Nhân viên văn phòng, Tiểu thương. Kinh tế do người chơi làm chủ (bày sạp P2P, đấu giá), NPC động (Cảnh sát, Ăn trộm, Giang hồ, Bưu tá), ngày/đêm, thời tiết, chat gần/thế giới/Loa LED.

- Repo: https://github.com/khoitran3172/SaigonRetro20sGame (nhánh `main`)
- Trạng thái: **vertical slice chơi được (Alpha)**. Đối chiếu GDD: `docs/ROADMAP.md`.
- GDD gốc do người dùng viết trong hội thoại đầu tiên; nội dung chính đã phản ánh vào `docs/ROADMAP.md` và `shared/config.js`.

## 2. Làm việc với người dùng (QUAN TRỌNG)

- Người dùng nói **tiếng Việt** → luôn trả lời tiếng Việt.
- **KHÔNG tự vẽ art mới.** Người dùng tự tạo ảnh bằng AI. Thiếu asset thì ghi vào `docs/ASSET_STATUS.md` và báo lại, không vẽ thay bằng code. (Các ảnh tạm vẽ bằng code trong `client/src/textures.js` là di sản từ bản đầu — giữ làm placeholder, không thêm mới.)
- **Hỏi trước khi commit/push.** Push lên `main` sẽ kích hoạt Render tự deploy bản online.
- README chỉ để **quảng cáo game**; chi tiết kỹ thuật viết trong `docs/`.
- **Nhật ký phát triển `docs/GAMELOG.md`:** cuối mỗi phiên làm việc thêm một mục (ngày · commit · đã làm · quyết định · việc còn mở).
- **Khi liệt kê asset còn thiếu, LUÔN kèm prompt đầy đủ cho từng ảnh.** Nguồn: `docs/ASSET_TODO.md` + trang **`docs/asset_todo.html`** (nút Copy từng prompt, bấm xong tự đánh dấu ✅ đã dùng, lưu trong localStorage theo tên file ảnh nên giữ nguyên khi sinh lại). Cả hai sinh bởi `python tools/asset_todo.py` — cập nhật nhóm `SEGMENTS` / `DEFER` trong script (xóa mục đã có art, thêm mục mới) rồi chạy lại. Người dùng mở file HTML trực tiếp bằng trình duyệt.
- Người dùng vẽ bằng **Gem Gemini "Họa sĩ Hàng Rong"** — hướng dẫn Gem (style bible, bảng màu rút từ art đã duyệt, quy chuẩn kỹ thuật) ở `docs/GEMINI_GEM.md`. Đổi quy chuẩn asset thì cập nhật cả file này.
- Commit message kết thúc bằng dòng `Co-Authored-By` theo hướng dẫn của môi trường hiện tại.

## 2b. Phân việc theo model (tiết kiệm token)

Agent định nghĩa ở `.claude/agents/`. Phiên chính giao việc bằng tool `Agent`, chỉ nhận lại kết luận:

| Agent | Model | Dùng cho |
|---|---|---|
| `scout` | haiku | Tìm file/hàm/chỗ hardcode, lần luồng dữ liệu (chỉ đọc) |
| `chores` | haiku | GAMELOG, ASSET_STATUS, ROADMAP, README, chạy test & tóm tắt |
| `coder` | sonnet | Code tính năng theo kế hoạch đã rõ + test |
| `asset-importer` | sonnet | Quy trình asset mục 6, build, cập nhật asset_todo |
| `planner` | opus | Thiết kế tính năng mới, kiến trúc, cân bằng kinh tế, bug khó (chỉ đọc) |

Quy tắc: tìm kiếm → `scout` trước khi tự grep nhiều file; việc mới/mơ hồ → `planner` rồi mới `coder`; cuối phiên → `chores` ghi GAMELOG. Phiên chính chỉ điều phối, review và hỏi người dùng. Không agent nào được tự commit/push.

## 3. Chạy & kiểm tra

```bash
npm install
npm start          # http://localhost:3000 ; không có DATABASE_URL -> lưu data/db.json
npm test           # test logic server (liệt kê file tường minh nên chạy được cả Node 20 và 24); thêm TEST_DATABASE_URL=postgres://... để chạy test PostgreSQL (test XÓA bảng!)
npm run assets     # build lại asset (cần Python 3 + pillow numpy scipy)
```

- Máy dev (Windows) có sẵn PostgreSQL 16 tại `C:\Program Files\PostgreSQL\16\bin`. Muốn test Postgres: tạo cụm tạm bằng `initdb -A trust` + `pg_ctl -o "-p 55432" start` trong thư mục tạm — **không đụng database có sẵn của người dùng**.
- `.claude/launch.json` có cấu hình preview `hangrong` (node server/index.js, cổng 3000).
- Chạy ở máy có **nút GM** (cộng tiền, hồi chỉ số, thêm vật phẩm) — dùng nó để test tính năng tốn tiền với nhân vật test.
- `window.hangrong` = đối tượng Phaser.Game, tiện debug trong console (`hangrong.scene.getScene('world')`).
- Pane trình duyệt ẩn sẽ làm Phaser tải chậm/treo ở 32 file — chụp màn hình để kích render, không phải bug.
- Đừng đăng nhập bằng nhân vật của người dùng để thử thao tác tốn tiền; tạo nhân vật test riêng và trả lại `localStorage.hr_token` sau khi thử.

## 4. Deploy

- **Render** (game, `render.yaml`) + **Neon** (PostgreSQL, biến `DATABASE_URL`). Hướng dẫn: `docs/DEVELOPMENT.md`.
- Người dùng tự tạo tài khoản Render/Neon. Bản online: **https://saigon-retro-20s.onrender.com/** (đã ghi trong README).
- Kiểm tra bản online đang chạy commit nào: `curl .../assets/icons.json` (chỉ có từ commit 833c21c) và `.../api/status`. Nếu Render không tự deploy, người dùng vào dashboard → *Manual Deploy → Deploy latest commit*.
- Lưu trữ: game chạy trong bộ nhớ, ghi Postgres theo lô mỗi 5s (`server/pgdb.js`); sập đột ngột có thể mất ≤5s.

## 5. Kiến trúc (tóm tắt — chi tiết `docs/DEVELOPMENT.md`)

| Đường dẫn | Vai trò |
|---|---|
| `shared/config.js` | **Nguồn sự thật**: bản đồ (rộng 6800), 4 khu, ITEMS, BUILDINGS (kèm ô biển hiệu `sign.box`), POIS (NPC `work`, `prop`), kinh tế |
| `server/game.js` | Phiên chơi, di chuyển (server chặn tốc độ), chat, AOI, thời gian, lương, xổ số |
| `server/economy.js` | Giao dịch nguyên tử + sổ cái |
| `server/dialogs.js` | Hội thoại mọi POI (server dựng UI, client chỉ hiển thị) |
| `server/npcs.js` / `auction.js` | NPC động (Cảnh sát, Ăn trộm, ve chai) / đấu giá |
| `server/jobs.js` | Nghề + mini-game: server sinh đề, client chơi, server chấm (`scoreJob`), cấp nghề. Gia sư / thi chứng chỉ / tờ rơi / shipper chấm từng bước trên server (`live`) |
| `server/home.js` / `cook.js` / `mall.js` / `market.js` | Phòng trọ (nội thất, ngủ, TV, tiền điện) / Nấu ăn (canh lửa, 1–3 sao) / TTTM 5 quầy + Gacha / Chợ Sạp Hàng Hóa (sạp thuê tuần, bán khi offline) |
| `server/db.js` / `pgdb.js` | Lưu JSON / PostgreSQL |
| `client/src/world.js` | Scene Phaser: map, nhân vật, xe, NPC, giao thông, ngày/đêm |
| `client/src/ui.js` | HUD, chat, hội thoại, túi đồ lưới, búp bê giấy, điện thoại, thanh nhanh (icon từ `assets/icons/`, khung từ `assets/ui/`) |
| `client/src/jobs.js` | Màn mini-game J1 IT / J2 Phục vụ / J3 Trà sữa / J8 Gia sư + thi chứng chỉ; HUD nghề trên phố (tờ rơi, shipper) |
| `client/src/home.js` / `cook.js` / `mall.js` / `market.js` | Màn phòng (kéo thả nội thất) / bếp / TTTM / Chợ. Ảnh lấy thẳng từ `client/assets/v2/` |
| `client/ui-v2.css` | Giao diện UI kit V2 (khung giấy-gỗ `border-image` 9 phần, nút, ô độ hiếm) |

## 6. Quy trình asset (việc lặp lại nhiều nhất)

Người dùng bỏ ảnh vào **`asset_new_by_Khoit/`** (chữ K hoa trên đĩa; code tìm không phân biệt hoa thường). Quy chuẩn tạo ảnh: `docs/ASSET_PROMPTS.md` (nền magenta `#FF00FF`, 1 ảnh = 1 hành động = 6 frame, không chữ). Tình trạng: `docs/ASSET_STATUS.md`.

1. **Xem từng ảnh mới** (Read) để biết nội dung, số frame, hướng nhìn.
2. **Nhân vật người chơi** → `tools/import_new_art.py`:
   - Tên file chứa mã nhân vật + hành động (`sv_male_walk_down.png`). Hành động: `idle_down, walk_down, walk_up, walk_left, idle_up_left, ride_left`.
   - AI hay vẽ quay **phải** → khai báo `FACING[(skin, action)] = "right"` để pipeline lật.
   - Sheet gộp nhiều dải → khai báo trong `SHEETS` (hàng, cột bắt đầu).
   - Skin mới phải thêm vào `SKINS` trong `shared/config.js`.
3. **Đồ vật / công trình / NPC làm việc / xe / icon** → `tools/new_manifest.py`:
   - Chạy `python tools/contact_new.py` → xem `tools/out/new/_contact_*.png` để lấy mã blob `hàng.cột` (thêm file vào `PARAMS` nếu là sheet mới; tham số `(dilate, min_ratio, erode)` — nét mảnh dùng erode 1).
   - Map mã blob → tên asset, kích thước trong game (người đứng = 86px, công trình scale 1.25 từ ảnh 1024px).
   - Công trình mới: thêm vào `BUILDINGS` trong config (`sprite`, `sign.box` = tỉ lệ ô biển hiệu trống trong ảnh) và chỉnh `POIS`.
   - **Ảnh đơn** (UI kit, `building_*`, `job_*`, `prop_*`…) → `tools/ui_manifest.py`: khai báo hộp cắt `(x0,y0,x1,y1)` theo ảnh gốc 1024×572; file có tiền tố `ui_ job_ building_ prop_ bld_ icons_ furn_ room_ tube_ veh_ npc_mall_ banner_ bus_stop taxi_stand market_` được bộ nhập nhân vật bỏ qua.
   - **Ảnh đơn đợt V2 lần 2 trở đi** → `tools/v2_manifest.py`: **tự tách blob** (không cần hộp cắt), chỉ khai báo danh sách tên theo thứ tự đọc; số phần tách ra sai → build dừng và báo tên file. Asset chưa có tính năng để trong `client/assets/v2/` (+ `v2.json`), không nạp lúc vào game.
4. `npm run assets` (hoặc `cd tools && python build_assets.py`) → xem ảnh preview, kiểm tra trong game, cập nhật `docs/ASSET_STATUS.md`.
5. Nhắc người dùng các lỗi ảnh (watermark ✦ Gemini, thiếu frame) — **không tự sửa art**.
6. Cập nhật `tools/asset_todo.py` (bỏ asset đã nhận, thêm ảnh cần làm lại kèm prompt) → `python tools/asset_todo.py`.

## 7. Trạng thái hiện tại & việc tiếp theo

> **ĐANG LÀM: Gameplay V2 — code dần theo art người dùng gửi.** Tài liệu: `docs/GAMEPLAY_V2.md` (G…, đầu file có mục "Đã code"), `docs/ANIMATION_V2.md` (A…), `docs/INVENTORY_V2.md` (I…), asset kèm prompt `docs/ASSET_TODO.md`.
> Nguyên tắc người dùng chốt (2026-10-07): **làm phần nào có art; phần chưa có art thì tạm ẩn; nhân vật giữ art & UI cũ, chưa sửa** (chưa làm G1 chỉ-Sinh-viên-nam, chưa đổi animation).
> Đã chốt: G6–G9, G32 (bỏ xe máy — CHƯA gỡ khỏi code), G53, G54. Hướng chính: một SV làm nhiều nghề, nấu ăn, ngủ, trang trí phòng, Chợ Sạp Hàng Hóa, chỉ xe buýt + taxi.

**Phiên gần nhất (2026-10-07, lần 5):** chung cư G20 thay Nhà Đấu Giá (người dùng chọn; thuê trả trước 7 ngày hoặc mua đứt; 1 nơi ở, chuyển nhà mang nội thất; `homeOf()` trong `server/home.js`); đấu giá chỉ qua điện thoại (POI `hidden`). Đi bộ không tốn năng lượng. Giá mua chung cư 2 tỷ. **Nút GM** chỉ khi chạy ở máy (`server/gm.js`, `GM_ENABLED` = không có DATABASE_URL / RENDER) — dùng để test thay vì tạo nhân vật nghèo. 13 test pass. **Việc kế tiếp:** tuyến buýt / taxi (G29–G31), hóa đơn tuần (G8), UI ATM / bưu điện.

**Phiên trước (2026-10-07, lần 4):** Chợ Sạp Hàng Hóa (G24, G55–G57) thay CLB Bida (người dùng chọn); Tạp Hóa / Cơm Tấm dời sang phải. Đã gỡ sạp vỉa hè, ô quy hoạch, Cảnh sát phạt, Giang hồ (G53). `server/market.js`, `client/src/market.js`, dữ liệu `db.data.world.market` (pgdb chỉ lưu players + world). 11 test pass. **Việc kế tiếp:** tuyến buýt (G29–G31), chung cư (G20), hóa đơn tuần (G8), ATM / bưu điện UI.

**Phiên trước (2026-10-07, lần 3):** người dùng chốt thứ tự *nghề → nhà → nấu ăn → TTTM*, G1/G2 chưa đụng, gỡ sạp vỉa hè khi Chợ xong, Gacha theo G64; TTTM chỉ 2 ảnh nhân viên → dùng chung 5 quầy; đồ thiếu art để "chưa mở bán". Đã code: J5 tờ rơi, J6 shipper, J8 gia sư + thi chứng chỉ ở Giảng đường; phòng trọ (sắp xếp nội thất, ngủ, TV, tiền điện); nấu ăn 12 món; TTTM (Khu 2 x=5800) 5 quầy + Gacha. 12 test pass. Đã dọn bản đồ: bỏ trạm buýt/taxi, người lái xe máy, bàn + cô bán cà phê, bàn trà đá, chủ quán net, cô Ba tạp hóa. **Việc kế tiếp:** Chợ Sạp Hàng Hóa (G24, G55–G57) rồi gỡ sạp vỉa hè (G53); tuyến buýt; chung cư; hóa đơn tuần (G8).

**Phiên trước (2026-10-07, lần 2):** người dùng tải 68 ảnh lên GitHub (`977ec5b`) → `tools/v2_manifest.py` cắt hết. Vào game: vựa ve chai, 7 nhà ống (lấp khe, đặt lùi sau công trình), xe buýt mới, 4 trạm buýt + 2 điểm taxi (trang trí), chân dung 6 NPC trong hộp thoại. Cắt sẵn chờ code: nội thất, phòng, TTTM, gacha, chợ, nấu ăn, nghề J5/J6/J8, UI trường/ATM/bưu điện (`client/assets/v2/`), 60 icon vật phẩm. Còn 51 ảnh V2 trong ASSET_TODO. 

**Phiên trước nữa (2026-10-07):** nhập 17 ảnh V2 (UI kit, điện thoại, quán cơm tấm, tiệm trà sữa, mini-game J1–J3) → code: 3 nhu cầu (thêm No bụng), nhiệm vụ ngày, hệ thống nghề + 3 mini-game, túi đồ lưới + thanh nhanh + ô thông tin, búp bê giấy, điện thoại có app, dời nhà trọ/net cỏ sang trái để chừa chỗ tiệm trà sữa. Thêm test nghề/nhiệm vụ. Chưa commit — hỏi người dùng.

**Phiên trước (2026-10-06):** viết bộ tài liệu thiết kế V2 (GAMEPLAY / ANIMATION / INVENTORY), danh sách 132 ảnh kèm prompt + trang `docs/asset_todo.html` có nút Copy, và hướng dẫn Gem Gemini `docs/GEMINI_GEM.md`. **Chưa code gì cho V2.** Việc kế tiếp: chờ người dùng trả lời các mã G/A/I còn mở → cập nhật tài liệu → code theo GAMEPLAY_V2 mục 11 (đợt 1 trước).

**Đã xong trước đó:** dựng lại game với art mới (sv_male, sv_female, 8 công trình, 10 NPC làm việc, 8 xe, sạp 3 cấp, 56 icon, ~27 props, ảnh nền đăng nhập); README quảng cáo; PostgreSQL; docs.

**Đang chờ người dùng:**
- Asset còn thiếu (danh sách đầy đủ `docs/ASSET_STATUS.md`): `sv_female/walk_down`; bộ `vp_male`, `vp_female`, `tt_male`, `tt_female`; Cảnh sát, Ăn trộm, Giang hồ, Bưu tá, người đi đường; ngân hàng, TechCorp, đấu giá, showroom, thời trang, nhà ống số 5; cô cà phê (2 frame), cô Ba (4 frame); vẽ lại 2 chân dung (cơm tấm, trà sữa) và nhân viên quầy Nội thất.
- Xác nhận Render đã deploy bản mới nhất (lần kiểm tra gần nhất bản online vẫn chạy code cũ, thiếu art mới).

**Việc có thể làm tiếp (hỏi người dùng trước):** gameplay trong `docs/ROADMAP.md` — ở ghép nhà trọ, cờ tướng/caro, đua xe đêm 23:00, nghiệp đoàn, xe ôm công nghệ; ghi giao dịch trực tiếp vào Postgres.

## 8. Lưu ý kỹ thuật dễ vấp

- Mọi tọa độ/khu vực nằm trong `shared/config.js`; một số chỗ trong `client/src/world.js` (vạch qua đường, cây, props trang trí) và `server/npcs.js` (vùng sinh ve chai) còn hardcode theo bề rộng 6800 — đổi bản đồ thì sửa cả.
- Sprite nhân vật: frame nhìn ngang luôn quay **TRÁI**; client lật khi đi sang phải. Xe trong `veh_*` quay **PHẢI**.
- Lớp phủ ngày/đêm dùng `scrollFactor 0` nhưng vẫn bị camera zoom → đã phủ rộng gấp 3 (`sizeOverlay`).
- Console Windows cần `sys.stdout.reconfigure(encoding="utf-8")` trong script Python có in tiếng Việt.
- Push qua HTTPS dùng Git Credential Manager: `GCM_INTERACTIVE=always git push` (máy chưa đăng nhập `gh`).
