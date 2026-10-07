"""
Sinh docs/ASSET_TODO.md: danh sach asset can ve cho ban V2, MOI anh kem prompt day du (copy dan vao Gemini).

  python tools/asset_todo.py

Cap nhat: sua cac nhom SEGMENTS ben duoi (xoa muc da nhan art, them muc moi) roi chay lai.
Thiet ke lien quan: docs/GAMEPLAY_V2.md, docs/ANIMATION_V2.md, docs/INVENTORY_V2.md
"""
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- khoi phong cach
STYLE = (
    "STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, warm muted "
    "palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, soft light from top-left, "
    "3/4 top-down front-facing view (camera about 30 degrees above). Plain solid flat magenta background #FF00FF "
    "filling the whole image. No text, no letters, no numbers, no labels, no watermark, no sparkle logo, no "
    "signature, no drop shadow, no floor, no ground. Objects must not overlap or touch. Output 16:9 landscape."
)
STYLE_UI = (
    "STYLE: 16-bit pixel art game user-interface element, retro Saigon 1990s theme (aged cream paper, warm teak "
    "wood, brass trims, faded teal and rust red accents), perfectly flat front view with NO perspective, crisp "
    "dark brown pixel outlines, clean straight edges suitable for slicing in a game engine. Plain solid flat "
    "magenta background #FF00FF around every element. No text, no letters, no numbers, no watermark, no sparkle "
    "logo, no characters. Elements must not overlap or touch. Output 16:9 landscape."
)
STYLE_ROOM = (
    "STYLE: detailed 16-bit pixel art game background, Saigon Vietnam, retro late-1990s mood, warm muted palette, "
    "dark brown pixel outlines, soft light from a window. 3/4 top-down view (camera about 30 degrees above) looking "
    "into the room: back wall fully visible at the top, floor occupying the lower two thirds, side walls slightly "
    "visible. The floor shows a clear even grid of square tiles or planks so furniture can be placed on it. "
    "EMPTY room: no furniture, no people, no text, no watermark, no sparkle logo. Fill the whole image (no magenta). "
    "Output 16:9 landscape."
)

# ---------------------------------------------------------------- mau dai animation
STRIP = (
    "Sprite sheet: one single horizontal row of EXACTLY {n} animation frames, evenly spaced with wide gaps, the SAME "
    "character in every frame with identical size, proportions, clothing and colors, feet on the same baseline. "
    "Character: {desc}. Animation: {action}"
)
WALK_PHASES = (
    "a smooth 8-frame walking cycle. Frame 1: right foot touches the ground in front, body at its lowest. Frame 2: "
    "weight shifts onto the right leg, body low. Frame 3: left leg passes the right leg, body at its highest. Frame "
    "4: left foot swings forward. Frame 5: left foot touches the ground in front, body at its lowest. Frame 6: "
    "weight shifts onto the left leg, body low. Frame 7: right leg passes the left leg, body at its highest. Frame 8: "
    "right foot swings forward. Arms swing opposite to the legs. The head and body bob up and down by about 2 "
    "pixels between the lowest and highest frames"
)
ACTIONS = {
    "walk_down": (8, WALK_PHASES + ", walking TOWARD the viewer (front view)."),
    "walk_up": (8, WALK_PHASES + ", walking AWAY from the viewer (back view, back of the head visible)."),
    "walk_left": (8, WALK_PHASES + ", in side profile facing and moving to the LEFT."),
    "idle_down": (4, "a gentle 4-frame breathing idle facing the viewer. Frame 1 neutral, frame 2 chest rises "
                     "slightly, frame 3 neutral with eyes closed (blink), frame 4 chest lowers slightly."),
    "idle_up": (4, "a gentle 4-frame breathing idle seen from BEHIND (back of the head visible). Frame 1 neutral, "
                   "frame 2 shoulders rise slightly, frame 3 neutral, frame 4 shoulders lower slightly."),
    "idle_left": (4, "a gentle 4-frame breathing idle in side profile facing LEFT. Frame 1 neutral, frame 2 chest "
                     "rises slightly, frame 3 neutral with a blink, frame 4 chest lowers slightly."),
    "pickup_down": (6, "a 6-frame pick-up action facing the viewer: 1 standing, 2 starts bending knees, 3 crouching "
                       "and reaching to the ground, 4 grabbing a small object, 5 standing up holding it, 6 putting it "
                       "into the bag."),
    "eat_down": (6, "a 6-frame eating action facing the viewer: 1 holding a banh mi sandwich at chest, 2 lifting it "
                    "to the mouth, 3 biting, 4 chewing, 5 lowering it, 6 smiling satisfied."),
    "phone_down": (4, "a 4-frame loop facing the viewer, holding a smartphone in both hands and tapping the screen, "
                      "looking down at it, thumbs moving."),
    "run_left": (8, "a fast 8-frame running cycle in side profile facing LEFT, leaning forward, long strides, both "
                    "feet off the ground in frames 3 and 7, panicking."),
}

