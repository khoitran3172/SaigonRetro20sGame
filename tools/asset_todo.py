"""
Sinh docs/ASSET_TODO.md: danh sach asset con thieu, MOI asset kem prompt day du (copy dan duoc ngay).

  python tools/asset_todo.py

Cap nhat danh sach: sua cac bang TODO_* ben duoi (xoa muc da co art, them muc moi) roi chay lai.
"""
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STYLE = (
    "STYLE: detailed 16-bit pixel art game asset, Saigon Vietnam street life, retro late-1990s mood, "
    "warm muted palette (ochre, faded teal, rust red, olive green, cream), dark brown pixel outlines, "
    "soft light from top-left, 3/4 top-down front-facing view (camera about 30 degrees above). "
    "Plain solid magenta background #FF00FF. No text, no letters, no numbers, no labels, no watermark, "
    "no signature, no drop shadow, no floor, no ground. Objects must not overlap or touch."
)

STRIP = (
    "Sprite sheet: a single horizontal row of exactly 6 animation frames, evenly spaced, showing the SAME "
    "character in every frame with identical size, proportions, clothing and colors, feet aligned on the "
    "same horizontal baseline. Animation: {action}. Character: {desc}."
)

ACTIONS = {
    "idle_down": "idle standing loop, facing the viewer, subtle breathing, one frame blinking",
    "walk_down": "walking cycle toward the viewer (facing down/front)",
    "walk_up": "walking cycle away from the viewer, seen from behind (back of head and back visible)",
    "walk_left": "walking cycle in side profile, facing and moving to the LEFT",
    "idle_up_left": "frames 1-3 standing idle seen from behind, frames 4-6 standing idle in side profile facing left",
    "ride_left": ("seated riding pose as if on a motorbike seat, side profile facing left, both arms reaching "
                  "forward holding invisible handlebars, legs bent, NO motorbike drawn, slight bobbing"),
    "run_left": "fast running cycle in side profile facing left, panicking",
}

# ---------------------------------------------------------------- P0
PLAYER = {
    "sv_female": ("Sinh viên nữ", ["walk_down"],
                  "Vietnamese female university student around 20, long straight black hair in a low ponytail, "
                  "white short-sleeve blouse, light denim skirt to the knee, small beige backpack, white sandals"),
    "vp_male": ("NV văn phòng nam", list(ACTIONS)[:6],
                "Vietnamese office worker man around 30, neat side-parted black hair, light-blue long-sleeve dress "
                "shirt with a pen in the chest pocket, dark navy trousers, black belt, brown leather shoes, holding "
                "a brown leather briefcase in his right hand"),
    "vp_female": ("NV văn phòng nữ", list(ACTIONS)[:6],
                  "Vietnamese office woman around 28, shoulder-length black bob, modern short ao dai cach tan tunic "
                  "in grey-beige small pattern, black straight trousers, low brown heels, small brown leather "
                  "handbag on her forearm"),
    "tt_female": ("Tiểu thương nữ", list(ACTIONS)[:6],
                  "Vietnamese street vendor woman in her 40s, conical non la palm-leaf hat, brown ao ba ba blouse "
                  "with buttons, loose black silk trousers, rubber sandals, carrying a woven rattan basket"),
    "tt_male": ("Tiểu thương nam", list(ACTIONS)[:6],
                "Vietnamese street vendor man in his 40s, short hair, faded white undershirt under an open "
                "short-sleeve checkered shirt, khaki shorts, small towel over the shoulder, rubber flip-flops, "
                "sun-tanned skin"),
}

