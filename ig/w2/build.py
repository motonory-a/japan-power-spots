# w2 (2026-11-23〜29) の画像・動画を作る。出力：ig/w2/out/ と posts.json（予約用）
import os, sys, json, re
sys.path.insert(0, '/home/claude/japan-power-spots/ig/fv2'); sys.path.insert(0, '/home/claude/japan-power-spots/ig/reels')
from PIL import Image, ImageDraw, ImageFont, ImageOps
import gen_feed as G
import content as C
IG = '/home/claude/japan-power-spots/ig/'; OUT = IG + 'w2/out/'; os.makedirs(OUT, exist_ok=True)
G.OUT = OUT; G.FULL = True
IDX = {'zh': 3, 'ko': 1}
def setfont(lang): G.F = (lambda i: (lambda p, s: ImageFont.truetype(p, s, index=i)))(IDX.get(lang, 0))

def meta(path):
    j = path[:-4] + '.json'
    if '/own/' in path or not os.path.exists(j): return None
    return json.load(open(j))
def credit_img(path):
    m = meta(path)
    if not m or m['license'] in ('CC0',) or 'Public domain' in m['license']: return None
    a = (m.get('artist') or '').strip()
    return f"Photo: {a[:40]} / {m['license']}" if a else f"Photo: Wikimedia Commons / {m['license']}"
def credit_cap(path):
    m = meta(path)
    if not m or m['license'] in ('CC0',) or 'Public domain' in m['license']: return ''
    a = (m.get('artist') or 'Wikimedia Commons').strip()
    return f"\n\n📷 {a} / {m['license']}, Wikimedia Commons"
def add_credit(text, path):
    cr = credit_cap(path)
    if not cr: return text
    parts = text.rsplit('\n\n', 1)  # クレジットはハッシュタグの前に
    return parts[0] + cr + '\n\n' + parts[1] if len(parts) == 2 and parts[1].startswith('#') else text + cr

HANDLE = {'en': '@japan_psj', 'zh': '@japan_psj_tw', 'ko': '@japan_psj_kr', 'fr': '@japan_psj_fr', 'es': '@japan_psj_es', 'jp': '@japan_psj_jp', 'st': '@nigihayahi03'}
FEED_T = {'en': '22:00', 'zh': '20:00', 'ko': '20:30', 'fr': '18:00', 'es': '18:30', 'jp': '21:30', 'st': '21:00'}
REEL_T = {'en': '20:30', 'zh': '18:30', 'ko': '19:00', 'fr': '16:30', 'es': '17:00', 'jp': '20:00', 'st': '19:30'}
BRAND = {'en': '8007581', 'zh': '8008367', 'ko': '8023628', 'fr': '8023857', 'es': '8050134', 'jp': '8050350', 'st': '7861854'}
posts = []
def add(lang, date, time, typ, file, text):
    posts.append({'lang': lang, 'brand': BRAND[lang], 'date': date, 'time': time, 'type': typ, 'file': file, 'text': text})

# ---------- フィード ----------
def feed():
    for day, date in C.DATES.items():
        for lang in C.LANGS:
            setfont(lang); src = C.PHOTO[day][lang]; cr = credit_img(src); fn = f'ps-{date}-{lang}.jpg'
            kw = {'fy': C.FY.get((day, lang), 0.5)}
            if day == 'thu':
                lab, t, sub = C.CARD['thu'][lang]
                G.steps(fn, src, lab, t, C.THU_STEPS[lang], credit=cr, ph=560, **kw)
            elif day == 'sun':
                lab, t, sub, chips, cta = C.PROMO[lang]
                G.promo(fn, src, lab, t, sub, chips, cta, credit=cr, **kw)
            else:
                lab, t, sub = C.CARD[day][lang]
                G.card(fn, src, lab, t, sub, credit=cr, **kw)
            add(lang, date, FEED_T[lang], 'POST', fn, add_credit(C.CAP[day][lang], src))
        # 天然石
        setfont('jp'); f, kw, lab, t, sub, cap, ai = C.STONES[day]
        G.card(f'st-{date}.jpg', IG + 'stones/' + f, lab, t, sub, brand='高次元ネゴシエイター アッキー', **kw)
        add('st', date, FEED_T['st'], 'POST', f'st-{date}.jpg', cap)