SV_MALE = ("Vietnamese male university student around 20, short messy black hair, teal-green polo shirt, faded "
           "blue jeans, worn white canvas sneakers, carrying a navy-blue textbook under his left arm "
           "(same character as the attached reference image)")

WORK = (
    "Sprite sheet: one single horizontal row of EXACTLY 6 animation frames, evenly spaced with wide gaps, the same "
    "STANDING character in every frame with identical size, feet on the same baseline, facing the viewer in 3/4 "
    "front view. NOT sitting. Looping work animation: {work}. Character: {desc}. Draw ONLY the person, no "
    "furniture, no counter, no cart."
)

BUILDING = (
    "Game asset: front elevation facade of {what}, Vietnamese urban architecture, seen straight from the front with "
    "a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in "
    "front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. Above "
    "the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio {ratio}. {detail}."
)


def strip(name, desc, action):
    n, text = ACTIONS[action]
    return STRIP.format(n=n, desc=desc, action=text)


def furniture_set(items):
    return ("Game asset set: {n} separate pieces of furniture for a Vietnamese home, arranged in one row with wide "
            "empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each "
            "seen in 3/4 top-down front view standing on its own invisible floor: {list}.").format(
        n=len(items), list="; ".join(f"({i + 1}) {t}" for i, t in enumerate(items)))


def icon_grid(items, cols=4):
    rows = (len(items) + cols - 1) // cols
    return ("Game item icon set: a grid of {c} columns x {r} rows, each icon centered in its own equal square cell "
            "with generous spacing, all icons the same scale and lighting, front 3/4 view, bold pixel outlines. "
            "Icons in this order (left to right, top to bottom): {list}.").format(
        c=cols, r=rows, list="; ".join(f"({i + 1}) {t}" for i, t in enumerate(items)))


# ---------------------------------------------------------------- danh sach theo nhom
# Moi muc: (ten hien thi, ten file, prompt, khoi style). Dot = thu tu ve, khop GAMEPLAY_V2 muc 11.
SEGMENTS = []


def seg(title, why, items):
    SEGMENTS.append((title, why, items))


def tiers(kind, budget, mid, premium, wall=False):
    view = ("seen straight from the front as mounted on a wall" if wall
            else "seen in 3/4 top-down front view standing on its own invisible floor")
    return ("Game asset set: 3 product variants of the same kind of home item — {k} — arranged in one row with wide "
            "empty gaps, all drawn at the same scale (an adult would be about 1.6 times the height of a door), each "
            "{v}. From left to right: (1) BUDGET model: {b}; (2) MID-RANGE model: {m}; (3) PREMIUM model: {p}. The "
            "three must look clearly different in quality and price.").format(k=kind, v=view, b=budget, m=mid, p=premium)


def npc_idle(desc, extra="frame 3 waving one hand"):
    return ("Sprite sheet: one single horizontal row of EXACTLY 4 animation frames, evenly spaced, the same STANDING "
            "character facing the viewer, feet on the same baseline. Loop: friendly breathing idle, " + extra +
            ". Character: " + desc + ". Draw only the person, NOT sitting.")


# ===================== ĐỢT 1 — nhân vật, phố, xe buýt, túi đồ
seg("1. [Đợt 1] Sinh viên nam — animation V2 (8 frame đi, 4 frame đứng)",
    "ANIMATION_V2 A1–A7. Vẽ `idle_down` TRƯỚC, các ảnh sau đính kèm `idle_down` làm tham chiếu.",
    [(f"sv_male · {a}", f"sv_male_{a}.png", strip("sv_male", SV_MALE, a), STYLE)
     for a in ["idle_down", "walk_down", "walk_up", "walk_left", "idle_up", "idle_left",
               "pickup_down", "eat_down", "phone_down"]])

police = ("Vietnamese police patrol officer, olive-green uniform shirt with red collar tabs and shoulder boards, olive "
          "peaked cap with a round badge, dark green trousers, black shoes, black belt with a baton")
thief = ("skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, dark "
         "track pants, worn sneakers, hunched shoulders, shifty eyes")
seg("2. [Đợt 1] Cảnh sát & Ăn trộm",
    "Trộm vẫn nhắm người giữ nhiều tiền mặt; cảnh sát tuần tra trấn áp trộm. Chuẩn 8/4 frame (A8).",
    [(f"Cảnh sát · {a}", f"police_{a}.png", strip("police", police, a), STYLE)
     for a in ["idle_down", "walk_down", "walk_up", "walk_left"]]
    + [(f"Ăn trộm · {a}", f"thief_{a}.png", strip("thief", thief, a), STYLE)
       for a in ["idle_down", "walk_down", "walk_up", "walk_left", "run_left"]])

