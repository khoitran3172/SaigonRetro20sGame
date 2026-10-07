"""
Nhap art moi tu thu muc asset_new_by_khoit/ (nen magenta, dai 6 frame).

Nhan dien file theo ten: chua ma nhan vat + ma hanh dong, vd
  sv_male/walk_down.png, sv_male__walk_down.png, art_srccharssv_malewalk_down.png
Sheet gop nhieu dai (vd sv_female.jpg) khai bao trong SHEETS.

Xu ly: tach nen theo mau vien + do "ung magenta", xoa duong ke ngang dai,
bo dom nho (watermark), tach tung frame, chuan hoa chieu cao, lat de frame
nhin ngang luon quay TRAI.
"""
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")
import re

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Thu muc art moi (khong phan biet hoa thuong: asset_new_by_Khoit / asset_new_by_khoit)
SRC = next((os.path.join(ROOT, d) for d in os.listdir(ROOT) if d.lower() == "asset_new_by_khoit"),
           os.path.join(ROOT, "asset_new_by_khoit"))
OUT = os.path.join(ROOT, "tools", "out", "new")

STAND_H = 86     # chieu cao nhan vat dung trong game (px)
RIDE_RATIO = 0.74  # tu the ngoi lai so voi dung

SKINS = ["sv_male", "sv_female", "vp_male", "vp_female", "tt_male", "tt_female"]
ACTIONS = ["idle_up_left", "idle_down", "walk_down", "walk_up", "walk_left", "ride_left"]

# Huong nhin thuc te neu khac quy chuan (mac dinh: walk_left/ride_left quay trai,
# idle_up_left: frame 4-6 quay trai). "right" -> pipeline lat lai.
FACING = {
    ("sv_male", "walk_left"): "right",
    ("sv_male", "idle_up_left"): "right",
    ("sv_female", "walk_left"): "right",
    ("sv_female", "idle_up_left"): "right",
    ("sv_female", "ride_left"): "right",
}

# Sheet do vat / cong trinh (xu ly trong new_manifest.py)
NOT_CHARACTERS = {"Congtrinh.jpg", "Img_Login.jpg", "NPC.jpg", "VEHICLE.png", "item.png", "props.jpg"}
# Anh UI / cong trinh / mini-game don le (xu ly trong ui_manifest.py)
NOT_CHARACTER_PREFIX = ("ui_", "job_", "building_", "prop_", "bld_", "icons_", "furn_", "room_",
                        "tube_", "veh_", "npc_mall_", "banner_", "bus_stop", "taxi_stand", "market_")

# Sheet gop: file -> danh sach (skin, action, hang, cot_bat_dau)
SHEETS = {
    "sv_female.jpg": [
        ("sv_female", "idle_down", 0, 0),
        ("sv_female", "walk_up", 1, 0),
        ("sv_female", "walk_left", 1, 6),
        ("sv_female", "idle_up_left", 2, 0),
        ("sv_female", "ride_left", 2, 6),
    ],
}


def key_background(rgb):
    """True = nen. Ket hop: gan mau vien anh + pixel ung magenta (R,B >> G)."""
    h, w, _ = rgb.shape
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]).astype(int)
    bg = np.median(border, axis=0)
    px = rgb.astype(int)
    near = np.sqrt(((px - bg) ** 2).sum(-1)) < 60
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    magenta = (r - g > 55) & (b - g > 40)
    return near | magenta


def frames_in(path, dilate=3, min_ratio=0.15, erode=2):
    """Tach cac frame (theo hang, trai->phai). Tra ve list hang, moi hang list (bbox, rgba)."""
    rgb = np.array(Image.open(path).convert("RGB"))
    H, W, _ = rgb.shape
    fg = ~key_background(rgb)
    fg = ndimage.binary_opening(fg, iterations=1)
    # xoa duong ke ngang dai (duong nen ma AI hay ve)
    lab, n = ndimage.label(fg)
    for i, sl in enumerate(ndimage.find_objects(lab)):
        if sl and (sl[1].stop - sl[1].start) > W * 0.3 and (sl[0].stop - sl[0].start) < 10:
            fg[lab == i + 1] = False
    # got 2px vien (anh goc lon gap ~5 lan trong game) + khu am magenta con sot
    fg = ndimage.binary_erosion(fg, iterations=erode) if erode else fg
    px = rgb.astype(int)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    spill = fg & (r - g > 25) & (b - g > 15)
    lo = np.minimum(r, b)
    rgb = rgb.copy()
    rgb[..., 0] = np.where(spill, g + (r - g) * 0.35, r)
    rgb[..., 2] = np.where(spill, g + (lo - g) * 0.35, b)
    grown = ndimage.binary_dilation(fg, iterations=dilate)
    lab, n = ndimage.label(grown)
    objs = ndimage.find_objects(lab)
    sizes = ndimage.sum(fg, lab, range(1, n + 1))
    keep = [i for i in range(n) if sizes[i] > sizes.max() * min_ratio]
    blobs = []
    for i in keep:
        sl = objs[i]
        m = (lab[sl] == i + 1) & fg[sl]
        rgba = np.dstack([rgb[sl], (m * 255).astype(np.uint8)])
        blobs.append({"x": sl[1].start, "y": sl[0].start, "w": sl[1].stop - sl[1].start,
                      "h": sl[0].stop - sl[0].start, "img": Image.fromarray(rgba, "RGBA")})
    # nhom theo hang bang tam doc
    blobs.sort(key=lambda b: b["y"] + b["h"] / 2)
    rows = []
    for b in blobs:
        cy = b["y"] + b["h"] / 2
        if rows and abs(rows[-1]["cy"] - cy) < H * 0.08:
            rows[-1]["items"].append(b)
        else:
            rows.append({"cy": cy, "items": [b]})
    return [sorted(r["items"], key=lambda b: b["x"]) for r in rows]


