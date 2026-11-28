# 参拝のあとの一品の各言語の文章(2026-11-28)。キーはスポットのWikidata(monzen_src の q の最初)。
# name:名物 / note:ひとこと / where:場所の目安 / shop:店名(なければ英語表記)。事実は monzen_src.py と同じ範囲だけ。
def S(ko, zh, fr, es):
    return {'ko': ko, 'zh': zh, 'fr': fr, 'es': es}
TX = {
 'Q687168': S(
   {'name': '아카후쿠 모치', 'note': '부드러운 떡 위에 팥앙금을 올린 이세의 명물. 이스즈강의 물결 모양을 본떴습니다. 본점은 아침 5시부터 엽니다.', 'where': '우지바시 다리에서 가까운 오하라이마치 거리', 'shop': '아카후쿠 본점'},
   {'name': '赤福餅', 'note': '柔軟的麻糬上覆蓋紅豆沙,形狀象徵五十鈴川的水波。本店早上5點就開門。', 'where': '宇治橋附近的托福橫丁(おはらい町)', 'shop': '赤福 本店'},
   {'name': 'Akafuku mochi', 'note': "Galette de riz moelleuse sous une pâte de haricots rouges, en forme de vagues de la rivière Isuzu. La boutique principale ouvre à 5 h.", 'where': "Rue Oharai-machi, à deux pas du pont Uji", 'shop': 'Akafuku Honten'},
   {'name': 'Akafuku mochi', 'note': 'Pastel de arroz suave bajo pasta de judía roja, con la forma de las ondas del río Isuzu. La tienda principal abre a las 5:00.', 'where': 'Calle Oharai-machi, a pocos pasos del puente Uji', 'shop': 'Akafuku Honten'}),
 'Q714828': S(
   {'name': '이나리즈시', 'note': '달콤한 유부 속에 초밥을 채운, 이나리 신의 사자인 여우와 관련된 음식. 16시경 또는 매진 시 영업 종료.', 'where': 'JR 이나리역에서 도보 2분, 참배길 도리이 옆', 'shop': '네자메야'},
   {'name': '稻荷壽司', 'note': '甜豆皮包醋飯,與稻荷神的使者狐狸有淵源。約16點或賣完即打烊。', 'where': 'JR稻荷站步行2分鐘,參道鳥居旁', 'shop': '祢ざめ家'},
   {'name': 'Inari-zushi', 'note': "Riz vinaigré dans du tofu frit sucré, le mets des renards messagers d'Inari. Ferme vers 16 h ou quand tout est vendu.", 'where': "Près du torii de l'allée, à 2 min de la gare JR Inari", 'shop': 'Nezameya'},
   {'name': 'Inari-zushi', 'note': 'Arroz de sushi dentro de tofu frito dulce, la comida de los zorros mensajeros de Inari. Cierra hacia las 16:00 o al agotarse.', 'where': 'Junto al torii del camino, a 2 min de la estación JR Inari', 'shop': 'Nezameya'}),
 'Q696362': S(
   {'name': '와리고 소바', 'note': '여러 단의 칠기 그릇에 담긴 이즈모 소바. 쯔유를 직접 부어 먹습니다. 1780년대 창업한 가장 오래된 이즈모 소바집으로 알려져 있습니다.', 'where': '신사에서 도보 약 5분', 'shop': '아라키야'},
   {'name': '割子蕎麥', 'note': '裝在層層漆器裡的出雲蕎麥麵,醬汁直接淋上。據說是最古老的出雲蕎麥店(1780年代創業)。', 'where': '距神社步行約5分鐘', 'shop': '荒木屋'},
   {'name': 'Warigo soba', 'note': "Soba d'Izumo servies dans des bols laqués empilés ; on verse la sauce directement. Réputée la plus ancienne maison (années 1780).", 'where': 'À environ 5 min à pied du sanctuaire', 'shop': 'Arakiya'},
   {'name': 'Warigo soba', 'note': 'Soba de Izumo en cuencos lacados apilados; la salsa se vierte directamente. Se dice que es la casa más antigua (década de 1780).', 'where': 'A unos 5 min a pie del santuario', 'shop': 'Arakiya'}),
 'Q701620': S(
   {'name': '미타라시 당고', 'note': '미타라시 당고가 시작된 곳으로 알려진 가게. 신사 연못의 물거품을 본뜬 작은 경단 다섯 개. 보통 수요일 휴무.', 'where': '신사 서쪽에서 몇 분', 'shop': '가모 미타라시 찻집'},
   {'name': '御手洗糰子', 'note': '據說是御手洗糰子的發源店,五顆小糰子象徵神社御手洗池湧出的水泡。通常週三公休。', 'where': '神社西側步行數分鐘', 'shop': '加茂みたらし茶屋'},
   {'name': 'Mitarashi dango', 'note': "Là où seraient nés les mitarashi dango : cinq petites boulettes à l'image des bulles de l'étang du sanctuaire. Fermé le mercredi en général.", 'where': "À quelques minutes à l'ouest du sanctuaire", 'shop': 'Kamo Mitarashi Chaya'},
   {'name': 'Mitarashi dango', 'note': 'Donde se dice que nacieron los mitarashi dango: cinco bolitas como las burbujas del estanque del santuario. Suele cerrar los miércoles.', 'where': 'A pocos minutos al oeste del santuario', 'shop': 'Kamo Mitarashi Chaya'}),
 'Q710786': S(
   {'name': '우메가에 모치', 'note': '매화 문양을 찍어 구운 팥떡. 스가와라노 미치자네의 전설과 관련된 다자이후의 명물입니다.', 'where': '참배길, 두 번째 도리이를 지나 오른쪽 세 번째 가게', 'shop': '카사노야'},
   {'name': '梅枝餅', 'note': '烙上梅花紋的烤紅豆餅,與菅原道真的傳說有關的太宰府名產。', 'where': '參道上,過第二座鳥居後右手邊第三家', 'shop': 'かさの家'},
   {'name': 'Umegae mochi', 'note': "Galette de riz grillée fourrée de haricots rouges et marquée d'une fleur de prunier, liée à la légende de Sugawara no Michizane.", 'where': "Sur l'allée, troisième boutique à droite après le deuxième torii", 'shop': 'Kasanoya'},
   {'name': 'Umegae mochi', 'note': 'Pastel de arroz a la plancha relleno de judía roja y marcado con la flor de ciruelo, ligado a la leyenda de Sugawara no Michizane.', 'where': 'En el camino, tercera tienda a la derecha tras el segundo torii', 'shop': 'Kasanoya'}),
 'Q714559': S(
   {'name': '만요가유 (계절 죽)', 'note': '가스가타이샤가 운영하는 정원 찻집. 만요슈 노래에 나오는 식물로 매달 바뀌는 죽입니다. 1~3월·6~9월·12월은 월요일 휴무.', 'where': '참배길, 만요 식물원 입구 근처', 'shop': '가스가 니나이차야'},
   {'name': '萬葉粥(季節粥)', 'note': '春日大社經營的庭園茶屋,粥品每月隨《萬葉集》裡的植物更換。1~3月、6~9月、12月週一公休。', 'where': '參道上,萬葉植物園入口附近', 'shop': '春日荷茶屋'},
   {'name': "Man'yo-gayu (porridge de saison)", 'note': "Maison de thé avec jardin tenue par le Kasuga Taisha ; le porridge change chaque mois selon les plantes du Man'yoshu. Fermé le lundi en janv.–mars, juin–sept. et déc.", 'where': "Sur l'allée, près de l'entrée du jardin botanique Man'yo", 'shop': 'Kasuga Ninai Jaya'},
   {'name': "Man'yo-gayu (gachas de temporada)", 'note': "Casa de té con jardín del Kasuga Taisha; las gachas cambian cada mes con plantas del Man'yoshu. Cierra los lunes en ene–mar, jun–sep y dic.", 'where': "En el camino, cerca de la entrada del jardín botánico Man'yo", 'shop': 'Kasuga Ninai Jaya'}),
 'Q700448': S(
   {'name': '야키모치 (아오이 모치)', 'note': '얇게 구운 떡 속에 팥앙금. 가미가모 참배길의 전통 과자입니다.', 'where': '큰 도리이 앞', 'shop': '아오이야 야키모치 소혼포'},
   {'name': '烤麻糬(葵餅)', 'note': '薄薄烤過的麻糬包紅豆餡,上賀茂參道的傳統點心。', 'where': '大鳥居前', 'shop': '葵家やきもち総本舗'},
   {'name': 'Yakimochi (aoi mochi)', 'note': "Fine galette de riz grillée autour d'une pâte de haricots rouges, douceur traditionnelle de l'allée de Kamigamo.", 'where': 'Devant le grand torii', 'shop': 'Aoiya Yakimochi Sohonpo'},
   {'name': 'Yakimochi (aoi mochi)', 'note': 'Fino pastel de arroz a la plancha con pasta de judía roja, dulce tradicional del camino de Kamigamo.', 'where': 'Frente al gran torii', 'shop': 'Aoiya Yakimochi Sohonpo'}),
 'Q717682': S(
   {'name': '아마자케', 'note': '쌀과 누룩만으로 가게 지하 저장고에서 만드는 달콤한 음료. 알코올은 없습니다.', 'where': '정문 도리이 바로 옆', 'shop': '아마노야'},
   {'name': '甘酒', 'note': '只用米和米麴、在店內地下室釀製的甜飲,不含酒精。', 'where': '大鳥居旁', 'shop': '天野屋'},
   {'name': 'Amazake', 'note': "Boisson douce de riz et de koji uniquement, préparée dans la cave souterraine de la maison. Sans alcool.", 'where': 'Juste à côté du grand torii', 'shop': 'Amanoya'},
   {'name': 'Amazake', 'note': 'Bebida dulce solo de arroz y koji, hecha en la bodega subterránea de la casa. Sin alcohol.', 'where': 'Junto al gran torii', 'shop': 'Amanoya'}),
 'Q615183': S(
   {'name': '기비 당고', 'note': '콩고물을 묻힌 작고 따뜻한 경단. 에도 시대 이곳에서 팔던 당고를 되살렸습니다. 나카미세에서는 걸으며 먹지 말고 가게 옆 카운터에서 드세요.', 'where': '나카미세 거리', 'shop': '아사쿠사 기비당고 아즈마'},
   {'name': '黍糰子', 'note': '裹滿黃豆粉的溫熱小糰子,重現江戶時代在此販售的糰子。仲見世不可邊走邊吃,請在店旁的櫃檯享用。', 'where': '仲見世通', 'shop': '浅草きびだんご あづま'},
   {'name': 'Kibi dango', 'note': "Petites boulettes tièdes roulées dans le kinako, reprise d'un dango vendu ici à l'époque d'Edo. À déguster au comptoir — pas en marchant sur Nakamise.", 'where': 'Rue Nakamise', 'shop': 'Asakusa Kibidango Azuma'},
   {'name': 'Kibi dango', 'note': 'Bolitas tibias rebozadas en kinako, recuperación de un dango vendido aquí en la época Edo. Cómelas en el mostrador, no caminando por Nakamise.', 'where': 'Calle Nakamise', 'shop': 'Asakusa Kibidango Azuma'}),
 'Q701403': S(
   {'name': '하토 사브레 (비둘기 쿠키)', 'note': '가마쿠라의 유명한 비둘기 모양 버터 쿠키. 본점에서만 파는 계절 화과자도 있습니다.', 'where': '신사로 이어지는 와카미야오지 거리', 'shop': '도시마야 본점'},
   {'name': '鳩鴿酥餅', 'note': '鎌倉著名的鴿子形奶油餅乾,本店還有只在這裡賣的季節和菓子。', 'where': '通往神社的若宮大路上', 'shop': '豊島屋 本店'},
   {'name': 'Hato sablé (biscuit colombe)', 'note': "Le célèbre sablé au beurre en forme de colombe de Kamakura ; la boutique principale vend aussi des douceurs de saison introuvables ailleurs.", 'where': "Sur Wakamiya-oji, l'avenue qui mène au sanctuaire", 'shop': 'Toshimaya (boutique principale)'},
   {'name': 'Hato sablé (galleta de paloma)', 'note': 'La famosa galleta de mantequilla con forma de paloma de Kamakura; la tienda principal también vende dulces de temporada exclusivos.', 'where': 'En Wakamiya-oji, la avenida que lleva al santuario', 'shop': 'Toshimaya (tienda principal)'}),
 'Q672056': S(
   {'name': '곤고로 치카라모치', 'note': '매일 아침 찧은 떡에 고운 팥앙금. 첨가물이 없어 당일에 드세요. 수요일·셋째 화요일 휴무.', 'where': '고료 신사 옆, 하세역에서 6~7분', 'shop': '치카라모치야'},
   {'name': '權五郎力餅', 'note': '每天早上搗的麻糬配細緻紅豆沙,無添加,請當天食用。週三及第3個週二公休。', 'where': '御靈神社旁,長谷站步行6~7分鐘', 'shop': '力餅家'},
   {'name': 'Gongoro chikara mochi', 'note': "Galette de riz pilée chaque matin sous une pâte de haricots rouges lisse. Sans additifs : à manger le jour même. Fermé le mercredi et le 3e mardi.", 'where': 'Près du sanctuaire Goryo, à 6–7 min de la gare de Hase', 'shop': 'Chikaramochiya'},
   {'name': 'Gongoro chikara mochi', 'note': 'Pastel de arroz machacado cada mañana con pasta de judía roja fina. Sin aditivos: cómelo el mismo día. Cierra miércoles y el 3.er martes.', 'where': 'Junto al santuario Goryo, a 6–7 min de la estación de Hase', 'shop': 'Chikaramochiya'}),
 'Q460367': S(
   {'name': '요모기 모치 (쑥떡)', 'note': '팥앙금이 든 쑥떡. 눈 깜짝할 사이의 떡메치기 공연으로 유명합니다.', 'where': '긴테쓰 나라역에서 약 5분, 절로 가는 길', 'shop': '나카타니도'},
   {'name': '艾草麻糬', 'note': '包紅豆餡的艾草麻糬,以超快速的搗麻糬表演聞名。', 'where': '近鐵奈良站步行約5分鐘,前往寺院的路上', 'shop': '中谷堂'},
   {'name': 'Yomogi mochi', 'note': "Galette de riz à l'armoise fourrée de haricots rouges, célèbre pour son pilage ultra-rapide en spectacle.", 'where': 'À 5 min de la gare Kintetsu Nara, sur le chemin des temples', 'shop': 'Nakatanidou'},
   {'name': 'Yomogi mochi', 'note': 'Pastel de arroz con artemisa relleno de judía roja, famoso por su espectáculo de machacado ultrarrápido.', 'where': 'A 5 min de la estación Kintetsu Nara, camino de los templos', 'shop': 'Nakatanidou'}),
 'Q191763': S(
   {'name': '아게모미지 (튀긴 단풍 과자)', 'note': '미야지마의 단풍잎 모양 과자에 튀김옷을 입혀 바로 튀겨 줍니다. 2002년 모미지도에서 처음 만들었습니다.', 'where': '오모테산도 상점가, 신사에서 8분', 'shop': '모미지도 본점'},
   {'name': '炸紅葉饅頭', 'note': '宮島的紅葉饅頭裹上麵衣現炸,2002年由紅葉堂首創。', 'where': '表參道商店街,距神社8分鐘', 'shop': '紅葉堂 本店'},
   {'name': 'Age-momiji (gâteau feuille d’érable frit)', 'note': "Le gâteau en feuille d'érable de Miyajima, enrobé de pâte et frit devant vous. Inventé par Momijido en 2002.", 'where': 'Rue commerçante Omotesando, à 8 min du sanctuaire', 'shop': 'Momijido (boutique principale)'},
   {'name': 'Age-momiji (pastel de hoja de arce frito)', 'note': 'El pastel con forma de hoja de arce de Miyajima, rebozado y frito al momento. Lo creó Momijido en 2002.', 'where': 'Calle comercial Omotesando, a 8 min del santuario', 'shop': 'Momijido (tienda principal)'}),
 'Q482065': S(
   {'name': '기시멘', 'note': '가쓰오 국물에 넣은 나고야의 납작한 우동. 신사 숲속에서 먹을 수 있습니다. 셀프서비스.', 'where': '신사 경내, 두 번째 도리이 근처', 'shop': '미야 기시멘 진구점'},
   {'name': '棊子麵', 'note': '名古屋的扁平烏龍麵配柴魚高湯,在神社的森林裡享用。自助式。', 'where': '神社境內,第二鳥居附近', 'shop': '宮きしめん 神宮店'},
   {'name': 'Kishimen', 'note': "Nouilles udon plates de Nagoya dans un bouillon de bonite, servies dans la forêt du sanctuaire. Libre-service.", 'where': "Dans l'enceinte, près du deuxième torii", 'shop': 'Miya Kishimen (Jingu)'},
   {'name': 'Kishimen', 'note': 'Fideos udon planos de Nagoya en caldo de bonito, servidos en el bosque del santuario. Autoservicio.', 'where': 'Dentro del recinto, cerca del segundo torii', 'shop': 'Miya Kishimen (Jingu)'}),
 'Q1203429': S(
   {'name': '고마도후 (참깨 두부)', 'note': '요시노 칡과 고야산의 물로 만드는 사찰 요리. 메이지 초기 창업. 대부분 포장 판매이며 매진될 수 있습니다.', 'where': '곤고부지에서 도보 몇 분', 'shop': '하마다야'},
   {'name': '胡麻豆腐', 'note': '用吉野本葛和高野山的水做成的精進料理,明治初年創業。多為外帶,可能售完。', 'where': '金剛峯寺步行數分鐘', 'shop': '濱田屋'},
   {'name': 'Goma-dofu (tofu de sésame)', 'note': "« Tofu » de sésame de la cuisine des temples, au kudzu de Yoshino et à l'eau de Koyasan, par une maison du début de l'ère Meiji. Surtout à emporter ; peut être épuisé.", 'where': 'À quelques minutes à pied du Kongobu-ji', 'shop': 'Hamadaya'},
   {'name': 'Goma-dofu (tofu de sésamo)', 'note': '"Tofu" de sésamo de la cocina de templo, con kuzu de Yoshino y agua de Koyasan, de una casa de inicios de Meiji. Sobre todo para llevar; puede agotarse.', 'where': 'A pocos minutos a pie del Kongobu-ji', 'shop': 'Hamadaya'}),
 'Q696641': S(
   {'name': '닛코 유바', 'note': '산의 수행승들이 먹던 두툼하고 부드러운 두부 껍질. 여러 가지 요리로 맛볼 수 있습니다.', 'where': '도쇼구에서 도보 약 8분', 'shop': '닛코 유바 유젠'},
   {'name': '日光湯波', 'note': '山中修行僧吃的厚實柔軟豆皮,可品嚐多種料理。', 'where': '距東照宮步行約8分鐘', 'shop': '日光ゆば遊膳'},
   {'name': 'Yuba de Nikko', 'note': "Peau de tofu épaisse et tendre, autrefois mangée par les moines de montagne, servie de mille façons.", 'where': 'À environ 8 min à pied du Toshogu', 'shop': 'Nikko Yuba Yuzen'},
   {'name': 'Yuba de Nikko', 'note': 'Piel de tofu gruesa y suave que comían los monjes de montaña, servida de muchas formas.', 'where': 'A unos 8 min a pie del Toshogu', 'shop': 'Nikko Yuba Yuzen'}),
 'Q710826': S(
   {'name': '항간사마 (메밀 구이떡)', 'note': '주문하면 구워 주는 메밀떡에 팥앙금. 이 찻집에서만 팔며 차는 무료입니다.', 'where': '신사 경내, 서쪽 주차장 입구 옆', 'shop': '롯카테이 진구차야점'},
   {'name': '判官大人(蕎麥烤麻糬)', 'note': '現點現烤的蕎麥麻糬包紅豆餡,只在這家茶屋販售,店內提供免費茶水。', 'where': '神社境內,西停車場入口旁', 'shop': '六花亭 神宮茶屋店'},
   {'name': 'Hangan-sama (mochi grillé au sarrasin)', 'note': "Galette de sarrasin fourrée de haricots rouges, grillée à la commande. Vendue seulement dans cette maison de thé ; thé offert.", 'where': "Dans l'enceinte, près de l'entrée du parking ouest", 'shop': 'Rokkatei Jingu Chaya'},
   {'name': 'Hangan-sama (mochi de alforfón a la plancha)', 'note': 'Pastel de alforfón con judía roja, hecho al momento. Solo se vende en esta casa de té; el té es gratis.', 'where': 'Dentro del recinto, junto a la entrada del aparcamiento oeste', 'shop': 'Rokkatei Jingu Chaya'}),
 'Q94760': S(
   {'name': '규만 (뜸 모양 만주)', 'note': '노른자 앙금이 든 작은 만주로, 뜸 모양을 본떴습니다. 옛 순례자 여관이 과자점이 되었습니다. 가게 안에서 쉬며 먹을 수 있습니다.', 'where': '돌계단 참배길', 'shop': '규만 혼포 이시단야'},
   {'name': '灸饅頭', 'note': '包蛋黃餡的小饅頭,外型像艾灸。前身是朝聖者的旅館,可在店內休息享用。', 'where': '石階參道上', 'shop': '灸まん本舗石段や 本店'},
   {'name': 'Kyuman (petit pain en forme de moxa)', 'note': "Petit pain à la pâte de jaune d'œuf, en forme de cône de moxa — ancienne auberge de pèlerins devenue confiserie. On peut s'y reposer.", 'where': "Sur l'allée aux marches de pierre", 'shop': 'Kyuman Honpo Ishidanya'},
   {'name': 'Kyuman (bollito con forma de moxa)', 'note': 'Bollito con pasta de yema, con forma de cono de moxa: antigua posada de peregrinos convertida en dulcería. Se puede descansar dentro.', 'where': 'En el camino de escalones de piedra', 'shop': 'Kyuman Honpo Ishidanya'}),
 'Q189640': S(
   {'name': '미소 구운 주먹밥', 'note': '신슈 된장을 발라 구운 김 주먹밥. 1902년 창업한 된장 가게가 눈앞에서 만들어 줍니다. 된장 소프트아이스크림도 있습니다.', 'where': '니오몬 안쪽, 나카미세 입구', 'shop': '스야카메 젠코지점'},
   {'name': '味噌烤飯糰', 'note': '抹上信州味噌烤的海苔飯糰,由1902年創業的味噌老店現場製作。也有味噌霜淇淋。', 'where': '仁王門內,仲見世入口', 'shop': '門前みそ すや亀 善光寺店'},
   {'name': 'Boulette de riz grillée au miso', 'note': "Onigiri grillé au miso de Shinshu et enveloppé de nori, préparé devant vous par une maison de miso fondée en 1902. Essayez la glace au miso.", 'where': "À l'entrée de Nakamise, après la porte Niomon", 'shop': 'Suyakame (Zenkoji)'},
   {'name': 'Bola de arroz a la plancha con miso', 'note': 'Onigiri a la plancha con miso de Shinshu y nori, hecho al momento por una casa de miso de 1902. Prueba el helado de miso.', 'where': 'A la entrada de Nakamise, tras la puerta Niomon', 'shop': 'Suyakame (Zenkoji)'}),
 'Q61094': S(
   {'name': '우지 말차 디저트', 'note': '1854년 창업한 우지 차 상인의 말차 파르페와 젤리. 보통 수요일 휴무.', 'where': '뵤도인 참배길, 우지강 옆', 'shop': '나카무라 도키치 뵤도인점'},
   {'name': '宇治抹茶甜點', 'note': '1854年創業的宇治茶商推出的抹茶聖代和果凍。通常週三公休。', 'where': '平等院參道,宇治川畔', 'shop': '中村藤吉本店 平等院店'},
   {'name': "Douceurs au matcha d'Uji", 'note': "Parfaits et gelées au matcha d'un marchand de thé d'Uji fondé en 1854. Fermé le mercredi en général.", 'where': "Sur l'allée du Byodoin, au bord de la rivière Uji", 'shop': 'Nakamura Tokichi (Byodoin)'},
   {'name': 'Dulces de matcha de Uji', 'note': 'Parfaits y gelatinas de matcha de un comerciante de té de Uji fundado en 1854. Suele cerrar los miércoles.', 'where': 'En el camino del Byodoin, junto al río Uji', 'shop': 'Nakamura Tokichi (Byodoin)'}),
 'Q662176': S(
   {'name': '아와모치 (조떡)', 'note': '주문하면 가족이 바로 만들어 주는 갓 찧은 조떡. 팥앙금이나 콩고물로. 300년 넘은 기타노의 명물. 목요일·매월 26일 휴무.', 'where': '큰 도리이 앞', 'shop': '아와모치도코로 사와야'},
   {'name': '粟餅', 'note': '現點現做的剛搗好粟餅,配紅豆沙或黃豆粉,是北野三百多年的名產。週四及每月26日公休。', 'where': '大鳥居前', 'shop': '粟餅所・澤屋'},
   {'name': 'Awa-mochi (galette de millet)', 'note': "Galette de millet pilée minute par la famille, avec pâte de haricots rouges ou kinako. Spécialité de Kitano depuis plus de 300 ans. Fermé le jeudi et le 26.", 'where': 'Devant le grand torii', 'shop': 'Awamochi-dokoro Sawaya'},
   {'name': 'Awa-mochi (pastel de mijo)', 'note': 'Mochi de mijo recién machacado por la familia, con judía roja o kinako. Especialidad de Kitano desde hace más de 300 años. Cierra jueves y el día 26.', 'where': 'Frente al gran torii', 'shop': 'Awamochi-dokoro Sawaya'}),
 'Q500955': S(
   {'name': '아부리모치 (숯불 구운 떡)', 'note': '콩고물을 묻혀 숯불에 구운 작은 떡에 달콤한 흰 된장 소스. 헤이안 시대부터 병을 물리치려 먹었습니다. 수요일 휴무.', 'where': '동문 바로 밖', 'shop': '이치몬지야 와스케 (이치와)'},
   {'name': '炙烤麻糬', 'note': '裹黃豆粉的小麻糬用炭火烤,再淋上甜白味噌醬,自平安時代起為驅除疫病而食用。週三公休。', 'where': '東門外', 'shop': '一文字屋和輔(一和)'},
   {'name': 'Aburi-mochi (mochi grillé)', 'note': "Petites galettes au kinako grillées au charbon et nappées de miso blanc sucré — mangées ici depuis l'époque Heian pour éloigner la maladie. Fermé le mercredi.", 'where': "Juste devant la porte est", 'shop': 'Ichimonjiya Wasuke (Ichiwa)'},
   {'name': 'Aburi-mochi (mochi a la brasa)', 'note': 'Pastelitos con kinako asados al carbón y bañados en miso blanco dulce: se comen aquí desde la era Heian para alejar la enfermedad. Cierra los miércoles.', 'where': 'Justo a la salida de la puerta este', 'shop': 'Ichimonjiya Wasuke (Ichiwa)'}),
 'Q339859': S(
   {'name': '쓰리가네 만주 (종 모양 만주)', 'note': '팥앙금이 든 작은 카스텔라 만주. 예전에 시텐노지에 걸려 있던 거대한 범종을 본떴습니다.', 'where': '시텐노지마에 유히가오카역에서 약 6분', 'shop': '소혼케 쓰리가네야'},
   {'name': '釣鐘饅頭', 'note': '包紅豆沙的小蛋糕饅頭,外型仿照四天王寺昔日的巨大梵鐘。', 'where': '四天王寺前夕陽丘站步行約6分鐘', 'shop': '總本家 釣鐘屋'},
   {'name': 'Tsurigane manju (petit pain en forme de cloche)', 'note': "Petit gâteau moelleux fourré de haricots rouges, à l'image de la cloche géante autrefois suspendue au Shitennoji.", 'where': 'À environ 6 min de la gare Shitennoji-mae Yuhigaoka', 'shop': 'Sohonke Tsuriganeya'},
   {'name': 'Tsurigane manju (bollito con forma de campana)', 'note': 'Bizcochito relleno de judía roja con la forma de la enorme campana que colgaba en el Shitennoji.', 'where': 'A unos 6 min de la estación Shitennoji-mae Yuhigaoka', 'shop': 'Sohonke Tsuriganeya'}),
 'Q705310': S(
   {'name': '곤겐 가라메모치', 'note': '신사의 "용신수"로 매일 아침 만드는 부드러운 떡. 팥·콩고물·참깨·김 맛. 매진되는 날도 있습니다.', 'where': '신사 경내, 보물전 근처', 'shop': '곤겐 가라메모치 휴게소'},
   {'name': '權現裹麻糬', 'note': '每天早上用神社的「龍神水」做的柔軟麻糬,有紅豆、黃豆粉、芝麻、海苔口味。有時會賣完。', 'where': '神社境內,寶物殿附近', 'shop': 'お休み処 権現からめもち'},
   {'name': 'Gongen karame-mochi', 'note': "Galette de riz moelleuse préparée chaque matin avec « l'eau du dieu dragon » du sanctuaire : haricots rouges, kinako, sésame ou nori. Parfois épuisée.", 'where': "Dans l'enceinte, près du pavillon du trésor", 'shop': 'Gongen Karamemochi'},
   {'name': 'Gongen karame-mochi', 'note': 'Mochi suave hecho cada mañana con el "agua del dios dragón" del santuario: judía roja, kinako, sésamo o nori. Algunos días se agota.', 'where': 'Dentro del recinto, cerca de la sala del tesoro', 'shop': 'Gongen Karamemochi'}),
 'Q1504465': S(
   {'name': '구즈모치', 'note': '흑밀과 콩고물을 뿌린 발효 밀 전분 떡. 1830년대부터 가와사키다이시의 명물이며 이름은 "장수"를 뜻합니다.', 'where': '절 정문 바로 옆, 나카미세 끝', 'shop': '스미요시 (산몬마에)'},
   {'name': '久壽餅', 'note': '淋黑糖蜜、撒黃豆粉的發酵小麥澱粉糕,自1830年代起是川崎大師名產,名字意為「長壽」。', 'where': '寺院大山門旁,仲見世盡頭', 'shop': '川崎大師 山門前 住吉'},
   {'name': 'Kuzumochi', 'note': "Gâteau d'amidon de blé fermenté, sirop noir et kinako — spécialité de Kawasaki Daishi depuis les années 1830. Le nom signifie « longue vie ».", 'where': 'Juste à côté de la grande porte, au bout de Nakamise', 'shop': 'Sumiyoshi'},
   {'name': 'Kuzumochi', 'note': 'Pastel de almidón de trigo fermentado con melaza negra y kinako, especialidad de Kawasaki Daishi desde la década de 1830. El nombre significa "larga vida".', 'where': 'Junto a la puerta principal, al final de Nakamise', 'shop': 'Sumiyoshi'}),
 'Q3137192': S(
   {'name': '구사 당고 (쑥 경단)', 'note': '팥앙금을 올린 쑥 경단. 영화 "남자는 괴로워" 속 경단 가게의 모델로 알려진 가게입니다. 가게 안에서 먹을 수 있습니다.', 'where': '시바마타역에서 오는 참배길', 'shop': '다카기야 로호'},
   {'name': '草糰子(艾草糰子)', 'note': '鋪上紅豆餡的艾草糰子,這家店被認為是電影《男人真命苦》裡糰子店的原型,可內用。', 'where': '柴又站出發的參道上', 'shop': '高木屋老舗'},
   {'name': 'Kusa dango (boulettes à l’armoise)', 'note': "Boulettes à l'armoise nappées de haricots rouges, dans la maison connue comme modèle de la boutique de dango des films « Tora-san ». On peut manger sur place.", 'where': "Sur l'allée depuis la gare de Shibamata", 'shop': 'Takagiya Roho'},
   {'name': 'Kusa dango (bolitas de artemisa)', 'note': 'Bolitas de artemisa con judía roja, en la casa conocida como modelo de la tienda de dango de las películas de "Tora-san". Se puede comer dentro.', 'where': 'En el camino desde la estación de Shibamata', 'shop': 'Takagiya Roho'}),
 'Q11259219': S(
   {'name': '통문어 센베이', 'note': '작은 문어를 통째로 뜨거운 철판에 눌러 커다란 바삭한 과자로. 목요일·악천후 시 휴무.', 'where': '참배길, 붉은 도리이 바로 앞', 'shop': '아사히 본점'},
   {'name': '整隻章魚仙貝', 'note': '把整隻小章魚放在熱鐵板上壓成大片酥脆仙貝。週四及天候惡劣時公休。', 'where': '參道上,紅色鳥居前', 'shop': 'あさひ本店'},
   {'name': 'Senbei au poulpe entier', 'note': "De petits poulpes entiers pressés sur une plaque brûlante en un grand cracker croustillant. Fermé le jeudi et par mauvais temps.", 'where': "Sur l'allée, juste avant le torii rouge", 'shop': 'Asahi Honten'},
   {'name': 'Senbei de pulpo entero', 'note': 'Pulpitos enteros prensados sobre una plancha ardiente hasta formar una gran galleta crujiente. Cierra los jueves y con mal tiempo.', 'where': 'En el camino, justo antes del torii rojo', 'shop': 'Asahi Honten'}),
 'Q221716': S(
   {'name': '유도후 (다시마 국물 두부)', 'note': '가게 공방에서 만든 두부를 다시마 국물에 데워, 넓은 정원을 바라보며 먹습니다. 에도 초기 창업. 목요일 휴무.', 'where': '산넨자카 근처, 절에서 내려오는 길', 'shop': '오쿠탄 기요미즈'},
   {'name': '湯豆腐', 'note': '自家工坊做的豆腐以昆布湯汁溫煮,望著大庭園享用。江戶初期創業,週四公休。', 'where': '三年坂附近,從寺院下坡的路上', 'shop': '総本家ゆどうふ 奥丹清水'},
   {'name': 'Yudofu (tofu mijoté)', 'note': "Tofu de l'atelier maison mijoté dans un bouillon de kombu, face à un grand jardin. Maison du début d'Edo. Fermé le jeudi.", 'where': 'Près de Sannenzaka, en redescendant du temple', 'shop': 'Okutan Kiyomizu'},
   {'name': 'Yudofu (tofu en caldo)', 'note': 'Tofu de su propio taller cocido en caldo de kombu, frente a un gran jardín. Casa de inicios de Edo. Cierra los jueves.', 'where': 'Cerca de Sannenzaka, bajando del templo', 'shop': 'Okutan Kiyomizu'}),
 'Q3083875': S(
   {'name': '장어구이 (우나주)', 'note': '에도 시대부터 나리타 참배객의 음식인 장어를 가게 앞에서 손질해 구워 줍니다.', 'where': '오모테산도 참배길, 나리타역에서 약 11분', 'shop': '가와토요 본점'},
   {'name': '烤鰻魚(鰻重)', 'note': '江戶時代起成田參拜客的美食,在店門口現場處理、燒烤鰻魚。', 'where': '表參道上,成田站步行約11分鐘', 'shop': '川豊 本店'},
   {'name': 'Anguille grillée (unaju)', 'note': "L'anguille, plat des pèlerins de Narita depuis l'époque d'Edo, préparée et grillée devant vous à l'entrée.", 'where': "Sur l'allée Omotesando, à environ 11 min de la gare de Narita", 'shop': 'Kawatoyo Honten'},
   {'name': 'Anguila a la parrilla (unaju)', 'note': 'La anguila, comida de los peregrinos de Narita desde Edo, preparada y asada ante ti en la puerta.', 'where': 'En el camino Omotesando, a unos 11 min de la estación de Narita', 'shop': 'Kawatoyo Honten'}),
 'Q715632': S(
   {'name': '우사 아메 (엿)', 'note': '맥아와 쌀로 만든 순한 흰 엿. 진구 황후와 아기 하치만 신의 전설에 얽혀 있습니다. 씹지 말고 녹여 드세요.', 'where': '신사 정면 참배길의 나카미세 거리', 'shop': '나카미세의 가게들'},
   {'name': '宇佐飴', 'note': '用麥芽和米做成的溫和白色飴糖,與神功皇后和幼年八幡神的傳說有關。請含著慢慢融化,不要咀嚼。', 'where': '神社主參道旁的仲見世商店街', 'shop': '仲見世的店家'},
   {'name': 'Usa-ame (bonbon de malt)', 'note': "Bonbon blanc et doux de malt et de riz, lié à une légende de l'impératrice Jingu et du jeune Hachiman. À laisser fondre, sans croquer.", 'where': "Rue Nakamise, près de l'allée principale", 'shop': 'Boutiques de Nakamise'},
   {'name': 'Usa-ame (caramelo de malta)', 'note': 'Caramelo blanco y suave de malta y arroz, ligado a una leyenda de la emperatriz Jingu y el pequeño Hachiman. Déjalo derretir, sin masticar.', 'where': 'Calle Nakamise, junto al camino principal', 'shop': 'Tiendas de Nakamise'}),
}