WALKERS = {
    "walker_old": "elderly Vietnamese man with grey hair and moustache, beige short-sleeve shirt, brown trousers, "
                  "walking slowly with a wooden cane",
    "walker_mom": "Vietnamese woman in her 30s, floral blouse, dark trousers, carrying a plastic shopping bag with "
                  "vegetables",
    "walker_kid": "Vietnamese schoolboy around 9, white short-sleeve school shirt with a red scarf (khan quang do), "
                  "dark blue shorts, small backpack",
    "walker_officegirl": "young Vietnamese office woman around 25, white blouse, black pencil skirt, small shoulder "
                         "bag, holding a takeaway iced coffee",
}
seg("3. [Đợt 1] Người đi đường",
    "Cần cho nghề Phát tờ rơi (J5 — đi tới người đi đường để phát) và làm phố đông vui. Học sinh tiểu học dùng luôn cho nghề Gia sư (J8).",
    [(f"{k} · {a}", f"{k}_{a}.png", strip(k, d, a), STYLE)
     for k, d in WALKERS.items() for a in ["idle_down", "walk_down", "walk_up", "walk_left"]])

# Muc 4 (xe buyt, tram, taxi), 5 (UI kit), 6 (dien thoai & app) — DA NHAN art 2026-10-07.

# ===================== ĐỢT 2 — nghề
seg("7. [Đợt 2] Nơi làm việc mới",
    "Đã nhận mặt tiền quán cơm tấm + tiệm trà sữa. Còn thiếu NPC chủ quán (tạm để quán không người).",
    [("Bà chủ quán cơm tấm", "npc_boss_comtam.png", npc_idle(
         "Vietnamese woman around 50 with a white apron and a headscarf, holding a ladle"), STYLE),
     ("Chủ tiệm trà sữa", "npc_boss_trasua.png", npc_idle(
         "trendy Vietnamese young woman around 24 with a pastel cap and a shop apron"), STYLE),
     ("Cô chủ cà phê (vẽ lại tư thế đứng)", "npc_cafe.png", WORK.format(
         work="standing and pouring condensed milk coffee from a phin filter into a glass with ice, then stirring",
         desc="Vietnamese woman around 45, hair in a bun, apron over a light floral blouse, dark trousers"), STYLE),
     ("Cô Ba tạp hóa (vẽ lại tư thế đứng)", "npc_taphoa.png", WORK.format(
         work="standing, fanning herself with a paper hand fan and waving to call customers",
         desc="plump Vietnamese woman around 50, curly short hair, pink-checked blouse and trousers, sandals"), STYLE)])

seg("8. [Đợt 2] Mini-game các nghề",
    "G34. Đã nhận J1 IT, J2 Phục vụ, quầy J3 (file job_milktea_items.png gửi nhầm là ảnh quầy — đang dùng làm quầy), "
    "J5 tờ rơi, J6 bản đồ + đồ shipper, J8 vở & bảng. "
    "Ảnh J3 bên dưới là tùy chọn (icon cho phiếu order). J4 cần ảnh quầy NHÌN TỪ TRÊN XUỐNG — ảnh prop_coffee_prep_table "
    "nhìn nghiêng nên đang dùng làm đồ trang trí ở quán cà phê.",
    [("J3 Trà sữa — ly & topping (tùy chọn)", "job_milktea_items.png", icon_grid([
         "a small empty plastic cup", "a medium empty plastic cup", "a large empty plastic cup", "black tea pitcher",
         "green tea pitcher", "a bowl of tapioca pearls", "a bowl of fruit jelly", "a bowl of pudding",
         "cheese foam topping", "a scoop of ice", "a sugar syrup bottle", "a finished sealed bubble tea"]), STYLE_UI),
     ("J4 Cà phê — quầy pha phin", "job_coffee_counter.png",
      "A top-down 16:9 view of a Vietnamese street coffee preparation table: a kettle, a row of empty glasses, phin "
      "filters, a can of condensed milk, an ice bucket, a tray. No people, no text.", STYLE_UI),
     ("J4 Cà phê — các bước phin", "job_coffee_steps.png",
      "A row of 6 game sprites of identical size with wide gaps showing a Vietnamese phin coffee being made, seen from "
      "the front: (1) empty glass with phin on top, (2) ground coffee in the phin, (3) hot water poured in, (4) coffee "
      "dripping, (5) glass with black coffee and condensed milk at the bottom, (6) finished iced milk coffee with "
      "ice.", STYLE_UI)])

seg("9. [Đợt 2] Chân dung NPC — vẽ lại 2 ô",
    "Đã nhận ui_portraits.png (8 ô) nhưng ô 4 (chủ quán cơm tấm) vẽ thành đàn ông, ô 5 (chủ tiệm trà sữa) vẽ thành "
    "cậu bé đội nón lưỡi trai. 6 ô còn lại đang dùng trong hội thoại. Đính kèm ui_portraits.png làm tham chiếu.",
    [("Chân dung chủ quán cơm tấm & chủ tiệm trà sữa", "ui_portraits_2.png",
      "Character portrait set in the SAME style as the attached portrait grid: 2 columns x 1 row of bust portraits "
      "(head and shoulders), each centered in its own equal square cream card with a simple warm background circle, "
      "same scale, facing slightly left: (1) a Vietnamese WOMAN around 50, restaurant owner, kind face, a headscarf "
      "and a white apron over a brown blouse; (2) a trendy Vietnamese YOUNG WOMAN around 24, bubble tea shop owner, "
      "long hair, a pastel pink cap and a light shop apron. Both clearly female.", STYLE_UI)])

