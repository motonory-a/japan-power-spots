/*
 * 診断ロジック（画面に依存しない計算だけをまとめたファイル）
 * ブラウザでは window.Diagnosis、Node.js のテストでは require() で読み込みます。
 *
 * 数秘ナンバーは現行版と同じ計算式（暫定ロジック）:
 *   生年月日 YYYYMMDD の各桁を足し、1桁になるまで足し続ける。
 *   11・22・33（マスターナンバー）は扱わず1桁まで還元する。
 * 九星気学は未実装です。ここの「方角」は地図上の向きを示すだけで、吉凶判定ではありません。
 */
(function (root) {
  'use strict';

  var NUMEROLOGY_MEANINGS = {
    1: '新しい一歩・挑戦', 2: '調和・ご縁', 3: '表現・創造', 4: '安定・内省', 5: '変化・探究',
    6: '思いやり・交流', 7: '探究・静寂', 8: '実行力・目標', 9: '感謝・広い視野'
  };

  var DIRECTIONS_8 = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];

  function digitSum(n) {
    return String(n).split('').reduce(function (a, c) { return a + Number(c); }, 0);
  }

  // 'YYYY-MM-DD' → 1〜9
  function lifePath(dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) throw new Error('日付の形式が正しくありません: ' + dateStr);
    var n = digitSum(dateStr.replace(/-/g, ''));
    while (n > 9) n = digitSum(n);
    return n;
  }

  // 生年月日のチェック。問題なければ null、あればメッセージを返す
  function validateBirthday(dateStr, today) {
    if (!dateStr) return '生年月日を入力してください。';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '生年月日の形式が正しくありません。';
    var p = dateStr.split('-').map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    if (d.getFullYear() !== p[0] || d.getMonth() !== p[1] - 1 || d.getDate() !== p[2]) return '存在しない日付です。';
    if (p[0] < 1900) return '1900年以降の日付を入力してください。';
    var t = today || new Date();
    var todayMid = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    if (d > todayMid) return '未来の日付は入力できません。';
    return null;
  }

  // 2点間の大圏距離（km）
  function distanceKm(lat1, lon1, lat2, lon2) {
    var r = Math.PI / 180;
    var dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
    var a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.pow(Math.sin(dLon / 2), 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // 出発地から目的地への初期方位角（真北=0°、時計回り、0〜360）
  function bearingDeg(lat1, lon1, lat2, lon2) {
    var r = Math.PI / 180;
    var y = Math.sin((lon2 - lon1) * r) * Math.cos(lat2 * r);
    var x = Math.cos(lat1 * r) * Math.sin(lat2 * r) - Math.sin(lat1 * r) * Math.cos(lat2 * r) * Math.cos((lon2 - lon1) * r);
    return (Math.atan2(y, x) / r + 360) % 360;
  }

  // 8方位（各45°、北は337.5°以上22.5°未満）。境界ちょうどは時計回り側に含める
  function direction8(deg) {
    return DIRECTIONS_8[Math.floor(((deg + 22.5) % 360) / 45)];
  }

  function isRecommendable(spot, cfg) {
    if (spot.publication_status !== cfg.publicStatus) return false;
    if (cfg.excludeAccessStatus.indexOf(spot.access_status) !== -1) return false;
    return true;
  }

  function reliabilityRatio(status) {
    if (status === 'verified') return 1;
    if (status === 'unverified') return 0.5;
    return 0; // demo など
  }

  /*
   * 推薦スコア計算
   * input = { number, origin:{lat,lon}, wishes:[], mode:'walk'|'transit'|'car' }
   * 戻り値は点数の内訳と根拠の文章を含む配列（スコア順）
   */
  function rankSpots(spots, input, cfg) {
    var w = cfg.weights;
    var mode = cfg.travelModes[input.mode] || cfg.travelModes.transit;
    var wishes = input.wishes || [];

    return spots.filter(function (s) { return isRecommendable(s, cfg); }).map(function (s) {
      var km = distanceKm(input.origin.lat, input.origin.lon, s.lat, s.lon);
      var deg = bearingDeg(input.origin.lat, input.origin.lon, s.lat, s.lon);
      var numMatch = s.numbers.indexOf(input.number) !== -1;
      var hitWishes = wishes.filter(function (k) { return s.wishes.indexOf(k) !== -1; });

      var parts = {
        numerology: numMatch ? w.numerology : 0,
        wish: wishes.length ? Math.round(w.wish * hitWishes.length / wishes.length) : 0,
        distance: Math.round(w.distance * Math.max(0, 1 - km / mode.rangeKm)),
        reliability: Math.round(w.reliability * reliabilityRatio(s.verification_status))
      };
      var total = parts.numerology + parts.wish + parts.distance + parts.reliability;

      var reasons = [];
      reasons.push(numMatch ? '数秘ナンバー' + input.number + 'のテーマと一致' : '数秘ナンバーとの一致なし');
      if (wishes.length) reasons.push(hitWishes.length ? '願い・体験：' + hitWishes.join('・') + 'が一致' : '選んだ願い・体験との一致なし');
      reasons.push(km <= mode.rangeKm ? mode.label + 'の目安圏内（直線約' + Math.round(km) + 'km）' : mode.label + 'の目安圏外（直線約' + Math.round(km) + 'km）');

      return Object.assign({}, s, {
        km: km, bearing: deg, direction: km < 1 ? '—' : direction8(deg),
        numMatch: numMatch, hitWishes: hitWishes, inRange: km <= mode.rangeKm,
        scoreParts: parts, score: total, reasons: reasons,
        lowConfidence: s.verification_status !== 'verified',
        // 願いを選んだときは、1つ以上一致したスポットを先に並べる
        wishTier: wishes.length && hitWishes.length ? 1 : 0
      });
    }).sort(function (a, b) { return b.wishTier - a.wishTier || b.score - a.score || a.km - b.km; });
  }

  var api = {
    NUMEROLOGY_MEANINGS: NUMEROLOGY_MEANINGS,
    digitSum: digitSum, lifePath: lifePath, validateBirthday: validateBirthday,
    distanceKm: distanceKm, bearingDeg: bearingDeg, direction8: direction8,
    isRecommendable: isRecommendable, rankSpots: rankSpots
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Diagnosis = api;
})(this);
