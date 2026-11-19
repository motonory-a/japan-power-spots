# w3 (2026-11-30〜12-06) の投稿内容。事実は確認済みのものだけ（出典は ig/w3/sources.md）。
# 写真：言語アカウントごとに別の写真。own/ と w3/own/ はアッキー本人撮影（鬼怒川特集）。
S = '/home/claude/japan-power-spots/ig/src/'
O = '/home/claude/japan-power-spots/ig/own/'
OW = '/home/claude/japan-power-spots/ig/w3/own/'   # 紅葉1・2は右下の通行人を切り落とした版、vid-* は橋からの動画の静止画
LANGS = ['en', 'zh', 'ko', 'fr', 'es', 'jp']
DATES = {'mon': '11-30', 'tue': '12-01', 'wed': '12-02', 'thu': '12-03', 'fri': '12-04', 'sat': '12-05', 'sun': '12-06'}

PHOTO = {
 'mon': {'en': S+'w3-mon-1.jpg', 'zh': S+'w3-mon-x1.jpg', 'ko': S+'w3-mon-2.jpg', 'fr': S+'w3-mon-6.jpg', 'es': S+'w3-mon-7.jpg', 'jp': S+'w3-mon-10.jpg'},
 'tue': {'en': S+'w3-tue-a1.jpg', 'zh': S+'w3-tue-n1.jpg', 'ko': S+'w3-tue-n2.jpg', 'fr': S+'w3-tue-a3.jpg', 'es': S+'w3-tue-n3.jpg', 'jp': O+'kinugawa-yuba-soba.jpg'},
 'wed': {'en': S+'w3-wed-1.jpg', 'zh': S+'w3-wed-2.jpg', 'ko': S+'w3-wed-x2.jpg', 'fr': S+'w3-wed-4.jpg', 'es': S+'w3-wed-c2.jpg', 'jp': S+'w3-wed-6.jpg'},
 'thu': {'en': S+'w3-thu-7.jpg', 'zh': S+'w3-thu-1.jpg', 'ko': S+'fx-sunset-ko2.jpg', 'fr': S+'w3-thu-6.jpg', 'es': S+'w3-thu-x1.jpg', 'jp': S+'fx-sunset-jp.jpg'},
 'fri': {'en': S+'w3-fri-x1.jpg', 'zh': S+'w3-fri-3.jpg', 'ko': S+'w3-fri-4.jpg', 'fr': S+'w3-fri-1.jpg', 'es': S+'w3-fri-8.jpg', 'jp': S+'fx-hikawa-jp.jpg'},
 'sat': {'en': OW+'momiji1c.jpg', 'zh': O+'kinugawa-momiji-street.jpg', 'ko': OW+'vid-14.jpg', 'fr': O+'kinugawa-sakuranamiki-stone.jpg', 'es': OW+'vid-8.jpg', 'jp': OW+'momiji2c.jpg'},
 'sun': {'en': S+'w3-sun-1.jpg', 'zh': S+'w3-sun-2.jpg', 'ko': S+'w3-sun-4.jpg', 'fr': S+'w3-sun-6.jpg', 'es': S+'w3-thu-3.jpg', 'jp': S+'w3-sun-5.jpg'},
}
FY = {}  # 縦位置の調整 (day, lang): 0〜1

