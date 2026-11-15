# ご当地グルメ図鑑：料理ごとの追加情報（2026-11-15）
# k = 種類: n 麺 / r ご飯・すし / h 鍋・汁物 / m 肉料理 / s 魚介 / w 甘いもの / f 果物・旬の産物 / o 郷土の一品
# i = 主な材料（見てわかる主材料だけ。だし・調味料は含めない）
#   B 牛肉 / P 豚肉 / C 鶏肉 / L 羊肉 / H 馬肉 / W 鯨肉 / D 鴨肉 / F 魚 / S 貝・えび・かに・いか・たこ・うに
#   E 卵 / M 乳製品 / G 小麦 / K そば / N ナッツ類・ごま / A 酒（酒かす・焼酎・泡盛など）
# s = 旬・食べる時期（任意）: [季節コード, '月の範囲']  季節コード: sp su au wi ny(正月)
INFO_RAW = '''
ジンギスカン|m|L
海鮮丼|r|FS
札幌ラーメン|n|PG
石狩鍋|h|F
ちゃんちゃん焼き|s|FM
松前漬け|o|FS
イカそうめん|s|S
じゃがバター|o|M
三平汁|h|F|wi
ラムしゃぶ|m|L
エスカロップ|r|PEGM
ルイベ|s|F
タラバガニ|s|S|wi
せんべい汁|h|CG
りんご|f||au wi:9-2
ホタテ|s|S
いちご煮|h|S
貝焼き味噌|o|SE
けの汁|h||ny
バラ焼き|m|B
わんこそば|n|KG
盛岡冷麺|n|BEG
じゃじゃ麺|n|PEG
南部はっと|h|G
まめぶ汁|h|GN
ひっつみ|h|CG
くるみ雑煮|h|N|ny
豆しとぎ|w|
牛たん焼き|m|B
ずんだ餅|w|
笹かまぼこ|s|F
温麺|n|G
せり鍋|h|C|wi
はらこ飯|r|F|au:9-11
気仙沼ホルモン|m|P
きりたんぽ鍋|h|C|au wi
稲庭うどん|n|G
いぶりがっこ|o|
ハタハタ寿司|s|F
だまこもち|h|C
ババヘラ|w|
芋煮|h|B|au
米沢牛|m|B
さくらんぼ|f||su:6-7
ひっぱりうどん|n|GF
のし梅|w|
冷やしラーメン|n|G|su
だし|o||su
喜多方ラーメン|n|PG
会津のソースカツ丼|r|PEG
桃|f||su:7-9
こづゆ|h|S
いかにんじん|o|S
円盤餃子|o|PG
天ぷらまんじゅう|w|G
ウニの貝焼き|s|S
クリームボックス|w|GM
あんこう鍋|h|F|wi:11-3
納豆|o|
干し芋|o||wi
しもつかれ|o|F
どぶ汁|h|F|wi
吉原殿中|w|
宇都宮餃子|o|PG
いちご|f||wi sp:12-5
日光の湯葉|o|
足利シュウマイ|o|G
いもフライ|o|G
水沢うどん|n|G
焼きまんじゅう|w|G
下仁田ねぎ|f||wi:11-1
おっきりこみ|h|G
草加せんべい|w|
川越のさつまいも菓子|w|
深谷ねぎ|f||wi
煮ぼうとう|h|G
冷汁うどん|n|GN|su
みそポテト|o|
ゼリーフライ|o|
フライ|o|G
五家宝|w|
なめろう|s|F
落花生|f|N|au
勝浦タンタンメン|n|PG
太巻き祭り寿司|r|
ぬれせんべい|w|
はかりめ丼|r|F
江戸前寿司|r|FS
もんじゃ焼き|o|G
深川めし|r|S
どぜう鍋|h|F
柳川鍋|h|FE
親子丼|r|CE
天丼|r|FSEG
べったら漬|o|
東京ラーメン|n|CPG
しらす丼|r|F|sp au
横浜中華街の点心|o|PG
よこすか海軍カレー|r|G
ういろう|w|
けんちん汁|h|
へぎそば|n|KG
笹団子|w|
コシヒカリ|r||au
のっぺ|h|
笹寿司|r|
ます寿司|r|F
白えび|s|S|sp su:4-11
富山ブラック|n|PG
氷見うどん|n|G
ぶり大根|s|F|wi
昆布締め|s|F
富山おでん|h|F
治部煮|h|DG
金沢おでん|h|FS
のどぐろ|s|F
かぶら寿司|s|F|wi
金沢カレー|r|PEG
能登丼|r|FS
大根ずし|s|F|wi
とり野菜|h|C
越前がに|s|S|wi:11-3
越前おろしそば|n|KG
ソースカツ丼|r|PEG
へしこ|s|F
鯖寿司|r|F
越前かにめし|r|S
ボルガライス|r|PEG
ほうとう|h|G
信玄餅|w|
ぶどう|f||su au:7-10
吉田のうどん|n|G
信州そば|n|KG|au
おやき|o|G
野沢菜漬|o||wi
山賊焼|m|C
蕎麦がき|o|K
すんき漬け|o||wi
五平餅|o|N
飛騨牛|m|B
朴葉味噌|o|
栗きんとん|w||au:9-10
鶏ちゃん|m|C
漬物ステーキ|o|E
若鮎|w|GE|su
静岡おでん|h|F
浜名湖のうなぎ|s|F
桜えび|s|S|sp au:4-6,10-12
黒はんぺん|s|F
わさび漬け|o|A
たまごふわふわ|o|E
みしまコロッケ|o|G
ひつまぶし|r|F
味噌煮込みうどん|n|G
手羽先|m|C
きしめん|n|G
天むす|r|SG
味噌カツ|m|PEG
小倉トースト|w|GM
鬼まんじゅう|w|G
菜飯田楽|r|
どて焼き|m|
伊勢うどん|n|G
赤福餅|w|
松阪牛|m|B
手こね寿司|r|F
四日市とんてき|m|P
近江牛|m|B
鮒寿司|s|F
近江ちゃんぽん|n|PG
焼鯖そうめん|n|FG
あめのいおご飯|r|F
じゅんじゅん|h|
湯豆腐|h||wi
八ツ橋|w|
宇治抹茶のスイーツ|w|M
阿闍梨餅|w|GE
水無月|w||su:6
ばらずし|r|F
衣笠丼|r|E
麩|o|G
たこ焼き|o|SEG
お好み焼き|o|EG
串カツ|m|EG
肉吸い|h|B
うどんすき|h|FSG
はりはり鍋|h|W
ホルモン焼き|m|
岩おこし|w|
神戸牛|m|B
明石焼き|o|SEG
出石皿そば|n|KG
釘煮|s|F|sp:2-4
かつめし|r|EG
にくてん|o|BG
ひねポン|m|C
柿の葉寿司|r|F
三輪そうめん|n|G
奈良漬|o|A
茶粥|r|
飛鳥鍋|h|CM
葛切り|w|
蘇|w|M
紀州の梅干し|o|
和歌山ラーメン|n|PG
めはり寿司|r|
胡麻豆腐|o|N
秋刀魚寿司|r|F
松葉がに|s|S|wi:11-3
二十世紀梨|f||su au:8-9
牛骨ラーメン|n|BG
とうふちくわ|s|F
いただき|r|
出雲そば|n|KG
しじみ汁|h|S
出雲ぜんざい|w|
うずめ飯|r|
生姜糖|w|
白桃|f||su:7-8
きびだんご|w|
デミカツ丼|r|PEG
ままかりずし|r|F
カキオコ|o|SEG|wi
ぶっかけうどん|n|G
そずり鍋|h|B
広島風お好み焼き|o|PEG
牡蠣|s|S|wi:11-3
もみじ饅頭|w|GE
あなご飯|r|F
牡蠣の土手鍋|h|S|wi
府中焼き|o|PEG
小いわし料理|s|F
ふく（ふぐ）料理|s|F|wi
瓦そば|n|BEKG
岩国寿司|r|FE
わかめむすび|r|
徳島ラーメン|n|PEG
すだち|f||su au:8-10
鳴門金時|f||au wi
祖谷そば|n|K
たらいうどん|n|G
ぼうぜの姿寿司|r|F|au
讃岐うどん|n|G
骨付鳥|m|C
オリーブハマチ|s|F
釜玉うどん|n|EG
まんばのけんちゃん|o||wi
餡餅雑煮|h||ny
しょうゆ豆|o|
鯛めし|r|FE
みかん|f||wi:11-2
じゃこ天|s|F
伊予さつま|r|F
せんざんき|m|C
ひゅうが飯|r|F
焼豚玉子飯|r|PE
鍋焼きうどん|n|G
カツオのたたき|s|F|sp au
鍋焼きラーメン|n|CEG
文旦|f||wi sp:1-4
皿鉢料理|s|FS
芋ケンピ|w|
田舎ずし|r|
室戸キンメ丼|r|F
うつぼ料理|s|F
博多ラーメン|n|PG
もつ鍋|h|B
明太子|s|F
がめ煮|h|C
久留米やきとり|m|CP
博多うどん|n|G
鰻のせいろ蒸し|r|FE
鶴乃子|w|E
かしわめし|r|C
戸畑ちゃんぽん|n|PSG
呼子のイカ|s|S
佐賀牛|m|B
シシリアンライス|r|E
いかしゅうまい|s|SG
須古寿し|r|
長崎ちゃんぽん|n|PSG
皿うどん|n|PSG
カステラ|w|GE
トルコライス|r|PEG
角煮|m|P
ハトシ|o|SG
レモンステーキ|m|B
佐世保バーガー|o|BEG
大村寿司|r|FE
五島うどん|n|G
馬刺し|m|H
太平燕|h|PSE
からし蓮根|o|G
高菜めし|r|
ちくわサラダ|o|FEG
とり天|m|CEG
関さば|s|F
だんご汁|h|G
あつめし|r|F
ごまだし|n|FNG
中津からあげ|m|C
チキン南蛮|m|CEG
地鶏の炭火焼き|m|C
マンゴー|f||sp su:4-8
冷や汁|r|FN|su
肉巻きおにぎり|r|P
飫肥天|s|F
ねりくり|w|
鶏刺し|m|C
黒豚しゃぶしゃぶ|m|P
鶏飯|r|CE
しろくま|w|M|su
薩摩汁|h|C
両棒餅|w|
豚骨料理|m|PA
がね|o|G
高麗餅|w|
ソーキそば|n|PG
ゴーヤーチャンプルー|o|E|su
サーターアンダギー|w|GE
ラフテー|m|PA
タコライス|r|BM
てびち|m|P
にんじんしりしり|o|E
豆腐よう|o|A
ジーマーミ豆腐|o|N
宮古そば|n|PG
八重山そば|n|PFG
アーサ汁|h|
ポーク玉子|o|PE
ヒラヤーチー|o|G
'''

