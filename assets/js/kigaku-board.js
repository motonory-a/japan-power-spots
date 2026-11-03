/*
 * 九星の方位盤（八角形の図）を SVG で描く
 *  ・気学の盤の書き方にならい、南を上・北を下・東を左・西を右にする
 *  ・星は五行の色（木=緑・火=赤・土=黄・金=銀・水=紺）で表示
 *  ・本命星のある宮を金色の枠で、吉方位を緑、凶方位を赤で示す
 */
(function (root) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var ELEMENT_COLOR = ['#3a9d6f', '#e0566b', '#d99a1e', '#8a99a3', '#3d5f8f']; // 木 火 土 金 水
  var ELEMENT_NAME = ['木', '火', '土', '金', '水'];
  var BEARING = { '北': 0, '北東': 45, '東': 90, '南東': 135, '南': 180, '南西': 225, '西': 270, '北西': 315 };
  var BRANCHES = { '北': ['子'], '北東': ['丑', '寅'], '東': ['卯'], '南東': ['辰', '巳'], '南': ['午'], '南西': ['未', '申'], '西': ['酉'], '北西': ['戌', '亥'] };
  var FILL = { best: '#cdebd7', good: '#e6f4ea', normal: '#f7f5ee', kyo: '#fbe3e0' };
  var MARK = { best: '◎', good: '○', normal: '', kyo: '×' };

  function n(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  // 方位角（北=0、時計回り）→ 画面上の座標（南が上）
  function pos(cx, cy, r, deg) {
    var t = deg * Math.PI / 180;
    return [cx - Math.sin(t) * r, cy + Math.cos(t) * r];
  }
  function octagon(cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 8; i++) pts.push(pos(cx, cy, r, 22.5 + i * 45).map(function (v) { return v.toFixed(1); }).join(','));
    return pts.join(' ');
  }
  function wedge(cx, cy, r1, r2, deg) {
    var a = deg - 22.5, b = deg + 22.5;
    var p = [pos(cx, cy, r2, a), pos(cx, cy, r2, b), pos(cx, cy, r1, b), pos(cx, cy, r1, a)];
    return p.map(function (v) { return v[0].toFixed(1) + ',' + v[1].toFixed(1); }).join(' ');
  }

  /*
   * judged：Kyusei.judgeBoard() の結果、person：{ honmei, getsumei }
   * opts：{ title, size }
   */
  function draw(judged, person, opts) {
    opts = opts || {};
    var K = root.Kyusei;
    var S = 520, cx = 260, cy = 262;
    var R_OUT = 210, R_MID = 112, R_IN = 52;
    var svg = n('svg', { viewBox: '0 0 ' + S + ' ' + S, class: 'kg-board', role: 'img',
      'aria-label': (opts.title || '方位盤') + '：中宮は' + K.STAR_NAMES[judged.center] });

    // 外枠
    svg.append(n('polygon', { points: octagon(cx, cy, R_OUT + 3), fill: '#ffffff', stroke: '#c9c3b5', 'stroke-width': 1.5 }));

    var honPlace = K.placeOfStar(judged.center, person.honmei);

    K.PALACES.forEach(function (p) {
      var deg = BEARING[p];
      var c = judged.palaces[p];
      var el = K.ELEMENT[c.star];
      var g = n('g', { class: 'kg-palace lv-' + c.level });
      // 宮の扇形（外側：星と吉凶、内側：方位と十二支）
      g.append(n('polygon', { points: wedge(cx, cy, R_MID, R_OUT, deg), fill: FILL[c.level], stroke: '#c9c3b5', 'stroke-width': 1 }));
      g.append(n('polygon', { points: wedge(cx, cy, R_IN, R_MID, deg), fill: '#efe9da', stroke: '#c9c3b5', 'stroke-width': 1 }));

      // 星（五行の色の丸＋名前）
      var sp = pos(cx, cy, 152, deg);
      g.append(n('circle', { cx: sp[0].toFixed(1), cy: (sp[1] - 13).toFixed(1), r: 15, fill: ELEMENT_COLOR[el], opacity: 0.92 }));
      g.append(n('text', { x: sp[0].toFixed(1), y: (sp[1] - 8).toFixed(1), 'text-anchor': 'middle', class: 'kg-el' }, ELEMENT_NAME[el]));
      g.append(n('text', { x: sp[0].toFixed(1), y: (sp[1] + 18).toFixed(1), 'text-anchor': 'middle', class: 'kg-star', fill: '#333' },
        K.STAR_SHORT[c.star] + (MARK[c.level] ? ' ' + MARK[c.level] : '')));
      if (c.bad.length) {
        g.append(n('text', { x: sp[0].toFixed(1), y: (sp[1] + 32).toFixed(1), 'text-anchor': 'middle', class: 'kg-bad' }, c.bad.slice(0, 2).join('・')));
      }
      // 方位名と十二支
      var dp = pos(cx, cy, (R_IN + R_MID) / 2 + 4, deg);
      g.append(n('text', { x: dp[0].toFixed(1), y: (dp[1] - 1).toFixed(1), 'text-anchor': 'middle', class: 'kg-dir' }, p));
      g.append(n('text', { x: dp[0].toFixed(1), y: (dp[1] + 13).toFixed(1), 'text-anchor': 'middle', class: 'kg-br' }, BRANCHES[p].join('・')));
      svg.append(g);
    });

    // 本命星のある宮を金色の枠で
    if (honPlace !== '中宮') {
      var deg = BEARING[honPlace];
      svg.append(n('polygon', { points: wedge(cx, cy, R_IN, R_OUT, deg), fill: 'none', stroke: '#c9971c', 'stroke-width': 4, 'stroke-linejoin': 'round', class: 'kg-you' }));
      var tp = pos(cx, cy, R_OUT + 24, deg);
      svg.append(n('rect', { x: (tp[0] - 26).toFixed(1), y: (tp[1] - 11).toFixed(1), width: 52, height: 22, rx: 11, fill: '#c9971c' }));
      svg.append(n('text', { x: tp[0].toFixed(1), y: (tp[1] + 5).toFixed(1), 'text-anchor': 'middle', class: 'kg-you-label' }, 'あなた'));
    }

    // 中宮
    var ce = K.ELEMENT[judged.center];
    svg.append(n('polygon', { points: octagon(cx, cy, R_IN), fill: ELEMENT_COLOR[ce], stroke: honPlace === '中宮' ? '#c9971c' : '#ffffff', 'stroke-width': honPlace === '中宮' ? 5 : 2 }));
    svg.append(n('text', { x: cx, y: cy + 2, 'text-anchor': 'middle', class: 'kg-center' }, K.STAR_SHORT[judged.center]));
    svg.append(n('text', { x: cx, y: cy + 20, 'text-anchor': 'middle', class: 'kg-center-sub' }, '中宮' + (honPlace === '中宮' ? '（あなた）' : '')));

    // 上下の目印
    svg.append(n('text', { x: 8, y: 20, class: 'kg-ns' }, '上が南・下が北'));
    return svg;
  }

  // 五行の凡例
  function legend() {
    var d = document.createElement('div');
    d.className = 'kg-legend';
    ELEMENT_NAME.forEach(function (nm, i) {
      var s = document.createElement('span');
      var dot = document.createElement('i');
      dot.style.background = ELEMENT_COLOR[i];
      s.append(dot, document.createTextNode(nm));
      d.append(s);
    });
    var extra = document.createElement('span');
    extra.className = 'kg-legend-note';
    extra.textContent = '緑＝吉方位（◎最大吉方・○吉方）／赤＝凶方位／金色の枠＝あなたの本命星';
    d.append(extra);
    return d;
  }

  root.KigakuBoard = { draw: draw, legend: legend, ELEMENT_COLOR: ELEMENT_COLOR };
})(this);
