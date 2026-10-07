"""
Anh xa blob trong cac sheet moi (asset_new_by_khoit/) -> asset trong game.
Ma blob "hang.cot" xem trong tools/out/new/_contact_*.png (python tools/contact_new.py).
"""
import json
import os
import shutil

from PIL import Image

from import_new_art import SRC, frames_in

STAND = 86  # chieu cao nguoi dung trong game

# file: (dilate, min_ratio) — giong contact_new.py
PARAMS = {
    "Congtrinh.jpg": (4, 0.05, 2), "NPC.jpg": (3, 0.2, 2), "VEHICLE.png": (6, 0.02, 1),
    "item.png": (10, 0.01, 1), "props.jpg": (3, 0.003, 1),
}

# ---- Cong trinh: cung ty le 1.25 (sheet ve cung luc nen ty le dong nhat)
BUILDINGS = {
    "b_school": ["0.0"], "b_tro": ["0.1"], "b_net": ["0.2"], "b_cafe": ["1.0"],
    "b_bangdia": ["1.1"], "b_buudien": ["2.0"], "b_bida": ["3.0"], "b_taphoa": ["3.1"],
}
BUILDING_SCALE = 1.25

# ---- Xe: nhin ngang, dau xe quay PHAI. (blob, chieu rong trong game)
VEHICLES = {
    "veh_cub": ("0.0", 126), "veh_ga": ("0.1", 136), "veh_pkl": ("1.0", 160), "veh_dap": ("2.0", 112),
    "veh_grab": ("2.1", 136), "veh_taxi": ("3.0", 200), "veh_taxi2": ("2.2", 196)
}

# ---- Props: (danh sach blob ghep chung, "w"/"h", kich thuoc trong game)
PROPS = {
    "stall_lv1": (["0.0"], "w", 120), "stall_lv2": (["0.1"], "w", 120), "stall_lv3": (["0.2"], "h", 140),
    "cart_banhmi_v2": (["0.3"], "h", 96), "cart_veso_v2": (["0.4"], "h", 100), "cart_mia": (["0.5"], "h", 86),
    "ganh_hang_v2": (["1.0"], "w", 110),
    "stool_blue_v2": (["1.1"], "h", 30), "stool_red_v2": (["1.2"], "h", 30), "stool_purple": (["1.3"], "h", 30),
    "stool_pink_v2": (["2.0"], "h", 30), "stool_green": (["2.1"], "h", 30),
    "tree_me": (["2.2"], "h", 230), "tree_bang": (["3.1"], "h", 210),
    "atm_v2": (["3.0"], "h", 108), "power_pole_v2": (["3.2"], "h", 270), "street_lamp": (["3.3"], "h", 230),
    "plant_pots": (["3.4"], "h", 92),
    "table_tra_da": (["4.0"], "w", 110), "table_co_tuong": (["4.1"], "w", 64), "tires_v2": (["4.2"], "h", 60),
    "trash_bin": (["5.0"], "h", 56), "bench": (["5.1"], "w", 92), "goal_mini": (["5.2"], "h", 78),
    "barber_set_v2": (["5.3", "5.4", "5.5"], "h", 100), "sign_stand": (["5.6"], "h", 62),
    "junk_pile": (["6.0"], "w", 92), "scrap_pickup": (["6.1"], "w", 38), "manhole": (["6.2"], "w", 76),
}

# ---- NPC lam viec. scale: "stand" = chuan hoa cao 86; con lai dung ty le chung cua sheet
NPC_SCALE = STAND / 131.0  # chieu cao trung vi cua NPC dung trong NPC.jpg
NPCS = {
    "npc_banhmi": ("0", 0, 6, "sheet"), "npc_veso": ("0", 6, 6, "sheet"),
    "npc_barber": ("1", 0, 6, "sheet"), "npc_cafe": ("1", 6, 2, "sheet"), "npc_taphoa": ("1", 8, 4, "sheet"),
    "npc_mechanic": ("2", 0, 6, "sheet"), "npc_vechai": ("2", 6, 6, "sheet"),
    "npc_auction": ("3", 0, 6, "stand"),
    "npc_guard": ("4", 0, 6, "sheet"), "npc_netco": ("4", 6, 6, "sheet"),
}

