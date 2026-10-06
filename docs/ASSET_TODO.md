# Asset cần vẽ — Bản V2 (kèm prompt cho Gemini)

> File tự sinh bởi `python tools/asset_todo.py` theo thiết kế [GAMEPLAY_V2](GAMEPLAY_V2.md), [ANIMATION_V2](ANIMATION_V2.md), [INVENTORY_V2](INVENTORY_V2.md). **Đang chờ bạn duyệt thiết kế** — nếu bỏ ý nào thì asset tương ứng cũng bỏ.

> **Có trang copy nhanh:** mở `docs/asset_todo.html` bằng trình duyệt — mỗi prompt có nút **Copy**, bấm xong tự đánh dấu ✅ đã dùng.

> **Cách dùng:** mỗi khối là **một ảnh** → copy nguyên khối dán vào Gemini. Đính kèm ảnh tham chiếu phong cách (`NPC.png`, hoặc ảnh đầu tiên của chính nhân vật đó). Lưu đúng tên file ở tiêu đề khối, bỏ vào `asset_new_by_Khoit/`. Nếu ra sai số frame → tạo lại, đừng cắt ghép.


**Tổng bản V2: 132 ảnh.**

| Nhóm | Số ảnh |
|---|---|
| 1. [Đợt 1] Sinh viên nam — animation V2 (8 frame đi, 4 frame đứng) | 9 |
| 2. [Đợt 1] Cảnh sát & Ăn trộm | 9 |
| 3. [Đợt 1] Người đi đường | 16 |
| 4. [Đợt 1] Giao thông — xe buýt, trạm, taxi | 4 |
| 5. [Đợt 1] Bộ giao diện (UI kit) — túi đồ, trang bị, HUD | 8 |
| 6. [Đợt 1] Điện thoại & app | 2 |
| 7. [Đợt 2] Nơi làm việc mới | 6 |
| 8. [Đợt 2] Mini-game các nghề | 11 |
| 9. [Đợt 2] Trường học & giao diện tòa nhà | 7 |
| 10. [Đợt 3] Nền phòng & tòa nhà ở | 3 |
| 11. [Đợt 3] Nội thất 3 phân khúc (Bình dân · Tầm trung · Cao cấp) | 24 |
| 12. [Đợt 3] Nấu ăn — nguyên liệu, món, giao diện bếp | 4 |
| 13. [Đợt 3] Icon đồ điện tử (3 phân khúc) | 1 |
| 14. [Đợt 4] Trung Tâm Mua Sắm | 8 |
| 15. [Đợt 4] Trang bị theo độ hiếm & Gacha | 7 |
| 16. [Đợt 4] Chợ Sạp Hàng Hóa | 4 |
| 17. [Đợt 4] Công trình lấp phố | 9 |


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


## 4. [Đợt 1] Giao thông — xe buýt, trạm, taxi

*G29–G32. Không còn xe máy. Xe buýt cũ dính watermark ✦ nên vẽ lại; thêm bản cửa mở khi dừng trạm. Taxi đã có art.*

#### Xe buýt (cửa đóng) — `veh_bus.png`
```
Single game asset: a green Saigon city bus, side profile with the front pointing to the RIGHT, slight 3/4 top-down tilt, doors closed, no passengers visible, wheels on an invisible flat baseline, length about 5 times an adult's height.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Xe buýt (cửa mở) — `veh_bus_open.png`
```
Single game asset: the SAME green Saigon city bus as the attached image, side profile with the front pointing to the RIGHT, both side doors folded OPEN showing the lit interior steps, stopped.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Trạm xe buýt — `bus_stop.png`
```
Single game asset: a Saigon bus stop shelter with a curved metal roof, a bench, a glass side panel and a tall route pole with an EMPTY blank route board, 3/4 top-down front view, about 1.5 times an adult's height.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Điểm đón taxi — `taxi_stand.png`
```
Single game asset: a small taxi waiting point: a pole with an EMPTY blank sign box on top and a painted yellow curb section, 3/4 top-down front view.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 5. [Đợt 1] Bộ giao diện (UI kit) — túi đồ, trang bị, HUD

*INVENTORY_V2 + G6. Khung phẳng, viền đều để co giãn (9-slice).*

