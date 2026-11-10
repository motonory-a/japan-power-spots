/*
 * English edition: words and translations (英語版の訳語)
 *   The Japanese data files are shared with the Japanese site. This file only maps them to English.
 *   日本語のデータはそのまま使い、表示だけ英語にする。訳を直すときはここだけ直す。
 */
var EN = {
  prefectures: {
    '01': 'Hokkaido', '02': 'Aomori', '03': 'Iwate', '04': 'Miyagi', '05': 'Akita', '06': 'Yamagata', '07': 'Fukushima',
    '08': 'Ibaraki', '09': 'Tochigi', '10': 'Gunma', '11': 'Saitama', '12': 'Chiba', '13': 'Tokyo', '14': 'Kanagawa',
    '15': 'Niigata', '16': 'Toyama', '17': 'Ishikawa', '18': 'Fukui', '19': 'Yamanashi', '20': 'Nagano', '21': 'Gifu',
    '22': 'Shizuoka', '23': 'Aichi', '24': 'Mie', '25': 'Shiga', '26': 'Kyoto', '27': 'Osaka', '28': 'Hyogo',
    '29': 'Nara', '30': 'Wakayama', '31': 'Tottori', '32': 'Shimane', '33': 'Okayama', '34': 'Hiroshima', '35': 'Yamaguchi',
    '36': 'Tokushima', '37': 'Kagawa', '38': 'Ehime', '39': 'Kochi', '40': 'Fukuoka', '41': 'Saga', '42': 'Nagasaki',
    '43': 'Kumamoto', '44': 'Oita', '45': 'Miyazaki', '46': 'Kagoshima', '47': 'Okinawa'
  },

  categories: {
    '神社': 'Shinto shrine', '寺院': 'Buddhist temple', '滝': 'Waterfall', '山': 'Sacred mountain', '湧水': 'Sacred spring',
    '温泉': 'Hot spring', '巨木': 'Sacred giant tree', '岩・磐座': 'Sacred rock', '洞窟': 'Cave', '絶景': 'Scenic viewpoint',
    '湖': 'Lake', '祠': 'Small shrine'
  },

  // Keys are the Japanese wish keys used in the data (WISH_OPTIONS)
  wishes: {
    '恋愛・縁結び': 'Love & good relationships', '金運': 'Money luck', '商売繁盛': 'Business success', '仕事・出世': 'Career success',
    '学業・合格': 'Study & exams', '勝負運': 'Winning luck', '開運': 'Good fortune', '厄除け': 'Protection from bad luck',
    '健康祈願': 'Health', '安産・子宝': 'Fertility & safe birth', '家内安全': 'Family safety', '交通安全': 'Safe travel',
    '芸事上達': 'Arts & talent', '美容': 'Beauty',
    '浄化': 'Purification', '自然': 'Nature', '森林': 'Sacred forest', '御神木・巨木': 'Sacred trees', '滝': 'Waterfalls',
    '登山': 'Mountain hiking', '海・島': 'Sea & islands', '湖・湧水': 'Lakes & springs', '岩・磐座': 'Sacred rocks', '洞窟': 'Caves',
    '絶景': 'Great views', '巡礼': 'Pilgrimage', '温泉': 'Hot springs', '神社': 'Shrines', '寺院': 'Temples', '霊山': 'Holy mountains'
  },

  // Big tiles at the top (same 8 groups as the Japanese site)
  wishTiles: [
    { label: 'Love & Marriage', icon: '💗', wishes: ['恋愛・縁結び'] },
    { label: 'Money & Prosperity', icon: '💰', wishes: ['金運', '商売繁盛'] },
    { label: 'Career & Success', icon: '🏔', wishes: ['仕事・出世'] },
    { label: 'Health', icon: '🌿', wishes: ['健康祈願'] },
    { label: 'Protection', icon: '🛡', wishes: ['厄除け'] },
    { label: 'Healing & Nature', icon: '💧', wishes: ['浄化', '自然', '森林'] },
    { label: 'A New Start', icon: '🌅', wishes: ['開運'] },
    { label: 'Overall Good Luck', icon: '✨', wishes: ['開運', '家内安全'] }
  ],

  // Chips in the finder
  wishChips: ['恋愛・縁結び', '金運', '商売繁盛', '仕事・出世', '学業・合格', '勝負運', '開運', '厄除け', '健康祈願', '安産・子宝', '家内安全', '交通安全', '芸事上達', '美容'],
  expChips: ['浄化', '森林', '御神木・巨木', '滝', '霊山', '登山', '海・島', '湖・湧水', '岩・磐座', '絶景', '巡礼', '温泉', '神社', '寺院'],

  modes: {
    transit: { label: 'Train & bus', icon: '🚆' },
    car: { label: 'Car / taxi', icon: '🚗' },
    walk: { label: 'Walking', icon: '🚶' },
    bike: { label: 'Bicycle', icon: '🚲' }
  },

  // Where visitors usually stay (approximate center / main station)
  cities: [
    { key: 'tokyo', label: 'Tokyo (Tokyo Station)', lat: 35.6812, lon: 139.7671 },
    { key: 'shinjuku', label: 'Tokyo (Shinjuku / Shibuya)', lat: 35.6896, lon: 139.7006 },
    { key: 'asakusa', label: 'Tokyo (Asakusa / Ueno)', lat: 35.7100, lon: 139.7800 },
    { key: 'yokohama', label: 'Yokohama', lat: 35.4658, lon: 139.6223 },
    { key: 'kamakura', label: 'Kamakura', lat: 35.3190, lon: 139.5505 },
    { key: 'hakone', label: 'Hakone', lat: 35.2324, lon: 139.1069 },
    { key: 'fuji', label: 'Mt. Fuji area (Kawaguchiko)', lat: 35.4985, lon: 138.7686 },
    { key: 'nikko', label: 'Nikko', lat: 36.7500, lon: 139.6195 },
    { key: 'narita', label: 'Narita Airport area', lat: 35.7720, lon: 140.3929 },
    { key: 'kyoto', label: 'Kyoto (Kyoto Station)', lat: 34.9858, lon: 135.7588 },
    { key: 'kyoto-gion', label: 'Kyoto (Gion / Kawaramachi)', lat: 35.0037, lon: 135.7726 },
    { key: 'osaka', label: 'Osaka (Namba)', lat: 34.6661, lon: 135.5010 },
    { key: 'umeda', label: 'Osaka (Umeda / Osaka Station)', lat: 34.7025, lon: 135.4959 },
    { key: 'nara', label: 'Nara', lat: 34.6851, lon: 135.8050 },
    { key: 'kobe', label: 'Kobe', lat: 34.6946, lon: 135.1956 },
    { key: 'koyasan', label: 'Koyasan', lat: 34.2131, lon: 135.5845 },
    { key: 'ise', label: 'Ise', lat: 34.4875, lon: 136.7091 },
    { key: 'nagoya', label: 'Nagoya', lat: 35.1709, lon: 136.8815 },
    { key: 'takayama', label: 'Takayama', lat: 36.1410, lon: 137.2516 },
    { key: 'kanazawa', label: 'Kanazawa', lat: 36.5780, lon: 136.6480 },
    { key: 'nagano', label: 'Nagano', lat: 36.6431, lon: 138.1886 },
    { key: 'hiroshima', label: 'Hiroshima', lat: 34.3978, lon: 132.4752 },
    { key: 'miyajima', label: 'Miyajima', lat: 34.2960, lon: 132.3198 },
    { key: 'izumo', label: 'Izumo / Matsue', lat: 35.3670, lon: 132.7550 },
    { key: 'fukuoka', label: 'Fukuoka (Hakata)', lat: 33.5902, lon: 130.4207 },
    { key: 'nagasaki', label: 'Nagasaki', lat: 32.7522, lon: 129.8700 },
    { key: 'kagoshima', label: 'Kagoshima', lat: 31.5841, lon: 130.5420 },
    { key: 'sendai', label: 'Sendai', lat: 38.2601, lon: 140.8822 },
    { key: 'sapporo', label: 'Sapporo', lat: 43.0687, lon: 141.3508 },
    { key: 'naha', label: 'Okinawa (Naha)', lat: 26.2124, lon: 127.6792 }
  ],

  // 方位
  palaces: { '北': 'North', '北東': 'Northeast', '東': 'East', '南東': 'Southeast', '南': 'South', '南西': 'Southwest', '西': 'West', '北西': 'Northwest' },

  // Nine Star Ki (九星)
  stars: ['', '1 White Water', '2 Black Earth', '3 Jade Wood', '4 Green Wood', '5 Yellow Earth', '6 White Metal', '7 Red Metal', '8 White Earth', '9 Purple Fire'],
  starNature: ['',
    'Traditionally linked with water: calm, flexible and a deep thinker.',
    'Traditionally linked with the earth: caring, steady and supportive.',
    'Traditionally linked with thunder and spring: lively, quick to start, full of ideas.',
    'Traditionally linked with the wind: gentle, harmonious, good at connecting people.',
    'The star of the center: strong-willed, with a big presence.',
    'Traditionally linked with heaven: principled, responsible, a natural leader.',
    'Traditionally linked with the lake: sociable, charming, enjoys life.',
    'Traditionally linked with the mountain: patient and good at turning points.',
    'Traditionally linked with fire: bright, intuitive and expressive.'
  ],

  // Life path numbers (数秘)
  numerology: ['',
    'new beginnings and leadership', 'harmony and partnership', 'creativity and joy', 'stability and foundations',
    'freedom and change', 'love and care', 'inner wisdom and the spiritual', 'abundance and achievement', 'compassion and completion'
  ],

  // Direction judgement marks from diagnosis.js
  fortune: {
    '◎': { text: 'Very auspicious direction', cls: 'good' },
    '○': { text: 'Auspicious direction', cls: 'good' },
    '―': { text: 'Neutral direction', cls: 'neutral' },
    '△': { text: 'Fine for the year and month, but not on this day', cls: 'warn' },
    '×': { text: 'Not a lucky direction for you right now', cls: 'bad' }
  },

  regions: {
    '北海道・東北': 'Hokkaido & Tohoku', '関東': 'Tokyo & Kanto', '中部': 'Mt. Fuji, Nagoya & Central Japan',
    '近畿': 'Kyoto, Osaka & Nara', '中国・四国': 'Hiroshima, Izumo & Shikoku', '九州・沖縄': 'Kyushu & Okinawa'
  },

  // Model routes (data/model-courses.js) by id
  courses: {
    'sapporo': ['Sapporo shrine walk', 'A half-day route around Hokkaido Jingu in Maruyama, Sapporo.'],
    'matsushima': ['Shiogama & Matsushima', 'From Shiogama Shrine to the temples along beautiful Matsushima Bay.'],
    'sendai': ['Sendai shrines & temples', 'Osaki Hachimangu, Sendai Toshogu and the old provincial temple.'],
    'hiraizumi': ['Hiraizumi World Heritage', 'Chusonji and Motsuji, the golden legacy of the northern Fujiwara.'],
    'hirosaki': ['Hirosaki & Mt. Iwaki', 'From Hirosaki town to the shrine at the foot of Mt. Iwaki.'],
    'asakusa': ['Asakusa to Kanda', 'Old Tokyo on foot and by train: Sensoji, Ueno, Yushima and Kanda Myojin.'],
    'tokyo-center': ['Central Tokyo shrines & temples', 'Harajuku to Iidabashi and Shiba: Meiji Jingu, Tokyo Daijingu and Zojoji.'],
    'kamakura': ['Kamakura Zen temples', 'From Kita-Kamakura to Hase: Engakuji, Kenchoji, Tsurugaoka Hachimangu and the Great Buddha.'],
    'nikko': ['Nikko & Lake Chuzenji', 'The World Heritage shrines of Nikko, then up the Irohazaka road to Lake Chuzenji.'],
    'kawagoe': ['Kawagoe "Little Edo"', 'Kitain temple and the shrines around it in the old merchant town.'],
    'omiya': ['Hikawa Shrine & Tsuki Shrine', 'Two old shrines in Saitama, an easy trip from Tokyo.'],
    'togoku': ['Kashima, Katori & Naritasan', 'Two ancient warrior shrines and the great temple of Narita.'],
    'ibaraki': ['Mito, Oarai & Kasama', 'Tokiwa Shrine, the seaside torii of Oarai and Kasama Inari.'],
    'fuji-shizuoka': ['Mt. Fuji: southern shrines', 'Fujisan Hongu Sengen Taisha and the older Sengen shrines of Fujinomiya.'],
    'fuji-yamanashi': ['Mt. Fuji: Five Lakes shrines', 'Sengen shrines of Fujiyoshida and Kawaguchiko, and quiet Lake Sai.'],
    'suwa': ['Suwa Taisha', 'The upper and lower shrines of Suwa Taisha around Lake Suwa.'],
    'nagoya': ['Nagoya: Atsuta & Kannon temples', 'Atsuta Jingu, Osu Kannon and Kasadera Kannon.'],
    'kanazawa': ['Kanazawa shrines & the Ninja Temple', 'Oyama Shrine, Ishiura Shrine and Myoryuji in the city center.'],
    'kofu': ['Kofu shrines & temples', 'Takeda Shrine and Kai Zenkoji in Yamanashi.'],
    'ise': ['Ise Jingu pilgrimage', 'From the wedded rocks of Futami to the Outer and Inner Shrines of Ise.'],
    'kyoto-higashiyama': ['Kyoto: Higashiyama to Fushimi', 'Ginkakuji, Heian Shrine and Kiyomizudera, ending at Fushimi Inari.'],
    'kyoto-north': ['Kyoto: north and Kinugasa', 'Kamigamo and Shimogamo Shrines, then Kinkakuji and Ninnaji.'],
    'arashiyama': ['Arashiyama to Kyoto Station', 'Tenryuji and Togetsukyo Bridge, then Nishi Honganji and Toji.'],
    'uji': ['Uji: Byodoin & Ujigami', 'Byodoin and Ujigami Shrine on either side of the Uji River.'],
    'nara-park': ['Nara Park temples & shrines', 'Todaiji, Kasuga Taisha, Kofukuji and Gangoji.'],
    'nara-west': ['Nishinokyo to Ikaruga', 'Toshodaiji and Yakushiji, then Horyuji and Hokiji.'],
    'osaka': ['Osaka: Tenmangu to Sumiyoshi', 'North to south through the great shrines and temples of Osaka.'],
    'kobe': ['Kobe: Ikuta Shrine to Suma', 'From Ikuta Shrine in Sannomiya to Nagata Shrine and Sumadera.'],
    'otsu': ['Otsu & Lake Biwa', 'Hiyoshi Taisha, Miidera, Takebe Taisha and Ishiyamadera.'],
    'koyasan': ['Koyasan and its foothills', 'From Kudoyama through Amano up to Kongobuji and Okunoin.'],
    'kumano': ['Kumano: Hayatama & Nachi', 'Kumano Hayatama Taisha, then Kumano Nachi Taisha and Seigantoji.'],
    'izumo': ['Izumo Taisha & Hinomisaki', 'Izumo Taisha, then the seaside Hinomisaki Shrine.'],
    'matsue': ['Matsue ancient shrines', 'Kamosu, Sada and Tamatsukuriyu Shrines.'],
    'miyajima': ['Miyajima & Hatsukaichi', 'Itsukushima Shrine and Daishoin, and Hayatani Shrine across the water.'],
    'okayama': ['Okayama: Kibitsu & Saijo Inari', 'Kibitsu Shrine, Saijo Inari and Hofukuji.'],
    'shimonoseki': ['Shimonoseki shrines & temples', 'Akama Jingu on the Kanmon Strait, Kozanji, Sumiyoshi and Imi Shrines.'],
    'kotohira': ['Konpira-san & Zentsuji', 'Kotohiragu on the mountain, then Zentsuji and Iyadaniji.'],
    'matsuyama': ['Matsuyama & Dogo Onsen', 'Isaniwa, Yu Shrine and Ishiteji near Dogo Onsen, and Taisanji.'],
    'kochi': ['Kochi: Tosa Shrine & pilgrim temples', 'Tosa Shrine and three temples of the Shikoku pilgrimage.'],
    'dazaifu': ['Dazaifu & Fukuoka', 'Dazaifu Tenmangu and Kanzeonji, then Kashiigu and Hakozakigu.'],
    'nagasaki': ['Nagasaki shrines & temples', 'Suwa Shrine, Kofukuji, Sofukuji and Sanno Shrine with its surviving camphor trees.'],
    'kumamoto': ['Kumamoto shrines', 'Fujisaki Hachimangu, Kitaoka Shrine and Izumi Shrine.'],
    'miyazaki': ['Miyazaki: Nichinan coast', 'Aoshima Shrine on its island, then Udo Jingu in a sea cave.'],
    'kirishima': ['Kirishima & Kagoshima Jingu', 'Kirishima Jingu below the mountains, then Kagoshima Jingu.'],
    'kagoshima': ['Kagoshima city shrines', 'Terukuni, Nanshu and Arata Hachimangu.'],
    'naha': ['Naha shrines', 'Naminoue-gu on the cliff, Gokokuji, Sueyoshi-gu and Shikina-gu.']
  }
};
if (typeof module !== 'undefined') module.exports = EN;

