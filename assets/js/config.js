/*
 * 推薦エンジンの設定ファイル
 * 重み（点数配分）や交通手段ごとの距離の目安はここだけ変更すれば反映されます。
 */
var APP_CONFIG = {
  version: '1.1.0',

  // 推薦スコアの配分（合計100点満点になるようにしています）
  weights: {
    numerology: 30,   // 数秘ナンバーとスポットのテーマが一致
    wish: 40,         // 選んだ願い・体験との一致（一致した割合で按分）
    distance: 20,     // 出発地からの近さ（交通手段の目安距離で按分）
    reliability: 10   // データの確認状態（verified=満点 / unverified=半分 / demo=0）
  },

  // 交通手段ごとの「近い」と見なす直線距離の目安（km）
  // ※実際の所要時間ではありません。正確な経路データが入るまでは概算扱い。
  travelModes: {
    walk:    { label: '徒歩',     rangeKm: 8,   gmaps: 'walking' },
    transit: { label: '公共交通', rangeKm: 600, gmaps: 'transit' },
    car:     { label: '車',       rangeKm: 400, gmaps: 'driving' }
  },

  // 診断結果に表示する件数
  resultCount: 5,

  // 推薦から外す状態
  excludeAccessStatus: ['closed', 'restricted'],
  publicStatus: 'public'
};

if (typeof module !== 'undefined') module.exports = APP_CONFIG;
