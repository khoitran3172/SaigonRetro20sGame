# Hàng Rong — Danh sách asset cần làm lại & prompt tạo ảnh

## 0. Vì sao bản đầu bị lỗi (để không lặp lại)

| Lỗi trong game hiện tại | Nguyên nhân từ ảnh concept | Quy tắc mới |
|---|---|---|
| Viền trắng lem quanh nhân vật | Nền trắng, nhân vật cũng có áo trắng/sáng | Nền **màu magenta đặc #FF00FF** |
| Sai hướng đi, giật khi đi | Nhãn hướng ghi sai, mỗi hàng số frame khác nhau (5, 6, 2…) | **1 ảnh = 1 hành động = đúng 6 frame** trên 1 hàng ngang |
| Áo dài không có hướng đi lên, bà ba chỉ có 2 frame đi lên | Sheet thiếu hướng | Mỗi nhân vật đủ **6 dải** (xem mục 2) |
| Cảnh sát / trộm / giang hồ là nhân vật cũ tô màu | Không có art | Có sheet riêng (mục 3) |
| Ai đi xe cũng là cùng 1 anh thanh niên | Chỉ có 1 ảnh người ngồi xe | Xe vẽ **riêng**, mỗi nhân vật có **tư thế ngồi lái** riêng (mục 5) |
| Chữ trên biển hiệu méo, sai dấu | AI không viết đúng tiếng Việt | Biển hiệu **để trống**, game tự in chữ |
| Kích thước lệch nhau (xe đẩy to hơn người…) | Mỗi sheet một tỉ lệ | Tuân thủ **bảng kích thước** (mục 1.3) |
| Icon vật phẩm đang dùng emoji | Không có art | Bộ icon riêng (mục 7) |

---

## 1. Quy chuẩn kỹ thuật (BẮT BUỘC cho mọi ảnh)

### 1.1 Nền và nội dung
- Nền **một màu magenta đặc `#FF00FF`**, không gradient, không hoa văn. Nếu công cụ hỗ trợ xuất PNG nền trong suốt thì càng tốt.
- **Không chữ, không nhãn, không số frame, không watermark/logo** (kể cả dấu ✦ của Gemini ở góc — nếu có thì cắt đi).
- **Không bóng đổ dưới chân, không vẽ nền đất** (game tự vẽ bóng). Riêng tòa nhà: có đường nền phẳng ở mép dưới.
- Không dùng màu magenta trong trang phục/đồ vật (để tách nền không bị thủng).
- Các vật thể **không chạm/đè nhau**, cách nhau tối thiểu ~20px.

### 1.2 Góc nhìn và phong cách
- Góc nhìn **3/4 từ trên xuống, nhìn chính diện** (camera cao ~30°) — giống các ảnh concept hiện có.
- Pixel art 16-bit, ánh sáng từ trên-trái, viền nâu đậm.
- **Đính kèm ảnh `NPC.png` làm ảnh tham chiếu phong cách** (style reference) mỗi lần tạo để đồng bộ.

### 1.3 Bảng kích thước (tỉ lệ so với chiều cao nhân vật = 1 đơn vị)

| Loại | Kích thước trong game | Nên tạo ảnh ở (×3) |
|---|---|---|
| Nhân vật người lớn | cao ~80px | cao ~240px, mỗi frame ~256×256 |
| Trẻ em | 0.65 | |
| Ghế nhựa | 0.35 | |
| Xe đẩy bánh mì / vé số | 1.0 cao × 1.1 rộng | |
| Xe Cub (nhìn ngang) | 0.75 cao × 1.5 rộng | |
| Cửa ra vào tòa nhà | 1.3 cao | |
| Nhà ống | rộng 1.2–1.5, cao 3–3.5 | |
| Tòa nhà lớn | xem bảng mục 6 | |

### 1.4 Quy cách dải animation
- **1 ảnh = 1 hành động, 1 hàng ngang, đúng 6 frame**, khoảng cách đều.
- Cùng 1 nhân vật, **cùng kích thước, cùng tỉ lệ ở mọi frame**.
- **Bàn chân mọi frame nằm trên cùng một đường ngang**.
- Frame 1 và frame 6 nối vòng được (loop).

