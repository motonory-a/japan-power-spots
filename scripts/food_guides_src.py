# 食の読みもの2ページ（日本の食べ方ガイド / 門前グルメと神さまの食）の本文。6言語。
# 事実は 2026-11-15 にウェブで確認：うま味=池田菊苗 1908年 昆布（味の素・国立国会図書館）、
# 箸渡し・立て箸の理由（葬儀の作法）、お通し（関西では突き出し、多くは有料）、鎌倉の食べ歩きマナー条例（2019年4月、罰則なし）、
# 梅ヶ枝餅（浄妙尼の伝承、毎月25日はよもぎ入り）、出雲ぜんざい（神在祭の神在餅から）。
# 各項目: (写真に使う料理名 or None, 見出し, 本文, リンクする料理名のリスト)
LANGS = ['ja', 'en', 'zh', 'ko', 'fr', 'es']

PAGES = {}

PAGES['gourmet-guide'] = {
'meta': {
 'ja': ('日本の食べ方ガイド｜知っておくと安心な食事のマナー', 'いただきます、お箸のタブー、麺をすする理由、お通し、チップ、食べ歩きのマナー、だしとうま味。日本で食事をする前に知っておくと安心なことを、やさしくまとめました。', '日本の食べ方ガイド', '知っておくと、もっとおいしく、もっと安心。<br>日本の食卓の「小さな決まりごと」を10個だけ。'),
 'en': ('How to Eat in Japan | Simple table manners for visitors', 'Itadakimasu, chopstick taboos, why slurping is fine, otōshi, no tipping, eating while walking, and dashi and umami. Ten simple things to know before you eat in Japan.', 'How to Eat in Japan', 'Know these and every meal feels easier.<br>Just ten small customs of the Japanese table.'),
 'zh': ('日本用餐指南｜旅客必知的餐桌禮儀', '「いただきます」、筷子的禁忌、吃麵出聲的理由、居酒屋的小菜、不用給小費、邊走邊吃的禮儀、高湯與鮮味。在日本用餐前值得知道的10件事。', '日本用餐指南', '知道這些，吃得更安心、更美味。<br>日本餐桌上的10個小規矩。'),
 'ko': ('일본 식사 가이드｜여행자를 위한 식사 매너', '이타다키마스, 젓가락 금기, 면을 소리 내어 먹는 이유, 오토시, 팁 문화, 걸으며 먹기 매너, 다시와 감칠맛. 일본에서 식사하기 전에 알아 두면 좋은 10가지.', '일본 식사 가이드', '알아 두면 더 맛있고 더 편해요.<br>일본 식탁의 작은 약속 10가지.'),
 'fr': ('Manger au Japon | Les bonnes manières à table, simplement', 'Itadakimasu, tabous des baguettes, pourquoi on aspire les nouilles, l’otōshi, pas de pourboire, manger en marchant, dashi et umami. Dix choses à savoir avant de manger au Japon.', 'Manger au Japon', 'Quelques repères pour des repas plus sereins.<br>Dix petites coutumes de la table japonaise.'),
 'es': ('Cómo comer en Japón | Modales sencillos en la mesa', 'Itadakimasu, tabúes de los palillos, por qué sorber está bien, el otōshi, sin propinas, comer caminando, dashi y umami. Diez cosas que conviene saber antes de comer en Japón.', 'Cómo comer en Japón', 'Con esto, cada comida es más fácil.<br>Diez pequeñas costumbres de la mesa japonesa.'),
},
'items': [
 ('鯛めし', {
  'ja': ('「いただきます」と「ごちそうさま」', '食べる前に手を合わせて「いただきます」、食べ終わったら「ごちそうさまでした」。食べ物の命と、作ってくれた人への感謝のことばです。お店で言うと、お店の人がにっこりしてくれることも多いですよ。'),
  'en': ('"Itadakimasu" and "Gochisōsama"', 'Before eating, put your hands together and say "itadakimasu". After eating, say "gochisōsama deshita". Both are words of thanks, to the food itself and to the people who made it. Staff often smile when visitors say them.'),
  'zh': ('「いただきます」與「ごちそうさま」', '吃飯前雙手合十說「いただきます（Itadakimasu）」，吃完說「ごちそうさまでした（Gochisōsama deshita）」。這是對食物的生命和做飯的人表達感謝。在店裡說出口，店員常常會露出笑容。'),
  'ko': ('"이타다키마스"와 "고치소사마"', '먹기 전에 손을 모으고 "이타다키마스", 다 먹으면 "고치소사마데시타"라고 말합니다. 음식의 생명과 만들어 준 사람에게 감사하는 말이에요. 가게에서 말하면 직원이 웃어 주는 경우가 많아요.'),
  'fr': ('« Itadakimasu » et « Gochisōsama »', 'Avant de manger, joignez les mains et dites « itadakimasu ». Après le repas, dites « gochisōsama deshita ». Ce sont des remerciements, pour la nourriture et pour ceux qui l’ont préparée. Le personnel sourit souvent en les entendant.'),
  'es': ('«Itadakimasu» y «Gochisōsama»', 'Antes de comer, junta las manos y di «itadakimasu». Al terminar, di «gochisōsama deshita». Son palabras de agradecimiento, a la comida y a quien la preparó. El personal suele sonreír al oírlas.'),
 }, []),
 ('江戸前寿司', {
  'ja': ('お箸で、これだけはしないで', '箸から箸へ食べ物を渡す「箸渡し」と、ご飯に箸をまっすぐ立てる「立て箸」は、とくに嫌がられます。どちらも、お葬式で行う作法と同じ形だからです。取り分けるときは小皿にのせて、箸を休めるときは箸置きか器のふちに置きましょう。'),
  'en': ('Two things never to do with chopsticks', 'Never pass food from your chopsticks to someone else’s, and never stand chopsticks upright in rice. Both copy funeral customs in Japan, so they make people uneasy. To share, put food on a small plate. To rest your chopsticks, use the chopstick rest or lay them across your dish.'),
  'zh': ('用筷子時，這兩件事千萬別做', '不要用筷子把食物傳給別人的筷子，也不要把筷子直立插在飯上。這兩個動作都和日本葬禮的習俗相同，會讓人不舒服。分菜時放到小盤子上，休息時把筷子放在筷架或碗邊。'),
  'ko': ('젓가락으로 절대 하지 말아야 할 두 가지', '젓가락에서 젓가락으로 음식을 건네는 것, 밥에 젓가락을 꽂아 세우는 것은 특히 꺼립니다. 둘 다 일본 장례식의 풍습과 같은 모습이기 때문이에요. 나눌 때는 작은 접시에 올리고, 쉴 때는 젓가락 받침이나 그릇 가장자리에 놓으세요.'),
  'fr': ('Deux gestes à ne jamais faire avec les baguettes', 'Ne passez jamais un aliment de vos baguettes à celles d’une autre personne, et ne plantez jamais vos baguettes debout dans le riz. Ces deux gestes rappellent les rites funéraires japonais. Pour partager, utilisez une petite assiette ; pour poser vos baguettes, utilisez le repose-baguettes.'),
  'es': ('Dos cosas que nunca debes hacer con los palillos', 'No pases comida de tus palillos a los de otra persona y no claves los palillos de pie en el arroz. Ambos gestos recuerdan ritos funerarios japoneses. Para compartir, usa un platito; para dejar los palillos, usa el reposapalillos o ponlos sobre el plato.'),
 }, []),
 ('札幌ラーメン', {
  'ja': ('麺は、音を立ててすすってOK', 'そば・うどん・ラーメンは、ズズッとすすって食べてかまいません。空気と一緒にすすると、香りが広がり、熱い麺も少し冷めます。苦手な人は無理をせず、れんげ（スプーン）を使って静かに食べても大丈夫です。'),
  'en': ('Slurping noodles is fine', 'With soba, udon and ramen, slurping is normal. Drawing in air brings out the aroma and cools hot noodles a little. If you are not comfortable slurping, eating quietly with the spoon is perfectly fine too.'),
  'zh': ('吃麵出聲沒關係', '吃蕎麥麵、烏龍麵、拉麵時，發出「簌簌」聲吸麵是很正常的。連同空氣一起吸，香氣會散開，熱麵也會稍微變涼。不習慣的話，用湯匙安靜地吃也完全沒問題。'),
  'ko': ('면은 소리 내어 먹어도 괜찮아요', '소바·우동·라멘은 후루룩 소리 내어 먹어도 됩니다. 공기와 함께 빨아들이면 향이 퍼지고 뜨거운 면도 조금 식어요. 불편하다면 숟가락을 써서 조용히 먹어도 전혀 문제없어요.'),
  'fr': ('Aspirer ses nouilles, c’est normal', 'Avec les soba, udon et ramen, on aspire bruyamment : c’est normal. L’air fait ressortir les arômes et refroidit un peu les nouilles. Si vous n’êtes pas à l’aise, manger en silence avec la cuillère convient très bien.'),
  'es': ('Sorber los fideos está bien', 'Con soba, udon y ramen, sorber es lo normal. El aire realza el aroma y enfría un poco los fideos. Si no te sientes cómodo, comer en silencio con la cuchara también está perfectamente bien.'),
 }, ['讃岐うどん', '博多ラーメン', '信州そば']),
 ('博多ラーメン', {
  'ja': ('ラーメン店の「食券機」', '入口に券売機があるお店では、先にボタンで料理を選んでお金を払い、出てきた券をお店の人に渡します。写真つきのボタンが多いので、ことばがわからなくても大丈夫。現金だけの機械もあるので、小銭や千円札があると安心です。'),
  'en': ('Ticket machines at noodle shops', 'If there is a machine by the door, choose your dish there, pay, and hand the ticket to the staff. Many buttons have photos, so you do not need to read Japanese. Some machines take cash only, so keep coins and 1,000-yen notes handy.'),
  'zh': ('拉麵店的「餐券機」', '門口有售票機的店，要先按按鈕選餐、付錢，再把餐券交給店員。很多按鈕附有照片，看不懂日文也沒關係。有些機器只收現金，準備些零錢和千元鈔比較安心。'),
  'ko': ('라멘 가게의 "식권 자판기"', '입구에 자판기가 있는 가게에서는 먼저 버튼으로 메뉴를 고르고 돈을 낸 뒤, 나온 식권을 직원에게 건넵니다. 사진이 있는 버튼이 많아 일본어를 몰라도 괜찮아요. 현금만 되는 기계도 있으니 동전과 천 엔 지폐가 있으면 편해요.'),
  'fr': ('Les distributeurs de tickets', 'Si une machine se trouve à l’entrée, choisissez votre plat, payez, puis donnez le ticket au personnel. Beaucoup de boutons ont des photos : pas besoin de lire le japonais. Certaines machines n’acceptent que les espèces ; gardez de la monnaie et des billets de 1 000 yens.'),
  'es': ('Máquinas de tickets en los locales de fideos', 'Si hay una máquina en la entrada, elige tu plato, paga y entrega el ticket al personal. Muchos botones tienen fotos, así que no hace falta leer japonés. Algunas solo aceptan efectivo: lleva monedas y billetes de 1.000 yenes.'),
 }, []),
 ('なめろう', {
  'ja': ('居酒屋の「お通し」', '居酒屋では、注文する前に小さなおかずが出てくることがあります。これが「お通し」（関西では「突き出し」）。席料のようなもので、多くのお店では一人数百円ほどがお会計に入ります。気になるときは、注文の前にお店の人に聞いてみましょう。'),
  'en': ('"Otōshi" at izakaya', 'At an izakaya (Japanese pub), a small dish may arrive before you order. This is otōshi (called tsukidashi in Kansai). It works like a table charge, and at many places a few hundred yen per person is added to the bill. If you are unsure, ask before ordering.'),
  'zh': ('居酒屋的「お通し」', '在居酒屋，點菜前可能會先送上一小碟菜，這就是「お通し」（關西叫「突き出し」）。它類似座位費，很多店會在帳單上加收每人幾百日圓。如果在意，點菜前可以先問店員。'),
  'ko': ('이자카야의 "오토시"', '이자카야에서는 주문하기 전에 작은 안주가 나오기도 합니다. 이것이 "오토시"(간사이에서는 "쓰키다시")예요. 자릿세 같은 것으로, 많은 가게에서 1인당 몇백 엔 정도가 계산서에 들어갑니다. 궁금하면 주문 전에 물어보세요.'),
  'fr': ('L’« otōshi » dans les izakaya', 'Dans un izakaya (bistrot japonais), une petite assiette peut arriver avant la commande : c’est l’otōshi (tsukidashi dans le Kansai). C’est une sorte de couvert ; dans beaucoup d’endroits, quelques centaines de yens par personne s’ajoutent à l’addition. En cas de doute, demandez avant de commander.'),
  'es': ('El «otōshi» en los izakaya', 'En un izakaya (taberna japonesa) puede llegar un platito antes de pedir: es el otōshi (tsukidashi en Kansai). Funciona como un cubierto; en muchos sitios se suman unos cientos de yenes por persona a la cuenta. Si tienes dudas, pregunta antes de pedir.'),
 }, []),
 ('天丼', {
  'ja': ('チップはいりません', '日本の飲食店では、チップを渡す習慣はありません。置いていくと、忘れ物だと思って追いかけてくれることもあるほどです。感謝は「ごちそうさまでした」のひとことで、十分に伝わります。'),
  'en': ('No tipping', 'Tipping is not a custom in Japanese restaurants. Leave money on the table and staff may even run after you, thinking you forgot it. A simple "gochisōsama deshita" is the best way to say thank you.'),
  'zh': ('不用給小費', '在日本的餐廳沒有給小費的習慣。把錢留在桌上，店員甚至可能以為你忘了而追出來。說一句「ごちそうさまでした」就足以表達謝意。'),
  'ko': ('팁은 필요 없어요', '일본 음식점에는 팁 문화가 없습니다. 돈을 두고 가면 두고 간 물건인 줄 알고 쫓아오기도 할 정도예요. 감사는 "고치소사마데시타" 한마디로 충분히 전해집니다.'),
  'fr': ('Pas de pourboire', 'Le pourboire n’est pas une coutume au Japon. Si vous laissez de l’argent, le personnel peut même vous courir après en pensant à un oubli. Un simple « gochisōsama deshita » suffit pour remercier.'),
  'es': ('Sin propinas', 'En Japón no se acostumbra dejar propina. Si dejas dinero, el personal incluso puede correr tras de ti pensando que lo olvidaste. Un simple «gochisōsama deshita» basta para dar las gracias.'),
 }, []),
 ('焼きまんじゅう', {
  'ja': ('食べ歩きは「止まって」食べる', '参道や商店街の食べ歩きは楽しいものですが、混んだ道で歩きながら食べるのは控えめに。鎌倉市では、混雑した場所での歩きながらの飲食などについてマナーを守るよう求める条例があります（罰則はありません）。お店の前やベンチで止まって食べ、ゴミは買ったお店か持ち帰りで。日本は街なかのゴミ箱が少ないので、小さな袋があると便利です。'),
  'en': ('Street food: stop, then eat', 'Snacking along shrine approaches and shopping streets is fun, but avoid eating while walking through crowds. Kamakura, for example, has a by-law asking people to avoid eating while walking in crowded places (there is no fine). Eat in front of the shop or on a bench, and return rubbish to the shop or take it with you. Public bins are rare in Japan, so a small bag helps.'),
  'zh': ('邊走邊吃，請「停下來」再吃', '在參道或商店街吃小吃很有趣，但人多的路上請避免邊走邊吃。例如鎌倉市就有條例，要求大家在擁擠的地方不要邊走邊吃（沒有罰則）。請在店門口或長椅上停下來吃，垃圾交還店家或自己帶走。日本街上垃圾桶很少，帶個小袋子很方便。'),
  'ko': ('길거리 음식은 "멈춰서" 먹기', '참배길이나 상점가에서 먹거리를 즐기는 건 즐겁지만, 붐비는 길에서 걸으며 먹는 건 삼가 주세요. 예를 들어 가마쿠라시에는 혼잡한 곳에서 걸으며 먹지 말자는 조례가 있습니다(벌칙은 없음). 가게 앞이나 벤치에서 멈춰 먹고, 쓰레기는 가게에 돌려주거나 가져가세요. 일본은 거리에 쓰레기통이 적어서 작은 봉지가 있으면 편해요.'),
  'fr': ('Street food : on s’arrête pour manger', 'Grignoter le long des allées des sanctuaires est un plaisir, mais évitez de manger en marchant dans la foule. Kamakura, par exemple, a un arrêté demandant de ne pas manger en marchant dans les endroits bondés (sans amende). Mangez devant la boutique ou sur un banc, et rapportez vos déchets à la boutique ou gardez-les. Les poubelles publiques sont rares : un petit sac est utile.'),
  'es': ('Comida callejera: para y luego come', 'Picar algo en las calles que llevan a los santuarios es divertido, pero evita comer caminando entre la multitud. Kamakura, por ejemplo, tiene una ordenanza que pide no comer caminando en lugares concurridos (sin multa). Come frente a la tienda o en un banco, y devuelve la basura a la tienda o llévatela. Hay pocas papeleras públicas, así que una bolsita ayuda.'),
 }, ['焼きまんじゅう', '赤福餅']),
 ('湯豆腐', {
  'ja': ('おしぼりは手をふくもの', '席につくと出てくる温かい（夏は冷たい）おしぼりは、手をふくためのものです。顔や首までふくのは、きちんとした店ではあまり上品に見えません。こぼした物をふくのは、紙ナプキンかお店の人に頼みましょう。'),
  'en': ('The oshibori is for your hands', 'The hot (or, in summer, cold) towel you get when you sit down is for wiping your hands. Wiping your face with it can look a little casual in nicer places. For spills, use a paper napkin or ask the staff.'),
  'zh': ('濕毛巾是用來擦手的', '入座後送上的熱（夏天是冰）毛巾「おしぼり」是擦手用的。在較正式的店裡用它擦臉或脖子，看起來不太得體。打翻東西時，請用紙巾或請店員幫忙。'),
  'ko': ('물수건은 손을 닦는 것', '자리에 앉으면 나오는 따뜻한(여름엔 차가운) 물수건 "오시보리"는 손을 닦기 위한 것입니다. 격식 있는 가게에서 얼굴이나 목까지 닦으면 조금 점잖지 않아 보여요. 흘린 것은 종이 냅킨으로 닦거나 직원에게 부탁하세요.'),
  'fr': ('L’oshibori, c’est pour les mains', 'La serviette chaude (froide en été) servie à votre arrivée sert à vous essuyer les mains. S’en servir pour le visage paraît un peu familier dans les bonnes maisons. Pour une tache, utilisez une serviette en papier ou demandez au personnel.'),
  'es': ('El oshibori es para las manos', 'La toallita caliente (fría en verano) que te dan al sentarte es para limpiarte las manos. Usarla en la cara puede parecer poco elegante en sitios formales. Para derrames, usa una servilleta de papel o pide ayuda al personal.'),
 }, []),
 ('胡麻豆腐', {
  'ja': ('味の土台は「だし」と「うま味」', '日本の料理の多くは、昆布やかつお節からとる「だし」で味が決まります。昆布だしのおいしさの正体がグルタミン酸だと突きとめ、「うま味」と名づけたのは、1908年の池田菊苗博士。いまでは甘味・塩味・酸味・苦味と並ぶ5つめの基本の味として知られています。野菜だけに見える料理にも魚のだしが入っていることが多いので、ベジタリアンの方はお店で確かめると安心です。'),
  'en': ('The base of the flavor: dashi and umami', 'Much of Japanese cooking is built on dashi, a broth made from kombu kelp and dried bonito. In 1908 the chemist Ikeda Kikunae found that the savory taste of kombu broth comes from glutamate, and named it "umami". It is now known as the fifth basic taste, next to sweet, salty, sour and bitter. Dishes that look all-vegetable often contain fish dashi, so vegetarians should ask the restaurant.'),
  'zh': ('味道的基礎：「高湯」與「鮮味」', '很多日本料理的味道，取決於用昆布和柴魚熬成的「だし（高湯）」。1908年，池田菊苗博士發現昆布高湯美味的來源是麩胺酸，並把它命名為「うま味（鮮味）」。如今它已和甜、鹹、酸、苦並列為第五種基本味。看起來只有蔬菜的料理也常含魚的高湯，素食者請向店家確認。'),
  'ko': ('맛의 바탕은 "다시"와 "감칠맛"', '일본 요리의 대부분은 다시마와 가쓰오부시로 우린 "다시"로 맛이 정해집니다. 다시마 육수 맛의 정체가 글루탐산임을 밝혀 "우마미(감칠맛)"라고 이름 붙인 사람은 1908년의 이케다 기쿠나에 박사예요. 지금은 단맛·짠맛·신맛·쓴맛에 이은 다섯 번째 기본 맛으로 알려져 있습니다. 채소만 있어 보이는 요리에도 생선 육수가 들어간 경우가 많으니, 채식하는 분은 가게에 확인하세요.'),
  'fr': ('La base du goût : dashi et umami', 'Une grande partie de la cuisine japonaise repose sur le dashi, un bouillon de kombu et de bonite séchée. En 1908, le chimiste Ikeda Kikunae a découvert que le goût savoureux du bouillon de kombu vient du glutamate et l’a appelé « umami ». C’est aujourd’hui la cinquième saveur de base, avec le sucré, le salé, l’acide et l’amer. Des plats qui semblent végétaux contiennent souvent du dashi de poisson : les végétariens ont intérêt à demander.'),
  'es': ('La base del sabor: dashi y umami', 'Gran parte de la cocina japonesa se basa en el dashi, un caldo de alga kombu y bonito seco. En 1908, el químico Ikeda Kikunae descubrió que el sabor sabroso del caldo de kombu viene del glutamato y lo llamó «umami». Hoy se conoce como el quinto sabor básico, junto al dulce, salado, ácido y amargo. Platos que parecen solo de verduras suelen llevar dashi de pescado, así que los vegetarianos deberían preguntar.'),
 }, []),
 ('ひつまぶし', {
  'ja': ('お寿司・丼・ご飯ものの小さなコツ', 'にぎり寿司は手で食べてもOK。しょうゆはご飯ではなく、ネタのほうに少しだけ。ご飯茶わんは手に持って食べるのが日本流です（大きな丼や重い器は置いたままでもかまいません）。名古屋のひつまぶしのように、食べ方に決まった楽しみ方がある料理は、図鑑の「食べ方のコツ」を見てみてください。'),
  'en': ('Small tips for sushi and rice dishes', 'You can eat nigiri sushi with your hands. Dip the fish, not the rice, lightly in soy sauce. In Japan, people lift the rice bowl to eat (large or heavy bowls can stay on the table). Some dishes, like Nagoya’s hitsumabushi, have a special way to enjoy them: see "How to eat it" in the food guide.'),
  'zh': ('壽司與飯類的小訣竅', '握壽司可以用手吃。醬油只沾一點在魚料上，不要沾飯。日本人吃飯時會把飯碗端在手上（大碗或很重的器皿放在桌上也沒關係）。像名古屋鰻魚飯三吃這種有特別吃法的料理，請看圖鑑中的「吃法小訣竅」。'),
  'ko': ('초밥과 밥 요리의 작은 요령', '초밥은 손으로 먹어도 됩니다. 간장은 밥이 아니라 생선 쪽에 조금만. 일본에서는 밥공기를 손에 들고 먹어요(큰 덮밥 그릇이나 무거운 그릇은 내려놓아도 괜찮아요). 나고야의 히쓰마부시처럼 정해진 즐기는 법이 있는 요리는 도감의 "먹는 요령"을 확인해 보세요.'),
  'fr': ('Petites astuces pour les sushis et le riz', 'On peut manger les nigiri avec les doigts. Trempez le poisson, pas le riz, légèrement dans la sauce soja. Au Japon, on tient son bol de riz en main (les grands bols lourds peuvent rester sur la table). Certains plats, comme le hitsumabushi de Nagoya, se dégustent d’une façon particulière : voyez « Comment le déguster » dans le guide.'),
  'es': ('Pequeños trucos para sushi y arroz', 'Puedes comer el nigiri con las manos. Moja el pescado, no el arroz, ligeramente en soja. En Japón se levanta el cuenco de arroz para comer (los cuencos grandes o pesados pueden quedarse en la mesa). Algunos platos, como el hitsumabushi de Nagoya, tienen su forma especial de disfrutarse: mira «Cómo comerlo» en la guía.'),
 }, ['江戸前寿司', 'ひつまぶし', '鯛めし']),
],
}

