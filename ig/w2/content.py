# w2 (2026-11-23〜29) の投稿内容。事実は確認済みのものだけ（出典は ig/w2/sources.md）。
# 写真：言語アカウントごとに別の写真（同じ写真の使い回しをしない）。own/ はアッキー本人撮影。
S = '/home/claude/japan-power-spots/ig/src/'
O = '/home/claude/japan-power-spots/ig/own/'
LANGS = ['en', 'zh', 'ko', 'fr', 'es', 'jp']
DATES = {'mon': '11-23', 'tue': '11-24', 'wed': '11-25', 'thu': '11-26', 'fri': '11-27', 'sat': '11-28', 'sun': '11-29'}

PHOTO = {
 'mon': {'en': S+'w2-mon-en2.jpg', 'zh': S+'w2-mon-zh.jpg', 'ko': S+'w2-mon-ko.jpg', 'fr': S+'w2-mon-fr2.jpg', 'es': S+'w2-mon-es2.jpg', 'jp': S+'w2-mon-jp.jpg'},
 'tue': {l: S+f'w2-tue-{l}.jpg' for l in LANGS},
 'wed': {'en': O+'nikko-shirataki-akki.jpg', 'zh': O+'kinugawa-sky.jpg', 'ko': O+'kinugawa.jpg', 'fr': S+'w2-wed-fr2.jpg', 'es': S+'w2-wed-es3.jpg', 'jp': O+'nikko-shirataki.jpg'},
 'thu': {'en': S+'w2-thu-en2.jpg', 'zh': S+'w2-thu-zh2.jpg', 'ko': S+'w2-thu-ko4.jpg', 'fr': S+'w2-thu-fr2.jpg', 'es': S+'w2-thu-jp2.jpg', 'jp': S+'w2-thu-jp3.jpg'},
 'fri': {'en': S+'w2-fri-en.jpg', 'zh': S+'w2-fri-zh.jpg', 'ko': S+'w2-fri-ko.jpg', 'fr': S+'w2-fri-fr.jpg', 'es': S+'w2-fri-es.jpg', 'jp': S+'w2-fri-jp2.jpg'},
 'sat': {l: S+f'w2-sat-{l}.jpg' for l in LANGS},
 'sun': {l: S+f'w2-sun-{l}.jpg' for l in LANGS},
}
FY = {('wed', 'en'): 0.55}  # 縦位置の調整

# フィード画像の文字：(小見出し, 題名, 一言)
CARD = {
 'mon': {'en': ('POWER SPOT · TOKYO', 'Meiji Jingu  明治神宮', 'Harvest thanks on November 23'),
         'zh': ('能量景點・東京', '明治神宮', '11月23日，感謝豐收的日子'),
         'ko': ('파워스폿 · 도쿄', '메이지진구  明治神宮', '11월 23일, 수확에 감사하는 날'),
         'fr': ('LIEU SACRÉ · TOKYO', 'Meiji-jingū  明治神宮', 'Le 23 novembre, on remercie la récolte'),
         'es': ('LUGAR SAGRADO · TOKIO', 'Meiji-jingū  明治神宮', 'El 23 de noviembre, gracias por la cosecha'),
         'jp': ('パワースポット・東京', '明治神宮', '11月23日は、実りに感謝する日')},
 'tue': {'en': ('WINTER TASTE', 'Oden  おでん', 'Japan’s simmered winter comfort food'),
         'zh': ('冬天的味道', '關東煮  おでん', '天冷就想吃的日本暖心料理'),
         'ko': ('겨울의 맛', '오뎅  おでん', '추운 날 생각나는 일본의 따뜻한 요리'),
         'fr': ('SAVEUR D’HIVER', 'Oden  おでん', 'Le plat mijoté qui réchauffe l’hiver'),
         'es': ('SABOR DE INVIERNO', 'Oden  おでん', 'El guiso que calienta el invierno japonés'),
         'jp': ('冬の味覚', 'おでん', 'だしがしみた、冬のごちそう')},
 'wed': {'en': ('POWER SPOT · NIKKO', 'Shirataki Falls  白滝', 'Photo by our guide Akki'),
         'zh': ('能量景點・日光', '鬼怒川  鬼怒川', '晚秋的溪谷與溫泉鄉'),
         'ko': ('파워스폿 · 닛코', '기누가와  鬼怒川', '늦가을 계곡과 온천 마을'),
         'fr': ('LIEU SACRÉ · NIKKŌ', 'Kinugawa Onsen  鬼怒川', 'Gorges et sources chaudes en automne'),
         'es': ('LUGAR SAGRADO · NIKKO', 'Kinugawa Onsen  鬼怒川', 'Desfiladero y aguas termales en otoño'),
         'jp': ('パワースポット・日光', '白滝', '白い糸を重ねたように落ちる滝')},
 'thu': {'en': ('JAPAN TRAVEL TIP', 'Onsen manners', '5 rules for your first hot spring'),
         'zh': ('日本旅遊小知識', '泡溫泉的禮儀', '第一次泡溫泉前要知道的5件事'),
         'ko': ('일본 여행 팁', '온천 매너', '처음 온천에 가기 전 알아둘 5가지'),
         'fr': ('ASTUCE VOYAGE', 'Les règles de l’onsen', '5 règles pour votre premier bain'),
         'es': ('CONSEJO DE VIAJE', 'Modales en el onsen', '5 reglas para tu primer baño termal'),
         'jp': ('温泉の豆知識', '温泉の入り方', '知っておきたい、5つのマナー')},
 'fri': {'en': ('POWER SPOT · KANAZAWA', 'Kanazawa  金沢', 'Snow ropes and gold leaf'),
         'zh': ('能量景點・金澤', '金澤  金沢', '雪吊與金箔之都'),
         'ko': ('파워스폿 · 가나자와', '가나자와  金沢', '유키즈리와 금박의 도시'),
         'fr': ('LIEU SACRÉ · KANAZAWA', 'Kanazawa  金沢', 'Cordes à neige et feuilles d’or'),
         'es': ('LUGAR SAGRADO · KANAZAWA', 'Kanazawa  金沢', 'Cuerdas de nieve y pan de oro'),
         'jp': ('パワースポット・金沢', '金沢', '雪吊りと金箔の城下町')},
 'sat': {'en': ('POWER SPOT · AICHI', 'Korankei  香嵐渓', 'Thousands of maples in late November'),
         'zh': ('能量景點・愛知', '香嵐溪  香嵐渓', '11月下旬，數千棵楓樹染紅溪谷'),
         'ko': ('파워스폿 · 아이치', '고란케이  香嵐渓', '11월 하순, 수천 그루 단풍의 계곡'),
         'fr': ('LIEU SACRÉ · AICHI', 'Kōrankei  香嵐渓', 'Des milliers d’érables fin novembre'),
         'es': ('LUGAR SAGRADO · AICHI', 'Kōrankei  香嵐渓', 'Miles de arces a finales de noviembre'),
         'jp': ('パワースポット・愛知', '香嵐渓', '数千本のもみじが染める渓谷')},
}
PROMO = {  # 日曜：サイトの紹介 (小見出し, 題名, 一言, チップ, ボタン)
 'en': ('FREE · NO SIGN-UP', 'Where do you start?', 'Japan has tens of thousands of shrines and temples', ['Love', 'Money', 'Health', 'Work'], 'Link in bio'),
 'zh': ('免費・免註冊', '該從哪裡開始？', '日本的神社和寺院多達數萬座', ['戀愛', '財運', '健康', '事業'], '點個人檔案的連結'),
 'ko': ('무료 · 가입 불필요', '어디부터 가 볼까?', '일본에는 신사와 절이 수만 곳', ['연애', '금전', '건강', '일'], '프로필 링크에서'),
 'fr': ('GRATUIT · SANS INSCRIPTION', 'Par où commencer ?', 'Le Japon compte des dizaines de milliers de sanctuaires', ['Amour', 'Argent', 'Santé', 'Travail'], 'Lien dans la bio'),
 'es': ('GRATIS · SIN REGISTRO', '¿Por dónde empezar?', 'Japón tiene decenas de miles de santuarios y templos', ['Amor', 'Dinero', 'Salud', 'Trabajo'], 'Enlace en la bio'),
 'jp': ('パワースポット診断', '次のお休み、どこに行こうか？', '方位の良い日もわかります（無料・登録不要）', ['恋愛', '金運', '健康', '仕事'], 'プロフィールのリンクから'),
}
THU_STEPS = {
 'en': ['Wash your body before you get in', 'Keep your towel out of the water', 'Tie up long hair', 'No swimsuits in most baths', 'Tattoos: check the rules first'],
 'zh': ['入池前先把身體洗乾淨', '毛巾不要放進池裡', '長髮要綁起來', '大多數溫泉不能穿泳衣', '有刺青的人請先確認規定'],
 'ko': ['들어가기 전에 몸을 먼저 씻기', '수건은 탕에 넣지 않기', '긴 머리는 묶기', '대부분 수영복은 안 돼요', '문신은 미리 규정 확인'],
 'fr': ['Se laver avant d’entrer', 'La serviette reste hors de l’eau', 'Attacher les cheveux longs', 'Pas de maillot dans la plupart des bains', 'Tatouages : vérifier les règles'],
 'es': ['Lávate antes de entrar', 'La toalla, fuera del agua', 'Recoge el pelo largo', 'Sin bañador en la mayoría', 'Tatuajes: consulta las normas'],
 'jp': ['湯船に入る前に体を洗う', 'タオルは湯船に入れない', '長い髪はまとめる', '水着は基本的に着ない', '入浴後は水分をとる'],
}

