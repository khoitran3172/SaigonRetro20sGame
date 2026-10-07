"""
Art V2 dot 1-4 nhan 2026-10-07 (68 file don trong asset_new_by_khoit/, anh 1024x572 nen magenta).

Tu tach blob (bo nen magenta + dom nho/watermark), xep tren->duoi, trai->phai roi gan ten.
Blob chong nhau theo truc x duoc gop (vd mui hut khoi + bep, quang den + den) — tru sheet luoi icon.

Xuat vao client/assets:
  props/   dung ngay trong game (nap luc vao): b_vechai, tube_1..8, veh_bus, bus_stop, taxi_stand
  ui/      portrait_*.png (chan dung hoi thoai)
  icons/   icon vat pham moi 48px: mon an, nguyen lieu, do dien tu, trang bi 4 cap hiem, gacha
  v2/      da cat san cho tinh nang CHUA code (noi that, phong, TTTM, cho, gacha, mini-game nghe...)
           kem v2/v2.json = {nhom: {ten: [w, h]}}
"""
import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage

from import_new_art import SRC
from ui_manifest import _keyed, _scale

STAND = 86
ICON_SIZE = 48


def _blobs(fname, dilate=6, min_px=300, merge_x=True, drop_cx=()):
    """-> (anh RGBA da bo nen, list hop (x0,y0,x1,y1) theo thu tu doc)."""
    im = _keyed(fname)
    a = np.array(im)[..., 3] > 0
    lab, n = ndimage.label(ndimage.binary_dilation(a, iterations=dilate))
    sizes = ndimage.sum(a, lab, range(1, n + 1))
    boxes = [(o[1].start, o[0].start, o[1].stop, o[0].stop)
             for o, s in zip(ndimage.find_objects(lab), sizes) if s > min_px]
    boxes = [b for b in boxes if not any(abs((b[0] + b[2]) / 2 - c) < 30 for c in drop_cx)]
    if merge_x:
        merged = True
        while merged:
            merged = False
            for i in range(len(boxes)):
                for j in range(i + 1, len(boxes)):
                    p, q = boxes[i], boxes[j]
                    if min(p[2], q[2]) - max(p[0], q[0]) > 0.3 * min(p[2] - p[0], q[2] - q[0]):
                        boxes[i] = (min(p[0], q[0]), min(p[1], q[1]), max(p[2], q[2]), max(p[3], q[3]))
                        del boxes[j]
                        merged = True
                        break
                if merged:
                    break
    # nhom hang theo tam doc
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows = []
    for b in boxes:
        cy = (b[1] + b[3]) / 2
        if rows and abs(rows[-1][0] - cy) < 100:
            rows[-1][1].append(b)
        else:
            rows.append([cy, [b]])
    return im, [b for _, r in rows for b in sorted(r, key=lambda b: b[0])]


def _crop(im, box):
    sub = im.crop(box)
    bb = sub.getbbox()
    return sub.crop(bb) if bb else sub


def _whole(fname):
    im = _keyed(fname)
    return im.crop(im.getbbox())


