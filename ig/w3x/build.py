# 2026-11-23 本人「進めて」→ 11/30〜12/6 の週にお試しリール(TRIAL_REEL)を前倒しで追加（週次指示の(H)）
# 12/1 新宿・花園神社の酉の市（アッキー撮影の動画と写真） / 12/4 日光・白滝（アッキー撮影の写真）
# 事実の出典：花園神社の酉の市＝enjoytokyo（2026年は11/7・11/19）、るるぶ・tabi-mag・さんたつ（明治から・熊手・関東三大酉の市）
#             白滝＝own.json の facts（栃ナビ：日塩もみじライン沿い、名前の由来）
import json, os, sys
sys.path.insert(0, '/home/claude/japan-power-spots/ig/reels')
from hook import make

IG = '/home/claude/japan-power-spots/ig/'
O = IG + 'own/'
SRC = IG + 'w3x/src/'
V = O + 'hanazono-torinoichi-pan.mp4'
OUT = IG + 'w3x/out/'; os.makedirs(OUT, exist_ok=True)
HANDLE = {'jp': '@japan_psj_jp', 'st': '@nigihayahi03', 'en': '@japan_psj', 'zh': '@japan_psj_tw',
          'ko': '@japan_psj_kr', 'fr': '@japan_psj_fr', 'es': '@japan_psj_es'}
BRAND = {'en': 8007581, 'zh': 8008367, 'ko': 8023628, 'fr': 8023857, 'es': 8050134, 'jp': 8050350, 'st': 7861854}
TIME = {'jp': '19:00', 'st': '19:30', 'zh': '19:00', 'ko': '19:00', 'en': '21:00', 'fr': '17:00', 'es': '17:00'}


def S(src, dur, big='', small='', t=0, x=0.5):
    return {'src': src, 't': t, 'x': x, 'dur': dur, 'big': big, 'small': small}


