# 2026-12-07〜12-13 の週(w4)のリール 4本 × 7アカウント
# 月 12/7 TRIAL_REEL 報徳二宮神社(アッキー撮影の動画・写真。11/27 と別の区間・別の写真)
# 水 12/9 REEL 伊勢神宮の夜明け(st は水晶)
# 金 12/11 TRIAL_REEL 箱根神社
# 土 12/12 REEL 出雲大社(海外5)/ 鹿島神宮の御手洗池(jp・st)
# 事実の出典は w4/sources.md
import json, os, sys
sys.path.insert(0, '/home/claude/japan-power-spots/ig/reels')
from hook import make

IG = '/home/claude/japan-power-spots/ig/'
O = IG + 'own/'; L = O + 'lib/'; SR = IG + 'w4/src/'; STL = IG + 'stones/lib/'
OUT = IG + 'w4/out/'; os.makedirs(OUT, exist_ok=True)
HANDLE = {'jp': '@japan_psj_jp', 'st': '@nigihayahi03', 'en': '@japan_psj', 'zh': '@japan_psj_tw',
          'ko': '@japan_psj_kr', 'fr': '@japan_psj_fr', 'es': '@japan_psj_es'}
BRAND = {'en': 8007581, 'zh': 8008367, 'ko': 8023628, 'fr': 8023857, 'es': 8050134, 'jp': 8050350, 'st': 7861854}
TIME = {'jp': '19:00', 'st': '19:30', 'zh': '19:00', 'ko': '19:00', 'en': '21:00', 'fr': '17:00', 'es': '17:00'}


def S(src, dur, big='', small='', t=0, x=0.5):
    return {'src': src, 't': t, 'x': x, 'dur': dur, 'big': big, 'small': small}


AK = '\n\nAkki, the Higher-Dimensional Negotiator @nigihayahi03'
JPG = '\n\n案内人：高次元ネゴシエイター アッキー @nigihayahi03'