WALKERS_P0 = {
    "police": ("Cảnh sát tuần tra", ["idle_down", "walk_down", "walk_up", "walk_left"],
               "Vietnamese police patrol officer, olive-green uniform shirt with red collar tabs and shoulder "
               "boards, olive peaked cap with a round badge, dark green trousers, black shoes, black belt with a "
               "baton, serious calm expression"),
    "thief": ("Ăn trộm", ["idle_down", "walk_down", "walk_up", "walk_left", "run_left"],
              "skinny sneaky young man, black hoodie with hood up over a dark baseball cap, grey cloth face mask, "
              "dark track pants, worn sneakers, hunched shoulders, shifty eyes, sneaky tiptoe posture"),
    "gangster": ("Giang hồ", ["idle_down", "walk_down", "walk_up", "walk_left"],
                 "tough Vietnamese gangster man around 35, buzz-cut hair, dark sunglasses, open red floral "
                 "short-sleeve shirt over a white tank top, thick gold chain, dragon tattoos on both forearms, "
                 "black trousers, leather sandals, swaggering"),
}

BUILDING = (
    "Game asset: front elevation facade of {what}, Vietnamese urban architecture, seen straight from the front "
    "with a slight top-down tilt, standing on a flat ground line along the bottom edge (no sidewalk, no street "
    "in front). The main entrance door is at the bottom center, door height about 1.3 times an adult's height. "
    "Above the entrance there is a large EMPTY blank signboard with NO text on it. Width to height ratio {ratio}. "
    "{detail}."
)
BUILDINGS_P0 = [
    ("bld_bank", "Ngân hàng VietBank", "a modern bank branch building", "1.1:1",
     "5 storeys of blue glass curtain wall, marble ground floor, gold accents, glass sliding doors"),
    ("bld_office", "Cao ốc TechCorp", "a corporate office tower", "1.2:1",
     "tall dark glass tower with the top part cropped, modern lobby with glass doors, turnstiles visible"),
    ("bld_auction", "Nhà đấu giá", "a grand auction house", "1:1",
     "neoclassical columns, red carpet steps, brass lamps, arched windows"),
    ("bld_showroom", "Showroom xe máy", "a motorbike showroom", "1.6:1",
     "large glass windows with scooters displayed inside, bright lights"),
    ("bld_fashion", "Shop thời trang", "a fashion boutique", "1.2:1",
     "display windows with mannequins wearing ao dai and shirts, pink trim"),
    ("bld_vechai", "Vựa ve chai", "a scrap metal and recycling yard shed", "2.5:1",
     "corrugated rusty tin walls, piles of cans, bottles, cardboard and old fans"),
]
TUBE = (
    "Game asset: front elevation of a narrow Vietnamese tube house (nha ong), 3 to 4 storeys, {color} walls, "
    "small balconies with potted plants and laundry, an air conditioner unit, ground floor shop with a half-open "
    "rolling metal shutter and an EMPTY blank signboard, standing on a flat ground line, width to height ratio 1:3."
)
TUBE_COLORS = ["mustard yellow", "salmon pink", "mint green", "sky blue", "cream white", "lavender",
               "terracotta orange", "pale lime"]

WORK = (
    "Sprite sheet: a single horizontal row of exactly 6 animation frames, evenly spaced, same character in every "
    "frame with identical size, feet on the same baseline, facing the viewer in 3/4 front view. Looping work "
    "animation: {work}. Character: {desc}. Draw ONLY the person, no furniture, no cart."
)
REDO_P0 = [
    ("npc_cafe.png", "Cô chủ cà phê (đang có 2/6 frame)", WORK.format(
        work="sitting on a low stool pouring condensed milk coffee from a phin filter into a glass with ice",
        desc="Vietnamese woman around 45, hair in a bun, apron over a light floral blouse")),
    ("npc_taphoa.png", "Cô Ba tạp hóa (đang có 4/6 frame)", WORK.format(
        work="sitting and fanning herself with a paper hand fan, chatting",
        desc="plump Vietnamese woman around 50, curly short hair, pink-checked blouse, sitting on a low plastic stool")),
    ("veh_bus.png", "Xe buýt (ảnh cũ dính watermark ✦)", (
        "Single game asset: a green Saigon city bus, empty with no driver visible, side profile view with the front "
        "of the vehicle pointing to the RIGHT, slight 3/4 top-down tilt, wheels resting on an invisible flat "
        "baseline, width about 5 times an adult's height. Make sure there is NO watermark or sparkle logo anywhere.")),
]