# フィード画像の文字：(小見出し, 題名, 一言)
CARD = {
 'mon': {'en': ('POWER SPOT · SAITAMA', 'Chichibu Night Festival', 'Dec 2–3: floats, lanterns, winter fireworks'),
         'zh': ('能量景點・埼玉', '秩父夜祭', '12月2日・3日，花車與冬季煙火'),
         'ko': ('파워스폿 · 사이타마', '지치부 요마쓰리  秩父夜祭', '12월 2~3일, 수레와 겨울 불꽃놀이'),
         'fr': ('LIEU SACRÉ · SAITAMA', 'Chichibu Yomatsuri  秩父夜祭', 'Les 2 et 3 décembre : chars et feux d’artifice'),
         'es': ('LUGAR SAGRADO · SAITAMA', 'Chichibu Yomatsuri  秩父夜祭', '2 y 3 de diciembre: carrozas y fuegos artificiales'),
         'jp': ('パワースポット・埼玉', '秩父夜祭', '12月2日・3日、冬の夜空に笠鉾と花火')},
 'tue': {'en': ('WINTER TASTE', 'Amazake  甘酒', 'The sweet rice drink of Japanese winter'),
         'zh': ('冬天的味道', '日式鍋物  鍋', '大家圍著一起吃的冬季料理'),
         'ko': ('겨울의 맛', '미조레나베  みぞれ鍋', '눈처럼 소복한 무즙 전골'),
         'fr': ('SAVEUR D’HIVER', 'Amazake  甘酒', 'La douce boisson de riz de l’hiver'),
         'es': ('SABOR DE INVIERNO', 'Nabe  鍋', 'La olla que se comparte en invierno'),
         'jp': ('パワースポットの味・日光', '湯波そば', '日光では「湯葉」を「湯波」と書きます')},
 'wed': {'en': ('POWER SPOT · MT. FUJI', 'Chureito Pagoda & Mt. Fuji', 'Winter is the best season to see Fuji'),
         'zh': ('能量景點・富士山', '新倉山淺間公園', '冬天，是最常看見富士山的季節'),
         'ko': ('파워스폿 · 후지산', '아라쿠라야마 센겐 공원', '후지산이 가장 잘 보이는 계절, 겨울'),
         'fr': ('LIEU SACRÉ · MONT FUJI', 'Pagode Chūreitō & mont Fuji', 'L’hiver, la meilleure saison pour voir le Fuji'),
         'es': ('LUGAR SAGRADO · MONTE FUJI', 'Pagoda Chureito y monte Fuji', 'El invierno, la mejor época para ver el Fuji'),
         'jp': ('パワースポット・富士山', '新倉富士浅間神社', '冬は、富士山が見える日が多い季節')},
 'thu': {'en': ('JAPAN TRAVEL TIP', 'Sunset at 4:28 pm?', ''),
         'zh': ('日本旅遊小知識', '下午4點28分就日落？', ''),
         'ko': ('일본 여행 팁', '오후 4시 28분에 해가 진다?', ''),
         'fr': ('ASTUCE VOYAGE', 'Le soleil se couche à 16 h 28 ?', ''),
         'es': ('CONSEJO DE VIAJE', '¿Atardece a las 16:28?', ''),
         'jp': ('旅の豆知識', '日の入りがいちばん早いのは？', '')},
 'fri': {'en': ('POWER SPOT · KAWAGOE', 'Kawagoe  川越', '“Little Edo”, 30 min from Ikebukuro'),
         'zh': ('能量景點・川越', '川越', '從池袋約30分鐘的「小江戶」'),
         'ko': ('파워스폿 · 가와고에', '가와고에  川越', '이케부쿠로에서 30분, ‘작은 에도’'),
         'fr': ('LIEU SACRÉ · KAWAGOE', 'Kawagoe  川越', 'La « petite Edo », à 30 min d’Ikebukuro'),
         'es': ('LUGAR SAGRADO · KAWAGOE', 'Kawagoe  川越', 'El «pequeño Edo», a 30 min de Ikebukuro'),
         'jp': ('パワースポット・川越', '川越氷川神社', '小江戸で、縁結びのお参りを')},
 'sat': {'en': ('POWER SPOT · NIKKO', 'Kinugawa Onsen  鬼怒川', 'Autumn colors, shot by our guide Akki'),
         'zh': ('能量景點・日光', '鬼怒川溫泉', '嚮導 Akki 今年秋天拍下的紅葉'),
         'ko': ('파워스폿 · 닛코', '기누가와 온천  鬼怒川', '가이드 Akki가 올가을 담은 풍경'),
         'fr': ('LIEU SACRÉ · NIKKŌ', 'Kinugawa Onsen  鬼怒川', 'L’automne vu par notre guide Akki'),
         'es': ('LUGAR SAGRADO · NIKKO', 'Kinugawa Onsen  鬼怒川', 'El otoño visto por nuestro guía Akki'),
         'jp': ('パワースポット・日光', '鬼怒川温泉', '今年の秋、アッキーが撮った紅葉の通り')},
}
PROMO = {  # 日曜：サイトの紹介 (小見出し, 題名, 一言, チップ, ボタン)
 'en': ('FREE · NO SIGN-UP', 'Your next Japan trip', 'Shrines, sacred trees and waterfalls that suit you', ['Love', 'Money', 'Health', 'Work'], 'Link in bio'),
 'zh': ('免費・免註冊', '下一趟日本之旅', '找到適合你的神社、神木與瀑布', ['戀愛', '財運', '健康', '事業'], '點個人檔案的連結'),
 'ko': ('무료 · 가입 불필요', '다음 일본 여행은 어디로?', '나에게 맞는 신사, 신목, 폭포 찾기', ['연애', '금전', '건강', '일'], '프로필 링크에서'),
 'fr': ('GRATUIT · SANS INSCRIPTION', 'Votre prochain voyage', 'Sanctuaires, arbres sacrés et cascades pour vous', ['Amour', 'Argent', 'Santé', 'Travail'], 'Lien dans la bio'),
 'es': ('GRATIS · SIN REGISTRO', 'Tu próximo viaje a Japón', 'Santuarios, árboles sagrados y cascadas para ti', ['Amor', 'Dinero', 'Salud', 'Trabajo'], 'Enlace en la bio'),
 'jp': ('パワースポット診断', '年末年始、どこへお参りに？', '方位の良い日もわかります（無料・登録不要）', ['恋愛', '金運', '健康', '仕事'], 'プロフィールのリンクから'),
}
THU_STEPS = {
 'en': ['Tokyo’s earliest sunsets come in early December', 'Visit shrines and temples in the morning', 'Check closing times before you go', 'Golden light around 4 pm is great for photos', 'Bring a warm layer for the evening'],
 'zh': ['東京最早的日落在12月上旬', '神社、寺院建議上午去', '出發前先確認開放時間', '下午4點左右的光線最適合拍照', '傍晚會變冷，記得多帶一件外套'],
 'ko': ['도쿄의 가장 이른 일몰은 12월 초', '신사와 절은 오전에 가기', '가기 전에 관람 시간 확인', '오후 4시 무렵 빛이 사진에 딱', '저녁엔 추우니 겉옷 하나 더'],
 'fr': ['À Tokyo, le soleil se couche le plus tôt début décembre', 'Visitez sanctuaires et temples le matin', 'Vérifiez les horaires de fermeture', 'Vers 16 h, la lumière dorée est idéale', 'Prévoyez une couche chaude pour le soir'],
 'es': ['Tokio tiene sus atardeceres más tempranos en diciembre', 'Visita santuarios y templos por la mañana', 'Consulta el horario de cierre antes de ir', 'Hacia las 16:00 la luz dorada es ideal', 'Lleva una capa de abrigo para la tarde'],
 'jp': ['東京の日の入りは12月上旬が16時28分', '冬至の日より早いのが意外なポイント', 'お参りや観光は午前中から', '閉門・拝観の時間を先に確認', '夕方は冷えるので、上着を一枚'],
}

# 英語以外でアッキーに触れるときの表記（2026-11-18 決定：海外版はアッキーの案内表記の後ろに @nigihayahi03）
AKKI = 'Akki, the Higher-Dimensional Negotiator @nigihayahi03'
JP_GUIDE = '案内人：高次元ネゴシエイター アッキー @nigihayahi03'

