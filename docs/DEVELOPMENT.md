# Hướng dẫn phát triển

Web client (Phaser 3) + server multiplayer thời gian thực (Node.js + WebSocket), lưu trữ PostgreSQL.

## Chạy ở máy

```bash
npm install
npm start
```

Mở `http://localhost:3000` (mở nhiều tab / trình duyệt ẩn danh để thử multiplayer). Không đặt `DATABASE_URL` thì server lưu vào file `data/db.json`.

Test logic server: `npm test`. Thêm `TEST_DATABASE_URL=postgres://...` để chạy cả test PostgreSQL — **test sẽ xóa các bảng của game trong database đó**, đừng trỏ vào database thật.

## Deploy (Render + Neon)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/khoitran3172/SaigonRetro20sGame)

1. **Database Neon:** https://neon.tech → đăng nhập bằng GitHub → *Create project* (region **AWS Asia Pacific (Singapore)**) → *Connect* → copy chuỗi `postgresql://...neon.tech/neondb?sslmode=require`.
2. **Render:** bấm nút trên → đăng nhập bằng GitHub → dán chuỗi Neon vào `DATABASE_URL` → *Apply*. Cấu hình nằm trong `render.yaml`.

Bảng `players`, `world`, `ledger` tự tạo lần chạy đầu. Gói free của Render cho server ngủ sau 15 phút không ai vào (lần mở đầu chờ ~30–60s); dữ liệu nằm ở Neon nên không mất. Mỗi lần push lên `main`, Render tự deploy lại.

## Pipeline asset

```bash
npm run assets   # = python tools/extract_sprites.py && python tools/build_assets.py
```

Cần Python 3 + `pillow numpy scipy`.

**Công cụ GM khi chạy ở máy:** không đặt `DATABASE_URL` (và không chạy trên Render) thì có nút 🛠️ GM trên thanh dưới — cộng/trừ tiền, hồi chỉ số, thêm vật phẩm để test. Code: `server/gm.js` (`GM_ENABLED`), `client/src/gm.js`.

**Art mới** (`asset_new_by_Khoit/`, nền magenta, dải 6 frame) được ưu tiên hơn concept cũ:
- `tools/import_new_art.py` — nhân vật người chơi: nhận diện theo tên file (`sv_male_walk_down.png`), tự lật hướng (`FACING`), chuẩn hóa chiều cao, sheet gộp khai báo ở `SHEETS`.
- `tools/new_manifest.py` — công trình, NPC làm việc, xe, icon, props: map theo mã blob `hàng.cột`. Xem mã bằng `python tools/contact_new.py` → `tools/out/new/_contact_*.png`.
- `tools/ui_manifest.py` — ảnh đơn đợt V2 lần 1 (UI kit, điện thoại, mặt tiền cơm tấm / trà sữa, mini-game J1–J3): khai báo hộp cắt `(x0,y0,x1,y1)` theo ảnh gốc 1024×572.
- `tools/v2_manifest.py` — ảnh đơn đợt V2 lần 2 trở đi: **tự tách blob** theo nền magenta, chỉ khai báo danh sách tên theo thứ tự đọc (trên→dưới, trái→phải); số phần tách ra sai thì build dừng và báo tên file. Asset dùng ngay → `client/assets/props|icons|ui`; asset chờ code tính năng → `client/assets/v2/` (+ `v2/v2.json`, không nạp lúc vào game).

**Concept cũ** (ảnh ở thư mục gốc, nền trắng):
- `tools/extract_sprites.py` — xóa nền, tách khối, xuất contact sheet đánh số.
- `tools/build_assets.py` — chọn frame, scale, đóng spritesheet neo chân → `client/assets/`.

Quy chuẩn tạo ảnh: [`ASSET_PROMPTS.md`](ASSET_PROMPTS.md). Tình trạng / còn thiếu: [`ASSET_STATUS.md`](ASSET_STATUS.md). Chỗ chưa có art dùng concept cũ hoặc ảnh tạm vẽ bằng code (`client/src/textures.js`).

## Kiến trúc

