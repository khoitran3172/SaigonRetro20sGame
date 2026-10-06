"""
Bo giao dien (UI kit), cong trinh moi, mini-game nghe tu asset_new_by_khoit/ (anh 1024x572 nen magenta).

Moi file anh -> danh sach (ten asset, hop cat (x0,y0,x1,y1) toa do anh goc). Cat xong tu bo nen magenta,
cat sat theo noi dung (tru khi "keep": giu nguyen khung de cac o cung ty le).

Xuat:
  client/assets/ui/<ten>.png      UI kit, icon HUD, dien thoai, app
  client/assets/jobs/<ten>.png    mini-game nghe
  client/assets/props/<ten>.png   cong trinh / do vat (tra ve kich thuoc cho props.json)
  client/assets/icons/<ten>.png   icon vat pham moi (48px)
"""
import os

import numpy as np
from PIL import Image
from scipy import ndimage

from import_new_art import SRC, key_background

UI_SCALE = 0.5  # anh goc ve pixel ~4px -> 0.5 van net, nhe file
UI_FULL = {"panel", "paperdoll", "phone", "hotbar", "tooltip", "titlebar"}  # hien to -> giu nguyen do phan giai


def _keyed(fname, opaque=False):
    rgb = np.array(Image.open(os.path.join(SRC, fname)).convert("RGB"))
    if opaque:
        a = np.full(rgb.shape[:2], 255, np.uint8)
    else:
        fg = ~key_background(rgb)
        fg = ndimage.binary_opening(fg, iterations=1)
        # bo dom nho le (vet ✦ watermark, nhieu) — giu thanh phan lon
        lab, n = ndimage.label(fg)
        if n:
            sizes = ndimage.sum(fg, lab, range(1, n + 1))
            small = np.isin(lab, np.where(sizes < 400)[0] + 1)
            fg &= ~small
        px = rgb.astype(int)
        r, g, b = px[..., 0], px[..., 1], px[..., 2]
        spill = fg & (r - g > 25) & (b - g > 15)
        rgb = rgb.copy()
        rgb[..., 0] = np.where(spill, g + (r - g) * 0.35, r)
        rgb[..., 2] = np.where(spill, g + (np.minimum(r, b) - g) * 0.35, b)
        a = (fg * 255).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, a]), "RGBA")


def _cut(im, box, keep=False):
    sub = im.crop(box)
    if keep:
        return sub
    bb = sub.getbbox()
    return sub.crop(bb) if bb else sub


def _scale(im, s):
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)


def _row(y0, y1, xs):
    """Cac hop cung hang: xs = [(x0, x1), ...]"""
    return [(x0, y0, x1, y1) for x0, x1 in xs]


# file -> (opaque?, [(ten, hop, keep)])
SLOT_XS = [(12, 132), (137, 257), (264, 384), (390, 510), (514, 634), (640, 760), (768, 888), (892, 1012)]
SHEETS_UI = {
    "ui_wood_paper_panel.png": [("panel", (25, 92, 580, 460)), ("titlebar", (598, 110, 998, 200)), ("close", (752, 270, 852, 370))],
    "ui_slots.png": [(n, b, True) for n, b in zip(
        ["slot_empty", "slot_selected", "slot_locked", "slot_common", "slot_good", "slot_rare", "slot_limited", "slot_hotbar"],
        _row(226, 346, SLOT_XS))],
    "ui_tabs.png": list(zip(["tab_all", "tab_food", "tab_ingredient", "tab_equip", "tab_furniture", "tab_other"],
                            _row(200, 372, [(10, 176), (178, 344), (346, 512), (514, 680), (682, 848), (850, 1016)]))),
    "ui_buttons.png": list(zip(["btn_normal", "btn_hover", "btn_pressed", "btn_disabled"],
                               _row(215, 355, [(12, 262), (264, 512), (512, 762), (764, 1014)]))),
    "ui_tooltip_hotbar.png": [("tooltip", (60, 210, 452, 362)), ("hotbar", (512, 215, 970, 357))],
    "ui_equipment_screen.png": [("paperdoll", (285, 8, 740, 565))],
    "ui_equip_placeholders.png": list(zip(["eq_non", "eq_kinh", "eq_ao", "eq_dongho", "eq_quan", "eq_lung", "eq_giay", "eq_phone"],
                                          _row(220, 352, [(18, 142), (142, 266), (266, 390), (388, 512), (510, 636), (632, 756), (756, 880), (880, 1006)]))),
    "ui_hud_icons.png": list(zip(["hud_hunger", "hud_energy", "hud_mood", "hud_quest", "hud_clock", "hud_home", "hud_sleep", "hud_power"],
                                 _row(168, 296, [(18, 142), (142, 266), (266, 390), (388, 512), (510, 636), (632, 756), (756, 880), (880, 1006)]))),
    "ui_phone.png": [("phone", (390, 52, 636, 520))],
    "ui_phone_apps.png": list(zip(["app_jobs", "app_bank", "app_map", "app_taxi"],
                                  _row(30, 272, [(25, 262), (268, 508), (516, 756), (763, 1000)]))) +
                         list(zip(["app_market", "app_quests", "app_friends", "app_settings"],
                                  _row(300, 542, [(25, 262), (268, 508), (516, 756), (763, 1000)]))),
}

