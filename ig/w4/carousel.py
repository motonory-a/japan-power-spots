# w4 カルーセル(1080x1350)。表紙=写真を上に全面(FULL)+生成りの文字エリア / 文字だけの表紙 / 写真2枚の表紙
# 中身=上に写真の帯(または生成り)+番号+見出し+本文 / 最後=保存のお願い
import json, re, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
from ccontent import SAVE, OMA, TOG, JIN, ST8, ST9

IG = '/home/claude/japan-power-spots/ig/'
O = IG + 'own/'; L = O + 'lib/'; SR = IG + 'w4/src/'; STL = IG + 'stones/lib/'
OUT = IG + 'w4/out/'
SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
SANSB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
W, H = 1080, 1350
CREAM = (250, 247, 241); NAVY = (28, 36, 64); INK = (60, 64, 84); VERM = (214, 58, 40); GREY = (130, 128, 136)
IDX = {'ko': 1, 'zh': 3}
HANDLE = {'jp': '@japan_psj_jp', 'st': '@nigihayahi03', 'en': '@japan_psj', 'zh': '@japan_psj_tw',
          'ko': '@japan_psj_kr', 'fr': '@japan_psj_fr', 'es': '@japan_psj_es'}
SWIPE = {'jp': 'スワイプ →', 'st': 'スワイプ →', 'en': 'Swipe →', 'zh': '往右滑 →', 'ko': '옆으로 넘기기 →', 'fr': 'Faites glisser →', 'es': 'Desliza →'}
LANG = None


def F(p, s):
    return ImageFont.truetype(p, s, index=IDX.get(LANG, 0))


def latin(t):
    return all(ord(c) < 0x2E80 or c in '’«»–—…' for c in t)


def wrap(d, text, font, maxw):
    out = []
    for para in text.split('\n'):
        lat = latin(para)
        toks = re.findall(r'\S+\s*', para) if lat else list(para)
        cur = ''
        for t in toks:
            if d.textlength((cur + t).rstrip(), font=font) <= maxw:
                cur += t
            else:
                if not lat and t in '、。，．）」』！？ー・：' and cur:
                    cur += t; continue
                out.append(cur.rstrip()); cur = t.lstrip()
        if cur.strip(): out.append(cur.rstrip())
        if not lat and len(out) > 1 and len(out[-1]) <= 2:
            out[-2], out[-1] = out[-2][:-2], out[-2][-2:] + out[-1]
    return out


def fitblock(d, text, path, size, maxw, maxh, lh=1.35, minsize=30):
    while True:
        f = F(path, size); ls = wrap(d, text, f, maxw)
        if len(ls) * size * lh <= maxh or size <= minsize: return f, ls
        size -= 2


def photo(path, w, h, fx=0.5, fy=0.5):
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = int((im.width - w) * fx); y = int((im.height - h) * fy)
    return im.crop((x, y, x + w, y + h))


def footer(d, lang, n=None, total=None):
    d.text((60, H - 56), HANDLE[lang], font=F(SANS, 28), fill=GREY, anchor='ls')
    d.text((W - 60, H - 56), SWIPE[lang] if n is None or n < total else '', font=F(SANS, 28), fill=GREY, anchor='rs')


def label_bar(d, x, y, text, color=VERM):
    d.rectangle((x, y + 6, x + 6, y + 32), fill=color)
    d.text((x + 20, y), text, font=F(SANSB, 28), fill=color)


def cover_photo(lang, src, label, title, sub, fx=0.5, fy=0.5, ph=860):
    im = Image.new('RGB', (W, H), CREAM); im.paste(photo(src, W, ph, fx, fy), (0, 0)); d = ImageDraw.Draw(im)
    y = ph + 44; label_bar(d, 56, y, label)
    f, ls = fitblock(d, title, SERIF, 84, W - 112, 250, 1.25, 44)
    y += 52
    for ln in ls: d.text((54, y), ln, font=f, fill=NAVY); y += int(f.size * 1.25)
    if sub: d.text((58, y + 10), sub, font=fitblock(d, sub, SANS, 34, W - 116, 50)[0], fill=INK)
    footer(d, lang)
    return im