# ===================== ĐỢT 3 — nhà ở, ngủ, nấu ăn
seg("11. [Đợt 3] Nội thất còn thiếu (Bình dân · Tầm trung · Cao cấp)",
    "G22, G51. Đã nhận 20/24 loại (giường, tủ, rương, tủ lạnh, bếp, nồi cơm, lò vi sóng, bồn rửa, bàn ăn, bàn học, "
    "máy tính, kệ sách, sofa, bàn trà, TV, quạt, máy lạnh, máy giặt, đèn, thảm). Còn 4 loại dưới đây. "
    "Lưu ý: KHÔNG vẽ người mẫu tham chiếu và KHÔNG ghi chữ BUDGET/PREMIUM dưới đồ.",
    [("Cây cảnh", "furn_plant.png", tiers("indoor plant",
        "a small cactus in a plastic cup",
        "a money plant in a ceramic pot",
        "a tall fiddle-leaf fig in a large woven basket"), STYLE),
     ("Rèm cửa (treo tường)", "furn_curtain.png", tiers("window curtains",
        "a thin floral bed sheet hung as a curtain",
        "plain blue fabric curtains",
        "thick velvet blackout curtains with gold tie-backs", wall=True), STYLE),
     ("Tranh treo tường", "furn_painting.png", tiers("framed wall picture",
        "a printed calendar poster",
        "a framed watercolor of Saigon streets",
        "a large lacquer painting with a gold frame", wall=True), STYLE),
     ("Đồng hồ (báo thức & treo tường)", "furn_clock.png", tiers("clock",
        "a small plastic alarm clock with two bells",
        "a round wall clock",
        "a smart digital clock with a glowing display"), STYLE)])

# Muc 10 (phong, chung cu), 12 (nau an), 13 (dien tu) — DA NHAN art 2026-10-07 (commit 977ec5b).

# ===================== ĐỢT 4 — mua sắm & chợ
seg("14. [Đợt 4] Trung Tâm Mua Sắm — nhân viên quầy còn thiếu",
    "G25–G28. Đã nhận tòa nhà, sảnh, banner 5 quầy, nhân viên quầy Gia dụng. Ảnh npc_mall_noithat.png nhận được "
    "mặc áo CAM giống hệt quầy Gia dụng → vẽ lại áo NÂU. Đính kèm npc_mall_giadung.png làm tham chiếu dáng.",
    [(f"Nhân viên quầy {q}", f"npc_mall_{k}.png", npc_idle(
        f"Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in {c} with a name badge, dark "
        "trousers" + extra), STYLE)
     for k, q, c, extra in [
         ("noithat", "Nội thất (vẽ lại)", "chocolate BROWN (not orange)", ", short neat hair, a different face from "
          "the attached reference"),
         ("dientu", "Điện tử", "blue", ""), ("thoitrang", "Thời trang", "pink", ", a young woman with a ponytail"),
         ("sieuthi", "Siêu thị", "green", "")]])

# Muc 15 (trang bi 4 cap hiem & gacha), 16 (cho sap hang hoa) — DA NHAN art 2026-10-07.

seg("17. [Đợt 4] Công trình lấp phố — nhà ống còn thiếu",
    "Đã nhận vựa ve chai + nhà ống 1–4, 6–8 (đang dùng trong game). Còn thiếu nhà ống số 5.",
    [("Nhà ống 5 (xanh cốm — tube_8 nhận được đã là màu kem)", "tube_5.png",
      "Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, pale lime green walls, "
      "small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a "
      "half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to "
      "height ratio 1:3.", STYLE)])