def normalize(frames, action, skin):
    """Scale ca dai theo chieu cao trung vi (giu nhip nhun), lat ve huong trai."""
    med_h = float(np.median([f["h"] for f in frames]))
    target = STAND_H * (RIDE_RATIO if action == "ride_left" else 1)
    s = target / med_h
    out = []
    flip = FACING.get((skin, action)) == "right"
    for i, f in enumerate(frames):
        im = f["img"].resize((max(1, round(f["w"] * s)), max(1, round(f["h"] * s))), Image.LANCZOS)
        side_frame = action in ("walk_left", "ride_left") or (action == "idle_up_left" and i >= 3)
        if flip and side_frame:
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        out.append(im)
    return out


def parse_name(fname):
    base = fname.lower()
    skin = next((s for s in sorted(SKINS, key=len, reverse=True) if s in base), None)
    action = next((a for a in ACTIONS if a in base), None)
    return skin, action


def collect():
    """-> {skin: {action: [PIL frames]}} va danh sach canh bao."""
    strips, warn = {}, []
    if not os.path.isdir(SRC):
        return strips, warn
    for dirpath, _, files in os.walk(SRC):
        for fname in sorted(files):
            if not fname.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                continue
            path = os.path.join(dirpath, fname)
            rel = os.path.relpath(path, SRC).replace("\\", "/")
            if fname in NOT_CHARACTERS or fname.lower().startswith(NOT_CHARACTER_PREFIX):
                continue
            if fname in SHEETS:
                rows = frames_in(path)
                for skin, action, r, c in SHEETS[fname]:
                    fr = rows[r][c:c + 6] if r < len(rows) else []
                    if len(fr) != 6:
                        warn.append(f"{rel}: {skin}/{action} chỉ có {len(fr)} frame")
                        continue
                    strips.setdefault(skin, {})[action] = normalize(fr, action, skin)
                continue
            skin, action = parse_name(rel)
            if not skin or not action:
                warn.append(f"{rel}: không nhận ra tên nhân vật/hành động — bỏ qua")
                continue
            rows = frames_in(path)
            fr = [b for row in rows for b in row]
            if len(fr) != 6:
                warn.append(f"{rel}: tìm thấy {len(fr)} frame (cần 6) — bỏ qua")
                continue
            strips.setdefault(skin, {})[action] = normalize(fr, action, skin)
    return strips, warn


# Anh xa dai art -> anim trong game
def to_game_anims(acts):
    """Tra ve (danh sach frame, {anim: [index]}) hoac None neu thieu dai bat buoc."""
    need = ["idle_down", "walk_up", "walk_left"]
    if any(a not in acts for a in need):
        return None
    frames, anims = [], {}

    def add(name, imgs):
        start = len(frames)
        frames.extend(imgs)
        anims[name] = list(range(start, len(frames)))

    add("idle", acts["idle_down"])
    add("side", acts["walk_left"])
    add("up", acts["walk_up"])
    # thieu walk_down: tam dung idle (nhan vat se "truot") — can bo sung art
    add("down", acts.get("walk_down", acts["idle_down"]))
    if "idle_up_left" in acts:
        add("idle_up", acts["idle_up_left"][:3])
        add("idle_side", acts["idle_up_left"][3:])
    if "ride_left" in acts:
        add("ride", acts["ride_left"])
    return frames, anims


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    strips, warn = collect()
    for w in warn:
        print("CẢNH BÁO:", w)
    for skin, acts in strips.items():
        print(skin, {a: len(f) for a, f in acts.items()})
        rows = [Image.new("RGBA", (sum(f.width + 6 for f in fr), max(f.height for f in fr) + 4), (90, 90, 90, 255)) for fr in acts.values()]
        for row, fr in zip(rows, acts.values()):
            x = 2
            for f in fr:
                row.alpha_composite(f, (x, row.height - f.height - 2))
                x += f.width + 6
        sheet = Image.new("RGBA", (max(r.width for r in rows), sum(r.height for r in rows)), (90, 90, 90, 255))
        y = 0
        for r in rows:
            sheet.alpha_composite(r, (0, y))
            y += r.height
        sheet.save(os.path.join(OUT, f"_preview_{skin}.png"))
