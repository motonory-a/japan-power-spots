# Feed v2 (2026-11-14): bright "white frame" design.
# Photo is never darkened or covered; text sits on an ivory caption area.
# Navy serif title (trust, readable at grid size) + one vermilion accent (draws the eye, shrine colour).
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
IG = '/home/claude/japan-power-spots/ig/'
OUT = IG + 'fv2/'
SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
SANSB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
W, H = 1080, 1350
BG = (250, 247, 241); NAVY = (28, 36, 64); INK = (78, 84, 104); VERM = (214, 58, 40); GREY = (150, 150, 158)
M = 44  # outer margin

def F(p, s): return ImageFont.truetype(p, s, index=0)

def cover(path, w, h, fx=0.5, fy=0.5, crop=None):
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    if crop: im = im.crop(crop)
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = int((im.width - w) * fx); y = int((im.height - h) * fy)
    return im.crop((x, y, x + w, y + h))

def fit(d, t, path, size, maxw):
    while size > 40 and d.textlength(t, font=F(path, size)) > maxw: size -= 2
    return F(path, size)

def spaced(d, xy, t, f, fill, sp=4, anchor='l'):
    w = sum(d.textlength(c, font=f) for c in t) + sp * (len(t) - 1)
    x, y = xy
    if anchor == 'm': x -= w / 2
    for c in t:
        d.text((x, y), c, font=f, fill=fill); x += d.textlength(c, font=f) + sp
    return w

def base(src, ph, fx=0.5, fy=0.5, crop=None):
    im = Image.new('RGB', (W, H), BG)
    photo = cover(src, W - 2 * M, ph, fx, fy, crop)
    mask = Image.new('L', photo.size, 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, *photo.size), radius=22, fill=255)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((M, M + 6, W - M, M + ph + 6), radius=22, fill=(40, 30, 20, 50))
    im = Image.alpha_composite(im.convert('RGBA'), sh.filter(ImageFilter.GaussianBlur(12))).convert('RGB')
    im.paste(photo, (M, M), mask)
    return im

def footer(d, brand, credit=None):
    y = H - 62
    d.ellipse((M + 4, y + 2, M + 22, y + 20), fill=VERM)
    spaced(d, (M + 36, y - 2), brand, F(SANS, 22), NAVY, sp=3) if brand.isascii() else d.text((M + 36, y - 3), brand, font=F(SANS, 24), fill=NAVY)
    if credit:
        d.text((W - M, y + 18), credit, font=F(SANS, 17), fill=GREY, anchor='rs')

def card(out, src, label, title, sub, credit=None, brand='JAPAN POWER SPOT JOURNEY', fx=0.5, fy=0.5, crop=None, ph=900):
    im = base(src, ph, fx, fy, crop); d = ImageDraw.Draw(im)
    ft = fit(d, title, SERIF, 88, W - 2 * M - 10)
    blk = 40 + int(ft.size * 1.42) + 44
    y = M + ph + 6 + (H - 90 - (M + ph + 6) - blk) // 2
    d.rectangle((M + 4, y + 6, M + 10, y + 30), fill=VERM)
    spaced(d, (M + 26, y), label, F(SANSB, 26), VERM, sp=3 if label.isascii() else 2)
    d.text((M - 2, y + 40), title, font=ft, fill=NAVY)
    d.text((M + 2, y + 40 + int(ft.size * 1.42)), sub, font=F(SANS, 34), fill=INK)
    footer(d, brand, credit)
    im.save(OUT + out, quality=92)