# ---------- 英語版の朝（am.py と同じ見た目） ----------
def am():
    SERIF = G.SERIF; SANS = G.SANSB; W, H = 1080, 1350; NAVY = (24, 40, 84); VERM = (214, 58, 40)
    for date, src, head, cap in C.AM:
        p = IG + 'src/' + src + '.jpg'
        im = G.cover(p, W, H).convert('RGBA'); ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
        od.rounded_rectangle((60, 60, W - 60, 400), radius=36, fill=(255, 255, 255, 222))
        od.rounded_rectangle((W // 2 - 230, H - 150, W // 2 + 230, H - 70), radius=40, fill=(24, 40, 84, 235))
        im = Image.alpha_composite(im, ov).convert('RGB'); d = ImageDraw.Draw(im)
        F = lambda pth, s: ImageFont.truetype(pth, s, index=0)
        d.text((W // 2, 95), 'JAPAN TRAVEL TIP', font=F(SANS, 30), fill=VERM, anchor='mt'); y = 150
        for ln in head.split('\n'):
            f = F(SERIF, 66)
            while d.textlength(ln, font=f) > 900: f = F(SERIF, f.size - 2)
            d.text((W // 2, y), ln, font=f, fill=NAVY, anchor='mt'); y += 96
        d.text((W // 2, H - 110), 'Answer in the caption ↓', font=F(SANS, 34), fill=(255, 255, 255), anchor='mm')
        cr = credit_img(p)
        if cr: d.text((W - 24, H - 20), cr, font=F(G.SANS, 18), fill=(255, 255, 255), anchor='rs', stroke_width=2, stroke_fill=(40, 40, 50))
        fn = f'am-{date}-en.jpg'; im.save(OUT + fn, quality=90)
        add('en', date, '08:00', 'POST', fn, cap + credit_cap(p) + C.AM_TAGS)

# ---------- ストーリーズ（gen2.py の部品を使う） ----------
src2 = open(IG + 'sx/gen2.py').read()
exec(src2[:src2.index('# tonight titles')])          # 部品（panel, chip, block, pill, handle, wrap, measure など）
exec(src2[src2.index('T={'):src2.index("SRC=IG+'src/'")])  # 各言語の定型文 T
OUT = IG + 'w2/out/'  # gen2 の部品が OUT を上書きするので戻す
W2Q = {  # 2026-11-19 本人指摘「ストーリーと写真は合うように」→ 二択の言葉を、上下の写真に写っているものそのものにする
 'jp': [('今日やるなら、どっち？', '明治神宮にお参り', 'あつあつのおでん'), ('行くなら、どっち？', '日光・白滝', '温泉街の夜'), ('行くなら、どっち？', '金沢・兼六園', '香嵐渓の紅葉')],
 'en': [('What would you do today?', 'Visit Meiji Jingu', 'Eat hot oden'), ('Where would you go?', 'Shirataki Falls', 'A hot spring bath'), ('Where would you go?', 'Kenrokuen, Kanazawa', 'Korankei maples')],
 'zh': [('今天想做哪一個？', '參拜明治神宮', '吃熱呼呼的關東煮'), ('你想去哪裡？', '鬼怒川溪谷', '溫泉鄉'), ('你想去哪裡？', '金澤・兼六園', '香嵐溪紅葉')],
 'ko': [('오늘 하나만 한다면?', '메이지진구 참배', '따끈한 오뎅'), ('어디로 갈래요?', '기누가와 계곡', '온천 마을'), ('어디로 갈래요?', '가나자와 겐로쿠엔', '고란케이 단풍')],
 'fr': [("Aujourd’hui, que feriez-vous ?", 'Visiter le Meiji-jingū', 'Manger un oden chaud'), ('Où iriez-vous ?', 'Kinugawa Onsen', 'Un village thermal'), ('Où iriez-vous ?', 'Le Kenroku-en à Kanazawa', 'Les érables de Kōrankei')],
 'es': [('¿Qué harías hoy?', 'Visitar Meiji-jingū', 'Comer oden caliente'), ('¿A dónde irías?', 'Kinugawa Onsen', 'Un baño termal'), ('¿A dónde irías?', 'Kenroku-en (Kanazawa)', 'Arces de Kōrankei')],
}
for _l in W2Q: T[_l]['q'] = W2Q[_l]
SPLAN = {'mon': 'pre', 'tue': 'q0', 'wed': 'pre', 'thu': 'q1', 'fri': 'pre', 'sat': 'q2', 'sun': 'guide'}
def story_pre(lang, day, title, bg):
    L = T[lang]; h = HANDLE[lang]; t = FEED_T[lang]
    im = cover(bg, W, H); d = ImageDraw.Draw(im); hf = F(SANS, 32); tf = F(SERIF, 50 if lang in ('jp', 'st', 'zh', 'ko') else 46); ff = F(SANSM, 30)
    hdr = L['pre'].format(t=t)
    ph = 44 + hf.size + 36 + 30 + measure(d, title, tf, 800) + 24 + ff.size * 1.4 + 40
    y0 = int(H - 300 - ph); im = panel(im, (110, y0, W - 110, y0 + ph)); d = ImageDraw.Draw(im)
    y = pill(d, y0 + 44, hdr, hf, bg=VERM) + 30
    y = block(d, y, title, tf, NAVY, 800) + 20
    d.text((W // 2, y), L['preF'] + (' ↓' if lang in ('jp', 'st') else ''), font=ff, fill=GOLD, anchor='mt')
    handle(d, h, 90); return im
def story_q(lang, i, ia, ib):
    L = T[lang]; h = HANDLE[lang]; q, a, b = L['q'][i]
    im = Image.new('RGB', (W, H), (255, 255, 255)); im.paste(cover(ia, W, H // 2 - 4), (0, 0)); im.paste(cover(ib, W, H // 2 - 4), (0, H // 2 + 4))
    qf = F(SERIF, 46); of = F(SANS, 40); ff = F(SANSM, 28)
    for txt, yb, tag in [(a, H // 2 - 150, 'A'), (b, H - 330, 'B')]:
        d = ImageDraw.Draw(im); t2 = tag + '  ' + txt; w = d.textlength(t2, font=of) + 72
        im = panel(im, (60, yb, 60 + int(w), yb + of.size + 40)); d = ImageDraw.Draw(im)
        d.text((96, yb + (of.size + 40) / 2), tag, font=of, fill=VERM, anchor='lm')
        d.text((96 + d.textlength(tag + '  ', font=of), yb + (of.size + 40) / 2), txt, font=of, fill=NAVY, anchor='lm')
    im, _ = chip(im, W // 2, H // 2 - 48, q, qf, NAVY)
    im, _ = chip(im, W // 2, H - 200, L['qF'], ff, NAVY, alpha=220, padx=28, pady=14)
    d = ImageDraw.Draw(im); handle(d, h, 90); return im
def story_guide(lang, bg):
    L = T[lang]; h = HANDLE[lang]
    im = cover(bg, W, H); d = ImageDraw.Draw(im); gf = F(SERIF, 50 if lang in ('jp', 'st', 'zh', 'ko') else 46)
    lines = []; [lines.extend(wrap(d, g, gf, 860)) for g in L['g']]
    ph = 44 + len(lines) * 68 + 16 + 40 + 30 + 80 + 40; y0 = H - 300 - ph
    im = panel(im, (110, y0, W - 110, y0 + ph)); d = ImageDraw.Draw(im); y = y0 + 44
    for ln in lines: d.text((W // 2, y), ln, font=gf, fill=NAVY, anchor='mt'); y += 68
    y += 16; d.text((W // 2, y), L['gS'], font=F(SANS, 32), fill=VERM, anchor='mt'); y += 62
    pill(d, y, L['gB'], F(SANS, 32), bg=VERM); handle(d, h, 90); return im
def story_stone(photo, q, foot):
    h = HANDLE['st']; im = cover(photo, W, H); d = ImageDraw.Draw(im); qf = F(SERIF, 50); ff = F(SANS, 30)
    qh = measure(d, q, qf, 800); im = panel(im, (110, 200, W - 110, 200 + qh + 70)); d = ImageDraw.Draw(im); block(d, 235, q, qf, NAVY, 800)
    fl = wrap(d, foot, ff, 800); fh = len(fl) * 44 + 40; yb = H - 200
    im = panel(im, (130, yb - fh, W - 130, yb)); d = ImageDraw.Draw(im); yy = yb - fh + 20
    for ln in fl: d.text((W // 2, yy), ln, font=ff, fill=VERM, anchor='mt'); yy += 44
    handle(d, h, 90); return im
STN = IG + 'stones/'
ST_STORY = {
 'mon': ('pre', 'lapis.jpg'), 'tue': ('quiz', 'tigereye.jpg', 'この茶色と金色の石、\n名前わかりますか？', '答えは今夜21:00の投稿で ↓'),
 'wed': ('pick', 'crystal-sea.jpg', '石の組み合わせ、\n迷ったことありませんか？', '今夜は「石の相性」のお話です ↓'),
 'thu': ('pre', 'rutile.jpg'), 'fri': ('quiz', 'black-rutile.jpg', '透明な中に黒い線。\nこの石の名前は？', '答えは今夜21:00の投稿で ↓'),
 'sat': ('pick', 'crystal-tray.jpg', 'その天然石、\n本物ですか？', '見分ける目安を、今夜お話しします ↓'), 'sun': ('guide',),
}
def stories():
    for day, date in C.DATES.items():
        kind = SPLAN[day]
        for lang in C.LANGS:
            setfont(lang)
            gF = lambda p, s, i=IDX.get(lang, 0): ImageFont.truetype(p, s, index=i)
            globals()['F'] = gF
            bg = C.PHOTO[day][lang]
            if kind == 'pre':
                title = C.CARD[day][lang][1].split('  ')[0] + '\n' + C.CARD[day][lang][2]
                if (day, lang) == ('wed', 'en'):  # アッキーが端で切れないよう、左寄りで縦に切り抜く
                    tmpbg = '/tmp/w2-wed-en-story.jpg'; Image.open(bg).crop((250, 0, 1100, 1512)).save(tmpbg, quality=95); bg = tmpbg
                im = story_pre(lang, day, title, bg)
            elif kind.startswith('q'):
                i = int(kind[1]); other = {'q0': 'mon', 'q1': 'wed', 'q2': 'fri'}[kind]
                im = story_q(lang, i, C.PHOTO[other][lang], bg)
            else:
                im = story_guide(lang, bg)
            fn = f'story-{date}-{lang}.jpg'; im.save(OUT + fn, quality=90); add(lang, date, '12:30', 'STORY', fn, '')
        globals()['F'] = lambda p, s: ImageFont.truetype(p, s, index=0)
        spec = ST_STORY[day]
        if spec[0] == 'pre':
            f, kw, lab, t, sub, cap, ai = C.STONES[day]
            im = story_pre('st', day, t + '\n' + sub, STN + spec[1])
        elif spec[0] in ('quiz', 'pick'): im = story_stone(STN + spec[1], spec[2], spec[3])
        else: im = story_guide('st', STN + 'crystal-rosegold.jpg')
        fn = f'story-{date}-st.jpg'; im.save(OUT + fn, quality=90); add('st', date, '12:30', 'STORY', fn, '')

if __name__ == '__main__':
    feed(); am(); stories()
    json.dump(posts, open(IG + 'w2/posts.json', 'w'), ensure_ascii=False, indent=1)
    print(len(posts), 'posts')
