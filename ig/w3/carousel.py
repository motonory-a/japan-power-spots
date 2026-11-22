# 2026-11-22 本人「12月7日からでは遅い」→ 11/30・12/2・12/3 の1枚画像をカルーセル(表紙+要点4枚+保存のお願い)に作り替える
# 要点の文は、予約済みキャプションの箇条書き(調べて確かめ済みの内容)をそのまま使う。
import json, re
from PIL import Image, ImageDraw, ImageFont, ImageFilter

IG = '/home/claude/japan-power-spots/ig/'
OUT = IG + 'w3/out/'
SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
SANSB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
W, H = 1080, 1350
CREAM = (250, 246, 238); INK = (34, 28, 40); RED = (178, 42, 38); GREY = (120, 112, 104)

LABEL = {
 '11-30': {'jp': '秩父夜祭', 'en': 'Chichibu Night Festival', 'zh': '秩父夜祭', 'ko': '지치부 요마쓰리', 'fr': 'Fête nocturne de Chichibu', 'es': 'Festival nocturno de Chichibu'},
 '12-02': {'jp': '新倉山浅間公園の富士山', 'en': 'Chureito Pagoda & Mt. Fuji', 'zh': '新倉山淺間公園', 'ko': '아라쿠라야마 센겐 공원', 'fr': 'Pagode Chureito et mont Fuji', 'es': 'Pagoda Chureito y monte Fuji', 'st': '天然石の豆知識 No.6'},
 '12-03': {'jp': '冬の日の入り', 'en': 'Early December sunsets', 'zh': '12月初的日落', 'ko': '12월 초 일몰', 'fr': 'Couchers de soleil de décembre', 'es': 'Atardeceres de diciembre'},
}
SAVE = {
 'jp': ('保存して、\n行くときに見返してね', '行きたい人に送ってね'),
 'st': ('保存して、\nいざというときに', 'お友だちにも教えてあげてね'),
 'en': ('Save this\nfor your trip', 'Send it to a travel buddy'),
 'zh': ('先收藏，\n出發前再看一次', '傳給想一起去的朋友'),
 'ko': ('저장해 두고\n여행 때 다시 보세요', '같이 갈 친구에게 공유'),
 'fr': ('Enregistrez-le\npour votre voyage', 'Envoyez-le à un ami'),
 'es': ('Guárdalo\npara tu viaje', 'Envíaselo a quien viajaría contigo'),
}
HANDLE = {'jp': '@japan_psj_jp', 'st': '@nigihayahi03', 'en': '@japan_psj', 'zh': '@japan_psj_tw',
          'ko': '@japan_psj_kr', 'fr': '@japan_psj_fr', 'es': '@japan_psj_es'}
SWIPE = {'jp': 'スワイプ →', 'st': 'スワイプ →', 'en': 'Swipe →', 'zh': '往右滑 →', 'ko': '옆으로 넘기기 →', 'fr': 'Faites glisser →', 'es': 'Desliza →'}
BUL = re.compile(r'^(✔|🏮|🗻|\d\.|・)\s*')


def F(p, s):
    return ImageFont.truetype(p, s, index=0)


def wrap(d, text, font, maxw):
    latin = all(ord(c) < 0x2E80 for c in text)
    out, cur = [], ''
    tokens = re.findall(r'\S+\s*', text) if latin else list(text)
    for t in tokens:
        if d.textlength(cur + t, font=font) <= maxw:
            cur += t
        else:
            # 日本語の行頭禁則(句読点・閉じかっこを前の行に残す)
            if not latin and t in '、。，．）」』！？ー・' and cur:
                cur += t; continue
            out.append(cur.rstrip()); cur = t.lstrip()
    if cur.strip():
        out.append(cur.rstrip())
    # 最後の行が1〜2文字だけにならないよう、前の行から文字を回す
    if not latin and len(out) > 1 and len(out[-1]) <= 2:
        k = 3 - len(out[-1]) if len(out[-1]) < 3 else 1
        out[-2], out[-1] = out[-2][:-k], out[-2][-k:] + out[-1]
    return out