# 食べ方のコツ（6言語）
TIPS = {
'ジンギスカン': ['肉はドーム型の鍋の上、野菜はまわりの低いところで焼くと、肉のうま味が野菜にしみます。',
  'Grill the meat on top of the dome and the vegetables around the edge, so the juices run down into them.',
  '肉放在圓頂鍋的頂部，蔬菜放在周圍較低處，肉汁會流進蔬菜裡。',
  '고기는 돔 모양 냄비 위쪽에, 채소는 가장자리에 두고 구우면 고기 육즙이 채소에 스며듭니다.',
  'Faites griller la viande sur le dôme et les légumes autour : le jus de la viande coule sur eux.',
  'Asa la carne en la parte alta de la cúpula y las verduras alrededor, para que los jugos caigan sobre ellas.'],
'わんこそば': ['お店の人がお椀にどんどんそばを入れてくれます。もう十分なら、お椀にふたをすると終わりの合図です。',
  'Staff keep dropping soba into your bowl. When you have had enough, put the lid on your bowl.',
  '店員會不斷把蕎麥麵放進碗裡。吃飽了，就把碗蓋蓋上表示結束。',
  '직원이 그릇에 계속 소바를 넣어 줍니다. 그만 먹고 싶으면 그릇에 뚜껑을 덮으면 됩니다.',
  'Le personnel remplit votre bol sans arrêt. Quand vous avez assez mangé, refermez le couvercle du bol.',
  'El personal te sigue echando soba en el cuenco. Cuando ya no quieras más, tapa el cuenco con su tapa.'],
'じゃじゃ麺': ['食べ終わる少し前に生卵を割り入れて、お店の人にゆで汁を注いでもらうと「ちーたんたん」というスープになります。',
  'Near the end, crack a raw egg into the bowl and ask for hot noodle water to make a soup called "chītantan".',
  '快吃完時打一顆生蛋進碗裡，請店員加入煮麵水，就成了叫「chītantan」的湯。',
  '거의 다 먹었을 때 날달걀을 깨 넣고 면 삶은 물을 부어 달라고 하면 "치탄탄"이라는 수프가 됩니다.',
  'Vers la fin, cassez un œuf cru dans le bol et demandez de l’eau de cuisson : cela devient une soupe appelée « chītantan ».',
  'Al final, rompe un huevo crudo en el cuenco y pide agua de cocción: se convierte en una sopa llamada «chītantan».'],
'ひっぱりうどん': ['鍋から直接うどんを引っぱり上げて、納豆やサバ缶を合わせたたれにつけて食べます。',
  'Pull the udon straight from the pot and dip it in a sauce of natto and canned mackerel.',
  '直接從鍋裡把烏龍麵拉起來，沾納豆和鯖魚罐頭做的醬汁吃。',
  '냄비에서 우동을 바로 건져 낫토와 고등어 통조림을 섞은 소스에 찍어 먹습니다.',
  'Tirez les udon directement de la marmite et trempez-les dans une sauce au natto et au maquereau en boîte.',
  'Saca el udon directamente de la olla y mójalo en una salsa de natto y caballa en lata.'],
'もんじゃ焼き': ['小さなヘラで鉄板に押しつけ、少し焦げ目がついたところを食べるのがおいしいと言われます。',
  'Press a little onto the griddle with the tiny spatula and eat it once it gets slightly crisp.',
  '用小鏟子把它壓在鐵板上，稍微焦香時最好吃。',
  '작은 주걱으로 철판에 눌러 살짝 눌어붙었을 때 먹으면 맛있습니다.',
  'Pressez un peu de préparation sur la plaque avec la petite spatule et mangez-la quand elle devient légèrement croustillante.',
  'Aprieta un poco contra la plancha con la espátula pequeña y cómelo cuando esté un poco tostado.'],
'江戸前寿司': ['にぎりは手で食べてもかまいません。しょうゆはごはんではなく、ネタのほうに少しつけます。',
  'It is fine to eat nigiri with your hands. Dip the fish side, not the rice, lightly in soy sauce.',
  '握壽司可以用手吃。醬油只沾一點在魚料那一面，不要沾飯。',
  '초밥은 손으로 먹어도 괜찮습니다. 간장은 밥이 아니라 생선 쪽에 살짝 찍습니다.',
  'On peut manger les nigiri avec les doigts. Trempez légèrement le côté poisson, pas le riz, dans la sauce soja.',
  'Puedes comer el nigiri con las manos. Moja un poco en soja el lado del pescado, no el arroz.'],
'ひつまぶし': ['1杯目はそのまま、2杯目はねぎやわさびをのせて、3杯目はだしをかけてお茶漬けにして楽しみます。',
  'Eat the first bowl as it is, the second with green onion and wasabi, and the third with hot broth poured over.',
  '第一碗直接吃，第二碗加蔥和山葵，第三碗淋上高湯做成茶泡飯。',
  '첫 그릇은 그대로, 두 번째는 파와 와사비를 올려서, 세 번째는 육수를 부어 오차즈케로 즐깁니다.',
  'Mangez le premier bol nature, le deuxième avec ciboule et wasabi, et le troisième arrosé de bouillon chaud.',
  'El primer cuenco tal cual, el segundo con cebolleta y wasabi, y el tercero con caldo caliente por encima.'],
'味噌煮込みうどん': ['麺はわざと固めに作られています。鍋のふたを取り皿の代わりにして食べるのが地元流です。',
  'The noodles are firm on purpose. Locals use the pot lid as a small plate.',
  '麵條是刻意做得比較硬的。當地人會把鍋蓋當成小盤子來用。',
  '면은 일부러 단단하게 만듭니다. 현지에서는 냄비 뚜껑을 앞접시처럼 씁니다.',
  'Les nouilles sont fermes exprès. Les habitants utilisent le couvercle comme petite assiette.',
  'Los fideos son firmes a propósito. Los locales usan la tapa de la olla como platito.'],
'伊勢うどん': ['器の底のたれを、太い麺によくからめてから食べます。',
  'Mix the dark sauce at the bottom well into the thick noodles before eating.',
  '先把碗底的醬汁和粗麵拌勻再吃。',
  '그릇 바닥의 소스를 굵은 면에 잘 비벼서 먹습니다.',
  'Mélangez bien la sauce du fond avec les grosses nouilles avant de manger.',
  'Mezcla bien la salsa del fondo con los fideos gruesos antes de comer.'],
'たこ焼き': ['中はとても熱いので、ひと口で食べず、割って少し冷ましてからがおすすめです。',
  'The inside is very hot. Break one open and let it cool a little instead of eating it in one bite.',
  '裡面非常燙，建議不要一口吃，先撥開放涼一下。',
  '속이 아주 뜨거우니 한입에 먹지 말고 갈라서 조금 식힌 뒤 드세요.',
  'L’intérieur est brûlant : coupez-la en deux et laissez refroidir un peu au lieu de l’avaler d’un coup.',
  'El interior quema. Ábrela y déjala enfriar un poco en lugar de comerla de un bocado.'],
'お好み焼き': ['鉄板の上で、小さなヘラで切ってそのまま食べるのが関西流です。',
  'In Kansai, people cut it with a small spatula and eat it right off the griddle.',
  '關西的吃法是在鐵板上用小鏟子切開直接吃。',
  '간사이에서는 철판 위에서 작은 주걱으로 잘라 그대로 먹습니다.',
  'Dans le Kansai, on la coupe avec une petite spatule et on la mange directement sur la plaque.',
  'En Kansai se corta con una espátula pequeña y se come directamente de la plancha.'],
'串カツ': ['みんなで使うソースは「二度づけ禁止」。もう一度つけたいときは、キャベツでソースをすくってかけます。',
  'The shared sauce is "no double dipping". To add more, scoop sauce with a piece of cabbage.',
  '共用的醬汁「禁止沾兩次」。想再沾時，用高麗菜舀醬汁淋上去。',
  '함께 쓰는 소스는 "두 번 찍기 금지". 더 묻히고 싶으면 양배추로 소스를 떠서 뿌립니다.',
  'La sauce commune : « pas de double trempage ». Pour en remettre, prenez-en avec une feuille de chou.',
  'La salsa compartida: «prohibido mojar dos veces». Para echar más, coge salsa con un trozo de col.'],
'明石焼き': ['ふんわりした玉子焼きを、温かいだしにつけて食べます。',
  'Dip the soft egg dumplings in warm broth.',
  '把鬆軟的玉子燒沾溫熱的高湯吃。',
  '부드러운 달걀 경단을 따뜻한 육수에 찍어 먹습니다.',
  'Trempez les boulettes moelleuses à l’œuf dans un bouillon chaud.',
  'Moja las bolitas esponjosas de huevo en caldo caliente.'],
'出石皿そば': ['小皿5枚が1人前の店が多く、何皿食べたかを楽しむのも名物です。',
  'Many shops serve five small plates per person, and counting your plates is part of the fun.',
  '很多店一人份是5小盤，數自己吃了幾盤也是樂趣之一。',
  '많은 가게에서 작은 접시 5장이 1인분이고, 몇 접시 먹었는지 세는 것도 재미입니다.',
  'Beaucoup de restaurants servent cinq petites assiettes par personne ; compter ses assiettes fait partie du jeu.',
  'Muchos locales sirven cinco platitos por persona, y contar tus platos es parte de la diversión.'],
'出雲そば': ['丸い器が重なった「割子そば」は、つゆを上の器からかけて、残ったつゆを次の器へ回していきます。',
  'For warigo soba in stacked bowls, pour sauce over the top bowl, then pass what is left to the next bowl.',
  '疊成好幾層的「割子蕎麥」，從最上面一碗淋醬汁，剩下的再倒進下一碗。',
  '여러 단으로 쌓인 "와리고 소바"는 맨 위 그릇에 쓰유를 붓고, 남은 쓰유를 다음 그릇에 옮겨 붓습니다.',
  'Pour le warigo soba en bols empilés, versez la sauce sur le bol du dessus, puis le reste dans le bol suivant.',
  'En el warigo soba de cuencos apilados, echa salsa en el de arriba y pasa lo que sobre al siguiente.'],
'瓦そば': ['熱い瓦に触れた部分はパリッとします。温かいつゆにつけて、食感の違いを楽しみます。',
  'The noodles touching the hot tile turn crisp. Dip them in warm sauce and enjoy the mix of textures.',
  '貼著熱瓦的部分會變得酥脆，沾溫熱的醬汁吃，享受不同口感。',
  '뜨거운 기와에 닿은 부분은 바삭해집니다. 따뜻한 쓰유에 찍어 식감 차이를 즐기세요.',
  'Les nouilles au contact de la tuile chaude deviennent croustillantes ; trempez-les dans la sauce chaude.',
  'Los fideos que tocan la teja caliente quedan crujientes; mójalos en la salsa caliente.'],
'讃岐うどん': ['セルフの店では、トレーを取って麺を受け取り、天ぷらなどを選んで最後に会計します。',
  'At self-service shops, take a tray, get your noodles, pick toppings like tempura, and pay at the end.',
  '自助式的店要先拿托盤領麵，再挑天婦羅等配料，最後結帳。',
  '셀프 가게에서는 쟁반을 들고 면을 받은 뒤, 튀김 등을 골라 마지막에 계산합니다.',
  'Dans les restaurants en libre-service : prenez un plateau, vos nouilles, des garnitures comme la tempura, puis payez.',
  'En los locales de autoservicio, coge una bandeja, recoge los fideos, elige tempura u otros toppings y paga al final.'],
'釜玉うどん': ['熱いうちに卵とよく混ぜて、しょうゆを少しかけて食べます。',
  'Mix it with the egg while hot and add a little soy sauce.',
  '趁熱和蛋拌勻，淋一點醬油吃。',
  '뜨거울 때 달걀과 잘 섞어 간장을 조금 뿌려 먹습니다.',
  'Mélangez à l’œuf tant que c’est chaud et ajoutez un peu de sauce soja.',
  'Mézclalo con el huevo mientras está caliente y añade un poco de soja.'],
'博多ラーメン': ['麺のかたさを注文のときに選べます。「替え玉」と言えば、麺だけおかわりできます。',
  'You can choose how firm your noodles are. Say "kaedama" to get a refill of noodles only.',
  '點餐時可以選麵的軟硬。說「替玉（kaedama）」就能只加麵。',
  '주문할 때 면의 익힘 정도를 고를 수 있습니다. "가에다마"라고 하면 면만 추가할 수 있습니다.',
  'On choisit la fermeté des nouilles. Dites « kaedama » pour une portion de nouilles en plus.',
  'Puedes elegir lo firmes que quieres los fideos. Di «kaedama» para pedir solo más fideos.'],
'もつ鍋': ['具を食べ終わったら、ちゃんぽん麺や雑炊で「しめ」にするのが定番です。',
  'When the pot is nearly empty, finish with noodles or rice cooked in the leftover broth.',
  '料吃完後，加入強棒麵或煮成雜炊收尾是經典吃法。',
  '건더기를 다 먹으면 짬뽕면이나 죽으로 마무리하는 것이 정석입니다.',
  'Quand il ne reste que le bouillon, on termine avec des nouilles ou du riz cuit dedans.',
  'Al final se suele terminar con fideos o arroz cocido en el caldo que queda.'],
'鯛めし': ['宇和島の鯛めしは、卵の入ったたれに鯛の刺身をくぐらせ、ごはんにのせて食べます。',
  'Uwajima-style: dip the sea bream sashimi in the egg sauce, then put it on the rice.',
  '宇和島式是把鯛魚生魚片在加了蛋的醬汁裡沾一下，再放在飯上吃。',
  '우와지마식은 도미회를 달걀이 든 소스에 담갔다가 밥 위에 올려 먹습니다.',
  'À la façon d’Uwajima : trempez le sashimi de daurade dans la sauce à l’œuf, puis posez-le sur le riz.',
  'Al estilo de Uwajima: moja el sashimi de besugo en la salsa con huevo y ponlo sobre el arroz.'],
'カツオのたたき': ['塩かポン酢で、スライスしたにんにくや薬味と一緒に食べるのが高知流です。',
  'In Kochi, it is eaten with salt or ponzu, sliced garlic and fresh herbs.',
  '高知的吃法是配鹽或柚子醋，加上蒜片和佐料一起吃。',
  '고치에서는 소금이나 폰즈에 얇게 썬 마늘과 양념을 곁들여 먹습니다.',
  'À Kochi, on la mange avec du sel ou du ponzu, de l’ail émincé et des herbes.',
  'En Kochi se come con sal o ponzu, ajo laminado y hierbas frescas.'],
'鶏飯': ['ごはんに具をのせ、熱い鶏のスープをたっぷりかけて食べます。',
  'Put the toppings on your rice and pour plenty of hot chicken broth over it.',
  '把配料放在飯上，淋上大量熱騰騰的雞湯吃。',
  '밥 위에 고명을 올리고 뜨거운 닭 육수를 듬뿍 부어 먹습니다.',
  'Posez les garnitures sur le riz et versez beaucoup de bouillon de poulet chaud.',
  'Pon los ingredientes sobre el arroz y echa bastante caldo caliente de pollo.'],
'冷や汁': ['冷たい汁を、温かいごはんや麦ごはんにかけて食べます。',
  'Pour the cold soup over warm rice or barley rice.',
  '把冰涼的湯淋在熱飯或麥飯上吃。',
  '차가운 국물을 따뜻한 밥이나 보리밥에 부어 먹습니다.',
  'Versez la soupe froide sur du riz chaud ou du riz à l’orge.',
  'Echa la sopa fría sobre arroz caliente o arroz con cebada.'],
'あつめし': ['はじめはそのまま、途中からお茶やだしをかけて、2つの味を楽しみます。',
  'Eat it as it is first, then pour tea or broth over the rest.',
  '先直接吃，吃到一半再淋上茶或高湯，享受兩種味道。',
  '처음엔 그대로, 중간부터 차나 육수를 부어 두 가지 맛을 즐깁니다.',
  'Mangez-le d’abord nature, puis versez du thé ou du bouillon sur le reste.',
  'Cómelo primero tal cual y luego echa té o caldo sobre el resto.'],
'馬刺し': ['甘めのしょうゆに、すりおろしたしょうがやにんにくをつけて食べます。',
  'Eat it with sweet soy sauce and grated ginger or garlic.',
  '沾偏甜的醬油，配薑泥或蒜泥吃。',
  '달콤한 간장에 간 생강이나 마늘을 곁들여 먹습니다.',
  'Se mange avec une sauce soja sucrée et du gingembre ou de l’ail râpé.',
  'Se come con soja dulce y jengibre o ajo rallado.'],
'鶏刺し': ['生や半生の鶏肉です。体調がすぐれないとき、妊娠中の人、小さな子どもは避けたほうが安心です。',
  'This is raw or lightly seared chicken. It is best avoided if you feel unwell, are pregnant, or for small children.',
  '這是生的或半生的雞肉。身體不適、懷孕中或小孩，最好避免。',
  '날것이나 살짝 익힌 닭고기입니다. 몸이 안 좋을 때, 임신 중, 어린아이는 피하는 것이 안심입니다.',
  'Poulet cru ou à peine saisi : mieux vaut l’éviter si vous ne vous sentez pas bien, si vous êtes enceinte, ou pour les jeunes enfants.',
  'Es pollo crudo o apenas sellado. Mejor evitarlo si no te encuentras bien, si estás embarazada o para niños pequeños.'],
'ふく（ふぐ）料理': ['ふぐは、資格を持つ料理人がいるお店で食べましょう。',
  'Eat pufferfish only at restaurants with a licensed fugu chef.',
  '河豚請在有合格料理師的店裡吃。',
  '복어는 자격을 가진 요리사가 있는 가게에서 드세요.',
  'Ne mangez du fugu que dans un restaurant avec un cuisinier diplômé.',
  'Come pez globo solo en restaurantes con un cocinero titulado.'],
'ソーキそば': ['テーブルの「コーレーグース」（島とうがらしを泡盛に漬けたもの）を少したらすと、味が変わります。',
  'Add a few drops of the table "kōrēgusu" (island chilies in awamori) for a kick.',
  '滴幾滴桌上的「Kōrēgusu」（島辣椒泡盛），味道會不一樣。',
  '테이블의 "코레구스"(섬고추를 아와모리에 절인 것)를 조금 넣으면 맛이 달라집니다.',
  'Ajoutez quelques gouttes du « kōrēgusu » de la table (piments d’Okinawa dans l’awamori).',
  'Añade unas gotas del «kōrēgusu» de la mesa (guindillas de la isla en awamori).'],
'皿うどん': ['あんをかけた直後のパリパリと、少したってしんなりした食感の両方を楽しめます。',
  'Enjoy it crisp right after the sauce goes on, then again once the noodles soften.',
  '剛淋上芡汁時酥脆，放一會兒變軟，兩種口感都好吃。',
  '소스를 부은 직후의 바삭함과 조금 지나 부드러워진 식감을 모두 즐길 수 있습니다.',
  'Croustillant juste après la sauce, puis plus tendre ensuite : les deux sont bons.',
  'Crujiente justo después de echar la salsa y más tierno después: las dos texturas están buenas.'],
}