# ---------- 月 12/7 報徳二宮神社 ----------
V = O + 'hotoku-ninomiya-pan.mp4'
H = lambda n: O + f'hotoku-ninomiya-{n:02d}.jpg'
MON = {
 'jp': [S(V, 2.5, '二宮金次郎の\nお墓がある神社？', '', 6.5, 0.5),
        S(H(10), 2, '栃木・日光市今市の\n報徳二宮神社', '今年の秋、アッキーが撮影', x=0.3),
        S(V, 2, '合格祈願にも', '東武・下今市駅から歩いて3分', 3, 0.45),
        S(V, 2, '保存して、\n冬休みのお参りに', '', 8.5, 0.6)],
 'st': [S(V, 2.5, '二宮金次郎のお墓に\nお参りしてきました', '', 5, 0.4),
        S(H(7), 2, '境内の小さなお社', '', x=0.35),
        S(H(5), 2, '看板には\n「学問・経営の神」', '', x=0.5),
        S(V, 2, '保存して、次のお参りに', '', 0.5, 0.5)],
 'en': [S(V, 2.5, 'Whose grave is at this shrine?', '', 7, 0.55),
        S(H(10), 2, 'Ninomiya Sontoku (Kinjiro)', 'Edo-period farm reformer, died here in 1856', x=0.7),
        S(V, 2, 'Hotoku Ninomiya Shrine, Nikko', '3 min walk from Shimo-Imaichi Sta.', 4.5, 0.6),
        S(V, 2, 'Save it for your Nikko trip', '', 0.2, 0.5)],
 'zh': [S(V, 2.5, '這間神社裡，\n有二宮金次郎的墓？', '', 8, 0.4),
        S(H(10), 2, '栃木・日光市今市', '報德二宮神社', x=0.5),
        S(V, 2, '江戶時代的農政家', '1856年在今市過世', 2, 0.55),
        S(V, 2, '先收藏，去日光時用', '', 1, 0.45)],
 'ko': [S(V, 2.5, '이 신사에는\n누구의 묘가 있을까요?', '', 5.5, 0.6),
        S(H(5), 2, '「학업・경영의 신」', '경내 안내판', x=0.45),
        S(V, 2, '니노미야 손토쿠(긴지로)', '1856년 이곳 이마이치에서 별세', 3.5, 0.4),
        S(V, 2, '저장해 두고 닛코 여행 때', '', 0.5, 0.55)],
 'fr': [S(V, 2.5, 'Quelle tombe se cache ici ?', '', 9, 0.5),
        S(H(7), 2, 'Un petit sanctuaire dans l’enceinte', '', x=0.6),
        S(V, 2, 'Sanctuaire Hōtoku Ninomiya', 'Nikkō · Ninomiya Sontoku, mort ici en 1856', 1.5, 0.6),
        S(V, 2, 'Enregistrez pour Nikkō', '', 6, 0.35)],
 'es': [S(V, 2.5, '¿De quién es la tumba de este santuario?', '', 7.5, 0.45),
        S(H(5), 2, '«Dios del estudio y los negocios»', 'dice el cartel', x=0.55),
        S(V, 2, 'Ninomiya Sontoku (Kinjiro)', 'reformador agrícola, murió aquí en 1856', 4, 0.35),
        S(V, 2, 'Guárdalo para tu viaje a Nikko', '', 5, 0.5)],
}
MONCAP = {
 'jp': "二宮金次郎のお墓がある神社、知っていましたか？⛩\n\n栃木県日光市今市の「報徳二宮神社」。二宮尊徳（金次郎）は、1856年にこの今市で亡くなりました。境内の看板によると、尊徳翁のお墓は県指定史跡。神社は「学問・経営の神」として尊徳翁をまつっています。\n\n東武・下今市駅から歩いて約3分。動画と写真は、アッキーが今年の秋にお参りしたときのものです。\n\n📌 保存して、冬休みのお参りの候補に\n💬 薪を背負って本を読む金次郎の像、学校にありましたか？" + JPG + "\n\n#報徳二宮神社 #二宮金次郎 #日光 #合格祈願 #パワースポット",
 'st': "今年の秋、二宮金次郎（尊徳）のお墓にお参りしてきました⛩\n\n栃木県日光市今市の「報徳二宮神社」。尊徳翁は1856年にこの今市で亡くなっていて、境内のお墓は県指定史跡になっています。看板には「学問・経営の神」の文字。\n\n東武・下今市駅から歩いて約3分です。\n\n📌 保存して、日光に行くときに\n💬 金次郎の像、あなたの学校にもありましたか？\n\n#報徳二宮神社 #二宮金次郎 #日光 #神社巡り #高次元ネゴシエイター",
 'en': "Whose grave is at this shrine? ⛩\n\nIt's Ninomiya Sontoku, also known as Kinjiro, an Edo-period farm reformer. Many Japanese schools have a statue of him as a boy, reading a book while carrying firewood. He died here in Imaichi, Nikko, in 1856. Hotoku Ninomiya Shrine enshrines him as a god of study and business, and its grounds hold his grave, a Tochigi Prefecture historic site.\n\nOur guide Akki @nigihayahi03 filmed this visit this autumn. It's a 3-minute walk from Shimo-Imaichi Station (Tobu line), on the way to Nikko.\n\n📌 Save it for your Nikko trip\n💬 Would you pray for study or for business?\n\n#Nikko #Tochigi #japaneseshrine #japantravel #powerspot",
 'zh': "這間神社裡，有二宮金次郎的墓？⛩\n\n栃木縣日光市今市的「報德二宮神社」。二宮尊德（金次郎）是日本江戶時代的農政家，日本很多學校都有他背著柴薪、邊走邊讀書的銅像。他在1856年於今市過世，境內有他的墓，是栃木縣指定史跡。神社把他奉為「學業與經營之神」。\n\n影片和照片是我們的嚮導 Akki @nigihayahi03 今年秋天參拜時拍的。從東武「下今市站」步行約3分鐘，去日光的路上就能順道參拜。\n\n📌 先收藏，去日光時用得到\n💬 你會祈求學業，還是事業？\n\n#日光 #栃木 #日本神社 #日本旅遊 #能量景點",
 'ko': "이 신사에는 누구의 묘가 있을까요? ⛩\n\n정답은 니노미야 손토쿠(긴지로). 에도 시대의 농정가로, 일본의 많은 학교에 땔감을 지고 책을 읽는 소년 긴지로의 동상이 있어요. 그는 1856년 닛코시 이마이치에서 세상을 떠났고, 이곳 '호토쿠 니노미야 신사' 경내에 그의 묘(도치기현 지정 사적)가 있어요. 신사는 그를 '학업・경영의 신'으로 모시고 있어요.\n\n영상과 사진은 저희 가이드 Akki @nigihayahi03 가 올가을 참배하며 찍었어요. 도부선 시모이마이치역에서 걸어서 약 3분이에요.\n\n📌 저장해 두고 닛코 여행 때 보세요\n💬 학업 vs 사업, 어떤 소원을 빌고 싶나요?\n\n#닛코 #도치기 #일본신사 #일본여행 #파워스폿",
 'fr': "Quelle tombe se cache dans ce sanctuaire ? ⛩\n\nCelle de Ninomiya Sontoku, dit Kinjirō, réformateur agricole de l’époque d’Edo. Beaucoup d’écoles japonaises ont sa statue : un garçon qui lit en portant du bois sur son dos. Il est mort ici, à Imaichi (Nikkō), en 1856. Le sanctuaire Hōtoku Ninomiya l’honore comme dieu des études et des affaires, et sa tombe, dans l’enceinte, est classée site historique de la préfecture de Tochigi.\n\nVidéo et photos prises cet automne par notre guide Akki @nigihayahi03. À 3 minutes à pied de la gare de Shimo-Imaichi (ligne Tobu), sur la route de Nikkō.\n\n📌 Enregistrez-le pour votre voyage à Nikkō\n💬 Vous prieriez pour les études ou pour le travail ?\n\n#Nikko #Tochigi #sanctuaire #voyagejapon #japon",
 'es': "¿De quién es la tumba de este santuario? ⛩\n\nDe Ninomiya Sontoku, conocido como Kinjiro, reformador agrícola de la época Edo. Muchas escuelas japonesas tienen su estatua: un niño que lee mientras carga leña. Murió aquí, en Imaichi (Nikko), en 1856. El santuario Hotoku Ninomiya lo venera como dios del estudio y los negocios, y su tumba, dentro del recinto, es sitio histórico de la prefectura de Tochigi.\n\nVídeo y fotos de nuestro guía Akki @nigihayahi03, tomados este otoño. Está a 3 minutos a pie de la estación Shimo-Imaichi (línea Tobu), de camino a Nikko.\n\n📌 Guárdalo para tu viaje a Nikko\n💬 ¿Pedirías por los estudios o por el trabajo?\n\n#Nikko #Tochigi #santuario #viajarajapon #japon",
}