CAP = {}
CAP['mon'] = {
 'en': """Chichibu Night Festival 🏮 Only two nights a year, and they're this week

Every December 2 and 3, the town of Chichibu in Saitama holds the annual grand festival of Chichibu Shrine. Two kasaboko and four yatai floats, glowing with lanterns, are pulled through the streets, and fireworks light up the winter sky.

✔ Counted with Kyoto's Gion Matsuri and Takayama Matsuri as one of Japan's three great float festivals
✔ Part of "Yama, Hoko, Yatai" float festivals on UNESCO's Intangible Cultural Heritage list (2016)
✔ The climax: floats weighing over 10 tons are hauled up the steep Dango-zaka slope
✔ About 1 hour 20 minutes from Ikebukuro by Seibu limited express

Find the power spot that matches your wish 👉 link in bio

#Chichibu #ChichibuNightFestival #Saitama #japantravel #powerspot""",
 'zh': """秩父夜祭 🏮 一年只有兩個夜晚，就在這週

每年12月2日、3日，埼玉縣秩父市會舉行秩父神社的例大祭。點滿燈籠的2座「笠鉾」和4座「屋台」花車在街上巡行，冬天的夜空還會綻放煙火。

✔ 與京都祇園祭、飛驒高山祭並稱「日本三大曳山祭」
✔ 2016年以「山・鉾・屋台行事」之一，登錄為聯合國教科文組織無形文化遺產
✔ 最高潮：把重達10噸以上的花車拉上陡峭的「團子坂」
✔ 從池袋搭西武線特急約1小時20分

找到符合你心願的能量景點 👉 個人檔案連結

#秩父夜祭 #秩父 #埼玉 #日本旅遊 #能量景點""",
 'ko': """지치부 요마쓰리(秩父夜祭) 🏮 1년에 단 이틀 밤, 바로 이번 주

매년 12월 2일과 3일, 사이타마현 지치부시에서는 지치부 신사의 큰 제례가 열립니다. 등불을 가득 밝힌 '가사보코' 2대와 '야타이' 4대가 거리를 누비고, 겨울 밤하늘에는 불꽃이 피어올라요.

✔ 교토 기온마쓰리, 히다 다카야마 마쓰리와 함께 '일본 3대 히키야마 축제'
✔ 2016년 '야마·호코·야타이 행사'의 하나로 유네스코 무형문화유산 등재
✔ 하이라이트는 10톤이 넘는 수레를 가파른 '단고자카'로 끌어올리는 순간
✔ 이케부쿠로에서 세이부선 특급으로 약 1시간 20분

소원에 맞는 파워스폿을 찾아보세요 👉 프로필 링크

#지치부 #요마쓰리 #사이타마 #일본여행 #파워스폿""",
 'fr': """Chichibu Yomatsuri 🏮 Deux nuits par an seulement, et c'est cette semaine

Chaque année, les 2 et 3 décembre, la ville de Chichibu (Saitama) célèbre la grande fête du sanctuaire de Chichibu. Deux chars kasaboko et quatre chars yatai, couverts de lanternes, défilent dans les rues, et des feux d'artifice illuminent le ciel d'hiver.

✔ L'une des trois grandes fêtes de chars du Japon, avec le Gion Matsuri de Kyoto et le Takayama Matsuri
✔ Inscrite en 2016 au patrimoine culturel immatériel de l'UNESCO, parmi les fêtes « Yama, Hoko, Yatai »
✔ Le moment fort : des chars de plus de 10 tonnes hissés sur la pente raide de Dango-zaka
✔ Environ 1 h 20 depuis Ikebukuro en express Seibu

Trouvez le lieu sacré qui correspond à votre vœu 👉 lien dans la bio

#Chichibu #Yomatsuri #Saitama #voyagejapon #japon""",
 'es': """Chichibu Yomatsuri 🏮 Solo dos noches al año, y son esta semana

Cada 2 y 3 de diciembre, la ciudad de Chichibu (Saitama) celebra la gran fiesta anual del santuario de Chichibu. Dos carrozas kasaboko y cuatro yatai, llenas de faroles, recorren las calles, y los fuegos artificiales iluminan el cielo de invierno.

✔ Una de las tres grandes fiestas de carrozas de Japón, junto al Gion Matsuri de Kioto y el Takayama Matsuri
✔ Desde 2016, parte de las fiestas «Yama, Hoko, Yatai», Patrimonio Cultural Inmaterial de la UNESCO
✔ El momento cumbre: carrozas de más de 10 toneladas suben la empinada cuesta de Dango-zaka
✔ Aprox. 1 h 20 min desde Ikebukuro en el expreso de Seibu

En la foto, el santuario de Chichibu.

Encuentra el lugar sagrado que encaja con tu deseo 👉 enlace en la bio

#Chichibu #Yomatsuri #Saitama #viajarajapon #japon""",
 'jp': """一年で、たった二晩だけ。
今週12月2日・3日は、秩父夜祭です🏮

秩父地方の総鎮守・秩父神社の例大祭。
提灯をともした笠鉾2基と屋台4基が町をめぐり、冬の夜空には花火が上がります。

🏮 京都の祇園祭、飛騨の高山祭と並ぶ「日本三大曳山祭」
🏮 2016年、「山・鉾・屋台行事」のひとつとしてユネスコ無形文化遺産に
🏮 見せ場は、10トンを超える笠鉾・屋台を急な「団子坂」へ引き上げる瞬間
🏮 池袋から西武線の特急で約1時間20分

秩父神社は、三峯神社・寶登山神社とあわせて「秩父三社」と呼ばれています。
お祭りの熱気のあとは、三社めぐりもおすすめです。

あなたに合うパワースポットは、プロフィールのリンクから無料で診断できます⛩
""" + JP_GUIDE + """

#秩父夜祭 #秩父神社 #秩父 #パワースポット #開運""",
}
CAP['tue'] = {
 'en': """Amazake 🍵 Japan's sweet winter drink

Amazake is a warm, naturally sweet drink made from rice. On cold days you'll find it at cafés, at festivals and, around New Year, at shrines that serve it to visitors.

✔ Amazake made from rice koji has no alcohol. The sweetness comes from the rice itself
✔ The kind made from sake lees can contain a little alcohol, so check if you need to avoid it
✔ Fun fact: in Japanese haiku, amazake is a word for summer, not winter

More seasonal Japan 👉 link in bio

#amazake #japanesefood #wintertaste #japantravel #japanfood""",
 'zh': """日式鍋物 🍲 大家圍著吃的冬季料理

天氣一冷，日本人最常說的一句話就是「今天吃鍋吧」。在餐桌上放一只陶鍋，邊煮邊吃，大家一起分享。

✔ 照片是關西風的鍋物：白菜、菇類和丸子，湯頭清爽
✔ 「寄鍋（よせなべ）」就是把海鮮、肉和蔬菜全部放進一鍋
✔ 吃到最後，在剩下的湯裡加白飯或烏龍麵，叫做「シメ」，這才是精華

更多日本當季旅遊資訊 👉 個人檔案連結

#日式鍋物 #日本美食 #日本冬天 #日本旅遊 #日本料理""",
 'ko': """미조레나베(みぞれ鍋) 🍲 눈 내린 듯한 겨울 전골

'미조레'는 일본어로 진눈깨비라는 뜻이에요. 국물 위에 듬뿍 올린 무즙이 진눈깨비처럼 보여서 붙은 이름이라고 합니다. '유키미나베(雪見鍋)'라고도 불러요.

✔ 무즙 덕분에 국물이 순하고 깔끔해요
✔ 일본에서는 추운 날 식탁 가운데 냄비를 놓고 다 함께 나눠 먹어요
✔ 마지막에 남은 국물에 밥이나 우동을 넣는 '시메'까지 꼭 즐겨 보세요

일본의 계절 여행 정보 더 보기 👉 프로필 링크

#미조레나베 #일본음식 #일본겨울 #일본여행 #일본요리""",
 'fr': """L'amazake 🍵 la douce boisson de l'hiver japonais

L'amazake est une boisson chaude à base de riz, naturellement sucrée. Quand il fait froid, on la trouve dans les cafés, pendant les fêtes et, au Nouvel An, dans des sanctuaires qui l'offrent aux visiteurs.

✔ L'amazake au riz koji ne contient pas d'alcool : sa douceur vient du riz lui-même
✔ Celui à base de lie de saké peut contenir un peu d'alcool : renseignez-vous si besoin
✔ Sur la photo : un amazake au yuzu, l'agrume japonais

Plus de Japon de saison 👉 lien dans la bio

#amazake #cuisinejaponaise #hiver #voyagejapon #japon""",
 'es': """Nabe 🍲 la olla que se comparte en invierno

Cuando llega el frío, en Japón se dice «hoy toca nabe». Se pone una olla en el centro de la mesa y todos cocinan y comen juntos.

✔ En la foto, un yosenabe: «nabe de todo un poco», con setas, verduras, tofu, carne y marisco
✔ Cada familia y cada región tiene su propio caldo
✔ Al final se añade arroz o udon al caldo que queda. Se llama «shime» y para muchos es lo mejor

Más Japón de temporada 👉 enlace en la bio

#nabe #comidajaponesa #invierno #viajarajapon #japon""",
 'jp': """今年の秋、アッキーが鬼怒川で食べた湯波そば。
日光では、ゆばを「湯葉」ではなく「湯波」と書きます🍜

京都の湯葉は端から引き上げて1枚に仕上げますが、
日光の湯波は真ん中から引き上げて二つ折りに。
そのときのシワが波のように見えることから、「湯波」の字があてられたと言われています。

🍜 はじまりは、日光山で修行する僧侶たちの精進料理
🍜 やがて参拝に訪れる人にもふるまわれるように
🍜 鬼怒川温泉へは、浅草から東武特急で約2時間

日光の社寺めぐりと温泉の合間に、ぜひ味わってみてください。

近くのパワースポットは、プロフィールのリンクから探せます⛩
""" + JP_GUIDE + """

#湯波 #日光グルメ #鬼怒川温泉 #パワースポット #開運""",
}
CAP['wed'] = {
 'en': """Chureito Pagoda & Mt. Fuji 🗻 Why winter is the best season

At Arakurayama Sengen Park in Fujiyoshida, a red five-story pagoda stands in front of Mt. Fuji. Climb the 398 steps from Arakura Fuji Sengen Shrine to reach the viewpoint.

✔ Winter often brings clear, dry air. Records kept by Fuji City show December and January with many of the clearest days of the year
✔ Go in the morning: the sun shines on the face of Fuji
✔ About 10–15 minutes on foot from Shimoyoshida Station
✔ The park is open 24 hours and free

Find your power spot 👉 link in bio

#MtFuji #ChureitoPagoda #Yamanashi #japantravel #powerspot""",
 'zh': """新倉山淺間公園 🗻 冬天，最容易看見富士山

位於山梨縣富士吉田市的新倉山淺間公園，是眺望富士山的知名景點。從「新倉富士淺間神社」的境內爬上398級階梯，就能看到一整片富士山景。

✔ 冬天空氣乾燥清澈。根據富士市的觀測紀錄，12月和1月是一年中最常看見富士山的月份
✔ 建議上午去，陽光正好照在富士山正面
✔ 從富士急行線「下吉田站」步行約10〜15分鐘
✔ 24小時開放，免費入園

找到適合你的能量景點 👉 個人檔案連結

#富士山 #新倉山淺間公園 #山梨 #日本旅遊 #能量景點""",
 'ko': """아라쿠라야마 센겐 공원 🗻 후지산은 겨울에 가장 잘 보여요

야마나시현 후지요시다시의 아라쿠라야마 센겐 공원은 후지산 전망 명소입니다. '아라쿠라 후지 센겐 신사' 경내에서 398개의 계단을 오르면 후지산이 한눈에 들어와요.

✔ 겨울은 공기가 건조하고 맑아요. 후지시의 관측 기록에서도 12월과 1월에 후지산이 잘 보이는 날이 많아요
✔ 오전에 가면 햇빛이 후지산 정면을 비춰요
✔ 후지큐코선 '시모요시다역'에서 걸어서 약 10~15분
✔ 24시간 개방, 입장 무료

나에게 맞는 파워스폿 찾기 👉 프로필 링크

#후지산 #아라쿠라야마센겐공원 #야마나시 #일본여행 #파워스폿""",
 'fr': """Pagode Chūreitō & mont Fuji 🗻 Pourquoi l'hiver est la meilleure saison

Au parc Arakurayama Sengen, à Fujiyoshida, une pagode rouge à cinq étages se dresse face au mont Fuji. On y monte par les 398 marches qui partent du sanctuaire Arakura Fuji Sengen.

✔ L'hiver, l'air est souvent sec et limpide : d'après les relevés de la ville de Fuji, décembre et janvier comptent parmi les mois où le Fuji se voit le plus
✔ Venez le matin : le soleil éclaire la face du Fuji
✔ Environ 10 à 15 minutes à pied de la gare de Shimoyoshida
✔ Parc ouvert 24 h/24, gratuit

Trouvez votre lieu sacré 👉 lien dans la bio

#montFuji #Chureito #Yamanashi #voyagejapon #japon""",
 'es': """Pagoda Chureito y monte Fuji 🗻 Por qué el invierno es la mejor época

En el parque Arakurayama Sengen, en Fujiyoshida, una pagoda roja de cinco pisos se alza frente al monte Fuji. Se sube por los 398 escalones que parten del santuario Arakura Fuji Sengen.

✔ En invierno el aire suele ser seco y limpio: según los registros de la ciudad de Fuji, diciembre y enero están entre los meses en que más se ve el Fuji
✔ Ve por la mañana: el sol ilumina la cara del Fuji
✔ Unos 10–15 minutos a pie desde la estación de Shimoyoshida
✔ El parque abre 24 horas y es gratis

Encuentra tu lugar sagrado 👉 enlace en la bio

#monteFuji #Chureito #Yamanashi #viajarajapon #japon""",
 'jp': """富士山がいちばんよく見えるのは、冬。
山梨・富士吉田の「新倉富士浅間神社」です🗻

境内から398段の「咲くや姫階段」を上ると、新倉山浅間公園の展望デッキへ。
五重塔と富士山がいっしょに見える、富士吉田を代表する景色です。

🗻 冬は空気が乾いて澄む季節。富士市の観測記録でも、12月・1月は富士山がよく見える日が多い月です
🗻 おすすめは午前中。富士山の正面に日が当たります
🗻 富士急行線「下吉田駅」から歩いて10〜15分ほど
🗻 公園は24時間、無料で入れます

富士山に手を合わせて、一年の感謝を伝えに行きませんか。

全国の聖地は、プロフィールのリンクから無料で診断できます⛩
""" + JP_GUIDE + """

#新倉富士浅間神社 #新倉山浅間公園 #富士山 #パワースポット #開運""",
}
CAP['thu'] = {
 'en': """Sunset at 4:28 pm? 🌇 Japan's early December surprise

In early December, the sun sets in Tokyo at about 4:28 pm. And here's the surprise: that's earlier than on the winter solstice (about 4:32 pm). From December 1 to 13, Tokyo has its earliest sunsets of the year.

✔ Start your shrine and temple visits in the morning
✔ Some temples and gardens close in the late afternoon. Check the hours first
✔ Around 4 pm, the low golden light is perfect for photos
✔ It gets cold fast after dark. Bring a warm layer

Times: National Astronomical Observatory of Japan, Tokyo, 2026.
Photo: Kiyomizu-dera, Kyoto, at sunset.

Plan your days in Japan 👉 link in bio

#japantips #japantravel #tokyo #kyoto #powerspot""",
 'zh': """下午4點28分就日落？🌇 12月上旬的日本小驚喜

12月上旬，東京的日落時間大約是下午4點28分。而且意外的是，這比冬至那天（約4點32分）還要早。12月1日到13日，是東京一年中日落最早的時候。

✔ 參拜神社、寺院，建議從上午開始
✔ 有些寺院和庭園傍晚就關門，出發前先確認時間
✔ 下午4點左右的金色斜陽，最適合拍照
✔ 天黑後很快就變冷，記得多帶一件外套

時間：日本國立天文台，東京，2026年
照片：廣島・嚴島神社的大鳥居與夕陽

規劃你的日本行程 👉 個人檔案連結

#日本旅遊小知識 #日本旅遊 #東京 #嚴島神社 #能量景點""",
 'ko': """오후 4시 28분에 해가 진다? 🌇 12월 초 일본의 반전

12월 초, 도쿄의 해는 오후 4시 28분쯤 집니다. 의외인 건, 동지(약 4시 32분)보다 더 이르다는 점이에요. 12월 1일부터 13일까지가 도쿄에서 1년 중 해가 가장 빨리 지는 시기입니다.

✔ 신사와 절은 오전부터 둘러보세요
✔ 오후 늦게 문을 닫는 절과 정원도 있으니 시간을 먼저 확인
✔ 오후 4시 무렵의 낮은 황금빛은 사진에 딱이에요
✔ 해가 지면 금방 추워져요. 겉옷을 하나 더 챙기세요

시간: 일본 국립천문대, 도쿄, 2026년
사진: 히로시마 미야지마, 이쓰쿠시마 신사의 오토리이와 해 질 녘

일본 여행 일정 짜기 👉 프로필 링크

#일본여행팁 #일본여행 #도쿄 #교토 #파워스폿""",
 'fr': """Le soleil se couche à 16 h 28 ? 🌇 La surprise de début décembre

Début décembre, le soleil se couche à Tokyo vers 16 h 28. Et c'est plus tôt qu'au solstice d'hiver (vers 16 h 32) ! Du 1er au 13 décembre, Tokyo connaît ses couchers de soleil les plus précoces de l'année.

✔ Commencez les visites de sanctuaires et de temples dès le matin
✔ Certains temples et jardins ferment en fin d'après-midi : vérifiez les horaires
✔ Vers 16 h, la lumière dorée et rasante est parfaite pour les photos
✔ Il fait vite froid après la tombée de la nuit : prévoyez une couche chaude

Horaires : Observatoire astronomique national du Japon, Tokyo, 2026.
Photo : le torii d'Itsukushima (Miyajima, Hiroshima) au coucher du soleil.

Préparez vos journées au Japon 👉 lien dans la bio

#conseilsvoyage #voyagejapon #tokyo #Miyajima #japon""",
 'es': """¿Atardece a las 16:28? 🌇 La sorpresa de principios de diciembre

A principios de diciembre, el sol se pone en Tokio hacia las 16:28. Y lo curioso: es más temprano que en el solsticio de invierno (hacia las 16:32). Del 1 al 13 de diciembre, Tokio tiene los atardeceres más tempranos del año.

✔ Empieza las visitas a santuarios y templos por la mañana
✔ Algunos templos y jardines cierran a media tarde: consulta el horario
✔ Hacia las 16:00, la luz dorada y baja es perfecta para fotos
✔ Al anochecer hace frío enseguida: lleva una capa de abrigo

Horarios: Observatorio Astronómico Nacional de Japón, Tokio, 2026.
Foto: el torii de Itsukushima (Miyajima, Hiroshima) al atardecer.

Planea tus días en Japón 👉 enlace en la bio

#consejosdeviaje #viajarajapon #tokio #Miyajima #japon""",
 'jp': """一年でいちばん日の入りが早いのは、冬至……ではないんです🌇

東京の日の入りは、12月1日〜13日が16時28分で一年でいちばん早い時期。
冬至の12月22日は16時32分なので、実は今のほうが早く暗くなります。
（国立天文台の2026年の暦より）

1. お参りや観光は、午前中から動き出す
2. 閉門・拝観の時間を、先に確認しておく
3. 16時ごろの低い光は、写真がきれいに撮れる時間
4. 日が落ちると一気に冷えるので、上着を一枚

写真は京都・清水寺の仁王門と夕暮れ。
短い昼を大切に、冬の社寺めぐりを楽しみましょう。

冬のお出かけ先は、プロフィールのリンクから探せます⛩
""" + JP_GUIDE + """

#日の入り #冬の旅 #神社巡り #パワースポット #開運""",
}
CAP['fri'] = {
 'en': """Kawagoe 🏮 Old Edo, just 30 minutes from Ikebukuro

Kawagoe in Saitama is nicknamed "Little Edo". It thrived as a merchant town in the Edo period, and streets of traditional clay-walled kurazukuri storehouses still remain.

✔ The Toki no Kane bell tower: a three-story wooden tower about 16 m tall, rung four times a day (6:00, 12:00, 15:00, 18:00)
✔ Kawagoe Hikawa Shrine is known for blessings of good relationships. Try "fishing" for a sea-bream fortune with a little rod
✔ Snack on old-fashioned sweets in Kashiya Yokocho, a narrow stone-paved lane
✔ About 30 minutes from Ikebukuro by Tobu express

Find power spots near Tokyo 👉 link in bio

#Kawagoe #LittleEdo #Saitama #japantravel #powerspot""",
 'zh': """川越 🏮 從池袋約30分鐘的「小江戶」

埼玉縣的川越，在江戶時代是繁榮的商業城鎮，因此被稱為「小江戶」。至今仍保留著一整條傳統的「藏造」老街。

✔ 地標「時之鐘」：高約16公尺的三層木造鐘樓，每天6點、12點、15點、18點敲響
✔ 「川越冰川神社」以結緣聞名，可以用小釣竿「釣」鯛魚籤
✔ 走進石板小路「菓子屋橫丁」，品嚐懷舊點心
✔ 從池袋搭東武線急行約30分鐘

找到東京近郊的能量景點 👉 個人檔案連結

#川越 #小江戶 #埼玉 #日本旅遊 #能量景點""",
 'ko': """가와고에(川越) 🏮 이케부쿠로에서 30분, '작은 에도'

사이타마현 가와고에는 에도 시대에 상업 도시로 번성해 '고에도(작은 에도)'라고 불립니다. 지금도 전통 창고 건물 '구라즈쿠리'가 늘어선 거리가 남아 있어요.

✔ 상징인 '도키노카네(시간의 종)': 높이 약 16m의 3층 목조 종루, 하루 4번(6시, 12시, 15시, 18시) 울려요
✔ '가와고에 히카와 신사'는 인연의 신사로 유명해요. 작은 낚싯대로 도미 모양 오미쿠지를 '낚아' 보세요
✔ 사진 속 돌길 골목 '가시야요코초'에서 옛날 과자도
✔ 이케부쿠로에서 도부선 급행으로 약 30분

도쿄 근교 파워스폿 찾기 👉 프로필 링크

#가와고에 #고에도 #사이타마 #일본여행 #파워스폿""",
 'fr': """Kawagoe 🏮 L'ancienne Edo, à 30 minutes d'Ikebukuro

Kawagoe (Saitama) est surnommée la « petite Edo ». Ville marchande prospère à l'époque d'Edo, elle a gardé des rues entières de kurazukuri, ces entrepôts traditionnels aux murs d'argile.

✔ La tour de la cloche Toki no Kane : trois étages en bois, environ 16 m, elle sonne quatre fois par jour (6 h, 12 h, 15 h, 18 h)
✔ Le sanctuaire Kawagoe Hikawa est réputé pour les belles rencontres. On y « pêche » son oracle en forme de daurade avec une petite canne
✔ Des douceurs d'antan dans Kashiya Yokocho, une ruelle pavée
✔ Environ 30 minutes depuis Ikebukuro en express Tobu

Les lieux sacrés près de Tokyo 👉 lien dans la bio

#Kawagoe #petiteEdo #Saitama #voyagejapon #japon""",
 'es': """Kawagoe 🏮 El viejo Edo, a 30 minutos de Ikebukuro

Kawagoe (Saitama) es conocida como el «pequeño Edo». Fue una próspera ciudad comercial en el periodo Edo y aún conserva calles de kurazukuri, almacenes tradicionales con muros de barro.

✔ La torre Toki no Kane: tres pisos de madera, unos 16 m, suena cuatro veces al día (6:00, 12:00, 15:00, 18:00)
✔ El santuario Kawagoe Hikawa es famoso por las buenas relaciones. Allí se «pesca» el oráculo con forma de besugo con una cañita
✔ En la foto, el gran salón del templo Kita-in
✔ Unos 30 minutos desde Ikebukuro en el expreso de Tobu

Lugares sagrados cerca de Tokio 👉 enlace en la bio

#Kawagoe #pequeñoEdo #Saitama #viajarajapon #japon""",
 'jp': """池袋から電車で約30分。
小江戸・川越の「川越氷川神社」は、縁結びの神社として知られています⛩

創建は541年と伝えられる古社。
鯛の形のおみくじを、小さな釣り竿で「釣り上げる」鯛みくじが人気です。
赤い鯛は一年の運勢を占う「一年安鯛みくじ」、ピンクの鯛は恋の行方を占う「あい鯛みくじ」。

⛩ 蔵造りの町並みと、高さ約16mの「時の鐘」（1日4回、6時・12時・15時・18時に鳴ります）
⛩ 石畳の路地「菓子屋横丁」で、昔ながらのお菓子を
⛩ 写真は、川越氷川神社の鯛みくじ

良いご縁を願いに、週末の小江戸へ。

あなたに合うパワースポットは、プロフィールのリンクから無料で診断できます⛩
""" + JP_GUIDE + """

#川越氷川神社 #川越 #小江戸 #縁結び #パワースポット""",
}
CAP['sat'] = {
 'en': """Kinugawa Onsen, Nikko 🍁 Autumn colors, shot by our guide Akki

Our guide """ + AKKI + """ walked through Kinugawa Onsen this autumn and took this photo: maples blazing red along the street in the hot spring town.

✔ About 2 hours from Asakusa by Tobu limited express
✔ The town sits along the Kinugawa river gorge. Cross a bridge and look down at the water
✔ Try Nikko's local yuba (tofu skin). Akki had a bowl of yuba soba here

Plan your own power spot trip 👉 link in bio

#Kinugawa #Nikko #autumnleaves #japantravel #powerspot""",
 'zh': """日光・鬼怒川溫泉 🍁 嚮導 Akki 今年秋天拍下的紅葉

這張照片，是我們的嚮導 """ + AKKI + """ 今年秋天走在鬼怒川溫泉街時拍下的。溫泉街的路旁，楓葉染得一片火紅。

✔ 從淺草搭東武特急約2小時
✔ 走上橋，就能俯瞰鬼怒川的溪谷
✔ 別忘了嚐嚐日光名產「湯波（ゆば）」，Akki 這次吃的是湯波蕎麥麵

規劃你的能量景點之旅 👉 個人檔案連結

#鬼怒川溫泉 #日光 #日本紅葉 #日本旅遊 #能量景點""",
 'ko': """닛코 기누가와 온천 🍁 가이드 Akki가 올가을 담은 풍경

저희 가이드 """ + AKKI + """가 올가을 기누가와 온천을 걸으며 다리 위에서 찍은 풍경입니다. 산으로 둘러싸인 계곡을 따라 온천 마을이 이어져요.

✔ 아사쿠사에서 도부 특급으로 약 2시간
✔ 다리 위에 서면 기누가와 계곡이 내려다보여요
✔ 닛코 명물 '유바(湯波)'도 꼭. Akki는 유바 소바를 먹었어요

나만의 파워스폿 여행을 계획해 보세요 👉 프로필 링크

#기누가와온천 #닛코 #일본단풍 #일본여행 #파워스폿""",
 'fr': """Kinugawa Onsen, Nikkō 🍁 L'automne vu par notre guide Akki

Notre guide """ + AKKI + """ a pris cette photo cet automne en se promenant à Kinugawa Onsen. Sur la borne de pierre, on lit « Kinugawa Onsen » et « Sakura-namiki-dōri », l'avenue des cerisiers, avec un visage d'oni sculpté au sommet.

✔ Environ 2 heures depuis Asakusa en express Tobu
✔ La ville thermale longe les gorges de la Kinugawa : depuis un pont, la vue plonge sur la rivière
✔ Goûtez le yuba de Nikkō (peau de tofu). Akki a pris un bol de soba au yuba

Préparez votre voyage 👉 lien dans la bio

#Kinugawa #Nikko #automneaujapon #voyagejapon #japon""",
 'es': """Kinugawa Onsen, Nikko 🍁 El otoño visto por nuestro guía Akki

Nuestro guía """ + AKKI + """ grabó esta vista del desfiladero del río Kinugawa desde un puente este otoño.

✔ Unas 2 horas desde Asakusa en el expreso de Tobu
✔ El pueblo termal se extiende a lo largo del desfiladero
✔ Prueba el yuba de Nikko (piel de tofu). Akki tomó un tazón de soba con yuba

Planea tu viaje 👉 enlace en la bio

#Kinugawa #Nikko #otoñoenjapon #viajarajapon #japon""",
 'jp': """今年の秋、アッキーが撮った鬼怒川温泉の通り。
道沿いのもみじが、真っ赤に色づいていました🍁

温泉街は、鬼怒川の渓谷に沿って広がっています。
橋の上に立つと、足もとには川の流れ、まわりには色づいた山。
歩いているだけで、気持ちがゆるんでいく場所です。

🍁 浅草から東武特急で約2時間
🍁 通りの石柱には「鬼怒川温泉」「桜並木通り」の文字と、鬼の顔
🍁 お昼は日光名物の湯波を。アッキーは湯波そばをいただきました

次のお休みは、温泉と紅葉でひと休みしませんか。

近くのパワースポットは、プロフィールのリンクから探せます⛩
""" + JP_GUIDE + """

#鬼怒川温泉 #日光 #紅葉 #パワースポット #開運""",
}
CAP['sun'] = {
 'en': """Planning your next trip to Japan? ⛩

Japan has tens of thousands of shrines and temples. Our free website picks the sacred places that suit you, from shrines and temples to sacred trees, waterfalls and mountains, based on:
✔ your wish (love, money, health, work…)
✔ your birth date
✔ where you're staying

Build a day-by-day plan and save your favourites to "My list". No sign-up needed.

Try it now 👉 link in bio
Guided by """ + AKKI + """

#japantravel #powerspot #japaneseshrine #japantrip #spiritualjourney""",
 'zh': """下一趟日本之旅，想去哪裡？⛩

日本的神社和寺院多達數萬座。我們的免費網站會依照以下條件，從神社、寺院到神木、瀑布和聖山，為你挑選適合的地方：
✔ 你的願望（戀愛、財運、健康、事業⋯）
✔ 你的生日
✔ 你的住宿地點

還能排出每天的行程，把喜歡的景點存進「我的清單」。不用註冊。

現在就來試試 👉 個人檔案連結
Guide: """ + AKKI + """

#日本旅遊 #能量景點 #日本神社 #日本自由行 #心靈之旅""",
 'ko': """다음 일본 여행, 어디로 갈까요? ⛩

일본에는 신사와 절이 수만 곳. 저희 무료 사이트는 신사와 절은 물론 신목, 폭포, 영산까지, 다음 조건으로 나에게 맞는 곳을 골라 드립니다.
✔ 나의 소원 (연애, 금전, 건강, 일…)
✔ 생년월일
✔ 머무는 곳

하루 단위 일정도 짜고, 마음에 드는 곳은 '내 리스트'에 저장하세요. 가입은 필요 없어요.

지금 바로 확인해 보세요 👉 프로필 링크
Guide: """ + AKKI + """

#일본여행 #파워스폿 #일본신사 #일본자유여행 #힐링여행""",
 'fr': """Votre prochain voyage au Japon, c'est où ? ⛩

Le Japon compte des dizaines de milliers de sanctuaires et de temples. Notre site gratuit choisit pour vous des lieux sacrés, des sanctuaires et temples aux arbres sacrés, cascades et montagnes, selon :
✔ votre vœu (amour, argent, santé, travail…)
✔ votre date de naissance
✔ votre lieu de séjour

Créez un programme jour par jour et gardez vos lieux préférés dans « Ma liste ». Sans inscription.

Essayez maintenant 👉 lien dans la bio
Votre guide : """ + AKKI + """

#voyagejapon #japon #lieusacre #sanctuairejaponais #voyagespirituel""",
 'es': """¿Cómo será tu próximo viaje a Japón? ⛩

Japón tiene decenas de miles de santuarios y templos. Nuestra web gratuita elige para ti lugares sagrados, desde santuarios y templos hasta árboles sagrados, cascadas y montañas, según:
✔ tu deseo (amor, dinero, salud, trabajo…)
✔ tu fecha de nacimiento
✔ dónde te alojas

Crea un plan día a día y guarda tus lugares favoritos en tu lista. Sin registro.

Pruébala ahora 👉 enlace en la bio
Tu guía: """ + AKKI + """

#viajarajapon #japon #lugaressagrados #santuariojapones #viajeespiritual""",
 'jp': """年末年始、どこへお参りに行きますか？⛩

プロフィールのリンクの「開運パワースポット巡り」では、
✔ 叶えたい願い（恋愛・金運・健康・仕事…）
✔ 生年月日（九星気学・数秘術）
✔ 出発地と移動時間
から、全国のパワースポットの中であなたに合う場所を、無料でお選びします。

これから2か月の「方位の良い日」もお知らせするので、初詣の日取り選びにも使えます。
1日でめぐれるモデルコースも46コース用意しました。

写真は屋久島の縄文杉。神社やお寺だけでなく、神木や滝、山などの聖地も探せます。

登録はいりません。来年最初のお参り先探しに、ぜひどうぞ🌿

""" + JP_GUIDE + """

#パワースポット #初詣 #開運 #吉方位 #神社巡り""",
}

