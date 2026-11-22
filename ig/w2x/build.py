# 2026-11-22 本人「12月7日からでは遅い」→ 今週から新方式のお試しリール(TRIAL_REEL)を追加
# 11/24 鬼怒川(アッキー撮影の動画と写真) / 11/27 報徳二宮神社(アッキー撮影の動画と写真)
import json, os, sys
sys.path.insert(0, '/home/claude/japan-power-spots/ig/reels')
from hook import make

IG = '/home/claude/japan-power-spots/ig/'
O = IG + 'own/'
K = O + 'kinugawa-bridge-pan.mp4'
V = O + 'hotoku-ninomiya-pan.mp4'
OUT = IG + 'w2x/out/'; os.makedirs(OUT, exist_ok=True)
HANDLE = {'jp': '@japan_psj_jp', 'st': '@nigihayahi03', 'en': '@japan_psj', 'zh': '@japan_psj_tw',
          'ko': '@japan_psj_kr', 'fr': '@japan_psj_fr', 'es': '@japan_psj_es'}
BRAND = {'en': 8007581, 'zh': 8008367, 'ko': 8023628, 'fr': 8023857, 'es': 8050134, 'jp': 8050350, 'st': 7861854}
TIME = {'jp': '19:00', 'st': '19:30', 'zh': '19:00', 'ko': '19:00', 'en': '21:00', 'fr': '17:00', 'es': '17:00'}


def S(src, dur, big='', small='', t=0, x=0.5):
    return {'src': src, 't': t, 'x': x, 'dur': dur, 'big': big, 'small': small}


