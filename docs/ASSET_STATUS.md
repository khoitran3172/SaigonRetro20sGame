# Tình trạng asset (đối chiếu `docs/ASSET_PROMPTS.md`)

> **Danh sách cần làm kèm prompt copy dán được ngay: [`ASSET_TODO.md`](ASSET_TODO.md).**

Cập nhật sau lần nhập `asset_new_by_khoit/` (30 file). Quy trình build: `npm run assets`.

## ✅ Đã dùng trong game

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
| 6 icon tab lọc | Túi đồ (tab Nội thất tạm ẩn — chưa có nội thất) | `ui_tabs.png` |
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

## ❌ Còn thiếu — đang dùng art cũ hoặc ảnh tạm vẽ bằng code

### Ưu tiên cao
| Asset (mã trong ASSET_PROMPTS) | Hiện đang dùng |
|---|---|
| `sv_female/walk_down.png` (mục 2) | Dải đứng yên → nhân vật "trượt" khi đi xuống |
| `vp_male`, `vp_female`, `tt_male`, `tt_female` — mỗi bộ 6 dải (mục 2) | `vp_male` + `baba_female` + `aodai_female` từ concept cũ (thiếu frame, chưa có tư thế lái xe nên dùng ảnh người đi Cub chung) |
| `police`, `thief`, `gangster` — 4 dải + `thief_run_left` (mục 3) | Nhân vật cũ tô lại màu |
| `postman` (mục 3) | Bưu tá ảnh tĩnh từ concept cũ |
| `bld_bank`, `bld_office`, `bld_auction`, `bld_showroom`, `bld_fashion`, `bld_vechai` (mục 6) | Ảnh tạm vẽ bằng code |
| 8 nhà ống `tube_*` (mục 6) | Ảnh tạm vẽ bằng code, lấp khoảng trống giữa các công trình |

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
| `VEHICLE.png` — xe buýt | Dấu ✦ watermark Gemini nằm trên thân xe (thấy rõ trong game) |
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
