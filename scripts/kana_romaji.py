# ひらがな → ローマ字（ヘボン式・長音は省略：とうきょう→Tokyo、おおさか→Osaka）
T = {}
base = {
 'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko','さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
 'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to','な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
 'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','ゐ':'i','ゑ':'e','を':'o','ん':'n',
 'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo','だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
 'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo','ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po','ゔ':'vu',
 'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
}
yoon = {'き':'ky','し':'sh','ち':'ch','に':'ny','ひ':'hy','み':'my','り':'ry','ぎ':'gy','じ':'j','ぢ':'j','び':'by','ぴ':'py'}
small = {'ゃ':'a','ゅ':'u','ょ':'o'}
def kata2hira(s):
    return ''.join(chr(ord(c) - 0x60) if 'ァ' <= c <= 'ヶ' else c for c in s)
def romaji(kana):
    s = kata2hira(kana); out = ''; i = 0
    while i < len(s):
        c = s[i]; n = s[i + 1] if i + 1 < len(s) else ''
        if c in yoon and n in small: out += yoon[c] + small[n]; i += 2; continue
        if c == 'ふ' and n and n in 'ぁぃぇぉ': out += 'f' + base[n]; i += 2; continue
        if c in 'じぢ' and n == 'ぇ': out += 'je'; i += 2; continue
        if c == 'て' and n == 'ぃ': out += 'ti'; i += 2; continue
        if c == 'で' and n == 'ぃ': out += 'di'; i += 2; continue
        if c == 'っ':
            nx = romaji(s[i + 1:i + 3])[:1] if i + 1 < len(s) else ''
            out += ('t' if nx == 'c' else nx); i += 1; continue
        if c == 'ー': i += 1; continue
        out += base.get(c, c); i += 1
    # 長音を省略
    for a, b in (('ou', 'o'), ('oo', 'o'), ('uu', 'u')):
        out = out.replace(a, b)
    return out
def title(r):
    return ' '.join(w[:1].upper() + w[1:] for w in r.split(' ') if w)
PREFIX = [('上', 'かみ'), ('下', 'しも'), ('中', 'なか'), ('東', 'ひがし'), ('西', 'にし'), ('南', 'みなみ'), ('北', 'きた'), ('新', 'しん'), ('奥', 'おく')]
def station_en(name, kana):
    for k, y in PREFIX:
        if name.startswith(k) and kana.startswith(y) and len(kana) > len(y) + 2 and not name.startswith('新宿') and not name.startswith('新潟'):
            return title(romaji(y)) + '-' + title(romaji(kana[len(y):]))
    return title(romaji(kana))
LINE_PREFIX = [('じぇいあーる', 'JR '), ('とうきょうめとろ', 'Tokyo Metro '), ('とえい', 'Toei '), ('おおさかめとろ', 'Osaka Metro '), ('せいぶ', 'Seibu '), ('とうきゅう', 'Tokyu '), ('おだきゅう', 'Odakyu '), ('けいおう', 'Keio '), ('とうぶ', 'Tobu '), ('けいせい', 'Keisei '), ('けいきゅう', 'Keikyu '), ('そうてつ', 'Sotetsu '), ('はんきゅう', 'Hankyu '), ('はんしん', 'Hanshin '), ('きんてつ', 'Kintetsu '), ('なんかい', 'Nankai '), ('けいはん', 'Keihan '), ('めいてつ', 'Meitetsu '), ('にしてつ', 'Nishitetsu '), ('つくばえくすぷれす', 'Tsukuba Express'), ('ゆいれーる', 'Yui Rail'), ('とうきょうもので', 'Tokyo Monorail'), ('とうきょうものれーる', 'Tokyo Monorail'), ('ゆりかもめ', 'Yurikamome'), ('りんかい', 'Rinkai '), ('えのしまでんてつ', 'Enoden '), ('よこはましえいちかてつ', 'Yokohama Subway '), ('みなとみらい', 'Minatomirai ')]
import re
def line_en(kana):
    # 会社名がわかる路線だけ英語にする（ほかは空文字＝日本語の路線名を使う）
    k = re.sub(r'[（(].*?[)）]', '', kata2hira(kana)); pre = None
    if k.endswith('しんかんせん'): return title(romaji(k[:-6])) + ' Shinkansen'
    for a, b in LINE_PREFIX:
        if k.startswith(a): pre = b; k = k[len(a):]; break
    if pre is None: return ''
    suf = ''
    if k.endswith('ほんせん'): k = k[:-4]; suf = ' Main Line'
    elif k.endswith('せん'): k = k[:-2]; suf = ' Line'
    elif k.endswith('らいん'): k = k[:-3]; suf = ' Line'
    return ' '.join((pre + title(romaji(k)) + suf).split())
if __name__ == '__main__':
    print(station_en('東新宿','ひがししんじゅく'), station_en('新宿','しんじゅく'), station_en('西日暮里','にしにっぽり'), line_en('じぇいあーるやまのてせん'), line_en('とうきょうめとろぎんざせん'), line_en('とえいおおえどせん'), line_en('せいぶいけぶくろせん'))
    for k in ['とうきょう', 'おおさか', 'しんじゅく', 'めいじじんぐうまえ', 'えこだ', 'しんばし', 'きっしょうじ', 'ひがししんじゅく', 'じぇいあーるやまのてせん', 'ろっぽんぎ', 'はっちょうぼり', 'いけぶくろ', 'うえの', 'にっぽり', 'ちゃたんちょう', 'ふぉれすと']:
        print(k, title(romaji(k)))
