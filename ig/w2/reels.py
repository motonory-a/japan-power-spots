# w2 リール（水曜・土曜、全7アカウント）。各アカウントの「その週の写真」だけで作る（他アカウントと同じ写真にしない）
import sys, json
sys.path.insert(0, '/home/claude/japan-power-spots/ig/reels'); sys.path.insert(0, '/home/claude/japan-power-spots/ig/w2')
from PIL import ImageFont
import make as M
import content as C
from build import credit_cap, HANDLE, REEL_T, BRAND
M.OUT = '/home/claude/japan-power-spots/ig/w2/out/'
IDX = {'zh': 3, 'ko': 1}
P = C.PHOTO; STN = '/home/claude/japan-power-spots/ig/stones/'
R1 = {  # 水曜 11/25：今週の晩秋3か所
 'en': ['Late autumn in Japan:\n3 places for this week', '1. Meiji Jingu, Tokyo\nHarvest festival on Nov 23', '2. Kanazawa\nSnow ropes go up in November', '3. Korankei, Aichi\nThousands of red maples', 'Which one suits you?\nFree finder · link in bio'],
 'zh': ['日本晚秋\n這週去的3個地方', '① 東京・明治神宮\n11月23日的新嘗祭', '② 金澤\n11月開始架起雪吊', '③ 愛知・香嵐溪\n數千棵紅楓', '哪裡最適合你？\n個人檔案連結免費診斷'],
 'ko': ['일본의 늦가을\n이번 주 가볼 곳 3', '① 도쿄 메이지진구\n11월 23일 수확 감사제', '② 가나자와\n11월부터 유키즈리', '③ 아이치 고란케이\n수천 그루의 단풍', '나에게 맞는 곳은?\n프로필 링크에서 무료 진단'],
 'fr': ['Fin d’automne au Japon :\n3 lieux cette semaine', '1. Meiji-jingū, Tokyo\nFête des récoltes le 23 nov.', '2. Kanazawa\nLes cordes à neige de novembre', '3. Kōrankei, Aichi\nDes milliers d’érables rouges', 'Lequel est fait pour vous ?\nLien dans la bio'],
 'es': ['Final del otoño en Japón:\n3 lugares esta semana', '1. Meiji-jingū, Tokio\nFiesta de la cosecha el 23 nov.', '2. Kanazawa\nCuerdas de nieve en noviembre', '3. Kōrankei, Aichi\nMiles de arces rojos', '¿Cuál es para ti?\nEnlace en la bio'],
 'jp': ['晩秋に行きたい\nパワースポット3選', '① 東京・明治神宮\n11月23日は新嘗祭', '② 金沢・兼六園\n11月から雪吊りが始まる', '③ 愛知・香嵐渓\n数千本のもみじ', 'あなたに合う聖地は？\nプロフィールのリンクで無料診断'],
}
R2 = {  # 土曜 11/28：寒い日に温まる3つ
 'en': ['Cold days in Japan?\n3 ways to warm up', '1. Oden\nEven at convenience stores', '2. A hot spring town\nSoak, then walk', '3. A morning shrine walk\nThen something hot to drink', 'Find your next trip\nLink in bio'],
 'zh': ['日本天冷了？\n3個暖身的方法', '① 關東煮\n便利商店也買得到', '② 溫泉鄉\n泡完再散步', '③ 清晨參拜神社\n再來一杯熱飲', '找到下一趟旅程\n個人檔案連結'],
 'ko': ['일본이 추워졌다면?\n몸을 녹이는 3가지', '① 오뎅\n편의점에서도 OK', '② 온천 마을\n온천 후 산책', '③ 아침 신사 산책\n그리고 따뜻한 음료', '다음 여행지 찾기\n프로필 링크'],
 'fr': ['Il fait froid au Japon ?\n3 façons de se réchauffer', '1. L’oden\nmême au konbini', '2. Une ville thermale\nbain puis balade', '3. Un sanctuaire le matin\npuis une boisson chaude', 'Votre prochain voyage\nLien dans la bio'],
 'es': ['¿Frío en Japón?\n3 formas de entrar en calor', '1. Oden\nincluso en el konbini', '2. Un pueblo termal\nbaño y paseo', '3. Un santuario por la mañana\ny algo caliente', 'Tu próximo viaje\nEnlace en la bio'],
 'jp': ['寒い日に\n体も心も温まる3つ', '① おでん\nコンビニでも気軽に', '② 温泉街\nお湯につかって、散歩して', '③ 朝の神社参り\n帰りに温かい飲みものを', '次のお休みの行き先は\nプロフィールのリンクから'],
}
CAP1 = {
 'en': 'Late autumn in Japan: 3 places for this week 🍁 Meiji Jingu, Kanazawa and Korankei. Which one would you visit first?\n\nFind your power spot 👉 link in bio\n\n#japantravel #autumninjapan #powerspot',
 'zh': '日本晚秋，這週去的3個地方🍁 明治神宮、金澤、香嵐溪，你最想先去哪裡？\n\n找到適合你的能量景點 👉 個人檔案連結\n\n#日本旅遊 #日本紅葉 #能量景點',
 'ko': '일본의 늦가을, 이번 주 가볼 곳 3곳🍁 메이지진구, 가나자와, 고란케이. 어디부터 가고 싶나요?\n\n나에게 맞는 파워스폿 👉 프로필 링크\n\n#일본여행 #일본단풍 #파워스폿',
 'fr': 'Fin d’automne au Japon : 3 lieux pour cette semaine 🍁 Meiji-jingū, Kanazawa et Kōrankei. Lequel visiteriez-vous en premier ?\n\nTrouvez votre lieu sacré 👉 lien dans la bio\n\n#voyagejapon #automneaujapon #japon',
 'es': 'Final del otoño en Japón: 3 lugares para esta semana 🍁 Meiji-jingū, Kanazawa y Kōrankei. ¿Cuál visitarías primero?\n\nEncuentra tu lugar sagrado 👉 enlace en la bio\n\n#viajarajapon #otoñoenjapon #japon',
 'jp': '晩秋に行きたいパワースポット3選🍁 明治神宮、金沢、香嵐渓。あなたはどこから行きますか？\n\nあなたに合う聖地は、プロフィールのリンクから無料で診断できます⛩\n\n#パワースポット #紅葉 #開運',
}
CAP2 = {
 'en': 'Cold days in Japan? 3 ways to warm up ♨️ Oden, a hot spring town, and a morning shrine walk followed by something hot to drink.\n\nPlan your next trip 👉 link in bio\n\n#japantravel #wintertravel #onsen',
 'zh': '日本天冷了？3個暖身的方法♨️ 關東煮、溫泉鄉，還有清晨參拜神社後來一杯熱飲。\n\n規劃下一趟旅程 👉 個人檔案連結\n\n#日本旅遊 #日本冬天 #日本溫泉',
 'ko': '일본이 추워졌다면? 몸을 녹이는 3가지♨️ 오뎅, 온천 마을, 그리고 아침 신사 산책 후 따뜻한 음료.\n\n다음 여행 계획하기 👉 프로필 링크\n\n#일본여행 #일본겨울 #일본온천',
 'fr': 'Il fait froid au Japon ? 3 façons de se réchauffer ♨️ L’oden, une ville thermale, et un sanctuaire au petit matin suivi d’une boisson chaude.\n\nPréparez votre voyage 👉 lien dans la bio\n\n#voyagejapon #hiver #onsen',
 'es': '¿Frío en Japón? 3 formas de entrar en calor ♨️ Oden, un pueblo termal y un santuario por la mañana seguido de algo caliente.\n\nPlanea tu viaje 👉 enlace en la bio\n\n#viajarajapon #invierno #onsen',
 'jp': '寒い日に、体も心も温まる3つ♨️ おでん、温泉街、そして朝の神社参りのあとの温かい飲みもの。\n\n次のお休みの行き先は、プロフィールのリンクから探せます⛩\n\n#冬の楽しみ #温泉 #パワースポット',
}
ST1 = ['あなたは、どの石に\n惹かれますか？', '① ラピスラズリ\n夜空のような深い青', '② タイガーアイ\n光の帯が動く石', '③ ルチルクォーツ\n水晶の中に金色の針', 'あなたに合う石は\n魂の系統鑑定（無料）で']
ST2 = ['本物の天然石？\n見分ける3つの目安', '① 手に持つと\nひんやり冷たく感じやすい', '② 丸い気泡があれば\nガラスの可能性', '③ 色や模様が均一すぎたら\n染めたものの場合も', 'いちばん大切なのは\n信頼できるお店で選ぶこと']
STC1 = 'あなたは、どの石に惹かれますか？\nラピスラズリ、タイガーアイ、ルチルクォーツ。直感で選んだ石が、今のあなたに必要な石かもしれません。\n\nあなたに合う石は、魂の系統鑑定（無料）で。プロフィールのリンクからどうぞ。\n\n#天然石 #パワーストーン #魂の系統鑑定'
STC2 = '本物の天然石、見分ける3つの目安。\n完全に見分けるには専門の検査が必要ですが、選ぶときのヒントにしてください。\n\n魂の系統鑑定（無料）はプロフィールのリンクから。\n\n#天然石 #天然石の選び方 #魂の系統鑑定'

