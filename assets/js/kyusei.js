/*
 * 九星気学の計算
 *
 * 採用している決まりごと（docs/KYUSEI_SPEC.md に詳しく記載）
 *  ・年の区切りは立春、月の区切りは各月の節入り。節入りの「日」から切り替える（日本時間）。
 *  ・日盤は「冬至・夏至にいちばん近い甲子の日」で陽遁・陰遁を切り替える方式（A方式）。
 *    冬至・夏至の日の干支番号Kが0〜30なら直前の甲子、31〜59なら直後の甲子を切替日とする（30日以内の近い方）。
 *    切替日の間隔が240日になるときは閏とし、甲午の日に切り替える（冬は七赤から陽遁、夏は三碧から陰遁）。
 *  ・盤は年・月・日とも順行（後天定位どおり）で配置する。
 *  ・方位は東西南北30°、四隅60°。真北基準。
 *  ・凶方位：五黄殺・暗剣殺・本命殺・本命的殺・破（歳破/月破/日破、宮全体）・定位対冲。
 *  ・吉方位：本命星と相生・比和の星が入る方位（五黄は除く）。本命星・月命星の両方に吉なら最大吉方。
 */
(function (root) {
  'use strict';

  var TERMS_RAW = (typeof SOLAR_TERMS_RAW !== 'undefined') ? SOLAR_TERMS_RAW
    : (typeof require !== 'undefined' ? require('../../data/solar-terms.js') : null);

  var STAR_NAMES = ['', '一白水星', '二黒土星', '三碧木星', '四緑木星', '五黄土星', '六白金星', '七赤金星', '八白土星', '九紫火星'];
  var STAR_SHORT = ['', '一白', '二黒', '三碧', '四緑', '五黄', '六白', '七赤', '八白', '九紫'];
  var STEMS = '甲乙丙丁戊己庚辛壬癸';
  var BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
  // 五行：0木 1火 2土 3金 4水
  var ELEMENT = [null, 4, 2, 0, 0, 2, 3, 3, 2, 1];
  var ELEMENT_NAMES = ['木', '火', '土', '金', '水'];

  // 方位（8宮）と後天定位
  var PALACES = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
  var BASE_STAR = { '北': 1, '北東': 8, '東': 3, '南東': 4, '南': 9, '南西': 2, '西': 7, '北西': 6 };
  var OPPOSITE = { '北': '南', '北東': '南西', '東': '西', '南東': '北西', '南': '北', '南西': '北東', '西': '東', '北西': '南東' };
  // 十二支の方位（宮）
  var BRANCH_PALACE = ['北', '北東', '北東', '東', '南東', '南東', '南', '南西', '南西', '西', '北西', '北西'];
  var TERM_NAMES = ['小寒', '大寒', '立春', '雨水', '啓蟄', '春分', '清明', '穀雨', '立夏', '小満', '芒種', '夏至',
    '小暑', '大暑', '立秋', '処暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
  var MONTH_BRANCH_NAMES = ['', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

  function mod(a, n) { return ((a % n) + n) % n; }

  /* ---------- 日付の基本 ---------- */
  // 1970-01-01 からの通し日数（日付だけを扱う）
  function dayNum(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 864e5); }
  function fromDayNum(n) { var t = new Date(n * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; }
  function parseDate(s) { var p = s.split('-').map(Number); return { y: p[0], m: p[1], d: p[2] }; }
  function fmtDate(o) { return o.y + '-' + String(o.m).padStart(2, '0') + '-' + String(o.d).padStart(2, '0'); }

  // 日の干支番号（甲子=0〜癸亥=59）。MJD + 50 を60で割った余り
  function dayGanzhiIndex(dn) { return mod(dn + 40587 + 50, 60); }
  function ganzhiName(i) { return STEMS[i % 10] + BRANCHES[i % 12]; }

  /* ---------- 二十四節気 ---------- */
  var termCache = {};
  function terms(y) {
    if (termCache[y]) return termCache[y];
    if (!TERMS_RAW || !TERMS_RAW[y]) throw new Error('節気データの範囲外です: ' + y);
    var list = TERMS_RAW[y].split(' ').map(function (v, i) {
      var m = +v.slice(0, 2), d = +v.slice(2, 4);
      return { name: TERM_NAMES[i], y: y, m: m, d: d, hh: +v.slice(4, 6), mm: +v.slice(6, 8), dn: dayNum(y, m, d) };
    });
    termCache[y] = list;
    return list;
  }

  /*
   * 気学上の年・月
   * monthIdx：1=寅月（立春〜）… 11=子月（大雪〜） 12=丑月（小寒〜）
   * 節入りの日は、その日から新しい月として扱う。
   */
  function kigakuYM(y, m, d) {
    var dn = dayNum(y, m, d);
    var t = terms(y);
    var kYear = dn >= t[2].dn ? y : y - 1;
    // 節（偶数番号）を新しい順に探す
    var setsu = [];
    [y - 1, y].forEach(function (yy) {
      terms(yy).forEach(function (x, i) { if (i % 2 === 0) setsu.push({ idx: i, t: x }); });
    });
    var cur = null;
    for (var i = setsu.length - 1; i >= 0; i--) { if (setsu[i].t.dn <= dn) { cur = setsu[i]; break; } }
    // 小寒(0)=丑月(12)、立春(2)=寅月(1)、…、大雪(22)=子月(11)
    var monthIdx = cur.idx === 0 ? 12 : cur.idx / 2;
    var boundary = setsu.some(function (s) { return s.t.dn === dn; }) ? cur.t : null;
    return { kYear: kYear, monthIdx: monthIdx, setsu: cur.t, boundaryTerm: boundary };
  }

  /* ---------- 年・月の九星 ---------- */
  function yearStar(kYear) { return 1 + mod(-(kYear - 2017), 9); }
  function monthStar(kYear, monthIdx) {
    var ys = yearStar(kYear);
    var start = [1, 4, 7].indexOf(ys) !== -1 ? 8 : ([3, 6, 9].indexOf(ys) !== -1 ? 5 : 2);
    return mod(start - 1 - (monthIdx - 1), 9) + 1;
  }
  function yearBranch(kYear) { return mod(kYear - 4, 12); }       // 子=0
  function monthBranch(monthIdx) { return mod(monthIdx + 1, 12); } // 寅月=2

  /* ---------- 日の九星（A方式） ---------- */
  // 冬至・夏至の日から切替甲子を求める
  function switchFor(term) {
    var k = dayGanzhiIndex(term.dn);
    return k <= 30 ? term.dn - k : term.dn + (60 - k);
  }

  // y年前後の切替日（閏処理済み）を古い順に返す
  var switchCache = {};
  function effectiveSwitches(y) {
    if (switchCache[y]) return switchCache[y];
    var raw = [];
    for (var yy = y - 2; yy <= y + 1; yy++) {
      var t = terms(yy);
      raw.push({ kind: 'summer', dn: switchFor(t[11]), solstice: t[11] });
      raw.push({ kind: 'winter', dn: switchFor(t[23]), solstice: t[23] });
    }
    var eff = [];
    for (var i = 1; i < raw.length; i++) {
      var gap = raw[i].dn - raw[i - 1].dn;
      var winter = raw[i].kind === 'winter';
      if (gap === 240) {
        eff.push({ dn: raw[i].dn - 30, start: winter ? 7 : 3, dir: winter ? 1 : -1, leap: true, kind: raw[i].kind });
      } else {
        eff.push({ dn: raw[i].dn, start: winter ? 1 : 9, dir: winter ? 1 : -1, leap: false, kind: raw[i].kind, gap: gap });
      }
    }
    switchCache[y] = eff;
    return eff;
  }

  function dayStarInfo(y, m, d) {
    var dn = dayNum(y, m, d);
    var list = effectiveSwitches(y);
    var s = null;
    for (var i = list.length - 1; i >= 0; i--) { if (list[i].dn <= dn) { s = list[i]; break; } }
    if (!s) throw new Error('切替日を求められませんでした');
    var n = dn - s.dn;
    var star = mod(s.start - 1 + s.dir * n, 9) + 1;
    return { star: star, yang: s.dir === 1, switchDate: fmtDate(fromDayNum(s.dn)), leap: s.leap };
  }
  function dayStar(y, m, d) { return dayStarInfo(y, m, d).star; }

  /* ---------- 本命星・月命星 ---------- */
  function birthStars(dateStr) {
    var b = parseDate(dateStr);
    var ym = kigakuYM(b.y, b.m, b.d);
    var notes = [];
    if (ym.boundaryTerm) {
      notes.push('生まれた日が' + ym.boundaryTerm.name + '（' + ym.boundaryTerm.m + '月' + ym.boundaryTerm.d + '日 ' +
        ym.boundaryTerm.hh + '時' + String(ym.boundaryTerm.mm).padStart(2, '0') + '分）の節入り日です。' +
        'それより前の時刻に生まれた場合は' + (ym.boundaryTerm.name === '立春' ? '本命星・' : '') + '月命星が変わります。');
    }
    return { honmei: yearStar(ym.kYear), getsumei: monthStar(ym.kYear, ym.monthIdx), kYear: ym.kYear, monthIdx: ym.monthIdx, notes: notes };
  }

  /* ---------- 盤と吉凶 ---------- */
  function board(center) {
    var b = {};
    PALACES.forEach(function (p) { b[p] = mod(BASE_STAR[p] - 5 + center - 1, 9) + 1; });
    return b;
  }

  // 生む関係・生まれる関係・同じ五行（比和）なら吉。五黄は除く
  function isGoodStar(person, star) {
    if (star === 5 || star === person) return false;
    var a = ELEMENT[person], b = ELEMENT[star];
    return a === b || mod(a + 1, 5) === b || mod(b + 1, 5) === a;
  }
  function goodStars(person) {
    var out = [];
    for (var s = 1; s <= 9; s++) if (isGoodStar(person, s)) out.push(s);
    return out;
  }

  function palaceOf(starOrNull, b) {
    for (var i = 0; i < PALACES.length; i++) if (b[PALACES[i]] === starOrNull) return PALACES[i];
    return null; // 中宮
  }

  /*
   * 1つの盤について、各方位の吉凶を判定
   * level：'kyo'（凶）／'best'（最大吉方）／'good'（吉）／'normal'
   */
  function judgeBoard(center, branchIdx, breakLabel, person) {
    var b = board(center);
    var goPalace = palaceOf(5, b);
    var honPalace = palaceOf(person.honmei, b);
    var breakPalace = OPPOSITE[BRANCH_PALACE[branchIdx]];
    var res = {};
    PALACES.forEach(function (p) {
      var star = b[p], bad = [];
      if (p === goPalace) bad.push('五黄殺');
      if (goPalace && p === OPPOSITE[goPalace]) bad.push('暗剣殺');
      if (p === honPalace) bad.push('本命殺');
      if (honPalace && p === OPPOSITE[honPalace]) bad.push('本命的殺');
      if (p === breakPalace) bad.push(breakLabel);
      if (star === BASE_STAR[OPPOSITE[p]]) bad.push('定位対冲');
      var level;
      if (bad.length) level = 'kyo';
      else if (isGoodStar(person.honmei, star) && isGoodStar(person.getsumei, star)) level = 'best';
      else if (isGoodStar(person.honmei, star)) level = 'good';
      else level = 'normal';
      res[p] = { star: star, level: level, bad: bad };
    });
    return { center: center, board: b, palaces: res, honmeiInCenter: honPalace === null };
  }

  // 出かける日の年盤・月盤・日盤を作る
  function boardsFor(dateStr, person) {
    var t = parseDate(dateStr);
    var ym = kigakuYM(t.y, t.m, t.d);
    var yc = yearStar(ym.kYear), mc = monthStar(ym.kYear, ym.monthIdx);
    var di = dayStarInfo(t.y, t.m, t.d);
    var gz = dayGanzhiIndex(dayNum(t.y, t.m, t.d));
    return {
      date: dateStr, kYear: ym.kYear, monthIdx: ym.monthIdx, dayGanzhi: ganzhiName(gz), daySwitch: di,
      year: judgeBoard(yc, yearBranch(ym.kYear), '歳破', person),
      month: judgeBoard(mc, monthBranch(ym.monthIdx), '月破', person),
      day: judgeBoard(di.star, gz % 12, '日破', person),
      setsu: ym.setsu, boundaryTerm: ym.boundaryTerm
    };
  }

  /* ---------- 方位（30°・60°） ---------- */
  // 北 345〜15 / 北東 15〜75 / 東 75〜105 / 南東 105〜165 / 南 165〜195 / 南西 195〜255 / 西 255〜285 / 北西 285〜345
  var EDGES = [15, 75, 105, 165, 195, 255, 285, 345];
  function palaceFromBearing(deg) {
    var x = mod(deg, 360);
    for (var i = 0; i < EDGES.length; i++) if (x < EDGES[i]) return PALACES[i];
    return '北';
  }
  // 区切り線までの角度（境界付近の注意表示用）
  function edgeDistance(deg) {
    var x = mod(deg, 360), min = 360;
    EDGES.forEach(function (e) { var d = Math.abs(x - e); min = Math.min(min, d, 360 - d); });
    return min;
  }

  var api = {
    STAR_NAMES: STAR_NAMES, STAR_SHORT: STAR_SHORT, ELEMENT_NAMES: ELEMENT_NAMES, ELEMENT: ELEMENT, PALACES: PALACES,
    MONTH_BRANCH_NAMES: MONTH_BRANCH_NAMES,
    dayNum: dayNum, dayGanzhiIndex: dayGanzhiIndex, ganzhiName: ganzhiName, terms: terms, kigakuYM: kigakuYM,
    yearStar: yearStar, monthStar: monthStar, yearBranch: yearBranch, monthBranch: monthBranch,
    dayStar: dayStar, dayStarInfo: dayStarInfo, effectiveSwitches: effectiveSwitches,
    birthStars: birthStars, board: board, isGoodStar: isGoodStar, goodStars: goodStars,
    judgeBoard: judgeBoard, boardsFor: boardsFor, palaceFromBearing: palaceFromBearing, edgeDistance: edgeDistance
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Kyusei = api;
})(this);
