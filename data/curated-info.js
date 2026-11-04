/*
 * 厳選スポットの確認済み情報（仕様書v2.0 07）
 *   ・各スポットの公式サイト（または自治体・観光協会）で確認できた内容だけを書く。
 *   ・確認できなかった項目は書かない（空欄のまま。画面では「公式サイトでご確認ください」と表示）。
 *   ・参拝時間などは変わることがあるため、checked（最終確認日）を必ず書く。
 *   ・wikidata の番号で全国データのスポットと結びつける。
 * 項目：name（確認用）、official（公式サイト）、address（所在地）、hours（参拝・開門時間）、fee（料金）、
 *       access（交通の目安）、deities（御祭神）、notes（補足）、sources（確認した公式ページ）、checked（最終確認日）
 */
var CURATED_INFO = {
  Q287165: {
    name: '明治神宮', official: 'https://www.meijijingu.or.jp/',
    address: '東京都渋谷区代々木神園町1-1',
    hours: '日の出に開門し、日の入りに合わせて閉門（月ごとに変わります。例：11月は6時10分～16時10分、12月は6時40分～16時00分）',
    access: '原宿口（南口）：JR原宿駅・東京メトロ明治神宮前〈原宿〉駅から徒歩1分。各入口から御本殿まで約10分',
    deities: ['明治天皇', '昭憲皇太后'],
    notes: '御苑は別に開苑時間があります（3〜10月 9時〜16時30分、11〜2月 9時〜16時）',
    sources: [['ご参拝の方へ（公式）', 'https://www.meijijingu.or.jp/sanpai/2.php'], ['明治神宮御苑（公式）', 'https://www.meijijingu.or.jp/midokoro/gyoen/']],
    checked: '2026-11-04'
  },
  Q696362: {
    name: '出雲大社', official: 'https://izumooyashiro.or.jp/',
    address: '島根県出雲市大社町杵築東195',
    hours: '午前6時〜午後7時（御本殿の裏側の区域は午後4時30分に閉鎖。素鵞社のお砂取りは午後4時30分まで）',
    access: 'JR出雲市駅から一畑バス［出雲大社・日御碕・宇竜行き］で25分',
    deities: ['大国主大神'],
    sources: [['参拝時間等について（公式）', 'https://izumooyashiro.or.jp/archives/news/12552'], ['交通アクセス（公式）', 'https://izumooyashiro.or.jp/access']],
    checked: '2026-11-04'
  },
  Q687168: {
    name: '伊勢神宮 内宮（皇大神宮）', official: 'https://www.isejingu.or.jp/',
    address: '三重県伊勢市宇治館町1',
    hours: '1〜4月・9月：午前5時〜午後6時／5〜8月：午前5時〜午後7時／10〜12月：午前5時〜午後5時（お正月は変更あり）',
    access: '三重交通の路線バス（51系統・55系統）など。外宮からはバス・タクシーで約10分',
    notes: 'お参りは外宮から内宮の順がならわしとされています。宇治橋から正宮まで約20分',
    sources: [['ご参拝・ご祈祷（公式）', 'https://www.isejingu.or.jp/visit/'], ['交通アクセス（公式）', 'https://www.isejingu.or.jp/access/'], ['よくあるご質問（公式）', 'https://www.isejingu.or.jp/qa/']],
    checked: '2026-11-04'
  },
  Q714828: {
    name: '伏見稲荷大社', official: 'https://inari.jp/',
    address: '京都府京都市伏見区深草薮之内町68',
    access: 'JR奈良線 稲荷駅下車すぐ（京都駅から5分）／京阪本線 伏見稲荷駅から東へ徒歩5分',
    notes: '12月30日〜1月6日は境内の駐車場が閉鎖されます。公共交通機関の利用が案内されています',
    sources: [['交通アクセス（公式）', 'https://inari.jp/access/'], ['伏見稲荷大社とは（公式）', 'https://inari.jp/about/']],
    checked: '2026-11-04'
  },
  Q191763: {
    name: '嚴島神社', official: 'https://www.itsukushimajinja.jp/',
    address: '広島県廿日市市宮島町1-1',
    hours: '1月4日〜2月末：6時30分〜17時30分／3月1日〜10月14日：6時30分〜18時00分／10月15日〜11月30日：6時30分〜17時30分／12月：6時30分〜17時00分（1月1日〜3日は別）',
    fee: '社殿への昇殿料が必要です（金額は公式サイトでご確認ください）',
    access: 'JR広島駅からJR山陽本線で宮島口駅まで約30分、宮島口桟橋からフェリーで約10分',
    deities: ['市杵島姫命', '田心姫命', '湍津姫命'],
    sources: [['御由緒・拝観（公式）', 'https://www.itsukushimajinja.jp/jp-sp/admission.html'], ['アクセス（公式・英語）', 'https://www.itsukushimajinja.jp/en-sp/access.html']],
    checked: '2026-11-04'
  },
  Q710786: {
    name: '太宰府天満宮', official: 'https://www.dazaifutenmangu.or.jp/',
    address: '福岡県太宰府市宰府4-7-1',
    hours: '開門：春分の日から6時00分、秋分の日から6時30分／閉門：4〜5月・9〜11月 19時00分、6〜8月 19時30分、12〜3月 18時30分',
    access: '西鉄太宰府駅から徒歩約5分',
    deities: ['菅原道真公'],
    sources: [['太宰府天満宮（公式）', 'https://sp.dazaifutenmangu.or.jp/'], ['アクセス（公式）', 'https://www.dazaifutenmangu.or.jp/tw/plan/getting-to-dazaifu-tenmangu/']],
    checked: '2026-11-04'
  },
  Q706499: {
    name: '鹿島神宮', official: 'https://kashimajingu.jp/',
    address: '茨城県鹿嶋市宮中2306-1',
    hours: '境内は門や柵がないため、いつでも参拝できます（授与所・御祈祷受付は8時30分〜16時30分）',
    access: 'JR鹿島線・鹿島臨海鉄道 鹿島神宮駅から徒歩7分／東京駅八重洲南口から高速バス「かしま号」で約2時間',
    deities: ['武甕槌大神'],
    sources: [['よくあるご質問（公式）', 'https://kashimajingu.jp/info/%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E3%81%94%E8%B3%AA%E5%95%8F/'], ['アクセス・駐車場（公式）', 'https://kashimajingu.jp/info/%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%BB%E9%A7%90%E8%BB%8A%E5%A0%B4/']],
    checked: '2026-11-04'
  },
  Q714559: {
    name: '春日大社', official: 'https://www.kasugataisha.or.jp/',
    address: '奈良県奈良市春日野町160',
    hours: '一般参拝：3〜10月 6時30分〜17時30分、11〜2月 7時00分〜17時00分（御本殿特別参拝は9時〜16時）',
    fee: '御本殿特別参拝は拝観料700円（令和6年10月から）',
    access: 'JR奈良駅・近鉄奈良駅から奈良交通バス「春日大社本殿」行きで終点下車すぐ',
    sources: [['春日大社（公式）', 'https://www.kasugataisha.or.jp/'], ['General Information（公式・英語）', 'https://www.kasugataisha.or.jp/en/about_en/basic/'], ['御本殿特別参拝 拝観料改定（公式）', 'https://www.kasugataisha.or.jp/news/2024/13583/']],
    checked: '2026-11-04'
  }
};

if (typeof module !== 'undefined') module.exports = { CURATED_INFO: CURATED_INFO };
