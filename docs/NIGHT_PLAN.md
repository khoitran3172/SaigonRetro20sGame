# Kế hoạch đêm 2026-10-08 — "Thị trấn liền mạch" + mở rộng

> Người lập: planner (Opus). Dựa trên đi dọc cả 4 khu trong game (máy local, nhân vật test, zoom 0,45 và zoom thường), đọc `client/src/world.js`, `shared/config.js`, `server/*`, các tài liệu V2.
> Thứ tự đêm nay: **C (dọn bằng code)** → cập nhật ASSET_TODO theo **D** → **E** chỉ làm những mục không cần người dùng quyết.

---

## A. Brief viết lại

**Yêu cầu người dùng (diễn đạt lại):** Từng asset đẹp nhưng gộp lại thì rối, như "bãi rác" vì gắn thêm liên tục. Đêm nay: (1) rà toàn bộ phần nhìn — bản đồ và HUD — rồi chỉnh để Phố Thị thành **một thị trấn liền mạch, hợp lý, gọn**, bỏ chi tiết thừa; (2) chỗ nào phải vẽ lại / vẽ thêm thì ghi vào file asset (kèm prompt) để mai vẽ; (3) lên kế hoạch mở rộng game tiếp theo, kèm **công cụ giúp mở rộng dự án**; (4) xong thì push lên `main`.

**Nguyên tắc đo được (dùng để nghiệm thu):**
1. **Một hệ tỉ lệ:** người 86px · cửa ra vào 105–115px · nhà ống 230–270px · công trình 3 bậc cao: nhỏ 230–270, vừa 290–330, công trình mốc 340–400px.
2. **Một bảng màu:** bảng màu trong `GEMINI_GEM.md`; **0 ảnh vẽ bằng code** hiện trên phố (chưa có art thì ẩn).
3. **Chữ nổi trên phố ≤ 3 nhãn POI** cùng lúc, chỉ hiện khi người chơi trong 220px hoặc rê chuột; công trình có biển hiệu thì không gắn thêm nhãn trùng.
4. **HUD ≤ 20% màn hình** ở 1280×720 (≤ 25% ở điện thoại); chat thu gọn mặc định; chỉ một kiểu icon (pixel art, không lẫn emoji).
5. **Nhịp phố:** đèn/cột mỗi 420px, cây vỉa hè dưới so le đúng nửa nhịp; không vật gì trong ±70px trước cửa POI.
6. **Mỗi khu một chủ đề, một vật liệu nền, một bộ props**; không đặt prop của khu này sang khu khác; không đặt prop "trang trí không chức năng" lơ lửng giữa khoảng trống.
7. **Giao thông ≤ 3 xe** trên màn hình, không xe nào chồng lên xe khác.
8. **Không lộ trời** giữa hai công trình trong đoạn phố x 0–6060.

---

## B. Phê bình hiện trạng (đã xem trong game)