# ---------------------------------------------------------------- P1
WALKERS_P1 = {
    "postman": ("Bưu tá", ["idle_down", "walk_down", "walk_up", "walk_left"],
                "Vietnamese postman around 40, short hair, blue short-sleeve uniform shirt with a small red-and-white "
                "post logo patch, dark blue trousers, brown leather mail satchel across the body, holding a small tablet"),
    "walker_old": ("Ông cụ đi đường", ["idle_down", "walk_down", "walk_up", "walk_left"],
                   "elderly Vietnamese man with grey hair and moustache, beige short-sleeve shirt, brown trousers, "
                   "walking slowly with a wooden cane"),
    "walker_mom": ("Phụ nữ đi chợ", ["idle_down", "walk_down", "walk_up", "walk_left"],
                   "Vietnamese woman in her 30s, floral blouse, dark trousers, carrying a plastic shopping bag with vegetables"),
    "walker_kid": ("Học sinh tiểu học", ["idle_down", "walk_down", "walk_up", "walk_left"],
                   "Vietnamese schoolboy around 9, white short-sleeve school shirt with red scarf (khan quang do), "
                   "dark blue shorts, small backpack"),
    "traffic_rider_male": ("Người lái xe (nam) cho giao thông", ["ride_left"],
                           "Vietnamese man around 35 wearing a half-face motorbike helmet, cloth face mask, long-sleeve "
                           "jacket, dark trousers, sandals"),
    "traffic_rider_female": ("Người lái xe (nữ) cho giao thông", ["ride_left"],
                             "Vietnamese woman around 30 wearing a pastel helmet, anti-sun hooded jacket, face mask, "
                             "long sun-protection skirt, sandals"),
}
BUILDINGS_P1 = [
    ("bld_barber", "Tiệm cắt tóc", "a tiny barber corner", "1:1",
     "mirror on the wall, barber pole, one vintage barber chair"),
    ("bld_garage", "Tiệm sửa xe", "a motorbike repair shop", "1.4:1",
     "tools on a pegboard, stacked tyres, oil stains, open front"),
]
SHACK = ("Game asset: front elevation of a ramshackle tin-roof shack on the city outskirts, patched corrugated "
         "metal walls, {detail}, standing on a flat ground line, width to height ratio 1.5:1.")
SHACK_DETAILS = ["a plastic tarp awning and an old bicycle leaning on the wall",
                 "a rusty water tank on the roof and laundry hanging outside",
                 "stacked crates and a small potted plant by the door"]
ICON_PKL = ("Single game item icon, centered: a matte black sport motorcycle with orange accents, front 3/4 view, "
            "bold pixel outlines, same style as the other item icons in the set.")

# ---------------------------------------------------------------- P2
P2 = [
    ("room_furniture.png", "Nội thất nhà trọ (ở ghép)",
     "Game asset set: 6 separate furniture pieces for a small Vietnamese rented room, spaced far apart: a single bed "
     "with a mosquito net, a small fridge, a desk with an old desktop PC, a two-burner gas stove on a counter, a "
     "standing electric fan, a plastic wardrobe. Each piece seen in 3/4 top-down view."),
    ("race_props.png", "Đạo cụ đua xe đêm",
     "Game asset set: 4 separate props for an illegal night street race on the city outskirts, spaced far apart: a "
     "checkered start flag on a pole, a stack of traffic cones, a portable floodlight on a tripod, a spray-painted "
     "start line banner held by two poles."),
    ("race_crowd.png", "Khán giả cổ vũ đua xe",
     STRIP.format(action="cheering loop, jumping and waving arms toward the viewer",
                  desc="young Vietnamese man in a black t-shirt and ripped jeans holding a phone up")),
    ("portraits.png", "Chân dung hội thoại",
     "Character portrait set: a grid of 4 columns x 4 rows of bust portraits (head and shoulders), each centered in its "
     "own equal square cell, all the same scale, facing slightly left: the 6 player characters (student man, student "
     "woman, office man, office woman, vendor woman with conical hat, vendor man) and 10 shopkeepers (old banh mi "
     "grandmother, old lottery man, barber, coffee lady, grocery lady, mechanic, scrap collector, auctioneer, security "
     "guard, internet cafe owner)."),
]


