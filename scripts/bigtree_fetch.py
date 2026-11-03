"""
環境省 生物多様性センター「巨樹・巨木林調査」（自然環境保全基礎調査）の Shape データを
G空間情報センターから取得し、1行1件の JSON（gzip）にする（GitHub Actions から実行）

  python scripts/bigtree_fetch.py out/bigtrees.jsonl.gz out/bigtrees_summary.json

出典：環境省生物多様性センター 自然環境保全基礎調査 巨樹・巨木林調査（政府標準利用規約）
"""
import gzip
import io
import json
import sys
import urllib.request
import zipfile
from collections import Counter

import shapefile  # pyshp

BASE = 'https://www.biodic.go.jp/shapedata/big6/big6_all/big6_%d.zip'  # 第6回調査、1=北海道〜47=沖縄県
UA = 'japan-power-spots-data/1.0 (https://github.com/motonory-a/japan-power-spots)'


def get(url, timeout=120):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def decode(v):
    if isinstance(v, bytes):
        for enc in ('cp932', 'utf-8'):
            try:
                return v.decode(enc).strip()
            except UnicodeDecodeError:
                pass
        return ''
    return v


def main(out_path, summary_path):
    resources = [{'name': 'pref%02d' % i, 'url': BASE % i, 'pref_code': '%02d' % i} for i in range(1, 48)]
    summary = {'resources': len(resources), 'files': [], 'fields': {}, 'shape_types': Counter()}
    n = 0
    with gzip.open(out_path, 'wt', encoding='utf-8') as out:
        for res in resources:
            try:
                data = get(res['url'])
            except Exception as e:
                summary['files'].append({'name': res.get('name'), 'error': str(e)})
                continue
            z = zipfile.ZipFile(io.BytesIO(data))
            shps = [nm for nm in z.namelist() if nm.lower().endswith('.shp')]
            for shp in shps:
                base = shp[:-4]
                try:
                    r = shapefile.Reader(shp=io.BytesIO(z.read(shp)), dbf=io.BytesIO(z.read(base + '.dbf')),
                                         shx=io.BytesIO(z.read(base + '.shx')), encoding='cp932', encodingErrors='replace')
                except Exception as e:
                    summary['files'].append({'name': shp, 'error': str(e)})
                    continue
                fields = [f[0] for f in r.fields[1:]]
                summary['fields'][shp.split('/')[-1]] = fields
                prj = ''
                if base + '.prj' in z.namelist():
                    prj = z.read(base + '.prj').decode('latin-1')[:120]
                cnt = 0
                for sr in r.iterShapeRecords():
                    shp_t = sr.shape.shapeTypeName
                    summary['shape_types'][shp_t] += 1
                    if not sr.shape.points:
                        continue
                    xs = [p[0] for p in sr.shape.points]
                    ys = [p[1] for p in sr.shape.points]
                    rec = {'file': shp.split('/')[-1], 'res': res.get('name', ''), 'pref_code': res['pref_code'], 'type': shp_t,
                           'x': sum(xs) / len(xs), 'y': sum(ys) / len(ys),
                           'attr': {k: decode(v) for k, v in zip(fields, list(sr.record))}}
                    out.write(json.dumps(rec, ensure_ascii=False, default=str) + '\n')
                    cnt += 1
                    n += 1
                summary['files'].append({'name': shp, 'count': cnt, 'prj': prj})
    summary['records'] = n
    summary['shape_types'] = dict(summary['shape_types'])
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in summary.items() if k != 'files'}, ensure_ascii=False, indent=1)[:3000])


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
