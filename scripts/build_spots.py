"""
OSM候補（candidates.jsonl.gz）から公開用のスポットデータを作る。

使い方:
  python3 scripts/build_spots.py candidates.jsonl.gz --target 10000
出力:
  data/spots-osm.js      … サイトが読み込むデータ（コンパクトな配列形式）
  data/manifest.json     … 件数・都道府県別件数・作成日時
  docs/DATA_REPORT.md    … 検査レポート（欠損・重複候補・除外理由など）

方針（docs/DATA_SPEC.md に詳しく記載）
  ・名前のないもの、立入禁止（access=private/no）は除外。
  ・同じ名前で近く（200m以内）にあるものは重複として1件にまとめる。
  ・知名度の目安（Wikidata/Wikipedia、文化財、社格を示す名称、面積など）で優先度を付け、
    種類ごとの枠（quota）を決めてから残りを優先度順に埋める。
  ・ご利益は、名称に含まれる祭神・信仰（稲荷・天満宮・八幡など）から一般的なものを「推定」として付ける。
"""
import argparse
import datetime
import gzip
import json
import math
import os
import re
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PREFS = ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県',
         '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県',
         '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県',
         '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
PREF_CODE = {p: '%02d' % (i + 1) for i, p in enumerate(PREFS)}

# 種類 → 最低限確保する件数（足りなければあるだけ）
QUOTA = {
    '神社': 4000, '寺院': 3000, '滝': 650, '山': 650, '湧水': 220, '温泉': 120,
    '巨木': 230, '岩・磐座': 100, '洞窟': 100, '絶景': 200, '湖': 80, '祠': 0,
}

# 合計（--total）での種類ごとの枠（上限）
QUOTA_TOTAL = {
    '神社': 46000, '寺院': 36000, '滝': 1300, '山': 5000, '湧水': 700, '温泉': 220,
    '巨木': 2700, '岩・磐座': 750, '洞窟': 200, '絶景': 2000, '湖': 500, '祠': 2500,
}

# 名称から推定するご利益（祭神・信仰の一般的なご利益）
NAME_WISHES = [
    (r'稲荷', ['商売繁盛', '金運']),
    (r'天満|天神|菅原', ['学業・合格']),
    (r'八幡', ['勝負運', '厄除け']),
    (r'金刀比羅|金比羅|金毘羅|琴平', ['交通安全', '商売繁盛']),
    (r'恵比[寿須]|戎|蛭子|えびす|ゑびす', ['商売繁盛']),
    (r'出雲|縁結び|恋', ['恋愛・縁結び']),
    (r'子安|安産|子授|産泰', ['安産・子宝']),
    (r'厄除|厄神|厄よけ', ['厄除け']),
    (r'不動', ['厄除け']),
    (r'弁天|弁財天|辯才天|厳島|嚴島', ['芸事上達', '金運']),
    (r'薬師', ['健康祈願']),
    (r'金(山|神社|運)|御金', ['金運']),
    (r'宝山|宝来|寶', ['金運']),
    (r'交通', ['交通安全']),
    (r'美(人|容|御前)', ['美容']),
]

# 祭神・本尊（Wikidata P825）から付けるご利益
DEITY_WISHES = [
    (r'稲荷|ウカノミタマ|宇迦之御魂|倉稲魂|豊宇気|豊受', ['商売繁盛', '金運']),
    (r'八幡|応神天皇|誉田別', ['勝負運', '厄除け']),
    (r'神功皇后', ['勝負運', '安産・子宝']),
    (r'素戔嗚|スサノオ|須佐之男|牛頭天王', ['厄除け']),
    (r'天照|大日孁', ['開運']),
    (r'大国主|大己貴|大穴牟遅', ['恋愛・縁結び']),
    (r'菅原道真|天満|天神', ['学業・合格']),
    (r'経津主|タケミカヅチ|武甕槌|建御雷|建御名方|日本武尊|ヤマトタケル', ['勝負運']),
    (r'熊野', ['開運']),
    (r'伊奘[冉諾]|伊邪那[岐美]|イザナ[ギミ]|菊理媛|ククリヒメ', ['恋愛・縁結び']),
    (r'大山咋|山王', ['厄除け']),
    (r'スクナビコナ|少彦名|少名毘古那|薬師', ['健康祈願']),
    (r'猿田彦|道祖神|塞の神', ['交通安全', '開運']),
    (r'住吉|筒男', ['交通安全']),
    (r'事代主|恵比[寿須]|蛭子|戎', ['商売繁盛']),
    (r'木花|コノハナ|鬼子母神|訶梨帝母', ['安産・子宝']),
    (r'市杵島|弁財天|弁才天|辯才天|宗像|厳島', ['芸事上達', '金運']),
    (r'金山彦|金山毘古', ['金運']),
    (r'不動明王', ['厄除け']),
    (r'毘沙門', ['勝負運', '金運']),
    (r'大黒天', ['金運', '商売繁盛']),
    (r'歓喜天|聖天|愛染', ['恋愛・縁結び']),
    (r'文殊|虚空蔵', ['学業・合格']),
]

