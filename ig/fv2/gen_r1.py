# 2026-11-19 本人の依頼：11/20〜22 のフィードを言語ごとに別の写真で作り直す（英語版はそのまま）
import json
import gen_feed as G, gen_feed_i18n as I
from PIL import ImageFont
S = G.S
def cr(n):
    d = json.load(open(S + n + '.json'))
    a = d['artist'].split(',')[0].strip()
    if a.startswith('This Photo was taken by'): a = 'Supanut Arunoprayote'
    if len(a) > 40: a = a[:40]
    return f"Photo: {a} / {d['license']}"
PH = {
 '11-20': {'zh': 'r1-20-zh2', 'ko': 'r1-20-ko2', 'fr': 'r1-20-fr', 'es': 'r1-20-es', 'jp': 'r1-20-jp'},
 '11-21': {'zh': 'r1-21-zh4', 'ko': 'r1-21-ko2', 'fr': 'r1-21-fr', 'es': 'r1-21-es', 'jp': 'r1-21-jp'},
 '11-22': {'zh': 'r1-22-zh', 'ko': 'r1-22-ko', 'fr': 'r1-22-fr', 'es': 'r1-22-es3', 'jp': 'r1-22-jp3'},
}
JP = {'11-20': ('パワースポット・鎌倉', '鎌倉', '東京から1時間、秋の古都へ'),
      '11-21': ('パワースポット・富士山', '富士山と紅葉', '11月だけの、赤と白の絶景')}
JPPROMO = ('パワースポット鑑定', 'あなたのいま行くべき聖地は？', '鑑定は無料で、特別な登録もいりません', ['恋愛', '金運', '健康', '仕事'], 'プロフィールのリンクから')
IDX = {'zh': 3, 'ko': 1, 'fr': 0, 'es': 0, 'jp': 0}
for lang in ['zh', 'ko', 'fr', 'es', 'jp']:
    G.F = (lambda i: (lambda p, s: ImageFont.truetype(p, s, index=i)))(IDX[lang])
    for date in ['11-20', '11-21']:
        n = PH[date][lang]
        T = JP[date] if lang == 'jp' else I.DAYS[date][3][lang]
        G.card(f'ps-{date}-{lang}-r.jpg', S + n + '.jpg', *T, credit=cr(n))
    n = PH['11-22'][lang]
    lab, t, sub, chips, cta = JPPROMO if lang == 'jp' else I.PROMO[lang]
    G.promo(f'ps-11-22-{lang}-r.jpg', S + n + '.jpg', lab, t, sub, chips, cta, credit=cr(n))
    print(lang, 'ok')
