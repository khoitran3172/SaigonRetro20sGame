# Asset cần vẽ — Bản V2 (kèm prompt cho Gemini)

> File tự sinh bởi `python tools/asset_todo.py` theo thiết kế [GAMEPLAY_V2](GAMEPLAY_V2.md), [ANIMATION_V2](ANIMATION_V2.md), [INVENTORY_V2](INVENTORY_V2.md). **Đang chờ bạn duyệt thiết kế** — nếu bỏ ý nào thì asset tương ứng cũng bỏ.

> **Vẽ bằng Gem *Họa sĩ Hàng Rong*:** hướng dẫn tạo Gem ở [GEMINI_GEM.md](GEMINI_GEM.md) — Gem tự áp phong cách & quy chuẩn.

> **Có trang copy nhanh:** mở `docs/asset_todo.html` bằng trình duyệt — mỗi prompt có nút **Copy**, bấm xong tự đánh dấu ✅ đã dùng.

> **Cách dùng:** mỗi khối là **một ảnh** → copy nguyên khối dán vào Gemini. Đính kèm ảnh tham chiếu phong cách (`NPC.png`, hoặc ảnh đầu tiên của chính nhân vật đó). Lưu đúng tên file ở tiêu đề khối, bỏ vào `asset_new_by_Khoit/`. Nếu ra sai số frame → tạo lại, đừng cắt ghép.


**Tổng bản V2: 62 ảnh.**

| Nhóm | Số ảnh |
|---|---|
| 0. Thị trấn liền mạch — ƯU TIÊN vẽ trước (P0: tile_street, verge_zones, skyline_far, bld_bank, bld_office; P1: còn lại) | 11 |
| 1. [Đợt 1] Sinh viên nam — animation V2 (8 frame đi, 4 frame đứng) | 9 |
| 2. [Đợt 1] Cảnh sát & Ăn trộm | 9 |
| 3. [Đợt 1] Người đi đường | 16 |
| 7. [Đợt 2] Nơi làm việc mới | 4 |
| 8. [Đợt 2] Mini-game các nghề | 3 |
| 9. [Đợt 2] Chân dung NPC — vẽ lại 2 ô | 1 |
| 11. [Đợt 3] Nội thất còn thiếu (Bình dân · Tầm trung · Cao cấp) | 4 |
| 14. [Đợt 4] Trung Tâm Mua Sắm — nhân viên quầy còn thiếu | 4 |
| 17. [Đợt 4] Công trình lấp phố — nhà ống còn thiếu | 1 |


## 0. Thị trấn liền mạch — ƯU TIÊN vẽ trước (P0: tile_street, verge_zones, skyline_far, bld_bank, bld_office; P1: còn lại)

*Từng ảnh đẹp nhưng gộp lại rối. Bộ ảnh này làm nền, lề, đồ phố và 2 công trình lạc tông cho cùng một hệ tỉ lệ / bảng màu. Ảnh tile (tile_street, verge_zones, skyline_far) là ngoại lệ: nhiều tile trong 1 ảnh, mỗi tile lát nối được. Thứ tự đề xuất: tile_street → verge_zones → skyline_far → bld_bank / bld_office → street_set → yard_vechai → tube_9/10 → ui_dock_icons → zone_gate_set.*

