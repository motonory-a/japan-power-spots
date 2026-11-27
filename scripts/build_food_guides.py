# scripts/food_guides_src.py から 食の読みもの（gourmet-guide / gourmet-shrine）を6言語で作る
import os, sys, json, html
sys.path.insert(0, os.path.dirname(__file__))
from food_guides_src import PAGES, UI, LANGS
root = os.path.join(os.path.dirname(__file__), '..')
BASE = 'https://motonory-a.github.io/japan-power-spots/'
fp = open(os.path.join(root, 'data/food-photos.js'), encoding='utf-8').read()
P = json.loads(fp[fp.index('{'):fp.rindex('}') + 1])
from gourmet_src import G
from gourmet_i18n_zh import T as Tzh
from gourmet_i18n_ko import T as Tko
from gourmet_i18n_fr import T as Tfr
from gourmet_i18n_es import T as Tes
EN = {d[0]: d[1] for p in G for d in G[p]}
TR = {'zh': Tzh, 'ko': Tko, 'fr': Tfr, 'es': Tes}
HL = {'ja': 'ja', 'en': 'en', 'zh': 'zh-Hant', 'ko': 'ko', 'fr': 'fr', 'es': 'es'}
LOC = {'ja': 'ja_JP', 'en': 'en_US', 'zh': 'zh_TW', 'ko': 'ko_KR', 'fr': 'fr_FR', 'es': 'es_ES'}
LN = {'ja': '日本語', 'en': 'English', 'zh': '中文', 'ko': '한국어', 'fr': 'FR', 'es': 'ES'}
e = html.escape
def dish(name, lang):
    if lang == 'ja': return name
    t = TR.get(lang, {}).get(name)
    return t[0] if t and t[0] else EN[name]
def url(lang, page): return BASE + ('' if lang == 'ja' else lang + '/') + page + '.html'
for page, pg in PAGES.items():
    other = 'gourmet-shrine' if page == 'gourmet-guide' else 'gourmet-guide'
    for lang in LANGS:
        u = UI[lang]; title, desc, h1, lead = pg['meta'][lang]
        pre = '' if lang == 'ja' else '../'
        alt = ''.join(f'<link rel="alternate" hreflang="{HL[c]}" href="{url(c, page)}">\n' for c in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{url("en", page)}">\n'
        langs = ''.join(f'<a href="{("" if lang == "ja" else "../") + ("" if c == "ja" else c + "/") + page}.html" lang="{HL[c]}">{LN[c]}</a>' for c in LANGS if c != lang)
        first = P[pg['items'][0][0]][0].replace('/250px-', '/960px-')
        ld = {'@context': 'https://schema.org', '@type': 'Article', 'headline': h1, 'description': desc, 'inLanguage': HL[lang], 'url': url(lang, page),
              'dateModified': '2026-11-15', 'author': {'@type': 'Person', 'name': 'Akki'}, 'isPartOf': {'@type': 'WebSite', 'name': u['site'], 'url': BASE},
              'about': [t[lang][0] for _, t, _ in pg['items']]}
        out = [f'''<!DOCTYPE html>
<html lang="{HL[lang]}">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CX2WH9VGQ5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-CX2WH9VGQ5');</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}｜{e(u["site"])}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#C0392B">
<link rel="canonical" href="{url(lang, page)}">
{alt}<meta property="og:type" content="article">
<meta property="og:site_name" content="{e(u["site"])}">
<meta property="og:title" content="{e(h1)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url(lang, page)}">
<meta property="og:image" content="{first}">
<meta property="og:locale" content="{LOC[lang]}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{pre}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{pre}apple-touch-icon.png">
<link rel="preconnect" href="https://upload.wikimedia.org">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600;700&display=swap">
<link rel="stylesheet" href="{pre}assets/css/gourmet.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<link rel="manifest" href="{pre}manifest.webmanifest">
</head>
<body class="g-page fg-page">
<div class="g-head"><a href="gourmet.html">{e(u["back"])}</a><span class="g-langs">{langs}</span></div>
<header class="fg-hero" style="background-image:linear-gradient(180deg,rgba(40,20,10,.15),rgba(40,20,10,.72)),url('{first}')">
  <h1>{e(h1)}</h1>
  <p class="g-lead">{lead}</p>
</header>
<nav class="fg-toc">''']
        for n, (ph, t, links) in enumerate(pg['items'], 1):
            out.append(f'<a href="#s{n}"><b>{n}</b>{e(t[lang][0])}</a>')
        out.append('</nav>\n<main class="fg-main">')
        for n, (ph, t, links) in enumerate(pg['items'], 1):
            h, body = t[lang]
            p = P[ph]; img = p[0].replace('/250px-', '/500px-')
            out.append(f'''<section class="fg-item" id="s{n}">
  <a class="fg-photo" href="gourmet.html#d={e(ph)}"><img src="{img}" srcset="{p[0]} 250w, {img} 500w, {p[0].replace('/250px-', '/960px-')} 960w" sizes="(max-width:700px) 100vw, 46vw" alt="{e(dish(ph, lang))}" loading="{'eager' if n == 1 else 'lazy'}" decoding="async"><span>{e(dish(ph, lang))}</span></a>
  <div class="fg-text">
    <p class="fg-num">{n:02d}</p>
    <h2>{e(h)}</h2>
    <p>{e(body)}</p>''')
            if links:
                out.append('    <p class="fg-links">' + ''.join(f'<a href="gourmet.html#d={e(l)}">{e(dish(l, lang))} →</a>' for l in links) + '</p>')
            out.append(f'''    <p class="fg-credit">{u["credit"]}: {e(p[2] or "unknown")} / {e(p[3])} · <a href="{e(p[1])}" rel="noopener noreferrer">Wikimedia Commons</a></p>
  </div>
</section>''')
        out.append(f'''</main>
<aside class="fg-next">
  <p>{e(u["other"])}</p>
  <a class="fg-card" href="{other}.html">{e(u["shrine"] if other == "gourmet-shrine" else u["guide"])} →</a>
  <a class="fg-card" href="gourmet.html">{e(u["toGourmet"])} →</a>
</aside>
<footer class="g-foot">
  <p>{e(u["foot"])}</p>
  <p><a href="./">{e(u["site"])}</a> · {e(u["run"])}</p>
</footer>
<script src="{pre}assets/js/config.js"></script>
<script src="{pre}assets/js/analytics.js"></script>
<script src="{pre}assets/js/pwa.js" defer></script>
</body>
</html>
''')
        d = root if lang == 'ja' else os.path.join(root, lang)
        open(os.path.join(d, page + '.html'), 'w', encoding='utf-8').write('\n'.join(out))
    print(page, 'ok')
