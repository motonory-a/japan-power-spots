#!/usr/bin/env python3
# data/monzen.js を作る(元データ scripts/monzen_src.py・scripts/monzen_i18n.py、写真 ig/src/mz-*.json)
# 写真は monzen_src の photo='mz-…' のものを assets/img/edition/monzen/ に縮小して置く。
# hero(トップ案A)・live・langs は今の data/monzen.js から引き継ぐ。
import json, os, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from monzen_src import M, CHECKED
try:
    from monzen_i18n import TX
except ImportError:
    TX = {}
p = os.path.join(ROOT, 'data/monzen.js')
old = json.loads(open(p, encoding='utf-8').read().split('var MONZEN = ')[1].split(';\nif')[0]) if os.path.exists(p) else {}
photos = {}
out_dir = os.path.join(ROOT, 'assets/img/edition/monzen')
os.makedirs(out_dir, exist_ok=True)
items = []
for m in M:
    m = dict(m)
    ph = m.get('photo')
    if ph and ph.startswith('mz-'):
        info = json.load(open(os.path.join(ROOT, 'ig/src', ph + '.json'), encoding='utf-8'))
        base = os.path.join(out_dir, ph[3:])
        if not os.path.exists(base + '-480.jpg'):
            im = Image.open(os.path.join(ROOT, 'ig/src', ph + '.jpg')).convert('RGB')
            for w in (480, 960):
                x = im.copy(); x.thumbnail((w, w * 2))
                x.save(f'{base}-{w}.jpg', quality=82, optimize=True); x.save(f'{base}-{w}.webp', quality=80)
        photos[ph] = {'f': 'assets/img/edition/monzen/' + ph[3:], 'page': info['page'], 'artist': info['artist'][:60], 'license': info['license']}
    key = m['q'][0]
    if key in TX:
        m['t'] = TX[key]
    items.append(m)
for h in old.get('hero', []):
    f = h.get('food')
    if f and f not in photos and f in old.get('photos', {}):
        photos[f] = old['photos'][f]
d = {'checked': CHECKED, 'live': old.get('live', False), 'langs': old.get('langs', []), 'photos': photos, 'items': items, 'hero': old.get('hero', [])}
open(p, 'w', encoding='utf-8').write('/* 参拝のあとの一品(門前の名物)。自動生成:scripts/build_monzen.py(元 scripts/monzen_src.py・monzen_i18n.py)。店が今も売っていると確かめたものだけ。live:true の言語(英語+langs)の本番に出す */\nvar MONZEN = ' + json.dumps(d, ensure_ascii=False) + ';\nif (typeof module !== "undefined") module.exports = MONZEN;\n')
print(len(items), 'items,', len(photos), 'photos, langs', d['langs'])
