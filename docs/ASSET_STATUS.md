# Tình trạng asset (đối chiếu `docs/ASSET_PROMPTS.md`)

> **Danh sách cần làm kèm prompt copy dán được ngay: [`ASSET_TODO.md`](ASSET_TODO.md).**

Cập nhật sau lần nhập `asset_new_by_khoit/` (30 file). Quy trình build: `npm run assets`.

## ✅ Đã dùng trong game

> **Gỡ khỏi bản đồ 2026-10-07 (người dùng yêu cầu):** người lái xe máy trong giao thông (`cub_rider` — chỉ còn dùng khi người chơi tự cưỡi xe), trạm buýt + điểm taxi, bàn bán + cô bán cà phê (`coffee_table`, `npc_cafe`), bàn trà đá vỉa hè (`table_tra_da`), anh chủ quán net ngồi (`npc_netco`), cô Ba tạp hóa ngồi bán (`npc_taphoa`). Hộp thoại các quán vẫn giữ (kể cả chân dung).

| Mục | Asset | File nguồn |
|---|---|---|
| 2 | `sv_male` đủ 6 dải (đứng, đi xuống, đi lên, đi ngang, đứng quay hướng, ngồi lái) | `art_srccharssv_male*.png` |
| 2 | `sv_female` 5 dải | `sv_female.jpg` |
| 4 | 10 NPC đang làm việc: bà cụ bánh mì, ông vé số, thợ cắt tóc, cô cà phê, cô Ba tạp hóa, chú sửa xe, chú ve chai, MC đấu giá, bảo vệ, chủ quán net | `NPC.jpg` |
| 5 | 7 xe + taxi phụ: Cub, tay ga, phân khối lớn, xe đạp, xe giao hàng, taxi ×2, xe buýt | `VEHICLE.png` |
| 6 | 8 công trình: trường ĐH, nhà trọ, net cỏ, bưu điện, cà phê, băng đĩa, bida, tạp hóa (biển hiệu do game in chữ) | `Congtrinh.jpg` |
| 7 | 48 icon vật phẩm + 8 icon tiền tệ / giao diện | `item.png` |
| 8 | 27 props: sạp 3 cấp, xe đẩy, gánh, ghế nhựa, cây, cột điện, đèn đường, ATM, bàn trà đá, cờ tướng, lốp, thùng rác, ghế đá, khung thành, bộ cắt tóc, biển đứng, đống phế liệu, ve chai, nắp cống | `props.jpg` |
| — | Ảnh nền màn đăng nhập | `Img_Login.jpg` |

### Đợt V2 — nhận 2026-10-07 (17 file đơn, cắt bằng `tools/ui_manifest.py`)