PAGES['gourmet-shrine'] = {
'meta': {
 'ja': ('門前グルメと神さまの食｜神饌・精進料理・縁起物', 'お参りのあとに味わいたい門前の名物、神さまにお供えする神饌と直会、お寺の精進料理、縁起のいい食べ物。食べ物から、日本の神社とお寺の文化をやさしく紹介します。', '門前グルメと神さまの食', 'お参りのあとの一皿には、意味がある。<br>神さま・仏さまとつながる、日本の食のお話。'),
 'en': ('Food of Shrines and Temples | Offerings, shōjin ryōri and lucky foods', 'Treats sold on the way to shrines, food offered to the gods, Buddhist temple cuisine, and foods eaten for good luck. A gentle introduction to Japanese shrine and temple culture through food.', 'Food of Shrines and Temples', 'The snack after your shrine visit has a story.<br>How Japanese food connects with the gods and the Buddha.'),
 'zh': ('門前美食與神明的食物｜神饌・精進料理・吉祥食物', '參拜後想品嚐的門前名產、獻給神明的神饌與直會、寺院的精進料理、討吉利的食物。從食物認識日本神社與寺院的文化。', '門前美食與神明的食物', '參拜後的那一口，背後有故事。<br>與神佛相連的日本飲食文化。'),
 'ko': ('신사 앞 먹거리와 신의 음식｜신찬·사찰 음식·길한 음식', '참배 후에 맛보고 싶은 신사 앞 명물, 신에게 바치는 신찬과 나오라이, 절의 쇼진 요리, 복을 부르는 음식. 음식으로 만나는 일본 신사와 절의 문화.', '신사 앞 먹거리와 신의 음식', '참배 후의 한 입에는 이야기가 있어요.<br>신과 부처와 이어지는 일본의 음식 이야기.'),
 'fr': ('La cuisine des sanctuaires et des temples | Offrandes, shōjin ryōri et mets porte-bonheur', 'Douceurs des allées de sanctuaires, offrandes aux divinités, cuisine bouddhiste des temples et mets porte-bonheur : la culture des sanctuaires et temples japonais racontée par la nourriture.', 'La cuisine des sanctuaires et des temples', 'La douceur après la visite a une histoire.<br>Comment la cuisine japonaise rejoint les dieux et le Bouddha.'),
 'es': ('La comida de santuarios y templos | Ofrendas, shōjin ryōri y comidas de buena suerte', 'Dulces de las calles de los santuarios, ofrendas a los dioses, cocina budista de los templos y comidas de buena suerte: la cultura de santuarios y templos japoneses contada a través de la comida.', 'La comida de santuarios y templos', 'El dulce después de la visita tiene su historia.<br>Cómo la comida japonesa se une a los dioses y a Buda.'),
},
'items': [
 ('コシヒカリ', {
  'ja': ('神さまのごはん「神饌」と、おさがりをいただく「直会」', '神社では、お米・お酒・お塩・お水、海の幸や山の幸を神さまにお供えします。これを「神饌（しんせん）」といいます。お祭りのあと、お供えしたものをみんなでいただくのが「直会（なおらい）」。神さまと同じものを食べて、力を分けていただくという考え方です。'),
  'en': ('Shinsen: food for the gods, and naorai: sharing it', 'At shrines, rice, sake, salt, water and food from the sea and mountains are offered to the kami (gods). These offerings are called shinsen. After a festival, people share the offerings in a meal called naorai, the idea being that eating what the gods ate brings a share of their blessing.'),
  'zh': ('獻給神明的「神饌」與分享供品的「直會」', '神社會把米、酒、鹽、水以及山珍海味獻給神明，稱為「神饌」。祭典結束後，大家一起享用供品，叫做「直會（なおらい）」。意思是吃下和神明相同的食物，分得神明的力量。'),
  'ko': ('신의 밥 "신찬"과 공물을 나누는 "나오라이"', '신사에서는 쌀·술·소금·물, 바다와 산의 먹거리를 신에게 바칩니다. 이것을 "신찬(신센)"이라고 해요. 제사가 끝나면 바친 음식을 모두 함께 먹는 것이 "나오라이". 신과 같은 것을 먹고 그 힘을 나누어 받는다는 생각이에요.'),
  'fr': ('Le shinsen, repas des dieux, et le naorai, son partage', 'Dans les sanctuaires, on offre aux kami (divinités) du riz, du saké, du sel, de l’eau et des produits de la mer et de la montagne : c’est le shinsen. Après la fête, on partage ces offrandes lors du naorai. L’idée : manger ce qu’ont mangé les dieux, c’est recevoir un peu de leur bénédiction.'),
  'es': ('Shinsen, la comida de los dioses, y naorai, compartirla', 'En los santuarios se ofrecen a los kami (dioses) arroz, sake, sal, agua y alimentos del mar y la montaña: es el shinsen. Tras el festival, se comparten las ofrendas en una comida llamada naorai. La idea es que comer lo mismo que los dioses trae parte de su bendición.'),
 }, []),
 ('胡麻豆腐', {
  'ja': ('お寺の「精進料理」', 'お寺で修行するお坊さんの料理が「精進料理」です。肉や魚を使わず、豆腐・ごま・野菜・山菜・湯葉などで、手間をかけておいしく仕上げます。高野山の胡麻豆腐や日光の湯葉、京都の湯豆腐は、精進の心が生んだ味。お寺の宿坊や門前のお店で味わえるところもあります。'),
  'en': ('Shōjin ryōri: Buddhist temple cuisine', 'Shōjin ryōri is the food of Buddhist monks in training. It uses no meat or fish, and turns tofu, sesame, vegetables, wild plants and yuba (tofu skin) into careful, delicious dishes. Sesame tofu from Mount Koya, yuba from Nikko and Kyoto’s yudofu all grew from this tradition. Some temple lodgings and nearby restaurants serve it.'),
  'zh': ('寺院的「精進料理」', '在寺院修行的僧侶所吃的料理叫「精進料理」。不用肉和魚，以豆腐、芝麻、蔬菜、山菜、豆皮（湯葉）等食材，花工夫做得美味。高野山的芝麻豆腐、日光的湯葉、京都的湯豆腐，都源自這種精神。有些寺院宿坊和門前的店可以品嚐。'),
  'ko': ('절의 "쇼진 요리"', '절에서 수행하는 스님들의 요리가 "쇼진 요리"입니다. 고기와 생선을 쓰지 않고, 두부·참깨·채소·산나물·유바(두부껍질) 등으로 정성껏 맛있게 만들어요. 고야산의 참깨두부, 닛코의 유바, 교토의 유도후는 쇼진의 마음이 낳은 맛입니다. 절의 숙방이나 절 앞 가게에서 맛볼 수 있는 곳도 있어요.'),
  'fr': ('Le shōjin ryōri, cuisine des temples', 'Le shōjin ryōri est la cuisine des moines bouddhistes. Sans viande ni poisson, il transforme le tofu, le sésame, les légumes, les plantes sauvages et le yuba (peau de tofu) en plats soignés et savoureux. Le tofu au sésame du mont Koya, le yuba de Nikko et le yudofu de Kyoto viennent de cette tradition. Certains temples-auberges et restaurants voisins en servent.'),
  'es': ('Shōjin ryōri: la cocina de los templos', 'El shōjin ryōri es la comida de los monjes budistas. Sin carne ni pescado, convierte tofu, sésamo, verduras, plantas silvestres y yuba (piel de tofu) en platos cuidados y deliciosos. El tofu de sésamo del monte Koya, el yuba de Nikko y el yudofu de Kioto nacen de esta tradición. Algunos alojamientos en templos y restaurantes cercanos lo sirven.'),
 }, ['胡麻豆腐', '日光の湯葉', '湯豆腐']),
 ('赤福餅', {
  'ja': ('門前町の名物は、旅人へのおもてなし', '昔から、大きな神社やお寺の参道には、遠くから歩いてきた参拝者のためのお店が並びました。伊勢神宮のそばの赤福餅、伊勢うどん、出雲大社のそばの出雲そば。お参りのあとにその土地の味をいただくのも、昔からの旅の楽しみです。'),
  'en': ('Temple-town treats: a welcome for travelers', 'For centuries, shops have lined the approaches to great shrines and temples to feed pilgrims who walked a long way. Akafuku mochi and Ise udon near Ise Jingu, Izumo soba near Izumo Taisha: tasting the local food after your visit is a pleasure travelers have enjoyed for generations.'),
  'zh': ('門前町的名產，是對旅人的款待', '自古以來，大神社和寺院的參道上就開滿了店，招待遠道走來的參拜者。伊勢神宮旁的赤福餅、伊勢烏龍麵，出雲大社旁的出雲蕎麥麵。參拜後品嚐當地的味道，是自古以來旅行的樂趣。'),
  'ko': ('절·신사 앞 마을의 명물은 나그네를 위한 대접', '예로부터 큰 신사와 절의 참배길에는 먼 길을 걸어온 참배객을 위한 가게가 늘어섰습니다. 이세 신궁 옆의 아카후쿠모치와 이세 우동, 이즈모 대사 옆의 이즈모 소바. 참배 후에 그 지역의 맛을 즐기는 것도 오래된 여행의 즐거움이에요.'),
  'fr': ('Les spécialités des bourgs de temples, un accueil pour les voyageurs', 'Depuis des siècles, des boutiques bordent les allées des grands sanctuaires et temples pour nourrir les pèlerins venus de loin. L’akafuku mochi et les udon d’Ise près d’Ise Jingu, les soba d’Izumo près d’Izumo Taisha : goûter la cuisine locale après la visite est un plaisir de voyageur très ancien.'),
  'es': ('Las especialidades de los pueblos de templos, un saludo al viajero', 'Desde hace siglos, las calles que llevan a los grandes santuarios y templos se llenan de tiendas para alimentar a los peregrinos que llegaban de lejos. El akafuku mochi y el udon de Ise junto a Ise Jingu, el soba de Izumo junto a Izumo Taisha: probar la comida local tras la visita es un placer muy antiguo.'),
 }, ['赤福餅', '伊勢うどん', '出雲そば']),
 ('出雲ぜんざい', {
  'ja': ('ぜんざいは出雲生まれ？', '旧暦10月、全国の神さまが出雲に集まるといわれ、出雲ではこの月を「神在月」と呼びます。このころの神事「神在祭」で振る舞われた「神在餅（じんざいもち）」が、なまって「ぜんざい」になったという説があり、出雲は「ぜんざい発祥の地」といわれています。'),
  'en': ('Was zenzai born in Izumo?', 'In the tenth month of the old calendar, the gods of Japan are said to gather at Izumo, so locals call it Kamiari-zuki, "the month with gods". A sweet called jinzai mochi was served at the Kamiari festival, and one theory says its name slowly became "zenzai", the sweet red-bean soup. That is why Izumo calls itself the birthplace of zenzai.'),
  'zh': ('紅豆湯「ぜんざい」誕生於出雲？', '據說農曆10月全日本的神明會聚集到出雲，所以出雲把這個月叫做「神在月」。這時舉行的神事「神在祭」會分送「神在餅（じんざいもち）」，有一說認為它的讀音慢慢變成了「ぜんざい」，因此出雲被稱為紅豆湯的發源地。'),
  'ko': ('단팥죽 "젠자이"는 이즈모에서 태어났다?', '음력 10월에 일본 전국의 신들이 이즈모에 모인다고 하여, 이즈모에서는 이 달을 "가미아리즈키(신이 있는 달)"라고 부릅니다. 이때의 제사 "가미아리사이"에서 나눠 준 "진자이모치"가 발음이 바뀌어 "젠자이"가 되었다는 설이 있어, 이즈모는 "젠자이의 발상지"로 불려요.'),
  'fr': ('Le zenzai est-il né à Izumo ?', 'Au dixième mois de l’ancien calendrier, les dieux du Japon se réuniraient à Izumo, d’où le nom local de Kamiari-zuki, « le mois où les dieux sont là ». Lors de la fête Kamiari, on servait le jinzai mochi ; selon une théorie, ce nom est devenu « zenzai », la soupe sucrée aux haricots rouges. Izumo se dit donc berceau du zenzai.'),
  'es': ('¿Nació el zenzai en Izumo?', 'En el décimo mes del antiguo calendario, se dice que los dioses de Japón se reúnen en Izumo, por eso allí lo llaman Kamiari-zuki, «el mes con dioses». En el festival Kamiari se servía el jinzai mochi, y una teoría dice que su nombre se convirtió en «zenzai», la sopa dulce de judías rojas. Por eso Izumo se presenta como su cuna.'),
 }, ['出雲ぜんざい']),
 ('阿闍梨餅', {
  'ja': ('太宰府の梅ヶ枝餅と、京都の阿闍梨餅', '太宰府天満宮の参道名物「梅ヶ枝餅」は、太宰府に移された菅原道真公に、浄妙尼というおばあさんが梅の枝にさしたお餅を差し入れたという言い伝えから生まれました。毎月25日には、よもぎ入りの緑の梅ヶ枝餅が並びます。京都の阿闍梨餅は、比叡山で修行するお坊さん（阿闍梨）の笠をかたどったといわれるお菓子です。'),
  'en': ('Umegae mochi of Dazaifu and Ajari mochi of Kyoto', 'Umegae mochi, sold along the approach to Dazaifu Tenmangu, comes from a legend: an old nun named Jōmyōni brought the exiled scholar Sugawara no Michizane a rice cake on a plum branch. On the 25th of every month, a green version made with mugwort appears. Kyoto’s Ajari mochi is said to take the shape of the hat worn by monks (ajari) training on Mount Hiei.'),
  'zh': ('太宰府的梅枝餅與京都的阿闍梨餅', '太宰府天滿宮參道名產「梅枝餅」，源自一則傳說：一位名叫淨妙尼的老婦人，把插在梅枝上的餅送給被貶到太宰府的菅原道真公。每月25日會推出加了艾草的綠色梅枝餅。京都的阿闍梨餅，據說是模仿比叡山修行僧（阿闍梨）的斗笠形狀。'),
  'ko': ('다자이후의 우메가에모치와 교토의 아자리모치', '다자이후 덴만구 참배길의 명물 "우메가에모치"는, 다자이후로 좌천된 스가와라노 미치자네에게 조묘니라는 할머니가 매화 가지에 꽂은 떡을 건넸다는 전설에서 생겨났습니다. 매달 25일에는 쑥이 들어간 초록색 우메가에모치가 나와요. 교토의 아자리모치는 히에이산에서 수행하는 스님(아자리)의 삿갓 모양을 본떴다고 전해집니다.'),
  'fr': ('L’umegae mochi de Dazaifu et l’ajari mochi de Kyoto', 'L’umegae mochi, vendu sur l’allée du Dazaifu Tenmangu, vient d’une légende : une vieille nonne, Jōmyōni, apporta au lettré exilé Sugawara no Michizane un gâteau de riz piqué sur une branche de prunier. Le 25 de chaque mois, une version verte à l’armoise apparaît. L’ajari mochi de Kyoto reprendrait la forme du chapeau des moines (ajari) du mont Hiei.'),
  'es': ('El umegae mochi de Dazaifu y el ajari mochi de Kioto', 'El umegae mochi, que se vende en la calle de Dazaifu Tenmangu, nace de una leyenda: una anciana monja, Jōmyōni, llevó al erudito exiliado Sugawara no Michizane un pastel de arroz clavado en una rama de ciruelo. El día 25 de cada mes aparece una versión verde con artemisa. El ajari mochi de Kioto imitaría el sombrero de los monjes (ajari) del monte Hiei.'),
 }, ['阿闍梨餅', '八ツ橋']),
 ('餡餅雑煮', {
  'ja': ('縁起のいい食べ物', '日本には、ことばや色に願いをこめた食べ物があります。鯛は「めでたい」、赤い小豆は昔から魔よけの色とされ、お祝いには赤飯を炊きます。お餅はハレの日のごちそうで、お正月には雑煮をいただきます。大みそかの年越しそばには、細く長く生きられるように、という願いがこめられています。'),
  'en': ('Foods for good luck', 'Some Japanese foods carry wishes in their names or colors. Tai (sea bream) sounds like medetai, "joyful". The red of azuki beans has long been thought to keep bad luck away, so red-bean rice is cooked for celebrations. Mochi is food for special days, eaten in zōni soup at New Year, and long toshikoshi soba on New Year’s Eve carries a wish for a long life.'),
  'zh': ('吉祥的食物', '日本有些食物把願望寄託在名字或顏色上。鯛魚的「たい」和「めでたい（可喜可賀）」諧音；紅豆的紅色自古被認為能驅邪，喜事時會煮紅豆飯。年糕是節慶的美食，新年要吃年糕湯「雜煮」。除夕的跨年蕎麥麵，寄託著細水長流、長壽的願望。'),
  'ko': ('복을 부르는 음식', '일본에는 이름이나 색에 소원을 담은 음식이 있습니다. 도미(다이)는 "메데타이(경사스럽다)", 붉은 팥은 예로부터 액을 막는 색이라 하여 축하할 때 팥밥을 짓습니다. 떡은 특별한 날의 음식으로, 설날에는 떡국 "조니"를 먹어요. 섣달그믐의 해넘이 소바에는 가늘고 길게 오래 살라는 바람이 담겨 있어요.'),
  'fr': ('Les mets porte-bonheur', 'Certains aliments japonais portent un vœu dans leur nom ou leur couleur. Tai (la daurade) évoque medetai, « heureux ». Le rouge des haricots azuki éloigne depuis toujours le mauvais sort : on cuit du riz aux haricots rouges pour les fêtes. Le mochi est le mets des grands jours, servi dans le zōni du Nouvel An, et les longues toshikoshi soba du réveillon portent le vœu d’une longue vie.'),
  'es': ('Comidas de buena suerte', 'Algunas comidas japonesas llevan un deseo en su nombre o color. Tai (besugo) suena como medetai, «feliz». El rojo de las judías azuki se cree que aleja la mala suerte, por eso se cocina arroz con judías rojas en las celebraciones. El mochi es comida de días especiales, en la sopa zōni de Año Nuevo, y los largos toshikoshi soba de Nochevieja expresan el deseo de una vida larga.'),
 }, ['鯛めし', '餡餅雑煮', 'くるみ雑煮']),
],
}

