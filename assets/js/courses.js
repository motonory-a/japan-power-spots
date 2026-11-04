/*
 * モデルコース（v3.11）
 *   ・data/model-courses.js のコースを、地方ごとに選んで見られるようにする
 *   ・どのコースも、公式情報を確認済みのスポットだけでできている
 *   ・距離は直線距離。実際の道のり・時間は「Googleマップで道順を見る」で確かめてもらう
 *   ・診断で出発地が決まったら、出発地から近い順に並べかえる
 *   ・URLの末尾 #course=コースID で、そのコースを直接ひらける（紹介用）
 */
(function (root) {
  'use strict';
  var REGIONS = ['北海道・東北', '関東', '中部', '近畿', '中国・四国', '九州・沖縄'];
  var MODE = { train: '電車・バスと徒歩向き', car: '車でのお出かけ向き' };
  var SHOW_FIRST = 6;
  var state = { region: 'all', origin: null, expanded: false };
  var listEl = null, chipsEl = null, moreBtn = null, noteEl = null;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function courses() { return root.MODEL_COURSES || []; }
  function distKm(a, b) {
    var r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    var x = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.pow(Math.sin(dLon / 2), 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function kmText(km) { return km < 10 ? km.toFixed(1) : String(Math.round(km)); }
  function totalKm(c) {
    var t = 0;
    for (var i = 1; i < c.stops.length; i++) t += distKm(c.stops[i - 1], c.stops[i]);
    return t;
  }
  function center(c) {
    var lat = 0, lon = 0;
    c.stops.forEach(function (s) { lat += s.lat; lon += s.lon; });
    return { lat: lat / c.stops.length, lon: lon / c.stops.length };
  }
  function byId(id) { var a = courses(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }

  // 全国データの中から、このコースのスポットをさがす（Wikidata の番号で）
  function findSpot(q) {
    var all = root.ALL_SPOTS || [];
    for (var i = 0; i < all.length; i++) if (all[i].wikidata === q) return all[i];
    return null;
  }
  function openSpot(q) {
    if (!root.SpotDetail) return;
    var s = findSpot(q);
    if (s) { SpotDetail.open(s); return; }
    if (root.SpotData && SpotData.loadExtras) SpotData.loadExtras().then(function () { var t = findSpot(q); if (t) SpotDetail.open(t); });
  }
  function info(q) { var t = root.CURATED_INFO; return t ? t[q] : null; }

  // Googleマップの道順（順番どおりに経由する）。電車・バスでは経由地を使えないため、移動手段は指定しない
  function routeUrl(c) {
    var st = c.stops.map(function (s) { return encodeURIComponent(s.name + ' ' + s.pref); });
    var url = 'https://www.google.com/maps/dir/?api=1&origin=' + st[0] + '&destination=' + st[st.length - 1];
    if (st.length > 2) url += '&waypoints=' + st.slice(1, -1).join('%7C');
    if (c.mode === 'car') url += '&travelmode=driving';
    return url;
  }
  function courseUrl(c) {
    var base = root.APP_CONFIG && APP_CONFIG.siteUrl ? APP_CONFIG.siteUrl : root.location.href.split('#')[0];
    return base + '#course=' + encodeURIComponent(c.id);
  }

  function shortHours(t) {
    if (!t) return '参拝時間：公式サイトでご確認ください';
    return '参拝時間：' + (t.length > 70 ? t.slice(0, 68) + '…' : t);
  }

  function card(c) {
    var art = el('article', 'course-card');
    art.id = 'course-' + c.id;
    var head = el('div', 'course-head');
    var tags = el('div', 'tags');
    var prefs = [];
    c.stops.forEach(function (s) { if (prefs.indexOf(s.pref) === -1) prefs.push(s.pref); });
    tags.append(el('span', 'tag', prefs.join('・')), el('span', 'tag tag-cat', MODE[c.mode] || ''));
    if (c._km != null) tags.append(el('span', 'tag tag-near', '出発地から約' + kmText(c._km) + 'km'));
    head.append(el('h3', 'course-title', c.title), tags);
    art.append(head);
    art.append(el('p', 'course-lead', c.lead));

    var ol = el('ol', 'course-stops');
    c.stops.forEach(function (s, i) {
      if (i) {
        var leg = el('li', 'course-leg', '直線で約' + kmText(distKm(c.stops[i - 1], s)) + 'km');
        leg.setAttribute('aria-hidden', 'true');
        ol.append(leg);
      }
      var li = el('li', 'course-stop');
      li.append(el('span', 'course-num', String(i + 1)));
      var body = el('div', 'course-stop-body');
      var b = el('button', 'course-stop-name', s.name);
      b.type = 'button';
      b.title = 'くわしく見る';
      b.addEventListener('click', function () { openSpot(s.q); });
      var v = info(s.q);
      body.append(b, el('span', 'course-hours', shortHours(v && v.hours)));
      li.append(body);
      ol.append(li);
    });
    art.append(ol);

    art.append(el('p', 'course-total', '全体で直線約' + kmText(totalKm(c)) + 'km（' + c.stops.length + 'か所）。実際の道のりと時間は、道順でご確認ください。'));
    if (c.caution) art.append(el('p', 'course-caution', c.caution));

    var row = el('div', 'course-btns');
    var r = el('a', 'btn-sub', 'Googleマップで道順を見る');
    r.href = routeUrl(c); r.target = '_blank'; r.rel = 'noopener noreferrer';
    var inv = el('a', 'btn-sub btn-invite', 'LINEで誘う');
    inv.href = 'https://line.me/R/share?text=' + encodeURIComponent('モデルコース「' + c.title + '」で一緒にめぐらない？\n' + courseUrl(c));
    inv.target = '_blank'; inv.rel = 'noopener noreferrer';
    row.append(r, inv);
    art.append(row);
    return art;
  }

  function sorted() {
    var list = courses().filter(function (c) { return state.region === 'all' || c.region === state.region; });
    list.forEach(function (c) { c._km = state.origin ? distKm(state.origin, center(c)) : null; });
    if (state.origin) list = list.slice().sort(function (a, b) { return a._km - b._km; });
    return list;
  }

  function render() {
    if (!listEl) return;
    var list = sorted();
    var shown = state.expanded ? list : list.slice(0, SHOW_FIRST);
    listEl.replaceChildren.apply(listEl, shown.map(card));
    moreBtn.hidden = list.length <= SHOW_FIRST;
    moreBtn.textContent = state.expanded ? 'たたむ' : 'ほかのコースも見る（全' + list.length + 'コース）';
    noteEl.textContent = state.origin ? '出発地（' + (state.origin.label || '') + '）から近い順に並べています。' : '';
    Array.prototype.forEach.call(chipsEl.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.dataset.region === state.region ? 'true' : 'false'); });
  }

  function setOrigin(o) {
    state.origin = o && typeof o.lat === 'number' ? o : null;
    render();
  }

  // スポットの近く（km以内）のコース
  function near(spot, km) {
    var out = [];
    courses().forEach(function (c) {
      var d = Infinity;
      c.stops.forEach(function (s) { d = Math.min(d, distKm(spot, s)); });
      if (d <= km) out.push({ c: c, km: d, includes: c.stops.some(function (s) { return s.q === spot.wikidata; }) });
    });
    return out.sort(function (a, b) { return (b.includes - a.includes) || a.km - b.km; });
  }

  // そのコースを表示して、そこまで動く
  function show(id) {
    var c = byId(id);
    if (!c || !listEl) return;
    state.region = 'all';
    var list = sorted();
    if (list.slice(0, SHOW_FIRST).indexOf(c) === -1) state.expanded = true;
    render();
    var t = document.getElementById('course-' + id);
    if (t) {
      t.classList.add('course-focus');
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { t.classList.remove('course-focus'); }, 2400);
    }
  }
  // 「近くのモデルコース」ボタン
  function linkButton(c, label) {
    var b = el('button', 'btn-sub btn-course', label || ('モデルコース「' + c.title + '」を見る'));
    b.type = 'button';
    b.addEventListener('click', function () {
      if (root.SpotDetail) SpotDetail.close();
      show(c.id);
    });
    return b;
  }

  function fromHash() {
    var m = /^#course=(.+)$/.exec(root.location.hash || '');
    if (m) show(decodeURIComponent(m[1]));
  }

  function init() {
    var sec = document.getElementById('courses');
    if (!sec || !courses().length) return;
    listEl = document.getElementById('course-list');
    chipsEl = document.getElementById('course-regions');
    moreBtn = document.getElementById('course-more');
    noteEl = document.getElementById('course-note');
    [['all', 'すべて']].concat(REGIONS.map(function (r) { return [r, r]; })).forEach(function (r) {
      var n = r[0] === 'all' ? courses().length : courses().filter(function (c) { return c.region === r[0]; }).length;
      if (!n) return;
      var b = el('button', 'course-chip', r[1] + '（' + n + '）');
      b.type = 'button';
      b.dataset.region = r[0];
      b.addEventListener('click', function () { state.region = r[0]; state.expanded = false; render(); });
      chipsEl.append(b);
    });
    moreBtn.addEventListener('click', function () {
      state.expanded = !state.expanded;
      render();
      if (!state.expanded) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    render();
    sec.hidden = false;
    fromHash();
    root.addEventListener('hashchange', fromHash);
  }

  var api = { init: init, setOrigin: setOrigin, near: near, show: show, linkButton: linkButton, routeUrl: routeUrl, totalKm: totalKm, REGIONS: REGIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Courses = api;
})(typeof window !== 'undefined' ? window : globalThis);