# Wikidata の情報による加点
WD_TYPE_BONUS = [(r'一宮', 30), (r'官幣', 25), (r'国幣', 15), (r'式内社', 15), (r'勅願寺', 15), (r'総本山|大本山', 15)]
WD_HERITAGE_BONUS = [(r'世界遺産', 40), (r'国宝', 40), (r'重要文化財', 25), (r'特別史跡|特別名勝', 20), (r'史跡|名勝', 10), (r'登録有形', 5)]
WD_EXCLUDE_TYPES = re.compile(r'廃寺|合祀|廃社')

# 数秘ナンバーとの対応（暫定ルール。数秘の意味：1挑戦 2ご縁 3表現 4安定・内省 5変化・探究 6交流 7静寂・探究 8実行・目標 9感謝・広い視野）
TAG_NUMBERS = {
    '神社': [9, 1], '寺院': [7, 4], '霊山': [9, 1], '登山': [1], '滝': [5, 7], '浄化': [7], '自然': [9],
    '湖・湧水': [2], '温泉': [6], '御神木・巨木': [4, 7], '岩・磐座': [4, 8], '洞窟': [5, 7], '絶景': [9],
    '商売繁盛': [8], '金運': [8], '学業・合格': [7, 3], '勝負運': [1, 8], '厄除け': [4], '交通安全': [5],
    '恋愛・縁結び': [2, 6], '安産・子宝': [6], '芸事上達': [3], '健康祈願': [4], '美容': [3, 6],
}

ACCESS_EXCLUDE = {'private', 'no'}
JP_CHARS = re.compile(r'[\u3040-\u30ff\u3400-\u9fff]')
EXCLUDE_NAME = re.compile(r'(参集殿|社務所|手水舎|授与所|神楽殿|休憩所|駐車場|鳥居|参道|宝物殿|会館|教会|事務所|幼稚園|保育園|霊園|墓地|納骨|斎場|会堂|分教会|講社|社殿跡|陣地|壕|防空|扱所|講務|有毒|毒ガス|危険)')
GENERIC_NAMES = {'祠', 'ほこら', '地蔵', 'お地蔵様', 'お地蔵さん', '石仏', '社', '神社', '寺', '小祠', 'shrine', 'temple'}


# 日本語名の前後に付いた外国語（例：「Кошкин храм 今戸神社」）を外す（v3.15.1）
FOREIGN_EDGE = re.compile(r'^[^\u3040-\u30ff\u3400-\u9fffA-Za-z0-9]+\s+|\s+[^\u3040-\u30ff\u3400-\u9fffA-Za-z0-9（）()]+$')


def norm_name(t):
    n = (t.get('name:ja') or t.get('name') or '').strip()
    n = re.sub(r'\s+', ' ', n)
    if JP_CHARS.search(n):
        n = FOREIGN_EDGE.sub('', n).strip()
    return n


def classify(t, area):
    a, n, w = t.get('amenity'), t.get('natural'), t.get('waterway')
    if w == 'waterfall' or n == 'waterfall':
        return '滝'
    if n in ('peak', 'volcano'):
        return '山'
    if n == 'spring':
        return '温泉' if '温泉' in (t.get('name') or '') else '湧水'
    if n == 'hot_spring':
        return '温泉'
    if n == 'tree':
        return '巨木'
    if n in ('rock', 'stone'):
        return '岩・磐座'
    if n == 'cave_entrance':
        return '洞窟'
    if a == 'place_of_worship' or t.get('landuse') == 'religious' or t.get('building') in ('shrine', 'temple'):
        if t.get('religion') == 'shinto':
            return '神社'
        if t.get('religion') == 'buddhist':
            return '寺院'
    if t.get('historic') in ('shrine', 'wayside_shrine'):
        return '祠'
    if t.get('religion') == 'shinto' and t.get('wikidata'):
        return '神社'
    if t.get('religion') == 'buddhist' and t.get('wikidata'):
        return '寺院'
    if t.get('tourism') == 'viewpoint':
        return '絶景'
    if n == 'water':
        return '湖'
    return None


