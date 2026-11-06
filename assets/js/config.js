/*
 * 推薦エンジンの設定ファイル
 * 重み（点数配分）や交通手段ごとの距離の目安はここだけ変更すれば反映されます。
 */
var APP_CONFIG = {
  version: '3.12.2',

  // 推薦スコアの配分（合計100点。仕様書v2.0「おすすめ順位の設計」を元に、数秘を残して調整）
  //   入力していない項目（願いを選んでいない、出かける日が未定など）は、架空の点を付けずに
  //   残りの項目だけで100点満点に換算する（＝その項目の配分を、ほかの項目に割合で振り分ける）。
  weights: {
    wish: 30,         // 願いごととの一致（一致した割合で按分）
    kyusei: 20,       // 九星気学の方位（年盤・月盤）。出かける日が未定のときは今月の盤で判定
    day: 15,          // 訪問日の方位（日盤）。出かける日を入れたときだけ
    distance: 15,     // アクセスの現実性。所要時間を指定したら時間内はすべて満点、指定なしなら近いほど高い
    numerology: 10,   // 数秘ナンバーとスポットのテーマが一致（一緒に行く人がいるときは一致した人数で按分）
    fame: 7,          // データの充実度：知名度の目安（Wikipedia・Wikidata・文化財・社格など）
    reliability: 3    // データの充実度：確認状態（verified=満点 / unverified=半分 / demo=0）
  },
  fameFull: 120,      // この優先度で知名度が満点になる


  // 九星気学：盤ごとの重み（合計1）と、判定ごとの点数の割合
  kyusei: {
    boardWeights: { year: 0.45, month: 0.55 },   // 年盤・月盤の割合（日盤は weights.day で別に採点）
    levelRatio: { best: 1, good: 0.6, normal: 0.25, kyo: 0 },
    edgeWarnDeg: 3     // 方位の区切り線からこの角度以内なら「境界付近」と表示
  },


  // 交通手段ごとの所要時間の推計に使う数値（実際の経路検索ではありません）
  //   detour       … 直線距離に掛ける迂回係数（道のりは直線より長い）
  //   localKm      … 一般道・在来線などで走る最初の距離（km）
  //   localSpeedKmh… その区間の平均時速
  //   longSpeedKmh … それより先（高速道路・新幹線・特急など）の平均時速
  //   overheadMin  … 乗り継ぎ・待ち時間・駐車などの上乗せ（分）
  //   refMinutes   … 時間の指定がないとき「近さ」の点数がゼロになる時間（分）
  travelModes: {
    walk:    { label: '徒歩',     detour: 1.3, localKm: 9999, localSpeedKmh: 4,  longSpeedKmh: 4,   overheadMin: 0,  refMinutes: 120, gmaps: 'walking' },
    transit: { label: '公共交通', detour: 1.3, localKm: 40,   localSpeedKmh: 30, longSpeedKmh: 130, overheadMin: 30, refMinutes: 480, gmaps: 'transit' },
    car:     { label: '車',       detour: 1.3, localKm: 20,   localSpeedKmh: 30, longSpeedKmh: 80,  overheadMin: 10, refMinutes: 420, gmaps: 'driving' },
    bike:    { label: '自転車',   detour: 1.3, localKm: 9999, localSpeedKmh: 15, longSpeedKmh: 15, overheadMin: 5,  refMinutes: 180, gmaps: 'bicycling' }
  },

  // 「◯時間以内」の選択肢（分）
  timeLimits: [30, 60, 90, 120, 180, 240, 300, 480],

  // 方角の計算方法
  //   'greatCircle' … 地球を球として、出発地から目的地へ向かう最短コースの向き（初期方位角）
  //   'rhumb'       … メルカトル地図上で2点を直線で結んだ向き（等角航路）
  // どちらも真北が基準です。近い場所ではほぼ同じ、数百km離れると数度ずれます。
  bearingMethod: 'greatCircle',

  // 住所検索（国土地理院の住所検索。無料・登録不要。提供の継続は保証されていません）
  geocoder: {
    url: 'https://msearch.gsi.go.jp/address-search/AddressSearch?q=',
    timeoutMs: 8000,
    maxCandidates: 5
  },

  // 投稿の受付先（v3.12からLINE公式アカウント。GitHubのフォームに戻す場合は issues/new?template=spot-add.yml などに書き換える）
  reportForms: {
    add: 'https://lin.ee/wHX3skr3',
    fix: 'https://lin.ee/wHX3skr3'
  },

  // 公開しているURL（シェアで送るリンク）
  siteUrl: 'https://motonory-a.github.io/japan-power-spots/',
  shareText: '次のお休み、どこに行こうか？運命の聖地を簡単検索。生年月日とお住まいから、あなたにぴったりの聖地を探せるサイト『開運パワースポット巡り』',

  // トップの「願いごとから探す」（仕様書v2.0の8分類）。
  // 押すと、診断フォームの「三 願い・体験」で wishes の項目が選ばれた状態になる。
  wishCategories: [
    { label: '恋愛・結婚', wishes: ['恋愛・縁結び'] },
    { label: '金運', wishes: ['金運', '商売繁盛'] },
    { label: '仕事', wishes: ['仕事・出世'] },
    { label: '健康祈願', wishes: ['健康祈願'] },
    { label: '厄除け', wishes: ['厄除け'] },
    { label: '癒やし', wishes: ['浄化', '自然', '森林'] },
    { label: '人生の転機', wishes: ['開運'] },
    { label: '総合運', wishes: ['開運', '家内安全'] }
  ],

  // 診断結果に表示する件数
  resultCount: 5,
  // おすすめ同士をこの距離（km）以上はなす（同じ場所に固めない）
  spreadKm: 5,

  // 推薦から外す状態
  excludeAccessStatus: ['closed', 'restricted'],
  publicStatus: 'public'
};

if (typeof module !== 'undefined') module.exports = APP_CONFIG;
