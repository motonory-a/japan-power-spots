# data/stations.js を作る：駅名・緯度経度・路線（廃止された駅・路線は除く）
# 元データ：Seo-4d696b75/station_database（CC BY 4.0） https://github.com/Seo-4d696b75/station_database
# 使い方：python3 scripts/build_stations.py <station.csv> <line.csv> <register.csv>
import csv, json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from kana_romaji import station_en, line_en, kata2hira
st_csv, ln_csv, rg_csv = sys.argv[1:4]
lines = {r['code']: r for r in csv.DictReader(open(ln_csv, encoding='utf-8')) if r['closed'] == '0'}
reg = {}
for r in csv.DictReader(open(rg_csv, encoding='utf-8')):
    if r['line_code'] in lines: reg.setdefault(r['station_code'], []).append(r['line_code'])
st = [r for r in csv.DictReader(open(st_csv, encoding='utf-8')) if r['closed'] == '0' and r['code'] in reg]
def km(a, b, c, d):
    p = math.pi / 180; x = (d - b) * p * math.cos((a + c) / 2 * p); y = (c - a) * p
    return 6371 * math.hypot(x, y)
# 同じ名前で600m以内の駅（会社違いの同じ駅）はまとめる
groups = []
byname = {}
for r in st:
    lat, lon = float(r['lat']), float(r['lng'])
    g = next((g for g in byname.get(r['name'], []) if km(g['lat'], g['lon'], lat, lon) < 0.6), None)
    if g is None:
        g = {'name': r['name'], 'lat': lat, 'lon': lon, 'lines': [], 'kana': kata2hira(r['name_kana'] or '')}
        byname.setdefault(r['name'], []).append(g); groups.append(g)
    for lc in reg[r['code']]:
        if lc not in g['lines']: g['lines'].append(lc)
# 路線は駅の多い順（大きな路線を先に書く）
order = sorted({lc for g in groups for lc in g['lines']}, key=lambda c: -int(lines[c]['station_size'] or 0))
idx = {c: i for i, c in enumerate(order)}
out = {'l': [lines[c]['name'] for c in order],
       'le': [line_en(lines[c]['name_kana'] or '') for c in order],
       's': [[g['name'], round(g['lat'], 5), round(g['lon'], 5), sorted(idx[c] for c in g['lines']), g['kana'],
              station_en(g['name'], g['kana']) if g['kana'] else ''] for g in groups]}
root = os.path.join(os.path.dirname(__file__), '..')
with open(os.path.join(root, 'data/stations.js'), 'w', encoding='utf-8') as fp:
    fp.write('/* 自動生成：scripts/build_stations.py\n   駅データ：Seo-4d696b75/station_database（CC BY 4.0）。l=路線名、le=路線名（英語）、s=[駅名, 緯度, 経度, 路線番号, よみ, 英語表記] */\n')
    fp.write('var STATIONS = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(groups), 'stations', len(order), 'lines')