// English names checked by hand (used before Wikidata labels). Model-route stops and other famous places.
// 英語名（手入力）。Wikidataの英語名より優先する
EN.names = {
  Q710826: 'Hokkaido Jingu', Q21654596: 'Hokkaido Jingu Tongu', Q11521150: 'Sapporo Fushimi Inari Shrine', Q133753: 'Shiogama Shrine',
  Q3140498: 'Zuiganji Temple', Q3055370: 'Entsuin Temple', Q11372280: 'Godaido Hall', Q874428: 'Osaki Hachimangu Shrine',
  Q115768: 'Sendai Toshogu Shrine', Q1101060: 'Mutsu Kokubunji Yakushido', Q2660144: 'Chusonji Temple', Q11648027: 'Mt. Kinkei',
  Q975227: 'Motsuji Temple', Q11248572: 'Saishoin Temple', Q106967916: 'Hirosaki Hachimangu Shrine', Q871375: 'Iwakiyama Shrine',
  Q615183: 'Sensoji Temple', Q670049: 'Asakusa Shrine', Q708550: 'Ueno Toshogu Shrine', Q335606: 'Yushima Tenmangu Shrine',
  Q717682: 'Kanda Myojin Shrine', Q287165: 'Meiji Jingu Shrine', Q11524717: 'Tokyo Daijingu Shrine', Q11614619: 'Shiba Daijingu Shrine',
  Q249139: 'Zojoji Temple', Q954860: 'Engakuji Temple', Q1396078: 'Kenchoji Temple', Q701403: 'Tsurugaoka Hachimangu Shrine',
  Q672056: 'Kotokuin (Great Buddha of Kamakura)', Q1034293: 'Hasedera Temple', Q1348249: 'Rinnoji Temple', Q696641: 'Nikko Toshogu Shrine',
  Q2480885: 'Taiyuinbyo Mausoleum', Q701927: 'Nikko Futarasan Shrine', Q11366837: 'Chuzenji Temple (Tachiki Kannon)',
  Q3080561: 'Kitain Temple', Q11378135: 'Senba Toshogu Shrine', Q11367810: 'Nakain Temple', Q11509531: 'Senba Hie Shrine',
  Q703633: 'Hikawa Shrine (Omiya)', Q11631781: 'Tsuki Shrine', Q706499: 'Kashima Jingu Shrine', Q372380: 'Katori Jingu Shrine',
  Q3083875: 'Naritasan Shinshoji Temple', Q3530470: 'Tokiwa Shrine', Q11437230: 'Oarai Isosaki Shrine', Q704876: 'Kasama Inari Shrine',
  Q653180: 'Fujisan Hongu Sengen Taisha', Q11467749: 'Yamamiya Sengen Shrine', Q11523143: 'Murayama Sengen Shrine',
  Q11401286: 'Kitaguchi Hongu Fuji Sengen Shrine', Q11553669: 'Kawaguchi Sengen Shrine', Q11395081: 'Fuji Omuro Sengen Shrine', Q1152394: 'Lake Sai',
  Q218813: 'Suwa Taisha Kamisha Honmiya', Q135194091: 'Suwa Taisha Kamisha Maemiya', Q135194093: 'Suwa Taisha Shimosha Harumiya',
  Q3594052: 'Osu Kannon Temple', Q482065: 'Atsuta Jingu Shrine', Q3193655: 'Kasadera Kannon Temple', Q998709: 'Oyama Shrine',
  Q11586806: 'Ishiura Shrine', Q3342007: 'Myoryuji (Ninja Temple)', Q402368: 'Takeda Shrine', Q6446634: 'Kai Zenkoji Temple',
  Q11597204: 'Anakiri Daijinja Shrine', Q64969614: 'Futami Okitama Shrine (Wedded Rocks)', Q11633343: 'Ise Jingu Outer Shrine (Geku)',
  Q11572141: 'Sarutahiko Shrine', Q687168: 'Ise Jingu Inner Shrine (Naiku)', Q257473: 'Ginkakuji (Silver Pavilion)', Q385141: 'Heian Shrine',
  Q221716: 'Kiyomizudera Temple', Q714828: 'Fushimi Inari Taisha', Q700448: 'Kamigamo Shrine', Q701620: 'Shimogamo Shrine',
  Q270983: 'Kinkakuji (Golden Pavilion)', Q1202871: 'Ninnaji Temple', Q1759226: 'Tenryuji Temple', Q11561923: 'Togetsukyo Bridge',
  Q1146038: 'Nishi Honganji Temple', Q1046403: 'Toji Temple', Q61094: 'Byodoin Temple', Q583589: 'Ujigami Shrine',
  Q460367: 'Todaiji Temple', Q714559: 'Kasuga Taisha Shrine', Q1070863: 'Kofukuji Temple', Q1203099: 'Gangoji Temple',
  Q973175: 'Toshodaiji Temple', Q945913: 'Yakushiji Temple', Q261932: 'Horyuji Temple', Q1351209: 'Hokiji Temple',
  Q385793: 'Osaka Tenmangu Shrine', Q339859: 'Shitennoji Temple', Q705949: 'Sumiyoshi Taisha Shrine', Q710086: 'Ikuta Shrine',
  Q661395: 'Nagata Shrine', Q11664679: 'Sumadera Temple', Q656451: 'Hiyoshi Taisha Shrine', Q1756307: 'Miidera Temple',
  Q403338: 'Takebe Taisha Shrine', Q1082791: 'Ishiyamadera Temple', Q3179279: 'Jisonin Temple', Q3342246: 'Nyu Kanshofu Shrine',
  Q705154: 'Nyutsuhime Shrine', Q1203429: 'Kongobuji Temple', Q4333366: 'Okunoin (Koyasan)', Q335618: 'Kumano Hayatama Taisha',
  Q2585020: 'Fudarakusanji Temple', Q710359: 'Kumano Nachi Taisha', Q1476235: 'Seigantoji Temple', Q696362: 'Izumo Taisha',
  Q1619446: 'Hinomisaki Shrine', Q3461072: 'Sada Shrine', Q3192477: 'Kamosu Shrine', Q11572397: 'Tamatsukuriyu Shrine',
  Q11639721: 'Hayatani Shrine', Q191763: 'Itsukushima Shrine', Q3012169: 'Daishoin Temple', Q712824: 'Kibitsu Shrine',
  Q11515459: 'Saijo Inari (Myokyoji)', Q11452660: 'Hofukuji Temple', Q712617: 'Akama Jingu Shrine', Q1088510: 'Kozanji Temple',
  Q11381858: 'Sumiyoshi Shrine (Shimonoseki)', Q11490717: 'Imi Shrine', Q94760: 'Kotohiragu (Konpira-san)', Q787035: 'Zentsuji Temple',
  Q11487478: 'Iyadaniji Temple', Q3155126: 'Isaniwa Shrine', Q11563773: 'Yu Shrine', Q3155277: 'Ishiteji Temple',
  Q3514066: 'Taisanji Temple', Q704890: 'Tosa Shrine', Q11418945: 'Zenrakuji Temple', Q426742: 'Chikurinji Temple',
  Q11591177: 'Zenjibuji Temple', Q710786: 'Dazaifu Tenmangu Shrine', Q3192777: 'Kanzeonji Temple', Q631373: 'Kashiigu Shrine',
  Q714742: 'Hakozakigu Shrine', Q211522: 'Sanno Shrine (Nagasaki)', Q84028: 'Suwa Shrine (Nagasaki)', Q93616: 'Kofukuji Temple (Nagasaki)',
  Q63208: 'Sofukuji Temple', Q167146: 'Fujisaki Hachimangu Shrine', Q11401505: 'Kitaoka Shrine', Q11395687: 'Izumi Shrine',
  Q2857985: 'Aoshima Shrine', Q704430: 'Udo Jingu Shrine', Q704622: 'Kirishima Jingu Shrine', Q704695: 'Kagoshima Jingu Shrine',
  Q704219: 'Terukuni Shrine', Q11408100: 'Nanshu Shrine', Q11618808: 'Arata Hachimangu Shrine', Q704636: 'Naminoue-gu Shrine',
  Q3109955: 'Gokokuji Temple (Naha)', Q11519653: 'Sueyoshi-gu Shrine', Q11632260: 'Shikina-gu Shrine'
};
