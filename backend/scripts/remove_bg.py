"""Remove an image background with rembg. Usage: python3 remove_bg.py <input> <output.png>"""
import os, sys
from PIL import Image
from rembg import remove, new_session

model = os.environ.get("REMBG_MODEL", "u2net")  # use "u2netp" on low-memory plans
src, dst = sys.argv[1], sys.argv[2]

img = Image.open(src).convert("RGB")
img.thumbnail((2000, 2000))  # keep memory and time in check
out = remove(img, session=new_session(model), alpha_matting=True,
             alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10)
out.save(dst, "PNG")
