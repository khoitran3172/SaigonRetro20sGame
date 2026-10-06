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

seg("4. [Đợt 1] Giao thông — xe buýt, trạm, taxi",
    "G29–G32. Không còn xe máy. Xe buýt cũ dính watermark ✦ nên vẽ lại; thêm bản cửa mở khi dừng trạm. Taxi đã có art.",
    [("Xe buýt (cửa đóng)", "veh_bus.png",
      "Single game asset: a green Saigon city bus, side profile with the front pointing to the RIGHT, slight 3/4 "
      "top-down tilt, doors closed, no passengers visible, wheels on an invisible flat baseline, length about 5 "
      "times an adult's height.", STYLE),
     ("Xe buýt (cửa mở)", "veh_bus_open.png",
      "Single game asset: the SAME green Saigon city bus as the attached image, side profile with the front pointing "
      "to the RIGHT, both side doors folded OPEN showing the lit interior steps, stopped.", STYLE),
     ("Trạm xe buýt", "bus_stop.png",
      "Single game asset: a Saigon bus stop shelter with a curved metal roof, a bench, a glass side panel and a tall "
      "route pole with an EMPTY blank route board, 3/4 top-down front view, about 1.5 times an adult's height.", STYLE),
     ("Điểm đón taxi", "taxi_stand.png",
      "Single game asset: a small taxi waiting point: a pole with an EMPTY blank sign box on top and a painted "
      "yellow curb section, 3/4 top-down front view.", STYLE)])

# Muc 5 (UI kit) va 6 (dien thoai & app) — DA NHAN art 2026-10-07, da dung trong game.

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
    "G34. Đã nhận J1 IT, J2 Phục vụ, quầy J3 (file job_milktea_items.png gửi nhầm là ảnh quầy — đang dùng làm quầy). "
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
      "ice.", STYLE_UI),
     ("J5 Tờ rơi", "job_flyer.png",
      "Two separate game item icons with a wide gap: (1) a single colorful advertising flyer without readable text, "
      "(2) a thick stack of the same flyers held by a rubber band.", STYLE),
     ("J6 Shipper — bản đồ thành phố", "job_city_map.png",
      "A stylized top-down city map panel of a small Saigon district split into 4 zones from left to right: a "
      "university village with a football field, a food street with stalls, a business district with glass towers, "
      "an outskirts scrap yard. A main road runs horizontally through all zones. No text, no labels.", STYLE_UI),
     ("J6 Shipper — thẻ địa chỉ & thùng hàng", "job_shipper_items.png",
      "Three separate elements with wide gaps: (1) an empty paper delivery address card with a barcode area, (2) a "
      "sealed delivery box with fragile tape, (3) a stopwatch timer icon.", STYLE_UI),
     ("J8 Gia sư — vở & bảng", "job_tutor.png",
      "Two separate elements with a wide gap: (1) an open Vietnamese school notebook with empty ruled pages, (2) a "
      "small empty whiteboard on a stand with a marker tray.", STYLE_UI)])

seg("9. [Đợt 2] Trường học & giao diện tòa nhà",
    "G33, G38–G41. Banner tỉ lệ 3:1 đặt ở đầu panel.",
    [("Banner Trường học", "banner_school.png",
      "A wide 3:1 illustrated header banner: the front gate of a Vietnamese university with a red flag and students "
      "walking in, morning light. Pixel art, no text.", STYLE_UI),
     ("Bảng đen câu hỏi", "ui_chalkboard.png",
      "An empty classroom chalkboard with a wooden frame and a chalk tray, plus 4 separate empty answer cards of "
      "identical size in red, blue, green and yellow.", STYLE_UI),
     ("Khung màn hình ATM", "ui_atm.png",
      "An ATM machine front panel seen straight on: an empty blue screen area at the top, a 12-key metal number pad "
      "below, a card slot and a cash slot. No text on the keys.", STYLE_UI),
     ("Banner Bưu điện & phong bì", "ui_post.png",
      "Two separate elements: (1) a wide 3:1 illustrated header banner of the yellow French colonial Saigon post "
      "office interior with wooden counters, (2) an empty open paper envelope with a red and blue airmail border.",
      STYLE_UI),
     ("Hợp đồng thuê & hóa đơn tuần", "ui_contract_bill.png",
      "Two separate elements with a wide gap: (1) an empty aged paper rental contract with a red stamp area and a "
      "signature line, (2) an empty narrow paper bill receipt with a torn bottom edge and a small light bulb symbol "
      "at the top.", STYLE_UI),
     ("Sơ đồ tuyến xe buýt", "ui_bus_map.png",
      "A stylized bus route map panel: a single green route line connecting 4 round stop markers from left to right, "
      "each stop with a small picture next to it: a university gate, a street food stall, glass office towers, a "
      "scrap yard. No text.", STYLE_UI),
     ("Chân dung NPC hội thoại", "ui_portraits.png",
      "Character portrait set: a grid of 4 columns x 2 rows of bust portraits (head and shoulders), each centered in "
      "its own equal square cell with a simple warm background circle, same scale, facing slightly left: (1) old "
      "banh mi grandmother with conical hat, (2) coffee lady with a bun, (3) grocery lady with curly hair, (4) com tam "
      "restaurant owner with headscarf, (5) young bubble tea shop owner with pastel cap, (6) mechanic, (7) scrap "
      "collector, (8) postman in blue uniform.", STYLE_UI)])

