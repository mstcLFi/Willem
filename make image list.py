import os

# Folder name (replace space with actual folder name if needed)
folder = 'brainrot images'

# Accepted image extensions
extensions = ('.jpg', '.jpeg', '.png', '.webp')

# Get sorted list of image files with accepted extensions
image_files = [f for f in os.listdir(folder) if f.lower().endswith(extensions)]
image_files.sort()

# Generate relative paths for JS
image_paths = [f"{folder}/{filename}" for filename in image_files]

# Print as a JavaScript array
print("const successImages = [")
for path in image_paths:
    print(f"  '{path}',")
print("];")
