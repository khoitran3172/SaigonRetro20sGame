"""
Dong goi asset cho game tu cac blob da tach (tools/out) + concept sheet goc.

  python tools/extract_sprites.py   (chay truoc)
  python tools/build_assets.py

Xuat ra client/assets/:
  chars/<key>.png + chars.json     spritesheet nhan vat (o deu nhau, neo chan o giua-duoi)
  props/<name>.png                 vat the / cong trinh / NPC tinh
  anim/<name>.png + anim.json      NPC co animation idle (tho sua xe, tho cat toc)
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

import numpy as np
from PIL import Image
from scipy import ndimage

import import_new_art
import new_manifest
import ui_manifest
from extract_sprites import ROOT, SHEETS, background_mask

OUT = os.path.join(ROOT, "tools", "out")
DST = os.path.join(ROOT, "client", "assets")

CHAR_SCALE = 0.6      # nhan vat tu sheet 1024px  (cao ~130px -> ~78px)
BIG_SCALE = 0.16      # NPC / vat the tu sheet 2752px (nguoi cao ~490px -> ~78px)
BUILDING_SCALE = 0.21  # mat tien cong trinh

# ---- Nhan vat nguoi choi: frame index trong tools/out/<sheet>/ ----
# "side" = frame quay sang TRAI; client lat ngang khi di sang phai.
CHARACTERS = {
    "sv_male":      {"idle": [0, 1, 2, 3, 4, 5], "side": [6, 7, 8, 9, 10, 11],
                     "up": [31, 32, 33], "down": [34, 35, 36, 37, 38]},
    "vp_male":      {"idle": [0, 1, 2, 3, 4], "side": [5, 6, 7, 8, 9, 10],
                     "up": [29, 30], "down": [31, 32, 33, 34]},
    "baba_female":  {"idle": [0, 1, 2, 3], "side": [10, 11, 12, 13, 14],
                     "up": [15, 16, 17, 18, 19], "down": [20, 21, 26, 27]},
    "aodai_female": {"idle": [0, 6], "side": [1, 2, 3, 4, 5],
                     "up": [7, 8, 9, 10, 11], "down": [12, 13, 14, 15]},
}

# ---- Props: (sheet, blob id) hoac (sheet, (x0,y0,x1,y1) toa do anh goc), scale ----
PROPS = {
    # cong trinh
    "bld_buudien": ("buudien", 0, BUILDING_SCALE),
    "bld_bida": ("bida", 0, BUILDING_SCALE),
    # quan hang
    "cart_banhmi": ("npc", 0, BIG_SCALE),
    "cart_veso": ("npc", 13, BIG_SCALE),
    "cart_hoaquynh": ("banhmi", 5, 0.12),
    "ganh_hang": ("banhmi", 4, 0.12),
    "barber_set": ("npc", 15, BIG_SCALE),
    "sign_buudien": ("npc", 12, BIG_SCALE),
    "stools_family": ("npc", 7, BIG_SCALE),
    "tv": ("npc", 11, BIG_SCALE),
    "cub": ("npc", 10, BIG_SCALE),
    "veh_cub": ("npc", 10, 0.36),   # xe khi nguoi choi ngoi lai (ty le chuan voi nhan vat ~86px)
    "cub_rider": ("npc", 5, BIG_SCALE),
    # NPC tinh
    "npc_bacu": ("npc", 4, BIG_SCALE),
    "npc_onglao": ("npc", 14, BIG_SCALE),
    "npc_thanhnien": ("npc", 6, BIG_SCALE),
    "npc_girl": ("npc", 2, BIG_SCALE),
    "npc_boy": ("npc", 3, BIG_SCALE),
    "npc_mom": ("npc", 8, BIG_SCALE),
    "npc_dad": ("npc", 9, BIG_SCALE),
    "npc_buuta": ("npc", 19, BIG_SCALE),
    "npc_ngoi": ("npc", 17, BIG_SCALE),
    "npc_suaxe": ("npc", 18, BIG_SCALE),
    # vat the le
    "stool_blue": ("vatthe", 14, BIG_SCALE),
    "stool_red": ("vatthe", 15, BIG_SCALE),
    "stool_small": ("vatthe", 16, BIG_SCALE),
    "poster_beer": ("vatthe", 8, BIG_SCALE),
    "poster_tea": ("vatthe", 9, BIG_SCALE),
    "poster_1": ("vatthe", 1, BIG_SCALE),
    "poster_2": ("vatthe", 2, BIG_SCALE),
    "poster_3": ("vatthe", 10, BIG_SCALE),
    "poster_4": ("vatthe", 11, BIG_SCALE),
    "poster_5": ("vatthe", 12, BIG_SCALE),
    "power_pole": ("vatthe", 20, BIG_SCALE * 1.4),
    "roof_tin": ("vatthe", 13, BIG_SCALE),
    "coffee_phin": ("vatthe", 22, BIG_SCALE),
    "glass_tea": ("vatthe", 23, BIG_SCALE),
    "bowl_pho": ("vatthe", 24, BIG_SCALE),
    "flowers": ("vatthe", 25, BIG_SCALE),
    "books": ("vatthe", 17, BIG_SCALE),
    "tex_wall": ("vatthe", 4, 0.5),
    "tex_floor": ("vatthe", 5, 0.5),
    # cat thu cong tu cum dinh nhau (toa do anh goc 2752x1536)
    "plant_tall": ("vatthe", (1032, 454, 1160, 690), BIG_SCALE),
    "tires": ("vatthe", (905, 568, 1056, 752), BIG_SCALE),
    "plants_pair": ("vatthe", (312, 766, 512, 952), BIG_SCALE),
    "stool_pink": ("vatthe", (1140, 540, 1276, 690), BIG_SCALE),
    "sign_buudien_stand": ("vatthe", (466, 590, 662, 882), BIG_SCALE),
}

# NPC co animation: list cac (sheet, blob id), neo giua-duoi
ANIMS = {
    "anim_suaxe": [("npc_idle", i) for i in (9, 12, 14, 17)],
    "anim_catoc": [("npc_idle", i) for i in (19, 22, 26, 28)],
}


def load_blob(sheet, idx):
    return Image.open(os.path.join(OUT, sheet, f"{idx:03d}.png")).convert("RGBA")


_fg_cache = {}


def crop_rect(sheet, rect):
    """Cat vung chu nhat tu anh goc, xoa nen, giu thanh phan lien thong lon nhat."""
    if sheet not in _fg_cache:
        rgb = np.array(Image.open(os.path.join(ROOT, SHEETS[sheet])).convert("RGB"))
        fg = ~background_mask(rgb, 236)
        _fg_cache[sheet] = (rgb, ndimage.binary_opening(fg, iterations=1))
    rgb, fg = _fg_cache[sheet]
    x0, y0, x1, y1 = rect
    sub = fg[y0:y1, x0:x1]
    lab, n = ndimage.label(ndimage.binary_dilation(sub, iterations=3))
    if n > 1:
        sizes = ndimage.sum(sub, lab, range(1, n + 1))
        sub = sub & (lab == (int(np.argmax(sizes)) + 1))
    rgba = np.dstack([rgb[y0:y1, x0:x1], (sub * 255).astype(np.uint8)])
    im = Image.fromarray(rgba, "RGBA")
    return im.crop(im.getbbox())


def erode_alpha(im, px=1):
    """Bo vien trang (halo) cua anh JPG sau khi xoa nen."""
    a = np.array(im)
    mask = ndimage.binary_erosion(a[..., 3] > 0, iterations=px)
    a[..., 3] = np.where(mask, a[..., 3], 0)
    return Image.fromarray(a, "RGBA")


def scaled(im, s):
    w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
    return im.resize((w, h), Image.LANCZOS)


def pack_anchor_bottom(frames, pad=2):
    """Xep cac frame vao luoi o deu, neo giua-duoi. Tra ve (sheet, cell_w, cell_h)."""
    cw = max(f.width for f in frames) + pad * 2
    ch = max(f.height for f in frames) + pad
    sheet = Image.new("RGBA", (cw * len(frames), ch), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        x = i * cw + (cw - f.width) // 2
        y = ch - f.height
        sheet.alpha_composite(f, (x, y))
    return sheet, cw, ch


def main():
    for sub in ("chars", "props", "anim"):
        os.makedirs(os.path.join(DST, sub), exist_ok=True)

    chars_meta = {}
    # Art moi (asset_new_by_khoit/) uu tien hon concept cu
    new_strips, warn = import_new_art.collect()
    for w in warn:
        print("CẢNH BÁO:", w)
    for key, acts in new_strips.items():
        res = import_new_art.to_game_anims(acts)
        if not res:
            print(f"CẢNH BÁO: {key} thiếu dải bắt buộc (idle_down, walk_up, walk_left) — dùng art cũ nếu có")
            continue
        if "walk_down" not in acts:
            print(f"CẢNH BÁO: {key} chưa có walk_down — tạm dùng idle_down")
        frames, anims = res
        sheet, cw, ch = pack_anchor_bottom(frames)
        sheet.save(os.path.join(DST, "chars", f"{key}.png"), optimize=True)
        chars_meta[key] = {"frameWidth": cw, "frameHeight": ch, "anims": anims}

    for key, anims in CHARACTERS.items():
        if key in chars_meta:
            continue
        order, frames = [], []
        for name, ids in anims.items():
            start = len(frames)
            for i in ids:
                frames.append(scaled(erode_alpha(load_blob(key, i)), CHAR_SCALE))
            order.append((name, list(range(start, len(frames)))))
        sheet, cw, ch = pack_anchor_bottom(frames)
        sheet.save(os.path.join(DST, "chars", f"{key}.png"), optimize=True)
        chars_meta[key] = {"frameWidth": cw, "frameHeight": ch, "anims": dict(order)}
    with open(os.path.join(DST, "chars.json"), "w") as fp:
        json.dump(chars_meta, fp, indent=1)

    props_meta = {}
    for name, (sheet, src, s) in PROPS.items():
        im = crop_rect(sheet, src) if isinstance(src, tuple) else load_blob(sheet, src)
        im = scaled(im, s)
        im.save(os.path.join(DST, "props", f"{name}.png"), optimize=True)
        props_meta[name] = [im.width, im.height]

    # Art moi: cong trinh, xe, props, NPC lam viec, icon, anh dang nhap
    new_props, anim_meta = new_manifest.build(DST, pack_anchor_bottom)
    props_meta.update(new_props)
    # UI kit, cong trinh moi, mini-game nghe, icon mon an moi
    ui_props, ui_icons = ui_manifest.build(DST)
    props_meta.update(ui_props)
    icons_path = os.path.join(DST, "icons.json")
    with open(icons_path) as fp:
        icons = json.load(fp)
    with open(icons_path, "w") as fp:
        json.dump(icons + [i for i in ui_icons if i not in icons], fp)
    with open(os.path.join(DST, "props.json"), "w") as fp:
        json.dump(props_meta, fp, indent=1)
    with open(os.path.join(DST, "anim.json"), "w") as fp:
        json.dump(anim_meta, fp, indent=1)

    # anh xem truoc de kiem tra huong frame
    rows = []
    for key in chars_meta:
        rows.append(Image.open(os.path.join(DST, "chars", f"{key}.png")))
    W = max(r.width for r in rows)
    prev = Image.new("RGBA", (W, sum(r.height for r in rows)), (230, 230, 230, 255))
    y = 0
    for r in rows:
        prev.alpha_composite(r, (0, y))
        y += r.height
    prev.save(os.path.join(OUT, "_preview_chars.png"))
    print("chars:", {k: (v["frameWidth"], v["frameHeight"]) for k, v in chars_meta.items()})
    print("props:", len(props_meta), "anims:", list(anim_meta))


if __name__ == "__main__":
    main()
