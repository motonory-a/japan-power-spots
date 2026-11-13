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
    var t = today || (typeof JSTDate !== 'undefined' ? JSTDate.todayDate() : new Date());
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

  // ダム・貯水池・ため池などの人工の水辺は、検索には出すが「おすすめ」には出さない（境内の神社・お寺は別）
  var ARTIFICIAL_WATER = /ダム|貯水池|調整池|遊水地|浄水場|ため池|溜池|砂防/;
  function isRecommendable(spot, cfg) {
    if (spot.publication_status !== cfg.publicStatus) return false;
    if (cfg.excludeAccessStatus.indexOf(spot.access_status) !== -1) return false;
    if (spot.category !== '神社' && spot.category !== '寺院' && ARTIFICIAL_WATER.test(spot.name || '')) return false;
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

  /*
   * 船や飛行機で渡る島（橋でつながっていない主な離島）。中心と半径（km）のおおよその範囲。
   * 出発地が同じ島の中でなければ、所要時間に乗り換え・船の分として ISLAND_EXTRA_MIN を足す。
   */
  var ISLANDS = [
    ['佐渡島', 38.05, 138.40, 35], ['隠岐', 36.20, 133.20, 30], ['壱岐', 33.79, 129.72, 12], ['対馬', 34.42, 129.33, 45],
    ['五島列島', 32.85, 128.95, 55], ['屋久島', 30.35, 130.53, 18], ['種子島', 30.55, 130.97, 30], ['甑島', 31.75, 129.80, 15],
    ['奄美群島', 28.00, 129.30, 145], ['沖縄本島', 26.45, 127.85, 65], ['久米島', 26.34, 126.80, 12], ['宮古島', 24.78, 125.30, 25],
    ['八重山', 24.40, 123.60, 70], ['伊豆大島', 34.74, 139.40, 12], ['新島・神津島', 34.30, 139.20, 20], ['三宅島・御蔵島', 34.00, 139.50, 20],
    ['八丈島', 33.10, 139.79, 15], ['小笠原', 27.00, 142.20, 60], ['利尻・礼文', 45.25, 141.15, 30], ['奥尻島', 42.15, 139.47, 12],
    ['天売・焼尻', 44.43, 141.33, 8], ['粟島', 38.47, 139.25, 5], ['小豆島', 34.50, 134.25, 15]
  ];
  var ISLAND_EXTRA_MIN = 90;
  function islandOf(lat, lon) {
    for (var i = 0; i < ISLANDS.length; i++) if (distanceKm(lat, lon, ISLANDS[i][1], ISLANDS[i][2]) <= ISLANDS[i][3]) return ISLANDS[i][0];
    return null;
  }
  // 出発地から見て「海を渡る島」なら島の名前、そうでなければ null
  function crossingIsland(origin, s) {
    var to = islandOf(s.lat, s.lon);
    return to && islandOf(origin.lat, origin.lon) !== to ? to : null;
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
    var useDay = !boards.noDay;
    if (km < 1) return { tier: 1, mark: '―', label: '出発地のすぐ近くのため方位なし', points: Math.round(cfg.weights.kyusei * cfg.kyusei.levelRatio.normal), dayPoints: useDay ? Math.round((cfg.weights.day || 0) * cfg.kyusei.levelRatio.normal) : 0, palace: null, detail: [] };
    var palace = K.palaceFromBearing(deg);
    var y = boards.year.palaces[palace], m = boards.month.palaces[palace], d = useDay ? boards.day.palaces[palace] : null;
    var kc = cfg.kyusei, r = kc.levelRatio, bw = kc.boardWeights;
    var yearMonthKyo = y.level === 'kyo' || m.level === 'kyo';
    var when = useDay ? '' : '（今月）';
    var mark, label;
    if (yearMonthKyo) { mark = '×'; label = '避けたい方位' + when + '（' + (y.level === 'kyo' ? '年盤' : '月盤') + 'で凶）'; }
    else if (d && d.level === 'kyo') { mark = '△'; label = '年・月は問題ないが、この日は日盤で凶'; }
    else if (y.level === 'best' && m.level === 'best') { mark = '◎'; label = '年・月とも最大吉方' + when; }
    else if (y.level !== 'normal' && m.level !== 'normal') { mark = '◎'; label = '年・月とも吉方位' + when; }
    else if (y.level !== 'normal' || m.level !== 'normal') { mark = '○'; label = (y.level !== 'normal' ? '年盤' : '月盤') + 'で吉方位' + when; }
    else { mark = '―'; label = '吉凶なし（普通）'; }
    var ym = (bw.year * r[y.level] + bw.month * r[m.level]) / (bw.year + bw.month);
    var points = yearMonthKyo ? 0 : Math.round(cfg.weights.kyusei * ym);
    var dayPoints = (!useDay || yearMonthKyo) ? 0 : Math.round((cfg.weights.day || 0) * r[d.level]);
    var rows = [['年盤', y], ['月盤', m]];
    if (d) rows.push(['日盤', d]);
    var detail = light ? [] : rows.map(function (x) {
      return x[0] + '：' + palace + 'に' + K.STAR_SHORT[x[1].star] + '→' + LEVEL_TEXT[x[1].level] + (x[1].bad.length ? '（' + x[1].bad.join('・') + '）' : '');
    });
    return {
      tier: yearMonthKyo ? 0 : 1, mark: mark, label: label, points: points, dayPoints: dayPoints, palace: palace, detail: detail,
      nearEdge: light ? false : K.edgeDistance(deg) < kc.edgeWarnDeg, levels: { year: y.level, month: m.level, day: d ? d.level : null }
    };
  }

  /*
   * 一緒に行く人がいるとき：全員の盤で判定して、いちばん慎重な結果にまとめる
   * group：[{ label:'あなた', boards }, { label:'パートナー', boards }, ...]
   *   ・だれか一人でも年盤・月盤で凶 → 避けたい方位
   *   ・点数は全員のうち最も低い人の点数
   */
  function judgeGroup(group, deg, km, cfg, light) {
    if (!group || !group.length || !group[0].boards) return null;
    var js = group.map(function (g) { return judgeFortune(g.boards, deg, km, cfg, light); });
    if (group.length === 1) return js[0];
    if (km < 1) return js[0];
    var who = group.length === 2 ? 'お二人' : 'みなさん';
    var marks = js.map(function (j) { return j.mark; });
    var names = function (pred) { return group.filter(function (g, i) { return pred(js[i]); }).map(function (g) { return g.label; }).join('・'); };
    var mark, label;
    if (marks.indexOf('×') !== -1) { mark = '×'; label = '避けたい方位（' + names(function (j) { return j.mark === '×'; }) + 'にとって年盤・月盤で凶）'; }
    else if (marks.indexOf('△') !== -1) { mark = '△'; label = 'この日は日盤で凶の人がいます（' + names(function (j) { return j.mark === '△'; }) + '）'; }
    else if (marks.every(function (m) { return m === '◎'; })) { mark = '◎'; label = who + 'とも、年・月とも吉方位'; }
    else if (marks.every(function (m) { return m === '◎' || m === '○'; })) { mark = '○'; label = who + 'とも吉方位'; }
    else if (marks.some(function (m) { return m === '◎' || m === '○'; })) { mark = '―'; label = '吉凶なし（' + names(function (j) { return j.mark === '◎' || j.mark === '○'; }) + 'には吉方位）'; }
    else { mark = '―'; label = '吉凶なし（普通）'; }
    var detail = [];
    if (!light) js.forEach(function (j, i) { detail.push('【' + group[i].label + '】' + j.mark + ' ' + j.label); j.detail.forEach(function (d) { detail.push('　' + d); }); });
    return {
      tier: Math.min.apply(null, js.map(function (j) { return j.tier; })), mark: mark, label: label,
      points: Math.min.apply(null, js.map(function (j) { return j.points; })), dayPoints: Math.min.apply(null, js.map(function (j) { return j.dayPoints || 0; })), palace: js[0].palace, detail: detail,
      nearEdge: js[0].nearEdge, levels: js[0].levels, members: js
    };
  }

  /*
   * 推薦スコア計算
   * input = { number, origin:{lat,lon}, wishes:[], mode:'walk'|'transit'|'car', limitMinutes: 数値 or null,
   *           boards: Kyusei.boardsFor() の結果 or null（出かける日を入れたとき） }
   * 戻り値は点数の内訳と根拠の文章を含む配列。
   * 並び順：所要時間の上限内 → 年盤・月盤で凶でない → 願いに一致 → スコア → 公式情報の確認済み → 知名度 → 近さ
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
    var group = input.group && input.group.length > 1 ? input.group : null;
    var numbers = input.numbers && input.numbers.length ? input.numbers : [input.number];
    var judge = function (deg, km, light) { return group ? judgeGroup(group, deg, km, cfg, light) : judgeFortune(boards, deg, km, cfg, light); };
    var famW = w.fame || 0, famFull = cfg.fameFull || 120;
    // 入力された項目の配分だけで満点を決める（未入力の項目に架空の点を付けない）
    var avail = { wish: wishes.length > 0, kyusei: !!(boards || group), day: !!(boards && !boards.noDay), distance: true, numerology: true, fame: true, reliability: true };
    var maxW = 0;
    Object.keys(avail).forEach(function (k) { if (avail[k]) maxW += (w[k] || 0); });

    // 1) 全件を数値だけで採点
    var light = [];
    for (var i = 0; i < spots.length; i++) {
      var s = spots[i];
      if (!isRecommendable(s, cfg)) continue;
      var km = distanceKm(input.origin.lat, input.origin.lon, s.lat, s.lon);
      var deg = bearingBy(cfg.bearingMethod, input.origin.lat, input.origin.lon, s.lat, s.lon);
      var mins = estimateMinutes(km, mode);
      var island = crossingIsland(input.origin, s);
      if (island) mins += ISLAND_EXTRA_MIN;
      var numHits = 0;
      for (var q = 0; q < numbers.length; q++) if (s.numbers.indexOf(numbers[q]) !== -1) numHits++;
      var numMatch = numHits > 0;
      var hit = 0;
      for (var j = 0; j < wishes.length; j++) if (s.wishes.indexOf(wishes[j]) !== -1) hit++;
      var withinLimit = !limit || mins <= limit;
      var f = judge(deg, km, true);
      var parts = {
        wish: wishes.length ? Math.round(w.wish * hit / wishes.length) : 0,
        kyusei: f ? f.points : 0,
        day: f ? (f.dayPoints || 0) : 0,
        // 所要時間を指定したとき：時間内ならどこでも満点（近いほど有利にはしない）。指定がないときは近いほど高い
        distance: limit ? (withinLimit ? w.distance : 0) : Math.round(w.distance * Math.max(0, 1 - mins / refMin)),
        numerology: Math.round(w.numerology * numHits / numbers.length),
        fame: Math.round(famW * Math.min(1, (s.fame || 0) / famFull)),
        reliability: Math.round(w.reliability * reliabilityRatio(s.verification_status))
      };
      var raw = parts.wish + parts.kyusei + parts.day + parts.distance + parts.numerology + parts.fame + parts.reliability;
      light.push({
        s: s, km: km, deg: deg, mins: mins, island: island, numMatch: numMatch, numHits: numHits, hit: hit, withinLimit: withinLimit,
        tier: f ? f.tier : 1, parts: parts, raw: raw,
        score: Math.round(100 * raw / maxW),
        wishTier: wishes.length && hit ? 1 : 0
      });
    }
    // 並び順：所要時間の上限内 → 年盤・月盤で凶でない → 願いに一致 → スコア → 確認済み → 知名度 → 近さ
    light.sort(function (a, b) {
      return (b.withinLimit - a.withinLimit) || (b.tier - a.tier) || (b.wishTier - a.wishTier) || (b.score - a.score) ||
        ((b.s.verified ? 1 : 0) - (a.s.verified ? 1 : 0)) || ((b.s.fame || 0) - (a.s.fame || 0)) || (a.km - b.km);
    });

    // 2) 上位だけ詳しい結果を作る
    var subset = top ? light.slice(0, top) : light;
    var out = subset.map(function (x) {
      var s = x.s;
      var hitWishes = wishes.filter(function (k) { return s.wishes.indexOf(k) !== -1; });
      var fortune = judge(x.deg, x.km, false);
      var reasons = [];
      if (numbers.length > 1) {
        var hitNums = numbers.filter(function (nn, i) { return s.numbers.indexOf(nn) !== -1 && numbers.indexOf(nn) === i; });
        reasons.push(hitNums.length ? '数秘ナンバー' + hitNums.join('・') + 'のテーマと一致（' + x.numHits + '/' + numbers.length + '人）' : 'どなたの数秘ナンバーとも一致なし');
      } else reasons.push(x.numMatch ? '数秘ナンバー' + input.number + 'のテーマと一致' : '数秘ナンバーとの一致なし');
      if (wishes.length) reasons.push(hitWishes.length ? '願い・体験：' + hitWishes.join('・') + 'が一致' : '選んだ願い・体験との一致なし');
      reasons.push(mode.label + 'で' + formatMinutes(x.mins) + '（目安）' +
        (limit ? (x.withinLimit ? '：指定時間内' : '：指定時間を超える') : ''));
      if (fortune) reasons.push('出かける日の方位：' + fortune.mark + ' ' + fortune.label);
      return Object.assign({}, s, {
        km: x.km, bearing: x.deg, direction: x.km < 0.05 ? '—' : (K ? K.palaceFromBearing(x.deg) : direction8(x.deg)),
        minutes: x.mins, minutesText: formatMinutes(x.mins) + (x.island ? '（' + x.island + 'へは船か飛行機）' : ''), island: x.island, withinLimit: x.withinLimit, fortune: fortune,
        numMatch: x.numMatch, hitWishes: hitWishes,
        scoreParts: x.parts, score: x.score, scoreRaw: x.raw, scoreMax: maxW, scoreAvail: avail, reasons: reasons,
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

  /*
   * 方位の良い日をさがす（v3.13）
   *   starsList：[本人の星, 一緒に行く人の星, ...]（Kyusei.birthStars の結果）
   *   deg・km：出発地からスポットへの方位角・距離、fromDate：'YYYY-MM-DD'、days：何日先まで見るか
   *   全員が年盤・月盤で吉（◎か○）で、日盤で凶でない日を返す。dayGood は全員が日盤でも吉の日
   */
  function addDays(dateStr, n) {
    var p = dateStr.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]) + n * 864e5);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }
  function goodDays(starsList, deg, km, cfg, fromDate, days) {
    if (!K || !starsList || !starsList.length || km < 1) return [];
    var out = [];
    for (var i = 0; i < days; i++) {
      var date = addDays(fromDate, i), j;
      try {
        var group = starsList.map(function (st, n) { return { label: String(n), boards: K.boardsFor(date, st) }; });
        j = group.length > 1 ? judgeGroup(group, deg, km, cfg, true) : judgeFortune(group[0].boards, deg, km, cfg, true);
      } catch (e) { continue; }
      if (!j || (j.mark !== '◎' && j.mark !== '○')) continue;
      var each = j.members || [j];
      out.push({ date: date, mark: j.mark, dayGood: each.every(function (x) { return x.levels && (x.levels.day === 'good' || x.levels.day === 'best'); }) });
    }
    return out;
  }
  // 表示用に数日だけ選ぶ：日盤でも吉の日を優先し、足りなければほかの吉日で補う（日付順）
  function pickGoodDays(list, n) {
    var best = list.filter(function (x) { return x.dayGood; });
    var pick = best.slice(0, n);
    if (pick.length < n) pick = pick.concat(list.filter(function (x) { return !x.dayGood; }).slice(0, n - pick.length));
    return pick.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  }

  var api = {
    addDays: addDays, goodDays: goodDays, pickGoodDays: pickGoodDays,
    NUMEROLOGY_MEANINGS: NUMEROLOGY_MEANINGS,
    digitSum: digitSum, lifePath: lifePath, validateBirthday: validateBirthday,
    distanceKm: distanceKm, bearingDeg: bearingDeg, rhumbBearingDeg: rhumbBearingDeg, bearingBy: bearingBy, direction8: direction8,
    estimateMinutes: estimateMinutes, formatMinutes: formatMinutes, islandOf: islandOf, crossingIsland: crossingIsland, judgeFortune: judgeFortune,
    isRecommendable: isRecommendable, rankSpots: rankSpots, judgeGroup: judgeGroup
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Diagnosis = api;
})(this);
