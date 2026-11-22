# 2026-11-22 新方式のリール:最初の1秒に問いかけ、2秒ごとに切り替え、約8.5秒でループ
# 使い方: from hook import make; make(out, shots, handle)
#   shots = [{'src': 'video.mp4' or 'photo.jpg', 't': 開始秒(動画のみ), 'x': 横の切り出し位置0〜1, 'dur': 秒,
#             'big': '大きい文字', 'small': '小さい文字'} ...]
import os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
PLUM = (36, 20, 52); GOLD = (255, 214, 140)


def _font(p, s):
    return ImageFont.truetype(p, s, index=0)


def _fit(d, text, path, size, maxw):
    f = _font(path, size)
    while d.textlength(text, font=f) > maxw and size > 36:
        size -= 2; f = _font(path, size)
    return f


def _wrap(d, text, path, size, maxw):
    # 1行に収まらなければ2行に分ける(スペース優先、なければ真ん中)
    f = _font(path, size)
    if '\n' in text:
        return text.split('\n')
    if d.textlength(text, font=f) <= maxw:
        return [text]
    if ' ' in text:
        words = text.split(' '); best = None
        for i in range(1, len(words)):
            a, b = ' '.join(words[:i]), ' '.join(words[i:])
            m = max(d.textlength(a, font=f), d.textlength(b, font=f))
            if best is None or m < best[0]: best = (m, [a, b])
        return best[1]
    h = len(text) // 2
    return [text[:h], text[h:]]


def overlay(big, small, handle, first):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    # 上下に薄い影(文字を読みやすく)
    for y in range(0, 760):
        a = int(150 * (1 - y / 760)) if first else int(110 * (1 - y / 760))
        d.line([(0, y), (W, y)], fill=(10, 6, 20, a))
    for y in range(H - 420, H):
        d.line([(0, y), (W, y)], fill=(10, 6, 20, int(120 * (y - (H - 420)) / 420)))
    y = 300 if first else 330
    if big:
        size = 104 if first else 84
        for ln in _wrap(d, big, SERIF, size, W - 120):
            f = _fit(d, ln, SERIF, size, W - 120)
            d.text((W // 2, y), ln, font=f, fill=(255, 255, 255), anchor='mt', stroke_width=7, stroke_fill=PLUM)
            y += int(f.size * 1.28)
    if small:
        y += 18
        for ln in _wrap(d, small, SANS, 52, W - 140):
            f = _fit(d, ln, SANS, 52, W - 140)
            d.text((W // 2, y), ln, font=f, fill=GOLD, anchor='mt', stroke_width=5, stroke_fill=PLUM)
            y += int(f.size * 1.35)
    d.text((W // 2, H - 250), handle, font=_font(SANS, 38), fill=(255, 255, 255), anchor='mt', stroke_width=4, stroke_fill=PLUM)
    return im


def _photo_frame(path, x):
    im = Image.open(path).convert('RGB')
    s = max(W * 1.08 / im.width, H * 1.08 / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    cx = int((im.width - W * 1.08) * x)
    cy = (im.height - int(H * 1.08)) // 2
    return im.crop((cx, cy, cx + int(W * 1.08), cy + int(H * 1.08)))


def make(out, shots, handle, fps=30):
    tmp = tempfile.mkdtemp()
    parts = []
    for i, sh in enumerate(shots):
        ov = os.path.join(tmp, f'ov{i}.png')
        overlay(sh.get('big', ''), sh.get('small', ''), handle, i == 0).save(ov)
        part = os.path.join(tmp, f'p{i}.mp4'); dur = sh['dur']
        if sh['src'].endswith('.mp4'):
            # 横動画から縦に切り出す(x=0左〜1右)
            cw = 'ih*9/16'
            xx = f"(iw-{cw})*{sh.get('x', 0.5)}"
            vf = f"[0:v]crop={cw}:ih:{xx}:0,scale={W}:{H},setsar=1,fps={fps}[v];[v][1:v]overlay=0:0,format=yuv420p"
            cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(sh['t']), '-t', str(dur), '-i', sh['src'], '-i', ov,
                   '-filter_complex', vf, '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', part]
        else:
            fr = os.path.join(tmp, f'ph{i}.jpg'); _photo_frame(sh['src'], sh.get('x', 0.5)).save(fr, quality=95)
            n = int(dur * fps)
            # ゆっくり寄る(1.08→1.0倍に縮めて中央)
            vf = (f"[0:v]scale={int(W*1.08)}:{int(H*1.08)},zoompan=z='1+0.06*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                  f":d={n}:s={W}x{H}:fps={fps},setsar=1[v];[v][1:v]overlay=0:0,format=yuv420p")
            cmd = ['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', fr, '-i', ov, '-filter_complex', vf,
                   '-frames:v', str(n), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', part]
        subprocess.run(cmd, check=True); parts.append(part)
    lst = os.path.join(tmp, 'list.txt')
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    total = sum(s['dur'] for s in shots)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst,
                    '-f', 'lavfi', '-t', str(total), '-i', 'anullsrc=r=44100:cl=stereo',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-shortest', '-movflags', '+faststart', out], check=True)
    return out
