"""
Wikidata から日本の神社・寺院などの情報を取得する（GitHub Actions から実行）

  python scripts/wikidata_fetch.py out/wikidata.jsonl.gz out/wikidata_summary.json

取得するもの
  ・神社（Q845945 とその下位分類）、寺院（Q5393308 とその下位分類）で日本にあり座標のあるもの
  ・日本語名、座標、Wikipedia などの言語版の数（知名度の目安）、種類（P31）
  ・祭神（P825 dedicated to）、文化財の指定（P1435）
Wikidata のデータは CC0（自由に利用可能）。
"""
import gzip
import json
import sys
import time
import urllib.parse
import urllib.request

ENDPOINT = 'https://query.wikidata.org/sparql'
UA = 'japan-power-spots-data/1.0 (https://github.com/motonory-a/japan-power-spots)'

KINDS = {'shrine': 'wd:Q845945', 'temple': 'wd:Q5393308'}


def sparql(q, tries=4):
    url = ENDPOINT + '?' + urllib.parse.urlencode({'query': q, 'format': 'json'})
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/sparql-results+json'})
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)['results']['bindings']
        except Exception as e:  # 混雑時は少し待って再試行
            print('retry', i + 1, e, file=sys.stderr)
            time.sleep(20 * (i + 1))
    raise RuntimeError('SPARQL failed')


def qid(uri):
    return uri.rsplit('/', 1)[-1]


def fetch_items(kind_q):
    q = """
SELECT ?item ?label ?coord ?sl WHERE {
  ?item wdt:P31/wdt:P279* %s ;
        wdt:P17 wd:Q17 ;
        wdt:P625 ?coord ;
        wikibase:sitelinks ?sl .
  OPTIONAL { ?item rdfs:label ?label FILTER(LANG(?label) = "ja") }
}""" % kind_q
    return sparql(q)


def fetch_prop(kind_q, prop):
    q = """
SELECT ?item ?v ?vlabel WHERE {
  ?item wdt:P31/wdt:P279* %s ;
        wdt:P17 wd:Q17 ;
        wdt:%s ?v .
  OPTIONAL { ?v rdfs:label ?vlabel FILTER(LANG(?vlabel) = "ja") }
}""" % (kind_q, prop)
    return sparql(q)


def main(out_path, summary_path):
    items = {}
    summary = {}
    for kind, kq in KINDS.items():
        rows = fetch_items(kq)
        n = 0
        for b in rows:
            k = qid(b['item']['value'])
            wkt = b['coord']['value']  # Point(lon lat)
            try:
                lon, lat = [float(x) for x in wkt[wkt.index('(') + 1:wkt.index(')')].split()]
            except ValueError:
                continue
            if not (20 < lat < 46 and 122 < lon < 154):
                continue
            it = items.setdefault(k, {'qid': k, 'kind': kind, 'label': '', 'lat': lat, 'lon': lon, 'sitelinks': 0,
                                      'types': [], 'deities': [], 'heritage': []})
            if 'label' in b:
                it['label'] = b['label']['value']
            it['sitelinks'] = max(it['sitelinks'], int(b['sl']['value']))
            n += 1
        summary[kind + '_rows'] = n
        time.sleep(5)
        for prop, field in (('P31', 'types'), ('P825', 'deities'), ('P1435', 'heritage')):
            rows = fetch_prop(kq, prop)
            for b in rows:
                k = qid(b['item']['value'])
                if k not in items:
                    continue
                v = b.get('vlabel', {}).get('value') or qid(b['v']['value'])
                if v not in items[k][field]:
                    items[k][field].append(v)
            summary[kind + '_' + prop] = len(rows)
            time.sleep(5)
    with gzip.open(out_path, 'wt', encoding='utf-8') as f:
        for it in items.values():
            f.write(json.dumps(it, ensure_ascii=False) + '\n')
    summary['items'] = len(items)
    summary['with_label_ja'] = sum(1 for x in items.values() if x['label'])
    summary['with_deities'] = sum(1 for x in items.values() if x['deities'])
    summary['with_heritage'] = sum(1 for x in items.values() if x['heritage'])
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=1)
    print(json.dumps(summary, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