# ---------- 水 12/9 伊勢神宮の夜明け(2024年11月 アッキー撮影) / st は水晶 ----------
I = lambda n: L + f'ise-dawn-{n}.jpg'
WED = {
 'jp': [S(I(6412), 2.5, '朝5時の伊勢神宮、\n見たことある？', ''),
        S(I(6383), 2, '月がまだ空に', '夜明け前の鳥居', x=0.4),
        S(I(6416), 2, '空が少しずつ\n明るくなっていく', ''),
        S(I(6410), 2, '保存して、\n早起きして行く日に', '10〜12月は5時〜17時')],
 'en': [S(I(6410), 2.5, 'Ise Jingu at 5 a.m.?', ''),
        S(I(6379), 2, 'You can visit from 5:00', 'Oct–Dec: 5:00–17:00', x=0.5),
        S(I(6384), 2, 'The moon is still out', '', x=0.6),
        S(I(6412), 2, 'Save it for an early start', '')],
 'zh': [S(I(6416), 2.5, '清晨5點的伊勢神宮', '你看過嗎？'),
        S(I(6383), 2, '月亮還掛在天上', '', x=0.6),
        S(I(6410), 2, '天空慢慢亮起來', ''),
        S(I(6379), 2, '先收藏，早起去參拜', '10～12月 5:00～17:00', x=0.45)],
 'ko': [S(I(6379), 2.5, '새벽 5시의\n이세 신궁?', '', x=0.55),
        S(I(6412), 2, '하늘이 밝아 오기 시작해요', ''),
        S(I(6384), 2, '아직 하늘에 달이', '', x=0.35),
        S(I(6416), 2, '저장해 두고 일찍 가 보세요', '10~12월 5:00~17:00')],
 'fr': [S(I(6383), 2.5, 'Ise Jingū à 5 h du matin ?', '', x=0.5),
        S(I(6416), 2, 'Le ciel s’éclaircit peu à peu', ''),
        S(I(6379), 2, 'Visite possible dès 5 h', 'oct.–déc. : 5 h–17 h', x=0.4),
        S(I(6410), 2, 'Enregistrez pour un départ matinal', '')],
 'es': [S(I(6384), 2.5, '¿Ise Jingu a las 5 de la mañana?', '', x=0.5),
        S(I(6410), 2, 'Se puede visitar desde las 5:00', 'oct.–dic.: 5:00–17:00'),
        S(I(6412), 2, 'El cielo empieza a clarear', ''),
        S(I(6383), 2, 'Guárdalo para madrugar', '', x=0.3)],
 'st': [S(STL + 'IMG_8621.jpg', 2.5, '水晶を、\n冬の空にかざしてみた', ''),
        S(STL + 'IMG_8618.jpg', 2, '空の青が、\n玉の中に', ''),
        S(STL + 'IMG_8616.jpg', 2, '毎日つけるなら、\n透明な石から', ''),
        S(STL + 'IMG_8622.jpg', 2, '保存して、\n晴れた日に試してね', '')],
}
WEDCAP = {
 'jp': "朝5時の伊勢神宮、見たことはありますか？🌅\n\n伊勢神宮は、10月〜12月は朝5時から夕方5時までお参りできます。夜明け前は人も少なく、月の残る空が、少しずつ明るくなっていきます。\n\n写真は、アッキーが2024年11月の夜明けに撮ったものです。\n\n📌 保存して、早起きして行く日に見返してね\n💬 朝のお参り派？昼のお参り派？" + JPG + "\n\n#伊勢神宮 #早朝参拝 #お伊勢参り #三重 #パワースポット",
 'en': "Ise Jingu at 5 a.m. 🌅\n\nJapan's most sacred shrine opens early: from October to December you can visit from 5:00 to 17:00. Before dawn it's quiet, and the sky slowly turns from night to gold behind the wooden torii.\n\nPhotos by our guide Akki @nigihayahi03, taken at dawn in November 2024.\n\n📌 Save it for an early start in Mie\n💬 Sunrise visit or daytime visit? Tell us\n\n#IseJingu #Mie #japaneseshrine #japantravel #powerspot",
 'zh': "清晨5點的伊勢神宮，你看過嗎？🌅\n\n伊勢神宮在10～12月，從早上5點到下午5點都可以參拜。天亮前人很少，月亮還掛在天上，天空在木造鳥居後方一點一點亮起來。\n\n照片是我們的嚮導 Akki @nigihayahi03 在2024年11月的清晨拍的。\n\n📌 先收藏，早起去參拜時用得到\n💬 你喜歡清晨參拜，還是白天參拜？\n\n#伊勢神宮 #三重 #日本神社 #日本旅遊 #能量景點",
 'ko': "새벽 5시의 이세 신궁, 본 적 있나요? 🌅\n\n이세 신궁은 10~12월에는 아침 5시부터 오후 5시까지 참배할 수 있어요. 해가 뜨기 전에는 사람이 적고, 달이 남은 하늘이 나무 도리이 뒤로 조금씩 밝아져요.\n\n사진은 저희 가이드 Akki @nigihayahi03 가 2024년 11월 새벽에 찍었어요.\n\n📌 저장해 두고 일찍 일어나는 날 보세요\n💬 새벽 참배 vs 낮 참배, 어느 쪽이 좋아요?\n\n#이세신궁 #미에 #일본신사 #일본여행 #파워스폿",
 'fr': "Ise Jingū à 5 h du matin 🌅\n\nLe sanctuaire le plus sacré du Japon se visite tôt : d’octobre à décembre, de 5 h à 17 h. Avant l’aube, il y a peu de monde, et le ciel s’éclaircit peu à peu derrière le torii en bois.\n\nPhotos de notre guide Akki @nigihayahi03, prises à l’aube en novembre 2024.\n\n📌 Enregistrez-le pour un départ matinal\n💬 Plutôt lever du soleil ou visite en journée ?\n\n#IseJingu #Mie #sanctuaire #voyagejapon #japon",
 'es': "Ise Jingu a las 5 de la mañana 🌅\n\nEl santuario más sagrado de Japón abre temprano: de octubre a diciembre se puede visitar de 5:00 a 17:00. Antes del amanecer hay poca gente, y el cielo va clareando detrás del torii de madera.\n\nFotos de nuestro guía Akki @nigihayahi03, tomadas al amanecer en noviembre de 2024.\n\n📌 Guárdalo para madrugar en tu viaje\n💬 ¿Amanecer o visita de día? Cuéntanos\n\n#IseJingu #Mie #santuario #viajarajapon #japon",
 'st': "水晶のブレスレットを、冬の空にかざしてみました💎\n\n透明な玉の中に、空の青がそのまま映ります。迷ったら、まずは透明な水晶から。どんな色の石とも合わせやすく、毎日つけやすい石です。\n\n空気の澄んだ晴れの日に、あなたもかざしてみてくださいね。\n\n📌 保存して、晴れた日に試してね\n💬 あなたのいちばん好きな石は何ですか？\n\n━━━━━━━━━━\n🔮 魂の系統鑑定(無料)\n生年月日を入れるだけで、全94種の「魂の系統」と今年の運勢がわかります。\nあなたにピッタリの天然石ブレスレットもご提案します。\nプロフィールのリンクからどうぞ。\n━━━━━━━━━━\n\n#天然石 #パワーストーン #天然石ブレスレット #魂の系統鑑定 #水晶",
}

