# 2026-11-19 本人の依頼：11/20〜22 のストーリーズを言語ごとに別の写真で作り直す（英語版・@nigihayahi03 はそのまま）
import json
src = open('/home/claude/japan-power-spots/ig/sx/gen2.py').read().split('made=[]')[0]
exec(src)
S = IG + 'src/'
def who(n):
    d = json.load(open(S + n + '.json')); a = d['artist'].split(',')[0].strip()
    if a.startswith('This Photo was taken by'): a = 'Supanut Arunoprayote'
    return f"{a[:28]} / {d['license']}"
G20 = {'zh': 'r1-20-zh2', 'ko': 'r1-20-ko2', 'fr': 'r1-20-fr', 'es': 'r1-20-es', 'jp': 'r1-20-jp'}
P21 = {'zh': 'r1-21-zh4', 'ko': 'r1-21-ko2', 'fr': 'r1-21-fr', 'es': 'r1-21-es', 'jp': 'r1-21-jp'}
Q22 = {'zh': ('r1-22-zh', 'r1-21-zh4'), 'ko': ('r1-21-ko2', 'r1-22-ko'), 'fr': ('r1-21-fr', 'r1-22-fr'),
       'es': ('r1-21-es', 'r1-22-es-w'), 'jp': ('r1-21-jp', 'r1-22-jp3')}
OUTD = IG + 'sx/r1/'; os.makedirs(OUTD, exist_ok=True)
def credit(im, txt):
    d = ImageDraw.Draw(im); d.text((W - 30, H - 30), txt, font=F(SANSM, 20), fill=WHITE, anchor='rb', stroke_width=2, stroke_fill=(40, 40, 50)); return im
for lang in ['zh', 'ko', 'fr', 'es', 'jp']:
    # 11-20 guide: 背景をその言語の写真に
    L = T[lang]; h, _ = ACC[lang]
    im = cover(S + G20[lang] + '.jpg', W, H); d = ImageDraw.Draw(im)
    gf = F(SERIF, 50 if lang in ('jp', 'zh', 'ko') else 46)
    lines = []; [lines.extend(wrap(d, g, gf, 860)) for g in L['g']]
    ph = 44 + len(lines) * 68 + 16 + 40 + 30 + 80 + 40; y0 = H - 300 - ph
    im = panel(im, (110, y0, W - 110, y0 + ph)); d = ImageDraw.Draw(im); y = y0 + 44
    for ln in lines: d.text((W // 2, y), ln, font=gf, fill=NAVY, anchor='mt'); y += 68
    y += 16; d.text((W // 2, y), L['gS'], font=F(SANS, 32), fill=VERM, anchor='mt'); y += 62
    pill(d, y, L['gB'], F(SANS, 32), bg=VERM); handle(d, h, 90)
    credit(im, 'Photo: ' + who(G20[lang])).save(OUTD + f'story-11-20-{lang}.jpg', quality=90)
    # 11-21 pre: 今夜の投稿の予告、背景をその言語の写真に
    title, _ = tonight(lang, '11-21'); h, t = ACC[lang]
    im = cover(S + P21[lang] + '.jpg', W, H); d = ImageDraw.Draw(im)
    hf = F(SANS, 32); tf = F(SERIF, 50 if lang in ('jp', 'zh', 'ko') else 46); ff = F(SANSM, 30)
    hdr = L['pre'].format(t=t)
    ph = 44 + hf.size + 36 + 30 + measure(d, title, tf, 800) + 24 + ff.size * 1.4 + 40
    y0 = int(H - 300 - ph); im = panel(im, (110, y0, W - 110, y0 + ph)); d = ImageDraw.Draw(im)
    y = pill(d, y0 + 44, hdr, hf, bg=VERM) + 30
    y = block(d, y, title, tf, NAVY, 800) + 20
    d.text((W // 2, y), L['preF'] + ' ↓' if lang == 'jp' else L['preF'], font=ff, fill=GOLD, anchor='mt')
    handle(d, h, 90)
    credit(im, 'Photo: ' + who(P21[lang])).save(OUTD + f'story-11-21-{lang}.jpg', quality=90)
    # 11-22: 写真に合わせて q1（山か水辺か）に を、その言語の写真2枚で
    a, b = Q22[lang]
    QIMG[1] = (S + a + '.jpg', S + b + '.jpg', f'A: {who(a)}  B: {who(b)}')
    s_q(lang, 1).save(OUTD + f'story-11-22-{lang}.jpg', quality=90)
    print(lang, 'ok')