TAG = {'en': 'link in bio', }
CAP = {}
CAP['mon'] = {
 'en': """Meiji Jingu, Tokyo ⛩ A harvest festival today

November 23 is Labor Thanksgiving Day in Japan. On this day, Meiji Jingu holds Niinamesai, a ceremony to thank the gods for the year's harvest. Around ten "treasure ships" made of vegetables are displayed, and chrysanthemums line the main approach.

✔ Right next to JR Harajuku Station
✔ The shrine dates from 1920 and is dedicated to Emperor Meiji and Empress Shoken
✔ Walk through the giant torii and the quiet forest path before you reach the main hall

Find the power spot that matches your wish 👉 link in bio

#MeijiJingu #Tokyo #Harajuku #japantravel #powerspot""",
 'zh': """東京・明治神宮 ⛩ 今天是感謝豐收的日子

11月23日是日本的「勤勞感謝日」。這一天，明治神宮會舉行「新嘗祭」，向神明感謝一年的收穫。境內會擺出約十艘用蔬菜做成的「寶船」，參道兩旁也有菊花展。

✔ 就在JR原宿站旁邊
✔ 創建於1920年，供奉明治天皇與昭憲皇太后
✔ 穿過大鳥居、走過安靜的森林參道，就能抵達正殿

找到符合你心願的能量景點 👉 個人檔案連結

#明治神宮 #東京 #原宿 #日本旅遊 #能量景點""",
 'ko': """도쿄 메이지진구(明治神宮) ⛩ 오늘은 수확에 감사하는 날

11월 23일은 일본의 '근로감사의 날'입니다. 이날 메이지진구에서는 한 해의 수확을 신에게 감사하는 '니나메사이(新嘗祭)'가 열립니다. 채소로 만든 '보물선'이 10척 정도 장식되고, 참배길에는 국화도 늘어서요.

✔ JR 하라주쿠역 바로 옆
✔ 1920년에 세워졌고, 메이지 일왕과 쇼켄 황태후를 모시는 신사
✔ 커다란 도리이를 지나 조용한 숲길을 걸으면 본전에 닿아요

소원에 맞는 파워스폿을 찾아보세요 👉 프로필 링크

#메이지진구 #도쿄 #하라주쿠 #일본여행 #파워스폿""",
 'fr': """Meiji-jingū, Tokyo ⛩ Jour de fête des récoltes

Le 23 novembre, c'est la Fête du travail et de l'action de grâce au Japon. Ce jour-là, le Meiji-jingū célèbre le Niiname-sai, une cérémonie pour remercier les divinités de la récolte de l'année. Une dizaine de « bateaux au trésor » faits de légumes sont exposés, et des chrysanthèmes bordent l'allée principale.

✔ Juste à côté de la gare JR de Harajuku
✔ Fondé en 1920, il est dédié à l'empereur Meiji et à l'impératrice Shōken
✔ Passez le grand torii et l'allée forestière avant d'arriver au pavillon principal

Trouvez le lieu sacré qui correspond à votre vœu 👉 lien dans la bio

#MeijiJingu #Tokyo #Harajuku #voyagejapon #japon""",
 'es': """Meiji-jingū, Tokio ⛩ Hoy es día de dar gracias por la cosecha

El 23 de noviembre es el Día de Acción de Gracias por el Trabajo en Japón. Ese día, el Meiji-jingū celebra el Niiname-sai, una ceremonia para agradecer a los dioses la cosecha del año. Se exponen unos diez «barcos del tesoro» hechos de verduras y hay crisantemos a lo largo del camino principal.

✔ Justo al lado de la estación JR de Harajuku
✔ Fundado en 1920, está dedicado al emperador Meiji y a la emperatriz Shōken
✔ Cruza el gran torii y el sendero del bosque antes de llegar al pabellón principal

Encuentra el lugar sagrado que encaja con tu deseo 👉 enlace en la bio

#MeijiJingu #Tokio #Harajuku #viajarajapon #japon""",
 'jp': """今日11月23日は、勤労感謝の日。
もともとは、その年の実りを神様に感謝する「新嘗祭（にいなめさい）」の日です🌾

明治神宮でもこの日に新嘗祭が行われ、境内には野菜でつくられた「宝船」が10隻ほど並びます。
参道には菊の花も飾られて、境内がいっそう華やかになる季節です。

⛩ JR原宿駅のすぐそば
⛩ 1920年創建。明治天皇と昭憲皇太后をおまつりしています
⛩ 大鳥居をくぐり、森の参道を歩くだけで、気持ちがすっと整います

「いただきます」の気持ちを、神様にお伝えしに行きませんか。

あなたに合うパワースポットは、プロフィールのリンクから無料で診断できます⛩

#明治神宮 #新嘗祭 #勤労感謝の日 #パワースポット #開運""",
}
CAP['tue'] = {
 'en': """Oden 🍢 Japan's winter comfort food

When it gets cold, Japan starts craving oden: daikon radish, boiled eggs, konnyaku and fish cakes slowly simmered in light dashi broth. In the colder months you'll even find a pot of it at many convenience stores.

✔ Start with the daikon. It soaks up the broth.
✔ Add a little karashi (Japanese mustard) if you like a kick.
✔ Perfect after a chilly evening walk to a shrine.

More seasonal Japan 👉 link in bio

#oden #japanesefood #wintertaste #japantravel #japanfood""",
 'zh': """關東煮「おでん」🍢 日本冬天的暖心料理

天氣一冷，日本人就會想吃關東煮：白蘿蔔、水煮蛋、蒟蒻和魚漿製品，在清淡的高湯裡慢慢燉煮。到了寒冷的季節，很多便利商店的櫃台也會擺上一鍋。

✔ 先吃白蘿蔔，最吸湯汁
✔ 喜歡一點辣味，可以沾點黃芥末（からし）
✔ 冬夜散步去神社之後，來一碗剛剛好

更多日本當季旅遊資訊 👉 個人檔案連結

#關東煮 #日本美食 #日本冬天 #日本旅遊 #日本料理""",
 'ko': """오뎅(おでん) 🍢 일본 겨울의 따뜻한 요리

날씨가 추워지면 일본 사람들은 오뎅을 찾습니다. 무, 삶은 달걀, 곤약, 어묵을 맑은 다시 국물에 천천히 끓인 요리예요. 추운 계절에는 많은 편의점 계산대 옆에서도 냄비를 볼 수 있어요.

✔ 무부터 드셔 보세요. 국물이 가장 잘 배어 있어요
✔ 톡 쏘는 맛을 좋아하면 겨자(からし)를 살짝
✔ 쌀쌀한 저녁, 신사 산책 후에 딱입니다

일본의 계절 여행 정보 더 보기 👉 프로필 링크

#오뎅 #일본음식 #일본겨울 #일본여행 #일본요리""",
 'fr': """L'oden 🍢 le réconfort de l'hiver japonais

Quand il commence à faire froid, le Japon a envie d'oden : radis daikon, œufs durs, konnyaku et galettes de poisson mijotés longuement dans un bouillon dashi léger. Pendant la saison froide, on en trouve même une marmite dans beaucoup de konbini.

✔ Commencez par le daikon : il a absorbé tout le bouillon
✔ Un peu de karashi (moutarde japonaise) pour relever
✔ Parfait après une promenade du soir jusqu'au sanctuaire

Plus de Japon de saison 👉 lien dans la bio

#oden #cuisinejaponaise #hiver #voyagejapon #japon""",
 'es': """Oden 🍢 el plato que reconforta el invierno japonés

Cuando llega el frío, en Japón apetece oden: rábano daikon, huevos cocidos, konnyaku y pasteles de pescado cocidos a fuego lento en un caldo dashi suave. En los meses fríos, muchas tiendas de conveniencia tienen una olla junto a la caja.

✔ Empieza por el daikon: absorbe todo el caldo
✔ Un poco de karashi (mostaza japonesa) si te gusta el picante
✔ Perfecto después de un paseo nocturno hasta el santuario

Más Japón de temporada 👉 enlace en la bio

#oden #comidajaponesa #invierno #viajarajapon #japon""",
 'jp': """寒くなると食べたくなる、おでん🍢

大根、たまご、こんにゃく、ちくわ。
だしでじっくり煮込んだおでんは、体の芯から温めてくれる冬のごちそうです。
この季節は、コンビニのレジ横からただようだしの香りに、つい足が止まりますよね。

🍢 まずは大根から。だしがいちばんしみています
🍢 ぴりっとさせたい日は、からしを少し
🍢 寒い夜の神社参りの帰りに、温かいおでんでひと息

あなたの「次のお休み」の行き先は、プロフィールのリンクから探せます⛩

#おでん #冬の味覚 #冬グルメ #パワースポット巡り #開運""",
}
CAP['wed'] = {
 'en': """Shirataki Falls, Nikko 🍂 Photo by our guide Akki

Akki, the Higher-Dimensional Negotiator, visited this waterfall in Nikko this season. Shirataki means "white falls": the water looks like many white threads falling one over another.

✔ It sits along the Nichien Momiji Line, a scenic mountain road linking Kinugawa Onsen and Shiobara Onsen
✔ A short walk from the parking area, with a small roadside teahouse nearby
✔ Pair it with a soak at Kinugawa Onsen, about 2 hours from Asakusa by Tobu limited express

Plan your own power spot trip 👉 link in bio

#Nikko #Tochigi #waterfall #japantravel #powerspot""",
 'zh': """日光・鬼怒川 🍂 晚秋的溪谷

這是我們的嚮導 Akki, the Higher-Dimensional Negotiator 這個季節在日光拍下的鬼怒川。溪谷兩旁的紅葉，加上溫泉旅館林立的街景，就是鬼怒川溫泉的樣子。

✔ 從淺草搭東武特急約2小時
✔ 附近山路「日鹽紅葉線」上有一座「白瀧」，水流像許多白線重疊落下
✔ 泡完溫泉再去參拜日光的神社，行程剛剛好

規劃你的能量景點之旅 👉 個人檔案連結

#日光 #鬼怒川溫泉 #日本溫泉 #日本旅遊 #能量景點""",
 'ko': """닛코 기누가와(鬼怒川) 🍂 늦가을 계곡

저희 가이드 Akki가 이번 시즌에 닛코에서 직접 찍은 기누가와 계곡입니다. 단풍으로 물든 골짜기와 강을 따라 늘어선 온천 숙소, 이것이 기누가와 온천의 풍경이에요.

✔ 아사쿠사에서 도부 특급으로 약 2시간
✔ 근처 산길 '닛엔 모미지 라인'에는 흰 실이 겹쳐 떨어지는 듯한 '시라타키(白滝)' 폭포도 있어요
✔ 온천을 즐긴 뒤 닛코의 신사까지 함께 돌아보세요

나만의 파워스폿 여행을 계획해 보세요 👉 프로필 링크

#닛코 #기누가와온천 #일본온천 #일본여행 #파워스폿""",
 'fr': """Kinugawa Onsen, Nikkō 🍂 Gorges et sources chaudes

Kinugawa Onsen est une ville thermale installée le long de la rivière Kinugawa, à Nikkō. En automne, les érables colorent les gorges, juste sous les fenêtres des auberges.

✔ Environ 2 heures depuis Asakusa en train express Tobu
✔ Sur la route de montagne Nichien Momiji Line, la cascade Shirataki semble faite de fils blancs superposés
✔ Un bain chaud, puis une visite des sanctuaires de Nikkō : la journée parfaite

Préparez votre voyage 👉 lien dans la bio

#Nikko #Kinugawa #onsen #voyagejapon #japon""",
 'es': """Kinugawa Onsen, Nikko 🍂 Desfiladero y aguas termales

Kinugawa Onsen es un pueblo de aguas termales a orillas del río Kinugawa, en Nikko. En otoño, los arces tiñen el desfiladero justo debajo de los hoteles.

✔ Unas 2 horas desde Asakusa en el tren expreso de Tobu
✔ En la carretera de montaña Nichien Momiji Line está la cascada Shirataki, que parece hecha de hilos blancos
✔ Un baño caliente y luego los santuarios de Nikko: un día perfecto

Planea tu viaje 👉 enlace en la bio

#Nikko #Kinugawa #onsen #viajarajapon #japon""",
 'jp': """アッキーが歩いた、晩秋の日光。
日塩もみじライン沿いにある「白滝」です🍂

何本もの白い糸が重なって落ちるように見えることから、この名前がついたと言われています。
駐車場からすぐ近くまで歩いて行けて、峠の茶屋もあるので、ドライブの休憩にぴったり。

🍂 鬼怒川温泉と塩原温泉を結ぶ、日塩もみじライン沿い
🍂 滝のそばには、2本並んだ「寄り添いもみじ」も
🍂 帰りは鬼怒川温泉で、ゆっくり温まって

近くのパワースポットは、プロフィールのリンクから探せます⛩

#日光 #白滝 #日塩もみじライン #鬼怒川温泉 #パワースポット""",
}
CAP['thu'] = {
 'en': """Going to an onsen for the first time? ♨️

Here are the 5 rules locals follow:
1. Wash and rinse your body at the shower area before getting in.
2. Keep your small towel out of the water. Many people put it on their head.
3. Tie up long hair so it doesn't touch the water.
4. No swimsuits in most traditional baths.
5. Some places don't allow tattoos. Check the rules before you go.

Drink water after bathing, and skip the bath if you've had a lot to drink.

Find hot spring towns near your power spot 👉 link in bio

#onsen #japantips #hotspring #japantravel #ryokan""",
 'zh': """第一次泡日本溫泉？♨️

當地人都會遵守的5個規矩：
1. 入池前，先在沖洗區把身體洗乾淨。
2. 小毛巾不要放進池裡，很多人會把它放在頭上。
3. 長髮要綁起來，不要碰到水。
4. 大部分傳統溫泉不能穿泳衣。
5. 有些地方不接受刺青，出發前請先確認。

泡完記得補充水分，喝了很多酒就先別泡。

照片是群馬・草津溫泉的「湯畑」。

找到能量景點附近的溫泉鄉 👉 個人檔案連結

#日本溫泉 #泡湯 #日本旅遊小知識 #日本旅遊 #草津溫泉""",
 'ko': """일본 온천, 처음이세요? ♨️

현지인이 지키는 5가지 규칙:
1. 탕에 들어가기 전에 씻는 곳에서 몸을 먼저 씻어요.
2. 작은 수건은 탕에 넣지 않아요. 머리 위에 올려두는 사람이 많아요.
3. 긴 머리는 물에 닿지 않게 묶어요.
4. 대부분의 전통 온천은 수영복을 입지 않아요.
5. 문신을 허용하지 않는 곳도 있어요. 가기 전에 규정을 확인하세요.

목욕 후에는 물을 마시고, 술을 많이 마셨다면 온천은 쉬어 가세요.

사진은 군마현 구사쓰 온천의 '유바타케'입니다.

파워스폿 근처의 온천 마을을 찾아보세요 👉 프로필 링크

#일본온천 #온천여행 #일본여행팁 #일본여행 #구사쓰온천""",
 'fr': """Votre premier onsen au Japon ? ♨️

Les 5 règles que suivent les Japonais :
1. Lavez-vous et rincez-vous aux douches avant d'entrer dans le bain.
2. La petite serviette ne va pas dans l'eau. Beaucoup la posent sur la tête.
3. Attachez les cheveux longs pour qu'ils ne touchent pas l'eau.
4. Pas de maillot de bain dans la plupart des bains traditionnels.
5. Certains établissements refusent les tatouages : vérifiez avant d'y aller.

Buvez de l'eau après le bain, et évitez-le si vous avez beaucoup bu.

Photo : Ginzan Onsen, à Yamagata.

Trouvez les villes thermales près de votre lieu sacré 👉 lien dans la bio

#onsen #conseilsvoyage #sourcechaude #voyagejapon #japon""",
 'es': """¿Tu primer onsen en Japón? ♨️

Las 5 reglas que siguen los japoneses:
1. Lávate y aclárate en las duchas antes de entrar al baño.
2. La toalla pequeña no entra en el agua. Muchos la ponen sobre la cabeza.
3. Recógete el pelo largo para que no toque el agua.
4. En la mayoría de los baños tradicionales no se usa bañador.
5. Algunos lugares no admiten tatuajes: consulta las normas antes de ir.

Bebe agua después del baño y evítalo si has bebido mucho alcohol.

Foto: Nyuto Onsen, en Akita.

Encuentra pueblos termales cerca de tu lugar sagrado 👉 enlace en la bio

#onsen #consejosdeviaje #aguastermales #viajarajapon #japon""",
 'jp': """寒い季節こそ、温泉でほっとひと息♨️
意外と知らない、温泉の入り方をおさらいしましょう。

1. 湯船に入る前に、洗い場で体を洗う（かけ湯だけでも）
2. タオルは湯船に入れない。頭の上にのせる人も多いです
3. 長い髪は、お湯につかないようにまとめる
4. 水着は基本的に着ない
5. 入浴後は、しっかり水分をとる

お酒をたくさん飲んだあとの入浴は控えましょう。

写真は熊本・黒川温泉の夜。
温泉地の近くには、古くからのパワースポットが多いんです。

温泉旅行のついでに寄りたい聖地は、プロフィールのリンクから探せます⛩

#温泉 #温泉旅行 #温泉マナー #パワースポット #開運""",
}
CAP['fri'] = {
 'en': """Kanazawa 🏯 Snow ropes, gardens and gold

Every year on November 1, gardeners at Kenrokuen, one of Japan's three great gardens, begin putting up yukitsuri: cone-shaped ropes that protect the branches from heavy snow. The famous Karasaki pine alone gets 5 poles and about 800 ropes.

✔ Over 99% of Japan's gold leaf is made in Kanazawa. Try a gold-leaf soft cream!
✔ Stroll the old teahouse streets of Higashi Chaya
✔ About 2.5 hours from Tokyo on the fastest Hokuriku Shinkansen

Find power spots around Kanazawa 👉 link in bio

#Kanazawa #Kenrokuen #Ishikawa #japantravel #powerspot""",
 'zh': """金澤 🏯 雪吊、庭園與金箔

每年11月1日，日本三名園之一的「兼六園」會開始架設「雪吊」：用圓錐狀的繩子把樹枝吊起來，保護它們不被積雪壓斷。最有名的「唐崎松」光是一棵就要用5根柱子、約800條繩子。

✔ 日本九成九以上的金箔都產自金澤，來一支金箔霜淇淋吧
✔ 漫步古色古香的「東茶屋街」
✔ 從東京搭最快的北陸新幹線約2.5小時

找到金澤周邊的能量景點 👉 個人檔案連結

#金澤 #兼六園 #石川縣 #日本旅遊 #能量景點""",
 'ko': """가나자와(金沢) 🏯 유키즈리, 정원, 그리고 금박

매년 11월 1일, 일본 3대 정원 중 하나인 '겐로쿠엔'에서는 '유키즈리'를 시작합니다. 원뿔 모양으로 밧줄을 매달아 눈의 무게로부터 나뭇가지를 지키는 작업이에요. 유명한 '가라사키 소나무' 한 그루에만 기둥 5개와 밧줄 약 800개가 쓰입니다.

✔ 일본 금박의 99% 이상이 가나자와에서 만들어져요. 금박 소프트아이스크림도 꼭!
✔ 옛 찻집 거리 '히가시차야'를 걸어 보세요
✔ 도쿄에서 가장 빠른 호쿠리쿠 신칸센으로 약 2시간 30분

가나자와 주변 파워스폿 찾기 👉 프로필 링크

#가나자와 #겐로쿠엔 #이시카와 #일본여행 #파워스폿""",
 'fr': """Kanazawa 🏯 Cordes à neige, jardins et or

Chaque année, le 1er novembre, les jardiniers du Kenroku-en, l'un des trois plus beaux jardins du Japon, commencent à installer les yukitsuri : des cordes en cône qui protègent les branches du poids de la neige. Le célèbre pin Karasaki reçoit à lui seul 5 mâts et environ 800 cordes.

✔ Plus de 99 % des feuilles d'or du Japon sont fabriquées à Kanazawa. Goûtez la glace à la feuille d'or !
✔ Flânez dans les ruelles des maisons de thé de Higashi Chaya
✔ Environ 2 h 30 depuis Tokyo avec le Hokuriku Shinkansen le plus rapide

Les lieux sacrés autour de Kanazawa 👉 lien dans la bio

#Kanazawa #Kenrokuen #Ishikawa #voyagejapon #japon""",
 'es': """Kanazawa 🏯 Cuerdas de nieve, jardines y oro

Cada año, el 1 de noviembre, los jardineros del Kenroku-en, uno de los tres grandes jardines de Japón, empiezan a colocar los yukitsuri: cuerdas en forma de cono que protegen las ramas del peso de la nieve. Solo el famoso pino Karasaki lleva 5 postes y unas 800 cuerdas.

✔ Más del 99 % del pan de oro de Japón se hace en Kanazawa. ¡Prueba el helado con pan de oro!
✔ Pasea por las calles de casas de té de Higashi Chaya
✔ Unas 2 h 30 desde Tokio en el Hokuriku Shinkansen más rápido

Lugares sagrados cerca de Kanazawa 👉 enlace en la bio

#Kanazawa #Kenrokuen #Ishikawa #viajarajapon #japon""",
 'jp': """加賀百万石の城下町、金沢🏯

日本三名園のひとつ、兼六園では毎年11月1日から「雪吊り」が始まります。
雪の重みで枝が折れないよう、縄で枝を吊る冬の準備。
なかでも唐崎松は、5本の柱と約800本の縄で吊られる、兼六園の冬の主役です。

✨ 日本の金箔の99%以上は金沢で作られています。金運アップを願って、金箔スイーツも
✨ 写真は、ひがし茶屋街の灯り。夕暮れの散歩が素敵です
✨ 東京から北陸新幹線（最速）で約2時間30分

金沢まわりのパワースポットは、プロフィールのリンクから探せます⛩

#金沢 #兼六園 #雪吊り #ひがし茶屋街 #パワースポット""",
}
CAP['sat'] = {
 'en': """Korankei, Aichi 🍁 A gorge of thousands of maples

Korankei in Toyota City is one of the most famous autumn-leaf spots in central Japan. In 1634, a priest of Kojakuji temple is said to have planted maples along the path while reciting a sutra, one tree at a time. Today the whole valley turns red, usually from mid to late November.

✔ Don't miss the red Taigetsukyo bridge over the river
✔ During the November maple festival, the leaves are lit up after dark
✔ Weekends get very busy. Go early in the morning.

Find your power spot 👉 link in bio

#Korankei #Aichi #autumnleaves #japantravel #powerspot""",
 'zh': """愛知・香嵐溪 🍁 數千棵楓樹的溪谷

位於豐田市的香嵐溪，是日本中部最有名的賞楓名所之一。據說在1634年，香積寺的住持一邊念誦經文，一邊在參道旁一棵一棵種下楓樹。如今每年11月中旬到下旬，整個溪谷都會被染紅。

✔ 別錯過橫跨溪流的紅色「待月橋」
✔ 11月的紅葉祭期間，晚上還有點燈
✔ 週末人潮很多，建議一早出發

找到適合你的能量景點 👉 個人檔案連結

#香嵐溪 #愛知 #日本紅葉 #日本旅遊 #能量景點""",
 'ko': """아이치 고란케이(香嵐渓) 🍁 수천 그루 단풍의 계곡

도요타시에 있는 고란케이는 일본 중부를 대표하는 단풍 명소입니다. 1634년, 고자쿠지(香積寺)의 주지 스님이 경을 외우며 참배길에 단풍나무를 한 그루씩 심었다고 전해져요. 지금은 해마다 11월 중순에서 하순에 계곡 전체가 붉게 물듭니다.

✔ 강 위의 빨간 다리 '다이게쓰쿄(待月橋)'는 꼭 보세요
✔ 11월 단풍 축제 기간에는 밤에 라이트업도 해요
✔ 주말은 무척 붐비니 아침 일찍 가세요

나에게 맞는 파워스폿 찾기 👉 프로필 링크

#고란케이 #아이치 #일본단풍 #일본여행 #파워스폿""",
 'fr': """Kōrankei, Aichi 🍁 Des milliers d'érables

Kōrankei, à Toyota, est l'un des plus célèbres sites de feuillage d'automne du centre du Japon. En 1634, un moine du temple Kōjaku-ji aurait planté des érables le long du chemin, un par un, en récitant un sutra. Aujourd'hui, toute la vallée rougit, en général de mi à fin novembre.

✔ Ne manquez pas le pont rouge Taigetsu-kyō
✔ Pendant la fête des érables en novembre, les feuillages sont illuminés le soir
✔ Le week-end, il y a foule : venez tôt le matin

Trouvez votre lieu sacré 👉 lien dans la bio

#Korankei #Aichi #automneaujapon #voyagejapon #japon""",
 'es': """Kōrankei, Aichi 🍁 Un desfiladero de miles de arces

Kōrankei, en la ciudad de Toyota, es uno de los lugares de hojas de otoño más famosos del centro de Japón. Se dice que en 1634 un monje del templo Kōjaku-ji plantó arces a lo largo del camino, uno a uno, mientras recitaba un sutra. Hoy todo el valle se tiñe de rojo, normalmente de mediados a finales de noviembre.

✔ No te pierdas el puente rojo Taigetsu-kyō
✔ Durante el festival de los arces de noviembre, las hojas se iluminan de noche
✔ Los fines de semana hay mucha gente: ve temprano

Encuentra tu lugar sagrado 👉 enlace en la bio

#Korankei #Aichi #otoñoenjapon #viajarajapon #japon""",
 'jp': """東海を代表する紅葉の名所、愛知・香嵐渓🍁

始まりは、1634年。
香積寺の和尚さんが、お経を唱えながら参道にもみじを一本一本植えたのがきっかけと伝えられています。
その祈りが、今では数千本のもみじが渓谷を染める絶景に。

🍁 見頃は例年11月中旬〜下旬
🍁 赤い「待月橋」と紅葉の組み合わせは必見
🍁 11月のもみじまつりの期間は、夜のライトアップも
🍁 週末はとても混むので、朝早めがおすすめです

一本ずつ植えられた祈りの道を、ゆっくり歩いてみませんか。

全国の聖地は、プロフィールのリンクから無料で診断できます⛩

#香嵐渓 #紅葉 #愛知観光 #パワースポット #開運""",
}
CAP['sun'] = {
 'en': """Japan has tens of thousands of shrines and temples. Where do you start? ⛩

Our free website picks the sacred places that suit you, from shrines and temples to sacred trees, waterfalls and mountains, based on:
✔ your wish (love, money, health, work…)
✔ your birth date
✔ where you're staying

Build a day-by-day plan and save your favourites to "My list". No sign-up needed.

Try it now 👉 link in bio
Guided by Akki, the Higher-Dimensional Negotiator

#japantravel #powerspot #japaneseshrine #japantrip #spiritualjourney""",
 'zh': """日本的神社和寺院多達數萬座，該從哪裡開始？⛩

我們的免費網站會依照以下條件，從神社、寺院到神木、瀑布和聖山，為你挑選適合的地方：
✔ 你的願望（戀愛、財運、健康、事業⋯）
✔ 你的生日
✔ 你的住宿地點

還能排出每天的行程，把喜歡的景點存進「我的清單」。不用註冊。

現在就來試試 👉 個人檔案連結
Guide: Akki, the Higher-Dimensional Negotiator

#日本旅遊 #能量景點 #日本神社 #日本自由行 #心靈之旅""",
 'ko': """일본에는 신사와 절이 수만 곳. 어디부터 가 볼까요? ⛩

저희 무료 사이트는 신사와 절은 물론 신목, 폭포, 영산까지, 다음 조건으로 나에게 맞는 곳을 골라 드립니다.
✔ 나의 소원 (연애, 금전, 건강, 일…)
✔ 생년월일
✔ 머무는 곳

하루 단위 일정도 짜고, 마음에 드는 곳은 '내 리스트'에 저장하세요. 가입은 필요 없어요.

지금 바로 확인해 보세요 👉 프로필 링크
Guide: Akki, the Higher-Dimensional Negotiator

#일본여행 #파워스폿 #일본신사 #일본자유여행 #힐링여행""",
 'fr': """Le Japon compte des dizaines de milliers de sanctuaires et de temples. Par où commencer ? ⛩

Notre site gratuit choisit pour vous des lieux sacrés, des sanctuaires et temples aux arbres sacrés, cascades et montagnes, selon :
✔ votre vœu (amour, argent, santé, travail…)
✔ votre date de naissance
✔ votre lieu de séjour

Créez un programme jour par jour et gardez vos lieux préférés dans « Ma liste ». Sans inscription.

Essayez maintenant 👉 lien dans la bio
Votre guide : Akki, the Higher-Dimensional Negotiator

#voyagejapon #japon #lieusacre #sanctuairejaponais #voyagespirituel""",
 'es': """Japón tiene decenas de miles de santuarios y templos. ¿Por dónde empezar? ⛩

Nuestra web gratuita elige para ti lugares sagrados, desde santuarios y templos hasta árboles sagrados, cascadas y montañas, según:
✔ tu deseo (amor, dinero, salud, trabajo…)
✔ tu fecha de nacimiento
✔ dónde te alojas

Crea un plan día a día y guarda tus lugares favoritos en tu lista. Sin registro.

Pruébala ahora 👉 enlace en la bio
Tu guía: Akki, the Higher-Dimensional Negotiator

#viajarajapon #japon #lugaressagrados #santuariojapones #viajeespiritual""",
 'jp': """次のお休み、どこに行こうか？⛩

プロフィールのリンクの「開運パワースポット巡り」では、
✔ 叶えたい願い（恋愛・金運・健康・仕事…）
✔ 生年月日（九星気学・数秘術）
✔ 出発地と移動時間
から、全国のパワースポットの中であなたに合う場所を、無料でお選びします。

出かける日が決まっていなくても大丈夫。
これから2か月の「方位の良い日」もお知らせします。
1日でめぐれるモデルコースも46コース用意しました。

登録はいりません。週末の行き先探しに、ぜひどうぞ🌿

高次元ネゴシエイター アッキー

#パワースポット #神社巡り #開運 #吉方位 #モデルコース""",
}

