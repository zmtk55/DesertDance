"""Generate responsive WebP versions of Backgroundimage.png for Desert Dance."""
import os
from PIL import Image

SRC = r"C:\Users\LASER MACHINE\Documents\GitHub\DesertDance\assets\images\Backgroundimage.png"
OUT_DIR = r"C:\Users\LASER MACHINE\Documents\GitHub\DesertDance\assets\images"

WIDTHS = {
    "480": 480,
    "800": 800,
    "1200": 1200,
    "1920": 1920,
}

os.makedirs(OUT_DIR, exist_ok=True)

img = Image.open(SRC)
print(f"Source: {img.size} {img.mode}")

for label, width in WIDTHS.items():
    if img.width <= width:
        continue
    ratio = width / img.width
    new_w = width
    new_h = int(img.height * ratio)
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    out_path = os.path.join(OUT_DIR, f"Backgroundimage-{label}.webp")
    resized.save(out_path, "WEBP", quality=80, method=6)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"  {label}px: {new_w}x{new_h} -> {size_kb:.0f} KB")

# Also a default webp at full quality for comparison
out_path = os.path.join(OUT_DIR, "Backgroundimage.webp")
img.save(out_path, "WEBP", quality=82, method=6)
size_kb = os.path.getsize(out_path) / 1024
print(f"  full: {img.width}x{img.height} -> {size_kb:.0f} KB")
print("Done.")