### Toàn bản đồ (lỗi cấu trúc — lý do chính khiến phố trông như "bãi rác")
| # | Vấn đề | Bằng chứng |
|---|---|---|
| B1 | **Nửa dưới bản đồ (y 840–1200) là bãi đất trống** chiếm 30% thế giới: sân bóng vẽ bằng nét code, gánh hàng không người, ghế, bàn cờ, trẻ con, lốp xe rải rác nhỏ xíu giữa nền trơn. Không công trình nào ở phía này. | `world.js:144` nền theo khu; `world.js:159-165` sân bóng; `world.js:279-307` props rải; `config.js:6` height 1200 |
| B2 | **Đường nối giữa các khu là một vết cắt cứng**: cỏ → gạch đỏ (x 1600), gạch → đá xám (x 4200), đá → đất (x 6060). | `world.js:140-144` |
| B3 | **Trời lộ giữa các công trình** + skyline là các khối chữ nhật phẳng 2 màu → nhìn rẻ, đè lên chủ đề retro. Khe rõ nhất: TechCorp ↔ Chung cư (~x 5280), Chợ ↔ Tạp hóa (~x 3510). | `world.js:126-139`; `CITY_END = 5590` (`world.js:212`) lỗi thời — TTTM nằm ở 5845 |
| B4 | **Tỉ lệ công trình lệch nhau**: Bưu điện cao 351px cạnh Cà phê 176px, Tạp hóa 190px, Băng đĩa 221px (đều scale 1). Ngân hàng / TechCorp (ảnh code) cao 380–400px, kính xanh hiện đại → lệch cả tỉ lệ lẫn tông. | `props.json` kích thước ảnh; `config.js:332-333` |
| B5 | **Nhãn POI luôn hiện, nhún liên tục** (24 nhãn), nằm đè lên biển hiệu có chữ sẵn ("Giảng đường" đè "TRƯỜNG ĐẠI HỌC", "Bưu Điện (Bưu tá)" đè "BƯU ĐIỆN"). | `world.js:333-338` |
| B6 | **Đồ phố không cùng nhịp**: cột/đèn mỗi 420px (`world.js:262`), cây mỗi 330px (`world.js:273`), vạch qua đường ở 6 vị trí tùy ý (`world.js:156`) → không bao giờ thẳng hàng; cây bị bỏ trống đoạn 1780–3620 (di sản ô quy hoạch sạp vỉa hè đã gỡ, `world.js:274`). |
| B7 | **Giao thông dày và chồng nhau**: 1 xe / 1,4s, tối đa 8 xe, cùng làn y cố định → 3–4 taxi chồng lên nhau, đè vạch qua đường. Trái G32 ("20–30 giây một chiếc"). | `world.js:89, 674-683` |
| B8 | **Vỉa hè trên rộng 140px trống trơn** (chỉ có cột điện) — giữa mặt tiền và đường là dải gạch đơn điệu, nhân vật đứng giữa khoảng trống. | `config.js:8` |

### Khu 3 · Làng Đại Học (x 0–1600)
- Ổn nhất: trường, nhà trọ, net cỏ, trà sữa liền nhau. Nhưng: Net cỏ (kính, đèn neon) lệch phong cách; neon glow còn bật dù Net là giải trí đang ẩn (G2).
- Gánh hàng `ganh_hang_v2` (1120,1010) không có người, nằm giữa cỏ; sân bóng + 2 khung thành tí hon + ghế đá → vô nghĩa vì không có chức năng.

### Khu 1 · Phố Ẩm Thực & Chợ Đêm (x 1600–4200)
- Mặt tiền thấp lè tè (cà phê 176px, tạp hóa 190px, chợ 235px) cạnh Bưu điện 351px → đường mái răng cưa, lộ trời.
- Nền gạch dưới đường rộng mênh mông với cụm cờ tướng, ghế gia đình, 2 em bé, xe mía (x 2420–3360, y 1000–1104) — nhỏ, không có lý do đứng đó.
- Biển đứng `sign_stand` (2700,470) + xe bánh mì + bà cụ dồn một chỗ; bộ cắt tóc + chú sửa xe + Cub + lốp dồn sát ATM ở x 3820–4290 → **cụm rối nhất bản đồ**.
- 2 cây ATM cách nhau 150px (`config.js:357-358`), ATM1 đứng ở vỉa hè dưới, nhãn đè lên cây.

### Khu 2 · Trung Tâm Tài Chính (x 4200–6060)
- VietBank & TechCorp là **ảnh vẽ bằng code** (khối kính xanh, chữ in) — chỗ "lạc tông" lớn nhất; đỉnh bị cắt.
- Showroom Xe Máy + Shop Thời Trang (ảnh code) đứng ở bãi đá phía dưới, kèm 2 xe máy đậu (`world.js:301-302`) → trái G32 (bỏ xe máy) và trùng quầy Thời trang trong TTTM.
- Lốp xe, đống phế liệu, xe Cub nát nằm trong Khu 2 (x 5780–6000) vì tọa độ còn theo bản đồ cũ (`world.js:305-307`); ve chai cũng sinh từ x 5660 (`server/npcs.js:155`).
- Chung cư (304px) và TTTM (340px) thấp hơn hẳn TechCorp (400px) đứng ngay cạnh.