# ---------- 11/24 鬼怒川 ----------
KIN = {
 'jp': [S(K, 2.5, 'この渓谷、\nどこだと思う？', '', 0.5, 0.3),
        S(K, 2, '栃木・鬼怒川温泉', '浅草から特急で約2時間', 5, 0.75),
        S(O+'kinugawa-momiji1.jpg', 2, '温泉街の紅葉', 'アッキーが今年の秋に撮影'),
        S(K, 2, '保存して、次の旅に', '行きたい人に送ってね', 23, 0.5)],
 'st': [S(K, 2.5, '僕が橋の上で見た景色', 'どこか分かりますか？', 2, 0.5),
        S(O+'kinugawa-momiji2.jpg', 2, '栃木・鬼怒川温泉', '温泉街の紅葉'),
        S(O+'kinugawa-momiji-street.jpg', 2, '通りのもみじも真っ赤', '浅草から特急で約2時間'),
        S(K, 2, '保存して、次の旅に', '', 25, 0.4)],
 'en': [S(K, 2.5, 'Guess where this is in Japan?', '', 1, 0.55),
        S(O+'kinugawa-gorge.jpg', 2, 'Kinugawa Onsen, Nikko', 'About 2 hrs from Asakusa by train', x=0.7),
        S(O+'kinugawa-yuba-soba.jpg', 2, 'Lunch: yuba soba', 'A Nikko specialty'),
        S(K, 2, 'Save it for your trip', 'Send it to a travel buddy', 6, 0.7)],
 'zh': [S(K, 2.5, '猜猜這是日本哪裡？', '', 3, 0.2),
        S(K, 2, '栃木・鬼怒川溫泉', '從淺草搭特急約2小時', 17, 0.7),
        S(O+'kinugawa-sky.jpg', 2, '溪谷旁就是溫泉旅館', '', x=0.8),
        S(K, 2, '先收藏，下次去', '傳給想去的朋友', 8, 0.6)],
 'ko': [S(K, 2.5, '여기 일본 어디일까요?', '', 4, 0.45),
        S(O+'kinugawa-gorge-sky.jpg', 2, '도치기 기누가와 온천', '아사쿠사에서 특급으로 약 2시간', x=0.8),
        S(K, 2, '다리 위에서 본 온천 마을', '', 20, 0.3),
        S(K, 2, '저장해 두고 꼭 가 보세요', '같이 갈 친구에게 공유', 0, 0.7)],
 'fr': [S(K, 2.5, 'Devinez où c’est au Japon ?', '', 6, 0.3),
        S(O+'kinugawa.jpg', 2, 'Kinugawa Onsen, Nikkō', 'À 2 h d’Asakusa en train', x=0.7),
        S(K, 2, 'Les auberges au bord des gorges', '', 24, 0.6),
        S(K, 2, 'Enregistrez pour votre voyage', 'Envoyez-le à un ami', 1.5, 0.2)],
 'es': [S(K, 2.5, '¿Adivinas dónde es esto en Japón?', '', 7, 0.5),
        S(K, 2, 'Kinugawa Onsen, Nikko', 'A 2 h de Asakusa en tren', 22, 0.8),
        S(O+'kinugawa-sakuranamiki-stone.jpg', 2, 'Un pilar con cara de oni', 'en la calle del pueblo termal'),
        S(K, 2, 'Guárdalo para tu viaje', 'Envíaselo a quien viajaría contigo', 3.5, 0.4)],
}
KCAP = {
 'jp': "この渓谷、どこだと思いますか？🍁\n\n答えは、栃木の鬼怒川温泉。アッキーが今年の秋、橋の上から撮りました。\n浅草から東武特急で約2時間。渓谷のすぐ上に温泉宿が並んでいます。\n\n📌 保存して、次の旅の候補に\n💬 行ったことがある人は「行った」とコメントしてね\n\n#鬼怒川温泉 #日光 #紅葉 #温泉旅行 #パワースポット",
 'st': "今年の秋、僕が鬼怒川の橋の上で見た景色です🍁\n\n温泉街のもみじも真っ赤でした。浅草から東武特急で約2時間。\n\n📌 保存して、次の旅の候補に\n💬 鬼怒川に行ったことはありますか？\n\n#鬼怒川温泉 #日光 #紅葉 #温泉旅行 #高次元ネゴシエイター",
 'en': "Guess where this is? 🍁\n\nIt's Kinugawa Onsen in Nikko, filmed by our guide Akki @nigihayahi03 this autumn. Hot spring hotels sit right above the gorge, about 2 hours from Asakusa by Tobu limited express. Lunch tip: yuba soba, a Nikko specialty.\n\n📌 Save it for your Japan trip\n💬 Would you stay here? Yes or no?\n\n#Nikko #Kinugawa #onsen #japantravel #autumninjapan",
 'zh': "猜猜這是日本哪裡？🍁\n\n答案是栃木縣的鬼怒川溫泉，由我們的嚮導 Akki @nigihayahi03 今年秋天在橋上拍攝。溪谷正上方就是溫泉旅館，從淺草搭東武特急約2小時。\n\n📌 先收藏，下次去日本用得到\n💬 你會想住這裡嗎？留言告訴我們\n\n#鬼怒川溫泉 #日光 #日本紅葉 #日本溫泉 #日本旅遊",
 'ko': "여기 일본 어디일까요? 🍁\n\n정답은 도치기현 기누가와 온천! 저희 가이드 Akki @nigihayahi03 가 올가을 다리 위에서 찍었어요. 계곡 바로 위에 온천 숙소가 늘어서 있고, 아사쿠사에서 도부 특급으로 약 2시간이에요.\n\n📌 저장해 두고 일본 여행 때 꺼내 보세요\n💬 여기서 묵어 보고 싶나요? 댓글로 알려 주세요\n\n#기누가와온천 #닛코 #일본단풍 #일본온천 #일본여행",
 'fr': "Devinez où c’est ? 🍁\n\nC’est Kinugawa Onsen, à Nikkō, filmé cet automne par notre guide Akki @nigihayahi03. Les auberges thermales dominent les gorges, à environ 2 heures d’Asakusa en train express Tobu.\n\n📌 Enregistrez-le pour votre voyage au Japon\n💬 Vous dormiriez ici ? Oui ou non ?\n\n#Nikko #Kinugawa #onsen #voyagejapon #japon",
 'es': "¿Adivinas dónde es? 🍁\n\nEs Kinugawa Onsen, en Nikko, grabado este otoño por nuestro guía Akki @nigihayahi03. Los hoteles termales están justo sobre el desfiladero, a unas 2 horas de Asakusa en el tren expreso de Tobu.\n\n📌 Guárdalo para tu viaje a Japón\n💬 ¿Te quedarías aquí? ¿Sí o no?\n\n#Nikko #Kinugawa #onsen #viajarajapon #japon",
}