# ---------------------------------------------------------------- hoan lai (sau V2)
# ---------------------------------------------------------------- THI TRAN LIEN MACH (dem 2026-10-08, docs/NIGHT_PLAN.md muc D)
_TOWN = [
    ('Mặt đất: vỉa hè / đường / bó vỉa / lề cỏ (lát nối)', 'tile_street.png',
     'Game texture set: EXACTLY 4 square ground tiles in one horizontal row, each tile the same size, separated by wide flat magenta #FF00FF gaps. Each tile is seen straight from above (flat top-down, no perspective) and MUST tile seamlessly on all four edges (left matches right, top matches bottom) with no visible border, no vignette, no lighting gradient. From left to right: (1) Saigon sidewalk paving: small worn square cement tiles in cream-grey with faint terracotta accents and a few hairline cracks; (2) asphalt road: dark charcoal-blue asphalt with subtle grain and one faint patch, no lane markings; (3) granite curb stone: grey granite kerb blocks seen from above, joints every quarter tile; (4) roadside grass verge: short tropical grass with tiny weeds and a little bare soil. Muted palette matching the attached references.',
     STYLE),
    ('Dải lề dưới theo 4 khu (lát nối)', 'verge_zones.png',
     "Game asset set: EXACTLY 4 long horizontal strips stacked vertically with wide flat magenta #FF00FF gaps between them, each strip about 6 times wider than tall, each MUST tile seamlessly left-to-right (left edge continues the right edge). Each strip is a roadside verge seen in 3/4 top-down view, running along the bottom of a street, low (no taller than an adult's knee except plants). From top to bottom: (1) UNIVERSITY: neat green hedge in a red-brick planter with a low cream painted iron railing; (2) FOOD STREET: worn terracotta brick planter with potted herbs, small plastic pots and a low blue-painted railing; (3) FINANCIAL DISTRICT: polished grey granite planter box with trimmed boxwood and a brushed metal edge; (4) SUBURB: rusty corrugated metal fence low section with tall weeds and packed dirt. No people, no vehicles.",
     STYLE),
    ('Skyline xa (lát nối)', 'skyline_far.png',
     'Game background asset: ONE long horizontal strip of a distant Saigon city skyline silhouette, about 5 times wider than tall, that MUST tile seamlessly left-to-right. Hazy, low-contrast, desaturated blue-grey and dusty lavender tones as if seen through warm afternoon haze; mix of 1990s tube houses, a few mid-rise blocks, water towers, TV antennas, tangled power lines, one old church spire and a couple of cranes. Flat front view, no strong outlines (lighter outline than foreground assets), no lit windows, no sky drawn — only the silhouette shapes, sitting on a flat bottom edge.',
     STYLE),
    ('Ngân hàng — vẽ lại theo tông retro', 'bld_bank.png',
     "Game asset: front elevation facade of a 1990s Saigon bank branch, 3 storeys, French-colonial-meets-1990s style: ochre and cream plastered walls, tall arched windows with dark green shutters, a marble-step entrance with brass double doors at the bottom center (door height about 1.3 times an adult's height), an iron-grille security gate folded open, a small ATM niche to the right of the door, potted palms, air-conditioner units on the side, and a large EMPTY blank signboard plate above the entrance. Width to height ratio 1.3:1. Seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front).",
     STYLE),
    ('Văn phòng TechCorp — vẽ lại theo tông retro', 'bld_office.png',
     "Game asset: front elevation facade of a late-1990s Saigon office building, 4 storeys, concrete and teal-tinted glass ribbon windows with horizontal sun-shade fins, a small glass lobby entrance at the bottom center (door height about 1.3 times an adult's height), a security booth beside the door, a row of concrete planters with small shrubs, rooftop water tank and antenna, faded paint and a few air-conditioner units, and a large EMPTY blank signboard plate across the top of the ground floor. Width to height ratio 1.3:1, NOT a skyscraper. Seen straight from the front with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street in front).",
     STYLE),
    ('Bộ đồ phố cùng tỉ lệ (cột, đèn, cây me, cây bàng, thùng rác, ghế)', 'street_set.png',
     'Game asset set: EXACTLY 6 street furniture objects in one horizontal row with wide even gaps, all drawn at the SAME scale (an adult would be 1 unit tall): (1) a concrete electric pole with a crossbar, insulators and a few tangled cables ending short, 3.2 units tall; (2) a single-arm 1990s street lamp with a curved green-painted pole, 2.8 units tall; (3) a tamarind tree (cay me) with a feathery round canopy in a square iron tree grate, 2.6 units tall and 1.6 wide; (4) an Indian almond tree (cay bang) with layered flat canopy in the same tree grate, 2.6 units tall and 1.6 wide; (5) a green municipal wheeled trash bin, 0.6 units; (6) a stone park bench, 0.5 units tall. Each object standing upright in 3/4 top-down front view, bases on the same baseline.',
     STYLE),
    ('Sân vựa ve chai (gom phế liệu thành 1 khối)', 'yard_vechai.png',
     'Game asset: ONE single compact scrap yard ground patch seen in 3/4 top-down view, about 3 times wider than tall, to sit beside a Vietnamese scrap dealer shop: a packed-dirt yard with neat piles of flattened cardboard tied with string, a stack of old tires, a heap of aluminium cans in a woven sack, a rusty bicycle frame, an old weighing scale and a low corrugated sheet fence along the back edge. Everything grouped into one connected object with soft irregular edges, no people, no vehicles with engines.',
     STYLE),
    ('Nhà ống mẫu mới (tube_9)', 'tube_9.png',
     "Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 storeys, faded salmon pink walls with a turquoise iron balcony grille and a bougainvillea vine, ground floor with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3, same scale as the attached tube house references (the ground floor door is about 1.3 times an adult's height).",
     STYLE),
    ('Nhà ống mẫu mới (tube_10)', 'tube_10.png',
     "Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 storeys, dusty sky-blue walls with wooden shutters, a small altar window and a rooftop water tank, ground floor with a half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3, same scale as the attached tube house references (the ground floor door is about 1.3 times an adult's height).",
     STYLE),
    ('Icon thanh nút HUD (thay emoji)', 'ui_dock_icons.png',
     'Game UI icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous spacing, same scale and lighting, perfectly flat front view, bold pixel outlines, readable at 32x32 pixels. Icons in order: (1) woven market basket with produce; (2) speech bubble; (3) smiling face badge; (4) open guide book; (5) hamburger menu of three wooden bars; (6) brass wrench; (7) folded paper map; (8) small bell with a dot for notifications.',
     STYLE_UI),
    ('Cổng / mốc nhận diện 4 khu', 'zone_gate_set.png',
     'Game asset set: EXACTLY 4 roadside zone landmark objects in one horizontal row with wide even gaps, same scale (an adult is 1 unit tall), each about 2.5 units tall, 3/4 top-down front view, each with an EMPTY blank plate where a name would go: (1) UNIVERSITY: a cream concrete pillar gate post with a small blank bronze plaque and a flowering frangipani; (2) FOOD STREET: a red-and-yellow festive lantern post with a blank wooden hanging board; (3) FINANCIAL DISTRICT: a polished granite monolith marker with a blank brass plate; (4) SUBURB: a leaning wooden post with a blank rusty tin sign and a tied bundle of scrap.',
     STYLE),
]
seg("0. Thị trấn liền mạch — ƯU TIÊN vẽ trước (P0: tile_street, verge_zones, skyline_far, bld_bank, bld_office; P1: còn lại)",
    "Từng ảnh đẹp nhưng gộp lại rối. Bộ ảnh này làm nền, lề, đồ phố và 2 công trình lạc tông cho cùng một hệ tỉ lệ / bảng màu. "
    "Ảnh tile (tile_street, verge_zones, skyline_far) là ngoại lệ: nhiều tile trong 1 ảnh, mỗi tile lát nối được. "
    "Thứ tự đề xuất: tile_street → verge_zones → skyline_far → bld_bank / bld_office → street_set → yard_vechai → tube_9/10 → ui_dock_icons → zone_gate_set.",
    _TOWN)