def priority(t, cat, name, area):
    s = 0
    if t.get('wikidata'):
        s += 50
    if t.get('wikipedia') or t.get('wikipedia:ja'):
        s += 35
    if t.get('heritage') or t.get('heritage:operator'):
        s += 25
    if t.get('denotation') == 'natural_monument':
        s += 30
    if t.get('website') or t.get('url') or t.get('contact:website'):
        s += 8
    if t.get('name:en'):
        s += 5
    if cat == '神社':
        if re.search(r'神宮|大社|総本宮|総本社', name):
            s += 70
        elif re.search(r'八幡宮|天満宮|東照宮|稲荷|宮$', name):
            s += 12
    if cat == '寺院' and re.search(r'総本山|大本山|本山|大寺|観音|不動尊|大師', name):
        s += 15
    if area:
        s += min(30, max(0, math.log10(max(area, 1)) * 6 - 12))   # 1,000㎡で約6点、100,000㎡で約18点
    if cat == '山':
        try:
            s += min(20, float(str(t.get('ele', '0')).split(';')[0]) / 150)
        except ValueError:
            pass
    if name in GENERIC_NAMES or len(name) <= 1:
        s -= 100
    return round(s, 1)


def haversine_m(a, b):
    r = math.pi / 180
    dlat, dlon = (b[0] - a[0]) * r, (b[1] - a[1]) * r
    x = math.sin(dlat / 2) ** 2 + math.cos(a[0] * r) * math.cos(b[0] * r) * math.sin(dlon / 2) ** 2
    return 6371000 * 2 * math.atan2(math.sqrt(x), math.sqrt(1 - x))


def wd_bonus(w):
    if not w:
        return 0
    b = min(60, w.get('sitelinks', 0) * 4)
    types = ' '.join(w.get('types', []))
    for pat, pt in WD_TYPE_BONUS:
        if re.search(pat, types):
            b += pt
    her = ' '.join(w.get('heritage', []))
    hb = 0
    for pat, pt in WD_HERITAGE_BONUS:
        if re.search(pat, her):
            hb = max(hb, pt)
    return b + hb


def best_heritage(w):
    her = (w or {}).get('heritage', [])
    for pat in ('世界遺産', '国宝', '重要文化財', '特別史跡', '特別名勝', '史跡', '名勝', '登録有形'):
        for h in her:
            if pat in h:
                return h
    return ''


def wishes_for(cat, name, t, near_shrine_peak, deities=()):
    obj, inferred = [], []
    base = {'神社': ['神社'], '寺院': ['寺院'], '滝': ['滝', '自然', '浄化'], '山': ['登山', '自然'], '湧水': ['湖・湧水', '自然', '浄化'],
            '温泉': ['温泉'], '巨木': ['御神木・巨木', '自然'], '岩・磐座': ['岩・磐座', '自然'], '洞窟': ['洞窟', '自然'],
            '絶景': ['絶景'], '湖': ['湖・湧水', '自然'], '祠': ['神社']}
    obj += base.get(cat, [])
    if cat == '山' and near_shrine_peak:
        obj.append('霊山')
    if cat in ('神社', '寺院'):
        for d in deities:
            for pat, ws in DEITY_WISHES:
                if re.search(pat, d):
                    for w in ws:
                        if w not in inferred:
                            inferred.append(w)
        for pat, ws in NAME_WISHES:
            if re.search(pat, name):
                for w in ws:
                    if w not in inferred:
                        inferred.append(w)
    return obj, inferred