| Asset | Dùng ở đâu | File nguồn |
|---|---|---|
| Khung panel + thanh tiêu đề + nút đóng | Mọi hộp thoại, Túi đồ, Trang bị, HUD, mini-game (`assets/ui/panel.png` …) | `ui_wood_paper_panel.png` |
| 8 ô túi (trống, chọn, khóa, 4 độ hiếm, ô nhanh) | Túi đồ dạng lưới | `ui_slots.png` |
| 6 icon tab lọc | Túi đồ (đủ 6 tab, có tab Nội thất) | `ui_tabs.png` |
| Nút 4 trạng thái | Mọi nút | `ui_buttons.png` |
| Khung thông tin + thanh dùng nhanh 5 ô | Ô thông tin rê chuột, thông báo (toast), thanh phím 1–5 | `ui_tooltip_hotbar.png` |
| Nền búp bê giấy 8 ô | Màn Trang bị (phím C) | `ui_equipment_screen.png` |
| 8 icon ô trang bị trống | Đã cắt (`assets/ui/eq_*.png`) — chưa cần vì nền búp bê đã vẽ sẵn | `ui_equip_placeholders.png` |
| 8 icon HUD | No bụng / Năng lượng / Tinh thần, đồng hồ, nhiệm vụ. Nhà, ngủ, tiền điện: chưa có tính năng → chưa dùng | `ui_hud_icons.png` |
| Khung điện thoại + 8 icon app | Điện thoại (phím P). App Taxi tạm ẩn | `ui_phone.png`, `ui_phone_apps.png` |
| Quán cơm tấm, Tiệm trà sữa | Công trình mới (Khu 1 x=3905, Khu 3 x=1545) | `building_com_tam_facade.png`, `building_bubble_tea_facade.png` |
| Màn hình code + 6 khối lệnh + 2 bug | Mini-game J1 IT | `job_it.png` |
| Sàn quán + 8 món | Mini-game J2 Phục vụ; 4 món làm icon vật phẩm mới (cơm sườn, cơm bì chả, canh, trứng ốp la) | `job_waiter_floor.png`, `job_waiter_items.png` |
| Quầy pha trà sữa | Mini-game J3 Trà sữa | `job_milktea_items.png` (**nội dung là quầy**, không phải icon ly/topping) |
| Bàn pha cà phê (nhìn nghiêng) | Đồ trang trí cạnh Cà Phê Vỉa Hè | `prop_coffee_prep_table.png` |

**Lỗi nhỏ đợt này (không chặn):** ✦ watermark Gemini dính trên ảnh *nền kín* `job_waiter_floor.png` (góc phải dưới) và `job_milktea_items.png` (góc phải dưới) — ảnh nền magenta thì pipeline tự xóa được. `job_milktea_items.png` gửi nhầm nội dung (quầy thay vì 12 icon ly & topping).

### Đợt V2 lần 2 — nhận 2026-10-07 (68 file, commit `977ec5b`, cắt bằng `tools/v2_manifest.py`)

Tự tách blob theo nền magenta (chữ, số thứ tự, người mẫu tham chiếu, ✦ trên nền magenta đều bị bỏ). Kiểm tra lại bằng mắt: `tools/out/_rev_*.png` (tạo khi chạy kiểm tra, không commit).

**Đang dùng trong game**

| Asset | Dùng ở đâu | File nguồn |
|---|---|---|
| Vựa ve chai | Thay ảnh tạm ở Khu 4 (x=6250), biển hiệu in chữ "VỰA VE CHAI CHÚ TƯ" | `bld_vechai.png` |
| 7 nhà ống | Thay ảnh tạm lấp khe giữa các công trình (đặt lùi sau, mép khuất sau nhà bên cạnh) | `tube_1..4, 6..8.png` |
| Xe buýt mới | Giao thông (thay xe buýt cũ dính watermark) | `veh_bus.png` |
| Trạm xe buýt ×4, điểm đón taxi ×2 | ~~Trang trí vỉa hè~~ — **đã gỡ khỏi bản đồ (2026-10-07)**, để dành khi làm tuyến buýt / taxi (G29–G31) | `bus_stop.png`, `taxi_stand.png` |
| 6 chân dung | Ảnh NPC trong hộp thoại: bánh mì, cà phê, tạp hóa, sửa xe, ve chai, bưu tá (`assets/ui/portrait_*.png`) | `ui_portraits.png` |
| 60 icon vật phẩm | `assets/icons/`: 12 món nấu `mon_*`, 12 nguyên liệu `nl_*` (nấu ăn), 28 trang bị `gear_*` (TTTM + Gacha), laptop / điện thoại `laptop_*`, `dt_*` (quầy Điện tử), `gacha_manh` (Mảnh lấp lánh). Chưa dùng: tai nghe ×2, loa, sạc dự phòng, `gacha_capsule/xu/ve_vang` | `icons_*.png` |

**Vào game 2026-10-07 (lần 3 — code tính năng theo art đã cắt)** — vẫn để trong `client/assets/v2/`, client tham chiếu thẳng đường dẫn

