"""Xuat contact sheet danh so blob cho cac sheet moi (de map ten)."""
import os, sys
from PIL import Image, ImageDraw
from import_new_art import SRC, frames_in
sys.stdout.reconfigure(encoding="utf-8")
OUT = os.path.join(os.path.dirname(__file__), "out", "new")
PARAMS = {  # file: (dilate, min_ratio)
    "Congtrinh.jpg": (4, 0.05, 2), "NPC.jpg": (3, 0.2, 2), "VEHICLE.png": (6, 0.02, 1),
    "item.png": (10, 0.01, 1), "props.jpg": (3, 0.003, 1),
}
if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for f, (d, mr, er) in PARAMS.items():
        rows = frames_in(os.path.join(SRC, f), dilate=d, min_ratio=mr, erode=er)
        im = Image.open(os.path.join(SRC, f)).convert("RGB")
        dr = ImageDraw.Draw(im)
        i = 0
        for r, row in enumerate(rows):
            for b in row:
                dr.rectangle([b["x"], b["y"], b["x"] + b["w"], b["y"] + b["h"]], outline=(0, 255, 0), width=2)
                dr.rectangle([b["x"], b["y"], b["x"] + 30, b["y"] + 14], fill=(0, 0, 0))
                dr.text((b["x"] + 2, b["y"] + 1), f"{r}.{row.index(b)}", fill=(255, 255, 0))
                i += 1
        im.save(os.path.join(OUT, f"_contact_{f.split('.')[0]}.png"))
        print(f, "rows:", [len(r) for r in rows], "total", i)