#### Mặt đất: vỉa hè / đường / bó vỉa / lề cỏ (lát nối) — `tile_street.png`
```
Game texture set: EXACTLY 4 square ground tiles in one horizontal row, each tile the same size, separated by wide flat magenta #FF00FF gaps. Each tile is seen straight from above (flat top-down, no perspective) and MUST tile seamlessly on all four edges (left matches right, top matches bottom) with no visible border, no vignette, no lighting gradient. From left to right: (1) Saigon sidewalk paving: small worn square cement tiles in cream-grey with faint terracotta accents and a few hairline cracks; (2) asphalt road: dark charcoal-blue asphalt with subtle grain and one faint patch, no lane markings; (3) granite curb stone: grey granite kerb blocks seen from above, joints every quarter tile; (4) roadside grass verge: short tropical grass with tiny weeds and a little bare soil. Muted palette matching the attached references.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Dải lề dưới theo 4 khu (lát nối) — `verge_zones.png`
```
Game asset set: EXACTLY 4 long horizontal strips stacked vertically with wide flat magenta #FF00FF gaps between them, each strip about 6 times wider than tall, each MUST tile seamlessly left-to-right (left edge continues the right edge). Each strip is a roadside verge seen in 3/4 top-down view, running along the bottom of a street, low (no taller than an adult's knee except plants). From top to bottom: (1) UNIVERSITY: neat green hedge in a red-brick planter with a low cream painted iron railing; (2) FOOD STREET: worn terracotta brick planter with potted herbs, small plastic pots and a low blue-painted railing; (3) FINANCIAL DISTRICT: polished grey granite planter box with trimmed boxwood and a brushed metal edge; (4) SUBURB: rusty corrugated metal fence low section with tall weeds and packed dirt. No people, no vehicles.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Skyline xa (lát nối) — `skyline_far.png`
```
Game background asset: ONE long horizontal strip of a distant Saigon city skyline silhouette, about 5 times wider than tall, that MUST tile seamlessly left-to-right. Hazy, low-contrast, desaturated blue-grey and dusty lavender tones as if seen through warm afternoon haze; mix of 1990s tube houses, a few mid-rise blocks, water towers, TV antennas, tangled power lines, one old church spire and a couple of cranes. Flat front view, no strong outlines (lighter outline than foreground assets), no lit windows, no sky drawn — only the silhouette shapes, sitting on a flat bottom edge.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Ngân hàng — vẽ lại theo tông retro — `bld_bank.png`
```
Game asset: front elevation facade of a 1990s Saigon bank branch, 3 storeys, French-colonial-meets-1990s style: ochre and cream plastered walls, tall arched windows with dark green shutters, a marble-step entrance with brass double doors at the bottom center (door height about 1.3 times an adult's height), an iron-grille security gate folded open, a small ATM niche to the right of the door, potted palms, air-conditioner units on the side, and a large EMPTY blank signboard plate above the entrance. Width to height ratio 1.3:1. Seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Văn phòng TechCorp — vẽ lại theo tông retro — `bld_office.png`
```
Game asset: front elevation facade of a late-1990s Saigon office building, 4 storeys, concrete and teal-tinted glass ribbon windows with horizontal sun-shade fins, a small glass lobby entrance at the bottom center (door height about 1.3 times an adult's height), a security booth beside the door, a row of concrete planters with small shrubs, rooftop water tank and antenna, faded paint and a few air-conditioner units, and a large EMPTY blank signboard plate across the top of the ground floor. Width to height ratio 1.3:1, NOT a skyscraper. Seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Bộ đồ phố cùng tỉ lệ (cột, đèn, cây me, cây bàng, thùng rác, ghế) — `street_set.png`
```
Game asset set: EXACTLY 6 street furniture objects in one horizontal row with wide even gaps, all drawn at the SAME scale (an adult would be 1 unit tall): (1) a concrete electric pole with a crossbar, insulators and a few tangled cables ending short, 3.2 units tall; (2) a single-arm 1990s street lamp with a curved green-painted pole, 2.8 units tall; (3) a tamarind tree (cay me) with a feathery round canopy in a square iron tree grate, 2.6 units tall and 1.6 wide; (4) an Indian almond tree (cay bang) with layered flat canopy in the same tree grate, 2.6 units tall and 1.6 wide; (5) a green municipal wheeled trash bin, 0.6 units; (6) a stone park bench, 0.5 units tall. Each object standing upright in 3/4 top-down front view, bases on the same baseline.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Sân vựa ve chai (gom phế liệu thành 1 khối) — `yard_vechai.png`
```
Game asset: ONE single compact scrap yard ground patch seen in 3/4 top-down view, about 3 times wider than tall, to sit beside a Vietnamese scrap dealer shop: a packed-dirt yard with neat piles of flattened cardboard tied with string, a stack of old tires, a heap of aluminium cans in a woven sack, a rusty bicycle frame, an old weighing scale and a low corrugated sheet fence along the back edge. Everything grouped into one connected object with soft irregular edges, no people, no vehicles with engines.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống mẫu mới (tube_9) — `tube_9.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 storeys, faded salmon pink walls with a turquoise iron balcony grille and a bougainvillea vine, ground floor with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3, same scale as the attached tube house references (the ground floor door is about 1.3 times an adult's height).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống mẫu mới (tube_10) — `tube_10.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 storeys, dusty sky-blue walls with wooden shutters, a small altar window and a rooftop water tank, ground floor with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3, same scale as the attached tube house references (the ground floor door is about 1.3 times an adult's height).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Icon thanh nút HUD (thay emoji) — `ui_dock_icons.png`
```
Game UI icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, same scale and lighting, perfectly flat front view, bold pixel outlines, readable at 32x32 pixels. Icons in order: (1) woven market basket with produce; (2) speech bubble; (3) smiling face badge; (4) open guide book; (5) hamburger menu of three wooden bars; (6) brass wrench; (7) folded paper map; (8) small bell with a dot for notifications.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Cổng / mốc nhận diện 4 khu — `zone_gate_set.png`
```
Game asset set: EXACTLY 4 roadside zone landmark objects in one horizontal row with wide even gaps, same scale (an adult is 1 unit tall), each about 2.5 units tall, 3/4 top-down front view, each with an EMPTY blank plate where a name would go: (1) UNIVERSITY: a cream concrete pillar gate post with a small blank bronze plaque and a flowering frangipani; (2) FOOD STREET: a red-and-yellow festive lantern post with a blank wooden hanging board; (3) FINANCIAL DISTRICT: a polished granite monolith marker with a blank brass plate; (4) SUBURB: a leaning wooden post with a blank rusty tin sign and a tied bundle of scrap.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 1. [Đợt 1] Sinh viên nam — animation V2 (8 frame đi, 4 frame đứng)

*ANIMATION_V2 A1–A7. Vẽ `idle_down` TRƯỚC, các ảnh sau đính kèm `idle_down` làm tham chiếu.*

#### sv_male · idle_down — `sv_male_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · walk_down — `sv_male_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · walk_up — `sv_male_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · walk_left — `sv_male_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · idle_up — `sv_male_idle_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a gentle 4-frame breathing idle seen from BEHIND (back of the head visible). Frame 1 neutral, frame 2 shoulders rise slightly, frame 3 neutral, frame 4 shoulders lower slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · idle_left — `sv_male_idle_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a gentle 4-frame breathing idle in side profile facing LEFT. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with a blink, frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · pickup_down — `sv_male_pickup_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 6 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a 6-frame pick-up action facing the viewer: 1 standing, 2 starts bending knees, 3 crouching and reaching to the ground, 4 grabbing a small object, 5 standing up holding it, 6 putting it into the bag.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · eat_down — `sv_male_eat_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 6 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a 6-frame eating action facing the viewer: 1 holding a banh mi sandwich at chest, 2 lifting it to the mouth, 3 biting, 4 chewing, 5 lowering it, 6 smiling satisfied.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_male · phone_down — `sv_male_phone_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm (same character as the attached reference image). Animation: a 4-frame loop facing the viewer, holding a smartphone in both hands and tapping the screen, looking down at it, thumbs moving.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 2. [Đợt 1] Cảnh sát & Ăn trộm

*Trộm vẫn nhắm người giữ nhiều tiền mặt; cảnh sát tuần tra trấn áp trộm. Chuẩn 8/4 frame (A8).*

#### Cảnh sát · idle_down — `police_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese police patrol officer, olive-green uniform shirt with red collar tabs and shoulder boards, olive peaked cap with a round badge, dark green trousers, black shoes, black belt with a baton. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Cảnh sát · walk_down — `police_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese police patrol officer, olive-green uniform shirt with red collar tabs and shoulder boards, olive peaked cap with a round badge, dark green trousers, black shoes, black belt with a baton. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Cảnh sát · walk_up — `police_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese police patrol officer, olive-green uniform shirt with red collar tabs and shoulder boards, olive peaked cap with a round badge, dark green trousers, black shoes, black belt with a baton. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Cảnh sát · walk_left — `police_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese police patrol officer, olive-green uniform shirt with red collar tabs and shoulder boards, olive peaked cap with a round badge, dark green trousers, black shoes, black belt with a baton. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Ăn trộm · idle_down — `thief_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, dark track pants, worn sneakers, hunched shoulders, shifty eyes. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Ăn trộm · walk_down — `thief_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, dark track pants, worn sneakers, hunched shoulders, shifty eyes. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Ăn trộm · walk_up — `thief_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, dark track pants, worn sneakers, hunched shoulders, shifty eyes. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Ăn trộm · walk_left — `thief_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, dark track pants, worn sneakers, hunched shoulders, shifty eyes. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Ăn trộm · run_left — `thief_run_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, dark track pants, worn sneakers, hunched shoulders, shifty eyes. Animation: a fast 8-frame running cycle in side profile facing LEFT, leaning forward, long strides, both feet off the ground in frames 3 and 7, panicking.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 3. [Đợt 1] Người đi đường

*Cần cho nghề Phát tờ rơi (J5 — đi tới người đi đường để phát) và làm phố đông vui. Học sinh tiểu học dùng luôn cho nghề Gia sư (J8).*

#### walker_old · idle_down — `walker_old_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: elderly Vietnamese man with grey hair and moustache, beige short-sleeve shirt, brown trousers, walking slowly with a wooden cane. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_old · walk_down — `walker_old_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: elderly Vietnamese man with grey hair and moustache, beige short-sleeve shirt, brown trousers, walking slowly with a wooden cane. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_old · walk_up — `walker_old_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: elderly Vietnamese man with grey hair and moustache, beige short-sleeve shirt, brown trousers, walking slowly with a wooden cane. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_old · walk_left — `walker_old_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: elderly Vietnamese man with grey hair and moustache, beige short-sleeve shirt, brown trousers, walking slowly with a wooden cane. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_mom · idle_down — `walker_mom_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese woman in her 30s, floral blouse, dark trousers, carrying a plastic shopping bag with vegetables. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_mom · walk_down — `walker_mom_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese woman in her 30s, floral blouse, dark trousers, carrying a plastic shopping bag with vegetables. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_mom · walk_up — `walker_mom_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese woman in her 30s, floral blouse, dark trousers, carrying a plastic shopping bag with vegetables. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_mom · walk_left — `walker_mom_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese woman in her 30s, floral blouse, dark trousers, carrying a plastic shopping bag with vegetables. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_kid · idle_down — `walker_kid_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese schoolboy around 9, white short-sleeve school shirt with a red scarf (khan quang do), dark blue shorts, small backpack. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_kid · walk_down — `walker_kid_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese schoolboy around 9, white short-sleeve school shirt with a red scarf (khan quang do), dark blue shorts, small backpack. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_kid · walk_up — `walker_kid_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese schoolboy around 9, white short-sleeve school shirt with a red scarf (khan quang do), dark blue shorts, small backpack. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_kid · walk_left — `walker_kid_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese schoolboy around 9, white short-sleeve school shirt with a red scarf (khan quang do), dark blue shorts, small backpack. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_officegirl · idle_down — `walker_officegirl_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: young Vietnamese office woman around 25, white blouse, black pencil skirt, small shoulder bag, holding a takeaway iced coffee. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_officegirl · walk_down — `walker_officegirl_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: young Vietnamese office woman around 25, white blouse, black pencil skirt, small shoulder bag, holding a takeaway iced coffee. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_officegirl · walk_up — `walker_officegirl_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: young Vietnamese office woman around 25, white blouse, black pencil skirt, small shoulder bag, holding a takeaway iced coffee. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### walker_officegirl · walk_left — `walker_officegirl_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: young Vietnamese office woman around 25, white blouse, black pencil skirt, small shoulder bag, holding a takeaway iced coffee. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 7. [Đợt 2] Nơi làm việc mới

*Đã nhận mặt tiền quán cơm tấm + tiệm trà sữa. Còn thiếu NPC chủ quán (tạm để quán không người).*

#### Bà chủ quán cơm tấm — `npc_boss_comtam.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese woman around 50 with a white apron and a headscarf, holding a ladle. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Chủ tiệm trà sữa — `npc_boss_trasua.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: trendy Vietnamese young woman around 24 with a pastel cap and a shop apron. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Cô chủ cà phê (vẽ lại tư thế đứng) — `npc_cafe.png`
```
Sprite sheet: one single horizontal row of EXACTLY 6 animation frames, evenly spaced with wide gaps, the same STANDING character in every frame with identical size, feet on the same baseline, facing the viewer in 3/4 front view. NOT sitting. Looping work animation: standing and pouring condensed milk coffee from a phin filter into a glass with ice, then stirring. Character: Vietnamese woman around 45, hair in a bun, apron over a light floral blouse, dark trousers. Draw ONLY the person, no furniture, no counter, no cart.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Cô Ba tạp hóa (vẽ lại tư thế đứng) — `npc_taphoa.png`
```
Sprite sheet: one single horizontal row of EXACTLY 6 animation frames, evenly spaced with wide gaps, the same STANDING character in every frame with identical size, feet on the same baseline, facing the viewer in 3/4 front view. NOT sitting. Looping work animation: standing, fanning herself with a paper hand fan and waving to call customers. Character: plump Vietnamese woman around 50, curly short hair, pink-checked blouse and trousers, sandals. Draw ONLY the person, no furniture, no counter, no cart.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 8. [Đợt 2] Mini-game các nghề

*G34. Đã nhận J1 IT, J2 Phục vụ, quầy J3 (file job_milktea_items.png gửi nhầm là ảnh quầy — đang dùng làm quầy), J5 tờ rơi, J6 bản đồ + đồ shipper, J8 vở & bảng. Ảnh J3 bên dưới là tùy chọn (icon cho phiếu order). J4 cần ảnh quầy NHÌN TỪ TRÊN XUỐNG — ảnh prop_coffee_prep_table nhìn nghiêng nên đang dùng làm đồ trang trí ở quán cà phê.*

#### J3 Trà sữa — ly & topping (tùy chọn) — `job_milktea_items.png`
```
Game item icon set: a grid of 4 columns x 3 rows, each icon centered in its own equal square cell with generous spacing, all icons the same scale and lighting, front 3/4 view, bold pixel outlines. Icons in this order (left to right, top to bottom): (1) a small empty plastic cup; (2) a medium empty plastic cup; (3) a large empty plastic cup; (4) black tea pitcher; (5) green tea pitcher; (6) a bowl of tapioca pearls; (7) a bowl of fruit jelly; (8) a bowl of pudding; (9) cheese foam topping; (10) a scoop of ice; (11) a sugar syrup bottle; (12) a finished sealed bubble tea.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J4 Cà phê — quầy pha phin — `job_coffee_counter.png`
```
A top-down 16:9 view of a Vietnamese street coffee preparation table: a kettle, a row of empty glasses, phin filters, a can of condensed milk, an ice bucket, a tray. No people, no text.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J4 Cà phê — các bước phin — `job_coffee_steps.png`
```
A row of 6 game sprites of identical size with wide gaps showing a Vietnamese phin coffee being made, seen from the front: (1) empty glass with phin on top, (2) ground coffee in the phin, (3) hot water poured in, (4) coffee dripping, (5) glass with black coffee and condensed milk at the bottom, (6) finished iced milk coffee with ice.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 9. [Đợt 2] Chân dung NPC — vẽ lại 2 ô

*Đã nhận ui_portraits.png (8 ô) nhưng ô 4 (chủ quán cơm tấm) vẽ thành đàn ông, ô 5 (chủ tiệm trà sữa) vẽ thành cậu bé đội nón lưỡi trai. 6 ô còn lại đang dùng trong hội thoại. Đính kèm ui_portraits.png làm tham chiếu.*

#### Chân dung chủ quán cơm tấm & chủ tiệm trà sữa — `ui_portraits_2.png`
```
Character portrait set in the SAME style as the attached portrait grid: 2 columns x 1 row of bust portraits (head and shoulders), each centered in its own equal square cream card with a simple warm background circle, same scale, facing slightly left: (1) a Vietnamese WOMAN around 50, restaurant owner, kind face, a headscarf and a white apron over a brown blouse; (2) a trendy Vietnamese YOUNG WOMAN around 24, bubble tea shop owner, long hair, a pastel pink cap and a light shop apron. Both clearly female.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 11. [Đợt 3] Nội thất còn thiếu (Bình dân · Tầm trung · Cao cấp)

*G22, G51. Đã nhận 20/24 loại (giường, tủ, rương, tủ lạnh, bếp, nồi cơm, lò vi sóng, bồn rửa, bàn ăn, bàn học, máy tính, kệ sách, sofa, bàn trà, TV, quạt, máy lạnh, máy giặt, đèn, thảm). Còn 4 loại dưới đây. Lưu ý: KHÔNG vẽ người mẫu tham chiếu và KHÔNG ghi chữ BUDGET/PREMIUM dưới đồ.*

#### Cây cảnh — `furn_plant.png`
```
Game asset set: 3 product variants of the same kind of home item — indoor plant — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small cactus in a plastic cup; (2) MID-RANGE model: a money plant in a ceramic pot; (3) PREMIUM model: a tall fiddle-leaf fig in a large woven basket. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Rèm cửa (treo tường) — `furn_curtain.png`
```
Game asset set: 3 product variants of the same kind of home item — window curtains — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen straight from the front as mounted on a wall. From left to right: (1) BUDGET model: a thin floral bed sheet hung as a curtain; (2) MID-RANGE model: plain blue fabric curtains; (3) PREMIUM model: thick velvet blackout curtains with gold tie-backs. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Tranh treo tường — `furn_painting.png`
```
Game asset set: 3 product variants of the same kind of home item — framed wall picture — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen straight from the front as mounted on a wall. From left to right: (1) BUDGET model: a printed calendar poster; (2) MID-RANGE model: a framed watercolor of Saigon streets; (3) PREMIUM model: a large lacquer painting with a gold frame. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Đồng hồ (báo thức & treo tường) — `furn_clock.png`
```
Game asset set: 3 product variants of the same kind of home item — clock — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small plastic alarm clock with two bells; (2) MID-RANGE model: a round wall clock; (3) PREMIUM model: a smart digital clock with a glowing display. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 14. [Đợt 4] Trung Tâm Mua Sắm — nhân viên quầy còn thiếu

*G25–G28. Đã nhận tòa nhà, sảnh, banner 5 quầy, nhân viên quầy Gia dụng. Ảnh npc_mall_noithat.png nhận được mặc áo CAM giống hệt quầy Gia dụng → vẽ lại áo NÂU. Đính kèm npc_mall_giadung.png làm tham chiếu dáng.*

#### Nhân viên quầy Nội thất (vẽ lại) — `npc_mall_noithat.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in chocolate BROWN (not orange) with a name badge, dark trousers, short neat hair, a different face from the attached reference. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Điện tử — `npc_mall_dientu.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in blue with a name badge, dark trousers. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Thời trang — `npc_mall_thoitrang.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in pink with a name badge, dark trousers, a young woman with a ponytail. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Siêu thị — `npc_mall_sieuthi.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in green with a name badge, dark trousers. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 17. [Đợt 4] Công trình lấp phố — nhà ống còn thiếu

*Đã nhận vựa ve chai + nhà ống 1–4, 6–8 (đang dùng trong game). Còn thiếu nhà ống số 5.*

#### Nhà ống 5 (xanh cốm — tube_8 nhận được đã là màu kem) — `tube_5.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, pale lime green walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## Hoãn lại — sau bản V2 (36 ảnh)

*Nhân vật khác, công trình đang đóng cửa (G2), Giang hồ. Đã nâng lên chuẩn 8 frame đi / 4 frame đứng.*

#### sv_female · idle_down — `sv_female_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese female university student around 20, long straight black hair in a low ponytail, white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_female · walk_down — `sv_female_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese female university student around 20, long straight black hair in a low ponytail, white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_female · walk_up — `sv_female_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese female university student around 20, long straight black hair in a low ponytail, white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_female · walk_left — `sv_female_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese female university student around 20, long straight black hair in a low ponytail, white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_female · idle_up — `sv_female_idle_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese female university student around 20, long straight black hair in a low ponytail, white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals. Animation: a gentle 4-frame breathing idle seen from BEHIND (back of the head visible). Frame 1 neutral, frame 2 shoulders rise slightly, frame 3 neutral, frame 4 shoulders lower slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### sv_female · idle_left — `sv_female_idle_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese female university student around 20, long straight black hair in a low ponytail, white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals. Animation: a gentle 4-frame breathing idle in side profile facing LEFT. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with a blink, frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_male · idle_down — `vp_male_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress shirt, dark navy trousers, brown leather shoes, holding a brown leather briefcase. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_male · walk_down — `vp_male_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress shirt, dark navy trousers, brown leather shoes, holding a brown leather briefcase. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_male · walk_up — `vp_male_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress shirt, dark navy trousers, brown leather shoes, holding a brown leather briefcase. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_male · walk_left — `vp_male_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress shirt, dark navy trousers, brown leather shoes, holding a brown leather briefcase. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_male · idle_up — `vp_male_idle_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress shirt, dark navy trousers, brown leather shoes, holding a brown leather briefcase. Animation: a gentle 4-frame breathing idle seen from BEHIND (back of the head visible). Frame 1 neutral, frame 2 shoulders rise slightly, frame 3 neutral, frame 4 shoulders lower slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_male · idle_left — `vp_male_idle_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress shirt, dark navy trousers, brown leather shoes, holding a brown leather briefcase. Animation: a gentle 4-frame breathing idle in side profile facing LEFT. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with a blink, frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_female · idle_down — `vp_female_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in grey-beige small pattern, black straight trousers, low brown heels, small brown handbag. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_female · walk_down — `vp_female_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in grey-beige small pattern, black straight trousers, low brown heels, small brown handbag. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_female · walk_up — `vp_female_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in grey-beige small pattern, black straight trousers, low brown heels, small brown handbag. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_female · walk_left — `vp_female_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in grey-beige small pattern, black straight trousers, low brown heels, small brown handbag. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_female · idle_up — `vp_female_idle_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in grey-beige small pattern, black straight trousers, low brown heels, small brown handbag. Animation: a gentle 4-frame breathing idle seen from BEHIND (back of the head visible). Frame 1 neutral, frame 2 shoulders rise slightly, frame 3 neutral, frame 4 shoulders lower slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### vp_female · idle_left — `vp_female_idle_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in grey-beige small pattern, black straight trousers, low brown heels, small brown handbag. Animation: a gentle 4-frame breathing idle in side profile facing LEFT. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with a blink, frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_female · idle_down — `tt_female_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor woman in her 40s, conical non la hat, brown ao ba ba blouse, loose black silk trousers, rubber sandals, carrying a woven rattan basket. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_female · walk_down — `tt_female_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor woman in her 40s, conical non la hat, brown ao ba ba blouse, loose black silk trousers, rubber sandals, carrying a woven rattan basket. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_female · walk_up — `tt_female_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor woman in her 40s, conical non la hat, brown ao ba ba blouse, loose black silk trousers, rubber sandals, carrying a woven rattan basket. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_female · walk_left — `tt_female_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor woman in her 40s, conical non la hat, brown ao ba ba blouse, loose black silk trousers, rubber sandals, carrying a woven rattan basket. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_female · idle_up — `tt_female_idle_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor woman in her 40s, conical non la hat, brown ao ba ba blouse, loose black silk trousers, rubber sandals, carrying a woven rattan basket. Animation: a gentle 4-frame breathing idle seen from BEHIND (back of the head visible). Frame 1 neutral, frame 2 shoulders rise slightly, frame 3 neutral, frame 4 shoulders lower slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_female · idle_left — `tt_female_idle_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor woman in her 40s, conical non la hat, brown ao ba ba blouse, loose black silk trousers, rubber sandals, carrying a woven rattan basket. Animation: a gentle 4-frame breathing idle in side profile facing LEFT. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with a blink, frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_male · idle_down — `tt_male_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor man in his 40s, faded white undershirt under an open checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_male · walk_down — `tt_male_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor man in his 40s, faded white undershirt under an open checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_male · walk_up — `tt_male_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor man in his 40s, faded white undershirt under an open checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_male · walk_left — `tt_male_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor man in his 40s, faded white undershirt under an open checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_male · idle_up — `tt_male_idle_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor man in his 40s, faded white undershirt under an open checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops. Animation: a gentle 4-frame breathing idle seen from BEHIND (back of the head visible). Frame 1 neutral, frame 2 shoulders rise slightly, frame 3 neutral, frame 4 shoulders lower slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### tt_male · idle_left — `tt_male_idle_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: Vietnamese street vendor man in his 40s, faded white undershirt under an open checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops. Animation: a gentle 4-frame breathing idle in side profile facing LEFT. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with a blink, frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### bld_auction — `bld_auction.png`
```
Game asset: front elevation facade of a grand auction house, Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 1:1. neoclassical columns, red carpet steps, brass lamps.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Giang hồ · idle_down — `gangster_idle_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: tough Vietnamese gangster man around 35, buzz-cut hair, dark sunglasses, open red floral shirt over a white tank top, thick gold chain, dragon tattoos on forearms, black trousers, leather sandals. Animation: a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Giang hồ · walk_down — `gangster_walk_down.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: tough Vietnamese gangster man around 35, buzz-cut hair, dark sunglasses, open red floral shirt over a white tank top, thick gold chain, dragon tattoos on forearms, black trousers, leather sandals. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking TOWARD the viewer (front view).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Giang hồ · walk_up — `gangster_walk_up.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: tough Vietnamese gangster man around 35, buzz-cut hair, dark sunglasses, open red floral shirt over a white tank top, thick gold chain, dragon tattoos on forearms, black trousers, leather sandals. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, walking AWAY from the viewer (back view, back of the head visible).

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Giang hồ · walk_left — `gangster_walk_left.png`
```
Sprite sheet: one single horizontal row of EXACTLY 8 animation frames, evenly spaced with wide gaps, the SAME character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. Character: tough Vietnamese gangster man around 35, buzz-cut hair, dark sunglasses, open red floral shirt over a white tank top, thick gold chain, dragon tattoos on forearms, black trousers, leather sandals. Animation: a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame 4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 pixels between the lowest and highest frames, in side profile facing and moving to the LEFT.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Chủ quán net (đứng) — giải trí đang ẩn — `npc_netco.png`
```
Sprite sheet: one single horizontal row of EXACTLY 6 animation frames, evenly spaced with wide gaps, the same STANDING character in every frame with identical size, feet on the same baseline, facing the viewer in 3/4 front view. NOT sitting. Looping work animation: standing behind an invisible counter, typing on an invisible keyboard, then yawning and stretching. Character: Vietnamese young man around 25, black gaming t-shirt, headphones around the neck, shorts, slippers. Draw ONLY the person, no furniture, no counter, no cart.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```