#### Khung panel lớn — `ui_panel.png`
```
A large empty rectangular game window panel made of aged cream paper with a warm teak wood border and small brass corner pieces, plus a separate matching title bar strip and a separate small round close button. The border thickness is uniform on all sides so it can be stretched.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Ô túi đồ (các trạng thái) — `ui_slots.png`
```
A row of 8 square inventory slot frames of identical size with wide gaps: (1) empty slot, (2) selected slot with a bright glowing border, (3) locked slot with a small padlock, (4) common rarity grey border, (5) good rarity green border, (6) rare rarity blue border, (7) limited rarity gold border with a soft glow, (8) hotbar slot with a darker inset.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Icon tab lọc — `ui_tabs.png`
```
A row of 6 small square tab icons of identical size with wide gaps: (1) all items: a backpack, (2) food and drink: a bowl with chopsticks, (3) ingredients: a basket of vegetables, (4) equipment: a t-shirt, (5) furniture: a small sofa, (6) other: a cardboard box.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Nút bấm 4 trạng thái — `ui_buttons.png`
```
Four empty rectangular game buttons of identical size in one row with wide gaps: (1) normal warm orange, (2) hover brighter orange, (3) pressed darker and pushed down, (4) disabled grey. Uniform borders for stretching.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Khung thông tin & thanh dùng nhanh — `ui_tooltip_hotbar.png`
```
Two separate elements with a wide gap: (1) an empty dark tooltip box with a thin brass border and a small pointer notch, (2) a horizontal hotbar frame holding 5 square slots in a row.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Nền trang bị (búp bê giấy) — `ui_paperdoll.png`
```
An empty equipment screen background: a vertical cream paper card with a faint pale silhouette of a standing person in the center and 8 empty square slot frames arranged around the silhouette: hat at the top, glasses at the upper right, shirt at the left, watch at the right, pants at the lower left, backpack at the lower right, shoes at the bottom left, phone at the bottom right.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Icon ô trang bị trống — `ui_equip_placeholders.png`
```
A row of 8 faint outline silhouette icons of identical size with wide gaps, single light-grey color: (1) cap, (2) glasses, (3) t-shirt, (4) wristwatch, (5) trousers, (6) backpack, (7) sneakers, (8) smartphone.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Icon nhu cầu & HUD — `ui_needs.png`
```
A row of 8 small square HUD icons of identical size with wide gaps: (1) hunger: a bowl of rice, (2) energy: a lightning bolt, (3) mood: a smiling face, (4) daily quest: a scroll with a check mark, (5) clock, (6) home: a small house, (7) sleeping: a crescent moon with Zzz, (8) electricity bill: a light bulb.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 6. [Đợt 1] Điện thoại & app

*G58. Điện thoại là nơi mở app Việc Làm, Ngân hàng, Bản đồ, Gọi taxi, Chợ, Nhiệm vụ.*

#### Khung điện thoại — `ui_phone.png`
```
An empty modern smartphone frame seen straight from the front, slim dark bezel, a large empty bright screen area, a small top speaker notch. Nothing on the screen.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Icon app điện thoại — `ui_phone_apps.png`
```
A grid of 4 columns x 2 rows of rounded-square smartphone app icons of identical size with wide gaps: (1) jobs: a briefcase, (2) bank: a bank building, (3) map: a folded city map with a pin, (4) taxi: a green taxi car, (5) market: a market stall awning, (6) quests: a checklist, (7) contacts: two people, (8) settings: a gear.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 7. [Đợt 2] Nơi làm việc mới

*J2 Phục vụ quán cơm tấm, J3 Pha trà sữa. Nhà học sinh (J8) dùng một căn nhà ống ở nhóm 11.*

#### Quán cơm tấm — `bld_comtam.png`
```
Game asset: front elevation facade of a busy Saigon broken-rice restaurant (com tam), Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 1.4:1. open front, a grill with smoke at the entrance, steel tables and plastic stools inside, a glass food display case.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Tiệm trà sữa — `bld_trasua.png`
```
Game asset: front elevation facade of a trendy small bubble tea shop, Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 1.2:1. pastel pink and mint facade, a big glass window with a counter and a menu board without text, potted plants, a neon cup shape.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

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

*G34. Mỗi nghề một màn chơi. J9 ve chai dùng anim `pickup_down`, không cần thêm.*