def steps(out, src, label, title, items, credit=None, brand='JAPAN POWER SPOT JOURNEY', fx=0.5, fy=0.5, ph=640, crop=None):
    im = base(src, ph, fx, fy, crop); d = ImageDraw.Draw(im)
    y = M + ph + 40
    d.rectangle((M + 4, y + 6, M + 10, y + 30), fill=VERM)
    spaced(d, (M + 26, y), label, F(SANSB, 26), VERM, sp=3 if label.isascii() else 2)
    ft = fit(d, title, SERIF, 76, W - 2 * M); d.text((M, y + 44), title, font=ft, fill=NAVY)
    y += 60 + int(ft.size*1.4); fi = F(SANS, 32)
    for i, t in enumerate(items):
        d.ellipse((M, y, M + 46, y + 46), fill=VERM)
        d.text((M + 23, y + 23), str(i + 1), font=F(SANSB, 26), fill=(255, 255, 255), anchor='mm')
        d.text((M + 66, y + 23), t, font=fit(d, t, SANS, 32, W - 2 * M - 70), fill=NAVY, anchor='lm'); y += 72
    footer(d, brand, credit)
    im.save(OUT + out, quality=92)

def promo(out, src, label, title, sub, chips, cta, credit=None, brand='JAPAN POWER SPOT JOURNEY', fx=0.5, fy=0.5, ph=760):
    im = base(src, ph, fx, fy); d = ImageDraw.Draw(im)
    y = M + ph + 40
    d.rectangle((M + 4, y + 6, M + 10, y + 30), fill=VERM)
    spaced(d, (M + 26, y), label, F(SANSB, 26), VERM, sp=3 if label.isascii() else 2)
    ft = fit(d, title, SERIF, 84, W - 2 * M); d.text((M, y + 44), title, font=ft, fill=NAVY)
    y += 44 + int(ft.size*1.4); d.text((M + 2, y), sub, font=F(SANS, 32), fill=INK); y += 64
    fc = F(SANSB, 28); x = M
    for c in chips:
        w = d.textlength(c, font=fc) + 44
        d.rounded_rectangle((x, y, x + w, y + 54), radius=27, outline=NAVY, width=2)
        d.text((x + w / 2, y + 27), c, font=fc, fill=NAVY, anchor='mm'); x += w + 14
    fb = F(SANSB, 30); w = d.textlength(cta, font=fb) + 64
    d.rounded_rectangle((W - M - w, H - 150, W - M, H - 90), radius=30, fill=VERM)
    d.text((W - M - w / 2, H - 120), cta, font=fb, fill=(255, 255, 255), anchor='mm')
    footer(d, brand, credit)
    im.save(OUT + out, quality=92)

