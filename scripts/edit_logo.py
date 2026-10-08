from PIL import Image, ImageDraw

img = Image.open('public/logo.png')
draw = ImageDraw.Draw(img)

# Mask the text starting around y=530
draw.rectangle([(0, 520), (1024, 682)], fill=(0, 0, 0))

# Let's crop the image so it doesn't have too much empty space at the bottom
# The logo starts somewhere around y=50. We can crop it to be a bit tighter.
# Let's crop to (0, 0, 1024, 560)
img_cropped = img.crop((0, 0, 1024, 580))

img_cropped.save('public/logo.png')
