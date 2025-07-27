import os

# Folder name (replace space with actual folder name if needed)
folder = 'brainrot images'

# Accepted image extensions
extensions = ('.jpg', '.jpeg', '.png', '.webp')

# Get sorted list of image files with accepted extensions
image_files = [f for f in os.listdir(folder) if f.lower().endswith(extensions)]
image_files.sort()

# Extract filenames without extensions and add ". " after each
image_names = [os.path.splitext(filename)[0] + ". " for filename in image_files]

# Print the list of names
for name in image_names:
    print(name)