### Khu 4 · Ngoại Ô & Bãi Phế Liệu (x 6060–6800)
- Vỉa hè lát gạch thành phố y hệt trung tâm → không thấy "ngoại ô".
- Đống phế liệu và lốp nằm **trên vỉa hè trên** (6120,560; 6560,560) chắn lối; cây trồng ở y 446 phía sau, nổi trên nền trời trơn.

### HUD (pane 597×470 và 1280×720)
| # | Vấn đề | Bằng chứng |
|---|---|---|
| H1 | HUD che ~40% màn hình nhỏ: thẻ chỉ số + đồng hồ + toast + chat mở sẵn (209×147) + hàng 9 nút đặt **giữa màn** phía trên chat + thanh nhanh. | `index.html:48-103` |
| H2 | Icon lẫn lộn: nút pixel art cạnh emoji 🧺 🛠️ 💬 😀 ❓. | `index.html:98-102` |
| H3 | Thẻ nhân vật quá dày: 3 nhu cầu + thanh cấp lớp + tiền mặt + ngân hàng + kim cương + danh vọng + 4G. | `index.html:51-61` |
| H4 | Banner LED chạy chữ toàn chiều ngang bị dùng cho tin thời tiết mỗi 3 giờ game, nội dung còn nói cơ chế đã bỏ ("xe chậm 50%", "nước mía trà đá đắt hàng"). | `server/game.js:632-637` |
| H5 | Chữ thừa trên phố: tên khu in mờ ở y 1180 (`world.js:167-171`), nhãn "🚓 Cảnh sát" trên NPC tô màu từ art cũ (`world.js:9`), "🦹 Kẻ khả nghi — click để đuổi!" dài (`world.js:578`). |

---

## C. Chỉnh KHÔNG cần art mới (đêm nay, mỗi mục = 1 commit nhỏ)

Kiểm tra chung sau mỗi commit: `npm test` (Node 24: `node --test server/tests/*.js`), mở preview `hangrong`, chụp 4 khu ở zoom 0,45 (`hangrong.scene.getScene('world').cameras.main.stopFollow(); …setZoom(0.45); …centerOn(x,620)`) và 1 ảnh zoom thường có HUD.