SEGMENTS.insert(0, SEGMENTS.pop())

DEFER_CHARS = {
    "sv_female": "Vietnamese female university student around 20, long straight black hair in a low ponytail, white "
                 "short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals",
    "vp_male": "Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress "
               "shirt, dark navy trousers, brown leather shoes, holding a brown leather briefcase",
    "vp_female": "Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic in "
                 "grey-beige small pattern, black straight trousers, low brown heels, small brown handbag",
    "tt_female": "Vietnamese street vendor woman in her 40s, conical non la hat, brown ao ba ba blouse, loose black "
                 "silk trousers, rubber sandals, carrying a woven rattan basket",
    "tt_male": "Vietnamese street vendor man in his 40s, faded white undershirt under an open checkered shirt, khaki "
               "shorts, small towel over the shoulder, rubber flip-flops",
}
DEFER = []
for k, d in DEFER_CHARS.items():
    for a in ["idle_down", "walk_down", "walk_up", "walk_left", "idle_up", "idle_left"]:
        DEFER.append((f"{k} · {a}", f"{k}_{a}.png", strip(k, d, a), STYLE))
for key, what, ratio, detail in [
    ("bld_auction", "a grand auction house", "1:1", "neoclassical columns, red carpet steps, brass lamps"),
]:
    DEFER.append((key, f"{key}.png", BUILDING.format(what=what, ratio=ratio, detail=detail), STYLE))
gang = ("tough Vietnamese gangster man around 35, buzz-cut hair, dark sunglasses, open red floral shirt over a white "
        "tank top, thick gold chain, dragon tattoos on forearms, black trousers, leather sandals")
for a in ["idle_down", "walk_down", "walk_up", "walk_left"]:
    DEFER.append((f"Giang hồ · {a}", f"gangster_{a}.png", strip("gangster", gang, a), STYLE))
DEFER.append(("Chủ quán net (đứng) — giải trí đang ẩn", "npc_netco.png", WORK.format(
    work="standing behind an invisible counter, typing on an invisible keyboard, then yawning and stretching",
    desc="Vietnamese young man around 25, black gaming t-shirt, headphones around the neck, shorts, slippers"), STYLE))


def block(title, file, prompt, style):
    return f"#### {title} — `{file}`\n```\n{prompt}\n\n{style}\n```\n"


