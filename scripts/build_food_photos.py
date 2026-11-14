# data/food-photos.js を作る（写真のURLは Commons の規則で組み立てる）
import hashlib, json, os, sys, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
from food_photos_src import P
SMALL = set()  # 元画像が小さく縮小版がないもの
def url(name, w=250):
    n = name.replace(' ', '_'); h = hashlib.md5(n.encode('utf-8')).hexdigest(); q = urllib.parse.quote(n)
    base = 'https://upload.wikimedia.org/wikipedia/commons/'
    return base + f'{h[0]}/{h[:2]}/{q}' if n in SMALL else base + f'thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}'
out = {k: [url(f), 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(f.replace(' ', '_')), a, l] for k, (f, a, l) in P.items()}
root = os.path.join(os.path.dirname(__file__), '..')
with open(os.path.join(root, 'data/food-photos.js'), 'w', encoding='utf-8') as fp:
    fp.write('/* 自動生成：scripts/build_food_photos.py（元データ scripts/food_photos_src.py）\n   食べ物の名前 → [写真URL, 出典ページ, 撮影者, ライセンス]（Wikimedia Commons） */\n')
    fp.write('var FOOD_PHOTOS = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(out), 'photos')
