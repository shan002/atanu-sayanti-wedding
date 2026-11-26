from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
OUT = IMAGES / "optimized"
OUT.mkdir(exist_ok=True)

JOBS = {
    "hero.jpg": [(1600, "hero-1600.jpg")],
    "couple.jpg": [(900, "couple-900.jpg")],
    "save-the-date.jpg": [(1200, "save-the-date-1200.jpg")],
    **{f"pic-{i}.jpg": [(900, f"pic-{i}-900.jpg")] for i in range(1, 7)}
}

for source_name, versions in JOBS.items():
    source = IMAGES / source_name
    if not source.exists():
        print(f"Skip missing: {source_name}")
        continue
    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        for width, output_name in versions:
            resized = im.copy()
            if resized.width > width:
                height = round(resized.height * width / resized.width)
                resized = resized.resize((width, height), Image.Resampling.LANCZOS)
            resized.save(OUT / output_name, "JPEG", quality=86, optimize=True, progressive=True)
            print(f"Created: images/optimized/{output_name}")