# ===================== ĐỢT 3 — nhà ở, ngủ, nấu ăn
seg("10. [Đợt 3] Nền phòng & tòa nhà ở",
    "G19–G21. Phòng trống có lưới sàn rõ để đặt đồ.",
    [("Phòng trọ 15m² gác lửng", "room_tro.png",
      "Interior of a small cheap Vietnamese student rental room (phong tro) about 4 by 3 meters: peeling pale green "
      "walls, one small window with iron bars on the back wall, a wooden door on the right wall, a wooden mezzanine "
      "loft edge visible along the top of the back wall, beige ceramic tile floor in a clear 8 x 6 grid.", STYLE_ROOM),
     ("Căn hộ chung cư", "room_apartment.png",
      "Interior of a modern Saigon apartment living space: light cream walls, a large sliding glass door to a "
      "balcony on the back wall showing city towers outside, a door on the right wall, warm wooden plank floor in a "
      "clear 12 x 8 grid.", STYLE_ROOM),
     ("Tòa chung cư", "bld_apartment.png", BUILDING.format(
         what="a mid-rise Saigon apartment building (chung cu)", ratio="1:1.6",
         detail="8 storeys with balconies and potted plants, air conditioner units, a guarded lobby with glass doors "
                "at the bottom"), STYLE)])