| Asset | Dùng ở đâu |
|---|---|
| `v2/jobs/*` (bản đồ thành phố, tờ rơi, thẻ / thùng / đồng hồ shipper, vở & bảng gia sư) | Nghề J5 Phát tờ rơi, J6 Shipper (HUD + bản đồ), J8 Gia sư |
| `v2/ui/chalkboard`, `card_*` | Thi Chứng chỉ Gia sư ở Giảng đường + thẻ đáp án gia sư |
| `v2/furn/*` (60 món) | Nội thất trong phòng trọ + quầy TTTM |
| `v2/rooms/room_tro`, `room_mall` | Phòng trọ (sắp xếp, ngủ, TV, bếp) · Sảnh TTTM |
| `v2/ui/cooking_stove_v2`, `star_full`, `cook_timer` | Màn nấu ăn |
| `v2/bld/b_mall` | Tòa TTTM trên bản đồ (Khu 2, x=5800, phóng 1,35) |
| `v2/anim/npc_mall_giadung`, `npc_mall_noithat` | 5 nhân viên quầy TTTM (2 ảnh dùng chung cho cả 5 quầy theo ý người dùng) |
| `v2/ui/mall_*` (5 banner) | Đầu trang mỗi quầy TTTM |
| `v2/props/gacha_machine`, `v2/ui/gacha_open_1..6`, `reveal_*` | Máy Gacha + hoạt ảnh mở viên nang |

| `v2/bld/b_market`, `v2/rooms/room_market`, `v2/props/mstall_1..3`, `v2/ui/market_card/tag/stamp/search` | Chợ Sạp Hàng Hóa (thay CLB Bida, Khu 1 x=3290, phóng 1,15) — lần 4 |

| `v2/bld/b_apartment`, `v2/rooms/room_apartment` | Chung cư (thay Nhà Đấu Giá, Khu 2 x=5445, phóng 1,2) — lần 5 |

Chưa dùng: `veh_bus_open`, `banner_school`, `atm`, `bus_map`, `contract`, `bill`, `post_*`, `recipe_book`, `star_half`, `cooking_stove` (bản 1).

Thôi dùng (2026-10-07): `b_bida` (CLB Bida thay bằng Chợ), `stall_lv1..3` + ô quy hoạch (sạp vỉa hè đã bỏ — G53), `npc_thanhnien` làm Giang hồ.

**Đã cắt sẵn (bảng gốc lúc nhập — phần đã vào game xem mục "lần 3" ở trên)** — `client/assets/v2/` (danh sách + kích thước: `v2/v2.json`, không nạp lúc vào game)

| Nhóm | Asset | Tính năng chờ |
|---|---|---|
| `v2/furn/` | 20 loại nội thất × 3 phân khúc (`bed_1..3`, `fridge_1..3`…) | Trang trí phòng (G22) |
| `v2/rooms/` | Phòng trọ, căn hộ, sảnh TTTM, trong chợ (1024×572) | Nhà ở, TTTM, Chợ (G19–G28) |
| `v2/bld/` | Tòa chung cư, TTTM, Chợ Sạp Hàng Hóa | Đặt lên bản đồ khi làm tính năng |
| `v2/props/` | Máy gacha, 3 cỡ sạp chợ, xe buýt cửa mở | Gacha, Chợ, tuyến buýt |
| `v2/anim/` | Nhân viên quầy Gia dụng (4 frame) | TTTM |
| `v2/jobs/` | Bản đồ thành phố, tờ rơi, thẻ địa chỉ/thùng/đồng hồ shipper, vở & bảng gia sư | Nghề J5, J6, J8 |
| `v2/ui/` | Banner trường, bảng đen + 4 thẻ đáp án, ATM, bưu điện + phong bì, hợp đồng + hóa đơn, sơ đồ tuyến buýt, 2 mặt bếp nấu, sách công thức + sao + hẹn giờ, 6 frame mở gacha, 4 nền lộ diện, 5 banner quầy TTTM, 4 phần tử giao diện chợ | Trường, ATM, Bưu điện, Nhà trọ, Nấu ăn, Gacha, TTTM, Chợ |