def load_bigtrees(path, rep):
    """環境省 巨樹・巨木林調査（第6回）から候補を作る。名前のある木・天然記念物・幹周の大きい木を優先"""
    out, best_at = [], {}
    with gzip.open(path, 'rt', encoding='utf-8') as f:
        for line in f:
            r = json.loads(line)
            if r.get('type') != 'POINT':
                continue
            a = r['attr']
            lat, lon = float(a.get('緯度') or r['y']), float(a.get('経度') or r['x'])
            if not (20 < lat < 46 and 122 < lon < 154):
                continue
            name = (a.get('名称') or '').strip()
            sp = (a.get('樹種') or '').strip()
            try:
                girth = float(a.get('樹幹') or 0)
            except ValueError:
                girth = 0
            try:
                height = float(a.get('樹高') or 0)
            except ValueError:
                height = 0
            hogo = a.get('保護単木') or ''
            level = 3 if ('天然記念物' in hogo and '（国）' in hogo) else (2 if ('天然記念物' in hogo and '都道府県' in hogo) else (1 if '天然記念物' in hogo else 0))
            if not (name or level or girth >= 600):
                rep['bigtree_skip_minor'] += 1
                continue
            if name and (not JP_CHARS.search(name) or EXCLUDE_NAME.search(name)):
                name = ''
            prio = 25 + min(30, girth / 100 * 3) + [0, 10, 20, 35][level] + (10 if name else 0)
            rec = {'name': name, 'species': sp, 'girth': girth, 'height': height, 'level': level, 'lat': lat, 'lon': lon,
                   'muni_old': (a.get('市町村名') or '').replace(a.get('都道府県名') or a.get('県名') or '', ''),
                   'pref_code': r.get('pref_code'), 'prio': prio, 'id': str(int(float(a.get('連番') or a.get('ID') or 0)))}
            if not name:
                # 名前のない木は、同じ地点のうち最も大きい1本だけ
                key = (round(lat, 4), round(lon, 4))
                cur = best_at.get(key)
                if cur is None or girth > cur['girth']:
                    best_at[key] = rec
                continue
            out.append(rec)
    out += list(best_at.values())
    rep['bigtree_candidates'] = len(out)
    return out


def numbers_for(tags):
    out = []
    for tg in tags:
        for n in TAG_NUMBERS.get(tg, []):
            if n not in out:
                out.append(n)
    return out[:3] or [9]