def block(title, file, prompt):
    return f"#### {title} — `{file}`\n```\n{prompt}\n\n{STYLE}\n```\n"


def strips(group, items):
    out = []
    for key, (name, actions, desc) in items.items():
        out.append(f"### {name} (`{key}`) — {len(actions)} ảnh\n")
        for a in actions:
            out.append(block(a, f"{key}_{a}.png", STRIP.format(action=ACTIONS[a], desc=desc)))
    return out


def main():
    md = ["# Asset còn thiếu — kèm prompt\n",
          "> File tự sinh bởi `python tools/asset_todo.py`. Mỗi khối là **một ảnh**: copy nguyên khối dán vào công cụ "
          "tạo ảnh. Nên đính kèm `NPC.png` (hoặc dải đầu tiên của chính nhân vật đó) làm ảnh tham chiếu phong cách. "
          "Lưu ảnh đúng tên file ghi trong tiêu đề mỗi khối (vd. `vp_male_walk_down.png`) rồi bỏ vào `asset_new_by_Khoit/`.\n",
          "> Nếu AI vẽ nhân vật quay **phải** thay vì trái thì cứ giữ, báo lại tên file để pipeline tự lật.\n"]

    md.append("\n## P0 — Thay phần đang tạm bợ\n")
    md.append("\n### Nhân vật người chơi\n")
    md += strips("p0", PLAYER)
    md.append("\n### NPC di chuyển\n")
    md += strips("p0", WALKERS_P0)
    md.append("\n### Công trình\n")
    for key, name, what, ratio, detail in BUILDINGS_P0:
        md.append(block(name, f"{key}.png", BUILDING.format(what=what, ratio=ratio, detail=detail)))
    md.append("\n### Nhà ống lấp khoảng trống (8 ảnh)\n")
    for i, c in enumerate(TUBE_COLORS, 1):
        md.append(block(f"Nhà ống {i} ({c})", f"tube_{i}.png", TUBE.format(color=c)))
    md.append("\n### Làm lại (ảnh đã gửi bị lỗi)\n")
    for file, name, prompt in REDO_P0:
        md.append(block(name, file, prompt))

    md.append("\n## P1 — Làm phố sống động hơn\n")
    md += strips("p1", WALKERS_P1)
    md.append("\n### Công trình phụ\n")
    for key, name, what, ratio, detail in BUILDINGS_P1:
        md.append(block(name, f"{key}.png", BUILDING.format(what=what, ratio=ratio, detail=detail)))
    for i, d in enumerate(SHACK_DETAILS, 1):
        md.append(block(f"Lều ngoại ô {i}", f"shack_{i}.png", SHACK.format(detail=d)))
    md.append("\n### Icon\n")
    md.append(block("Icon xe phân khối lớn", "icon_xe_pkl.png", ICON_PKL))

    md.append("\n## P2 — Cho tính năng sắp làm (chưa cần ngay)\n")
    for file, name, prompt in P2:
        md.append(block(name, file, prompt))

    n = sum(m.count("```\n") // 2 for m in md)
    md.insert(3, f"\n**Tổng: {n} ảnh.**\n")
    path = os.path.join(ROOT, "docs", "ASSET_TODO.md")
    with open(path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(md))
    print("Đã ghi", path, "—", n, "ảnh")


if __name__ == "__main__":
    main()
