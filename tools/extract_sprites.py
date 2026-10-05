"""
Tach sprite tu cac concept sheet nen trang.

  python tools/extract_sprites.py            -> xuat blob vao tools/out/<sheet>/NNN.png + contact sheet

Buoc:
  1. Flood-fill tu vien anh qua cac pixel "gan trang" -> nen trong suot
     (giu lai mau trang ben trong nhan vat, vd ao so mi).
  2. Connected components tren mask (co dilation nhe de gop cac manh roi).
  3. Loai bo blob nho (chu chu thich, nhieu JPG).
"""
import json
import os
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tools", "out")

SHEETS = {
    "sv_male": "Animation_SinhVien_Male.jpg",
    "vp_male": "Animation_Công sở_Male.jpg",
    "baba_female": "Animation_Đồ Bà ba_ Female.jpg",
    "aodai_female": "Anition_cách tân_female.jpg",
    "banhmi": "BanhMi.png",
    "bida": "Bida-BangDia.png",
    "buudien": "BuuDien.png",
    "npc": "NPC.png",
    "npc_idle": "NPC_Idle.png",
    "npc_idle2": "NPC_Idle_v2.png",
    "vatthe": "VatThe.png",
}


def background_mask(rgb, thresh):
    """True = nen. Flood fill tu vien qua pixel sang & it bao hoa."""
    r, g, b = rgb[..., 0].astype(int), rgb[..., 1].astype(int), rgb[..., 2].astype(int)
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    light = (mn >= thresh) & (mx - mn <= 18)
    # nhan cac vung "sang" lien thong voi vien anh
    lab, _ = ndimage.label(light)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    border = border[border != 0]
    return np.isin(lab, border)


def extract(key, fname, thresh, min_h_ratio, dilate):
    img = Image.open(os.path.join(ROOT, fname)).convert("RGB")
    rgb = np.array(img)
    H, W = rgb.shape[:2]
    bg = background_mask(rgb, thresh)
    fg = ~bg
    # bo nhieu le te
    fg = ndimage.binary_opening(fg, iterations=1)
    grown = ndimage.binary_dilation(fg, iterations=dilate) if dilate else fg
    lab, n = ndimage.label(grown)
    objs = ndimage.find_objects(lab)
    out_dir = os.path.join(OUT, key)
    os.makedirs(out_dir, exist_ok=True)
    for f in os.listdir(out_dir):
        os.remove(os.path.join(out_dir, f))

    rgba = np.dstack([rgb, (fg * 255).astype(np.uint8)])
    blobs = []
    for i, sl in enumerate(objs):
        if sl is None:
            continue
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        h, w = y1 - y0, x1 - x0
        if h < H * min_h_ratio:
            continue
        sub_mask = (lab[y0:y1, x0:x1] == i + 1) & fg[y0:y1, x0:x1]
        crop = rgba[y0:y1, x0:x1].copy()
        crop[..., 3] = np.where(sub_mask, 255, 0)
        blobs.append({"x": int(x0), "y": int(y0), "w": int(w), "h": int(h), "img": crop})

    # sap xep theo hang (bang cach cum theo tam y) roi theo x
    blobs.sort(key=lambda b: (b["y"] + b["h"]) )
    rows = []
    for b in blobs:
        bottom = b["y"] + b["h"]
        for row in rows:
            if abs(row["bottom"] - bottom) < H * 0.06:
                row["items"].append(b)
                break
        else:
            rows.append({"bottom": bottom, "items": [b]})
    ordered = []
    for row in rows:
        ordered.extend(sorted(row["items"], key=lambda b: b["x"]))

    meta = []
    for idx, b in enumerate(ordered):
        Image.fromarray(b["img"], "RGBA").save(os.path.join(out_dir, f"{idx:03d}.png"))
        meta.append({k: b[k] for k in ("x", "y", "w", "h")} | {"id": idx})
    with open(os.path.join(out_dir, "meta.json"), "w") as fp:
        json.dump(meta, fp, indent=1)

    # contact sheet: anh goc + khung danh so
    cs = img.copy()
    d = ImageDraw.Draw(cs)
    for m in meta:
        d.rectangle([m["x"], m["y"], m["x"] + m["w"], m["y"] + m["h"]], outline=(255, 0, 0), width=2)
        d.rectangle([m["x"], m["y"], m["x"] + 26, m["y"] + 14], fill=(255, 0, 0))
        d.text((m["x"] + 2, m["y"] + 1), str(m["id"]), fill=(255, 255, 255))
    cs.save(os.path.join(OUT, f"_contact_{key}.png"))
    print(f"{key}: {len(meta)} blobs")


if __name__ == "__main__":
    only = sys.argv[1:] or list(SHEETS)
    for key in only:
        big = SHEETS[key].endswith(".png")
        extract(key, SHEETS[key],
                thresh=236 if big else 228,
                min_h_ratio=0.04 if big else 0.10,
                dilate=4 if big else 1)