# ---------- 11/27 報徳二宮神社 ----------
HO = {
 'jp': [S(V, 2.5, '学問と経営の神様、\n知ってる？', '', 10, 0.5),
        S(O+'hotoku-ninomiya-01.jpg', 2, '栃木・日光市今市', '報徳二宮神社'),
        S(O+'hotoku-ninomiya-09.jpg', 2, '「報徳」と刻まれた像', ''),
        S(V, 2, '保存して、\nお参りの参考に', '二宮尊徳翁をまつる神社', 18, 0.5)],
 'st': [S(V, 2.5, '経営の神様に会いに行った', '', 13, 0.5),
        S(O+'hotoku-ninomiya-02.jpg', 2, '栃木・報徳二宮神社', '二宮尊徳翁をまつる'),
        S(O+'hotoku-ninomiya-08.jpg', 2, '境内の像', '台座に「報徳」の文字'),
        S(V, 2, '保存して、次のお参りに', '', 20, 0.4)],
 'en': [S(V, 2.5, 'A shrine for study and business?', '', 11, 0.4),
        S(O+'hotoku-ninomiya-12.jpg', 2, 'Hotoku Ninomiya Shrine', 'Nikko, Tochigi'),
        S(O+'hotoku-ninomiya-03.jpg', 2, 'The main hall', 'Honoring Ninomiya Sontoku'),
        S(V, 2, 'Save it for your trip', 'Send it to a friend who needs luck', 19, 0.6)],
 'zh': [S(V, 2.5, '祈求學業和事業的神社？', '', 14, 0.55),
        S(O+'hotoku-ninomiya-11.jpg', 2, '栃木・報德二宮神社', '日光市今市'),
        S(O+'hotoku-ninomiya-04.jpg', 2, '神社的社殿', '供奉二宮尊德'),
        S(V, 2, '先收藏，下次去參拜', '', 21, 0.5)],
 'ko': [S(V, 2.5, '학업과 사업의 신을 모신 신사?', '', 15, 0.5),
        S(O+'hotoku-ninomiya-13.jpg', 2, '도치기 호토쿠니노미야 신사', '닛코시 이마이치'),
        S(V, 2, '니노미야 손토쿠를 모신 곳', '', 19, 0.45),
        S(V, 2, '저장해 두고 참배 때 보세요', '', 17.5, 0.5)],
 'fr': [S(V, 2.5, 'Un sanctuaire pour les études et les affaires ?', '', 1, 0.3),
        S(O+'hotoku-ninomiya-14.jpg', 2, 'Sanctuaire Hōtoku Ninomiya', 'Nikkō, Tochigi'),
        S(V, 2, 'Dédié à Ninomiya Sontoku', '', 16, 0.5),
        S(V, 2, 'Enregistrez pour votre voyage', '', 19.5, 0.55)],
 'es': [S(V, 2.5, '¿Un santuario para estudios y negocios?', '', 4, 0.6),
        S(V, 2, 'Santuario Hotoku Ninomiya', 'Nikko, Tochigi', 12, 0.45),
        S(V, 2, 'Dedicado a Ninomiya Sontoku', '', 18, 0.5),
        S(V, 2, 'Guárdalo para tu viaje', '', 20, 0.4)],
}
HCAP = {
 'jp': "学問と経営の神様をまつる神社、知っていますか？⛩\n\n栃木県日光市今市の「報徳二宮神社」。境内の看板には「学問・経営の神 二宮尊徳翁を祀る」とあります。アッキーが先日お参りしてきました。\n\n📌 保存して、お参りの参考に\n💬 受験や仕事で願いごとがある人は「🙏」でコメントしてね\n\n#報徳二宮神社 #日光 #二宮尊徳 #神社巡り #パワースポット",
 'st': "経営の神様に会いに行ってきました⛩\n\n栃木県日光市今市の「報徳二宮神社」。看板には「学問・経営の神 二宮尊徳翁を祀る」とあります。\n\n📌 保存して、次のお参りに\n💬 仕事の神様、あなたはどこにお参りしますか？\n\n#報徳二宮神社 #日光 #二宮尊徳 #神社巡り #高次元ネゴシエイター",
 'en': "A shrine for study and business luck? ⛩\n\nThis is Hotoku Ninomiya Shrine in Nikko, Tochigi, recently visited by our guide Akki @nigihayahi03. A sign at the shrine says it honors Ninomiya Sontoku as a deity of learning and business.\n\n📌 Save it for your Japan trip\n💬 Studying or starting a business? Drop a 🙏\n\n#Nikko #Tochigi #japaneseshrine #japantravel #powerspot",
 'zh': "祈求學業和事業的神社？⛩\n\n這是栃木縣日光市今市的「報德二宮神社」，我們的嚮導 Akki @nigihayahi03 最近去參拜了。神社的看板寫著，這裡供奉的是「學問・經營之神」二宮尊德翁。\n\n📌 先收藏，下次去參拜\n💬 有考試或工作上的心願嗎？留言「🙏」\n\n#報德二宮神社 #日光 #日本神社 #日本旅遊 #能量景點",
 'ko': "학업과 사업의 신을 모신 신사? ⛩\n\n도치기현 닛코시 이마이치의 '호토쿠니노미야 신사'예요. 저희 가이드 Akki @nigihayahi03 가 최근 다녀왔어요. 신사 안내판에는 '학문・경영의 신' 니노미야 손토쿠를 모신다고 적혀 있어요.\n\n📌 저장해 두고 참배 때 보세요\n💬 시험이나 일에 소원이 있다면 '🙏' 댓글\n\n#닛코 #도치기 #일본신사 #일본여행 #파워스폿",
 'fr': "Un sanctuaire pour les études et les affaires ? ⛩\n\nVoici le sanctuaire Hōtoku Ninomiya, à Nikkō (Tochigi), visité récemment par notre guide Akki @nigihayahi03. Un panneau indique qu’il est dédié à Ninomiya Sontoku, divinité de l’étude et des affaires.\n\n📌 Enregistrez-le pour votre voyage au Japon\n💬 Un examen ou un projet en tête ? Laissez un 🙏\n\n#Nikko #Tochigi #sanctuaire #voyagejapon #japon",
 'es': "¿Un santuario para los estudios y los negocios? ⛩\n\nEs el santuario Hotoku Ninomiya, en Nikko (Tochigi), que nuestro guía Akki @nigihayahi03 visitó hace poco. Un cartel del santuario dice que está dedicado a Ninomiya Sontoku, deidad del estudio y los negocios.\n\n📌 Guárdalo para tu viaje a Japón\n💬 ¿Un examen o un proyecto? Deja un 🙏\n\n#Nikko #Tochigi #santuario #viajarajapon #japon",
}

posts = []
for day, plan, cap in [('11-24', KIN, KCAP), ('11-27', HO, HCAP)]:
    for lang, shots in plan.items():
        f = f'rx-{day}-{lang}.mp4'
        if '--skip' not in sys.argv or not os.path.exists(OUT + f):
            make(OUT + f, shots, HANDLE[lang])
        posts.append({'lang': lang, 'brand': BRAND[lang], 'date': day, 'time': TIME[lang], 'type': 'TRIAL_REEL',
                      'file': f, 'text': cap[lang]})
        print('ok', f)
json.dump(posts, open(IG + 'w2x/posts.json', 'w'), ensure_ascii=False, indent=1)
