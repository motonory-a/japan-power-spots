/* ご当地グルメランキング（ranking.html）のデータ
   GOURMET_RANK : 都道府県 → 料理TOP5（data/gourmet.js の料理名と同じ表記）。順位は知名度をもとにした目安
   GOURMET_SHOPS: "都道府県|料理名" → お店。順位は ranking.js が「受賞・選出の数 → 創業の古さ」で並べる
     n: 店名 / r: ローマ字 / a: [地域(日本語), 地域(英語)] / y: 創業年（不明なら省く）
     aw: 受賞・選出（mich_bib=ミシュランガイド ビブグルマン、mich_star:N=ミシュラン N つ星、
         hyaku:年=食べログ百名店、bunka=建物が国の登録有形文化財）
     q: Googleマップで探すときの文字 / src: 確認に使ったページ
   お店を足すときは、公開情報で確認できた受賞・選出だけを書く。確認日を GOURMET_SHOPS_CHECKED に。 */
window.GOURMET_RANK = {
  "北海道": ["ジンギスカン", "札幌ラーメン", "海鮮丼", "石狩鍋", "ちゃんちゃん焼き"],
  "青森県": ["せんべい汁", "いちご煮", "貝焼き味噌", "バラ焼き", "けの汁"],
  "岩手県": ["わんこそば", "盛岡冷麺", "じゃじゃ麺", "ひっつみ", "まめぶ汁"],
  "宮城県": ["牛たん焼き", "ずんだ餅", "はらこ飯", "笹かまぼこ", "せり鍋"],
  "秋田県": ["きりたんぽ鍋", "稲庭うどん", "いぶりがっこ", "ハタハタ寿司", "だまこもち"],
  "山形県": ["芋煮", "米沢牛", "冷やしラーメン", "ひっぱりうどん", "だし"],
  "福島県": ["喜多方ラーメン", "会津のソースカツ丼", "円盤餃子", "こづゆ", "いかにんじん"],
  "茨城県": ["あんこう鍋", "納豆", "干し芋", "どぶ汁", "しもつかれ"],
  "栃木県": ["宇都宮餃子", "日光の湯葉", "足利シュウマイ", "いもフライ", "いちご"],
  "群馬県": ["水沢うどん", "焼きまんじゅう", "おっきりこみ", "下仁田ねぎ"],
  "埼玉県": ["煮ぼうとう", "冷汁うどん", "草加せんべい", "みそポテト", "ゼリーフライ"],
  "千葉県": ["なめろう", "勝浦タンタンメン", "はかりめ丼", "太巻き祭り寿司", "落花生"],
  "東京都": ["江戸前寿司", "もんじゃ焼き", "天丼", "深川めし", "どぜう鍋"],
  "神奈川県": ["よこすか海軍カレー", "しらす丼", "横浜中華街の点心", "けんちん汁", "ういろう"],
  "新潟県": ["へぎそば", "笹団子", "のっぺ", "笹寿司", "コシヒカリ"],
  "富山県": ["ます寿司", "富山ブラック", "白えび", "ぶり大根", "氷見うどん"],
  "石川県": ["治部煮", "金沢おでん", "金沢カレー", "のどぐろ", "能登丼"],
  "福井県": ["越前がに", "越前おろしそば", "ソースカツ丼", "鯖寿司", "へしこ"],
  "山梨県": ["ほうとう", "吉田のうどん", "信玄餅", "ぶどう"],
  "長野県": ["信州そば", "おやき", "山賊焼", "五平餅", "野沢菜漬"],
  "岐阜県": ["飛騨牛", "朴葉味噌", "鶏ちゃん", "栗きんとん", "漬物ステーキ"],
  "静岡県": ["浜名湖のうなぎ", "静岡おでん", "桜えび", "黒はんぺん", "わさび漬け"],
  "愛知県": ["ひつまぶし", "味噌煮込みうどん", "手羽先", "味噌カツ", "きしめん"],
  "三重県": ["伊勢うどん", "松阪牛", "赤福餅", "手こね寿司", "四日市とんてき"],
  "滋賀県": ["近江牛", "鮒寿司", "近江ちゃんぽん", "焼鯖そうめん", "じゅんじゅん"],
  "京都府": ["湯豆腐", "宇治抹茶のスイーツ", "八ツ橋", "衣笠丼", "ばらずし"],
  "大阪府": ["たこ焼き", "お好み焼き", "串カツ", "肉吸い", "うどんすき"],
  "兵庫県": ["神戸牛", "明石焼き", "出石皿そば", "かつめし", "釘煮"],
  "奈良県": ["柿の葉寿司", "三輪そうめん", "茶粥", "奈良漬", "飛鳥鍋"],
  "和歌山県": ["和歌山ラーメン", "紀州の梅干し", "めはり寿司", "胡麻豆腐", "秋刀魚寿司"],
  "鳥取県": ["松葉がに", "牛骨ラーメン", "とうふちくわ", "いただき", "二十世紀梨"],
  "島根県": ["出雲そば", "しじみ汁", "出雲ぜんざい", "うずめ飯", "生姜糖"],
  "岡山県": ["デミカツ丼", "ままかりずし", "カキオコ", "きびだんご", "白桃"],
  "広島県": ["広島風お好み焼き", "牡蠣", "あなご飯", "もみじ饅頭", "牡蠣の土手鍋"],
  "山口県": ["ふく（ふぐ）料理", "瓦そば", "岩国寿司", "わかめむすび"],
  "徳島県": ["徳島ラーメン", "祖谷そば", "たらいうどん", "鳴門金時", "ぼうぜの姿寿司"],
  "香川県": ["讃岐うどん", "骨付鳥", "釜玉うどん", "オリーブハマチ", "しょうゆ豆"],
  "愛媛県": ["鯛めし", "じゃこ天", "焼豚玉子飯", "鍋焼きうどん", "伊予さつま"],
  "高知県": ["カツオのたたき", "鍋焼きラーメン", "皿鉢料理", "室戸キンメ丼", "芋ケンピ"],
  "福岡県": ["博多ラーメン", "もつ鍋", "明太子", "久留米やきとり", "博多うどん"],
  "佐賀県": ["呼子のイカ", "佐賀牛", "シシリアンライス", "いかしゅうまい", "須古寿し"],
  "長崎県": ["長崎ちゃんぽん", "皿うどん", "カステラ", "トルコライス", "佐世保バーガー"],
  "熊本県": ["馬刺し", "太平燕", "からし蓮根", "高菜めし", "ちくわサラダ"],
  "大分県": ["とり天", "関さば", "だんご汁", "中津からあげ", "あつめし"],
  "宮崎県": ["チキン南蛮", "地鶏の炭火焼き", "冷や汁", "肉巻きおにぎり", "マンゴー"],
  "鹿児島県": ["黒豚しゃぶしゃぶ", "鶏飯", "しろくま", "薩摩汁", "豚骨料理"],
  "沖縄県": ["ソーキそば", "ゴーヤーチャンプルー", "ラフテー", "タコライス", "サーターアンダギー"]
};