#### J1 IT — màn hình code — `job_it.png`
```
Two separate elements with a wide gap: (1) an empty retro laptop screen frame seen straight on, showing an empty dark code editor window with a sidebar and line-number gutter but NO text; (2) a row of 6 colorful rounded code-block tiles of identical size with no text, plus 2 small cute pixel bug creatures.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J2 Phục vụ — sàn quán — `job_waiter_floor.png`
```
A top-down 16:9 view of a small com tam restaurant floor: 6 steel tables with plastic stools arranged in 2 rows, a kitchen pass counter at the top, a clear walking path between tables. No people, no text. Fill the whole image.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine.  No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J2 Phục vụ — món & khay — `job_waiter_items.png`
```
Game item icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, all icons the same scale and lighting, front 3/4 view, bold pixel outlines. Icons in this order (left to right, top to bottom): (1) a plate of com tam with grilled pork chop; (2) com tam with shredded pork skin and egg meatloaf; (3) a bowl of soup; (4) a glass of iced tea; (5) a round metal serving tray; (6) a paper order ticket; (7) a plate of fried egg; (8) a bowl of fish sauce.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J3 Trà sữa — quầy pha chế — `job_milktea_counter.png`
```
A top-down 16:9 view of a bubble tea preparation counter: a shaker in the center, empty cup holders, tea dispensers at the top, topping containers along the bottom, a sealing machine at the right. No people, no text.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J3 Trà sữa — ly & topping — `job_milktea_items.png`
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

#### J5 Tờ rơi — `job_flyer.png`
```
Two separate game item icons with a wide gap: (1) a single colorful advertising flyer without readable text, (2) a thick stack of the same flyers held by a rubber band.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### J6 Shipper — bản đồ thành phố — `job_city_map.png`
```
A stylized top-down city map panel of a small Saigon district split into 4 zones from left to right: a university village with a football field, a food street with stalls, a business district with glass towers, an outskirts scrap yard. A main road runs horizontally through all zones. No text, no labels.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J6 Shipper — thẻ địa chỉ & thùng hàng — `job_shipper_items.png`
```
Three separate elements with wide gaps: (1) an empty paper delivery address card with a barcode area, (2) a sealed delivery box with fragile tape, (3) a stopwatch timer icon.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### J8 Gia sư — vở & bảng — `job_tutor.png`
```
Two separate elements with a wide gap: (1) an open Vietnamese school notebook with empty ruled pages, (2) a small empty whiteboard on a stand with a marker tray.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 9. [Đợt 2] Trường học & giao diện tòa nhà

*G33, G38–G41. Banner tỉ lệ 3:1 đặt ở đầu panel.*

#### Banner Trường học — `banner_school.png`
```
A wide 3:1 illustrated header banner: the front gate of a Vietnamese university with a red flag and students walking in, morning light. Pixel art, no text.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Bảng đen câu hỏi — `ui_chalkboard.png`
```
An empty classroom chalkboard with a wooden frame and a chalk tray, plus 4 separate empty answer cards of identical size in red, blue, green and yellow.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Khung màn hình ATM — `ui_atm.png`
```
An ATM machine front panel seen straight on: an empty blue screen area at the top, a 12-key metal number pad below, a card slot and a cash slot. No text on the keys.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Banner Bưu điện & phong bì — `ui_post.png`
```
Two separate elements: (1) a wide 3:1 illustrated header banner of the yellow French colonial Saigon post office interior with wooden counters, (2) an empty open paper envelope with a red and blue airmail border.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Hợp đồng thuê & hóa đơn tuần — `ui_contract_bill.png`
```
Two separate elements with a wide gap: (1) an empty aged paper rental contract with a red stamp area and a signature line, (2) an empty narrow paper bill receipt with a torn bottom edge and a small light bulb symbol at the top.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Sơ đồ tuyến xe buýt — `ui_bus_map.png`
```
A stylized bus route map panel: a single green route line connecting 4 round stop markers from left to right, each stop with a small picture next to it: a university gate, a street food stall, glass office towers, a scrap yard. No text.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Chân dung NPC hội thoại — `ui_portraits.png`
```
Character portrait set: a grid of 4 columns x 2 rows of bust portraits (head and shoulders), each centered in its own equal square cell with a simple warm background circle, same scale, facing slightly left: (1) old banh mi grandmother with conical hat, (2) coffee lady with a bun, (3) grocery lady with curly hair, (4) com tam restaurant owner with headscarf, (5) young bubble tea shop owner with pastel cap, (6) mechanic, (7) scrap collector, (8) postman in blue uniform.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 10. [Đợt 3] Nền phòng & tòa nhà ở

*G19–G21. Phòng trống có lưới sàn rõ để đặt đồ.*

#### Phòng trọ 15m² gác lửng — `room_tro.png`
```
Interior of a small cheap Vietnamese student rental room (phong tro) about 4 by 3 meters: peeling pale green walls, one small window with iron bars on the back wall, a wooden door on the right wall, a wooden mezzanine loft edge visible along the top of the back wall, beige ceramic tile floor in a clear 8 x 6 grid.

