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
- **Khi liệt kê asset còn thiếu, LUÔN kèm prompt đầy đủ cho từng ảnh.** Nguồn: `docs/ASSET_TODO.md` + trang **`docs/asset_todo.html`** (nút Copy từng prompt, bấm xong tự đánh dấu ✅ đã dùng, lưu trong localStorage theo tên file ảnh nên giữ nguyên khi sinh lại). Cả hai sinh bởi `python tools/asset_todo.py` — cập nhật nhóm `SEGMENTS` / `DEFER` trong script (xóa mục đã có art, thêm mục mới) rồi chạy lại. Người dùng mở file HTML trực tiếp bằng trình duyệt.
- Commit message kết thúc bằng dòng `Co-Authored-By` theo hướng dẫn của môi trường hiện tại.

## 3. Chạy & kiểm tra

```bash
npm install
npm start          # http://localhost:3000 ; không có DATABASE_URL -> lưu data/db.json
npm test           # 6 test logic server; thêm TEST_DATABASE_URL=postgres://... để chạy test PostgreSQL (test XÓA bảng!)
npm run assets     # build lại asset (cần Python 3 + pillow numpy scipy)
```

- Máy dev (Windows) có sẵn PostgreSQL 16 tại `C:\Program Files\PostgreSQL\16\bin`. Muốn test Postgres: tạo cụm tạm bằng `initdb -A trust` + `pg_ctl -o "-p 55432" start` trong thư mục tạm — **không đụng database có sẵn của người dùng**.
- `.claude/launch.json` có cấu hình preview `hangrong` (node server/index.js, cổng 3000).
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
| `server/game.js` | Phiên chơi, di chuyển (server chặn tốc độ), chat, sạp P2P, AOI, thời gian, lương, xổ số |
| `server/economy.js` | Giao dịch nguyên tử + sổ cái |
| `server/dialogs.js` | Hội thoại mọi POI (server dựng UI, client chỉ hiển thị) |
| `server/npcs.js` / `auction.js` | NPC động / đấu giá |
| `server/db.js` / `pgdb.js` | Lưu JSON / PostgreSQL |
| `client/src/world.js` | Scene Phaser: map, nhân vật, xe, NPC, giao thông, ngày/đêm |
| `client/src/ui.js` | HUD, chat, hội thoại, túi đồ (icon từ `assets/icons/`) |

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
4. `npm run assets` (hoặc `cd tools && python build_assets.py`) → xem ảnh preview, kiểm tra trong game, cập nhật `docs/ASSET_STATUS.md`.
5. Nhắc người dùng các lỗi ảnh (watermark ✦ Gemini, thiếu frame) — **không tự sửa art**.
6. Cập nhật `tools/asset_todo.py` (bỏ asset đã nhận, thêm ảnh cần làm lại kèm prompt) → `python tools/asset_todo.py`.

## 7. Trạng thái hiện tại & việc tiếp theo

> **ĐANG LÀM: Thiết kế lại gameplay V2 — CHỜ NGƯỜI DÙNG DUYỆT, CHƯA CODE.**
> Tài liệu: `docs/GAMEPLAY_V2.md` (mã G1–G41), `docs/ANIMATION_V2.md` (A1–A14), `docs/INVENTORY_V2.md` (I1–I15), asset kèm prompt `docs/ASSET_TODO.md` (sinh từ `tools/asset_todo.py`).
> Người dùng sẽ trả lời theo mã (vd "G1 ok, G24 chọn A"). Cập nhật tài liệu theo phản hồi trước, rồi mới code theo thứ tự ở GAMEPLAY_V2 mục 9.
> Đã chốt (vòng 2): G6–G9, G32 (bỏ toàn bộ xe máy), G53 (bỏ bày bán vỉa hè → Sạp hàng hóa), G54 (bỏ nghề Grab).
> Hướng chính: chỉ Sinh viên nam; làm nhiều nghề bất kỳ lúc nào (J1–J9); trọng tâm nấu ăn, ngủ, trang trí phòng; giải trí ẩn; nội thất 3 phân khúc + tiền điện; Chợ Sạp Hàng Hóa (bán cả khi offline); trang bị mua ở quầy + Gacha (G60–G64); chỉ xe buýt + taxi; túi đồ dạng lưới ô.

**Đã xong (commit gần nhất trên `main`):** dựng lại game với art mới (sv_male, sv_female, 8 công trình, 10 NPC làm việc, 8 xe, sạp 3 cấp, 56 icon, ~27 props, ảnh nền đăng nhập); README quảng cáo; PostgreSQL; docs.

**Đang chờ người dùng:**
- Asset còn thiếu (danh sách đầy đủ `docs/ASSET_STATUS.md`): `sv_female/walk_down`; bộ `vp_male`, `vp_female`, `tt_male`, `tt_female`; Cảnh sát, Ăn trộm, Giang hồ, Bưu tá, người đi đường; ngân hàng, TechCorp, đấu giá, showroom, thời trang, vựa ve chai, nhà ống; tạo lại xe buýt (dính watermark), cô cà phê (2 frame), cô Ba (4 frame).
- Xác nhận Render đã deploy bản mới nhất (lần kiểm tra gần nhất bản online vẫn chạy code cũ, thiếu art mới).

**Việc có thể làm tiếp (hỏi người dùng trước):** gameplay trong `docs/ROADMAP.md` — ở ghép nhà trọ, cờ tướng/caro, đua xe đêm 23:00, nghiệp đoàn, xe ôm công nghệ; ghi giao dịch trực tiếp vào Postgres.

## 8. Lưu ý kỹ thuật dễ vấp

- Mọi tọa độ/khu vực nằm trong `shared/config.js`; một số chỗ trong `client/src/world.js` (vạch qua đường, cây, props trang trí) và `server/npcs.js` (vùng sinh ve chai) còn hardcode theo bề rộng 6800 — đổi bản đồ thì sửa cả.
- Sprite nhân vật: frame nhìn ngang luôn quay **TRÁI**; client lật khi đi sang phải. Xe trong `veh_*` quay **PHẢI**.
- Lớp phủ ngày/đêm dùng `scrollFactor 0` nhưng vẫn bị camera zoom → đã phủ rộng gấp 3 (`sizeOverlay`).
- Console Windows cần `sys.stdout.reconfigure(encoding="utf-8")` trong script Python có in tiếng Việt.
- Push qua HTTPS dùng Git Credential Manager: `GCM_INTERACTIVE=always git push` (máy chưa đăng nhập `gh`).