class Grid:
    """近くの点を探すための簡易グリッド（約1km四方）"""
    def __init__(self):
        self.cells = defaultdict(list)

    @staticmethod
    def key(lat, lon):
        return (int(lat * 100), int(lon * 100))

    def add(self, item):
        self.cells[self.key(item['lat'], item['lon'])].append(item)

    def near(self, lat, lon):
        k = self.key(lat, lon)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                yield from self.cells.get((k[0] + dy, k[1] + dx), [])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('candidates')
    ap.add_argument('--target', type=int, default=10000, help='中心データ（最初に読み込む）の件数')
    ap.add_argument('--total', type=int, default=0, help='追加分を含めた合計件数（0なら追加なし）')
    ap.add_argument('--extra-parts', type=int, default=4)
    ap.add_argument('--wikidata', default='', help='wikidata.jsonl.gz（scripts/wikidata_fetch.py の出力）')
    ap.add_argument('--bigtrees', default='', help='bigtrees.jsonl.gz（scripts/bigtree_fetch.py の出力）')
    ap.add_argument('--extracted-at', default='')
    args = ap.parse_args()

    rep = Counter()
    raw = []
    area_ids = set()
    with gzip.open(args.candidates, 'rt', encoding='utf-8') as f:
        for line in f:
            o = json.loads(line)['osm']
            if o.startswith('a'):
                area_ids.add(int(o[1:]))
    with gzip.open(args.candidates, 'rt', encoding='utf-8') as f:
        for line in f:
            r = json.loads(line)
            if r['osm'].startswith('w') and int(r['osm'][1:]) * 2 in area_ids:
                rep['skip:outline_of_area'] += 1
                continue
            t = r['tags']
            rep['candidates'] += 1
            name = norm_name(t)
            cat = classify(t, r.get('area', 0))
            if not cat:
                rep['skip:no_category'] += 1
                continue
            if not name:
                rep['skip:no_name'] += 1
                continue
            if not JP_CHARS.search(name):
                rep['skip:no_japanese_name'] += 1
                continue
            if EXCLUDE_NAME.search(name) or ';' in name or name.count('\u3000') >= 2:
                rep['skip:facility_or_mixed_name'] += 1
                continue
            if t.get('access') in ACCESS_EXCLUDE:
                rep['skip:access'] += 1
                continue
            if r['pref'] not in PREF_CODE:
                rep['skip:outside_prefecture'] += 1
                continue
            raw.append({
                'osm': r['osm'], 'name': name, 'cat': cat, 'lat': r['lat'], 'lon': r['lon'], 'pref': r['pref'],
                'muni': r.get('muni', ''), 'area': r.get('area', 0), 'tags': t,
                'prio': priority(t, cat, name, r.get('area', 0)),
            })
    rep['usable_osm'] = len(raw)

    # ---------- Wikidata を重ねる ----------
    wd = {}
    if args.wikidata:
        with gzip.open(args.wikidata, 'rt', encoding='utf-8') as f:
            for line in f:
                w = json.loads(line)
                wd[w['qid']] = w
    used_q = set()
    kept = []
    for it in raw:
        q = it['tags'].get('wikidata')
        w = wd.get(q) if q else None
        if w and WD_EXCLUDE_TYPES.search(' '.join(w.get('types', []))):
            rep['skip:wikidata_abolished'] += 1
            continue
        it['wd'] = w
        if w:
            used_q.add(q)
            it['prio'] += wd_bonus(w)
        kept.append(it)
    raw = kept
    if wd:
        # 名前と位置で突き合わせ（1km以内・同じ種類）
        g_raw = Grid()
        for it in raw:
            g_raw.add(it)
        coarse = defaultdict(list)  # 都道府県の判定用（約10km四方）
        for it in raw:
            coarse[(int(it['lat'] * 10), int(it['lon'] * 10))].append(it)
        added = 0
        for q, w in wd.items():
            if q in used_q or not w.get('label') or WD_EXCLUDE_TYPES.search(' '.join(w.get('types', []))):
                continue
            cat = '神社' if w['kind'] == 'shrine' else '寺院'
            lab = w['label']
            hit = None
            for o in g_raw.near(w['lat'], w['lon']):
                if o['cat'] != cat or o.get('wd'):
                    continue
                if (o['name'] == lab or (len(lab) >= 3 and (lab in o['name'] or o['name'] in lab))) and \
                        haversine_m((o['lat'], o['lon']), (w['lat'], w['lon'])) < 1000:
                    hit = o
                    break
            if hit:
                hit['wd'] = w
                hit['tags']['wikidata'] = q
                hit['prio'] += 50 + wd_bonus(w)
                used_q.add(q)
                rep['wikidata_matched_by_name'] += 1
                continue
            if not JP_CHARS.search(lab) or EXCLUDE_NAME.search(lab):
                continue
            # OSMにないもの：近くのOSM候補から都道府県・市区町村を借りる
            near, best = None, 1e9
            k = (int(w['lat'] * 10), int(w['lon'] * 10))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    for o in coarse.get((k[0] + dy, k[1] + dx), []):
                        d = haversine_m((o['lat'], o['lon']), (w['lat'], w['lon']))
                        if d < best:
                            near, best = o, d
            if not near or best > 15000:
                rep['skip:wikidata_no_prefecture'] += 1
                continue
            tags = {'name': lab, 'wikidata': q, 'religion': 'shinto' if cat == '神社' else 'buddhist'}
            raw.append({'osm': 'wd:' + q, 'name': lab, 'cat': cat, 'lat': w['lat'], 'lon': w['lon'], 'pref': near['pref'],
                        'muni': near['muni'] if best < 3000 else '', 'area': 0, 'tags': tags, 'wd': w,
                        'prio': priority(tags, cat, lab, 0) + wd_bonus(w)})
            added += 1
        rep['wikidata_items'] = len(wd)
        rep['wikidata_matched_by_id'] = len([1 for it in raw if it.get('wd') and not it['osm'].startswith('wd:')]) - rep['wikidata_matched_by_name']
        rep['wikidata_added_not_in_osm'] = added
    rep['usable'] = len(raw)

    # 重複：同じ名前・200m以内 → 優先度の高い方（面積の大きい方）を残す
    raw.sort(key=lambda x: (-x['prio'], -x['area']))
    grid, uniq, by_wd = Grid(), [], {}
    for it in raw:
        dup = None
        wd = it['tags'].get('wikidata')
        if wd and wd in by_wd:
            dup = by_wd[wd]
        if not dup:
            for o in grid.near(it['lat'], it['lon']):
                if o['name'] == it['name'] and haversine_m((o['lat'], o['lon']), (it['lat'], it['lon'])) < 1000:
                    dup = o
                    break
        if dup:
            rep['merged_duplicates'] += 1
            for k in ('wikidata', 'wikipedia', 'wikipedia:ja', 'heritage', 'website'):
                if k in it['tags'] and k not in dup['tags']:
                    dup['tags'][k] = it['tags'][k]
            if it.get('wd') and not dup.get('wd'):
                dup['wd'] = it['wd']
            continue
        grid.add(it)
        uniq.append(it)
        if wd:
            by_wd[wd] = it

    # 霊山：山頂から500m以内に神社がある山
    shrine_grid = Grid()
    for it in uniq:
        if it['cat'] == '神社':
            shrine_grid.add(it)

    def near_shrine(it):
        return any(haversine_m((s['lat'], s['lon']), (it['lat'], it['lon'])) < 500 for s in shrine_grid.near(it['lat'], it['lon']))

    # 選定：種類ごとの枠 → 残りを優先度順
    by_cat = defaultdict(list)
    for it in uniq:
        by_cat[it['cat']].append(it)
    chosen, chosen_ids = [], set()
    for cat, q in QUOTA.items():
        for it in by_cat.get(cat, [])[:q]:
            chosen.append(it)
            chosen_ids.add(it['osm'])
    FILL_CATS = {'神社', '寺院', '滝', '巨木', '岩・磐座', '洞窟', '湧水'}
    rest = [it for it in uniq if it['osm'] not in chosen_ids and it['cat'] in FILL_CATS]
    for it in rest:
        if len(chosen) >= args.target:
            break
        chosen.append(it)
        chosen_ids.add(it['osm'])
    chosen = chosen[:args.target]

    # 都道府県ごとに偏りすぎないよう、最低30件は確保（入れ替え）
    pref_count = Counter(it['pref'] for it in chosen)
    for p in PREFS:
        need = 30 - pref_count[p]
        if need > 0:
            extra = [it for it in uniq if it['pref'] == p and it['osm'] not in chosen_ids][:need]
            chosen.sort(key=lambda x: x['prio'])
            removed = 0
            for e in extra:
                for i, c in enumerate(chosen):
                    if pref_count[c['pref']] > 200:
                        pref_count[c['pref']] -= 1
                        chosen_ids.discard(c['osm'])
                        chosen.pop(i)
                        removed += 1
                        break
                chosen.append(e)
                chosen_ids.add(e['osm'])
                pref_count[p] += 1
            rep['pref_rebalanced'] += len(extra)

    for it in chosen:
        it['tier'] = 1

    # 追加分（2段目）：中心に入らなかったものから、種類ごとの枠まで優先度順に
    if args.total > len(chosen):
        core_count = Counter(it['cat'] for it in chosen)
        extra = []
        remain = [it for it in uniq if it['osm'] not in chosen_ids]
        rem_by_cat = defaultdict(list)
        for it in remain:
            rem_by_cat[it['cat']].append(it)
        for cat, q in QUOTA_TOTAL.items():
            need = max(0, q - core_count[cat])
            extra += rem_by_cat.get(cat, [])[:need]
        extra.sort(key=lambda x: -x['prio'])
        extra = extra[:args.total - len(chosen)]
        if len(chosen) + len(extra) < args.total:
            taken = set(it['osm'] for it in extra)
            for it in remain:
                if len(chosen) + len(extra) >= args.total:
                    break
                if it['osm'] not in taken and it['cat'] in FILL_CATS:
                    extra.append(it)
        for it in extra:
            it['tier'] = 2
            chosen_ids.add(it['osm'])
        rep['extra_selected'] = len(extra)
        chosen = chosen + extra

    # 巨樹・巨木林調査の木を、合計件数の残り枠まで追加（OSMの巨木と150m以内は重複として除く）
    if args.bigtrees and args.total > len(chosen):
        trees = load_bigtrees(args.bigtrees, rep)
        tg = Grid()
        for it in chosen:
            if it['cat'] == '巨木':
                tg.add(it)
        code2pref = {v: k for k, v in PREF_CODE.items()}
        ref = Grid()
        for it in uniq:
            ref.add(it)
        trees.sort(key=lambda x: -x['prio'])
        room = args.total - len(chosen)
        added = 0
        for t in trees:
            if added >= room:
                break
            if any(haversine_m((o['lat'], o['lon']), (t['lat'], t['lon'])) < 150 for o in tg.near(t['lat'], t['lon'])):
                rep['bigtree_dup_osm'] += 1
                continue
            pref = code2pref.get(t['pref_code'])
            if not pref:
                continue
            # 市区町村は近くの現在の候補から（合併前の名前が残っているため）
            near, bd = None, 1e9
            for o in ref.near(t['lat'], t['lon']):
                d = haversine_m((o['lat'], o['lon']), (t['lat'], t['lon']))
                if d < bd:
                    near, bd = o, d
            muni = near['muni'] if near and bd < 3000 and near['pref'] == pref else re.sub(r'^.*郡', '', t['muni_old'])
            nm = t['name'] or (muni + 'の' + (t['species'] or '巨木'))
            if any(o['name'] == nm and haversine_m((o['lat'], o['lon']), (t['lat'], t['lon'])) < 1000
                   for o in list(tg.near(t['lat'], t['lon'])) + list(ref.near(t['lat'], t['lon']))):
                rep['bigtree_dup_name'] += 1
                continue
            it = {'osm': 'bt:' + t['pref_code'] + '-' + t['id'], 'name': nm, 'cat': '巨木', 'lat': t['lat'], 'lon': t['lon'],
                  'pref': pref, 'muni': muni, 'area': 0, 'tags': {'name': nm, 'natural': 'tree'}, 'prio': t['prio'], 'tier': 2,
                  'bt': t}
            chosen.append(it)
            tg.add(it)
            added += 1
        rep['bigtree_added'] = added

    # 親子関係：大きな境内（多角形）の中にある小さな神社・寺院
    polys = [it for it in chosen if it['area'] > 2000 and it['cat'] in ('神社', '寺院')]
    pg = Grid()
    for it in polys:
        pg.add(it)
    for it in chosen:
        it['parent'] = None
        if it['cat'] not in ('神社', '寺院', '祠', '巨木', '岩・磐座', '湧水'):
            continue
        best = None
        for p in pg.near(it['lat'], it['lon']):
            if p is it or p['area'] <= it['area']:
                continue
            radius = math.sqrt(p['area'] / math.pi)
            if haversine_m((p['lat'], p['lon']), (it['lat'], it['lon'])) < radius * 0.8:
                if not best or p['area'] < best['area']:
                    best = p
        if best:
            it['parent'] = best['osm']
            rep['children'] += 1

    # 出力
    chosen.sort(key=lambda x: (PREF_CODE[x['pref']], -x['prio']))
    def osm_id(o):
        # osmium の面ID（a）を元の way / relation のIDに戻す。Wikidataだけのものは wd:Q...、巨樹調査は bt:都道府県-番号 のまま
        if o.startswith('a'):
            n = int(o[1:])
            return ('w%d' % (n // 2)) if n % 2 == 0 else ('r%d' % ((n - 1) // 2))
        return o

    idmap = {it['osm']: osm_id(it['osm']) for it in chosen}
    rows = []
    cat_count, wish_count, pref_out = Counter(), Counter(), Counter()
    for it in chosen:
        t = it['tags']
        w = it.get('wd') or {}
        bt = it.get('bt')
        if bt:
            w = {'deities': [], 'heritage': [['', '天然記念物（市町村）', '天然記念物（都道府県）', '天然記念物（国）'][bt['level']]] if bt['level'] else [],
                 'sitelinks': 0}
        obj, inferred = wishes_for(it['cat'], it['name'], t, it['cat'] == '山' and near_shrine(it), w.get('deities', []))
        nums = numbers_for(obj + inferred)
        wiki = t.get('wikipedia:ja') or t.get('wikipedia') or ''
        rows.append([
            idmap[it['osm']], it['name'], it['cat'], PREF_CODE[it['pref']], it['muni'],
            round(it['lat'], 5), round(it['lon'], 5),
            '|'.join(obj), '|'.join(inferred), ''.join(str(n) for n in nums),
            wiki, t.get('wikidata', ''), idmap.get(it['parent'], '') if it['parent'] else '', round(it['prio']),
            '|'.join([d for d in w.get('deities', []) if JP_CHARS.search(d)][:4]), best_heritage(w) or ((w.get('heritage') or [''])[0] if bt else ''), w.get('sitelinks', 0),
            ('%s|%g|%g' % (bt['species'], bt['girth'], bt['height'])) if bt else '',
        ])
        cat_count[it['cat']] += 1
        pref_out[it['pref']] += 1
        for w in obj + inferred:
            wish_count[w] += 1

    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')
    header = ('/* 全国スポットデータ（自動生成：scripts/build_spots.py）\n'
              ' * 出典：© OpenStreetMap contributors（ODbL 1.0）https://www.openstreetmap.org/copyright\n'
              ' * 列：osm, 名称, 種類, 都道府県コード, 市区町村, 緯度, 経度, 体験・種類タグ, 名称から推定したご利益,\n'
              ' *     数秘(暫定), Wikipedia, Wikidata, 親スポットのosm, 優先度, 祭神・本尊, 文化財, Wikipedia言語版数, 巨樹（樹種|幹周cm|樹高m）\n'
              ' * 祭神・文化財は Wikidata（CC0）から。巨樹は環境省生物多様性センター 自然環境保全基礎調査 巨樹・巨木林調査（政府標準利用規約）を加工\n */\n')
    core_rows = [r for r, it in zip(rows, chosen) if it['tier'] == 1]
    extra_rows = [r for r, it in zip(rows, chosen) if it['tier'] == 2]
    parts = []
    if extra_rows:
        n = args.extra_parts
        size = (len(extra_rows) + n - 1) // n
        parts = [extra_rows[i:i + size] for i in range(0, len(extra_rows), size)]
    meta = {'count': len(core_rows), 'total': len(rows), 'built': now, 'extracted': args.extracted_at,
            'extraParts': ['data/extra/spots-extra-%d.js' % (i + 1) for i in range(len(parts))]}
    with open(os.path.join(ROOT, 'data', 'spots-osm.js'), 'w', encoding='utf-8') as f:
        f.write(header)
        f.write('var SPOTS_OSM_META = ' + json.dumps(meta, ensure_ascii=False) + ';\n')
        f.write('var SPOTS_OSM = [\n')
        f.write(',\n'.join(json.dumps(r, ensure_ascii=False, separators=(',', ':')) for r in core_rows))
        f.write('\n];\nif (typeof module !== "undefined") module.exports = { SPOTS_OSM: SPOTS_OSM, SPOTS_OSM_META: SPOTS_OSM_META };\n')
    extra_dir = os.path.join(ROOT, 'data', 'extra')
    os.makedirs(extra_dir, exist_ok=True)
    for fn in os.listdir(extra_dir):
        if fn.startswith('spots-extra-'):
            os.remove(os.path.join(extra_dir, fn))
    for i, part in enumerate(parts):
        with open(os.path.join(extra_dir, 'spots-extra-%d.js' % (i + 1)), 'w', encoding='utf-8') as f:
            f.write('/* 全国スポットデータ 追加分 %d/%d（自動生成）© OpenStreetMap contributors（ODbL 1.0）。列は data/spots-osm.js と同じ */\n' % (i + 1, len(parts)))
            f.write('(function (rows) {\n  if (typeof module !== "undefined" && module.exports) module.exports = rows;\n'
                    '  else if (typeof window !== "undefined" && window.SpotData) window.SpotData.addRows(rows);\n})([\n')
            f.write(',\n'.join(json.dumps(r, ensure_ascii=False, separators=(',', ':')) for r in part))
            f.write('\n]);\n')

    manifest = {'count': len(rows), 'core': len(core_rows), 'extra': len(extra_rows), 'built': now, 'osm_extracted_at': args.extracted_at, 'license': 'ODbL 1.0 (© OpenStreetMap contributors)',
                'by_category': dict(cat_count.most_common()), 'by_prefecture': {p: pref_out[p] for p in PREFS}}
    with open(os.path.join(ROOT, 'data', 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)

    lines = ['# 全国スポットデータ 検査レポート', '', '作成日：' + now + '　OSM抽出日時：' + (args.extracted_at or '不明'), '',
             '## 件数', '', '| 項目 | 件数 |', '|---|---|']
    for k, v in sorted(rep.items()):
        lines.append('| %s | %s |' % (k, v))
    lines += ['| 公開件数（合計） | %d |' % len(rows), '| うち最初に読み込む中心データ | %d |' % len(core_rows), '| うち後から読み込む追加データ | %d |' % len(extra_rows), '', '## 種類別', '', '| 種類 | 件数 |', '|---|---|']
    lines += ['| %s | %d |' % (k, v) for k, v in cat_count.most_common()]
    lines += ['', '## タグ別（体験・種類・推定ご利益）', '', '| タグ | 件数 |', '|---|---|']
    lines += ['| %s | %d |' % (k, v) for k, v in wish_count.most_common()]
    lines += ['', '## 都道府県別', '', '| 都道府県 | 件数 |', '|---|---|']
    lines += ['| %s | %d |' % (p, pref_out[p]) for p in PREFS]
    with open(os.path.join(ROOT, 'docs', 'DATA_REPORT.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(json.dumps({'count': len(rows), 'report': dict(rep), 'by_category': dict(cat_count)}, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