window.GOURMET_SHOPS_CHECKED = "2026-11";
/* エリア別のお店ベスト3。並び順＝ページに出る順。キーは "都道府県|料理名"、a はエリア名 [日本語, 英語] */
window.GOURMET_SHOP_AREAS = [
  ["北海道|札幌ラーメン", ["札幌", "Sapporo"]],
  ["宮城県|牛たん焼き", ["仙台", "Sendai"]],
  ["東京都|天丼", ["東京・浅草", "Tokyo (Asakusa)"]],
  ["東京都|どぜう鍋", ["東京・浅草", "Tokyo (Asakusa)"]],
  ["愛知県|ひつまぶし", ["名古屋・熱田", "Nagoya (Atsuta)"]],
  ["三重県|伊勢うどん", ["伊勢", "Ise"]],
  ["京都府|湯豆腐", ["京都", "Kyoto"]],
  ["大阪府|お好み焼き", ["大阪・道頓堀", "Osaka (Dotonbori)"]],
  ["島根県|出雲そば", ["出雲", "Izumo"]],
  ["広島県|あなご飯", ["宮島", "Miyajima"]],
  ["福岡県|博多ラーメン", ["福岡", "Fukuoka"]],
  ["福岡県|梅ヶ枝餅", ["太宰府", "Dazaifu"]],
  ["神奈川県|横浜中華街の点心", ["横浜・中華街", "Yokohama (Chinatown)"]],
  ["兵庫県|神戸牛", ["神戸・三宮", "Kobe (Sannomiya)"]],
  ["栃木県|日光の湯葉", ["日光", "Nikko"]],
  ["和歌山県|胡麻豆腐", ["高野山", "Mt. Koya"]]
];
/* 図鑑（data/gourmet.js）にない料理。[日本語, 英語, 説明(日), 説明(英)] と各言語の [名前, 説明] */
window.GOURMET_EXTRA = {
  "福岡県": [["梅ヶ枝餅", "Umegae-mochi", "太宰府天満宮の参道名物。薄い餅で粒あんを包み、梅の焼き印をつけて香ばしく焼いたお菓子。", "A Dazaifu Tenmangu specialty: thin rice-cake dough filled with sweet red bean paste, grilled crisp and stamped with a plum blossom."]]
};
window.GOURMET_EXTRA_T = {
  "梅ヶ枝餅": {
    zh: ["梅枝餅", "太宰府天滿宮參道的名產。薄薄的麻糬包紅豆餡，烤得香脆，印有梅花圖案。"],
    ko: ["우메가에모치", "다자이후 텐만구 참배길의 명물. 얇은 떡에 팥소를 넣고 매화 무늬를 찍어 고소하게 구운 과자."],
    fr: ["Umegae-mochi", "Spécialité de Dazaifu Tenmangu : fine pâte de riz fourrée aux haricots rouges, grillée et marquée d’une fleur de prunier."],
    es: ["Umegae-mochi", "Especialidad de Dazaifu Tenmangu: masa fina de arroz rellena de pasta de judía roja, tostada y marcada con una flor de ciruelo."]
  }
};
window.GOURMET_SHOPS = {
  "東京都|天丼": [
    { n: "土手の伊勢屋", r: "Dote no Iseya", a: ["台東区日本堤（三ノ輪）", "Nihonzutsumi, Taito (Minowa)"], y: 1889, aw: ["bunka"],
      q: "土手の伊勢屋 台東区日本堤1-9-2", src: "https://www.gltjp.com/ja/directory/item/14140/" },
    { n: "天すけ", r: "Tensuke", a: ["杉並区高円寺北", "Koenji-kita, Suginami"], aw: ["mich_bib"],
      q: "天すけ 杉並区高円寺北3-22-7", src: "https://guide.michelin.com/jp/ja/tokyo-region/tokyo/restaurant/tensuke" },
    { n: "雷門 三定", r: "Kaminarimon Sansada", a: ["台東区浅草（雷門前）", "Asakusa, Taito (by Kaminarimon)"], y: 1837, aw: [],
      q: "雷門 三定 浅草", src: "https://livejapan.com/ja/article/a0000405" },
    { n: "大黒家天麩羅", r: "Daikokuya Tempura", a: ["台東区浅草", "Asakusa, Taito"], y: 1887, aw: [],
      q: "大黒家天麩羅 台東区浅草1-38-10", src: "https://www.gltjp.com/ja/directory/item/10627/" }
  ],
  "東京都|どぜう鍋": [
    { n: "駒形どぜう 本店", r: "Komagata Dozeu", a: ["台東区駒形（浅草）", "Komagata, Taito (Asakusa)"], y: 1801, aw: [],
      q: "駒形どぜう 本店 台東区駒形1-7-12", src: "https://www.mec-h.com/town/mh-ueno/74" },
    { n: "どぜう飯田屋", r: "Dozeu Iidaya", a: ["台東区西浅草", "Nishi-Asakusa, Taito"], y: 1902, aw: [],
      q: "どぜう飯田屋 台東区西浅草3-3-2", src: "https://www.tv-tokyo.co.jp/adomachi/backnumber/20121006/77761.html" },
    { n: "どぜう ひら井", r: "Dozeu Hirai", a: ["墨田区吾妻橋", "Azumabashi, Sumida"], y: 1903, aw: [],
      q: "どぜう ひら井 墨田区吾妻橋1-7-8", src: "https://www.tv-tokyo.co.jp/adomachi/backnumber/20200912/141012.html" }
  ],
  "北海道|札幌ラーメン": [
    { n: "だるま軒", r: "Darumaken", a: ["札幌市中央区（新二条市場）", "Chuo-ku, Sapporo (Nijo Market)"], y: 1947, aw: [],
      q: "だるま軒 札幌 新二条市場", src: "https://rurubu.jp/andmore/spot/80000174" },
    { n: "味の三平", r: "Aji no Sanpei", a: ["札幌市中央区（大通）", "Chuo-ku, Sapporo (Odori)"], y: 1950, aw: [],
      q: "味の三平 札幌市中央区南1条西3丁目", src: "https://tabi-mag.jp/ho1214/" },
    { n: "すみれ 札幌中の島本店", r: "Sumire Nakanoshima", a: ["札幌市豊平区中の島", "Nakanoshima, Toyohira, Sapporo"], y: 1964, aw: [],
      q: "すみれ 札幌中の島本店", src: "https://livejapan.com/ja/in-hokkaido/in-pref-hokkaido/in-sapporo_chitose/article-a1000177/" }
  ],
  "宮城県|牛たん焼き": [
    { n: "旨味 太助", r: "Umami Tasuke", a: ["仙台市青葉区国分町", "Kokubuncho, Aoba, Sendai"], y: 1948, aw: [],
      q: "旨味太助 仙台市青葉区国分町2-11-11", src: "https://www.gltjp.com/ja/directory/item/13862/" },
    { n: "味の牛たん喜助 駅前中央本店", r: "Kisuke (Ekimae Chuo)", a: ["仙台駅前", "Near Sendai Station"], y: 1975, aw: [],
      q: "味の牛たん喜助 駅前中央本店", src: "https://www.gltjp.com/ja/directory/item/17643/" },
    { n: "牛たん料理 閣", r: "Gyutan Ryori Kaku", a: ["仙台市青葉区一番町", "Ichibancho, Aoba, Sendai"], y: 1988, aw: [],
      q: "牛たん料理 閣 仙台", src: "https://livejapan.com/ja/in-tohoku/in-pref-miyagi/in-sendai_matsushima/article-a3000022/" }
  ],
  "愛知県|ひつまぶし": [
    { n: "あつた蓬莱軒 本店", r: "Atsuta Horaiken", a: ["名古屋市熱田区（熱田神宮のそば）", "Atsuta, Nagoya (by Atsuta Shrine)"], y: 1873,
      aw: ["hyaku:2018", "hyaku:2019", "hyaku:2022", "hyaku:2024"],
      q: "あつた蓬莱軒 本店 名古屋市熱田区神戸町503", src: "https://tabelog.com/aichi/A2301/A230112/23000063/" },
    { n: "イチビキ", r: "Ichibiki", a: ["名古屋市中村区（名古屋駅と伏見の間）", "Nakamura, Nagoya"], y: 1939, aw: ["hyaku"],
      q: "うなぎ イチビキ 名古屋", src: "https://macaro-ni.jp/171528" },
    { n: "いば昇 本店", r: "Ibasho", a: ["名古屋市中区（栄）", "Sakae, Naka, Nagoya"], y: 1909, aw: [],
      q: "いば昇 本店 名古屋", src: "https://ssl.tabelog.com/en/aichi/A2301/A230103/23006881/" }
  ],
  "三重県|伊勢うどん": [
    { n: "ちとせ", r: "Chitose", a: ["伊勢市岩渕（宇治山田駅前）", "Iwabuchi, Ise (by Ujiyamada Sta.)"], y: 1917, aw: [],
      q: "ちとせ 伊勢うどん 伊勢市岩渕1-15-11", src: "https://www.mapple.net/region/a0405000000_g03050e00/spot/" },
    { n: "伊勢うどんのまめや", r: "Mameya", a: ["伊勢市宮後（伊勢市駅そば）", "Miyajiri, Ise (near Iseshi Sta.)"], y: 1923, aw: [],
      q: "伊勢うどんのまめや 伊勢市宮後2-19-11", src: "https://www.mapple.net/region/a0405000000_g03050e00/spot/" },
    { n: "福野屋", r: "Fukunoya", a: ["伊勢市河崎", "Kawasaki, Ise"], y: 1927, aw: [],
      q: "福野屋 伊勢市河崎3-2-1", src: "https://www.mapple.net/region/a0405010000_g03050e00/spot/" }
  ],
  "京都府|湯豆腐": [
    { n: "南禅寺 順正", r: "Nanzenji Junsei", a: ["左京区（南禅寺の門前）", "Sakyo (by Nanzen-ji)"], aw: ["bunka"],
      q: "南禅寺 順正", src: "https://www.gltjp.com/ja/directory/item/13879/" },
    { n: "総本家ゆどうふ 奥丹清水", r: "Okutan Kiyomizu", a: ["東山区（清水寺への産寧坂）", "Higashiyama (Sannenzaka, Kiyomizu-dera)"], y: 1635, aw: [],
      q: "奥丹清水 湯豆腐", src: "https://www.walkerplus.com/article/1193959/amp/" },
    { n: "西山艸堂", r: "Seizan Sodo", a: ["右京区嵯峨（天龍寺の塔頭）", "Saga, Ukyo (in Tenryu-ji)"], aw: [],
      q: "西山艸堂 嵯峨天龍寺", src: "https://www.walkerplus.com/article/203185/" }
  ],
  "大阪府|お好み焼き": [
    { n: "美津の", r: "Mizuno", a: ["中央区道頓堀", "Dotonbori, Chuo"], y: 1945, aw: ["mich"],
      q: "美津の お好み焼き 道頓堀", src: "https://retty.me/restaurant/100000014901/" },
    { n: "味乃家", r: "Ajinoya", a: ["中央区難波（道頓堀のそば）", "Namba, Chuo"], y: 1964, aw: ["mich_bib"],
      q: "味乃家 お好み焼き 難波", src: "https://aumo.jp/articles/45727" },
    { n: "福太郎 本店", r: "Fukutaro", a: ["中央区千日前（なんば）", "Sennichimae, Chuo (Namba)"], aw: ["hyaku"],
      q: "福太郎 本店 お好み焼き なんば", src: "https://tabelog.com/matome/28979/" }
  ],
  "島根県|出雲そば": [
    { n: "荒木屋", r: "Arakiya", a: ["出雲市大社町（出雲大社のそば）", "Taisha, Izumo (near Izumo Taisha)"], e: "edo_late", aw: [],
      q: "荒木屋 出雲そば 大社町", src: "https://www.mapple.net/collection/f5119b81f1a2461d9bb7b27694cfdbdc/" },
    { n: "献上そば 羽根屋本店", r: "Haneya", a: ["出雲市今市町（出雲市駅そば）", "Imaichi, Izumo (near Izumoshi Sta.)"], e: "edo_end", aw: [],
      q: "献上そば 羽根屋本店", src: "https://www.gltjp.com/ja/directory/item/17856/" },
    { n: "かねや", r: "Kaneya", a: ["出雲市大社町（出雲大社のそば）", "Taisha, Izumo (near Izumo Taisha)"], y: 1929, aw: [],
      q: "かねや 出雲そば 大社町", src: "https://www.mapple.net/region/a0601040300_g03050d00/spot/" }
  ],
  "広島県|あなご飯": [
    { n: "ふじたや", r: "Fujitaya", a: ["宮島（嚴島神社から大聖院への道）", "Miyajima (near Itsukushima Shrine)"], aw: ["mich_star:1"],
      q: "ふじたや 宮島 あなごめし", src: "https://macaro-ni.jp/105410" },
    { n: "あなごめし うえの 宮島口本店", r: "Anagomeshi Ueno", a: ["廿日市市宮島口（駅前）", "Miyajimaguchi (by the station)"], y: 1901, aw: [],
      q: "あなごめし うえの 宮島口本店", src: "https://www.gltjp.com/ja/directory/item/14838/" },
    { n: "あなごめし 和田", r: "Anagomeshi Wada", a: ["宮島（五重塔の近く）", "Miyajima (near the five-story pagoda)"], aw: [],
      q: "あなごめし 和田 宮島", src: "https://dive-hiroshima.com/feature/seafood-anago/" }
  ],
  "福岡県|博多ラーメン": [
    { n: "らーめん博多荘", r: "Ramen Hakataso", a: ["博多区中洲", "Nakasu, Hakata"], y: 1946, aw: [],
      q: "らーめん博多荘 中洲", src: "https://tabi-mag.jp/fu0362/" },
    { n: "元祖赤のれん 節ちゃんラーメン 本店", r: "Ganso Akanoren Setchan Ramen", a: ["中央区大名", "Daimyo, Chuo"], y: 1946, aw: [],
      q: "元祖赤のれん 節ちゃんラーメン 本店", src: "https://tabi-mag.jp/fu0364" },
    { n: "元祖長浜屋", r: "Ganso Nagahamaya", a: ["中央区長浜", "Nagahama, Chuo"], y: 1952, aw: [],
      q: "元祖長浜屋 福岡市中央区長浜", src: "https://tabi-mag.jp/fu0363/" }
  ],
  "福岡県|梅ヶ枝餅": [
    { n: "かさの家", r: "Kasanoya", a: ["太宰府天満宮の参道", "Dazaifu Tenmangu approach"], y: 1922, aw: [],
      q: "かさの家 太宰府 梅ヶ枝餅", src: "https://www.walkerplus.com/article/131526/" },
    { n: "梅園菓子処", r: "Baien Kashidokoro", a: ["太宰府天満宮の参道（入口近く）", "Dazaifu Tenmangu approach (near the entrance)"], y: 1948, aw: [],
      q: "梅園菓子処 太宰府市宰府2-6-16", src: "https://www.nap-camp.com/mag/121599" },
    { n: "寿庵 寺田屋", r: "Juan Teradaya", a: ["太宰府天満宮の参道", "Dazaifu Tenmangu approach"], aw: [],
      q: "寿庵 寺田屋 太宰府市宰府4-6-15", src: "https://www.nap-camp.com/mag/121599" }
  ],
  "神奈川県|横浜中華街の点心": [
    { n: "萬珍樓 本店", r: "Manchinro Honten", a: ["横浜中華街", "Yokohama Chinatown"], y: 1892, aw: [],
      q: "萬珍樓 本店 横浜中華街", src: "https://www.gltjp.com/ja/directory/item/15205/" },
    { n: "華正樓 本店", r: "Kaseiro Honten", a: ["横浜中華街", "Yokohama Chinatown"], y: 1939, aw: [],
      q: "華正樓 本店 横浜市中区山下町186", src: "https://www.welcome.city.yokohama.jp/gourmet/chinatown/page_06.php" },
    { n: "重慶茶樓 横浜中華街本店", r: "Chung King Saro", a: ["横浜中華街", "Yokohama Chinatown"], y: 1959, aw: [],
      q: "重慶茶樓 横浜中華街 本店", src: "https://hitosara.com/0031059626/" }
  ],
  "兵庫県|神戸牛": [
    { n: "モーリヤ 本店", r: "Mouriya Honten", a: ["神戸市中央区（三宮・いくたロード）", "Sannomiya, Chuo-ku, Kobe"], y: 1885, aw: [],
      q: "モーリヤ 本店 神戸 三宮", src: "https://macaro-ni.jp/60921?page=4" },
    { n: "あぶり肉工房 和黒 北野坂本店", r: "Wakkoku Kitanozaka", a: ["神戸市中央区（北野坂）", "Kitanozaka, Chuo-ku, Kobe"], aw: [],
      q: "和黒 北野坂本店 神戸", src: "https://www.gltjp.com/ja/directory/item/11407/" },
    { n: "麤皮", r: "Aragawa", a: ["神戸市中央区（三宮）", "Sannomiya, Chuo-ku, Kobe"], aw: [],
      q: "麤皮 あらがわ 神戸 三宮", src: "https://tabelog.com/matome/31747/" }
  ],
  "栃木県|日光の湯葉": [
    { n: "日光湯波 ふじや", r: "Nikko Yuba Fujiya", a: ["日光市（日光駅と東照宮の間）", "Nikko (between the station and Toshogu)"], y: 1868, aw: [],
      q: "日光湯波 ふじや", src: "https://www.yukoyuko.net/onsen/spot/s0002798" },
    { n: "元祖日光ゆば料理 恵比寿家", r: "Ebisuya", a: ["日光市下鉢石町", "Shimohatsuishi, Nikko"], e: "over100", aw: [],
      q: "元祖日光ゆば料理 恵比寿家 日光市下鉢石町955", src: "https://www.mapple.net/article/35596/" },
    { n: "日光ゆば遊膳", r: "Nikko Yuba Yuzen", a: ["日光市安川町（神橋の近く）", "Yasukawa, Nikko (near Shinkyo Bridge)"], aw: [],
      q: "日光ゆば遊膳 日光市安川町1-22", src: "https://www.fun-japan.jp/tw/articles/10253" }
  ],
  "和歌山県|胡麻豆腐": [
    { n: "濱田屋", r: "Hamadaya", a: ["高野山（奥之院への参道近く）", "Mt. Koya (near the Okunoin approach)"], e: "meiji", aw: [],
      q: "濱田屋 胡麻豆腐 高野山444", src: "https://www.mapple.net/region/a0507030500_g02060000/spot/" },
    { n: "角濱ごまとうふ総本舗 大門店", r: "Kadohama Daimon", a: ["高野山（大門の近く）", "Mt. Koya (near the Daimon Gate)"], e: "over100", aw: [],
      q: "角濱ごまとうふ総本舗 大門店", src: "https://voix.jp/life/?p=42172" },
    { n: "森下商店総本舗", r: "Morishita Shoten", a: ["高野山", "Mt. Koya"], y: 1950, aw: [],
      q: "森下商店総本舗 高野山 胡麻豆腐", src: "https://www.nap-camp.com/mag/124460" }
  ]
};