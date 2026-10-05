# Hàng Rong — Phố Thị Online (vertical slice)

2D top-down MMORPG / Social Life-Sim đô thị Việt Nam. Bản này là **vertical slice chơi được**: web client (Phaser 3) + server multiplayer thời gian thực (Node.js + WebSocket), dùng art từ các concept sheet trong thư mục gốc.

## Chơi online

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/khoitran3172/SaigonRetro20sGame)

Game chạy trên **Render** (server Node + WebSocket) và lưu dữ liệu ở **Neon** (PostgreSQL miễn phí, không tự xóa).

1. **Tạo database Neon:** vào https://neon.tech → đăng nhập bằng GitHub → *Create project* (region **AWS Asia Pacific (Singapore)**) → nút *Connect* → copy chuỗi kết nối dạng `postgresql://...neon.tech/neondb?sslmode=require`.
2. **Deploy game:** bấm nút *Deploy to Render* ở trên → đăng nhập bằng GitHub → dán chuỗi Neon vào ô `DATABASE_URL` → *Apply*. Khi xong Render cấp link `https://<tên>.onrender.com`.

Bảng `players`, `world`, `ledger` được tạo tự động lần chạy đầu. Gói free của Render cho server ngủ sau 15 phút không ai vào (lần mở đầu chờ ~30–60s) nhưng dữ liệu nằm ở Neon nên **không mất**.

Không đặt `DATABASE_URL` thì server dùng file `data/db.json` (tiện chạy thử ở máy).

## Chạy game

```bash
npm install
npm start
```

Mở `http://localhost:3000` (mở nhiều tab/trình duyệt ẩn danh để thử multiplayer). Test logic server: `npm test` (thêm `TEST_DATABASE_URL=postgres://...` để chạy cả test PostgreSQL — test sẽ xóa các bảng của game trong database đó, đừng trỏ vào database thật).

Điều khiển: **WASD/mũi tên** hoặc click xuống đất để đi · click NPC/cửa hàng/sạp để tương tác · **E** tương tác gần nhất · **Enter** chat · **I** túi đồ · **C** trang bị · **P** điện thoại · **B** mở sạp · **H** hướng dẫn.

## Pipeline asset

Concept sheet (nền trắng, có chữ chú thích) được xử lý tự động:

```bash
npm run assets   # = python tools/extract_sprites.py && python tools/build_assets.py
```

- `tools/extract_sprites.py`: xóa nền (flood-fill từ viền, giữ màu trắng bên trong như áo sơ mi), tách từng khối, xuất `tools/out/<sheet>/NNN.png` + ảnh `_contact_*.png` đánh số để tra.
- `tools/build_assets.py`: chọn frame cho từng animation (bảng `CHARACTERS`, `PROPS`, `ANIMS`), scale về cùng tỉ lệ, đóng spritesheet neo chân → `client/assets/`.
  Thêm art mới: chạy extract, xem contact sheet, thêm số blob vào bảng rồi build lại.

Các công trình chưa có art (trường ĐH, nhà trọ, net cỏ, ngân hàng, cao ốc, nhà ống…) được vẽ thủ tục trong `client/src/textures.js`.

## Kiến trúc

```
shared/config.js     Số liệu cân bằng dùng chung: bản đồ, khu vực, item, POI, kinh tế
server/
  index.js           HTTP + WebSocket, tick 10Hz, 1 phút game = 1 giây thực
  game.js            Phiên chơi, di chuyển (server kiểm tốc độ), chat, sạp P2P, AOI, thời gian/thời tiết
  economy.js         Giao dịch nguyên tử (kiểm tra trước, ghi sau) + sổ cái data/ledger.log
  dialogs.js         UI do server dựng cho mọi điểm tương tác (client chỉ hiển thị)
  npcs.js            Cảnh sát, Ăn trộm, Giang hồ, ve chai
  auction.js         Đấu giá 20:00, ký quỹ ngân hàng, chống bắn tỉa
  db.js              Lưu JSON atomic (data/db.json) khi chạy ở máy
  pgdb.js            Lưu PostgreSQL (khi có DATABASE_URL): ghi theo lô mỗi 5s trong 1 transaction, chỉ ghi người chơi có thay đổi
client/src/
  world.js           Scene Phaser: bản đồ, nhân vật, NPC, giao thông, ngày/đêm, mưa
  ui.js              HUD, chat 3 kênh, LED RGB, hội thoại, túi đồ, trang bị
```

