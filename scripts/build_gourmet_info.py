# scripts/gourmet_info_src.py から data/gourmet-info.js を作る
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from gourmet_info_src import INFO_RAW, TIPS
LANGS = ['ja', 'en', 'zh', 'ko', 'fr', 'es']
info = {}
for line in INFO_RAW.strip().splitlines():
    parts = line.split('|') + ['', '']
    name, k, ing, s = parts[0], parts[1], parts[2], parts[3]
    assert k in 'nrhmswfo' and len(k) == 1, line
    assert all(c in 'BPCLHWDFSEMGKNA' for c in ing), line
    rec = {'k': k}
    if ing: rec['i'] = ing
    if s:
        codes, _, months = s.partition(':')
        for c in codes.split(): assert c in ('sp', 'su', 'au', 'wi', 'ny'), line
        rec['s'] = codes.split()
        if months: rec['m'] = months
    if name in TIPS:
        t = TIPS[name]; assert len(t) == 6, name
        rec['t'] = dict(zip(LANGS, t))
    info[name] = rec
out = '/* ご当地グルメ図鑑：料理ごとの種類・主な材料・旬・食べ方のコツ。scripts/build_gourmet_info.py で生成 */\nwindow.GOURMET_INFO=' + json.dumps(info, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(os.path.join(os.path.dirname(__file__), '..', 'data', 'gourmet-info.js'), 'w', encoding='utf-8').write(out)
from collections import Counter
print(len(info), Counter(r['k'] for r in info.values()), sum('t' in r for r in info.values()), 'tips', len(out), 'bytes')
