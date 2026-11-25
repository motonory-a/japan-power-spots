# w4 ストーリーズ 7日 × 7アカウント(1080x1920、gen2 の方式:写真全面+白いカード)
import json, re, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

IG = '/home/claude/japan-power-spots/ig/'
O = IG + 'own/'; L = O + 'lib/'; SR = IG + 'w4/src/'; STL = IG + 'stones/lib/'
OUT = IG + 'w4/out/'
SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
SANSM = '/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
NAVY = (28, 36, 64); VERM = (214, 58, 40); WHITE = (255, 255, 255)
W, H = 1080, 1920
IDX = {'ko': 1, 'zh': 3}
LANG = 'jp'
HANDLE = {'jp': '@japan_psj_jp', 'st': '@nigihayahi03', 'en': '@japan_psj', 'zh': '@japan_psj_tw',
          'ko': '@japan_psj_kr', 'fr': '@japan_psj_fr', 'es': '@japan_psj_es'}
BRAND = {'en': 8007581, 'zh': 8008367, 'ko': 8023628, 'fr': 8023857, 'es': 8050134, 'jp': 8050350, 'st': 7861854}
RT = {'jp': '19:00', 'st': '19:30', 'zh': '19:00', 'ko': '19:00', 'en': '21:00', 'fr': '17:00', 'es': '17:00'}
CT = {'jp': '21:30', 'st': '21:00', 'zh': '20:00', 'ko': '20:30', 'en': '22:00', 'fr': '18:00', 'es': '18:30'}
PRE = {'jp': '今夜{t} 公開', 'st': '今夜{t} 公開', 'en': 'Tonight at {t} (JST)', 'zh': '今晚{t} 發布', 'ko': '오늘 밤 {t} 공개',
       'fr': 'Ce soir à {t} (heure du Japon)', 'es': 'Esta noche a las {t} (hora de Japón)'}
PREF = {'jp': '続きは今夜の投稿で ↓', 'st': '続きは今夜の投稿で ↓', 'en': 'Watch for it in your feed', 'zh': '記得來看動態',
        'ko': '피드에서 확인하세요', 'fr': 'À retrouver dans le fil', 'es': 'Búscalo en el feed'}
QF = {'jp': 'あなたに合う場所は、プロフィールのリンクの診断で', 'en': 'Find the place that matches you via the link in bio',
      'zh': '適合你的地方，點個人檔案連結來診斷', 'ko': '나와 맞는 곳은 프로필 링크에서 진단해 보세요',
      'fr': 'Trouvez votre lieu grâce au lien dans la bio', 'es': 'Descubre tu lugar con el enlace en la bio'}
G = {'jp': (['あなたに合うパワースポット、', '3ステップでわかります'], '無料・登録不要', 'プロフィールのリンクから'),
     'en': (['Find your power spot in Japan', 'in 3 easy steps'], 'Free · No sign-up', 'Link in bio'),
     'zh': (['適合你的能量景點', '3個步驟就知道'], '免費・免註冊', '點個人檔案的連結'),
     'ko': (['나와 맞는 파워스폿,', '3단계면 알 수 있어요'], '무료 · 가입 불필요', '프로필 링크에서'),
     'fr': (['Votre lieu sacré au Japon', 'en 3 étapes'], 'Gratuit · Sans inscription', 'Lien dans la bio'),
     'es': (['Tu lugar sagrado en Japón', 'en 3 pasos'], 'Gratis · Sin registro', 'Enlace en la bio'),
     'st': (['生年月日が知っている、', 'あなたの魂の秘密'], '魂の系統鑑定（無料）', 'プロフィールのリンクから')}


def F(p, s): return ImageFont.truetype(p, s, index=IDX.get(LANG, 0))


def cover(path, w, h, fx=0.5, fy=0.5):
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB'); s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = int((im.width - w) * fx); y = int((im.height - h) * fy); return im.crop((x, y, x + w, y + h))


def wrap(d, t, f, maxw):
    out = []
    for para in t.split('\n'):
        sp = ' ' in para; toks = para.split(' ') if sp else list(para); line = ''
        for tk in toks:
            test = (line + (' ' if sp and line else '') + tk) if line else tk
            if d.textlength(test, font=f) <= maxw: line = test
            else:
                if not sp and tk in '、。，？！）」' and line: line += tk; continue
                out.append(line); line = tk
        out.append(line)
    return out