**Đồng bộ:** client gửi vị trí 15Hz, server chặn dịch chuyển vượt tốc độ cho phép. Snapshot gửi theo lưới AOI (ô 640px, ±2 ô) nên mỗi người chỉ nhận thực thể quanh mình. Chat gần chỉ gửi trong bán kính 700px, bong bóng thu nhỏ/mờ dần theo khoảng cách.

**Chống dupe:** mọi thao tác tiền/đồ là một hàm đồng bộ kiểm tra hết điều kiện rồi mới ghi; Node đơn luồng nên mỗi hàm là một transaction nguyên tử. Mọi biến động tiền ghi vào `data/ledger.log` để đối soát.

## Đã có trong bản này (theo GDD)

| GDD | Trạng thái |
|---|---|
| 3 tầng lớp + chỉ số riêng (Điểm danh / KPI / Uy tín) | ✅ |
| Thăng tiến nghề nghiệp 3 bậc, SV nộp CV thành NVVP | ✅ |
| 4 phân khu liền mạch (Đại học, Phố ẩm thực, CBD, Ngoại ô) | ✅ |
| Tiền mặt / Ngân hàng / Danh vọng / Kim cương | ✅ |
| ATM có phí, lãi ngày, chuyển khoản, lương 17:00 | ✅ |
| Bày sạp P2P, ô quy hoạch, thuế 5%, khách NPC | ✅ |
| Chế biến (bánh mì, trà đá, nước mía) | ✅ |
| Cảnh sát tuần tra / phạt lấn chiếm / trấn áp trộm | ✅ |
| Ăn trộm nhắm người giữ nhiều tiền mặt / AFK, đuổi trộm | ✅ |
| Giang hồ đòi bảo kê: trả / gọi Cảnh sát / kêu gọi người chơi | ✅ |
| Bưu tá: thư, bưu phẩm, bản tin thành phố | ✅ |
| 10 slot + Điện thoại (chat thế giới, banking, định vị, đấu giá từ xa) | ✅ |
| Cường hóa (fail chỉ giảm cấp), độ bền & sửa chữa, hào quang +5 | ✅ |
| Chat gần theo cự ly, chat thế giới có cooldown + cước 4G, Loa LED RGB | ✅ |
| Đấu giá 20:00 (lô hệ thống + ký gửi) | ✅ |
| Ngày/đêm, mưa ngập (xe chậm 50%, sạp không dù ế), nắng gắt | ✅ |
| Nhà trọ (thuê, nghỉ hồi phục ×3), Net cỏ, Bida, Vé số | ✅ (bản giản lược) |

## Lộ trình tiếp theo

- Ở ghép / trang trí phòng, mua căn hộ.
- Mini-game cờ tướng / caro có cược, đua xe đêm 23:00.
- Nghiệp đoàn / Công đoàn / Hội đồng hương; class ẩn (Xe ôm công nghệ, Cò đất).
- Ghi từng giao dịch thẳng vào PostgreSQL (hiện ghi theo lô 5s: sập server đột ngột có thể mất ≤5s gần nhất), Redis Pub/Sub cho chat thế giới + LED khi chạy nhiều server.
- Art: cần thêm frame animation sạch (nhiều concept sheet hiện bị thiếu frame/hướng, ví dụ áo dài thiếu hướng đi lên), sprite cảnh sát/trộm/giang hồ riêng thay cho bản tô màu lại.