| # | Việc | File | Rủi ro | Kiểm tra |
|---|---|---|---|---|
| **C1** | **Nhãn POI theo khoảng cách**: ẩn mặc định, hiện khi người chơi ≤ 220px hoặc rê chuột vào vùng bấm; bỏ tween nhún; tối đa 3 nhãn gần nhất. POI có `BUILDINGS.sign` thì chỉ hiện nhãn khi rê chuột. Bỏ tên khu ở y 1180. | `client/src/world.js` (buildPois, update, buildGround) | Người mới khó tìm chỗ → đã có app Bản đồ + nút tương tác E | Đi dọc phố: không lúc nào > 3 nhãn |
| **C2** | **Ẩn POI đóng cửa / trùng**: Showroom Xe Máy (G2, G32), Shop Thời Trang (trùng quầy TTTM) → `hidden: true`, bỏ kiosk code. Gộp 2 ATM thành 1 ở vỉa hè trên cạnh ngân hàng (giữ `atm2`, ẩn `atm1`). Tắt neon Net cỏ (giải trí ẩn). | `shared/config.js` (POIS, BUILDINGS), `world.js:316-325` | Shipper / nhiệm vụ / app Bản đồ chọn POI ẩn → lọc `hidden` ở `server/jobs.js` + app Bản đồ | Nhận 3 đơn shipper liên tiếp, không đơn nào tới POI ẩn |
| **C3** | **Dọn props lạc**: bỏ gánh hàng không người, sân bóng + khung thành, cụm cờ tướng / ghế gia đình / 2 em bé / xe mía, biển đứng 2700, xe máy đậu + Cub nát (G32). Phế liệu, lốp chỉ đặt **trong sân vựa ve chai x ≥ 6100**, không trên vỉa hè. Vùng sinh ve chai 5660 → 6100. | `world.js:159-165, 279-307`; `server/npcs.js:155` | Gần như không | Không còn prop ở Khu 2 thuộc bãi phế liệu |
| **C4** | **Thu gọn chiều dọc bản đồ** (quan trọng nhất): `WORLD.height` 1200 → 960, `walk.y1` 1180 → 880. Dưới vỉa hè dưới (784–840) chỉ còn **dải lề 840–960**: hàng cây đều + bồn cỏ (tile có sẵn), không đi xuống được. Người đi đường tờ rơi `y: 830 + rnd(250)` → `800 + rnd(70)`. | `shared/config.js:4-11`, `world.js:140-171`, `server/jobs.js:134`, `server/game.js:194` (đã clamp vị trí cũ khi vào lại) | Vị trí lưu cũ y > 880 → đã clamp; zoom điện thoại `h/900` có thể thấy mép dưới → giữ bounds, kiểm tra 375×812 | `npm test`; vào bằng nhân vật đứng y 1100 cũ → về 880; điện thoại không thấy viền đen |
| **C5** | **Một nhịp đồ phố**: module 420px; vỉa hè trên: cột điện/đèn xen kẽ tại x = 210 + 420k; vỉa hè dưới: cây tại x = 420k (so le nửa nhịp), thùng rác mỗi 3 module; bỏ khoảng trống 1780–3620. Bỏ đồ phố nếu rơi trong ±70px cửa POI hoặc vạch qua đường (dịch sang module kế). Vạch qua đường: 1 vạch/khu, đặt ở giữa 2 POI, không trùng người bán (4190 đang trùng chú sửa xe). | `world.js:154-158, 260-278` | Đèn ít hơn ở vài chỗ → đêm tối hơn | Chụp đêm (minute 22:00) toàn phố, đèn đều |
| **C6** | **Giao thông thưa theo làn**: sinh xe 6–12s, tối đa 3 xe trong khung nhìn, cùng làn cách ≥ 300px (không sinh nếu chưa đủ khoảng), xe buýt 1/6. | `world.js:89, 671-684, 727-735` | Không | Đứng yên 60s: không 2 xe chồng nhau |
| **C7** | **Cân tỉ lệ bằng "thước cửa"**: đo chiều cao cửa chính trong từng ảnh công trình, đặt `scale` để cửa ≈ 110px và chiều cao rơi vào 3 bậc (A1); dời `x` để khe 0–30px; POI `x` theo. Dự kiến: cà phê, tạp hóa, băng đĩa ×1,2–1,35; Bưu điện ×0,9–0,95. | `shared/config.js` (BUILDINGS, POIS) | Công trình chồng nhau / biển hiệu lệch → sign.box là tỉ lệ nên tự theo | Ảnh zoom 0,45 mỗi khu: đường mái liền, không ai cao gấp đôi bên cạnh |
| **C8** | **Lấp trời + skyline dịu**: sửa `CITY_END` thành 6060 (sau TTTM) để nhà ống lấp khe TechCorp↔Chung cư↔TTTM; skyline còn 1 lớp màu gần màu trời (alpha ~0,45), thấp hơn, `scrollFactor 0.6` cho chiều sâu; bỏ bump CBD lan sang Khu 1. | `world.js:126-139, 212-231` | Thêm nhà ống che chân trời ngoại ô → giữ cây từ 6060 | Không lộ trời giữa công trình đoạn 0–6060 |
| **C9** | **Mặt đất liền mạch**: vỉa hè trên + dưới dùng chung 1 tile cả phố; chủ đề khu chỉ thể hiện ở dải lề 840–960 (cỏ / gạch / đá / đất); chỗ giao giữa 2 khu đặt 1 cây hoặc cột để che vết cắt. | `world.js:140-145` | Không | Ảnh tại x 1600, 4200, 6060 không còn vệt thẳng |
| **C10** | **Thông báo & chữ trên phố**: tin thời tiết chuyển sang toast + tab Tin tức (không LED); sửa câu thời tiết bỏ cơ chế cũ; LED chỉ cho người chơi trả kim cương + đấu giá. NPC Cảnh sát bỏ nhãn; trộm "🦹 Kẻ khả nghi" (bỏ "click để đuổi"). | `server/game.js:632-637`, `world.js:9, 578` | Không | Đổi giờ game qua mốc 3h → không banner chạy |
| **C11** | **HUD tối giản**: (a) chat thu gọn mặc định, mở bằng Enter / nút, có chấm báo tin mới; (b) gom nút thành **1 thanh đáy** cạnh thanh nhanh: Túi · Trang bị · Điện thoại · Nhiệm vụ · ☰ (Biểu cảm, Hướng dẫn, GM vào menu ☰); bỏ nút Chợ (đã có app Chợ trong điện thoại, phím B vẫn giữ); (c) thẻ nhân vật chỉ còn tên + 3 nhu cầu + tiền mặt; ngân hàng, kim cương, danh vọng, 4G, thanh cấp lớp chuyển vào app Ngân hàng / màn Trang bị; (d) emoji trên nút thay bằng icon pixel có sẵn trong `assets/ui`, `assets/icons` (chưa có thì giữ chữ, không emoji — art xin ở D9). | `client/index.html:46-103`, `client/src/ui.js`, `client/ui-v2.css`, `client/src/touch.js` | Cảm ứng: menu ☰ đã có trên điện thoại — gộp cho cả PC; xem mục responsive trong `docs/DEVELOPMENT.md` | Đo diện tích HUD bằng `getBoundingClientRect` ≤ 20% ở 1280×720; thử 375×812 |
| **C12** | **Công cụ mở rộng — bố cục dạng dữ liệu**: chuyển toàn bộ props / cây / đèn / vạch qua đường / lề khu đang hardcode trong `world.js` sang `shared/layout.js` (mảng `{key, x, y, zone}` + quy tắc nhịp C5); thêm chế độ xem bố cục `?layout=1`: lưới 100px, ranh khu, thước người 86px & cửa 110px, tên sprite khi rê. | `shared/layout.js` (mới), `world.js` | Thuần client | Bật `?layout=1` thấy lưới + thước; tắt thì như cũ |