UI = {
 'ja': {'back': '← ご当地グルメ図鑑', 'see': 'この料理を見る', 'other': 'あわせて読みたい', 'credit': '写真', 'site': '開運パワースポット巡り', 'run': '運営：アッキー', 'foot': '内容は2026年11月時点のものです。お店や行事の情報は変わることがあります。', 'guide': '日本の食べ方ガイド', 'shrine': '門前グルメと神さまの食', 'toGourmet': 'ご当地グルメ図鑑で331品を写真で見る'},
 'en': {'back': '← Local Food Guide', 'see': 'See this dish', 'other': 'Read next', 'credit': 'Photo', 'site': 'Japan Power Spot Journey', 'run': 'by Akki', 'foot': 'Information as of November 2026. Shops and events may change.', 'guide': 'How to Eat in Japan', 'shrine': 'Food of Shrines and Temples', 'toGourmet': 'See all 331 dishes in photos in the Local Food Guide'},
 'zh': {'back': '← 日本在地美食圖鑑', 'see': '看這道料理', 'other': '延伸閱讀', 'credit': '照片', 'site': '日本能量景點之旅', 'run': 'Akki', 'foot': '內容為2026年11月的資訊，店家與活動可能會變動。', 'guide': '日本用餐指南', 'shrine': '門前美食與神明的食物', 'toGourmet': '在美食圖鑑用照片看全部331道料理'},
 'ko': {'back': '← 일본 지역 음식 도감', 'see': '이 요리 보기', 'other': '함께 읽기', 'credit': '사진', 'site': '일본 파워스폿 여행', 'run': 'Akki', 'foot': '2026년 11월 기준 정보입니다. 가게와 행사 정보는 바뀔 수 있어요.', 'guide': '일본 식사 가이드', 'shrine': '신사 앞 먹거리와 신의 음식', 'toGourmet': '음식 도감에서 331가지 요리를 사진으로 보기'},
 'fr': {'back': '← Guide de la cuisine locale', 'see': 'Voir ce plat', 'other': 'À lire aussi', 'credit': 'Photo', 'site': 'Japan Power Spot Journey', 'run': 'Akki', 'foot': 'Informations de novembre 2026. Boutiques et événements peuvent changer.', 'guide': 'Manger au Japon', 'shrine': 'La cuisine des sanctuaires et des temples', 'toGourmet': 'Voir les 331 plats en photos dans le guide'},
 'es': {'back': '← Guía de comida local', 'see': 'Ver este plato', 'other': 'Sigue leyendo', 'credit': 'Foto', 'site': 'Japan Power Spot Journey', 'run': 'Akki', 'foot': 'Información de noviembre de 2026. Tiendas y eventos pueden cambiar.', 'guide': 'Cómo comer en Japón', 'shrine': 'La comida de santuarios y templos', 'toGourmet': 'Ver los 331 platos en fotos en la guía'},
}