def panel(im, box, alpha=236):
    x0, y0, x1, y1 = box
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 8, x1, y1 + 8), radius=28, fill=(0, 0, 0, 60))
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(ov).rounded_rectangle(box, radius=28, fill=(255, 255, 255, alpha))
    return Image.alpha_composite(Image.alpha_composite(im.convert('RGBA'), sh), ov).convert('RGB')


def handle(d, h, y=90): d.text((W // 2, y), h, font=F(SANSM, 28), fill=WHITE, anchor='mt', stroke_width=2, stroke_fill=(40, 40, 50))


def pill(d, y, t, f, bg=VERM):
    w = d.textlength(t, font=f) + 80; d.rounded_rectangle((W / 2 - w / 2, y, W / 2 + w / 2, y + f.size + 44), radius=(f.size + 44) // 2, fill=bg)
    d.text((W / 2, y + (f.size + 44) / 2), t, font=f, fill=WHITE, anchor='mm'); return y + f.size + 44


def s_pre(lang, bg, title, when, fx=0.5):
    global LANG; LANG = lang
    im = cover(bg, W, H, fx); d = ImageDraw.Draw(im)
    hf = F(SANS, 32); tf = F(SERIF, 52 if lang in ('jp', 'st', 'zh', 'ko') else 48); ff = F(SANSM, 30)
    ls = wrap(d, title, tf, 800); th = len(ls) * int(tf.size * 1.32)
    ph = 44 + hf.size + 44 + 30 + th + 24 + 42 + 40
    y0 = int(H - 300 - ph); im = panel(im, (110, y0, W - 110, y0 + ph)); d = ImageDraw.Draw(im)
    y = pill(d, y0 + 44, PRE[lang].format(t=when), hf) + 30
    for ln in ls: d.text((W // 2, y), ln, font=tf, fill=NAVY, anchor='mt'); y += int(tf.size * 1.32)
    d.text((W // 2, y + 20), PREF[lang], font=ff, fill=VERM, anchor='mt')
    handle(d, HANDLE[lang]); return im


def s_q(lang, q, a, ia, b, ib, afx=0.5, bfx=0.5):
    global LANG; LANG = lang
    im = Image.new('RGB', (W, H), WHITE); im.paste(cover(ia, W, H // 2 - 4, afx), (0, 0)); im.paste(cover(ib, W, H // 2 - 4, bfx), (0, H // 2 + 4))
    of = F(SANS, 40)
    for txt, yb, tag in [(a, H // 2 - 150, 'A'), (b, H - 330, 'B')]:
        d = ImageDraw.Draw(im); t2 = tag + '  ' + txt; w = d.textlength(t2, font=of) + 72
        im = panel(im, (60, yb, 60 + int(w), yb + of.size + 40)); d = ImageDraw.Draw(im)
        d.text((96, yb + (of.size + 40) / 2), tag, font=of, fill=VERM, anchor='lm')
        d.text((96 + d.textlength(tag + '  ', font=of), yb + (of.size + 40) / 2), txt, font=of, fill=NAVY, anchor='lm')
    d = ImageDraw.Draw(im); qf = F(SERIF, 48); w = d.textlength(q, font=qf) + 80
    im = panel(im, (int(W / 2 - w / 2), H // 2 - 50, int(W / 2 + w / 2), H // 2 + 46)); d = ImageDraw.Draw(im)
    d.text((W // 2, H // 2 - 2), q, font=qf, fill=NAVY, anchor='mm')
    ff = F(SANSM, 28); w = d.textlength(QF[lang], font=ff) + 56
    im = panel(im, (int(W / 2 - w / 2), H - 200, int(W / 2 + w / 2), H - 144), 220); d = ImageDraw.Draw(im)
    d.text((W // 2, H - 172), QF[lang], font=ff, fill=NAVY, anchor='mm')
    handle(d, HANDLE[lang]); return im


def s_guide(lang, bg, fx=0.5):
    global LANG; LANG = lang
    im = cover(bg, W, H, fx); d = ImageDraw.Draw(im); g, gs, gb = G[lang]
    gf = F(SERIF, 50 if lang in ('jp', 'st', 'zh', 'ko') else 46)
    lines = []; [lines.extend(wrap(d, x, gf, 860)) for x in g]
    ph = 44 + len(lines) * 68 + 16 + 62 + 80 + 40; y0 = H - 300 - ph
    im = panel(im, (110, y0, W - 110, y0 + ph)); d = ImageDraw.Draw(im); y = y0 + 44
    for ln in lines: d.text((W // 2, y), ln, font=gf, fill=NAVY, anchor='mt'); y += 68
    y += 16; d.text((W // 2, y), gs, font=F(SANS, 32), fill=VERM, anchor='mt'); y += 62
    pill(d, y, gb, F(SANS, 32)); handle(d, HANDLE[lang]); return im


Hn = lambda n: O + f'hotoku-ninomiya-{n:02d}.jpg'; I = lambda n: L + f'ise-dawn-{n}.jpg'; K = lambda n: L + f'hakone-{n}.jpg'
PD = lambda n: O + f'kashima-pond-0{n}.jpg'; Z = lambda n: L + f'izumo-{n}.jpg'
T = {  # 予告の題名
 'mon': {'jp': '二宮金次郎のお墓がある神社', 'st': '報徳二宮神社に\nお参りしてきました', 'en': 'Whose grave is at this Nikko shrine?',
         'zh': '有二宮金次郎之墓的神社', 'ko': '니노미야 긴지로의 묘가 있는 신사', 'fr': 'Quelle tombe se cache dans ce sanctuaire ?', 'es': '¿De quién es la tumba de este santuario?'},
 'tue_st': '天然石の豆知識 No.8\n新しく買った石に、\n最初にすること',
 'wed': {'jp': '朝5時の伊勢神宮', 'st': '水晶を、冬の空にかざしてみた', 'en': 'Ise Jingu at 5 a.m.', 'zh': '清晨5點的伊勢神宮',
         'ko': '새벽 5시의 이세 신궁', 'fr': 'Ise Jingū à 5 h du matin', 'es': 'Ise Jingu a las 5 de la mañana'},
 'thu': {'jp': '東国三社、知ってる？', 'st': '東国三社、行ったことある？', 'en': 'The Togoku Sansha: 3 shrines near Tokyo',
         'zh': '你聽過「東國三社」嗎？', 'ko': '‘도고쿠 산샤’ 아세요?', 'fr': 'Le Tōgoku Sansha : 3 sanctuaires près de Tokyo', 'es': 'El Togoku Sansha: 3 santuarios cerca de Tokio'},
 'fri': {'jp': '冬の箱根神社へ', 'st': '箱根神社にお参りしてきました', 'en': 'Hakone Shrine, under giant cedars',
         'zh': '冬天的箱根神社', 'ko': '하코네 신사', 'fr': 'Le sanctuaire de Hakone', 'es': 'El santuario de Hakone'},
 'sat': {'jp': '池の中に鳥居？\n鹿島神宮の御手洗池', 'st': '鹿島神宮の御手洗池', 'en': 'Izumo Taisha: clap 4 times, not 2',
         'zh': '出雲大社：參拜要拍手4次', 'ko': '이즈모타이샤: 박수는 4번', 'fr': 'Izumo Taisha : on frappe 4 fois', 'es': 'Izumo Taisha: se aplaude 4 veces'},
}
Q = {  # 火の二択(言葉=写っているもの)
 'jp': ('行くなら、どっち？', '伊勢神宮', I(6416), '箱根神社', K(9113)),
 'en': ('Which would you visit?', 'Ise Jingu', I(6379), 'Izumo Taisha', Z(1994)),
 'zh': ('想去哪一個？', '箱根神社', K(9114), '千葉神社', L + 'chiba-jinja-6695.jpg'),
 'ko': ('간다면 어디로?', '기비쓰히코 신사', L + 'kibitsuhiko-7297.jpg', '나리타산 신쇼지', L + 'naritasan-1184.jpg'),
 'fr': ('Vous iriez où ?', 'Sanctuaire de Hakone', K(9155), 'Kashima Jingū', PD(3)),
 'es': ('¿Cuál visitarías?', 'Narita-san Shinshoji', L + 'naritasan-1194.jpg', 'Ise Jingu', I(6412)),
}
BG = {
 'mon': {'jp': Hn(1), 'st': Hn(2), 'en': Hn(13), 'zh': Hn(14), 'ko': Hn(12), 'fr': Hn(3), 'es': Hn(4)},
 'wed': {'jp': I(6384), 'st': STL + 'IMG_8619.jpg', 'en': I(6416), 'zh': I(6412), 'ko': I(6383), 'fr': I(6410), 'es': I(6379)},
 'thu': {'jp': PD(4), 'st': O + 'ikisu-torii-back.jpg', 'en': PD(1), 'zh': PD(5), 'ko': PD(2), 'fr': PD(3), 'es': L + 'katori-kashima-1153.jpg'},
 'fri': {'jp': K(9155), 'st': K(9123), 'en': SR + 'hk-torii-forest.jpg', 'zh': K(9108), 'ko': K(9113), 'fr': K(9114), 'es': K(9116)},
 'sat': {'jp': PD(5), 'st': PD(4), 'en': SR + 'iz-haiden.jpg', 'zh': Z(1994), 'ko': Z(2036), 'fr': Z(1994), 'es': Z(2036)},
 'sun': {'jp': L + 'kibitsuhiko-7297.jpg', 'st': STL + 'IMG_8553.jpg', 'en': L + 'dogo-7138.jpg', 'zh': L + 'chiba-jinja-6698.jpg',
         'ko': L + 'tokushima-2025-8608.jpg', 'fr': L + 'kotohira-okusha-5821.jpg', 'es': L + 'red-torii-momiji-6996.jpg'},
}
FX = {('sat', 'fr'): 0.15, ('sat', 'es'): 0.8, ('fri', 'en'): 0.5, ('thu', 'es'): 0.5}
SUN_CAR = {'jp': '神社とお寺、見分けられる？', 'en': 'Shrine or temple? Can you tell?', 'zh': '神社和寺廟，分得出來嗎？',
           'ko': '신사와 절, 구별할 수 있나요?', 'fr': 'Sanctuaire ou temple ?', 'es': '¿Santuario o templo?'}
Q2 = {  # 日の二択(神社/お寺。今夜のカルーセルの予習)
 'jp': ('神社派？お寺派？', '神社', L + 'dogo-7154.jpg', 'お寺', L + 'naritasan-1184.jpg', 0.5, 0.85),
 'en': ('Shrines or temples?', 'Shrine', L + 'chiba-jinja-6698.jpg', 'Temple', L + 'tokushima-2025-8651.jpg', 0.5, 0.5),
 'zh': ('喜歡神社還是寺院？', '神社', L + 'kibitsuhiko-7280.jpg', '寺院', L + 'naritasan-1194.jpg', 0.5, 0.5),
 'ko': ('신사파? 절파?', '신사', L + 'red-torii-momiji-6996.jpg', '절', O + 'asakusa-nisonbutsu-night.jpg', 0.5, 0.5),
 'fr': ('Sanctuaires ou temples ?', 'Sanctuaire', O + 'hotoku-ninomiya-01.jpg', 'Temple', L + 'naritasan-1184.jpg', 0.5, 0.2),
 'es': ('¿Santuarios o templos?', 'Santuario', L + 'tokushima-2025-8608.jpg', 'Templo', L + 'tokushima-2025-8651.jpg', 0.5, 0.5),
}
LANGS = ['jp', 'st', 'en', 'zh', 'ko', 'fr', 'es']

if __name__ == '__main__':
    posts = []
    for day, key in [('12-07', 'mon'), ('12-08', 'tue'), ('12-09', 'wed'), ('12-10', 'thu'), ('12-11', 'fri'), ('12-12', 'sat'), ('12-13', 'sun')]:
        for lang in LANGS:
            if key == 'tue':
                im = s_pre('st', STL + 'IMG_8545.jpg', T['tue_st'], CT['st']) if lang == 'st' else s_q(lang, *Q[lang])
            elif key == 'sun':
                im = s_guide('st', BG['sun']['st']) if lang == 'st' else s_q(lang, *Q2[lang])
            else:
                when = CT[lang] if key == 'thu' else RT[lang]
                im = s_pre(lang, BG[key][lang], T[key][lang], when, FX.get((key, lang), 0.5))
            f = f's-{day}-{lang}.jpg'; im.save(OUT + f, quality=90)
            posts.append({'lang': lang, 'brand': BRAND[lang], 'date': day, 'time': '12:30', 'type': 'STORY', 'file': f, 'text': ''})
    json.dump(posts, open(IG + 'w4/stories.json', 'w'), ensure_ascii=False, indent=1)
    print(len(posts))