**Lỗi đợt này**

| File | Lỗi | Xử lý |
|---|---|---|
| `ui_portraits.png` | Ô 4 (chủ quán cơm tấm) vẽ thành **đàn ông**; ô 5 (chủ tiệm trà sữa) vẽ thành **cậu bé** | Chưa gắn 2 ô này; xin vẽ lại `ui_portraits_2.png` (prompt trong ASSET_TODO) |
| `npc_mall_noithat.png` | Áo **cam** giống hệt quầy Gia dụng (cần áo nâu) | Chưa dùng; xin vẽ lại |
| `room_*.png` (4 ảnh) | ✦ watermark Gemini trên nền kín (góc phải dưới) | Không chặn — như `job_waiter_floor`; che bằng giao diện khi dùng |
| `furn_bookshelf.png`, `furn_sofa.png`, `icons_gear_*` | Có chữ (BUDGET/COMMON…) và người mẫu tham chiếu | Pipeline tự bỏ — lần sau nhắc Gem không vẽ |
| `icons_electronics.png` | Lưới lệch: 4 điện thoại (mẫu 4 trùng mẫu cao cấp), hàng laptop có ô trống | Đủ 12 icon, bỏ mẫu trùng |
| `ui_recipe.png` | Sao rỗng viền tím bị tách nền mất | Không chặn — khi code dùng sao đầy tô xám làm sao rỗng |
| `tube_8.png` | Màu kem (đúng ra là màu của số 5) | Dùng bình thường; xin `tube_5` màu xanh cốm |
| `ui_cooking_stove_v2.png` | File thêm ngoài danh sách | Cắt cả 2 bản, chọn khi code nấu ăn |

## ❌ Còn thiếu — đang dùng art cũ hoặc ảnh tạm vẽ bằng code

### Ưu tiên cao
| Asset (mã trong ASSET_PROMPTS) | Hiện đang dùng |
|---|---|
| `sv_female/walk_down.png` (mục 2) | Dải đứng yên → nhân vật "trượt" khi đi xuống |
| `vp_male`, `vp_female`, `tt_male`, `tt_female` — mỗi bộ 6 dải (mục 2) | `vp_male` + `baba_female` + `aodai_female` từ concept cũ (thiếu frame, chưa có tư thế lái xe nên dùng ảnh người đi Cub chung) |
| `police`, `thief`, `gangster` — 4 dải + `thief_run_left` (mục 3) | Nhân vật cũ tô lại màu |
| `postman` (mục 3) | Bưu tá ảnh tĩnh từ concept cũ |
| `bld_bank`, `bld_office`, `bld_auction`, `bld_showroom`, `bld_fashion` (mục 6) | Ảnh tạm vẽ bằng code |
| `tube_5` (nhà ống thứ 8) | 7 nhà ống khác đã có art |
| `npc_boss_comtam`, `npc_boss_trasua`, `npc_mall_dientu/thoitrang/sieuthi`, `furn_plant/curtain/painting/clock`, `job_coffee_*` | Xem ASSET_TODO |

### Ưu tiên thường
| Asset | Hiện đang dùng |
|---|---|
| `walker_old`, `walker_mom`, `walker_kid` (mục 3) | Gia đình + 2 em bé đứng yên từ concept cũ |
| NPC lái xe cho giao thông (tư thế `ride_left` của người đi đường) | Ảnh "thanh niên đi Cub" cũ; ô tô / xe buýt không cần người lái |
| `bld_barber`, `bld_garage` (mục 6) | Thợ cắt tóc / sửa xe đứng ngoài vỉa hè (vẫn hợp lý) |
| `shack_1..3` (mục 6) | Cây xanh thay lều ở Ngoại ô |
| Icon xe phân khối lớn | Emoji 🏍️ |