# ---- Icon (48px). Blob ghep: khuyen tai 2 mau.
ICONS = {
    "banhmi": "0.0", "tra_da": "0.1", "ca_phe": "0.2", "nuoc_mia": "0.3", "phoi_banh": "0.4", "thit_nguoi": "0.5",
    "rau_thom": "0.6", "tra_kho": "0.7", "da_vien": "0.8", "cay_mia": "0.9", "pho": "0.10", "ve_so": "0.11",
    "ve_chai": "1.0", "linh_kien": "1.1", "bang_cassette": "1.2", "the_4g": "1.3", "du_che": "1.4", "thu": "1.5",
    "buu_pham": "1.6", "xu": "1.7", "kim_cuong": "1.8", "huy_hieu": "1.9", "bua_dau_gia": "1.10", "chia_khoa": "1.11",
    "ao_thun": "2.0", "ao_somi": "2.1", "quan_jean": "2.2", "dep_lao": "2.3", "giay_tt": "2.4", "non_la": "2.5",
    "non_bh": "2.6", "kinh_ram": "2.7", "khuyen_tai": ["2.8", "2.9"], "dong_ho": "2.10", "balo": "2.11", "hao_quang": "2.12",
    "xe_cub": "3.0", "xe_ga": "3.1", "dien_thoai": "3.2", "bien_so_dep": "3.3", "meo_quy": "3.4", "ao_limited": "3.5",
    "ao_dai_do": "3.6", "tui_xach": "3.7", "non_ket": "3.8", "day_chuyen": "3.9", "dep_quai": "3.10", "xe_dap": "3.11",
    "ui_cash": "4.0", "ui_bank": "4.1", "ui_diamond": "4.2", "ui_social": "4.3", "ui_4g": "4.4", "ui_phone": "4.5",
    "ui_led": "4.6", "ui_pin": "4.7",
}
ICON_SIZE = 48


def _blobs(fname):
    d, mr, er = PARAMS[fname]
    rows = frames_in(os.path.join(SRC, fname), dilate=d, min_ratio=mr, erode=er)
    return {f"{r}.{c}": b for r, row in enumerate(rows) for c, b in enumerate(row)}, rows


def _merge(blobs, ids):
    """Ghep nhieu blob theo dung vi tri goc."""
    bs = [blobs[i] for i in ids]
    x0, y0 = min(b["x"] for b in bs), min(b["y"] for b in bs)
    x1, y1 = max(b["x"] + b["w"] for b in bs), max(b["y"] + b["h"] for b in bs)
    im = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
    for b in bs:
        im.alpha_composite(b["img"], (b["x"] - x0, b["y"] - y0))
    return im


def _resize(im, s):
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)


def build(dst, pack_anchor_bottom):
    """Xuat asset moi vao client/assets. Tra ve (props_meta, anim_meta, icons)."""
    props, anims, icons = {}, {}, []
    os.makedirs(os.path.join(dst, "icons"), exist_ok=True)
    os.makedirs(os.path.join(dst, "ui"), exist_ok=True)

    def save_prop(key, im):
        im.save(os.path.join(dst, "props", f"{key}.png"), optimize=True)
        props[key] = [im.width, im.height]

    blobs, _ = _blobs("Congtrinh.jpg")
    for key, ids in BUILDINGS.items():
        save_prop(key, _resize(_merge(blobs, ids), BUILDING_SCALE))

    blobs, _ = _blobs("VEHICLE.png")
    for key, (bid, w) in VEHICLES.items():
        im = blobs[bid]["img"]
        save_prop(key, _resize(im, w / im.width))

    blobs, _ = _blobs("props.jpg")
    for key, (ids, dim, size) in PROPS.items():
        im = _merge(blobs, ids)
        save_prop(key, _resize(im, size / (im.width if dim == "w" else im.height)))

    _, rows = _blobs("NPC.jpg")
    for key, (r, start, n, mode) in NPCS.items():
        fr = rows[int(r)][start:start + n]
        if mode == "stand":
            import numpy as np
            s = STAND / float(np.median([b["h"] for b in fr]))
        else:
            s = NPC_SCALE
        sheet, cw, ch = pack_anchor_bottom([_resize(b["img"], s) for b in fr])
        sheet.save(os.path.join(dst, "anim", f"{key}.png"), optimize=True)
        anims[key] = {"frameWidth": cw, "frameHeight": ch, "frames": len(fr)}

    blobs, _ = _blobs("item.png")
    for key, ids in ICONS.items():
        im = _merge(blobs, ids if isinstance(ids, list) else [ids])
        im = _resize(im, ICON_SIZE / max(im.width, im.height))
        canvas = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), (0, 0, 0, 0))
        canvas.alpha_composite(im, ((ICON_SIZE - im.width) // 2, (ICON_SIZE - im.height) // 2))
        canvas.save(os.path.join(dst, "icons", f"{key}.png"), optimize=True)
        icons.append(key)

    shutil.copyfile(os.path.join(SRC, "Img_Login.jpg"), os.path.join(dst, "ui", "login.jpg"))
    with open(os.path.join(dst, "icons.json"), "w") as fp:
        json.dump(icons, fp)
    return props, anims
