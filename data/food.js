/* 土地の名物と季節の味（2026-11 作成）
   MEIBUTSU：都道府県ごとに、広く知られた名物料理・銘菓を3つ（[日本語, English]）。
   SEASON：地方ごと・季節ごとに、一般に旬とされる食べ物（[日本語, English]）。
   どちらも「一般によく知られたもの」に絞っている。店の評価や価格は載せない。 */
(function (root) {
  var M = {
    '北海道': [['ジンギスカン', 'Jingisukan (grilled lamb)'], ['海鮮丼', 'Seafood rice bowl'], ['札幌ラーメン', 'Sapporo miso ramen']],
    '青森県': [['せんべい汁', 'Senbei-jiru (cracker soup)'], ['りんご', 'Aomori apples'], ['ホタテ', 'Scallops']],
    '岩手県': [['わんこそば', 'Wanko soba'], ['盛岡冷麺', 'Morioka cold noodles'], ['じゃじゃ麺', 'Jaja-men noodles']],
    '宮城県': [['牛たん焼き', 'Grilled beef tongue'], ['ずんだ餅', 'Zunda mochi (edamame paste)'], ['笹かまぼこ', 'Sasa-kamaboko fish cake']],
    '秋田県': [['きりたんぽ鍋', 'Kiritanpo hot pot'], ['稲庭うどん', 'Inaniwa udon'], ['いぶりがっこ', 'Smoked pickled radish']],
    '山形県': [['芋煮', 'Imoni (taro stew)'], ['米沢牛', 'Yonezawa beef'], ['さくらんぼ', 'Cherries']],
    '福島県': [['喜多方ラーメン', 'Kitakata ramen'], ['会津のソースカツ丼', 'Aizu sauce katsudon'], ['桃', 'Peaches']],
    '茨城県': [['あんこう鍋', 'Monkfish hot pot'], ['納豆', 'Natto'], ['干し芋', 'Dried sweet potato']],
    '栃木県': [['宇都宮餃子', 'Utsunomiya gyoza'], ['いちご', 'Strawberries'], ['日光の湯葉', 'Nikko yuba (tofu skin)']],
    '群馬県': [['水沢うどん', 'Mizusawa udon'], ['焼きまんじゅう', 'Yaki-manju (grilled buns)'], ['下仁田ねぎ', 'Shimonita leeks']],
    '埼玉県': [['草加せんべい', 'Soka rice crackers'], ['川越のさつまいも菓子', 'Kawagoe sweet potato treats'], ['深谷ねぎ', 'Fukaya leeks']],
    '千葉県': [['なめろう', 'Namero (minced fish)'], ['落花生', 'Peanuts'], ['勝浦タンタンメン', 'Katsuura tantanmen']],
    '東京都': [['江戸前寿司', 'Edomae sushi'], ['もんじゃ焼き', 'Monjayaki'], ['深川めし', 'Fukagawa-meshi (clam rice)']],
    '神奈川県': [['しらす丼', 'Shirasu (whitebait) bowl'], ['横浜中華街の点心', 'Yokohama Chinatown dim sum'], ['よこすか海軍カレー', 'Yokosuka navy curry']],
    '新潟県': [['へぎそば', 'Hegi soba'], ['笹団子', 'Sasa-dango'], ['コシヒカリ', 'Koshihikari rice']],
    '富山県': [['ます寿司', 'Masu-zushi (trout sushi)'], ['白えび', 'White shrimp'], ['富山ブラック', 'Toyama Black ramen']],
    '石川県': [['治部煮', 'Jibuni stew'], ['金沢おでん', 'Kanazawa oden'], ['のどぐろ', 'Nodoguro (rosy seabass)']],
    '福井県': [['越前がに', 'Echizen crab'], ['越前おろしそば', 'Echizen grated-radish soba'], ['ソースカツ丼', 'Sauce katsudon']],
    '山梨県': [['ほうとう', 'Hoto noodle stew'], ['信玄餅', 'Shingen mochi'], ['ぶどう', 'Grapes']],
    '長野県': [['信州そば', 'Shinshu soba'], ['おやき', 'Oyaki dumplings'], ['野沢菜漬', 'Nozawana pickles']],
    '岐阜県': [['飛騨牛', 'Hida beef'], ['朴葉味噌', 'Hoba miso'], ['栗きんとん', 'Kuri-kinton chestnut sweets']],
    '静岡県': [['静岡おでん', 'Shizuoka oden'], ['浜名湖のうなぎ', 'Lake Hamana eel'], ['桜えび', 'Sakura shrimp']],
    '愛知県': [['ひつまぶし', 'Hitsumabushi (eel rice)'], ['味噌煮込みうどん', 'Miso-nikomi udon'], ['手羽先', 'Tebasaki chicken wings']],
    '三重県': [['伊勢うどん', 'Ise udon'], ['赤福餅', 'Akafuku mochi'], ['松阪牛', 'Matsusaka beef']],
    '滋賀県': [['近江牛', 'Omi beef'], ['鮒寿司', 'Funa-zushi'], ['近江ちゃんぽん', 'Omi champon']],
    '京都府': [['湯豆腐', 'Yudofu (simmered tofu)'], ['八ツ橋', 'Yatsuhashi'], ['宇治抹茶のスイーツ', 'Uji matcha sweets']],
    '大阪府': [['たこ焼き', 'Takoyaki'], ['お好み焼き', 'Okonomiyaki'], ['串カツ', 'Kushikatsu']],
    '兵庫県': [['神戸牛', 'Kobe beef'], ['明石焼き', 'Akashiyaki'], ['出石皿そば', 'Izushi sara-soba']],
    '奈良県': [['柿の葉寿司', 'Kakinoha-zushi'], ['三輪そうめん', 'Miwa somen'], ['奈良漬', 'Narazuke pickles']],
    '和歌山県': [['紀州の梅干し', 'Kishu umeboshi'], ['和歌山ラーメン', 'Wakayama ramen'], ['めはり寿司', 'Mehari-zushi']],
    '鳥取県': [['松葉がに', 'Matsuba crab'], ['二十世紀梨', 'Nijisseiki pears'], ['牛骨ラーメン', 'Beef-bone ramen']],
    '島根県': [['出雲そば', 'Izumo soba'], ['しじみ汁', 'Shijimi clam soup'], ['出雲ぜんざい', 'Izumo zenzai']],
    '岡山県': [['白桃', 'White peaches'], ['きびだんご', 'Kibi-dango'], ['デミカツ丼', 'Demi-katsudon']],
    '広島県': [['広島風お好み焼き', 'Hiroshima okonomiyaki'], ['牡蠣', 'Oysters'], ['もみじ饅頭', 'Momiji manju']],
    '山口県': [['ふく（ふぐ）料理', 'Fugu (pufferfish)'], ['瓦そば', 'Kawara soba'], ['岩国寿司', 'Iwakuni-zushi']],
    '徳島県': [['徳島ラーメン', 'Tokushima ramen'], ['すだち', 'Sudachi citrus'], ['鳴門金時', 'Naruto Kintoki sweet potato']],
    '香川県': [['讃岐うどん', 'Sanuki udon'], ['骨付鳥', 'Honetsuki-dori chicken'], ['オリーブハマチ', 'Olive-fed yellowtail']],
    '愛媛県': [['鯛めし', 'Tai-meshi (sea bream rice)'], ['みかん', 'Mikan oranges'], ['じゃこ天', 'Jakoten fish cake']],
    '高知県': [['カツオのたたき', 'Seared bonito'], ['鍋焼きラーメン', 'Nabeyaki ramen'], ['文旦', 'Buntan citrus']],
    '福岡県': [['博多ラーメン', 'Hakata ramen'], ['もつ鍋', 'Motsunabe'], ['明太子', 'Mentaiko']],
    '佐賀県': [['呼子のイカ', 'Yobuko squid'], ['佐賀牛', 'Saga beef'], ['シシリアンライス', 'Sicilian rice']],
    '長崎県': [['長崎ちゃんぽん', 'Nagasaki champon'], ['皿うどん', 'Sara udon'], ['カステラ', 'Castella cake']],
    '熊本県': [['馬刺し', 'Basashi (horse sashimi)'], ['太平燕', 'Taipien noodle soup'], ['からし蓮根', 'Karashi renkon']],
    '大分県': [['とり天', 'Toriten (chicken tempura)'], ['関さば', 'Seki mackerel'], ['だんご汁', 'Dango-jiru']],
    '宮崎県': [['チキン南蛮', 'Chicken nanban'], ['地鶏の炭火焼き', 'Charcoal-grilled jidori'], ['マンゴー', 'Mangoes']],
    '鹿児島県': [['黒豚しゃぶしゃぶ', 'Kurobuta pork shabu-shabu'], ['鶏飯', 'Keihan (chicken rice)'], ['しろくま', 'Shirokuma shaved ice']],
    '沖縄県': [['ソーキそば', 'Soki soba'], ['ゴーヤーチャンプルー', 'Goya champuru'], ['サーターアンダギー', 'Sata andagi']]
  };
  var REGION = {
    '北海道': '北海道',
    '青森県': '東北', '岩手県': '東北', '宮城県': '東北', '秋田県': '東北', '山形県': '東北', '福島県': '東北',
    '茨城県': '関東', '栃木県': '関東', '群馬県': '関東', '埼玉県': '関東', '千葉県': '関東', '東京都': '関東', '神奈川県': '関東',
    '新潟県': '中部', '富山県': '中部', '石川県': '中部', '福井県': '中部', '山梨県': '中部', '長野県': '中部', '岐阜県': '中部', '静岡県': '中部', '愛知県': '中部',
    '三重県': '近畿', '滋賀県': '近畿', '京都府': '近畿', '大阪府': '近畿', '兵庫県': '近畿', '奈良県': '近畿', '和歌山県': '近畿',
    '鳥取県': '中国', '島根県': '中国', '岡山県': '中国', '広島県': '中国', '山口県': '中国',
    '徳島県': '四国', '香川県': '四国', '愛媛県': '四国', '高知県': '四国',
    '福岡県': '九州・沖縄', '佐賀県': '九州・沖縄', '長崎県': '九州・沖縄', '熊本県': '九州・沖縄', '大分県': '九州・沖縄', '宮崎県': '九州・沖縄', '鹿児島県': '九州・沖縄', '沖縄県': '九州・沖縄'
  };
  var REGION_EN = { '北海道': 'Hokkaido', '東北': 'Tohoku', '関東': 'Kanto', '中部': 'Chubu', '近畿': 'Kansai', '中国': 'Chugoku', '四国': 'Shikoku', '九州・沖縄': 'Kyushu & Okinawa' };
  // 春=3〜5月、夏=6〜8月、秋=9〜11月、冬=12〜2月
  var S = {
    '北海道': { spring: [['アスパラガス', 'Asparagus'], ['ホッキ貝', 'Surf clams']], summer: [['とうもろこし', 'Sweet corn'], ['ウニ', 'Sea urchin'], ['メロン', 'Melon']], autumn: [['鮭・いくら', 'Salmon & salmon roe'], ['じゃがいも', 'Potatoes'], ['新米', 'New-crop rice']], winter: [['毛がに', 'Hairy crab'], ['牡蠣', 'Oysters'], ['タラ', 'Cod']] },
    '東北': { spring: [['山菜', 'Mountain vegetables'], ['たけのこ', 'Bamboo shoots']], summer: [['さくらんぼ', 'Cherries'], ['桃', 'Peaches'], ['ホヤ', 'Sea squirt']], autumn: [['新米', 'New-crop rice'], ['芋煮', 'Imoni taro stew'], ['りんご', 'Apples'], ['きのこ', 'Mushrooms']], winter: [['あんこう', 'Monkfish'], ['寒だら', 'Winter cod'], ['りんご', 'Apples']] },
    '関東': { spring: [['初鰹', 'First bonito of the year'], ['しらす', 'Whitebait'], ['たけのこ', 'Bamboo shoots']], summer: [['枝豆', 'Edamame'], ['とうもろこし', 'Sweet corn'], ['すいか', 'Watermelon']], autumn: [['梨', 'Nashi pears'], ['栗', 'Chestnuts'], ['さつまいも', 'Sweet potatoes'], ['新米', 'New-crop rice']], winter: [['あんこう', 'Monkfish'], ['ねぎ', 'Leeks'], ['いちご', 'Strawberries']] },
    '中部': { spring: [['ほたるいか', 'Firefly squid'], ['桜えび', 'Sakura shrimp'], ['山菜', 'Mountain vegetables']], summer: [['桃', 'Peaches'], ['ぶどう', 'Grapes'], ['とうもろこし', 'Sweet corn']], autumn: [['新そば', 'New-season soba'], ['栗', 'Chestnuts'], ['りんご', 'Apples'], ['松茸', 'Matsutake mushrooms']], winter: [['寒ぶり', 'Winter yellowtail'], ['ずわいがに', 'Snow crab'], ['甘えび', 'Sweet shrimp']] },
    '近畿': { spring: [['たけのこ', 'Bamboo shoots'], ['桜鯛', 'Spring sea bream'], ['いかなご', 'Sand lance']], summer: [['鱧', 'Hamo (pike conger)'], ['鮎', 'Ayu sweetfish'], ['桃', 'Peaches']], autumn: [['松茸', 'Matsutake mushrooms'], ['丹波の栗・黒豆', 'Tamba chestnuts & black beans'], ['柿', 'Persimmons']], winter: [['ずわいがに', 'Snow crab'], ['牡蠣', 'Oysters'], ['ふぐ', 'Fugu (pufferfish)']] },
    '中国': { spring: [['さわら', 'Spanish mackerel'], ['たけのこ', 'Bamboo shoots']], summer: [['白桃', 'White peaches'], ['あなご', 'Conger eel'], ['ぶどう', 'Grapes']], autumn: [['梨', 'Nashi pears'], ['ぶどう', 'Grapes'], ['松茸', 'Matsutake mushrooms']], winter: [['牡蠣', 'Oysters'], ['松葉がに', 'Matsuba crab'], ['ふぐ', 'Fugu (pufferfish)']] },
    '四国': { spring: [['初鰹', 'First bonito of the year'], ['たけのこ', 'Bamboo shoots'], ['文旦', 'Buntan citrus']], summer: [['すだち', 'Sudachi citrus'], ['鮎', 'Ayu sweetfish']], autumn: [['戻り鰹', 'Autumn bonito'], ['すだち', 'Sudachi citrus'], ['みかん', 'Mikan oranges']], winter: [['みかん', 'Mikan oranges'], ['ぶり', 'Yellowtail'], ['伊勢えび', 'Spiny lobster']] },
    '九州・沖縄': { spring: [['いちご', 'Strawberries'], ['新玉ねぎ', 'New onions'], ['たけのこ', 'Bamboo shoots']], summer: [['マンゴー', 'Mangoes'], ['ゴーヤー', 'Bitter melon'], ['うなぎ', 'Eel']], autumn: [['栗', 'Chestnuts'], ['さつまいも', 'Sweet potatoes'], ['新米', 'New-crop rice']], winter: [['ふぐ', 'Fugu (pufferfish)'], ['牡蠣', 'Oysters'], ['いちご', 'Strawberries']] }
  };
  var SEASON_JA = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };
  var SEASON_EN = { spring: 'spring', summer: 'summer', autumn: 'autumn', winter: 'winter' };
  function seasonOf(month) { return month >= 3 && month <= 5 ? 'spring' : month >= 6 && month <= 8 ? 'summer' : month >= 9 && month <= 11 ? 'autumn' : 'winter'; }
  function pick(list, lang) { return (list || []).map(function (x) { return lang === 'en' ? x[1] : x[0]; }); }
  root.Food = {
    meibutsu: function (pref, lang) { return pick(M[pref], lang); },
    region: function (pref, lang) { var r = REGION[pref]; return r && lang === 'en' ? REGION_EN[r] : r; },
    seasonal: function (pref, month, lang) {
      var r = REGION[pref]; if (!r) return null;
      var k = seasonOf(month);
      return { region: lang === 'en' ? REGION_EN[r] : r, season: lang === 'en' ? SEASON_EN[k] : SEASON_JA[k], items: pick(S[r][k], lang) };
    }
  };
})(typeof window !== 'undefined' ? window : this);