def cover_text(lang, label, title, sub):
    im = Image.new('RGB', (W, H), CREAM); d = ImageDraw.Draw(im)
    d.rectangle((36, 36, W - 36, H - 36), outline=VERM, width=4)
    # お守りの形(オリジナルの図)
    cx, top = W // 2, 150
    d.rounded_rectangle((cx - 110, top + 60, cx + 110, top + 360), radius=40, fill=VERM)
    d.rounded_rectangle((cx - 82, top + 120, cx + 82, top + 300), radius=12, outline=(255, 236, 200), width=5)
    d.ellipse((cx - 22, top + 18, cx + 22, top + 62), outline=NAVY, width=8)
    d.line((cx - 30, top + 75, cx - 60, top + 10), fill=NAVY, width=7); d.line((cx + 30, top + 75, cx + 60, top + 10), fill=NAVY, width=7)
    for i in range(3):
        d.line((cx - 50, top + 160 + i * 50, cx + 50, top + 160 + i * 50), fill=(255, 236, 200), width=6)
    y = 600; d.text((W // 2, y), label, font=F(SANSB, 30), fill=VERM, anchor='mt')
    f, ls = fitblock(d, title, SERIF, 92, W - 160, 330, 1.25, 50)
    y += 70
    for ln in ls: d.text((W // 2, y), ln, font=f, fill=NAVY, anchor='mt'); y += int(f.size * 1.25)
    fs, ss = fitblock(d, sub, SANS, 36, W - 180, 110, 1.35, 28)
    y += 30
    for ln in ss: d.text((W // 2, y), ln, font=fs, fill=INK, anchor='mt'); y += int(fs.size * 1.35)
    footer(d, lang)
    return im


def cover_split(lang, a_src, b_src, A, B, label, title, afx=0.5, bfx=0.5):
    im = Image.new('RGB', (W, H), CREAM)
    im.paste(photo(a_src, W // 2 - 4, 820, afx), (0, 0)); im.paste(photo(b_src, W // 2 - 4, 820, bfx), (W // 2 + 4, 0))
    d = ImageDraw.Draw(im)
    for x, t in [(W // 4, A), (3 * W // 4, B)]:
        f = F(SANSB, 44); w = d.textlength(t, font=f) + 60
        d.rounded_rectangle((x - w / 2, 720, x + w / 2, 790), radius=35, fill=(255, 255, 255))
        d.text((x, 755), t, font=f, fill=NAVY, anchor='mm')
    y = 864; label_bar(d, 56, y, label)
    f, ls = fitblock(d, title, SERIF, 80, W - 112, 280, 1.25, 44)
    y += 56
    for ln in ls: d.text((54, y), ln, font=f, fill=NAVY); y += int(f.size * 1.25)
    footer(d, lang)
    return im


def band(src, fx=0.5, fy=0.5):
    im = photo(src, W, 470, fx, fy)
    return Image.blend(im, Image.new('RGB', im.size, (20, 14, 26)), 0.25)


def slide(lang, n, total, head, body, band_src=None, label='', fx=0.5, fy=0.5):
    im = Image.new('RGB', (W, H), CREAM); d = ImageDraw.Draw(im)
    if band_src:
        im.paste(band(band_src, fx, fy), (0, 0)); d = ImageDraw.Draw(im)
        if label: d.text((56, 420), label, font=F(SANSB, 32), fill=(255, 255, 255), anchor='ls', stroke_width=3, stroke_fill=(20, 14, 26))
        top, bottom, hs, bs = 520, H - 110, 64, (46 if not latin(body) else 44)
    else:
        d.rectangle((36, 36, W - 36, H - 36), outline=VERM, width=4)
        if label: d.text((W // 2, 100), label, font=F(SANSB, 30), fill=VERM, anchor='mt')
        top, bottom, hs, bs = 190, H - 120, 78, (56 if not latin(body) else 52)
    fh, lh = fitblock(d, head, SERIF, hs, W - 120, 200, 1.25, 40)
    hh = len(lh) * int(fh.size * 1.25)
    avail = bottom - top - 160 - hh - 40
    fb, lb = fitblock(d, body, SANS, bs, W - 120, avail, 1.5, 28)
    bh = len(lb) * int(fb.size * 1.5)
    y0 = top if band_src else top + max(0, (bottom - top - (160 + hh + 40 + bh)) // 2)
    d.ellipse((56, y0, 176, y0 + 120), fill=VERM)
    d.text((116, y0 + 60), str(n), font=F(SERIF, 70), fill=(255, 255, 255), anchor='mm')
    d.text((W - 60, y0 + 60), f'{n}/{total}', font=F(SANS, 32), fill=GREY, anchor='rm')
    y = y0 + 160
    for ln in lh: d.text((58, y), ln, font=fh, fill=NAVY); y += int(fh.size * 1.25)
    y += 40
    for ln in lb: d.text((60, y), ln, font=fb, fill=INK); y += int(fb.size * 1.5)
    footer(d, lang, n, total + 1)
    return im


def save_slide(lang, save=None, band_src=None, fx=0.5):
    im = Image.new('RGB', (W, H), CREAM); d = ImageDraw.Draw(im)
    if band_src:
        im.paste(band(band_src, fx), (0, 0)); d = ImageDraw.Draw(im); y = 640
    else:
        d.rectangle((36, 36, W - 36, H - 36), outline=VERM, width=4); y = 420
    big, small = save or SAVE[lang]
    # しおり(保存)の図
    d.polygon([(W // 2 - 40, y - 150), (W // 2 + 40, y - 150), (W // 2 + 40, y - 40), (W // 2, y - 70), (W // 2 - 40, y - 40)], fill=VERM)
    for ln in big.split('\n'):
        f = F(SERIF, 76)
        while d.textlength(ln, font=f) > W - 140: f = F(SERIF, f.size - 2)
        d.text((W // 2, y), ln, font=f, fill=NAVY, anchor='mt'); y += int(f.size * 1.35)
    f = F(SANS, 40)
    while d.textlength(small, font=f) > W - 140: f = F(SANS, f.size - 2)
    d.text((W // 2, y + 30), small, font=f, fill=VERM, anchor='mt')
    d.text((W // 2, H - 90), HANDLE[lang], font=F(SANSB, 38), fill=GREY, anchor='mt')
    return im


def run(day, lang, cover, slides, save=None, save_band=None):
    global LANG; LANG = lang
    names = []
    def put(im, suf):
        nm = f'c-{day}-{lang}-{suf}.jpg'; im.save(OUT + nm, quality=90); names.append(nm)
    put(cover(), '0')
    for i, s in enumerate(slides, 1): put(s(), str(i))
    put(save_slide(lang, save, save_band), 's')
    return names


def build():
    res = {}
    LBL = lambda c: c['label']
    # 火 12/8 お守り(文字だけ)
    for lang, c in OMA.items():
        res[f'12-08-{lang}'] = run('12-08', lang, lambda c=c, lang=lang: cover_text(lang, c['label'], c['title'], c['sub']),
            [lambda i=i, h=h, b=b, c=c, lang=lang: slide(lang, i, len(c['items']), h, b, None, c['label']) for i, (h, b) in enumerate(c['items'], 1)],
            save=c['save'])
    # st 火 No.8 / 日 No.9(石の写真)
    for day, c, src in [('12-08', ST8, STL + 'IMG_8545.jpg'), ('12-13', ST9, STL + 'IMG_7193.jpg')]:
        res[f'{day}-st'] = run(day, 'st', lambda c=c, src=src: cover_photo('st', src, c['label'], c['title'], c['sub'], fy=0.5),
            [lambda i=i, h=h, b=b, c=c, src=src: slide('st', i, len(c['items']), h, b, src, c['label'], fy=0.85) for i, (h, b) in enumerate(c['items'], 1)],
            save_band=src)
    # 木 12/10 東国三社
    KA = L + 'katori-kashima-1162.jpg'; K40 = L + 'katori-kashima-1140.jpg'
    IB, IO = O + 'ikisu-torii-back.jpg', O + 'ikisu-ogatama-sign.jpg'
    PD = lambda n: O + f'kashima-pond-0{n}.jpg'
    TP = {'jp': (PD(3), PD(1), IB, 0.5), 'st': (IB, PD(4), IB, 0.3), 'en': (PD(5), PD(2), IB, 0.6), 'zh': (PD(1), PD(3), IO, 0.7),
          'ko': (PD(4), K40, IB, 0.4), 'fr': (K40, PD(5), IO, 0.5), 'es': (PD(2), PD(3), IB, 0.2)}
    for lang, c in TOG.items():
        cv, kb, ib, ky = TP[lang]
        bands = [(kb, 0.5, 0.5), (KA, 0.5, ky), (ib, 0.5, 0.45), (cv, 0.5, 0.3), (cv, 0.5, 0.7)]
        res[f'12-10-{lang}'] = run('12-10', lang, lambda c=c, lang=lang, cv=cv: cover_photo(lang, cv, c['label'], c['title'], c['sub'], fy=0.45),
            [lambda i=i, h=h, b=b, lang=lang, c=c, bd=bands[i - 1]: slide(lang, i, 5, h, b, bd[0], c['label'], bd[1], bd[2]) for i, (h, b) in enumerate(c['items'], 1)],
            save_band=cv)
    # 日 12/13 神社とお寺
    N84 = L + 'naritasan-1184.jpg'
    JP = {'jp': (O + 'hotoku-ninomiya-01.jpg', N84, 0.4, 0.15), 'en': (L + 'kibitsuhiko-7280.jpg', L + 'naritasan-1194.jpg', 0.5, 0.5),
          'zh': (L + 'chiba-jinja-6695.jpg', L + 'tokushima-2025-8651.jpg', 0.5, 0.5), 'ko': (L + 'kibitsuhiko-7297.jpg', N84, 0.5, 0.9),
          'fr': (L + 'dogo-7154.jpg', O + 'asakusa-nisonbutsu-night.jpg', 0.5, 0.5), 'es': (L + 'red-torii-momiji-6999.jpg', N84, 0.5, 0.55)}
    for lang, c in JIN.items():
        a, b, af, bf = JP[lang]
        bands = [(a, af), (b, bf), (a, af), (b, bf), (a, af)]
        res[f'12-13-{lang}'] = run('12-13', lang, lambda c=c, lang=lang, a=a, b=b, af=af, bf=bf: cover_split(lang, a, b, c['A'], c['B'], c['label'], c['title'], af, bf),
            [lambda i=i, h=h, bb=bb, lang=lang, c=c, bd=bands[i - 1]: slide(lang, i, 5, h, bb, bd[0], c['label'], bd[1], 0.5) for i, (h, bb) in enumerate(c['items'], 1)],
            save_band=a)
    json.dump(res, open(IG + 'w4/carousels.json', 'w'), ensure_ascii=False, indent=1)
    print(len(res), sum(len(v) for v in res.values()))


if __name__ == '__main__':
    build()