**Thứ tự commit đêm nay:** C1 → C2 → C3 → C10 → C6 → C4 → C9 → C5 → C8 → C7 → C11 → C12. Sau cùng cập nhật `docs/ASSET_TODO.md` (+ `tools/asset_todo.py`, chạy lại để sinh `asset_todo.html`) theo mục D, `docs/ASSET_STATUS.md`, `docs/GAMELOG.md`, mục 7 `CLAUDE.md`.
**Push:** người dùng đã nói "push lên main luôn" trong yêu cầu gốc — người điều phối vẫn nên xác nhận lại một câu trước khi push (Render tự deploy), và theo memory nhánh làm việc là `claude`.

---

## D. Cần art mới / vẽ lại (ngày mai — Gem "Họa sĩ Hàng Rong")

Ảnh **mặt đất / lề / skyline** là ngoại lệ "nhiều tile trong 1 ảnh, mỗi tile lát nối được": các tile cách nhau bằng magenta để pipeline `tools/v2_manifest.py` tự tách. Asset nhân vật / NPC giữ nguyên trong `ASSET_TODO.md` (không lặp lại ở đây).

| # | File | Bố cục | Ưu tiên | Lý do |
|---|---|---|---|---|
| D1 | `tile_street.png` | 4 ô vuông ngang | **P0** | Thay tile vỉa hè / đường / bó vỉa / lề cỏ vẽ bằng code (`textures.js:295-355`) — nền chiếm 60% màn hình |
| D2 | `verge_zones.png` | 4 dải ngang lát nối trái-phải | **P0** | Dải lề 840–960 sau C4: mỗi khu một chủ đề |
| D3 | `skyline_far.png` | 1 dải dài lát nối | **P0** | Thay khối chữ nhật skyline code |
| D4 | `bld_bank.png` (vẽ lại theo tông retro) | 1 công trình | **P0** | Ảnh code kính xanh lạc tông nhất Khu 2 |
| D5 | `bld_office.png` (vẽ lại theo tông retro) | 1 công trình | **P0** (hoặc ẩn nếu người dùng chọn đóng TechCorp) | Như trên |
| D6 | `street_set.png` | 6 vật 1 hàng | **P1** | Một bộ đèn/cột/cây/thùng rác cùng tỉ lệ, cùng nét (hiện cây me 242px rộng gấp đôi cây bàng) |
| D7 | `yard_vechai.png` | 1 sân bãi | **P1** | Gom lốp + phế liệu thành 1 khối sân vựa thay 9 prop rải |
| D8 | `tube_9.png`, `tube_10.png` | 2 nhà ống | **P1** | Đủ mẫu lấp khe sau C7/C8 không lặp lộ |
| D9 | `ui_dock_icons.png` | lưới 4×2 | **P1** | Thay emoji trên thanh nút HUD (C11) |
| D10 | `zone_gate_set.png` | 4 vật 1 hàng | **P2** | Mốc nhận diện ranh khu (cổng chào, bảng tên không chữ) |

