"""
OSM（osmium export の GeoJSONSeq）からパワースポット候補を取り出し、
都道府県・市区町村を付けて1行1件の JSON（gzip）に書き出す。

使い方（GitHub Actions の osm-extract ワークフローから実行）:
  python scripts/osm_candidates.py poi.geojsonseq admin.geojsonseq out/candidates.jsonl.gz out/summary.json

・巨大な元データ（.pbf）はリポジトリに入れない。
・ここでは候補を「広く」集めるだけ。選定やタグ付けは scripts/build_spots.py で行う。
"""
import gzip
import json
import sys
from collections import Counter

from shapely.geometry import shape
from shapely.strtree import STRtree

KEEP_TAGS = [
    'name', 'name:ja', 'name:ja-Hira', 'name:ja_kana', 'name:en', 'alt_name', 'official_name', 'old_name',
    'amenity', 'religion', 'denomination', 'shrine:type', 'building', 'historic', 'heritage', 'heritage:operator',
    'natural', 'waterway', 'tourism', 'leisure', 'place', 'ele', 'height', 'species', 'species:ja', 'denotation',
    'wikidata', 'wikipedia', 'wikipedia:ja', 'website', 'url', 'contact:website', 'opening_hours',
    'access', 'bath:type', 'description', 'note',
]


def is_candidate(tags):
    a = tags.get('amenity')
    n = tags.get('natural')
    if a == 'place_of_worship' and tags.get('religion') in ('shinto', 'buddhist'):
        return True
    if tags.get('waterway') == 'waterfall' or n == 'waterfall':
        return True
    if n in ('peak', 'volcano', 'cave_entrance', 'spring', 'hot_spring', 'rock', 'stone'):
        return True
    if n == 'tree' and (tags.get('name') or tags.get('denotation') in ('natural_monument', 'landmark')):
        return True
    if tags.get('historic') in ('shrine', 'wayside_shrine') and tags.get('name'):
        return True
    if tags.get('tourism') == 'viewpoint' and tags.get('name'):
        return True
    if n == 'water' and tags.get('name') and tags.get('wikidata'):
        return True
    return False


def read_seq(path):
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip().lstrip('\x1e')
            if line:
                yield json.loads(line)


def load_admin(path):
    prefs, munis = [], []
    for ft in read_seq(path):
        t = ft.get('properties') or {}
        if t.get('boundary') != 'administrative':
            continue
        if ft['geometry']['type'] not in ('Polygon', 'MultiPolygon'):
            continue
        lv = t.get('admin_level')
        if lv not in ('4', '7'):
            continue
        try:
            g = shape(ft['geometry'])
            if not g.is_valid:
                g = g.buffer(0)
        except Exception:
            continue
        rec = (g, t.get('name') or t.get('name:ja') or '', t.get('ref') or t.get('iso3166-2') or t.get('ISO3166-2') or '')
        (prefs if lv == '4' else munis).append(rec)
    return prefs, munis


class Locator:
    def __init__(self, items):
        self.items = items
        self.tree = STRtree([g for g, _, _ in items]) if items else None

    def find(self, pt):
        if not self.tree:
            return None
        for i in self.tree.query(pt):
            g, name, ref = self.items[int(i)]
            if g.covers(pt):
                return name, ref
        return None


def main(poi_path, admin_path, out_path, summary_path):
    prefs, munis = load_admin(admin_path)
    pl, ml = Locator(prefs), Locator(munis)
    stats = Counter()
    with gzip.open(out_path, 'wt', encoding='utf-8') as out:
        for ft in read_seq(poi_path):
            tags = ft.get('properties') or {}
            if not is_candidate(tags):
                continue
            try:
                g = shape(ft['geometry'])
                pt = g if g.geom_type == 'Point' else g.representative_point()
            except Exception:
                stats['geometry_error'] += 1
                continue
            p = pl.find(pt)
            m = ml.find(pt)
            rec = {
                'osm': ft.get('id'),
                'gt': g.geom_type,
                'lat': round(pt.y, 6),
                'lon': round(pt.x, 6),
                'pref': p[0] if p else '',
                'muni': m[0] if m else '',
                'area': round(g.area * 1e10) if g.geom_type in ('Polygon', 'MultiPolygon') else 0,  # おおよその面積（度²×1e10）
                'tags': {k: tags[k] for k in KEEP_TAGS if k in tags},
            }
            out.write(json.dumps(rec, ensure_ascii=False) + '\n')
            stats['total'] += 1
            stats['pref_missing' if not p else 'pref_ok'] += 1
            key = tags.get('amenity') or tags.get('natural') or tags.get('waterway') or tags.get('historic') or tags.get('tourism') or 'other'
            if key == 'place_of_worship':
                key += ':' + tags.get('religion', '')
            stats['kind:' + key] += 1
            if tags.get('name'):
                stats['named'] += 1
            if tags.get('wikidata'):
                stats['wikidata'] += 1
    summary = {'prefecture_polygons': len(prefs), 'municipality_polygons': len(munis), 'counts': dict(stats)}
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=1)
    print(json.dumps(summary, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main(*sys.argv[1:5])