def photo_h(img):
    # 表紙の写真部分の高さ(生成りの文字エリアが始まる行)を探す
    px = img.load()
    for y in range(300, H):
        row = [px[x, y] for x in range(40, W - 40, 20)]
        if all(abs(r - 250) < 8 and abs(g - 246) < 8 and abs(b - 238) < 10 for r, g, b in row):
            return y
    return 720


def band(cover):
    # 表紙画像の写真部分だけを帯として使う(文字エリアは入れない)
    src = Image.open(cover).convert('RGB'); ph = photo_h(src)
    im = src.crop((0, 0, W, ph))
    s = max(W / im.width, 520 / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)))
    y0 = (im.height - 520) // 2
    im = im.crop((0, y0, W, y0 + 520))
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    ov = Image.new('RGB', im.size, (20, 14, 26))
    return Image.blend(im, ov, 0.35)


def slide(cover, lang, label, n, total, text):
    im = Image.new('RGB', (W, H), CREAM); im.paste(band(cover), (0, 0)); d = ImageDraw.Draw(im)
    d.text((70, 470), label, font=F(SANSB, 34), fill=(255, 255, 255), anchor='ls', stroke_width=3, stroke_fill=(20, 14, 26))
    # 番号の丸
    d.ellipse((70, 560, 190, 680), fill=RED)
    d.text((130, 620), str(n), font=F(SERIF, 70), fill=(255, 255, 255), anchor='mm')
    d.text((W - 70, 620), f'{n}/{total}', font=F(SANS, 34), fill=GREY, anchor='rm')
    size = 58
    while True:
        f = F(SANSB, size); lines = wrap(d, text, f, W - 140)
        if len(lines) * size * 1.45 <= 520 or size <= 38: break
        size -= 2
    y = 730
    for ln in lines:
        d.text((70, y), ln, font=f, fill=INK); y += int(size * 1.45)
    d.text((70, H - 60), HANDLE[lang], font=F(SANS, 30), fill=GREY, anchor='ls')
    d.text((W - 70, H - 60), SWIPE[lang], font=F(SANS, 30), fill=GREY, anchor='rs')
    return im


def save_slide(cover, lang):
    im = Image.new('RGB', (W, H), CREAM); im.paste(band(cover), (0, 0)); d = ImageDraw.Draw(im)
    big, small = SAVE[lang]
    y = 700
    for ln in big.split('\n'):
        f = F(SERIF, 76)
        while d.textlength(ln, font=f) > W - 140: f = F(SERIF, f.size - 2)
        d.text((W // 2, y), ln, font=f, fill=INK, anchor='mt'); y += int(f.size * 1.35)
    d.text((W // 2, y + 30), small, font=F(SANS, 40), fill=RED, anchor='mt')
    d.text((W // 2, H - 90), HANDLE[lang], font=F(SANSB, 38), fill=GREY, anchor='mt')
    return im


def build():
    posts = json.load(open(IG + 'w3/posts.json'))
    done = {}
    for p in posts:
        if p['type'] != 'POST' or p['date'] not in LABEL or p['lang'] not in LABEL[p['date']]: continue
        if p['lang'] == 'en' and p['time'] < '12': continue  # 英語の朝の豆知識は対象外
        bul = [BUL.sub('', l.strip()) for l in p['text'].split('\n') if BUL.match(l.strip())]
        if len(bul) < 3: print('skip', p['date'], p['lang'], len(bul)); continue
        cover = OUT + p['file']; names = [p['file']]
        for i, b in enumerate(bul, 1):
            nm = p['file'].replace('.jpg', f'-c{i}.jpg')
            slide(cover, p['lang'], LABEL[p['date']][p['lang']], i, len(bul), b).save(OUT + nm, quality=90); names.append(nm)
        nm = p['file'].replace('.jpg', '-csave.jpg'); save_slide(cover, p['lang']).save(OUT + nm, quality=90); names.append(nm)
        done[f"{p['date']}-{p['lang']}"] = names
        print(p['date'], p['lang'], len(names))
    json.dump(done, open(IG + 'w3/carousels.json', 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    build()