STYLE: detailed 16-bit pixel art game background, Saigon Vietnam, retro late-1990s mood, warm muted palette, dark brown pixel outlines, soft light from a window. 3/4 top-down view (camera about 30 degrees above) looking into the room: back wall fully visible at the top, floor occupying the lower two thirds, side walls slightly visible. The floor shows a clear even grid of square tiles or planks so furniture can be placed on it. EMPTY room: no furniture, no people, no text, no watermark, no sparkle logo. Fill the whole image (no magenta). Output 16:9 landscape.
```

#### Căn hộ chung cư — `room_apartment.png`
```
Interior of a modern Saigon apartment living space: light cream walls, a large sliding glass door to a balcony on the back wall showing city towers outside, a door on the right wall, warm wooden plank floor in a clear 12 x 8 grid.

STYLE: detailed 16-bit pixel art game background, Saigon Vietnam, retro late-1990s mood, warm muted palette, dark brown pixel outlines, soft light from a window. 3/4 top-down view (camera about 30 degrees above) looking into the room: back wall fully visible at the top, floor occupying the lower two thirds, side walls slightly visible. The floor shows a clear even grid of square tiles or planks so furniture can be placed on it. EMPTY room: no furniture, no people, no text, no watermark, no sparkle logo. Fill the whole image (no magenta). Output 16:9 landscape.
```

#### Tòa chung cư — `bld_apartment.png`
```
Game asset: front elevation facade of a mid-rise Saigon apartment building (chung cu), Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 1:1.6. 8 storeys with balconies and potted plants, air conditioner units, a guarded lobby with glass doors at the bottom.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 11. [Đợt 3] Nội thất 3 phân khúc (Bình dân · Tầm trung · Cao cấp)

*G22, G51. Mỗi ảnh = 1 loại đồ × 3 mẫu. Hình đặt trong phòng thu nhỏ làm luôn icon. Đồ treo tường vẽ nhìn thẳng.*