### 1.5 Đặt tên file khi gửi lại
```
art_src/chars/<ma>/<hanh_dong>.png      vd: art_src/chars/sv_male/walk_down.png
art_src/npcs/<ma>/<hanh_dong>.png
art_src/vehicles/<ma>.png
art_src/buildings/<ma>.png
art_src/props/<ma>.png
art_src/icons/<nhom>.png
```
Tôi sẽ sửa `tools/build_assets.py` để đọc thẳng cấu trúc này.

### 1.6 Khối phong cách chung (dán vào cuối MỌI prompt)
```
STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood,
warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines,
soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above).
Plain solid magenta background #FF00FF. No text, no letters, no numbers, no labels, no watermark,
no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch.
```

---

## 2. P0 — Nhân vật người chơi (6 ngoại hình × 6 dải = 36 ảnh)

### 2.1 Các dải cần cho MỖI nhân vật

| File | Nội dung | Ghi chú |
|---|---|---|
| `idle_down.png` | Đứng yên, mặt hướng về người xem, thở nhẹ / chớp mắt | 6 frame |
| `walk_down.png` | Đi về phía người xem | 6 frame |
| `walk_up.png` | Đi quay lưng (thấy sau đầu, lưng) | 6 frame |
| `walk_left.png` | Đi sang **trái**, nhìn nghiêng | 6 frame — game tự lật thành bên phải |
| `idle_up_left.png` | Frame 1–3: đứng quay lưng; frame 4–6: đứng nhìn sang trái | 6 frame |
| `ride_left.png` | **Tư thế ngồi lái xe máy, không có xe**, nhìn sang trái, 2 tay đưa ra phía trước như cầm ghi-đông | 6 frame (rung nhẹ) |

*(Giai đoạn sau: `walk_down_left`, `walk_up_left` cho 8 hướng; `sit_down` để ngồi ghế nhựa quán cà phê.)*

### 2.2 Mẫu prompt dải animation
```
Sprite sheet: a single horizontal row of exactly 6 animation frames, evenly spaced,
showing the SAME character in every frame with identical size, proportions, clothing and colors,
feet aligned on the same horizontal baseline. Animation: {HÀNH ĐỘNG}.
Character: {MÔ TẢ NHÂN VẬT}.
{STYLE}
```
Thay `{HÀNH ĐỘNG}` bằng:

| File | {HÀNH ĐỘNG} |
|---|---|
| idle_down | `idle standing loop, facing the viewer, subtle breathing, one frame blinking` |
| walk_down | `walking cycle toward the viewer (facing down/front)` |
| walk_up | `walking cycle away from the viewer, seen from behind (back of head and back visible)` |
| walk_left | `walking cycle in side profile, facing and moving to the LEFT` |
| idle_up_left | `frames 1-3 standing idle seen from behind, frames 4-6 standing idle in side profile facing left` |
| ride_left | `seated riding pose as if on a motorbike seat, side profile facing left, both arms reaching forward holding invisible handlebars, legs bent, NO motorbike drawn, slight bobbing` |

### 2.3 Mô tả 6 nhân vật (`{MÔ TẢ NHÂN VẬT}`)

| Mã | Lớp | Mô tả (dán vào prompt) |
|---|---|---|
| `sv_male` | Sinh viên nam | `Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm` |
| `sv_female` | Sinh viên nữ | `Vietnamese female university student around 20, long straight black hair in a low ponytail, white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals` |
| `vp_male` | NV văn phòng nam | `Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress shirt with a pen in the chest pocket, dark navy trousers, black belt, brown leather shoes, holding a brown leather briefcase in his right hand` |
| `vp_female` | NV văn phòng nữ | `Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in grey-beige small pattern, black straight trousers, low brown heels, small brown leather handbag on her forearm` |
| `tt_female` | Tiểu thương nữ | `Vietnamese street vendor woman in her 40s, conical non la palm-leaf hat, brown ao ba ba blouse with buttons, loose black silk trousers, rubber sandals, carrying a woven rattan basket` |
| `tt_male` | Tiểu thương nam | `Vietnamese street vendor man in his 40s, short hair, faded white undershirt under an open short-sleeve checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops, sun-tanned skin` |

---

## 3. P0 — NPC di chuyển (mỗi NPC 4 dải: idle_down, walk_down, walk_up, walk_left)

Dùng đúng mẫu prompt mục 2.2.