def _icon(im):
    im = _scale(im, ICON_SIZE / max(im.width, im.height))
    canvas = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(im, ((ICON_SIZE - im.width) // 2, (ICON_SIZE - im.height) // 2))
    return canvas


# ---- Dung ngay trong game -> props/ (ten, file, chieu cao trong game hoac scale)
PROPS_NOW = {
    "b_vechai": ("bld_vechai.png", 0.6),
    "veh_bus": ("veh_bus.png", ("w", 440)),       # thay xe buyt cu dinh watermark
    "bus_stop": ("bus_stop.png", ("h", 160)),
    "taxi_stand": ("taxi_stand.png", ("h", 112)),
}
TUBE_SCALE = 0.5  # nha ong 1:3 cao ~520px -> ~260px, ngang hang cac cong trinh khac

# ---- Icon vat pham 48px: file -> danh sach ten theo thu tu doc (None = bo)
ICONS = {
    "icons_dishes.png": ["mon_com_trang", "mon_trung_op_la", "mon_rau_muong_xao", "mon_canh_chua",
                         "mon_thit_kho_trung", "mon_ca_kho_to", "mon_mi_xao", "mon_com_chien",
                         "mon_dau_hu_sot_ca", "mon_chao", "mon_mi_trung", "mon_bun_xao"],
    "icons_ingredients.png": ["nl_gao", "nl_trung", "nl_mi_goi", "nl_rau_muong", "nl_thit_ba_chi", "nl_ca",
                              "nl_dau_hu", "nl_ca_chua", "nl_hanh_toi", "nl_nuoc_mam", "nl_dau_an", "nl_banh_pho"],
    # hang 1 co 4 dien thoai (mau thu 4 trung mau cao cap) -> bo; hang 2 co o trong
    "icons_electronics.png": ["dt_cu", "dt_tamtrung", "dt_caocap", None,
                              "laptop_cu", "laptop_vanphong", "laptop_gaming",
                              "tai_nghe_nhet", "tai_nghe_chup", "loa_bluetooth", "sac_du_phong", "chuot",
                              "sach_cong_thuc"],
    "icons_gear_shirt_pants.png": [f"gear_{k}_{r}" for k in ("ao", "quan") for r in range(1, 5)],
    "icons_gear_shoes_hat.png": [f"gear_{k}_{r}" for k in ("giay", "non") for r in range(1, 5)],
    "icons_gear_glasses_watch.png": [f"gear_{k}_{r}" for k in ("kinh", "dongho") for r in range(1, 5)],
    "icons_gear_bag_gacha.png": [f"gear_balo_{r}" for r in range(1, 5)] +
                                ["gacha_capsule", "gacha_xu", "gacha_manh", "gacha_ve_vang"],
}

# ---- Chan dung hoi thoai (o luoi 4x2, cat theo khung the, giu nen the)
PORTRAIT_BOXES = [(50, 52, 272, 280), (285, 52, 505, 280), (518, 52, 740, 280), (752, 52, 975, 280),
                  (50, 292, 272, 518), (285, 292, 505, 518), (518, 292, 740, 518), (752, 292, 975, 518)]
PORTRAITS = ["banhmi", "cafe", "taphoa", "comtam", "trasua", "mechanic", "vechai", "buuta"]
PORTRAIT_SIZE = 96

# ---- Cat san cho tinh nang chua code -> v2/<nhom>/
FURN_DROP = {"furn_bookshelf.png": [693], "furn_sofa.png": [316]}  # nguoi mau tham chieu ty le
FURN_SCALE = 0.5
V2_SINGLE = {  # nhom, ten, file, scale
    "bld": [("b_apartment", "bld_apartment.png", 0.5), ("b_mall", "bld_mall.png", 0.5),
            ("b_market", "bld_market.png", 0.5)],
    "props": [("veh_bus_open", "veh_bus_open.png", None), ("gacha_machine", "prop_gacha.png", 0.19)],
    "ui": [("banner_school", "banner_school.png", 1), ("atm", "ui_atm.png", 1), ("bus_map", "ui_bus_map.png", 1),
           ("cooking_stove", "ui_cooking_stove.png", 1), ("cooking_stove_v2", "ui_cooking_stove_v2.png", 1)],
    "jobs": [("city_map", "job_city_map.png", 1)],
}
V2_MULTI = {  # file -> (nhom, scale, [ten theo thu tu doc])
    "market_stalls.png": ("props", 0.45, ["mstall_1", "mstall_2", "mstall_3"]),
    "job_flyer.png": ("jobs", 0.5, ["flyer", "flyer_stack"]),
    "job_shipper_items.png": ("jobs", 0.5, ["ship_card", "ship_box", "ship_timer"]),
    "job_tutor.png": ("jobs", 0.5, ["tutor_notebook", "tutor_board"]),
    "ui_chalkboard.png": ("ui", 1, ["chalkboard", "card_red", "card_blue", "card_green", "card_yellow"]),
    "ui_contract_bill.png": ("ui", 1, ["contract", "bill"]),
    "ui_post.png": ("ui", 1, ["post_banner", "post_envelope"]),
    "ui_market.png": ("ui", 1, ["market_card", "market_tag", "market_stamp", "market_search"]),
    "ui_recipe.png": ("ui", 0.5, ["recipe_book", "star_half", "star_full", "cook_timer"]),
    "ui_gacha_open.png": ("ui", 1, [f"gacha_open_{i}" for i in range(1, 7)]),
    "ui_gacha_reveal.png": ("ui", 1, ["reveal_common", "reveal_good", "reveal_rare", "reveal_limited"]),
    "ui_mall_banners.png": ("ui", 1, ["mall_giadung", "mall_noithat", "mall_dientu", "mall_thoitrang",
                                      "mall_sieuthi"]),
}
GRID_NO_MERGE = {"ui_gacha_open.png", "ui_gacha_reveal.png", "ui_mall_banners.png", "ui_chalkboard.png"}
ROOMS = ["room_tro", "room_apartment", "room_mall", "room_market"]  # nen kin, giu nguyen 1024x572
NPC_V2 = ["npc_mall_giadung", "npc_mall_noithat"]  # 4 frame idle


def _save(im, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, optimize=True)


def _expect(fname, boxes, n):
    if len(boxes) != n:
        raise SystemExit(f"v2_manifest: {fname} tách được {len(boxes)} phần, cần {n} — kiểm tra lại ảnh")


def build(dst, pack_anchor_bottom):
    """Tra ve (props_meta, icon_ids)."""
    props, icons, v2 = {}, [], {}

    def prop(key, im):
        _save(im, os.path.join(dst, "props", f"{key}.png"))
        props[key] = [im.width, im.height]

    def keep(group, key, im):
        _save(im, os.path.join(dst, "v2", group, f"{key}.png"))
        v2.setdefault(group, {})[key] = [im.width, im.height]

    # -- dung ngay
    for key, (fname, s) in PROPS_NOW.items():
        im = _whole(fname)
        if isinstance(s, tuple):
            s = s[1] / (im.width if s[0] == "w" else im.height)
        prop(key, _scale(im, s))
    for i in range(1, 9):
        fname = f"tube_{i}.png"
        if os.path.exists(os.path.join(SRC, fname)):
            prop(f"tube_{i}", _scale(_whole(fname), TUBE_SCALE))

    # -- icon
    for fname, names in ICONS.items():
        im, boxes = _blobs(fname, merge_x=False)
        _expect(fname, boxes, len(names))
        for name, box in zip(names, boxes):
            if name:
                _save(_icon(_crop(im, box)), os.path.join(dst, "icons", f"{name}.png"))
                icons.append(name)

    # -- chan dung
    src = Image.open(os.path.join(SRC, "ui_portraits.png")).convert("RGBA")
    for name, box in zip(PORTRAITS, PORTRAIT_BOXES):
        _save(src.crop(box).resize((PORTRAIT_SIZE, PORTRAIT_SIZE), Image.LANCZOS),
              os.path.join(dst, "ui", f"portrait_{name}.png"))

    # -- noi that: 3 phan khuc / file
    for fname in sorted(os.listdir(SRC)):
        if not (fname.startswith("furn_") and fname.endswith(".png")):
            continue
        im, boxes = _blobs(fname, drop_cx=FURN_DROP.get(fname, ()))
        _expect(fname, boxes, 3)
        boxes.sort(key=lambda b: b[0])
        for tier, box in enumerate(boxes, 1):
            keep("furn", f"{fname[5:-4]}_{tier}", _scale(_crop(im, box), FURN_SCALE))

    for group, items in V2_SINGLE.items():
        for key, fname, s in items:
            im = _whole(fname)
            if s is None:  # cung ty le voi veh_bus
                s = 440 / _whole("veh_bus.png").width
            keep(group, key, _scale(im, s))
    for fname, (group, s, names) in V2_MULTI.items():
        im, boxes = _blobs(fname, merge_x=fname not in GRID_NO_MERGE)
        _expect(fname, boxes, len(names))
        for key, box in zip(names, boxes):
            keep(group, key, _scale(_crop(im, box), s))

    for key in ROOMS:
        keep("rooms", key, Image.open(os.path.join(SRC, f"{key}.png")).convert("RGB"))

    for key in NPC_V2:
        im, boxes = _blobs(f"{key}.png", merge_x=False)
        _expect(key, boxes, 4)
        fr = [_crop(im, b) for b in sorted(boxes, key=lambda b: b[0])]
        s = STAND / float(np.median([f.height for f in fr]))
        sheet, cw, ch = pack_anchor_bottom([_scale(f, s) for f in fr])
        _save(sheet, os.path.join(dst, "v2", "anim", f"{key}.png"))
        v2.setdefault("anim", {})[key] = {"frameWidth": cw, "frameHeight": ch, "frames": len(fr)}

    with open(os.path.join(dst, "v2", "v2.json"), "w") as fp:
        json.dump(v2, fp, indent=1)
    return props, icons