#### Giường — `furn_bed.png`
```
Game asset set: 3 product variants of the same kind of home item — bed — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a thin foam mattress on the floor with one flat pillow; (2) MID-RANGE model: a simple single wooden bed with a cotton blanket; (3) PREMIUM model: a large double bed with a padded headboard, thick spring mattress and fluffy duvet. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Tủ quần áo — `furn_wardrobe.png`
```
Game asset set: 3 product variants of the same kind of home item — wardrobe — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a fabric zip-up portable wardrobe on a metal frame; (2) MID-RANGE model: a two-door wooden wardrobe; (3) PREMIUM model: a tall three-door glossy white wardrobe with a full-length mirror. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Rương / kho — `furn_chest.png`
```
Game asset set: 3 product variants of the same kind of home item — storage chest — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a stack of two plastic storage boxes; (2) MID-RANGE model: a wooden chest with metal latches; (3) PREMIUM model: an antique carved teak chest with brass corners. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Tủ lạnh — `furn_fridge.png`
```
Game asset set: 3 product variants of the same kind of home item — refrigerator — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small old mini fridge with a rusty door; (2) MID-RANGE model: a two-door 180-liter white fridge; (3) PREMIUM model: a large stainless steel side-by-side fridge with a water dispenser. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Bếp nấu — `furn_stove.png`
```
Game asset set: 3 product variants of the same kind of home item — cooking stove — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a single-burner portable gas stove on the floor; (2) MID-RANGE model: a double gas stove on a tiled counter; (3) PREMIUM model: a sleek black induction cooktop built into a modern kitchen counter with a range hood. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nồi cơm điện — `furn_ricecooker.png`
```
Game asset set: 3 product variants of the same kind of home item — rice cooker on a small counter — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a dented old aluminium rice cooker; (2) MID-RANGE model: a standard white electric rice cooker; (3) PREMIUM model: a premium digital rice cooker with a display panel. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Lò vi sóng — `furn_microwave.png`
```
Game asset set: 3 product variants of the same kind of home item — microwave oven — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a yellowed old microwave with a dial; (2) MID-RANGE model: a white microwave with buttons; (3) PREMIUM model: a black convection microwave oven with a digital display. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Bồn rửa — `furn_sink.png`
```
Game asset set: 3 product variants of the same kind of home item — kitchen sink — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a plastic basin on a wooden stand; (2) MID-RANGE model: a stainless steel sink counter; (3) PREMIUM model: a double sink in a marble counter with a pull-out faucet. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Bàn ăn — `furn_dining.png`
```
Game asset set: 3 product variants of the same kind of home item — dining table set — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a low folding table with two plastic stools; (2) MID-RANGE model: a wooden table with two wooden chairs; (3) PREMIUM model: a glass-top dining table with four upholstered chairs. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Bàn học / làm việc — `furn_desk.png`
```
Game asset set: 3 product variants of the same kind of home item — study desk with chair — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small folding desk with a plastic stool; (2) MID-RANGE model: a wooden study desk with an office chair and a desk lamp; (3) PREMIUM model: a large L-shaped desk with an ergonomic mesh chair. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Máy tính để bàn (cho nghề IT) — `furn_pc.png`
```
Game asset set: 3 product variants of the same kind of home item — desktop computer setup on a desk — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: an old beige PC with a bulky CRT monitor; (2) MID-RANGE model: an office PC with a flat monitor; (3) PREMIUM model: a gaming PC with RGB lights and two wide monitors. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Kệ sách — `furn_bookshelf.png`
```
Game asset set: 3 product variants of the same kind of home item — bookshelf — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small plastic shelf with a few books; (2) MID-RANGE model: a five-tier wooden bookshelf full of books; (3) PREMIUM model: a tall modern bookcase with decor items and LED strip lights. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Sofa — `furn_sofa.png`
```
Game asset set: 3 product variants of the same kind of home item — sofa — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a worn two-seat bamboo bench with thin cushions; (2) MID-RANGE model: a fabric two-seat sofa; (3) PREMIUM model: a large leather L-shaped sofa with pillows. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Bàn trà — `furn_coffeetable.png`
```
Game asset set: 3 product variants of the same kind of home item — coffee table — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small plastic stool used as a table; (2) MID-RANGE model: a low wooden coffee table; (3) PREMIUM model: a marble coffee table with gold legs. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### TV & kệ TV — `furn_tv.png`
```
Game asset set: 3 product variants of the same kind of home item — television on a TV stand — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: an old small CRT TV on a wooden stool; (2) MID-RANGE model: a 32-inch flat TV on a wooden cabinet; (3) PREMIUM model: a 65-inch ultra thin TV on a long modern media console with a soundbar. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Quạt — `furn_fan.png`
```
Game asset set: 3 product variants of the same kind of home item — electric fan — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small desk fan with a cracked blade cover; (2) MID-RANGE model: a standing electric fan; (3) PREMIUM model: a tall bladeless tower fan. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Máy lạnh (treo tường) — `furn_aircon.png`
```
Game asset set: 3 product variants of the same kind of home item — wall-mounted air conditioner — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen straight from the front as mounted on a wall. From left to right: (1) BUDGET model: an old yellowed boxy air conditioner; (2) MID-RANGE model: a white inverter air conditioner; (3) PREMIUM model: a premium slim air conditioner with a glossy black panel and a small display. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Máy giặt — `furn_washer.png`
```
Game asset set: 3 product variants of the same kind of home item — washing machine — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: an old twin-tub washing machine; (2) MID-RANGE model: a white top-loading washing machine; (3) PREMIUM model: a front-loading washer with a large round glass door and a digital panel. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Đèn — `furn_lamp.png`
```
Game asset set: 3 product variants of the same kind of home item — lamp — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a bare light bulb clip lamp; (2) MID-RANGE model: a fabric floor lamp; (3) PREMIUM model: a designer arc floor lamp with a warm glow. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Thảm — `furn_rug.png`
```
Game asset set: 3 product variants of the same kind of home item — floor rug, seen from above at an angle — arranged in one row with wide empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each seen in 3/4 top-down front view standing on its own invisible floor. From left to right: (1) BUDGET model: a small woven straw mat; (2) MID-RANGE model: a rectangular patterned fabric rug; (3) PREMIUM model: a large fluffy Persian-style rug. The three must look clearly different in quality and price.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

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