| Mã | Vai trò | Mô tả |
|---|---|---|
| `police` | Cảnh sát tuần tra | `Vietnamese police patrol officer, olive-green uniform shirt with red collar tabs and shoulder boards, olive peaked cap with a round badge, dark green trousers, black shoes, black belt with a baton, serious calm expression` |
| `thief` | Ăn trộm | `skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, dark track pants, worn sneakers, hunched shoulders, shifty eyes` — thêm cho walk: `sneaky tiptoe walk` |
| `gangster` | Giang hồ | `tough Vietnamese gangster man around 35, buzz-cut hair, dark sunglasses, open red floral short-sleeve shirt over a white tank top, thick gold chain, dragon tattoos on both forearms, black trousers, leather sandals, swaggering` |
| `postman` | Bưu tá | `Vietnamese postman around 40, short hair, blue short-sleeve uniform shirt with a small red-and-white post logo patch, dark blue trousers, brown leather mail satchel across the body, holding a small tablet` |
| `walker_old` | Người đi đường | `elderly Vietnamese man with grey hair and moustache, beige short-sleeve shirt, brown trousers, walking slowly with a wooden cane` |
| `walker_mom` | Người đi đường | `Vietnamese woman in her 30s, floral blouse, dark trousers, carrying a plastic shopping bag with vegetables` |
| `walker_kid` | Trẻ em | `Vietnamese schoolboy around 9, white short-sleeve school shirt with red scarf (khan quang do), dark blue shorts, small backpack` |

Thêm 1 ảnh cho thằng trộm: `thief_run_left.png` — `fast running cycle in side profile facing left, panicking`.

---

## 4. P1 — NPC đứng bán / làm việc (mỗi NPC 1 dải `work.png`, 6 frame)

**Quan trọng:** vẽ **NPC riêng, không kèm xe đẩy/bàn ghế** (đồ vật vẽ riêng ở mục 8) để game xếp lớp đúng chiều sâu.

Mẫu prompt:
```
Sprite sheet: a single horizontal row of exactly 6 animation frames, evenly spaced, same character
in every frame with identical size, feet on the same baseline, facing the viewer in 3/4 front view.
Looping work animation: {VIỆC LÀM}. Character: {MÔ TẢ}. Draw ONLY the person, no furniture, no cart.
{STYLE}
```

| Mã | NPC | {MÔ TẢ} | {VIỆC LÀM} |
|---|---|---|---|
| `npc_banhmi` | Bà cụ bánh mì | `very old Vietnamese woman, conical hat, brown ao ba ba, dark trousers, sandals` | `slicing a baguette with a knife, stuffing fillings, handing over a wrapped banh mi` |
| `npc_veso` | Ông lão vé số | `old bald Vietnamese man with white moustache, faded plaid short-sleeve shirt, grey trousers, sandals` | `holding a fan of lottery tickets, waving them to call customers` |
| `npc_barber` | Thợ cắt tóc | `Vietnamese barber around 45, side-parted hair, beige short-sleeve shirt, dark trousers` | `snipping scissors in the air with a comb in the other hand` |
| `npc_mechanic` | Chú sửa xe | `Vietnamese mechanic around 50, crouching, oil-stained olive work shirt, grey trousers` | `crouching and turning a wrench, wiping sweat with a rag` |
| `npc_cafe` | Cô chủ cà phê | `Vietnamese woman around 45, hair in a bun, apron over a light floral blouse` | `pouring condensed milk coffee from a phin filter into a glass with ice` |
| `npc_taphoa` | Cô Ba tạp hóa | `plump Vietnamese woman around 50, curly short hair, pink-checked blouse, sitting on a low plastic stool` | `sitting and fanning herself with a paper hand fan, chatting` |
| `npc_guard` | Bảo vệ ngân hàng / TechCorp | `Vietnamese security guard, light-blue uniform shirt, navy trousers, navy cap, walkie-talkie on belt` | `standing at attention, nodding and saluting` |
| `npc_vechai` | Chú Tư ve chai | `wiry Vietnamese man around 55, sleeveless faded shirt, rolled-up trousers, flip-flops` | `sorting crushed cans and bottles into a sack` |
| `npc_auction` | MC đấu giá | `Vietnamese auctioneer man around 40, black vest over white shirt, bow tie, slicked hair` | `raising and striking a wooden gavel, pointing at the crowd` |
| `npc_netco` | Chủ quán net | `Vietnamese young man around 25, gaming t-shirt, headphones around neck, slippers` | `typing and pointing at a counter screen, yawning` |