# 天然石 @nigihayahi03（写真は本人の実物。lib/ の値札・見た目で判断＝確認用ページに明記）
STONE_FOOT = """

━━━━━━━━━━
🔮 魂の系統鑑定(無料)
生年月日を入れるだけで、全94種の「魂の系統」と今年の運勢がわかります。
あなたにピッタリの天然石ブレスレットもご提案します。
プロフィールのリンクからどうぞ。
━━━━━━━━━━"""
L = 'lib/'
STONES = {
 'mon': (L+'IMG_9860.jpg', {}, '天然石の豆知識', 'アンバー（琥珀）', '木の樹脂が、長い時を経て石に', """はちみつ色の中に、小さな模様がとじこめられた石。アンバー（琥珀）です。

じつはアンバーは、鉱物ではありません。
大昔の木の樹脂が、長い長い年月をかけて固まり、化石になったもの。
手に持つと、ほかの石よりずっと軽く、ほんのり温かく感じます。

太古の森の記憶を、手首にのせているようで、なんだかロマンがありますよね。

熱や汗、香水などは苦手と言われるので、
つけたあとはやわらかい布でやさしくふいてあげてください。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #アンバー #魂の系統鑑定", False),
 'tue': (L+'IMG_9887.jpg', {}, '天然石の豆知識', 'ガーデンクォーツ', '水晶の中に、小さな庭', """透明な水晶の中に、苔や土のような景色。ガーデンクォーツです。

水晶ができるときに、緑泥石などの鉱物が中に入りこみ、
まるで小さな庭や森のように見えることから、この名前で呼ばれています。
日本では「庭園水晶」とも言います。

同じ景色は、ひとつとしてありません。
一粒ずつのぞきこむと、霧のかかった山や、雪の積もった庭のようにも見えてきます。

あなたには、どんな景色に見えますか？""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #ガーデンクォーツ #魂の系統鑑定", False),
 'wed': (L+'IMG_9829.jpg', {}, '天然石の豆知識 No.6', '石が割れた・欠けたとき', '悪いしるしではありません', """天然石の豆知識 No.6
「大切にしていた石が、割れてしまいました……」

ぶつけたり落としたりして、石が欠けたり割れたりすることがあります。
びっくりしますよね。でも、悪いことの前ぶれではありません。

昔から「石が身代わりになってくれた」と考える人も多いんです。

・まずは「ありがとう」と声をかける
・割れた石は、白い紙や布に包んでしばらく休ませる
・欠けた玉だけ入れ替えて、つけ直すこともできます

欠けた部分で手首を傷つけないよう、気になるときは外しておきましょう。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #天然石のお手入れ #魂の系統鑑定", False),
 'thu': (L+'IMG_9835.jpg', {}, '天然石の豆知識', '隕石', '宇宙から届いた、ふしぎな模様', """表面に、細い線が交差するふしぎな模様。
これは、宇宙から地球に落ちてきた「隕石」のブレスレットです。

この模様は「ウィドマンシュテッテン構造」と呼ばれ、鉄隕石にだけ見られるもの。
宇宙で、とてもゆっくり冷えて固まるあいだにできた模様と言われています。

写真は、ローズゴールドの色に仕上げたもの。
はるか遠くの宇宙を旅してきた石を、手首にのせてみませんか。

金属なので、水や汗のあとはしっかりふいてあげてくださいね。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #隕石 #魂の系統鑑定", False),
 'fri': (L+'IMG_9858.jpg', {}, '天然石の豆知識', 'アメジスト', '2月の誕生石、紫の守り石', """やさしい紫に、ところどころ影のような模様。アメジストです。

名前は、ギリシャ語の「酔わない」という言葉から来ていると言われています。
日本では、2月の誕生石としても知られています。

写真のアメジストは、紫の中に、内側に景色が入りこんだような玉がまじっています。
同じ紫でも、一本ずつ表情がまったく違うのが天然石の面白いところ。

強い日差しに長く当てると色があせやすいと言われるので、
しまうときは日の当たらない場所に。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #アメジスト #魂の系統鑑定", False),
 'sat': (L+'IMG_9905.jpg', {}, '天然石の豆知識 No.7', 'お風呂・寝るとき・運動', 'つけたまま？外す？', """天然石の豆知識 No.7
「ブレスレット、お風呂や寝るときも、つけたままでいいの？」

答えは、はずしたほうが長持ちします。

・お風呂：石鹸や温泉の成分、熱いお湯で、石やゴムが傷みやすくなります
・寝るとき：寝返りでゴムがのびたり、引っかかったりすることも
・運動するとき：ぶつけて欠けるのを防ぐため、はずしておくと安心

はずしたら、決まった場所に置いておくのがおすすめ。
「今日もありがとう」と置く習慣ができると、石との時間が少し特別になります。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #天然石のお手入れ #魂の系統鑑定", False),
 'sun': (L+'IMG_9815.jpg', {}, '天然石の豆知識', '色の組み合わせ', '一年の終わりに、好きな色を', """紫、黄色、ピンク、透明。
いろいろな色の石を組み合わせたブレスレットです。

12月は、一年をふり返る月。
今年のあなたを支えてくれた色、来年そばに置きたい色はどれですか？

天然石は、目に入るたびに気持ちを思い出させてくれるお守りのようなもの。
「なんとなく、この色が好き」という感覚を大切に選んでみてください。

今週もおつかれさまでした。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #天然石コーディネート #魂の系統鑑定", False),
}
STONE_NOTE = {  # 確認用ページ用：名前の根拠
 'mon': '値札「アンバー」の写真（IMG_9862）と同じブレスレット', 'tue': '値札「ガーデンクォーツ」（IMG_9886と同じ）', 'wed': '透明な水晶（見た目で判断）',
 'thu': 'ウィドマンシュテッテン模様が見えるため「隕石」とだけ表記（ギベオン等の産地名は書かない）', 'fri': '値札「アメジスト」（IMG_9859と同じ）', 'sat': '石の名前は書かない', 'sun': '石の名前は書かない',
}

# 英語版の朝 8:00（写真全面＋問い）。12月なので年末年始の豆知識
AM = [
 ('11-30', 'w3-am30-en', 'Why does this doll\nhave blank eyes?', """Why does this red doll have blank white eyes? 👀

It's a daruma, a good-luck doll. When you set a goal, you paint in one eye. When the goal comes true, you paint the other. Many people start with the doll's own left eye.

Every time you see the one-eyed daruma, it reminds you of what you're working toward. A perfect thing to start before the New Year.

Save this for your trip 📌"""),
 ('12-01', 'w3-am01-en', 'Right paw or left paw?\nIt matters', """Right paw or left paw? It matters 🐱

The beckoning cat, maneki-neko, is said to invite good fortune. A raised right paw is said to bring money and luck. A raised left paw is said to bring people, customers and good connections.

This photo shows Gotokuji temple in Setagaya, Tokyo, famous for its thousands of maneki-neko. Legend says a white cat beckoned a samurai lord into the temple.

Save this for your trip 📌"""),
 ('12-02', 'w3-am02-en', 'Why are there foxes\nat so many shrines?', """Why are there foxes at so many shrines? 🦊

At Inari shrines, the fox (kitsune) is the messenger of Inari, the deity of rice, harvests and business. That's why you see pairs of fox statues, often wearing red bibs.

This photo shows a fox at Fushimi Inari Taisha in Kyoto, the head shrine of all Inari shrines.

Save this for your trip 📌"""),
 ('12-03', 'w3-am03-en', 'Why does the temple bell\nring 108 times?', """Why do temple bells ring 108 times on New Year's Eve? 🔔

It's called joya no kane. Around midnight on December 31, temples across Japan strike their great bells 108 times. The number stands for the 108 worldly desires in Buddhism, and each strike is said to clear one away before the new year.

Some temples let visitors take a turn. Check in advance if you want to try.

Save this for your trip 📌"""),
 ('12-04', 'w3-am04-en2', 'Why eat soba\non New Year’s Eve?', """Why do people in Japan eat soba on New Year's Eve? 🍜

It's called toshikoshi soba, "year-crossing noodles". The long, thin noodles are said to stand for a long life. And because soba breaks easily, it's also said to cut away the troubles of the past year.

Simple and warm: a bowl of soba is how many families say goodbye to the year.

Save this for your trip 📌"""),
 ('12-05', 'w3-am05-en-x', 'What are these pine\ndecorations for?', """What are these pine and bamboo decorations for? 🎍

They're kadomatsu, placed in pairs at gates and entrances for the New Year. They're said to welcome Toshigami, the deity of the new year, to the home.

You'll start to see them in late December. Look for them at shops, hotels and shrines.

Save this for your trip 📌"""),
 ('12-06', 'w3-am06-en', 'Japan’s busiest shrine\nvisit of the year', """The busiest shrine visit of the year? Hatsumode ⛩

Hatsumode is the first visit to a shrine or temple in the New Year. Millions of people go in the first days of January to pray for the year ahead. Big shrines can have long lines, so go early in the morning or a little later in January.

This photo shows the New Year crowds at Atsuta Shrine in Nagoya.

Save this for your trip 📌"""),
]
AM_TAGS = "\n\n#Japan #JapanTravel #JapanTips #PowerSpot #JapaneseShrine"