# 天然石 @nigihayahi03（写真は本人の実物。石の名前は見た目で判断＝確認用ページに明記）
STONE_FOOT = """

━━━━━━━━━━
🔮 魂の系統鑑定(無料)
生年月日を入れるだけで、全94種の「魂の系統」と今年の運勢がわかります。
あなたにピッタリの天然石ブレスレットもご提案します。
プロフィールのリンクからどうぞ。
━━━━━━━━━━"""
STONES = {
 'mon': ('lapis.jpg', {}, '天然石の豆知識', 'ラピスラズリ', '夜空を閉じこめたような、深い青', """深い青に、金色の粒がきらり。ラピスラズリです。

古くから世界中で大切にされてきた石で、昔は砕いて「ウルトラマリン」という青い絵の具にも使われていました。
日本では、12月の誕生石のひとつでもあります。

真っ青な中に見える小さな金色の点は、パイライト（黄鉄鉱）。
星が散らばった夜空のようで、見ていると不思議と気持ちが落ち着きます。

水や汗に弱い石なので、つけたあとはやわらかい布で軽くふいてあげてください。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #ラピスラズリ #魂の系統鑑定", False),
 'tue': ('tigereye.jpg', {'crop': (0, 0, 1500, 1350)}, '天然石の豆知識', 'タイガーアイ', '光の帯が動く、虎の目の石', """茶色と金色のしま模様、タイガーアイ。

光の当たり方を変えると、石の表面を光の帯がすっと動きます。
その様子が虎の目のように見えることから、この名前がつきました。

昔から、仕事運や金運のお守りとして身につけられてきた石と言われています。
「ここぞ」という日に、背中を押してほしいときにおすすめです。

写真のブレスレットは、大きめの玉でしっかりした存在感。
手首を動かすたびに光が流れるのを、ぜひ楽しんでください。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #タイガーアイ #魂の系統鑑定", False),
 'wed': ('crystal-sea.jpg', {'fy': 0.6}, '天然石の豆知識 No.4', '石の相性', '組み合わせに迷ったら、水晶を', """天然石の豆知識 No.4
「石と石の相性って、あるんですか？」

よくいただく質問です。
石の組み合わせについてはいろいろな考え方がありますが、迷ったときにおすすめなのが水晶。
水晶は、どんな色の石ともなじみやすく、全体をまとめてくれる石と言われています。

組み合わせを決めるときは、
・「なんとなく惹かれる」という直感を大切に
・色が多すぎると感じたら、透明な水晶をはさんでみる
・つけてみて、しっくりくるかどうか

いちばん大切なのは、あなたが毎日気持ちよくつけられることです。

写真は、海辺で手首につけた水晶のブレスレット。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #水晶 #魂の系統鑑定", False),
 'thu': ('rutile.jpg', {}, '天然石の豆知識', 'ルチルクォーツ', '水晶の中に、金色の針', """透明な水晶の中に、金色の細い針。ルチルクォーツです。

この針の正体は、ルチルという鉱物。
水晶ができるときに、中に閉じこめられたものです。
同じものは二つとなく、針の入り方で一粒ずつ表情がまったく違います。

金色の輝きから、金運のお守りとして人気のある石と言われています。

写真は、金色の針がたっぷり入ったブレスレット。
光にかざすと、針がきらきらと輝きます。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #ルチルクォーツ #魂の系統鑑定", False),
 'fri': ('black-rutile.jpg', {'crop': (0, 120, 1650, 1350)}, '天然石の豆知識', 'ブラックルチル', '透明な中を走る、黒い線', """透明な水晶の中を、黒い線がすっと走る石。
「ブラックルチル」と呼ばれて親しまれています。

一粒ずつ黒い線の入り方が違うので、選ぶときは、ぜひ実物を見比べてみてください。
黒は、気持ちを引き締めたいときや、迷いを断ち切りたいときに選ばれることが多い色です。

透明と黒だけのシンプルな組み合わせは、服を選ばず、男性にも人気があります。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #ブラックルチル #魂の系統鑑定", False),
 'sat': ('crystal-tray.jpg', {}, '天然石の豆知識 No.5', '本物と偽物', '見分けるための3つの目安', """天然石の豆知識 No.5
「本物と偽物って、どう見分けるの？」

天然石によく似せた、ガラスや樹脂の玉もあります。
完全に見分けるには専門の検査が必要ですが、目安になるポイントを3つ。

1. 手に持つと、ひんやり冷たく感じやすい（ガラスや樹脂より冷たいことが多い）
2. 中に丸い気泡が入っていたら、ガラスの可能性
3. 色や模様が均一すぎるものは、染めたものの場合も

そして何より、信頼できるお店で選ぶこと。
わからないことは、遠慮なくお店の人に聞いてみてください。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #天然石の選び方 #魂の系統鑑定", False),
 'sun': ('crystal-sky.jpg', {'fy': 0.4}, '天然石の豆知識', '水晶', '空にかざすと、街が逆さまに', """東京の空に、水晶の連をかざしてみました。

一粒ひとつぶに、空とビルが小さく、逆さまに映っています。
透明な水晶は、レンズのように景色を映すんです。

水晶は、どんな石とも合わせやすく、天然石を初めて選ぶ方にもおすすめの石。
「浄化の石」とも呼ばれ、ほかの石と一緒に置いておく人も多いんですよ。

日曜日の夜、手もとの石を、少し光にかざしてみませんか。""" + STONE_FOOT + "\n\n#天然石 #パワーストーン #天然石ブレスレット #水晶 #魂の系統鑑定", False),
}

# 英語版の朝 8:00（写真全面＋問い）
AM = [
 ('11-23', 'w2-am23-en', 'Why are so many torii\npainted bright red?', """Why are so many torii gates painted bright red? ⛩

The vermilion color is traditionally said to ward off evil and bad luck. It was also made with pigments that helped protect the wood.

The gate in this photo is the famous "floating" torii of Itsukushima Shrine in Miyajima, Hiroshima. At high tide it seems to stand on the sea.

Save this for your trip 📌"""),
 ('11-24', 'w2-am24-en', 'What does this rope\nat shrines mean?', """What does the thick rope at shrines mean? 🪢

It's called shimenawa. It marks a sacred space, a place where something holy is present. You'll see it on shrine buildings, gates, giant trees and even rocks, often with zigzag paper strips called shide.

When you see one, slow down and treat the place with respect.

Save this for your trip 📌"""),
 ('11-25', 'w2-am25-en', 'Why do the two guardian\nlions look different?', """Look closely at the pair of guardian "lion-dogs" at a shrine 🦁

They're called komainu. Usually one has its mouth open and the other has it closed. This is said to represent "a" and "un", the first and last sounds, the beginning and the end of everything.

Next time, check which one is open!

Save this for your trip 📌"""),
 ('11-26', 'w2-am26-en', 'You can leave a wish\nat the shrine', """You can leave a wish at a Japanese shrine ✍️

Buy a small wooden plaque called ema at the shrine office, write your wish on it, and hang it on the rack. Your wish can be in any language.

This photo shows ema at Suga Shrine in Shinjuku, Tokyo.

Save this for your trip 📌"""),
 ('11-27', 'w2-am27-en', 'Bought an omamori?\nDon’t open it', """Bought an omamori (lucky charm)? Here's what to know 🧧

✔ Carry it with you: in your bag, wallet or phone case
✔ Don't open it. The blessing is inside
✔ Many people take it back to a shrine or temple after about a year to be returned, and get a new one

Save this for your trip 📌"""),
 ('11-28', 'w2-am28-en', 'Can you take photos\nat shrines?', """Can you take photos at shrines? 📷

Usually yes, in the grounds. But many shrines and temples ask visitors not to take photos inside the main halls or during ceremonies. Look for signs, and don't photograph people while they're praying.

When in doubt, ask or put the camera away for a moment.

Save this for your trip 📌"""),
 ('11-29', 'w2-am29-en2', 'The best time to visit\na shrine or temple', """The best time to visit a shrine or temple? Early morning 🌅

The air is fresh, the paths are quiet, and you often see priests and monks sweeping the grounds. It's also the best time for photos without crowds.

This photo shows the approach path of Kumadani-ji, a temple in Shikoku.

Save this for your trip 📌"""),
]
AM_TAGS = "\n\n#Japan #JapanTravel #JapanTips #PowerSpot #JapaneseShrine"