seg("11. [Đợt 3] Nội thất 3 phân khúc (Bình dân · Tầm trung · Cao cấp)",
    "G22, G51. Mỗi ảnh = 1 loại đồ × 3 mẫu. Hình đặt trong phòng thu nhỏ làm luôn icon. Đồ treo tường vẽ nhìn thẳng.",
    [("Giường", "furn_bed.png", tiers("bed",
        "a thin foam mattress on the floor with one flat pillow",
        "a simple single wooden bed with a cotton blanket",
        "a large double bed with a padded headboard, thick spring mattress and fluffy duvet"), STYLE),
     ("Tủ quần áo", "furn_wardrobe.png", tiers("wardrobe",
        "a fabric zip-up portable wardrobe on a metal frame",
        "a two-door wooden wardrobe",
        "a tall three-door glossy white wardrobe with a full-length mirror"), STYLE),
     ("Rương / kho", "furn_chest.png", tiers("storage chest",
        "a stack of two plastic storage boxes",
        "a wooden chest with metal latches",
        "an antique carved teak chest with brass corners"), STYLE),
     ("Tủ lạnh", "furn_fridge.png", tiers("refrigerator",
        "a small old mini fridge with a rusty door",
        "a two-door 180-liter white fridge",
        "a large stainless steel side-by-side fridge with a water dispenser"), STYLE),
     ("Bếp nấu", "furn_stove.png", tiers("cooking stove",
        "a single-burner portable gas stove on the floor",
        "a double gas stove on a tiled counter",
        "a sleek black induction cooktop built into a modern kitchen counter with a range hood"), STYLE),
     ("Nồi cơm điện", "furn_ricecooker.png", tiers("rice cooker on a small counter",
        "a dented old aluminium rice cooker",
        "a standard white electric rice cooker",
        "a premium digital rice cooker with a display panel"), STYLE),
     ("Lò vi sóng", "furn_microwave.png", tiers("microwave oven",
        "a yellowed old microwave with a dial",
        "a white microwave with buttons",
        "a black convection microwave oven with a digital display"), STYLE),
     ("Bồn rửa", "furn_sink.png", tiers("kitchen sink",
        "a plastic basin on a wooden stand",
        "a stainless steel sink counter",
        "a double sink in a marble counter with a pull-out faucet"), STYLE),
     ("Bàn ăn", "furn_dining.png", tiers("dining table set",
        "a low folding table with two plastic stools",
        "a wooden table with two wooden chairs",
        "a glass-top dining table with four upholstered chairs"), STYLE),
     ("Bàn học / làm việc", "furn_desk.png", tiers("study desk with chair",
        "a small folding desk with a plastic stool",
        "a wooden study desk with an office chair and a desk lamp",
        "a large L-shaped desk with an ergonomic mesh chair"), STYLE),
     ("Máy tính để bàn (cho nghề IT)", "furn_pc.png", tiers("desktop computer setup on a desk",
        "an old beige PC with a bulky CRT monitor",
        "an office PC with a flat monitor",
        "a gaming PC with RGB lights and two wide monitors"), STYLE),
     ("Kệ sách", "furn_bookshelf.png", tiers("bookshelf",
        "a small plastic shelf with a few books",
        "a five-tier wooden bookshelf full of books",
        "a tall modern bookcase with decor items and LED strip lights"), STYLE),
     ("Sofa", "furn_sofa.png", tiers("sofa",
        "a worn two-seat bamboo bench with thin cushions",
        "a fabric two-seat sofa",
        "a large leather L-shaped sofa with pillows"), STYLE),
     ("Bàn trà", "furn_coffeetable.png", tiers("coffee table",
        "a small plastic stool used as a table",
        "a low wooden coffee table",
        "a marble coffee table with gold legs"), STYLE),
     ("TV & kệ TV", "furn_tv.png", tiers("television on a TV stand",
        "an old small CRT TV on a wooden stool",
        "a 32-inch flat TV on a wooden cabinet",
        "a 65-inch ultra thin TV on a long modern media console with a soundbar"), STYLE),
     ("Quạt", "furn_fan.png", tiers("electric fan",
        "a small desk fan with a cracked blade cover",
        "a standing electric fan",
        "a tall bladeless tower fan"), STYLE),
     ("Máy lạnh (treo tường)", "furn_aircon.png", tiers("wall-mounted air conditioner",
        "an old yellowed boxy air conditioner",
        "a white inverter air conditioner",
        "a premium slim air conditioner with a glossy black panel and a small display", wall=True), STYLE),
     ("Máy giặt", "furn_washer.png", tiers("washing machine",
        "an old twin-tub washing machine",
        "a white top-loading washing machine",
        "a front-loading washer with a large round glass door and a digital panel"), STYLE),
     ("Đèn", "furn_lamp.png", tiers("lamp",
        "a bare light bulb clip lamp",
        "a fabric floor lamp",
        "a designer arc floor lamp with a warm glow"), STYLE),
     ("Thảm", "furn_rug.png", tiers("floor rug, seen from above at an angle",
        "a small woven straw mat",
        "a rectangular patterned fabric rug",
        "a large fluffy Persian-style rug"), STYLE),
     ("Cây cảnh", "furn_plant.png", tiers("indoor plant",
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

seg("12. [Đợt 3] Nấu ăn — nguyên liệu, món, giao diện bếp",
    "G44–G48. Icon nguyên liệu và món ăn; mặt bếp nhìn từ trên cho mini-game nấu.",
    [("Nguyên liệu", "icons_ingredients.png", icon_grid([
        "a small bag of rice", "a tray of eggs", "a pack of instant noodles", "a bunch of water spinach (rau muong)",
        "a piece of raw pork belly", "a whole raw fish", "a block of tofu", "red tomatoes", "spring onions and garlic",
        "a bottle of fish sauce", "a bottle of cooking oil", "a pack of rice noodles"]), STYLE),
     ("Món nấu", "icons_dishes.png", icon_grid([
        "a bowl of steamed white rice", "a fried egg on a plate", "stir-fried water spinach with garlic",
        "a bowl of sour fish soup (canh chua)", "braised pork with eggs (thit kho trung)",
        "caramelized fish in a clay pot (ca kho to)", "stir-fried noodles", "fried rice",
        "tofu in tomato sauce", "a bowl of rice porridge", "instant noodles with an egg", "stir-fried rice vermicelli"]),
      STYLE),
     ("Mặt bếp nấu (mini-game)", "ui_cooking_stove.png",
      "A top-down 16:9 view of a home cooking area for a mini-game: a two-burner stove with a pot and a frying pan on "
      "it, a cutting board with a knife on the left, small bowls for ingredients along the bottom, a flame-level dial. "
      "No people, no text.", STYLE_UI),
     ("Sách công thức & đánh giá sao", "ui_recipe.png",
      "Three separate elements with wide gaps: (1) an open recipe book with two empty cream pages and a ribbon "
      "bookmark, (2) a row of three gold stars (one empty, one half, one full), (3) a small cooking timer.", STYLE_UI)])

seg("13. [Đợt 3] Icon đồ điện tử (3 phân khúc)",
    "Điện thoại & laptop quyết định nghề Shipper / IT (G43).",
    [("Điện tử", "icons_electronics.png", icon_grid([
        "a cheap old button phone", "a mid-range smartphone", "a premium smartphone with three cameras",
        "an old thick laptop", "a slim office laptop", "a high-end gaming laptop with RGB keyboard",
        "earbuds", "over-ear headphones", "a bluetooth speaker", "a power bank", "a wireless mouse",
        "a recipe book"]), STYLE)])

# ===================== ĐỢT 4 — mua sắm & chợ
seg("14. [Đợt 4] Trung Tâm Mua Sắm",
    "G25–G28.",
    [("Tòa Trung Tâm Mua Sắm", "bld_mall.png", BUILDING.format(
        what="a modern Saigon shopping mall", ratio="1.8:1",
        detail="3 storeys, big glass display windows showing furniture, TVs and clothes, colorful banners without "
               "text, automatic glass doors, a red carpet at the entrance"), STYLE),
     ("Sảnh bên trong", "room_mall.png",
      "Interior of a Saigon shopping mall ground floor seen in 3/4 top-down view: polished light marble floor, an "
      "entrance at the bottom center, five shop counters along the walls each with an EMPTY blank sign above: a "
      "household goods counter, a furniture showroom corner, an electronics counter with TV screens, a clothing "
      "rack corner, and a small supermarket with shelves and a checkout. Bright ceiling lights.",
      STYLE_ROOM.replace("EMPTY room: no furniture, no people", "No people").replace(
          "The floor shows a clear even grid of square tiles or planks so furniture can be placed on it. ", "")),
     ("Banner 5 quầy", "ui_mall_banners.png",
      "Five wide 3:1 illustrated header banners stacked vertically with gaps: (1) household goods shelves, (2) a "
      "furniture showroom with a sofa and bed, (3) an electronics counter with TVs and laptops, (4) a clothing rack "
      "boutique, (5) supermarket shelves with groceries. No text.", STYLE_UI)]
    + [(f"Nhân viên quầy {q}", f"npc_mall_{k}.png", npc_idle(
        f"Vietnamese shop assistant around 25 wearing a mall uniform polo shirt in {c} with a name badge, dark "
        "trousers"), STYLE)
       for k, q, c in [("giadung", "Gia dụng", "orange"), ("noithat", "Nội thất", "brown"),
                       ("dientu", "Điện tử", "blue"), ("thoitrang", "Thời trang", "pink"),
                       ("sieuthi", "Siêu thị", "green")]])

RARITY = ("4 rarity versions of the same item type in a row: (1) COMMON: plain and simple, dull colors; (2) GOOD: "
          "nicer material and color, small green accent; (3) RARE: stylish design with blue accents and a subtle "
          "shine; (4) LIMITED: luxurious, gold details and a soft golden glow")


def rarity_icons(a, b):
    return ("Game item icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with "
            "generous spacing, same scale and lighting, front 3/4 view, bold pixel outlines. Row 1 shows " + RARITY +
            " — item type: " + a + ". Row 2 shows the same 4 rarity versions — item type: " + b + ".")


seg("15. [Đợt 4] Trang bị theo độ hiếm & Gacha",
    "G60–G64: trang bị mua ở quầy Thời trang (Thường/Tốt) hoặc quay gacha hên xui ra Hiếm/Giới hạn. "
    "Mỗi ô trang bị có 4 mẫu theo độ hiếm.",
    [("Áo & Quần (4 cấp hiếm)", "icons_gear_shirt_pants.png", rarity_icons("a shirt / t-shirt", "trousers / jeans"),
      STYLE),
     ("Giày & Nón (4 cấp hiếm)", "icons_gear_shoes_hat.png", rarity_icons("shoes / sneakers", "a cap / hat"), STYLE),
     ("Kính & Đồng hồ (4 cấp hiếm)", "icons_gear_glasses_watch.png", rarity_icons("sunglasses / glasses",
                                                                                   "a wristwatch"), STYLE),
     ("Balo (4 cấp hiếm) & vật phẩm gacha", "icons_gear_bag_gacha.png",
      "Game item icon set: a grid of 4 columns x 2 rows, each icon centered in its own equal square cell with generous "
      "spacing, same scale and lighting, front 3/4 view, bold pixel outlines. Row 1 shows " + RARITY +
      " — item type: a backpack. Row 2: (1) a closed plastic gacha capsule half red half white, (2) a gacha token "
      "coin, (3) a pile of glittering fragments (from recycling duplicates), (4) a golden lucky ticket.", STYLE),
     ("Máy gacha", "prop_gacha.png",
      "Single game asset: a cute capsule toy gacha machine as tall as an adult, glass dome full of colorful capsules, "
      "a big turning crank, a coin slot and a capsule exit flap, decorated with lights, 3/4 top-down front view.",
      STYLE),
     ("Hoạt ảnh mở gacha", "ui_gacha_open.png",
      "Sprite sheet: one single horizontal row of EXACTLY 6 frames of a gacha capsule opening, evenly spaced, same "
      "size: (1) closed capsule, (2) capsule shaking left, (3) capsule shaking right, (4) capsule cracking open with "
      "light leaking out, (5) capsule halves flying apart with a bright burst, (6) empty glowing light burst.",
      STYLE_UI),
     ("Nền lộ diện theo độ hiếm", "ui_gacha_reveal.png",
      "Four square reveal background cards in a row with wide gaps, same size, radiating light rays and sparkles: "
      "(1) grey for common, (2) green for good, (3) blue for rare, (4) gold with extra sparkles for limited. Empty "
      "center for an item icon.", STYLE_UI)])

seg("16. [Đợt 4] Chợ Sạp Hàng Hóa",
    "G24, G55–G57: người chơi thuê sạp, bày bán, đặt giá; xem & mua hàng của người khác.",
    [("Tòa Chợ Sạp Hàng Hóa", "bld_market.png", BUILDING.format(
        what="a covered Saigon community market hall", ratio="2:1",
        detail="a tall corrugated roof on steel columns, an arched entrance, rows of colorful stalls visible inside, "
               "hanging lanterns"), STYLE),
     ("Bên trong chợ", "room_market.png",
      "Interior of a covered Vietnamese market hall seen in 3/4 top-down view: concrete floor, three long rows of "
      "EMPTY wooden stall tables with numbered-style blank plaques (no text), wide walking aisles between them, "
      "hanging bulbs from the roof beams, an entrance at the bottom center.",
      STYLE_ROOM.replace("EMPTY room: no furniture, no people", "No people, no goods on the tables").replace(
          "The floor shows a clear even grid of square tiles or planks so furniture can be placed on it. ", "")),
     ("Sạp của người chơi (3 cỡ)", "market_stalls.png",
      "Game asset set: 3 market stall tables in one row with wide gaps, same scale, 3/4 top-down front view, EMPTY "
      "of goods, each with a blank wooden name plaque: (1) a small single folding table with a cloth, (2) a medium "
      "wooden stall with a striped awning, (3) a large glass display stall with shelves and lights.", STYLE),
     ("Giao diện chợ", "ui_market.png",
      "Four separate UI elements with wide gaps: (1) an empty product listing card with an image area on top and two "
      "blank lines below, (2) an empty paper price tag with a string, (3) a red rubber stamp mark shaped like a "
      "circle with a check, (4) an empty search bar with a magnifying glass icon.", STYLE_UI)])

seg("17. [Đợt 4] Công trình lấp phố",
    "Thay ảnh tạm vẽ bằng code. Nhà ống số 1 dùng làm Nhà học sinh cho nghề Gia sư (J8).",
    [("Vựa ve chai", "bld_vechai.png", BUILDING.format(
        what="a scrap metal and recycling yard shed", ratio="2.5:1",
        detail="corrugated rusty tin walls, piles of cans, bottles, cardboard and old fans"), STYLE)]
    + [(f"Nhà ống {i} ({c})", f"tube_{i}.png",
        "Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, " + c + " walls, "
        "small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a "
        "half-open rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to "
        "height ratio 1:3.", STYLE)
       for i, c in enumerate(["mustard yellow", "salmon pink", "mint green", "sky blue", "cream white", "lavender",
                              "terracotta orange", "pale lime"], 1)])

# ---------------------------------------------------------------- hoan lai (sau V2)
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
    ("bld_bank", "a modern bank branch building", "1.1:1", "5 storeys of blue glass, marble ground floor, gold accents"),
    ("bld_office", "a corporate office tower", "1.2:1", "tall dark glass tower, top cropped, modern glass lobby"),
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