```
shared/config.js     Số liệu cân bằng dùng chung: bản đồ, khu vực, item, POI, kinh tế
server/
  index.js           HTTP + WebSocket, tick 10Hz, 1 phút game = 1 giây thực
  game.js            Phiên chơi, di chuyển (server kiểm tốc độ), chat, sạp P2P, AOI, thời gian/thời tiết
  economy.js         Giao dịch nguyên tử (kiểm tra trước, ghi sau) + sổ cái
  dialogs.js         UI do server dựng cho mọi điểm tương tác (client chỉ hiển thị)
  npcs.js            Cảnh sát, Ăn trộm, Giang hồ, ve chai
  auction.js         Đấu giá 20:00, ký quỹ ngân hàng, chống bắn tỉa
  db.js / pgdb.js    Lưu JSON (máy) / PostgreSQL (ghi theo lô 5s trong 1 transaction)
client/src/
  world.js           Scene Phaser: bản đồ, nhân vật, NPC, giao thông, ngày/đêm, mưa
  ui.js              HUD, chat 3 kênh, LED RGB, hội thoại, túi đồ, trang bị
  textures.js        Ảnh tạm vẽ bằng code (chờ art)
  layout.js          Bố cục PC: cỡ giao diện `--ui`, gom HUD vào 2 dock flex-wrap, chat thu gọn
  touch.js           Cảm ứng: nút hướng, nút "Nói chuyện", menu ☰, nâng chat theo bàn phím ảo
client/desktop.css · touch.css   Bố cục PC (`body:not(.touch)`) / cảm ứng (`body.touch`)
```

- **Đồng bộ:** client gửi vị trí 15Hz, server chặn dịch chuyển vượt tốc độ. Snapshot theo lưới AOI (ô 640px, ±2 ô). Chat gần chỉ gửi trong bán kính 700px.
- **Chống dupe:** mỗi thao tác tiền/đồ là một hàm đồng bộ kiểm tra hết điều kiện rồi mới ghi (Node đơn luồng → nguyên tử). Mọi biến động tiền vào sổ cái (`ledger`).
- **Giới hạn:** dữ liệu ghi theo lô 5s — server sập đột ngột có thể mất ≤5s giao dịch gần nhất.

## Responsive (PC / điện thoại)

- `main.js` gắn class `touch` lên `<body>` nếu là thiết bị cảm ứng (`isTouchDevice` trong `touch.js`: pointer coarse, iPhone/iPad/Android, iPad chế độ desktop); ngược lại gọi `setupDesktopLayout()`.
- **PC:** `layout.js` tính `--ui` = min(1, rộng/1440, cao/820), tối thiểu 0.55, áp bằng `zoom` cho các khung HUD. HUD gom vào `.dock-top` / `.dock-bottom` (flex-wrap) nên tự xuống dòng, không đè nhau. Không dùng mốc px để đổi bố cục; cỡ nhỏ (`--ui` < 0.96) thì thẻ nhân vật gọn (`hud-compact`, bấm để mở rộng) và chat thu gọn mặc định.
- **Cảm ứng:** HUD chỉ còn thẻ nhân vật gọn + nút hướng + nút ☰ (mở bảng chức năng và thanh nhanh); chat mở bằng nút 💬. Chạm NPC / cửa hàng chỉ đi tới; đứng gần thì hiện nút "Nói chuyện" (`nearestInteract` trong `world.js`) → bấm mới mở hộp thoại.
- Các `@media` px cũ viết cho điện thoại (trong `style.css`, `ui-v2.css`) đã giới hạn bằng `body.touch`.
- **Cạm bẫy:** handler `onXxx = (e) => a && b()` trả `false` sẽ hủy phím/hành vi mặc định (từng chặn gõ chữ trên iOS) — dùng `addEventListener` hoặc khối `{ if (...) ... }`. Phần tử con `position:absolute` (ô thanh nhanh) cần cha `position:relative` khi đưa vào dock.

## Điều khiển

WASD / mũi tên hoặc click đất để đi · click NPC / cửa hàng / sạp để tương tác · **E** tương tác gần nhất · **Enter** chat · **I** túi đồ · **C** trang bị · **P** điện thoại · **B** mở sạp · **H** hướng dẫn.