# ---------- 金 12/11 箱根神社(2025年2月 アッキー撮影) ----------
K = lambda n: L + f'hakone-{n}.jpg'
TL = SR + 'hk-torii-lake.jpg'; TF = SR + 'hk-torii-forest.jpg'
FRI = {
 'jp': [S(TL, 2.5, '湖のほとりに、\n赤い鳥居', '', x=0.35),
        S(K(9108), 2, '杉並木の参道を\n進むと', ''),
        S(K(9113), 2, '箱根神社', '757年の創建と伝わる古社'),
        S(K(9162), 2, '保存して、\n箱根に行く日に', '')],
 'st': [S(TF, 2.5, '箱根の杉の森で\n出会った鳥居', '', x=0.5),
        S(K(9114), 2, '箱根神社に\nお参り', ''),
        S(K(9155), 2, '境内の朱色のお社', ''),
        S(K(9142), 2, '保存して、次の旅に', '')],
 'en': [S(TL, 2.5, 'A red torii on the shore of Lake Ashi?', '', x=0.6),
        S(K(9106), 2, 'Giant cedars line the way', ''),
        S(K(9116), 2, 'Our guide Akki at Hakone Shrine', 'Founded in 757, says legend'),
        S(K(9075), 2, 'Save it for your Hakone trip', '', x=0.4)],
 'zh': [S(K(9110), 2.5, '冬天的箱根神社，\n要爬這段石階', ''),
        S(K(9114), 2, '箱根神社', '據傳757年創建', x=0.4),
        S(TL, 2, '湖畔的「平和鳥居」', '1952年建立', x=0.2),
        S(K(9142), 2, '先收藏，去箱根時用', '', x=0.6)],
 'ko': [S(TF, 2.5, '삼나무 숲속의\n빨간 도리이?', '', x=0.6),
        S(K(9106), 2, '하늘을 찌르는 삼나무', '', x=0.4),
        S(K(9116), 2, '가이드 Akki가 다녀왔어요', '하코네 신사'),
        S(K(9162), 2, '저장해 두고 하코네 여행 때', '', x=0.7)],
 'fr': [S(K(9106), 2.5, 'Un sanctuaire caché sous les cèdres ?', '', x=0.6),
        S(K(9110), 2, 'Notre guide Akki à Hakone', 'en février'),
        S(K(9113), 2, 'Le sanctuaire de Hakone', 'fondé en 757, selon la tradition', x=0.3),
        S(K(9075), 2, 'Enregistrez pour Hakone', '', x=0.7)],
 'es': [S(K(9108), 2.5, '¿Un camino de cedros hacia un santuario?', '', x=0.4),
        S(K(9114), 2, 'Santuario de Hakone', 'fundado en 757, según la tradición', x=0.6),
        S(K(9123), 2, 'Un pequeño santuario rojo', '', x=0.3),
        S(K(9116), 2, 'Guárdalo para tu viaje', 'Nuestro guía Akki')],
}
FRICAP = {
 'jp': "湖のほとりに立つ、赤い鳥居⛩\n\n神奈川・芦ノ湖のほとりの「箱根神社」。757年に万巻上人がまつったのが始まりと伝わる古社です。湖畔の「平和の鳥居」は、1952年にサンフランシスコ講和条約を記念して建てられました。\n\n杉並木の参道を歩くと、朱色の社殿が見えてきます。箱根湯本駅からバスで約33分、「元箱根」から歩いて約10分。\n写真は、アッキーが2月にお参りしたときのものです。\n\n📌 保存して、箱根に行く日に\n💬 箱根、行ったことはありますか？" + JPG + "\n\n#箱根神社 #平和の鳥居 #芦ノ湖 #箱根 #パワースポット",
 'st': "箱根の杉の森で、赤い鳥居に出会いました⛩\n\n神奈川・芦ノ湖のほとりの「箱根神社」。757年に始まったと伝わる古社です。2月に、お参りしてきました。\n\n杉並木の参道を抜けると、朱色の社殿。境内には、小さな朱色のお社もありました。\n\n📌 保存して、次の旅に\n💬 森の神社と、湖の神社。あなたはどっちが好き？\n\n#箱根神社 #箱根 #芦ノ湖 #神社巡り #高次元ネゴシエイター",
 'en': "A red torii on the shore of Lake Ashi ⛩\n\nHakone Shrine, near Tokyo, was founded in 757 by the monk Mangan, according to legend. Its \"Torii of Peace\" stands by the lake and was built in 1952 to mark the San Francisco Peace Treaty. A path under giant cedars leads up to the vermilion shrine.\n\nOur guide Akki @nigihayahi03 visited in February. Bus from Hakone-Yumoto Station to Moto-Hakone: about 33 min, then a 10-min walk.\n\n📌 Save it for your Hakone trip\n💬 Lake view or cedar forest: which would you photograph first?\n\n#Hakone #HakoneShrine #LakeAshi #japantravel #powerspot",
 'zh': "冬天的箱根神社，要爬這段石階⛩\n\n神奈川縣蘆之湖畔的「箱根神社」，據傳757年由萬卷上人創建。湖畔的「平和鳥居」建於1952年，紀念舊金山和約。走過高聳的杉樹參道，就能看到朱紅色的社殿。\n\n照片是我們的嚮導 Akki @nigihayahi03 2月參拜時拍的。從箱根湯本站搭巴士約33分鐘到「元箱根」，再步行約10分鐘。\n\n📌 先收藏，去箱根時用得到\n💬 湖景和杉林，你會先拍哪一個？\n\n#箱根 #箱根神社 #蘆之湖 #日本旅遊 #能量景點",
 'ko': "삼나무 숲속의 빨간 도리이 ⛩\n\n가나가와현 아시노코 호숫가의 '하코네 신사'. 전설에 따르면 757년 만간 스님이 세웠다고 해요. 호숫가의 '평화의 도리이'는 1952년 샌프란시스코 강화조약을 기념해 세워졌어요. 거대한 삼나무 참배길을 지나면 붉은 사전이 나타나요.\n\n사진은 저희 가이드 Akki @nigihayahi03 가 2월에 다녀오며 찍었어요. 하코네유모토역에서 버스로 약 33분, '모토하코네'에서 걸어서 약 10분.\n\n📌 저장해 두고 하코네 여행 때 보세요\n💬 호수 vs 삼나무 숲, 어디부터 찍고 싶나요?\n\n#하코네 #하코네신사 #아시노코 #일본여행 #파워스폿",
 'fr': "Un sanctuaire caché sous les cèdres ⛩\n\nLe sanctuaire de Hakone, au bord du lac Ashi, aurait été fondé en 757 par le moine Mangan, selon la tradition. Son « torii de la Paix », au bord du lac, date de 1952 et célèbre le traité de paix de San Francisco. Une allée de cèdres géants mène au sanctuaire vermillon.\n\nPhotos de notre guide Akki @nigihayahi03, en février. En bus depuis la gare de Hakone-Yumoto jusqu’à Moto-Hakone : environ 33 min, puis 10 min à pied.\n\n📌 Enregistrez-le pour Hakone\n💬 Le lac ou la forêt de cèdres : vous photographieriez quoi en premier ?\n\n#Hakone #sanctuaire #lacAshi #voyagejapon #japon",
 'es': "¿Un camino de cedros hacia un santuario? ⛩\n\nEl santuario de Hakone, junto al lago Ashi, fue fundado en 757 por el monje Mangan, según la tradición. Su «torii de la Paz», a orillas del lago, se levantó en 1952 para conmemorar el Tratado de Paz de San Francisco. Un camino de cedros gigantes lleva al santuario bermellón.\n\nFotos de nuestro guía Akki @nigihayahi03, en febrero. En autobús desde la estación Hakone-Yumoto hasta Moto-Hakone: unos 33 min, y luego 10 min a pie.\n\n📌 Guárdalo para tu viaje a Hakone\n💬 ¿El lago o el bosque de cedros? ¿Qué fotografiarías primero?\n\n#Hakone #santuario #lagoAshi #viajarajapon #japon",
}