S = IG + 'src/'; ST = IG + 'stones/'
def cc(a, l): return ('📷 ' if False else '') + (f'Photo: {a} / {l}' if a else f'Photo: Wikimedia Commons / {l}')

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    # --- power spot accounts (intl: EN + kanji / jp: Japanese) ---
    D = [
     ('11-14', S+'cm-w0-arashiyama.jpg', dict(fy=0.5), cc('lumoplank','CC0'),
        ('POWER SPOT · KYOTO','Arashiyama  嵐山','Autumn leaves along the Katsura River'),
        ('パワースポット・京都','嵐山','桂川をいろどる、秋の紅葉')),
     ('11-15', S+'cm-w0-chitose.jpg', dict(fy=0.35), cc('Nesnad','CC BY 4.0'),
        ('NOVEMBER 15','Shichi-Go-San  七五三','The day children visit shrines'),
        ('11月15日','七五三','子どもの成長を、神社で祝う日')),
     ('11-16', S+'cm-mon-tofukuji.jpg', dict(fy=0.4), cc('','CC BY-SA 4.0'),
        ('POWER SPOT · KYOTO','Tofuku-ji  東福寺','Kyoto\'s famous autumn leaves'),
        ('パワースポット・京都','東福寺','京都屈指の紅葉の名所')),
     ('11-17', S+'canva-tue.jpg', dict(fy=0.4, crop=(0,0,1080,1040)), None,
        ('AUTUMN TASTE','Yaki-imo  焼き芋','Japan\'s autumn street food'),
        ('秋の味覚','焼き芋','寒くなると恋しくなる、秋の味')),
     ('11-18', S+'canva-wed.jpg', dict(fy=0.5, crop=(0,250,1080,1360)), None,
        ('POWER SPOT · TOKYO','Icho Namiki  いちょう並木','Golden ginkgo season in Tokyo'),
        ('パワースポット・東京','神宮外苑いちょう並木','黄金色に染まる、いまだけの景色')),
     ('11-20', S+'cm-fri-kamakura.jpg', dict(fy=0.55), cc('Dirk Beyer','CC BY-SA 3.0'),
        ('POWER SPOT · KAMAKURA','Kamakura  鎌倉','1 hour from Tokyo · Autumn temples'),
        ('パワースポット・鎌倉','鎌倉','東京から1時間、秋の古都へ')),
     ('11-21', S+'cm-sat-fuji5.jpg', dict(fy=0.5), cc('lumoplank','CC0'),
        ('POWER SPOT · MT. FUJI','Mt. Fuji & Momiji','富士山 · Autumn leaves in November'),
        ('パワースポット・富士山','富士山と紅葉','11月だけの、赤と白の絶景')),
    ]
    for date, src, kw, cr, en, jp in D:
        card(f'ps-{date}.jpg', src, *en, credit=cr, **kw)
        card(f'ps-{date}-jp.jpg', src, *jp, credit=cr, **kw)
    tcr = cc('Hyppolyte de Saint-Rambert', 'CC BY 4.0')
    steps('ps-11-19.jpg', S+'canva-thu.jpg', 'SHRINE MANNERS', 'How to pray at a shrine',
          ['Bow once at the torii gate', 'Rinse your hands at the temizuya', 'Offer a coin, ring the bell', 'Bow twice, clap twice, pray, bow once'], crop=(0,0,1080,680))
    steps('ps-11-19-jp.jpg', S+'canva-thu.jpg', 'パワースポット参拝の基本', '神社のお参りの作法',
          ['鳥居の前で一礼', '手水舎で手と口を清める', 'お賽銭を入れ、鈴を鳴らす', '二礼二拍手一礼'], crop=(0,0,1080,680))
    fcr = cc('Moyan Brenn', 'CC BY 2.0')
    promo('ps-11-22.jpg', S+'cm-sat-fuji3.jpg', 'FREE · NO SIGN-UP', 'Find your power spot',
          'By your wish and your birth date', ['Love', 'Money', 'Health', 'Success'], 'Link in bio', credit=fcr, fy=0.5)
    promo('ps-11-22-jp.jpg', S+'cm-sat-fuji3.jpg', 'パワースポット鑑定', 'あなたのいま行くべき聖地は？',
          '鑑定は無料で、特別な登録もいりません', ['恋愛', '金運', '健康', '仕事'], 'プロフィールのリンクから', credit=fcr, fy=0.5)
    # --- stones (@nigihayahi03) ---
    B = '高次元ネゴシエイター アッキー'
    for date, f, lab, t, s, kw in [
        ('11-14', 'lib/IMG_0839.jpg', '天然石の楽しみ方', '石の色で選ぶ', '惹かれる色は、今のあなたに必要な色', {}),
        ('11-15', 'lib/IMG_6742.jpg', '天然石の豆知識 No.3', 'ゴムが切れたら', '悪いしるしではありません', {}),
        ('11-16', 'crystal-gibeon.jpg', '天然石の豆知識', '水晶', '迷ったら、まずはこの石から', {}),
        ('11-17', 'amethyst.jpg', '天然石の豆知識', 'アメジスト', '心を静める、紫の守り石', {}),
        ('11-18', 'apatite-wood.jpg', '天然石の豆知識', 'アパタイト', '名前の由来は「まぎらわしい」', {}),
        ('11-19', 'crystal-wrist.jpg', '天然石の豆知識', '石の浄化', '石にも、休む時間が必要です', {'fy': 0.45}),
        ('11-20', 'hokuto-jade.jpg', '天然石の豆知識', '北投石と翡翠', '温泉が育てた石と、日本の国石', {}),
        ('11-21', 'onyx-gold.jpg', '天然石の豆知識', 'オニキス', '迷いを断ち、身を守る黒', {}),
        ('11-22', 'incarose-iris.jpg', '天然石の豆知識', '左手？右手？', 'ブレスレットをつける手の話', {}),
    ]:
        card(f'st-{date}.jpg', ST + f, lab, t, s, brand=B, **kw)