def main():
    md = ["# Asset cần vẽ — Bản V2 (kèm prompt cho Gemini)\n",
          "> File tự sinh bởi `python tools/asset_todo.py` theo thiết kế [GAMEPLAY_V2](GAMEPLAY_V2.md), "
          "[ANIMATION_V2](ANIMATION_V2.md), [INVENTORY_V2](INVENTORY_V2.md). **Đang chờ bạn duyệt thiết kế** — "
          "nếu bỏ ý nào thì asset tương ứng cũng bỏ.\n",
          "> **Vẽ bằng Gem *Họa sĩ Hàng Rong*:** hướng dẫn tạo Gem ở [GEMINI_GEM.md](GEMINI_GEM.md) — Gem tự áp phong cách & quy chuẩn.\n",
          "> **Có trang copy nhanh:** mở `docs/asset_todo.html` bằng trình duyệt — mỗi prompt có nút **Copy**, bấm xong tự đánh dấu ✅ đã dùng.\n",
          "> **Cách dùng:** mỗi khối là **một ảnh** → copy nguyên khối dán vào Gemini. Đính kèm ảnh tham chiếu "
          "phong cách (`NPC.png`, hoặc ảnh đầu tiên của chính nhân vật đó). Lưu đúng tên file ở tiêu đề khối, bỏ vào "
          "`asset_new_by_Khoit/`. Nếu ra sai số frame → tạo lại, đừng cắt ghép.\n"]
    total = 0
    toc = []
    body = []
    for title, why, items in SEGMENTS:
        total += len(items)
        toc.append(f"| {title} | {len(items)} |")
        body.append(f"\n## {title}\n\n*{why}*\n")
        body += [block(*it) for it in items]
    md.append(f"\n**Tổng bản V2: {total} ảnh.**\n\n| Nhóm | Số ảnh |\n|---|---|\n" + "\n".join(toc) + "\n")
    md += body
    md.append(f"\n## Hoãn lại — sau bản V2 ({len(DEFER)} ảnh)\n\n*Nhân vật khác, công trình đang đóng cửa "
              "(G2), Giang hồ. Đã nâng lên chuẩn 8 frame đi / 4 frame đứng.*\n")
    md += [block(*it) for it in DEFER]
    path = os.path.join(ROOT, "docs", "ASSET_TODO.md")
    with open(path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(md))
    write_html(total)
    print("Đã ghi", path, "+ docs/asset_todo.html — V2:", total, "ảnh, hoãn:", len(DEFER))


def write_html(total):
    """Trang copy prompt: nut Copy tu danh dau 'Da dung' (luu localStorage theo ten file anh)."""
    import json
    groups = [{"title": t, "why": w, "items": [{"name": n, "file": f, "prompt": f"{p}\n\n{s}"} for n, f, p, s in its]}
              for t, w, its in SEGMENTS]
    groups.append({"title": f"Hoãn lại — sau bản V2", "why": "Nhân vật khác, công trình đang đóng, Giang hồ.",
                   "items": [{"name": n, "file": f, "prompt": f"{p}\n\n{s}"} for n, f, p, s in DEFER]})
    data = json.dumps(groups, ensure_ascii=False).replace("</", "<\\/")
    html = HTML_TEMPLATE.replace("__DATA__", data).replace("__TOTAL__", str(total))
    with open(os.path.join(ROOT, "docs", "asset_todo.html"), "w", encoding="utf-8") as fp:
        fp.write(html)