def credits(paths):
    seen = []
    for p in paths:
        c = credit_cap(p).strip()
        if c and c not in seen: seen.append(c)
    return ('\n\n' + '\n'.join(seen)) if seen else ''
def font_for(lang):
    i = IDX.get(lang, 0); M.F = lambda p, s: ImageFont.truetype(p, s, index=i)
    def wf(d, line, font, maxw):
        f = font
        while d.textlength(line, font=f) > maxw and f.size > 30: f = ImageFont.truetype(f.path, f.size - 2, index=i)
        return f
    M.wrapfit = wf
out = []
for lang in C.LANGS:
    font_for(lang); h = HANDLE[lang]
    s1 = [P['wed'][lang], P['mon'][lang], P['fri'][lang], P['sat'][lang], P['sun'][lang]]
    if lang == 'en': s1[0] = '/tmp/w2-wed-en-story.jpg'  # アッキーが端で切れないよう左寄りに切り抜いた版
    M.reel(f'r2a-{lang}', [M.slide(p, t, h, small=(k == 4)) for k, (p, t) in enumerate(zip(s1, R1[lang]))])
    out.append({'lang': lang, 'brand': BRAND[lang], 'date': '11-25', 'time': REEL_T[lang], 'type': 'REEL', 'file': f'r2a-{lang}.mp4', 'text': CAP1[lang] + credits(s1)})
    s2 = [P['thu'][lang], P['tue'][lang], s1[0], P['mon'][lang], P['sun'][lang]]
    M.reel(f'r2b-{lang}', [M.slide(p, t, h, small=(k == 4)) for k, (p, t) in enumerate(zip(s2, R2[lang]))])
    out.append({'lang': lang, 'brand': BRAND[lang], 'date': '11-28', 'time': REEL_T[lang], 'type': 'REEL', 'file': f'r2b-{lang}.mp4', 'text': CAP2[lang] + credits(s2)})
    print(lang, 'ok')
font_for('jp')
a = [STN + f for f in ['crystal-sky.jpg', 'lapis.jpg', 'tigereye.jpg', 'rutile.jpg', 'crystal-sea.jpg']]
M.reel('r2a-st', [M.slide(p, t, HANDLE['st'], small=(k == 4)) for k, (p, t) in enumerate(zip(a, ST1))])
b = [STN + f for f in ['crystal-tray.jpg', 'black-rutile.jpg', 'rutile-crystal.jpg', 'apatite-wood.jpg', 'crystal-rosegold.jpg']]
M.reel('r2b-st', [M.slide(p, t, HANDLE['st'], small=(k == 4)) for k, (p, t) in enumerate(zip(b, ST2))])
out += [{'lang': 'st', 'brand': BRAND['st'], 'date': '11-25', 'time': REEL_T['st'], 'type': 'REEL', 'file': 'r2a-st.mp4', 'text': STC1},
        {'lang': 'st', 'brand': BRAND['st'], 'date': '11-28', 'time': REEL_T['st'], 'type': 'REEL', 'file': 'r2b-st.mp4', 'text': STC2}]
json.dump(out, open('/home/claude/japan-power-spots/ig/w2/reels.json', 'w'), ensure_ascii=False, indent=1)
print(len(out))