Khối STYLE dùng chung (đã có trong ASSET_TODO) được dán ở cuối mỗi prompt.

#### D1 — `tile_street.png`
```
Game texture set: EXACTLY 4 square ground tiles in one horizontal row, each tile the same size, separated by wide flat magenta #FF00FF gaps. Each tile is seen straight from above (flat top-down, no perspective) and MUST tile seamlessly on all four edges (left matches right, top matches bottom) with no visible border, no vignette, no lighting gradient. From left to right: (1) Saigon sidewalk paving: small worn square cement tiles in cream-grey with faint terracotta accents and a few hairline cracks; (2) asphalt road: dark charcoal-blue asphalt with subtle grain and one faint patch, no lane markings; (3) granite curb stone: grey granite kerb blocks seen from above, joints every quarter tile; (4) roadside grass verge: short tropical grass with tiny weeds and a little bare soil. Muted palette matching the attached references.
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D2 — `verge_zones.png`
```
Game asset set: EXACTLY 4 long horizontal strips stacked vertically with wide flat magenta #FF00FF gaps between them, each strip about 6 times wider than tall, each MUST tile seamlessly left-to-right (left edge continues the right edge). Each strip is a roadside verge seen in 3/4 top-down view, running along the bottom of a street, low (no taller than an adult's knee except plants). From top to bottom: (1) UNIVERSITY: neat green hedge in a red-brick planter with a low cream painted iron railing; (2) FOOD STREET: worn terracotta brick planter with potted herbs, small plastic pots and a low blue-painted railing; (3) FINANCIAL DISTRICT: polished grey granite planter box with trimmed boxwood and a brushed metal edge; (4) SUBURB: rusty corrugated metal fence low section with tall weeds and packed dirt. No people, no vehicles.
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D3 — `skyline_far.png`
```
Game background asset: ONE long horizontal strip of a distant Saigon city skyline silhouette, about 5 times wider than tall, that MUST tile seamlessly left-to-right. Hazy, low-contrast, desaturated blue-grey and dusty lavender tones as if seen through warm afternoon haze; mix of 1990s tube houses, a few mid-rise blocks, water towers, TV antennas, tangled power lines, one old church spire and a couple of cranes. Flat front view, no strong outlines (lighter outline than foreground assets), no lit windows, no sky drawn — only the silhouette shapes, sitting on a flat bottom edge.
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D4 — `bld_bank.png`
```
Game asset: front elevation facade of a 1990s Saigon bank branch, 3 storeys, French-colonial-meets-1990s style: ochre and cream plastered walls, tall arched windows with dark green shutters, a marble-step entrance with brass double doors at the bottom center (door height about 1.3 times an adult's height), an iron-grille security gate folded open, a small ATM niche to the right of the door, potted palms, air-conditioner units on the side, and a large EMPTY blank signboard plate above the entrance. Width to height ratio 1.3:1. Seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front).
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D5 — `bld_office.png`
```
Game asset: front elevation facade of a late-1990s Saigon office building, 4 storeys, concrete and teal-tinted glass ribbon windows with horizontal sun-shade fins, a small glass lobby entrance at the bottom center (door height about 1.3 times an adult's height), a security booth beside the door, a row of concrete planters with small shrubs, rooftop water tank and antenna, faded paint and a few air-conditioner units, and a large EMPTY blank signboard plate across the top of the ground floor. Width to height ratio 1.3:1, NOT a skyscraper. Seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front).
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D6 — `street_set.png`
```
Game asset set: EXACTLY 6 street furniture objects in one horizontal row with wide even gaps, all drawn at the SAME scale (an adult would be 1 unit tall): (1) a concrete electric pole with a crossbar, insulators and a few tangled cables ending short, 3.2 units tall; (2) a single-arm 1990s street lamp with a curved green-painted pole, 2.8 units tall; (3) a tamarind tree (cay me) with a feathery round canopy in a square iron tree grate, 2.6 units tall and 1.6 wide; (4) an Indian almond tree (cay bang) with layered flat canopy in the same tree grate, 2.6 units tall and 1.6 wide; (5) a green municipal wheeled trash bin, 0.6 units; (6) a stone park bench, 0.5 units tall. Each object standing upright in 3/4 top-down front view, bases on the same baseline.
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D7 — `yard_vechai.png`
```
Game asset: ONE single compact scrap yard ground patch seen in 3/4 top-down view, about 3 times wider than tall, to sit beside a Vietnamese scrap dealer shop: a packed-dirt yard with neat piles of flattened cardboard tied with string, a stack of old tires, a heap of aluminium cans in a woven sack, a rusty bicycle frame, an old weighing scale and a low corrugated sheet fence along the back edge. Everything grouped into one connected object with soft irregular edges, no people, no vehicles with engines.
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D8 — `tube_9.png`, `tube_10.png` (2 ảnh riêng, đổi màu tường)
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 storeys, {tube_9: faded salmon pink walls with a turquoise iron balcony grille and a bougainvillea vine | tube_10: dusty sky-blue walls with wooden shutters, a small altar window and a rooftop water tank}, ground floor with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3, same scale as the attached tube house references (the ground floor door is about 1.3 times an adult's height).
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### D9 — `ui_dock_icons.png`
```
Game UI icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, same scale and lighting, perfectly flat front view, bold pixel outlines, readable at 32x32 pixels. Icons in order: (1) woven market basket with produce; (2) speech bubble; (3) smiling face badge; (4) open guide book; (5) hamburger menu of three wooden bars; (6) brass wrench; (7) folded paper map; (8) small bell with a dot for notifications.
STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### D10 — `zone_gate_set.png`
```
Game asset set: EXACTLY 4 roadside zone landmark objects in one horizontal row with wide even gaps, same scale (an adult is 1 unit tall), each about 2.5 units tall, 3/4 top-down front view, each with an EMPTY blank plate where a name would go: (1) UNIVERSITY: a cream concrete pillar gate post with a small blank bronze plaque and a flowering frangipani; (2) FOOD STREET: a red-and-yellow festive lantern post with a blank wooden hanging board; (3) FINANCIAL DISTRICT: a polished granite monolith marker with a blank brass plate; (4) SUBURB: a leaning wooden post with a blank rusty tin sign and a tied bundle of scrap.
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

**Cập nhật pipeline khi nhận ảnh:** thêm tên vào `tools/v2_manifest.py`; tile (D1–D3) nạp vào `world.js` thay `genGround`; xóa `bld_bank`/`bld_office` khỏi nhóm "Hoãn lại" trong `tools/asset_todo.py` (đã nâng P0, prompt mới ở trên).

---

## E. Kế hoạch mở rộng game (sau phần dọn UI)

| # | Hạng mục | Cần người dùng quyết | Art | Đêm nay? |
|---|---|---|---|---|
| E1 | **Công cụ mở rộng dự án** (C12 + `tools/scale_check.py` báo chiều cao cửa/công trình so với thước 110px + mẫu "thêm công trình mới" 1 dòng config) | Xác nhận đúng ý "công cụ mở rộng" (F1) | Không | **Có** (C12) |
| E2 | **I2 giới hạn chồng** (ăn 10, nguyên liệu 20, ve chai 50, trang bị/nội thất 1) — nối tiếp commit I1 vừa rồi | Không (đã có thông số INVENTORY_V2) | Không | **Có** |
| E3 | **G32 gỡ xe máy khỏi code**: item `xe_*`, Showroom, tư thế lái, `cub_rider`, prop Cub của chú sửa xe | Xe đã mua xử lý sao (hoàn tiền / đổi đồ)? Chú Sửa Xe giữ (sửa xe đạp) hay bỏ? | Không | Phần hình (C2/C3) **có**; dữ liệu người chơi **chờ** |
| E4 | **G29–G31 tuyến buýt + taxi**: 4 trạm (1/khu), 1 xe buýt server điều khiển, vé 7k/SV 3,5k, chu kỳ 90s, dừng 8s; taxi gọi qua app/điểm đón | Giá taxi (theo km?), có cho đi buýt khi đang làm ca shipper? | Đã có `bus_stop`, `taxi_stand`, `veh_bus_open`, `v2/ui/bus_map` | Spec đủ để làm, nhưng lớn → **đề xuất phiên kế tiếp** sau khi C xong |
| E5 | **G8 hóa đơn tuần** (trọ + học phí + điện, nợ 2 tuần trả phòng) | Học phí bao nhiêu/tuần? Ngày chốt (Chủ nhật 0h)? Chung cư thuê có gộp vào? | Đã có `v2/ui/contract`, `bill` | **Chờ** con số học phí |
| E6 | **UI ATM / Bưu điện** (G38, G39) — thay hộp thoại chữ bằng màn có ảnh | Không (giữ logic hiện tại) | Đã có `v2/ui/atm`, `post_*` | **Có** nếu còn thời gian |
| E7 | **G28 đồ lớn giao sau 1 giờ game** | Có muốn chờ không, hay giữ vào túi ngay? | Không | Chờ |
| E8 | **I8 đồ tươi hỏng / I9 kho ở nhà** | I8 có giữ không (tài liệu ghi "có thể bỏ") | Không | Chờ |
| E9 | **J4 Pha cà phê** | Không | Cần `job_coffee_counter`, `job_coffee_steps`, `npc_cafe` (đã có prompt ở ASSET_TODO mục 7–8) | Chờ art |

---

## F. Câu hỏi cho người dùng sáng mai

1. "Công cụ mở rộng dự án" có phải là **công cụ cho dev** (bố cục dạng dữ liệu, chế độ xem lưới/thước, script kiểm tỉ lệ) như mục C12/E1 không? Hay ý bạn là một **trình chỉnh bản đồ kéo-thả** trong trình duyệt?
2. Thu gọn bản đồ: bỏ hẳn nửa dưới (sân bóng, bãi gạch, Showroom, Shop Thời Trang) như C4 — đồng ý? Sau này muốn có **dãy nhà phía nam đường** (cần vẽ thêm) hay giữ phố một mặt tiền?
3. **TechCorp và Ngân hàng**: vẽ lại theo tông retro (D4, D5) hay đóng TechCorp (G2) và lấp bằng nhà ống? (Lớp Nhân viên văn phòng đang chấm công ở TechCorp.)
4. **Cảnh sát & Ăn trộm** còn chạy dù đã bỏ phạt vỉa hè (G53): giữ trộm + cảnh sát, chỉ giữ trộm, hay tắt cả hai?
5. Chú Sửa Xe + xe Cub: sau G32 còn ý nghĩa không — đổi thành sửa xe đạp / bỏ?
6. Học phí tuần cho G8 là bao nhiêu? Tiền trọ chuyển sang tuần 150k (G19) đúng chưa?
7. Giá taxi (G31): cố định theo khu hay theo quãng đường?
8. Thanh nút HUD gộp vào menu ☰ (Biểu cảm, Hướng dẫn) — ổn chứ? Thẻ nhân vật chỉ còn 3 nhu cầu + tiền mặt — ổn chứ?
9. Thứ tự vẽ ngày mai: đề xuất **D1 → D2 → D3 → D4/D5** trước (làm phố liền mạch), sau đó D6–D10 và các ảnh cũ trong ASSET_TODO.
