from PIL import Image

# Open your original icon
original_icon = "large icon.png"  # your 512x512 image
img = Image.open(original_icon)

# Define the sizes we need
sizes = {
    "apple-touch-icon.png": (180, 180),  # iOS
    "icon-32.png": (32, 32),             # favicon
    "icon-192.png": (192, 192),          # Android
    "icon-512.png": (512, 512),          # Android splash
}

# Generate the resized icons
for filename, size in sizes.items():
    resized_img = img.resize(size, Image.LANCZOS)
    resized_img.save(filename, format="PNG")
    print(f"Saved {filename} ({size[0]}x{size[1]})")

print("All icons generated successfully!")