## ⚠️ Lỗi trong ảnh đã nhận — nên tạo lại

| File | Lỗi |
|---|---|
| `VEHICLE.png` — xe tay ga | Có thêm một mảnh gương/đầu xe thừa bên cạnh (đã tự bỏ, không ảnh hưởng) |
| `NPC.jpg` — cô chủ cà phê | Chỉ 2 frame (cần 6) → động tác giật |
| `NPC.jpg` — cô Ba tạp hóa | 4 frame (cần 6) |
| `art_srccharssv_male*` | Tên file mất dấu `/` — vẫn đọc được, lần sau đặt `sv_male_walk_down.png` cho rõ |
| `walk_left`, `ride_left`, `idle_up_left` | AI vẽ quay **phải** — pipeline tự lật (khai báo trong `tools/import_new_art.py` → `FACING`) |

## ➕ Asset phát sinh (chưa có trong ASSET_PROMPTS)

**Người lái xe cho giao thông** — `traffic_rider_male.png`, `traffic_rider_female.png` (mỗi file 6 frame, dùng mẫu dải ở mục 2.2):
```
Animation: seated riding pose as if on a motorbike seat, side profile facing left, both arms reaching
forward holding invisible handlebars, slight bobbing, NO motorbike drawn.
Character: {male: Vietnamese man around 35 wearing a half-face motorbike helmet, cloth face mask, long-sleeve
jacket, dark trousers, sandals | female: Vietnamese woman around 30 wearing a pastel helmet, anti-sun hooded
jacket, face mask, long sun-protection skirt, sandals}
```

**Icon xe phân khối lớn** — `icon_xe_pkl.png`:
```
Single game item icon, centered: a matte black sport motorcycle with orange accents, front 3/4 view,
bold pixel outlines, same style as the other item icons.
```

## Ghi chú khi gửi ảnh mới
- Sheet gộp nhiều dải (như `sv_female.jpg`): ghi kèm mỗi hàng là hành động gì, tôi khai báo vào `SHEETS` trong `tools/import_new_art.py`.
- Sheet đồ vật: thứ tự trong ảnh được map bằng mã blob `hàng.cột` (xem `tools/out/new/_contact_*.png` sau khi chạy `python tools/contact_new.py`), cấu hình ở `tools/new_manifest.py`.

## Cần vẽ thêm — Thị trấn liền mạch (2026-10-08)

Kết quả rà soát toàn bộ giao diện thị trấn (xem [NIGHT_PLAN.md](NIGHT_PLAN.md)): từng ảnh đẹp nhưng gộp lại rối vì khác tỉ lệ / tông / nhịp. Đã chỉnh bằng code những gì không cần art; phần còn lại cần vẽ, **mỗi ảnh kèm prompt đầy đủ ở nhóm 0 của [ASSET_TODO.md](ASSET_TODO.md) / `asset_todo.html`**:

| Ưu tiên | File | Vì sao |
|---|---|---|
| P0 | `tile_street.png` | Thay tile vỉa hè / đường / bó vỉa / lề cỏ vẽ bằng code (nền chiếm ~60% màn hình) |
| P0 | `verge_zones.png` | Dải lề dưới phố, mỗi khu một chủ đề |
| P0 | `skyline_far.png` | Thay khối chữ nhật skyline vẽ bằng code |
| P0 | `bld_bank.png`, `bld_office.png` (vẽ lại tông retro) | Hai công trình kính xanh vẽ bằng code lạc tông nhất Khu 2 |
| P1 | `street_set.png`, `yard_vechai.png`, `tube_9.png`, `tube_10.png`, `ui_dock_icons.png` | Đồ phố cùng tỉ lệ, sân vựa ve chai, nhà ống lấp khe, icon thay emoji HUD |
| P2 | `zone_gate_set.png` | Mốc nhận diện ranh khu |