HTML_TEMPLATE = r"""<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prompt asset Hàng Rong</title>
<style>
:root{--bg:#f6f1e7;--card:#fffdf8;--ink:#2b2118;--muted:#7a6a58;--line:#e2d6c2;--accent:#c9772b;--ok:#3f8f4e;--okbg:#e7f3e6;--code:#f3ece0}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1b1713;--card:#25201a;--ink:#f1e7d6;--muted:#a8977f;--line:#3a3127;--accent:#e8a33c;--ok:#7cc48a;--okbg:#22331f;--code:#1f1a15}}
:root[data-theme="dark"]{--bg:#1b1713;--card:#25201a;--ink:#f1e7d6;--muted:#a8977f;--line:#3a3127;--accent:#e8a33c;--ok:#7cc48a;--okbg:#22331f;--code:#1f1a15}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:12px 16px}
.wrap{max-width:980px;margin:0 auto}
h1{font-size:19px;margin:0 0 6px}
.bar{height:8px;background:var(--line);border-radius:4px;overflow:hidden}.bar i{display:block;height:100%;background:var(--ok);width:0;transition:width .3s}
.tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.tools input[type=search]{flex:1;min-width:160px;padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)}
button{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:8px;padding:6px 12px}
button.primary{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:600}
main{padding:12px 16px 60px}
details.section{background:var(--card);border:1px solid var(--line);border-radius:12px;margin:14px 0;overflow:hidden}
details.section>summary{list-style:none;cursor:pointer;padding:12px 14px;display:flex;gap:10px;align-items:center}
details.section>summary::-webkit-details-marker{display:none}
.sec-title{font-weight:700;flex:1}.count{color:var(--muted);font-variant-numeric:tabular-nums}
.why{color:var(--muted);padding:0 14px 8px;margin:0}
.item{border-top:1px solid var(--line);padding:10px 14px}
.item.used{background:var(--okbg)}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.name{font-weight:600;flex:1;min-width:180px}
.file{font-family:ui-monospace,Consolas,monospace;font-size:12px;background:var(--code);padding:2px 6px;border-radius:5px;cursor:pointer}
.status{font-size:12px;color:var(--ok);font-weight:600}
pre{white-space:pre-wrap;word-break:break-word;background:var(--code);border-radius:8px;padding:8px 10px;margin:8px 0 0;font:12px/1.5 ui-monospace,Consolas,monospace;max-height:7.5em;overflow:hidden;cursor:pointer}
pre.open{max-height:none}
.hide-used .item.used{display:none}
#toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:8px 14px;border-radius:8px;opacity:0;transition:opacity .2s;pointer-events:none}
#toast.show{opacity:1}
</style>
</head>
<body>
<header><div class="wrap">
  <h1>Prompt asset Hàng Rong — V2 (__TOTAL__ ảnh)</h1>
  <p class="count" style="margin:0 0 6px">Dán vào Gem <b>Họa sĩ Hàng Rong</b> (cách tạo: <a href="GEMINI_GEM.md">docs/GEMINI_GEM.md</a>). Bấm Copy → tự đánh dấu đã dùng.</p>
  <div class="bar"><i id="totalBar"></i></div>
  <div class="tools">
    <span id="totalText" class="count"></span>
    <input type="search" id="q" placeholder="Tìm theo tên / tên file…">
    <label><input type="checkbox" id="hideUsed"> Ẩn đã dùng</label>
    <button id="theme" title="Sáng / tối">◐</button>
    <button id="reset">Xóa đánh dấu</button>
  </div>
</div></header>
<main class="wrap" id="list"></main>
<div id="toast"></div>
<script>
const DATA = __DATA__;
const KEY = 'hangrong_asset_used';
let used = {};
try { used = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(used)); } catch (e) {} };
const $ = (s) => document.querySelector(s);
const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };

function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1400); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) { const ta = el('textarea'); ta.value = text; document.body.append(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; }
}

const rows = [];
function render() {
  const list = $('#list');
  DATA.forEach((g, gi) => {
    const sec = el('details'); sec.open = gi < DATA.length - 1; sec.className = 'section';
    const sm = el('summary'); const title = el('span', 'sec-title', g.title); const cnt = el('span', 'count');
    sm.append(title, cnt); sec.append(sm, el('p', 'why', g.why));
    g.items.forEach((it) => {
      const box = el('div', 'item'); box.dataset.file = it.file; box.dataset.search = (it.name + ' ' + it.file).toLowerCase();
      const r = el('div', 'row');
      const status = el('span', 'status');
      const btn = el('button', 'primary', 'Copy prompt');
      const mark = el('button', null, '');
      const file = el('span', 'file', it.file); file.title = 'Bấm để copy tên file';
      r.append(el('span', 'name', it.name), file, status, mark, btn);
      const pre = el('pre', null, it.prompt); pre.title = 'Bấm để mở rộng / thu gọn';
      box.append(r, pre);
      const refresh = () => {
        const u = !!used[it.file];
        box.classList.toggle('used', u);
        status.textContent = u ? '✅ Đã dùng' : '';
        mark.textContent = u ? 'Bỏ đánh dấu' : 'Đánh dấu đã dùng';
        updateCounts();
      };
      btn.onclick = async () => { if (await copy(it.prompt)) { used[it.file] = Date.now(); save(); refresh(); toast('Đã copy prompt · ' + it.file); } else toast('Trình duyệt chặn copy — bấm vào ô prompt rồi Ctrl+A, Ctrl+C'); };
      mark.onclick = () => { if (used[it.file]) delete used[it.file]; else used[it.file] = Date.now(); save(); refresh(); };
      file.onclick = async () => { if (await copy(it.file)) toast('Đã copy tên file'); };
      pre.onclick = () => pre.classList.toggle('open');
      rows.push({ box, refresh, gi });
      sec.append(box);
    });
    sec._cnt = cnt; sec._g = g;
    list.append(sec);
  });
  rows.forEach((r) => r.refresh());
}
function updateCounts() {
  let all = 0, done = 0;
  document.querySelectorAll('#list details').forEach((sec, gi) => {
    const items = sec._g.items; const d = items.filter((i) => used[i.file]).length;
    sec._cnt.textContent = d + '/' + items.length;
    if (gi < DATA.length - 1) { all += items.length; done += d; }
  });
  $('#totalText').textContent = 'Đã dùng ' + done + '/' + all + ' (không tính phần hoãn lại)';
  $('#totalBar').style.width = (all ? done / all * 100 : 0) + '%';
}
render();
$('#hideUsed').onchange = (e) => document.body.classList.toggle('hide-used', e.target.checked);
$('#q').oninput = (e) => { const q = e.target.value.trim().toLowerCase(); rows.forEach((r) => { r.box.style.display = !q || r.box.dataset.search.includes(q) ? '' : 'none'; }); };
$('#reset').onclick = () => { if (confirm('Xóa toàn bộ đánh dấu "đã dùng"?')) { used = {}; save(); rows.forEach((r) => r.refresh()); } };
$('#theme').onclick = () => { const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; r.dataset.theme = dark ? 'light' : 'dark'; };
</script>
</body>
</html>
"""


if __name__ == "__main__":
    main()