# Mini-game nghe -> client/assets/jobs (scale rieng)
SHEETS_JOBS = {
    "job_it.png": (False, 0.6, [("it_screen", (45, 95, 468, 472))] +
                   [(f"it_block_{i}", b) for i, b in enumerate(_row(238, 334, [(504, 586), (584, 664), (662, 742), (740, 820), (818, 898), (896, 978)]))] +
                   [("it_bug_red", (515, 335, 578, 390)), ("it_bug_green", (905, 180, 966, 236))]),
    "job_waiter_floor.png": (True, 1.0, [("waiter_floor", (0, 0, 1024, 572))]),
    "job_waiter_items.png": (False, 0.45, list(zip(
        ["dish_com_suon", "dish_com_bicha", "dish_canh", "dish_tra_da", "dish_tray", "dish_ticket", "dish_trung", "dish_nuoc_mam"],
        _row(45, 270, [(22, 255), (272, 502), (520, 750), (768, 998)]) + _row(300, 530, [(22, 255), (272, 502), (520, 750), (768, 998)])))),
    # Anh nhan duoc la QUAY PHA CHE (job_milktea_counter) — bo icon ly & topping chua co
    "job_milktea_items.png": (False, 1.0, [("milktea_counter", (0, 0, 1024, 572), True)]),
}

# Cong trinh / do vat -> props (ten, hop, scale)
SHEETS_PROPS = {
    "building_com_tam_facade.png": ("b_comtam", (60, 0, 985, 565), 0.5),
    "building_bubble_tea_facade.png": ("b_trasua", (225, 0, 910, 552), 0.5),
    "prop_coffee_prep_table.png": ("coffee_table", (200, 40, 830, 525), 0.26),
}

# Icon vat pham moi (48px) lay tu job_waiter_items
ICONS_NEW = {"com_suon": "dish_com_suon", "com_bi_cha": "dish_com_bicha", "canh_chua": "dish_canh", "trung_op_la": "dish_trung"}
ICON_SIZE = 48


def _save(im, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, optimize=True)


def build(dst):
    """Tra ve (props_meta, icon_ids)."""
    for fname, entries in SHEETS_UI.items():
        im = _keyed(fname)
        for e in entries:
            name, box, keep = (e + (False,))[:3]
            _save(_scale(_cut(im, box, keep), 1 if name in UI_FULL else UI_SCALE), os.path.join(dst, "ui", f"{name}.png"))

    jobs = {}
    for fname, (opaque, s, entries) in SHEETS_JOBS.items():
        im = _keyed(fname, opaque)
        for e in entries:
            name, box, keep = (e + (False,))[:3]
            out = _scale(_cut(im, box, keep), s)
            jobs[name] = out
            _save(out, os.path.join(dst, "jobs", f"{name}.png"))

    props = {}
    for fname, (name, box, s) in SHEETS_PROPS.items():
        out = _scale(_cut(_keyed(fname), box), s)
        _save(out, os.path.join(dst, "props", f"{name}.png"))
        props[name] = [out.width, out.height]

    icons = []
    for key, src in ICONS_NEW.items():
        im = jobs[src]
        im = _scale(im, ICON_SIZE / max(im.width, im.height))
        canvas = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), (0, 0, 0, 0))
        canvas.alpha_composite(im, ((ICON_SIZE - im.width) // 2, (ICON_SIZE - im.height) // 2))
        _save(canvas, os.path.join(dst, "icons", f"{key}.png"))
        icons.append(key)
    return props, icons


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = os.path.join(root, "tools", "out", "ui_test")
    p, i = build(out)
    print(p, i)