Gia đình ngồi ghế nhựa (trang trí, đã có art khá ổn) — làm lại theo quy chuẩn nền nếu muốn:
`family_sitting.png`: `Vietnamese couple sitting on low plastic stools eating pho from bowls, chatting, 6 frame loop`.

---

## 5. P0 — Phương tiện (vẽ xe RIÊNG, không người)

Mỗi xe 1 ảnh nhìn **ngang, đầu xe quay sang TRÁI**. Prompt:
```
Single game asset: a {XE}, empty with no rider, side profile view with the front of the vehicle
pointing to the LEFT, slight 3/4 top-down tilt, wheels resting on an invisible flat baseline.
{STYLE}
```

| Mã | {XE} | Dùng cho |
|---|---|---|
| `xe_cub` | `classic Honda Super Cub 50 style moped, olive green and cream body, chrome details` | Xe Cub (trang bị) |
| `xe_ga` | `modern Vietnamese scooter like a Honda Lead / Vespa, glossy pearl white with red seat` | Xe tay ga |
| `xe_pkl` | `large sport motorcycle, matte black with orange accents` | Phân khối lớn (sau này / đua xe đêm) |
| `xe_dap` | `old black Vietnamese city bicycle with a front basket` | Sinh viên nghèo |
| `traffic_taxi` | `small green and white Vietnamese taxi car` | Giao thông trang trí |
| `traffic_bus` | `green Saigon city bus` (rộng ~5 đơn vị) | Giao thông trang trí |
| `traffic_grab` | `scooter with a green delivery box on the back` | Xe ôm công nghệ (class ẩn) |

Game sẽ ghép `xe_xxx.png` + `ride_left.png` của từng nhân vật → ai cũng có xe riêng với đúng ngoại hình.

---

## 6. P0 — Mặt tiền công trình (biển hiệu ĐỂ TRỐNG)

Prompt chung:
```
Game asset: front elevation facade of {CÔNG TRÌNH}, Vietnamese urban architecture, seen straight
from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge
(no sidewalk, no street in front). The main entrance door is at the bottom center, door height
about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with
NO text on it. Width to height ratio {TỈ LỆ}. {CHI TIẾT}
{STYLE}
```

| Mã | {CÔNG TRÌNH} | {TỈ LỆ} | {CHI TIẾT} |
|---|---|---|---|
| `bld_school` | `a Vietnamese university lecture hall` | 2:1 | `3 storeys, cream-yellow walls, green wooden shutters, red tile roof edge, flagpole with red flag, wide gate with two pillars` |
| `bld_tro` | `a cheap student boarding house (nha tro)` | 1.4:1 | `4 storeys, narrow balconies with laundry and potted plants, rusty metal railings, small iron gate` |
| `bld_net` | `a tiny internet cafe (quan net co)` | 1.4:1 | `dark storefront with glowing monitors visible inside, neon green trim, rolled-up shutter` |
| `bld_buudien` | `a French colonial post office` | 1.8:1 | `ochre yellow walls, arched windows with green shutters, clock above the entrance` (đã có, làm lại cho đúng nền) |
| `bld_cafe` | `a sidewalk coffee shop with a red-white striped awning` | 1.2:1 | `open front, low tables and plastic stools inside, posters on walls` |
| `bld_bangdia` | `an old cassette and VCD rental shop` | 1.2:1 | `shelves of tapes, movie posters, hanging cassettes` |
| `bld_bida` | `a billiards club` | 1.2:1 | `open rolling door showing 2 pool tables under fluorescent lamps, empty neon sign frame` |
| `bld_taphoa` | `a small family grocery store (tap hoa)` | 1.4:1 | `goods stacked to the ceiling, hanging snack bags, sacks of rice in front` |
| `bld_barber` | `a tiny barber corner` | 1:1 | `mirror on the wall, barber pole, one vintage barber chair` |
| `bld_garage` | `a motorbike repair shop` | 1.4:1 | `tools on a pegboard, stacked tyres, oil stains, open front` |
| `bld_bank` | `a modern bank branch building (VietBank)` | 1.1:1 | `5 storeys of blue glass curtain wall, marble ground floor, gold accents, glass sliding doors` |
| `bld_office` | `a corporate office tower (TechCorp)` | 1.2:1 | `tall dark glass tower top part cropped, modern lobby with glass doors, turnstiles visible` |
| `bld_auction` | `a grand auction house` | 1:1 | `neoclassical columns, red carpet steps, brass lamps, arched windows` |
| `bld_showroom` | `a motorbike showroom` | 1.6:1 | `large glass windows with scooters displayed inside, bright lights` |
| `bld_fashion` | `a fashion boutique` | 1.2:1 | `display windows with mannequins wearing ao dai and shirts, pink trim` |
| `bld_vechai` | `a scrap metal and recycling yard shed` | 2.5:1 | `corrugated rusty tin walls, piles of cans, bottles, cardboard and old fans` |