## 12. [Đợt 3] Nấu ăn — nguyên liệu, món, giao diện bếp

*G44–G48. Icon nguyên liệu và món ăn; mặt bếp nhìn từ trên cho mini-game nấu.*

#### Nguyên liệu — `icons_ingredients.png`
```
Game item icon set: a grid of 4 columns x 3 rows, each icon centered in its own equal square cell with generous spacing, all icons the same scale and lighting, front 3/4 view, bold pixel outlines. Icons in this order (left to right, top to bottom): (1) a small bag of rice; (2) a tray of eggs; (3) a pack of instant noodles; (4) a bunch of water spinach (rau muong); (5) a piece of raw pork belly; (6) a whole raw fish; (7) a block of tofu; (8) red tomatoes; (9) spring onions and garlic; (10) a bottle of fish sauce; (11) a bottle of cooking oil; (12) a pack of rice noodles.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Món nấu — `icons_dishes.png`
```
Game item icon set: a grid of 4 columns x 3 rows, each icon centered in its own equal square cell with generous spacing, all icons the same scale and lighting, front 3/4 view, bold pixel outlines. Icons in this order (left to right, top to bottom): (1) a bowl of steamed white rice; (2) a fried egg on a plate; (3) stir-fried water spinach with garlic; (4) a bowl of sour fish soup (canh chua); (5) braised pork with eggs (thit kho trung); (6) caramelized fish in a clay pot (ca kho to); (7) stir-fried noodles; (8) fried rice; (9) tofu in tomato sauce; (10) a bowl of rice porridge; (11) instant noodles with an egg; (12) stir-fried rice vermicelli.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Mặt bếp nấu (mini-game) — `ui_cooking_stove.png`
```
A top-down 16:9 view of a home cooking area for a mini-game: a two-burner stove with a pot and a frying pan on it, a cutting board with a knife on the left, small bowls for ingredients along the bottom, a flame-level dial. No people, no text.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Sách công thức & đánh giá sao — `ui_recipe.png`
```
Three separate elements with wide gaps: (1) an open recipe book with two empty cream pages and a ribbon bookmark, (2) a row of three gold stars (one empty, one half, one full), (3) a small cooking timer.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 13. [Đợt 3] Icon đồ điện tử (3 phân khúc)

*Điện thoại & laptop quyết định nghề Shipper / IT (G43).*

#### Điện tử — `icons_electronics.png`
```
Game item icon set: a grid of 4 columns x 3 rows, each icon centered in its own equal square cell with generous spacing, all icons the same scale and lighting, front 3/4 view, bold pixel outlines. Icons in this order (left to right, top to bottom): (1) a cheap old button phone; (2) a mid-range smartphone; (3) a premium smartphone with three cameras; (4) an old thick laptop; (5) a slim office laptop; (6) a high-end gaming laptop with RGB keyboard; (7) earbuds; (8) over-ear headphones; (9) a bluetooth speaker; (10) a power bank; (11) a wireless mouse; (12) a recipe book.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 14. [Đợt 4] Trung Tâm Mua Sắm

*G25–G28.*

#### Tòa Trung Tâm Mua Sắm — `bld_mall.png`
```
Game asset: front elevation facade of a modern Saigon shopping mall, Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 1.8:1. 3 storeys, big glass display windows showing furniture, TVs and clothes, colorful banners without text, automatic glass doors, a red carpet at the entrance.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Sảnh bên trong — `room_mall.png`
```
Interior of a Saigon shopping mall ground floor seen in 3/4 top-down view: polished light marble floor, an entrance at the bottom center, five shop counters along the walls each with an EMPTY blank sign above: a household goods counter, a furniture showroom corner, an electronics counter with TV screens, a clothing rack corner, and a small supermarket with shelves and a checkout. Bright ceiling lights.

STYLE: detailed 16-bit pixel art game background, Saigon Vietnam, retro late-1990s mood, warm muted palette, dark brown pixel outlines, soft light from a window. 3/4 top-down view (camera about 30 degrees above) looking into the room: back wall fully visible at the top, floor occupying the lower two thirds, side walls slightly visible. No people, no text, no watermark, no sparkle logo. Fill the whole image (no magenta). Output 16:9 landscape.
```