L = SRC + 'hz-lanterns.jpg'
G = SRC + 'hz-gate.jpg'
# ---------- 12/1 花園神社の酉の市（動画は0〜8秒の鳥居・露店の区間だけ使う。人の顔が大きく写る後半は使わない） ----------
HZ = {
 'jp': [S(V, 2.5, '新宿のど真ん中、\nこの夜の神社', '', 0.5, 0.5),
        S(L, 2, '入口に提灯がずらり', '会社やお店の名前入り', x=0.3),
        S(V, 2, '花園神社の酉の市', '毎年11月の酉の日', 5, 0.6),
        S(V, 2, '保存して、\n来年の11月に', '', 2, 0.3)],
 'st': [S(G, 2.5, '新宿で見た、\n提灯の壁', ''),
        S(V, 2, '花園神社の酉の市', '今年の様子', 1, 0.7),
        S(L, 2, '商売繁盛を願うお祭り', '明治時代から続く', x=0.8),
        S(V, 2, '保存して、来年の11月に', '', 6, 0.4)],
 'en': [S(V, 2.5, 'What happens at this Tokyo shrine at night?', '', 3, 0.5),
        S(L, 2, 'Tori-no-Ichi at Hanazono Shrine', 'Shinjuku, every November', x=0.55),
        S(V, 2, 'Festival stalls under the torii', '', 7, 0.7),
        S(V, 2, 'Save it for next November', '', 0, 0.2)],
 'zh': [S(V, 2.5, '東京新宿的神社，\n晚上變成這樣？', '', 4, 0.4),
        S(G, 2, '花園神社「酉之市」', '每年11月的酉日'),
        S(V, 2, '鳥居下擠滿了攤位', '', 1.5, 0.6),
        S(V, 2, '先收藏，明年11月去', '', 6.5, 0.5)],
 'ko': [S(L, 2.5, '신주쿠 한복판의\n등불 벽?', '', x=0.15),
        S(V, 2, '하나조노 신사 도리노이치', '매년 11월 닭의 날', 2.5, 0.4),
        S(V, 2, '도리이 아래 노점이 가득', '', 5.5, 0.8),
        S(V, 2, '저장해 두고 내년 11월에', '', 0.2, 0.6)],
 'fr': [S(V, 2.5, 'Que se passe-t-il ici la nuit ?', '', 6, 0.3),
        S(L, 2, 'Tori-no-ichi, sanctuaire Hanazono', 'Shinjuku, chaque novembre', x=0.95),
        S(V, 2, 'Des stands sous le torii', '', 3.5, 0.5),
        S(V, 2, 'Enregistrez pour novembre prochain', '', 1, 0.45)],
 'es': [S(V, 2.5, '¿Qué pasa en este santuario de noche?', '', 7.5, 0.6),
        S(G, 2, 'Tori-no-ichi, santuario Hanazono', 'Shinjuku, cada noviembre'),
        S(V, 2, 'Puestos bajo el torii', '', 0.8, 0.25),
        S(V, 2, 'Guárdalo para el próximo noviembre', '', 4.5, 0.5)],
}
HCAP = {
 'jp': "新宿のど真ん中で、夜の神社がこの人だかり🏮\n\n新宿・花園神社の「酉の市（大酉祭）」。アッキーが今年撮りました。毎年11月の酉の日に、商売繁盛・開運招福の縁起物「熊手」の露店が並びます。明治時代から続き、浅草・府中と並ぶ「関東三大酉の市」のひとつとされています。\n\n今年（2026年）は11月7日と19日で終わりました。次は来年の11月です。\n\n📌 保存して、来年の11月に見返してね\n💬 熊手を買ったことがある人は「🏮」でコメントしてね\n\n#酉の市 #花園神社 #新宿 #熊手 #パワースポット",
 'st': "今年、新宿・花園神社の酉の市で見た景色です🏮\n\n入口には、会社やお店の名前が入った提灯がずらり。毎年11月の酉の日に、商売繁盛を願う熊手の市が立ちます。明治時代から続くお祭りです。\n\n今年は11月7日と19日で終わりました。\n\n📌 保存して、来年の11月に\n💬 熊手、飾っていますか？\n\n#酉の市 #花園神社 #新宿 #熊手 #高次元ネゴシエイター",
 'en': "What happens at this Tokyo shrine at night? 🏮\n\nIt's Tori-no-Ichi at Hanazono Shrine in Shinjuku, filmed this year by our guide Akki @nigihayahi03. Every November on the days of the Rooster, stalls sell kumade, decorated bamboo rakes said to rake in good luck and business. The fair has run here since the Meiji era and is counted among the three big Tori-no-Ichi fairs of the Kanto region.\n\nThis year's dates (Nov 7 and 19) are over. Next one: November 2027.\n\n📌 Save it for next November\n💬 Would you buy a lucky rake? Yes or no?\n\n#Shinjuku #Tokyo #japanesefestival #japantravel #powerspot",
 'zh': "東京新宿的神社，晚上變成這樣？🏮\n\n這是新宿・花園神社的「酉之市」，由我們的嚮導 Akki @nigihayahi03 今年拍攝。每年11月的酉日，境內會擺滿販賣「熊手」的攤位，熊手是祈求生意興隆、招來好運的吉祥物。從明治時代延續至今，與淺草、府中並稱「關東三大酉之市」。\n\n今年（2026年）的11月7日、19日已經結束，下一次是明年11月。\n\n📌 先收藏，明年11月用得到\n💬 你會想買一支熊手嗎？留言告訴我們\n\n#酉之市 #花園神社 #新宿 #東京旅遊 #日本旅遊",
 'ko': "신주쿠 한복판, 밤의 신사가 이렇게? 🏮\n\n신주쿠 하나조노 신사의 '도리노이치(酉の市)'예요. 저희 가이드 Akki @nigihayahi03 가 올해 찍었어요. 매년 11월 '닭의 날'에 장사 번창과 행운을 비는 장식 갈퀴 '구마데' 노점이 늘어서요. 메이지 시대부터 이어진 축제로, 아사쿠사・후추와 함께 '간토 3대 도리노이치'로 꼽혀요.\n\n올해(2026년)는 11월 7일과 19일로 끝났고, 다음은 내년 11월이에요.\n\n📌 저장해 두고 내년 11월에 꺼내 보세요\n💬 행운의 갈퀴, 사 보고 싶나요? 댓글로 알려 주세요\n\n#신주쿠 #도쿄여행 #일본축제 #일본여행 #파워스폿",
 'fr': "Que se passe-t-il dans ce sanctuaire de Tokyo la nuit ? 🏮\n\nC’est le Tori-no-ichi du sanctuaire Hanazono, à Shinjuku, filmé cette année par notre guide Akki @nigihayahi03. Chaque novembre, les jours du Coq, des stands vendent des kumade, des râteaux décorés censés « ratisser » la chance et la prospérité. La fête existe ici depuis l’ère Meiji et compte parmi les trois grands Tori-no-ichi de la région du Kantō.\n\nLes dates de cette année (7 et 19 novembre) sont passées. Prochaine édition : novembre 2027.\n\n📌 Enregistrez-le pour novembre prochain\n💬 Vous achèteriez un râteau porte-bonheur ? Oui ou non ?\n\n#Shinjuku #Tokyo #festivaljapon #voyagejapon #japon",
 'es': "¿Qué pasa en este santuario de Tokio de noche? 🏮\n\nEs el Tori-no-ichi del santuario Hanazono, en Shinjuku, grabado este año por nuestro guía Akki @nigihayahi03. Cada noviembre, en los días del Gallo, los puestos venden kumade, rastrillos decorados que, según la tradición, «atraen» la buena suerte y los buenos negocios. La feria se celebra aquí desde la era Meiji y se cuenta entre las tres grandes de la región de Kanto.\n\nLas fechas de este año (7 y 19 de noviembre) ya pasaron. La próxima: noviembre de 2027.\n\n📌 Guárdalo para el próximo noviembre\n💬 ¿Comprarías un rastrillo de la suerte? ¿Sí o no?\n\n#Shinjuku #Tokio #festivaljapones #viajarajapon #japon",
}

