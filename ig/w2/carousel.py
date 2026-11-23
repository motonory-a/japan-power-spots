# 2026-11-23 本人「すすめて」→ 今週(11/23〜29)の1枚画像のうち、保存されやすい3回分をカルーセルに作り替える
# 11/26 温泉の入り方(6言語) / 11/28 香嵐渓(6言語)と天然石の豆知識No.5 / 11/25 天然石の豆知識No.4
# 作り方は w3/carousel.py と同じ(表紙=予約済みの画像、要点=予約済みキャプションの箇条書き、最後に保存のお願い)
import json, re, sys
sys.path.insert(0, '/home/claude/japan-power-spots/ig/w3')
import carousel as C

IG = C.IG
C.OUT = IG + 'w2/out/'
C.BUL = re.compile(r'^(✔|🍁|・|\d\.)\s*')
LABEL = {
 '11-25': {'st': '天然石の豆知識 No.4'},
 '11-26': {'jp': '温泉の入り方', 'en': 'Onsen rules', 'zh': '日本溫泉的規矩', 'ko': '일본 온천 규칙', 'fr': 'Les règles de l’onsen', 'es': 'Normas del onsen'},
 '11-28': {'jp': '愛知・香嵐渓', 'en': 'Korankei, Aichi', 'zh': '愛知・香嵐溪', 'ko': '아이치 고란케이', 'fr': 'Kōrankei, Aichi', 'es': 'Kōrankei, Aichi', 'st': '天然石の豆知識 No.5'},
}
posts = json.load(open(IG + 'w2/posts.json'))
done = {}
for p in posts:
    if p['type'] != 'POST' or p['file'].startswith('am-') or p['lang'] not in LABEL.get(p['date'], {}): continue
    bul = [C.BUL.sub('', l.strip()) for l in p['text'].split('\n') if C.BUL.match(l.strip())]
    if len(bul) < 3: print('skip', p['date'], p['lang'], len(bul)); continue
    cover = C.OUT + p['file']; names = [p['file']]
    for i, b in enumerate(bul, 1):
        nm = p['file'].replace('.jpg', f'-c{i}.jpg')
        C.slide(cover, p['lang'], LABEL[p['date']][p['lang']], i, len(bul), b).save(C.OUT + nm, quality=90); names.append(nm)
    nm = p['file'].replace('.jpg', '-csave.jpg'); C.save_slide(cover, p['lang']).save(C.OUT + nm, quality=90); names.append(nm)
    done[f"{p['date']}-{p['lang']}"] = names
    print(p['date'], p['lang'], len(names))
json.dump(done, open(IG + 'w2/carousels.json', 'w'), ensure_ascii=False, indent=1)