#### Banner 5 quầy — `ui_mall_banners.png`
```
Five wide 3:1 illustrated header banners stacked vertically with gaps: (1) household goods shelves, (2) a furniture showroom with a sofa and bed, (3) an electronics counter with TVs and laptops, (4) a clothing rack boutique, (5) supermarket shelves with groceries. No text.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Gia dụng — `npc_mall_giadung.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in orange with a name badge, dark trousers. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Nội thất — `npc_mall_noithat.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in brown with a name badge, dark trousers. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Điện tử — `npc_mall_dientu.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in blue with a name badge, dark trousers. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Thời trang — `npc_mall_thoitrang.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in pink with a name badge, dark trousers. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhân viên quầy Siêu thị — `npc_mall_sieuthi.png`
```
Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, frame 3 waving one hand. Character: Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in green with a name badge, dark trousers. Draw only the person, NOT sitting.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## 15. [Đợt 4] Trang bị theo độ hiếm & Gacha

*G60–G64: trang bị mua ở quầy Thời trang (Thường/Tốt) hoặc quay gacha hên xui ra Hiếm/Giới hạn. Mỗi ô trang bị có 4 mẫu theo độ hiếm.*

#### Áo & Quần (4 cấp hiếm) — `icons_gear_shirt_pants.png`
```
Game item icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, same scale and lighting, front 3/4 view, bold pixel outlines. Row 1 shows 4 rarity versions of the same item type in a row: (1) COMMON: plain and simple, dull colors; (2) GOOD: nicer material and color, small green accent; (3) RARE: stylish design with blue accents and a subtle shine; (4) LIMITED: luxurious, gold details and a soft golden glow — item type: a shirt / t-shirt. Row 2 shows the same 4 rarity versions — item type: trousers / jeans.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Giày & Nón (4 cấp hiếm) — `icons_gear_shoes_hat.png`
```
Game item icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, same scale and lighting, front 3/4 view, bold pixel outlines. Row 1 shows 4 rarity versions of the same item type in a row: (1) COMMON: plain and simple, dull colors; (2) GOOD: nicer material and color, small green accent; (3) RARE: stylish design with blue accents and a subtle shine; (4) LIMITED: luxurious, gold details and a soft golden glow — item type: shoes / sneakers. Row 2 shows the same 4 rarity versions — item type: a cap / hat.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Kính & Đồng hồ (4 cấp hiếm) — `icons_gear_glasses_watch.png`
```
Game item icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, same scale and lighting, front 3/4 view, bold pixel outlines. Row 1 shows 4 rarity versions of the same item type in a row: (1) COMMON: plain and simple, dull colors; (2) GOOD: nicer material and color, small green accent; (3) RARE: stylish design with blue accents and a subtle shine; (4) LIMITED: luxurious, gold details and a soft golden glow — item type: sunglasses / glasses. Row 2 shows the same 4 rarity versions — item type: a wristwatch.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Balo (4 cấp hiếm) & vật phẩm gacha — `icons_gear_bag_gacha.png`
```
Game item icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, same scale and lighting, front 3/4 view, bold pixel outlines. Row 1 shows 4 rarity versions of the same item type in a row: (1) COMMON: plain and simple, dull colors; (2) GOOD: nicer material and color, small green accent; (3) RARE: stylish design with blue accents and a subtle shine; (4) LIMITED: luxurious, gold details and a soft golden glow — item type: a backpack. Row 2: (1) a closed plastic gacha capsule half red half white, (2) a gacha token coin, (3) a pile of glittering fragments (from recycling duplicates), (4) a golden lucky ticket.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Máy gacha — `prop_gacha.png`
```
Single game asset: a cute capsule toy gacha machine as tall as an adult, glass dome full of colorful capsules, a big turning crank, a coin slot and a capsule exit flap, decorated with lights, 3/4 top-down front view.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Hoạt ảnh mở gacha — `ui_gacha_open.png`
```
Sprite sheet: one single horizontal row of EXACTLY 6 frames of a gacha capsule opening, evenly spaced, same size: (1) closed capsule, (2) capsule shaking left, (3) capsule shaking right, (4) capsule cracking open with light leaking out, (5) capsule halves flying apart with a bright burst, (6) empty glowing light burst.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```

#### Nền lộ diện theo độ hiếm — `ui_gacha_reveal.png`
```
Four square reveal background cards in a row with wide gaps, same size, radiating light rays and sparkles: (1) grey for common, (2) green for good, (3) blue for rare, (4) gold with extra sparkles for limited. Empty center for an item icon.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 16. [Đợt 4] Chợ Sạp Hàng Hóa

