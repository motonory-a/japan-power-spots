/*
 * 診断ロジック（画面に依存しない計算だけをまとめたファイル）
 * ブラウザでは window.Diagnosis、Node.js のテストでは require() で読み込みます。
 *
 * 数秘ナンバーは現行版と同じ計算式（暫定ロジック）:
 *   生年月日 YYYYMMDD の各桁を足し、1桁になるまで足し続ける。
 *   11・22・33（マスターナンバー）は扱わず1桁まで還元する。
 * 画面の「方角」は九星気学と同じ区切り（東西南北30°・四隅60°、真北基準）で表示します。
 */
(function (root) {
  'use strict';

  var K = root.Kyusei || (typeof require !== 'undefined' ? require('./kyusei.js') : null);

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
    if (!dateStr) return '生年月日の年・月・日を選んでください。';
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

  // メルカトル地図上の直線（等角航路）の方位角（真北=0°、時計回り、0〜360）
  function rhumbBearingDeg(lat1, lon1, lat2, lon2) {
    var r = Math.PI / 180;
    var dLon = (lon2 - lon1) * r;
    if (Math.abs(dLon) > Math.PI) dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
    var dPsi = Math.log(Math.tan(Math.PI / 4 + lat2 * r / 2) / Math.tan(Math.PI / 4 + lat1 * r / 2));
    return (Math.atan2(dLon, dPsi) / r + 360) % 360;
  }

  function bearingBy(method, lat1, lon1, lat2, lon2) {
    return method === 'rhumb' ? rhumbBearingDeg(lat1, lon1, lat2, lon2) : bearingDeg(lat1, lon1, lat2, lon2);
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
   * 所要時間の目安（分）
   * 直線距離 × 迂回係数 で道のりを見積もり、
   * 最初の localKm は一般道・在来線などの速度、それより先は高速道路・新幹線などの速度で計算する。
   * 乗り継ぎ・駐車などの時間として overheadMin を足す。実際の経路検索ではありません。
   */
  function estimateMinutes(km, mode) {
    var route = km * mode.detour;
    var local = Math.min(route, mode.localKm);
    var mins = mode.overheadMin + local / mode.localSpeedKmh * 60 + (route - local) / mode.longSpeedKmh * 60;
    return Math.max(1, Math.round(mins));
  }

  function formatMinutes(m) {
    if (m < 60) return '約' + m + '分';
    var h = Math.floor(m / 60), r = Math.round((m - h * 60) / 10) * 10;
    if (r === 60) { h += 1; r = 0; }
    return '約' + h + '時間' + (r ? r + '分' : '');
  }

  /*
   * 出かける日の方位の吉凶（九星気学）をスポットごとに判定
   * boards：Kyusei.boardsFor() の結果、deg：方位角、km：距離
   */
  var LEVEL_TEXT = { best: '最大吉方', good: '吉方', normal: '吉凶なし', kyo: '凶' };
  function judgeFortune(boards, deg, km, cfg, light) {
    if (!boards) return null;
    if (km < 1) return { tier: 1, mark: '―', label: '出発地のすぐ近くのため方位なし', points: 0, palace: null, detail: [] };
    var palace = K.palaceFromBearing(deg);
    var y = boards.year.palaces[palace], m = boards.month.palaces[palace], d = boards.day.palaces[palace];
    var kc = cfg.kyusei, r = kc.levelRatio, bw = kc.boardWeights;
    var yearMonthKyo = y.level === 'kyo' || m.level === 'kyo';
    var mark, label;
    if (yearMonthKyo) { mark = '×'; label = '避けたい方位（' + (y.level === 'kyo' ? '年盤' : '月盤') + 'で凶）'; }
    else if (d.level === 'kyo') { mark = '△'; label = '年・月は問題ないが、この日は日盤で凶'; }
    else if (y.level === 'best' && m.level === 'best') { mark = '◎'; label = '年・月とも最大吉方'; }
    else if (y.level !== 'normal' && m.level !== 'normal') { mark = '◎'; label = '年・月とも吉方位'; }
    else if (y.level !== 'normal' || m.level !== 'normal') { mark = '○'; label = (y.level !== 'normal' ? '年盤' : '月盤') + 'で吉方位'; }
    else { mark = '―'; label = '吉凶なし（普通）'; }
    var points = yearMonthKyo ? 0 : Math.round(cfg.weights.kyusei * (bw.year * r[y.level] + bw.month * r[m.level] + bw.day * r[d.level]));
    var detail = light ? [] : [['年盤', y], ['月盤', m], ['日盤', d]].map(function (x) {
      return x[0] + '：' + palace + 'に' + K.STAR_SHORT[x[1].star] + '→' + LEVEL_TEXT[x[1].level] + (x[1].bad.length ? '（' + x[1].bad.join('・') + '）' : '');
    });
    return {
      tier: yearMonthKyo ? 0 : 1, mark: mark, label: label, points: points, palace: palace, detail: detail,
      nearEdge: light ? false : K.edgeDistance(deg) < kc.edgeWarnDeg, levels: { year: y.level, month: m.level, day: d.level }
    };
  }

  /*
   * 推薦スコア計算
   * input = { number, origin:{lat,lon}, wishes:[], mode:'walk'|'transit'|'car', limitMinutes: 数値 or null,
   *           boards: Kyusei.boardsFor() の結果 or null（出かける日を入れたとき） }
   * 戻り値は点数の内訳と根拠の文章を含む配列。
   * 並び順：所要時間の上限内 → 年盤・月盤で凶でない → 願いに一致 → スコア → 近さ
   */
  /*
   * opts.top を指定すると、全件を数値だけで採点・並べ替えたあと、上位 top 件だけ詳しい結果を作る（9万件でも速い）。
   * 戻り値の配列には、全件についての集計 anyWishHit（願いに一致するスポットがあるか）・withinCount（時間内の件数）・count を付ける。
   */
  function rankSpots(spots, input, cfg, opts) {
    var w = cfg.weights;
    var mode = cfg.travelModes[input.mode] || cfg.travelModes.transit;
    var wishes = input.wishes || [];
    var limit = input.limitMinutes || null;
    var refMin = limit || mode.refMinutes;
    var top = opts && opts.top;
    var boards = input.boards || null;
    var famW = w.fame || 0, famFull = cfg.fameFull || 120;

    // 1) 全件を数値だけで採点
    var light = [];
    for (var i = 0; i < spots.length; i++) {
      var s = spots[i];
      if (!isRecommendable(s, cfg)) continue;
      var km = distanceKm(input.origin.lat, input.origin.lon, s.lat, s.lon);
      var deg = bearingBy(cfg.bearingMethod, input.origin.lat, input.origin.lon, s.lat, s.lon);
      var mins = estimateMinutes(km, mode);
      var numMatch = s.numbers.indexOf(input.number) !== -1;
      var hit = 0;
      for (var j = 0; j < wishes.length; j++) if (s.wishes.indexOf(wishes[j]) !== -1) hit++;
      var withinLimit = !limit || mins <= limit;
      var f = judgeFortune(boards, deg, km, cfg, true);
      var parts = {
        numerology: numMatch ? w.numerology : 0,
        wish: wishes.length ? Math.round(w.wish * hit / wishes.length) : 0,
        distance: Math.round(w.distance * Math.max(0, 1 - mins / refMin)),
        kyusei: f ? f.points : 0,
        fame: Math.round(famW * Math.min(1, (s.fame || 0) / famFull)),
        reliability: Math.round(w.reliability * reliabilityRatio(s.verification_status))
      };
      light.push({
        s: s, km: km, deg: deg, mins: mins, numMatch: numMatch, hit: hit, withinLimit: withinLimit,
        tier: f ? f.tier : 1, parts: parts,
        score: parts.numerology + parts.wish + parts.distance + parts.kyusei + parts.fame + parts.reliability,
        wishTier: wishes.length && hit ? 1 : 0
      });
    }
    // 並び順：所要時間の上限内 → 年盤・月盤で凶でない → 願いに一致 → スコア → 近さ
    light.sort(function (a, b) {
      return (b.withinLimit - a.withinLimit) || (b.tier - a.tier) || (b.wishTier - a.wishTier) || (b.score - a.score) || (a.km - b.km);
    });

    // 2) 上位だけ詳しい結果を作る
    var subset = top ? light.slice(0, top) : light;
    var out = subset.map(function (x) {
      var s = x.s;
      var hitWishes = wishes.filter(function (k) { return s.wishes.indexOf(k) !== -1; });
      var fortune = judgeFortune(boards, x.deg, x.km, cfg);
      var reasons = [];
      reasons.push(x.numMatch ? '数秘ナンバー' + input.number + 'のテーマと一致' : '数秘ナンバーとの一致なし');
      if (wishes.length) reasons.push(hitWishes.length ? '願い・体験：' + hitWishes.join('・') + 'が一致' : '選んだ願い・体験との一致なし');
      reasons.push(mode.label + 'で' + formatMinutes(x.mins) + '（目安）' +
        (limit ? (x.withinLimit ? '：指定時間内' : '：指定時間を超える') : ''));
      if (fortune) reasons.push('出かける日の方位：' + fortune.mark + ' ' + fortune.label);
      return Object.assign({}, s, {
        km: x.km, bearing: x.deg, direction: x.km < 0.05 ? '—' : (K ? K.palaceFromBearing(x.deg) : direction8(x.deg)),
        minutes: x.mins, minutesText: formatMinutes(x.mins), withinLimit: x.withinLimit, fortune: fortune,
        numMatch: x.numMatch, hitWishes: hitWishes,
        scoreParts: x.parts, score: x.score, reasons: reasons,
        lowConfidence: s.verification_status !== 'verified',
        // 願いを選んだときは、1つ以上一致したスポットを先に並べる
        wishTier: x.wishTier
      });
    });
    out.count = light.length;
    out.anyWishHit = light.some(function (x) { return x.hit > 0; });
    out.withinCount = light.filter(function (x) { return x.withinLimit; }).length;
    return out;
  }

  var api = {
    NUMEROLOGY_MEANINGS: NUMEROLOGY_MEANINGS,
    digitSum: digitSum, lifePath: lifePath, validateBirthday: validateBirthday,
    distanceKm: distanceKm, bearingDeg: bearingDeg, rhumbBearingDeg: rhumbBearingDeg, bearingBy: bearingBy, direction8: direction8,
    estimateMinutes: estimateMinutes, formatMinutes: formatMinutes, judgeFortune: judgeFortune,
    isRecommendable: isRecommendable, rankSpots: rankSpots
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Diagnosis = api;
})(this);
