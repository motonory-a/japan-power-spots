#!/usr/bin/env python3
"""Download Instagram source images listed in ig/fetch.txt into ig/src/.

Each non-empty line:  name | url:<direct url>   or   name | commons:<search words>
Commons results are saved with a credit line in ig/src/<name>.json.
Already-downloaded names are skipped.
"""
import json, os, re, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'ig', 'src')
UA = {'User-Agent': 'JapanPowerSpotJourney/1.0 (https://motonory-a.github.io/japan-power-spots/)'}
os.makedirs(SRC, exist_ok=True)

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def strip(html):
    return re.sub(r'<[^>]+>', '', html or '').strip()

def commons(name, q):
    api = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({
        'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6,
        'gsrsearch': q + ' filetype:bitmap', 'gsrlimit': 8, 'prop': 'imageinfo',
        'iiprop': 'url|size|extmetadata', 'iiurlwidth': 1600})
    pages = json.loads(get(api)).get('query', {}).get('pages', {})
    cands = sorted(pages.values(), key=lambda p: p.get('index', 99))
    for p in cands:
        ii = (p.get('imageinfo') or [{}])[0]
        if ii.get('width', 0) < 1200 or ii.get('mime', 'image/jpeg') not in ('image/jpeg', 'image/png'):
            continue
        meta = ii.get('extmetadata', {})
        lic = strip(meta.get('LicenseShortName', {}).get('value'))
        if not re.search(r'CC|Public domain|PD', lic or '', re.I):
            continue
        data = get(ii.get('thumburl') or ii['url'])
        open(os.path.join(SRC, name + '.jpg'), 'wb').write(data)
        info = {'title': p['title'], 'page': ii.get('descriptionurl'),
                'artist': strip(meta.get('Artist', {}).get('value')), 'license': lic, 'query': q}
        json.dump(info, open(os.path.join(SRC, name + '.json'), 'w'), ensure_ascii=False, indent=1)
        print('ok', name, p['title'], lic)
        return
    print('none', name, q, file=sys.stderr)

for line in open(os.path.join(ROOT, 'ig', 'fetch.txt'), encoding='utf-8'):
    line = line.strip()
    if not line or line.startswith('#') or '|' not in line:
        continue
    name, spec = [s.strip() for s in line.split('|', 1)]
    if os.path.exists(os.path.join(SRC, name + '.jpg')):
        continue
    try:
        if spec.startswith('url:'):
            open(os.path.join(SRC, name + '.jpg'), 'wb').write(get(spec[4:].strip()))
            print('ok', name)
        elif spec.startswith('commons:'):
            commons(name, spec[8:].strip())
    except Exception as e:
        print('fail', name, e, file=sys.stderr)