**Nhà ống lấp chỗ trống** — tạo 8 biến thể, mỗi ảnh 1 nhà, tỉ lệ 1:3:
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys,
{MÀU TƯỜNG} walls, small balconies with potted plants and laundry, an air conditioner unit,
ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on
a flat ground line, width to height ratio 1:3. {STYLE}
```
`{MÀU TƯỜNG}` lần lượt: `mustard yellow`, `salmon pink`, `mint green`, `sky blue`, `cream white`, `lavender`, `terracotta orange`, `pale lime`.

Ngoại ô: thêm 3 ảnh `shack_1..3`: `a ramshackle tin-roof shack with patched corrugated walls, ratio 1.5:1`.

> Biển hiệu để trống — game sẽ in chữ tiếng Việt chuẩn (VD "BƯU ĐIỆN", "NET CỎ 24/7", "TẠP HÓA CÔ BA").

---

## 7. P0 — Icon vật phẩm (thay emoji)

Tạo theo **nhóm, mỗi ảnh tối đa 12 icon** (AI vẽ lưới lớn hay sai). Prompt:
```
Game item icon set: a grid of 4 columns x 3 rows, each icon centered in its own equal square cell
with generous spacing, all icons the same scale and lighting, front 3/4 view, bold pixel outlines.
Icons in this order (left to right, top to bottom): {DANH SÁCH}.
{STYLE}
```

| Ảnh | {DANH SÁCH} |
|---|---|
| `icons_food.png` | `banh mi sandwich, glass of iced tea (tra da), Vietnamese iced milk coffee in a glass, cup of sugarcane juice, raw baguette, sliced cold cuts, bunch of fresh herbs, bag of dried tea leaves, bag of ice cubes, bundle of sugarcane stalks, bowl of pho, lottery ticket` |
| `icons_misc.png` | `crushed soda can, rusty gear and bolts, old cassette tape, SIM card with 4G signal, folded patio umbrella, letter envelope, parcel box, gold coin stack, blue diamond gem, star badge, wooden gavel, house key` |
| `icons_equip_1.png` | `graphic t-shirt, light blue office shirt, blue jeans, rubber flip-flops, white sneakers, conical non la hat, motorbike helmet, sunglasses, silver earrings, mechanical wristwatch, canvas backpack, glowing neon aura ring` |
| `icons_equip_2.png` | `olive Super Cub moped, white scooter, smartphone, license plate, british shorthair cat, limited edition jacket, red ao dai, leather handbag, baseball cap, gold necklace, leather sandals, bicycle` |

Tiền tệ & UI (1 ảnh, 4×2): `paper money banknotes, bank card, blue diamond, gold star medal, 4G signal bars, smartphone, megaphone with rainbow LED, map pin`.

---

## 8. P1 — Đồ vật / props (mỗi ảnh 1 vật, hoặc nhóm ≤ 6 vật cách xa nhau)

| Mã | Mô tả prompt |
|---|---|
| `stall_lv1` | `a street vendor's tarp mat spread on the ground with small goods on it` (sạp cấp 1 của người chơi) |
| `stall_lv2` | `a folding wooden table with a red-white checkered cloth and a few crates` (cấp 2) |
| `stall_lv3` | `a stainless steel vendor cart with glass display case and a big blue patio umbrella` (cấp 3, có dù che mưa) |
| `cart_banhmi` | `stainless steel banh mi cart with glass case showing baguettes, meats and herbs, EMPTY blank sign panel on the front` |
| `cart_veso` | `small wooden lottery ticket cart with a roof, tickets displayed, EMPTY blank sign panel` |
| `cart_mia` | `sugarcane juice cart with a pressing machine and sugarcane stalks` |
| `ganh_hang` | `a bamboo shoulder pole with two woven baskets of fruit` |
| `stools` | `group of 4 low plastic stools: blue, red, pink, green, spaced apart` |
| `table_tra_da` | `low steel table with glasses of iced tea and a big plastic jug` |
| `table_co_tuong` | `small low table with a Chinese chess (co tuong) board and pieces` (minigame) |
| `atm` | `standalone ATM kiosk machine, blue and yellow` |
| `power_pole` | `concrete electric pole with a messy tangle of black cables and a street lamp head` |
| `street_lamp` | `simple modern street lamp post` |
| `tree_bang` | `Indian almond tree (cay bang) with wide leaves, trunk with a painted white base` |
| `tree_me` | `tamarind tree with fine leaves` |
| `plant_pots` | `group of 3 potted plants: tall palm, flowering bougainvillea, small herb pot` |
| `tires` | `stack of 4 old motorbike tyres` |
| `junk_pile` | `pile of scrap: cans, plastic bottles, cardboard, broken fan` |
| `scrap_pickup` | `small shiny pile of crushed cans with a sparkle` (vật nhặt được) |
| `trash_bin` | `green city trash bin on wheels` |
| `bench` | `stone park bench` |
| `goal_mini` | `small white football goal with net, side view` |
| `barber_set` | `vintage barber chair, standing mirror and barber pole` |
| `sign_stand` | `wooden standing A-frame sign board, EMPTY blank` |
| `manhole` / `puddle` | `round iron manhole cover`, `rain puddle reflecting light` (nhìn thẳng từ trên xuống) |