*G24, G55–G57: người chơi thuê sạp, bày bán, đặt giá; xem & mua hàng của người khác.*

#### Tòa Chợ Sạp Hàng Hóa — `bld_market.png`
```
Game asset: front elevation facade of a covered Saigon community market hall, Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 2:1. a tall corrugated roof on steel columns, an arched entrance, rows of colorful stalls visible inside, hanging lanterns.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Bên trong chợ — `room_market.png`
```
Interior of a covered Vietnamese market hall seen in 3/4 top-down view: concrete floor, three long rows of EMPTY wooden stall tables with numbered-style blank plaques (no text), wide walking aisles between them, hanging bulbs from the roof beams, an entrance at the bottom center.

STYLE: detailed 16-bit pixel art game background, Saigon Vietnam, retro late-1990s mood, warm muted palette, dark brown pixel outlines, soft light from a window. 3/4 top-down view (camera about 30 degrees above) looking into the room: back wall fully visible at the top, floor occupying the lower two thirds, side walls slightly visible. No people, no goods on the tables, no text, no watermark, no sparkle logo. Fill the whole image (no magenta). Output 16:9 landscape.
```

#### Sạp của người chơi (3 cỡ) — `market_stalls.png`
```
Game asset set: 3 market stall tables in one row with wide gaps, same scale, 3/4 top-down front view, EMPTY of goods, each with a blank wooden name plaque: (1) a small single folding table with a cloth, (2) a medium wooden stall with a striped awning, (3) a large glass display stall with shelves and lights.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Giao diện chợ — `ui_market.png`
```
Four separate UI elements with wide gaps: (1) an empty product listing card with an image area on top and two blank lines below, (2) an empty paper price tag with a string, (3) a red rubber stamp mark shaped like a circle with a check, (4) an empty search bar with a magnifying glass icon.

STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle logo, no characters. Elements must not overlap or touch. Output 16:9 landscape.
```


## 17. [Đợt 4] Công trình lấp phố

*Thay ảnh tạm vẽ bằng code. Nhà ống số 1 dùng làm Nhà học sinh cho nghề Gia sư (J8).*

#### Vựa ve chai — `bld_vechai.png`
```
Game asset: front elevation facade of a scrap metal and recycling yard shed, Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 2.5:1. corrugated rusty tin walls, piles of cans, bottles, cardboard and old fans.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 1 (mustard yellow) — `tube_1.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, mustard yellow walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 2 (salmon pink) — `tube_2.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, salmon pink walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 3 (mint green) — `tube_3.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, mint green walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 4 (sky blue) — `tube_4.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, sky blue walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 5 (cream white) — `tube_5.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, cream white walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 6 (lavender) — `tube_6.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, lavender walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 7 (terracotta orange) — `tube_7.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, terracotta orange walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### Nhà ống 8 (pale lime) — `tube_8.png`
```
Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, pale lime walls, small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```


## Hoãn lại — sau bản V2 (38 ảnh)

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

#### bld_bank — `bld_bank.png`
```
Game asset: front elevation facade of a modern bank branch building, Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 1.1:1. 5 storeys of blue glass, marble ground floor, gold accents.

STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape.
```

#### bld_office — `bld_office.png`
```
Game asset: front elevation facade of a corporate office tower, Vietnamese urban architecture, seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio 1.2:1. tall dark glass tower, top cropped, modern glass lobby.

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
