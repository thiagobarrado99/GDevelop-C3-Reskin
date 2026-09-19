"""c3: generate every icon size from the two Assemble3 sources in this folder.

    python newIDE/app/branding/build-icons.py   (needs Pillow)
"""
import os
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
app = os.path.join(here, '..')
electron = os.path.join(here, '..', '..', 'electron-app', 'build')
icon = Image.open(os.path.join(here, 'assemble3_icon.png')).convert('RGBA')
minimal = Image.open(os.path.join(here, 'assemble3_icon_minimalistic.png')).convert('RGBA')
assert icon.size == (512, 512) and minimal.size == (512, 512)


def fit(image, size):
    return image.resize((size, size), Image.LANCZOS)


def png(image, path, size):
    fit(image, size).save(path, optimize=True)
    print(os.path.relpath(path, app), size)


def centred(image, width, height, size, path):
    canvas = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    resized = fit(image, size)
    canvas.paste(resized, ((width - size) // 2, (height - size) // 2), resized)
    canvas.save(path, optimize=True)
    print(os.path.relpath(path, app), f'{width}x{height}')


public = os.path.join(app, 'public')
png(icon, os.path.join(public, 'favicon-16x16.png'), 16)
png(icon, os.path.join(public, 'favicon-32x32.png'), 32)
png(icon, os.path.join(public, 'apple-touch-icon.png'), 180)
png(icon, os.path.join(public, 'android-chrome-192x192.png'), 192)
png(icon, os.path.join(public, 'android-chrome-512x512.png'), 512)
icon.save(os.path.join(public, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
png(icon, os.path.join(public, 'res', 'assemble3-icon.png'), 256)
centred(icon, 1600, 500, 400, os.path.join(public, 'res', 'assemble3-banner.png'))
png(minimal, os.path.join(public, 'res', 'assemble3-loading.png'), 300)

icon.save(
    os.path.join(electron, 'icon.ico'),
    sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
)
icon.save(os.path.join(electron, 'icon.icns'))
png(icon, os.path.join(electron, 'icon.png'), 512)
appx = os.path.join(electron, 'appx')
for name, size in [
    ('LargeTile.png', 310),
    ('SmallTile.png', 71),
    ('Square150x150Logo.png', 150),
    ('Square44x44Logo.png', 44),
    ('StoreLogo.png', 50),
]:
    png(icon, os.path.join(appx, name), size)
centred(icon, 310, 150, 120, os.path.join(appx, 'Wide310x150Logo.png'))
print('done')