---

## 9. P2 — Làm sau (theo lộ trình GDD)

| Nhóm | Asset |
|---|---|
| Nhà trọ / housing | Nội thất phòng trọ 15m² gác lửng (giường, tủ lạnh, bàn PC, bếp, quạt) nhìn 3/4 từ trên — từng món riêng |
| Đua xe đêm | Nền đường Ngoại ô ban đêm, cờ xuất phát, khán giả cổ vũ (dải 6 frame) |
| Chân dung hội thoại | Bán thân 256×256 cho 6 nhân vật + 10 NPC (`portrait_<ma>.png`) — hiện trong khung hội thoại |
| Logo & màn hình chờ | Logo **không chữ** (emblem xe đẩy + nón lá + neon) — chữ "HÀNG RONG" game tự in; key art phố Sài Gòn về đêm 1920×1080 |
| 8 hướng | `walk_down_left`, `walk_up_left` cho 6 nhân vật |
| Ô đất (tile) | Vỉa hè, nhựa đường, cỏ, đá CBD, đất — 64×64 **lặp liền mạch** (hiện game đang tự vẽ, ổn nên để sau) |

---

## 10. Tổng số ảnh cần tạo

| Mục | Số ảnh | Ưu tiên |
|---|---|---|
| Nhân vật người chơi (6 × 6 dải) | 36 | P0 |
| NPC di chuyển (7 × 4 + 1) | 29 | P0 (police, thief, gangster) / P1 (còn lại) |
| NPC làm việc | 10–11 | P1 |
| Phương tiện | 7 | P0 (cub, ga) / P1 |
| Công trình + nhà ống + lều | 16 + 8 + 3 = 27 | P0 |
| Icon | 5 | P0 |
| Props | ~25 | P1 |
| **Tổng P0** | **~85 ảnh** | |

**Thứ tự đề xuất:** làm `sv_male` đủ 6 dải trước rồi gửi tôi ghép thử vào game. Nếu khớp quy chuẩn thì làm hàng loạt phần còn lại, tránh tạo nhiều rồi phải làm lại.

## 11. Mẹo khi tạo bằng AI
- Luôn gửi kèm **ảnh tham chiếu phong cách** (`NPC.png`) và, từ dải thứ 2 trở đi, gửi kèm **dải đầu tiên của chính nhân vật đó** để giữ đúng mặt/quần áo.
- Nếu AI ra 5 hoặc 7 frame: tạo lại, đừng sửa tay — game cần đúng 6.
- Nếu nền ra trắng thay vì magenta: thêm câu `The background MUST be pure flat magenta #FF00FF` lên **đầu** prompt.
- Kiểm tra nhanh: phóng to xem chân các frame có cùng đường ngang không, có dấu watermark ở góc không.