A = SRC + 'sh-a-fall.jpg'; P = SRC + 'sh-a-pool.jpg'; B = SRC + 'sh-b-fall.jpg'
SG = SRC + 'sh-b-sign.jpg'; AK = SRC + 'sh-b-akki.jpg'
# ---------- 12/4 日光・白滝（本人の顔が写る写真 sh-b-akki は海外向けアカウントだけ） ----------
SH = {
 'jp': [S(A, 2.5, '落ち葉の山道に、\nこの滝', ''),
        S(SG, 2, '日光の「白滝」', '日塩もみじライン沿い'),
        S(P, 2, '滝つぼは\n落ち葉でいっぱい', '今年の晩秋に撮影', x=0.4),
        S(B, 2, '保存して、\n次のドライブに', '')],
 'st': [S(B, 2.5, '鬼怒川から山道を\n走った先に', ''),
        S(SG, 2, '日光の「白滝」', '白い糸のように落ちる滝', x=0.4),
        S(P, 2, '落ち葉の滝つぼ', '今年の晩秋', x=0.7),
        S(A, 2, '保存して、次の旅に', '')],
 'en': [S(AK, 2.5, 'A waterfall along a mountain road?', ''),
        S(A, 2, 'Shirataki Falls, Nikko', 'On the Nichien Momiji Line'),
        S(P, 2, 'A pool full of fallen leaves', 'Shot this late autumn', x=0.25),
        S(SG, 2, 'Save it for your road trip', '')],
 'zh': [S(B, 2.5, '日光山路旁，\n有這樣一座瀑布', ''),
        S(AK, 2, '我們的嚮導 Akki', '今年晚秋拍攝'),
        S(P, 2, '水潭鋪滿落葉', '', x=0.55),
        S(SG, 2, '先收藏，下次自駕去', '', x=0.6)],
 'ko': [S(P, 2.5, '낙엽 가득한 이 폭포,\n어디일까요?', '', x=0.85),
        S(A, 2, '닛코 시라타키 폭포', '닛시오 모미지 라인 옆'),
        S(AK, 2, '가이드 Akki가 다녀왔어요', '올해 늦가을'),
        S(B, 2, '저장해 두고 드라이브 때', '')],
 'fr': [S(SG, 2.5, 'Que dit ce panneau ?', ''),
        S(B, 2, '« Shirataki » : la cascade blanche', 'Nikkō, Tochigi'),
        S(P, 2, 'Un bassin couvert de feuilles', '', x=0.1),
        S(AK, 2, 'Enregistrez pour votre voyage', 'Notre guide Akki')],
 'es': [S(AK, 2.5, '¿Una cascada junto a la carretera?', ''),
        S(SG, 2, 'Shirataki = «cascada blanca»', 'Nikko, Tochigi', x=0.45),
        S(A, 2, 'Cae como hilos blancos', ''),
        S(P, 2, 'Guárdalo para tu viaje', '', x=0.6)],
}
SCAP = {
 'jp': "落ち葉の山道に、こんな滝があります🍂\n\n栃木県日光市の「白滝」。鬼怒川温泉と塩原温泉を結ぶ「日塩もみじライン」沿いにあり、近くに茶屋と駐車場があります。何本もの白い糸が重なって落ちるように見えることから、この名前がついたそうです。写真はアッキーが今年の晩秋に撮りました。\n\n📌 保存して、次のドライブの候補に\n💬 滝を見ると落ち着く人は「🍂」でコメントしてね\n\n#白滝 #日光 #日塩もみじライン #滝 #パワースポット",
 'st': "鬼怒川から山道を走った先で出会った滝です🍂\n\n日光市の「白滝」。日塩もみじライン沿いにあります。何本もの白い糸が重なって落ちるように見えることが名前の由来だそうです。今年の晩秋、滝つぼは落ち葉でいっぱいでした。\n\n📌 保存して、次の旅に\n💬 好きな滝はありますか？\n\n#白滝 #日光 #日塩もみじライン #滝 #高次元ネゴシエイター",
 'en': "A waterfall along a mountain road? 🍂\n\nThis is Shirataki Falls in Nikko, Tochigi, visited this late autumn by our guide Akki @nigihayahi03. It sits along the Nichien Momiji Line, the road between Kinugawa Onsen and Shiobara Onsen, with a teahouse and parking nearby. The name means \"white falls\": the water looks like many white threads falling together.\n\n📌 Save it for your Japan road trip\n💬 Waterfalls or hot springs? Tell us which\n\n#Nikko #Tochigi #waterfall #japantravel #powerspot",
 'zh': "日光山路旁，有這樣一座瀑布🍂\n\n這是栃木縣日光市的「白瀧」，由我們的嚮導 Akki @nigihayahi03 今年晚秋拍攝。瀑布位於連接鬼怒川溫泉和鹽原溫泉的「日鹽紅葉線」旁，附近有茶屋和停車場。據說因為水流看起來像許多白線重疊落下，所以叫「白瀧」。\n\n📌 先收藏，下次自駕用得到\n💬 瀑布和溫泉，你選哪一個？\n\n#日光 #栃木 #日本瀑布 #日本自駕 #日本旅遊",
 'ko': "낙엽 가득한 이 폭포, 어디일까요? 🍂\n\n도치기현 닛코시의 '시라타키(白滝)'예요. 저희 가이드 Akki @nigihayahi03 가 올해 늦가을에 다녀왔어요. 기누가와 온천과 시오바라 온천을 잇는 '닛시오 모미지 라인' 옆에 있고, 근처에 찻집과 주차장이 있어요. 하얀 실이 여러 가닥 겹쳐 떨어지는 것처럼 보여서 이런 이름이 붙었대요.\n\n📌 저장해 두고 일본 드라이브 때 보세요\n💬 폭포 vs 온천, 어느 쪽이 좋아요?\n\n#닛코 #도치기 #일본폭포 #일본여행 #파워스폿",
 'fr': "Que dit ce panneau ? 🍂\n\n« Shirataki », la « cascade blanche ». Elle se trouve à Nikkō (Tochigi), le long de la Nichien Momiji Line, la route entre Kinugawa Onsen et Shiobara Onsen, avec un salon de thé et un parking à côté. Son nom vient de l’eau qui semble tomber en de nombreux fils blancs. Photos prises cet automne par notre guide Akki @nigihayahi03.\n\n📌 Enregistrez-le pour votre road trip au Japon\n💬 Cascades ou sources chaudes ? Dites-nous\n\n#Nikko #Tochigi #cascade #voyagejapon #japon",
 'es': "¿Una cascada junto a la carretera? 🍂\n\nEs Shirataki, la «cascada blanca», en Nikko (Tochigi), que nuestro guía Akki @nigihayahi03 visitó este otoño. Está junto a la Nichien Momiji Line, la carretera entre Kinugawa Onsen y Shiobara Onsen, con una casa de té y aparcamiento al lado. Su nombre viene del agua, que parece caer como muchos hilos blancos.\n\n📌 Guárdalo para tu viaje por carretera en Japón\n💬 ¿Cascadas o aguas termales? Cuéntanos\n\n#Nikko #Tochigi #cascada #viajarajapon #japon",
}

posts = []
for day, plan, cap in [('12-01', HZ, HCAP), ('12-04', SH, SCAP)]:
    for lang, shots in plan.items():
        f = f'rx-{day}-{lang}.mp4'
        if '--skip' not in sys.argv or not os.path.exists(OUT + f):
            make(OUT + f, shots, HANDLE[lang])
        posts.append({'lang': lang, 'brand': BRAND[lang], 'date': day, 'time': TIME[lang], 'type': 'TRIAL_REEL',
                      'file': f, 'text': cap[lang]})
        print('ok', f)
json.dump(posts, open(IG + 'w3x/posts.json', 'w'), ensure_ascii=False, indent=1)
