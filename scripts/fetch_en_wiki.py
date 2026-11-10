#!/usr/bin/env python3
"""
英語版のための英語名・英語版Wikipediaの要約を取得する（v3.16）
  入力：data/en-pool.json（scripts/build_en_pages.js --pool で作る、英語版で扱うスポットの Wikidata 番号）
  出力：data/en-wiki.json  { "Q123": {"n": 英語名, "w": 英語版Wikipediaの記事名, "x": 要約, "u": 記事URL} }
  ・Wikidata（CC0）から英語ラベルと enwiki の記事名を取る
  ・英語版Wikipedia（CC BY-SA 4.0）の要約を REST API で取る。ページには出典とライセンスを表示する
  ・すでに取得済みの番号は取り直さない（--refresh で全部取り直す）
GitHub Actions（.github/workflows/en-pages.yml）で動かす。手元の環境から Wikidata に届かない場合があるため。
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POOL = os.path.join(ROOT, 'data', 'en-pool.json')
OUT = os.path.join(ROOT, 'data', 'en-wiki.json')
UA = 'japan-power-spots/3.16 (https://motonory-a.github.io/japan-power-spots/; GitHub Actions)'
JP = __import__('re').compile(r'[぀-ヿ㐀-鿿]')


def get_json(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(2 + i * 3)
        except Exception:
            time.sleep(2 + i * 3)
    return None


def labels(qids):
    url = ('https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels%7Csitelinks&languages=en'
           '&sitefilter=enwiki&format=json&ids=' + urllib.parse.quote('|'.join(qids)))
    d = get_json(url) or {}
    out = {}
    for q in qids:
        e = (d.get('entities') or {}).get(q) or {}
        lab = ((e.get('labels') or {}).get('en') or {}).get('value') or ''
        wiki = ((e.get('sitelinks') or {}).get('enwiki') or {}).get('title') or ''
        out[q] = {'n': lab if lab and not JP.search(lab) else '', 'w': wiki}
    return out


def summary(title):
    url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + urllib.parse.quote(title.replace(' ', '_'), safe='')
    d = get_json(url)
    if not d or d.get('type') == 'disambiguation':
        return '', ''
    x = (d.get('extract') or '').strip()
    u = ((d.get('content_urls') or {}).get('desktop') or {}).get('page') or ('https://en.wikipedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')))
    return x, u


def main():
    refresh = '--refresh' in sys.argv
    pool = json.load(open(POOL, encoding='utf-8'))
    have = {}
    if os.path.exists(OUT) and not refresh:
        have = json.load(open(OUT, encoding='utf-8'))
    need = [q for q in pool if q not in have]
    print('対象', len(pool), '件 / 新しく取得', len(need), '件')
    for i in range(0, len(need), 50):
        chunk = need[i:i + 50]
        for q, v in labels(chunk).items():
            have[q] = v
        time.sleep(0.5)
    n = 0
    for q in need:
        v = have.get(q) or {}
        if v.get('w') and 'x' not in v:
            v['x'], v['u'] = summary(v['w'])
            n += 1
            time.sleep(0.2)
    # 対象から外れた番号は残さない
    have = {q: have[q] for q in pool if q in have}
    json.dump(have, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
    print('英語名あり', sum(1 for v in have.values() if v.get('n')), '件 / 要約', sum(1 for v in have.values() if v.get('x')), '件（今回', n, '件取得）')


if __name__ == '__main__':
    main()