# ---------- 土 12/12 出雲大社(海外5・2025年6月 アッキー撮影) / 鹿島神宮 御手洗池(jp・st) ----------
Z = lambda n: L + f'izumo-{n}.jpg'; ZH = SR + 'iz-haiden.jpg'
P = lambda n: O + f'kashima-pond-0{n}.jpg'
SAT = {
 'en': [S(Z(1994), 2.5, 'Japan’s famous shrine for love?', '', x=0.5),
        S(Z(2036), 2, 'A huge shimenawa rope', 'Our guide Akki', x=0.5),
        S(ZH, 2, 'Here you clap 4 times, not 2', 'Izumo Taisha, Shimane', x=0.55),
        S(Z(2051), 2, 'Save it for your Izumo trip', '', x=0.5)],
 'zh': [S(Z(2036), 2.5, '這條巨大的注連繩，\n在哪裡？', '', x=0.4),
        S(Z(1994), 2, '島根・出雲大社', '祭祀結緣之神大國主大神', x=0.35),
        S(ZH, 2, '參拜要拍手4次', '二禮四拍手一禮', x=0.4),
        S(Z(2051), 2, '先收藏，結緣之旅用得到', '', x=0.6)],
 'ko': [S(ZH, 2.5, '인연의 신을 모신\n신사?', '', x=0.6),
        S(Z(2036), 2, '거대한 금줄(시메나와)', '가이드 Akki', x=0.6),
        S(Z(1994), 2, '시마네 이즈모타이샤', '박수는 2번이 아니라 4번', x=0.55),
        S(Z(2051), 2, '저장해 두고 이즈모 여행 때', '', x=0.35)],
 'fr': [S(Z(1994), 2.5, 'Le sanctuaire des rencontres au Japon ?', '', x=0.6),
        S(ZH, 2, 'Ici, on frappe 4 fois dans ses mains', '', x=0.5),
        S(Z(2036), 2, 'Une immense corde sacrée', 'Notre guide Akki', x=0.35),
        S(Z(2051), 2, 'Enregistrez pour Izumo', '', x=0.45)],
 'es': [S(Z(2036), 2.5, '¿Dónde está esta cuerda gigante?', '', x=0.55),
        S(Z(1994), 2, 'Izumo Taisha, Shimane', 'dios de los lazos, Okuninushi', x=0.45),
        S(Z(2051), 2, 'Aquí se aplaude 4 veces, no 2', '', x=0.55),
        S(ZH, 2, 'Guárdalo para tu viaje', '', x=0.45)],
 'jp': [S(P(3), 2.5, '池の中に、\n鳥居？', '', x=0.6),
        S(P(2), 2, '茨城・鹿島神宮', '', x=0.5),
        S(P(1), 2, '境内の「御手洗池」', '1日40万リットル以上の湧き水といわれる', x=0.5),
        S(SR + 'ks-pond4.jpg', 2, '保存して、\nお参りの日に', '参拝の前に身を清めた池', x=0.5)],
 'st': [S(L + 'katori-kashima-1140.jpg', 2.5, '森の奥の、\n澄んだ池', '', x=0.5),
        S(O + 'kashima-pond-03.jpg', 2, '鹿島神宮の御手洗池', '昔は参拝前にここで禊を', x=0.3),
        S(SR + 'ks-pond5.jpg', 2, '水の中にも鳥居', '', x=0.4),
        S(P(1), 2, '保存して、次のお参りに', '', x=0.8)],
}
SATCAP = {
 'en': "Japan's famous shrine for love and connections ⛩\n\nIzumo Taisha in Shimane enshrines Okuninushi, a god of good relationships of every kind, not only romance. One thing surprises visitors: the custom here is to bow twice, clap FOUR times and bow once, instead of the usual two claps. In the old lunar 10th month, gods from all over Japan are said to gather in Izumo.\n\nPhotos by our guide Akki @nigihayahi03 (June 2025).\n\n📌 Save it for your trip to western Japan\n💬 Would you visit Izumo for love, work or friendship?\n\n#IzumoTaisha #Shimane #japaneseshrine #japantravel #powerspot",
 'zh': "這條巨大的注連繩，在島根的出雲大社⛩\n\n出雲大社祭祀大國主大神，是日本有名的「結緣之神」，不只是戀愛，所有的緣分都包含在內。這裡的參拜方式很特別：一般神社是「二禮二拍手一禮」，出雲大社則是「二禮四拍手一禮」。據說在舊曆10月，全日本的神明都會聚集到出雲。\n\n照片是我們的嚮導 Akki @nigihayahi03 在2025年6月拍的。\n\n📌 先收藏，結緣之旅用得到\n💬 你想求什麼樣的緣分？戀愛、工作還是友情？\n\n#出雲大社 #島根 #結緣 #日本旅遊 #能量景點",
 'ko': "인연의 신을 모신 신사, 시마네의 이즈모타이샤 ⛩\n\n이즈모타이샤는 연애뿐 아니라 모든 '인연'을 맺어 준다는 오쿠니누시노오카미를 모셔요. 참배 방법도 특별해요. 보통 신사는 '두 번 절, 두 번 박수, 한 번 절'이지만, 이곳은 박수를 네 번 쳐요. 음력 10월에는 일본 전국의 신들이 이즈모에 모인다고 전해져요.\n\n사진은 저희 가이드 Akki @nigihayahi03 가 2025년 6월에 찍었어요.\n\n📌 저장해 두고 이즈모 여행 때 보세요\n💬 연애운 vs 일운 vs 우정운, 어떤 인연을 빌고 싶나요?\n\n#이즈모타이샤 #시마네 #인연 #일본여행 #파워스폿",
 'fr': "Le sanctuaire des rencontres au Japon ⛩\n\nIzumo Taisha, dans le Shimane, honore Ōkuninushi, dieu des liens de toutes sortes, pas seulement amoureux. Une coutume surprend : on s’incline deux fois, on frappe QUATRE fois dans ses mains, puis on s’incline une fois (au lieu de deux frappes ailleurs). Au 10e mois de l’ancien calendrier, les dieux de tout le Japon se réuniraient à Izumo.\n\nPhotos de notre guide Akki @nigihayahi03 (juin 2025).\n\n📌 Enregistrez-le pour votre voyage\n💬 Vous iriez à Izumo pour l’amour, le travail ou l’amitié ?\n\n#IzumoTaisha #Shimane #sanctuaire #voyagejapon #japon",
 'es': "¿Dónde está esta cuerda sagrada gigante? ⛩\n\nEn Izumo Taisha (Shimane), dedicado a Okuninushi, dios de los lazos de todo tipo, no solo del amor. Una costumbre sorprende: aquí se hacen dos reverencias, se aplaude CUATRO veces y se hace una reverencia más (en otros santuarios se aplaude dos). En el antiguo décimo mes lunar, se dice que los dioses de todo Japón se reúnen en Izumo.\n\nFotos de nuestro guía Akki @nigihayahi03 (junio de 2025).\n\n📌 Guárdalo para tu viaje\n💬 ¿Irías a Izumo por amor, trabajo o amistad?\n\n#IzumoTaisha #Shimane #santuario #viajarajapon #japon",
 'jp': "池の中に、鳥居があるのを知っていますか？⛩\n\n茨城・鹿島神宮の「御手洗池（みたらしいけ）」。1日に40万リットル以上の水が湧くといわれ、水底まで見えるほど澄んでいます。古くから、参拝の前に身を清める禊の池とされてきました。\n\n写真は、アッキーがお参りしたときのものです。\n\n📌 保存して、お参りの日に見返してね\n💬 鹿島神宮、行ったことはありますか？" + JPG + "\n\n#鹿島神宮 #御手洗池 #茨城 #神社巡り #パワースポット",
 'st': "森の奥に、澄んだ池がありました⛩\n\n茨城・鹿島神宮の「御手洗池」。昔は、お参りの前にこの池で禊をして身を清めたそうです。水の中にも、鳥居が立っていました。\n\n📌 保存して、次のお参りに\n💬 水のある神社、好きですか？\n\n#鹿島神宮 #御手洗池 #茨城 #神社巡り #高次元ネゴシエイター",
}

PLAN = [('12-07', 'TRIAL_REEL', MON, MONCAP), ('12-09', 'REEL', WED, WEDCAP),
        ('12-11', 'TRIAL_REEL', FRI, FRICAP), ('12-12', 'REEL', SAT, SATCAP)]

if __name__ == '__main__':
    posts = []
    only = [a for a in sys.argv[1:] if not a.startswith('-')]
    for day, typ, plan, cap in PLAN:
        for lang, shots in plan.items():
            f = f'r-{day}-{lang}.mp4'
            if (not only or day in only) and ('--skip' not in sys.argv or not os.path.exists(OUT + f)):
                make(OUT + f, shots, HANDLE[lang]); print('made', f)
            posts.append({'lang': lang, 'brand': BRAND[lang], 'date': day, 'time': TIME[lang], 'type': typ,
                          'file': f, 'text': cap[lang], 'collab': (lang == 'jp' and typ == 'REEL')})
    json.dump(posts, open(IG + 'w4/reels.json', 'w'), ensure_ascii=False, indent=1)
    print(len(posts))
