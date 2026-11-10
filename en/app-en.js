/*
 * English edition (英語版) — screen logic
 *   Reuses the shared engine: Diagnosis.rankSpots (scoring), Kyusei (Nine Star Ki), SpotData (spot list).
 *   English place names are loaded from Wikidata in the browser (only Wikidata IDs are sent).
 *   英語版の画面処理。点数の計算・九星気学・スポットデータは日本語版と同じものを使う。
 */
(function () {
  'use strict';

  var D = window.Diagnosis, K = window.Kyusei;
  var $ = function (id) { return document.getElementById(id); };
  // Language settings (en/i18n-en.js, overridden by <lang>/i18n.js). 言語ごとの設定と画面の文言
  var LANG = EN.lang || 'en';
  var UI = EN.ui || {};
  function U(key, vars) {
    var t = UI[key] != null ? UI[key] : key;
    if (vars) Object.keys(vars).forEach(function (k) { t = t.split('{' + k + '}').join(vars[k]); });
    return t;
  }
  var SPOT_BASE = EN.spotBase || 'spots/';

  // Visitors care more about well-known places, so fame counts more than on the Japanese site.
  // 訪日客向け：知名度の配分を上げ、日盤・数秘を少し下げる（合計100）
  var cfg = Object.assign({}, APP_CONFIG, {
    weights: { wish: 28, kyusei: 10, day: 8, distance: 18, numerology: 6, fame: 22, reliability: 8 },
    fameFull: 250,
    resultCount: 5,
    spreadKm: 3
  });

  // Spots for visitors (en/pool-en.js): officially checked ones or well-known ones, about 1,400
  var EXC = EN.exclude || null;   // places not suggested in this language (例：中国語・韓国語版では靖国神社・護国神社を出さない)
  var EXC_RE = EXC && EXC.nameRe ? new RegExp(EXC.nameRe) : null;
  var POOL = EnPool.build(window.ALL_SPOTS || []).filter(function (s) {
    return !EXC || ((EXC.q || []).indexOf(s.wikidata) === -1 && !(EXC_RE && EXC_RE.test(s.name)));
  });
  var LBL = window.EN_LABELS || {};   // English name, page slug, enwiki title (data/en-labels.js)

  // The Japanese site always puts "directions to avoid" last. Visitors have only a few days,
  // so here the direction is part of the score (0 points when it should be avoided) and is shown on each card.
  // 訪日客向け：凶方位でも最後尾に回さず、点数（方位0点）と表示で伝える
  // Closer is better even inside the time limit (visitors have little time): distance points fall
  // linearly up to the chosen limit, and the limit itself is applied here.
  function rankForVisitors(input) {
    var limit = input.limitMinutes, modes = {};
    Object.keys(cfg.travelModes).forEach(function (k) {
      modes[k] = Object.assign({}, cfg.travelModes[k], { refMinutes: (limit || cfg.travelModes[k].refMinutes) * 1.5 });
    });
    var c = Object.assign({}, cfg, { travelModes: modes });
    var all = D.rankSpots(POOL, Object.assign({}, input, { limitMinutes: null }), c, { top: POOL.length });
    all.forEach(function (s) { s.withinLimit = !limit || s.minutes <= limit; });
    // a small extra step down for directions to avoid, so lucky ones come first when scores are close
    var key = function (x) { return x.score - (x.fortune && x.fortune.mark === '×' ? 8 : 0); };
    var sorted = all.slice().sort(function (a, b) {
      return (b.withinLimit - a.withinLimit) || (key(b) - key(a)) || ((b.fame || 0) - (a.fame || 0)) || (a.km - b.km);
    });
    sorted.anyWishHit = all.anyWishHit;
    return sorted;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function link(href, text, cls) {
    var a = el('a', cls, text);
    a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function today() { return JSTDate.today(); }

  /* ---------- English names from Wikidata ---------- */
  var LABEL_KEY = 'jps-labels-' + LANG + '-v1';
  var WD_LANGS = EN.wdLangs || ['en'];   // Wikidata label languages, best first
  var labels = {};
  try { labels = JSON.parse(localStorage.getItem(LABEL_KEY) || '{}') || {}; } catch (e) { labels = {}; }
  function saveLabels() { try { localStorage.setItem(LABEL_KEY, JSON.stringify(labels)); } catch (e) { /* storage full or blocked */ } }

  function fetchLabels(qids) {
    var need = qids.filter(function (q, i) { return q && !(q in labels) && (LANG !== 'en' || !(LBL[q] && LBL[q][0]) && !(EN.names && EN.names[q])) && qids.indexOf(q) === i; });
    if (!need.length) return Promise.resolve();
    var chunks = [];
    for (var i = 0; i < need.length; i += 50) chunks.push(need.slice(i, i + 50));
    return Promise.all(chunks.map(function (c) {
      var wikis = WD_LANGS.map(function (l) { return l.split('-')[0] + 'wiki'; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      var url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels%7Csitelinks&languages=' + encodeURIComponent(WD_LANGS.join('|')) +
        '&sitefilter=' + encodeURIComponent(wikis.join('|')) + '&format=json&origin=*&ids=' + encodeURIComponent(c.join('|'));
      return fetch(url).then(function (r) { return r.json(); }).then(function (d) {
        c.forEach(function (q) {
          var e = d.entities && d.entities[q];
          var lab = '', wiki = '', wl = '';
          WD_LANGS.forEach(function (l) { if (!lab && e && e.labels && e.labels[l]) lab = e.labels[l].value; });
          WD_LANGS.forEach(function (l) { var k = l.split('-')[0] + 'wiki'; if (!wiki && e && e.sitelinks && e.sitelinks[k]) { wiki = e.sitelinks[k].title; wl = l.split('-')[0]; } });
          labels[q] = lab || wiki ? { n: lab, w: wiki, l: wl } : null;
        });
      }).catch(function () { /* offline: keep Japanese names */ });
    })).then(saveLabels);
  }
  function withTimeout(p, ms) { return Promise.race([p, new Promise(function (r) { setTimeout(r, ms); })]); }

  // Don't show a label that is just the Japanese name again
  //   en/fr/es/ko: a Wikidata label in the language, then the English name. zh: Chinese label, else the Japanese name (readable in Chinese)
  function enName(s) {
    var q = s.wikidata || s.q;
    var l = labels[q];
    var kana = /[\u3040-\u30ff]/;
    if (LANG !== 'en' && l && l.n && (LANG === 'zh' ? !kana.test(l.n) : !/[\u3040-\u30ff\u4e00-\u9fff]/.test(l.n))) return l.n;
    if (LANG === 'zh') return '';
    if (EN.names && EN.names[q]) return EN.names[q];
    if (LBL[q] && LBL[q][0]) return LBL[q][0];
    if (l && l.n && !/[\u3040-\u30ff\u4e00-\u9fff]/.test(l.n)) return l.n;
    return '';
  }
  function enWiki(q) {
    var l = labels[q];
    if (l && l.w && l.l) return 'https://' + l.l + '.wikipedia.org/wiki/' + encodeURIComponent(l.w.replace(/ /g, '_'));
    var t = LBL[q] && LBL[q][2];
    return t ? 'https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')) : '';
  }
  function pageUrl(q) { return LBL[q] && LBL[q][1] ? SPOT_BASE + LBL[q][1] + '.html' : ''; }
  function listItem(s) {
    var q = s.wikidata || s.q;
    return { q: q, n: enName(s), j: s.name, lat: s.lat, lon: s.lon, s: LBL[q] ? LBL[q][1] : '', c: s.category, p: s.prefecture_code };
  }

  function nameBlock(s, tag) {
    var box = el('div', 'en-namebox');
    var en = enName(s);
    var h = el(tag || 'h3', 'en-name');
    var pu = pageUrl(s.wikidata || s.q);
    if (pu) { var a = el('a', null, en || s.name); a.href = pu; h.append(a); } else h.textContent = en || s.name;
    if (!en) h.lang = 'ja';
    box.append(h);
    if (en && en !== s.name) { var jp = el('span', 'en-jp', s.name); jp.lang = 'ja'; box.append(jp); }
    return box;
  }

  /* ---------- small formatters ---------- */
  function fmtMin(m) {
    if (m < 60) return U('aboutMin', { m: Math.max(5, Math.round(m / 5) * 5) });
    var r = Math.round(m / 10) * 10, h = Math.floor(r / 60), mm = r % 60;
    return mm ? U('aboutHM', { h: h, m: mm }) : U('aboutH', { h: h });
  }
  function fmtKm(km) { return km < 10 ? km.toFixed(1) + ' km' : Math.round(km) + ' km'; }
  var dateFmt = null;
  try { dateFmt = new Intl.DateTimeFormat(EN.locale || 'en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }); } catch (e) { dateFmt = null; }
  function fmtDate(str) {
    var p = str.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return dateFmt ? dateFmt.format(d) : str;
  }
  var SEP = UI.listSep || ', ';
  function dirs(list) { return list.map(function (p) { return EN.palaces[p] || p; }).join(SEP); }
  function wishText(k) { return EN.wishes[k] || k; }

  /* ---------- form parts ---------- */
  function chip(name, value, label, type) {
    var lab = el('label', 'chip');
    var inp = el('input');
    inp.type = type || 'checkbox'; inp.name = name; inp.value = value;
    lab.append(inp, el('span', null, label));
    return lab;
  }

  function buildForm() {
    var tiles = $('wish-tiles');
    EN.wishTiles.forEach(function (t) {
      var b = el('button', 'wish-tile');
      b.type = 'button';
      b.append(el('span', 'en-tile-icon', t.icon), el('span', 'wish-tile-label', t.label));
      b.addEventListener('click', function () {
        document.querySelectorAll('input[name=wish]').forEach(function (c) { c.checked = t.wishes.indexOf(c.value) !== -1; });
        $('finder').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      tiles.append(b);
    });
    EN.wishChips.forEach(function (k) { $('wish-chips').append(chip('wish', k, wishText(k))); });
    EN.expChips.forEach(function (k) { $('exp-chips').append(chip('wish', k, wishText(k))); });
    Object.keys(EN.modes).forEach(function (k, i) {
      var c = chip('mode', k, EN.modes[k].icon + ' ' + EN.modes[k].label, 'radio');
      if (i === 0) c.querySelector('input').checked = true;
      $('mode-chips').append(c);
    });
    var tl = $('time-limit');
    cfg.timeLimits.forEach(function (m) {
      var o = el('option', null, m < 60 ? U('minOpt', { m: m }) : U(m === 60 ? 'hourOpt' : 'hoursOpt', { h: m / 60 }));
      o.value = m; if (m === 120) o.selected = true;
      tl.append(o);
    });
    var any = el('option', null, U('noLimit')); any.value = ''; tl.append(any);

    var sel = $('city');
    var ph = el('option', null, U('chooseCity')); ph.value = ''; sel.append(ph);
    EN.cities.forEach(function (c) { var o = el('option', null, c.label); o.value = c.key; sel.append(o); });
    var pin = el('option', null, U('myPinOpt')); pin.value = 'pin'; pin.hidden = true; sel.append(pin);

    var t = today();
    $('trip-date').min = t;
    $('birthday').max = t;
  }

  /* ---------- starting point ---------- */
  var origin = null, originMap = null, originMarker = null;
  function setOrigin(o, fromMap) {
    origin = o;
    $('origin-status').textContent = U('startingFrom', { p: o.label });
    if (originMap) {
      if (!originMarker) originMarker = L.marker([o.lat, o.lon]).addTo(originMap);
      else originMarker.setLatLng([o.lat, o.lon]);
      if (!fromMap) originMap.setView([o.lat, o.lon], 11);
    }
    try { localStorage.setItem('jps-en-origin', JSON.stringify(o)); } catch (e) { /* ignore */ }
  }
  function initOriginMap() {
    if (!window.L) return;
    originMap = L.map('origin-map', { scrollWheelZoom: false }).setView([36.2, 138.25], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(originMap);
    originMap.on('click', function (e) {
      $('city').value = 'pin';
      setOrigin({ lat: e.latlng.lat, lon: e.latlng.lng, label: U('yourPin') }, true);
    });
  }
  function initOrigin() {
    initOriginMap();
    $('city').addEventListener('change', function () {
      var c = EN.cities.filter(function (x) { return x.key === this.value; }, this)[0];
      if (c) setOrigin({ lat: c.lat, lon: c.lon, label: c.label, key: c.key });
    });
    $('use-location').addEventListener('click', function () {
      if (!navigator.geolocation) { $('origin-status').textContent = U('noGeo'); return; }
      $('origin-status').textContent = U('findingLoc');
      navigator.geolocation.getCurrentPosition(function (p) {
        $('city').value = 'pin';
        setOrigin({ lat: p.coords.latitude, lon: p.coords.longitude, label: U('yourLocation') });
      }, function () { $('origin-status').textContent = U('geoFail'); }, { timeout: 10000 });
    });
    try {
      var saved = JSON.parse(localStorage.getItem('jps-en-origin') || 'null');
      if (saved && saved.lat) { $('city').value = saved.key || 'pin'; setOrigin(saved); }
    } catch (e) { /* ignore */ }
    try { var b = localStorage.getItem('jps-en-bday'); if (b) $('birthday').value = b; } catch (e) { /* ignore */ }
  }

  /* ---------- validation ---------- */
  function checkBirthday(v) {
    if (!v) return U('errBday');
    var p = v.split('-').map(Number);
    if (p.length !== 3 || p[0] < 1900) return U('errBday1900');
    if (v > today()) return U('errBdayFuture');
    return null;
  }

  /* ---------- results ---------- */
  function pickSpread(list, n, km) {
    var out = [];
    for (var i = 0; i < list.length && out.length < n; i++) {
      var s = list[i];
      if (out.every(function (o) { return D.distanceKm(o.lat, o.lon, s.lat, s.lon) >= km; })) out.push(s);
    }
    return out;
  }

  var resultMap = null, resultLayer = null;
  function drawMap(o, spots) {
    if (!window.L) return;
    if (!resultMap) {
      resultMap = L.map('result-map', { scrollWheelZoom: false });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(resultMap);
      resultLayer = L.layerGroup().addTo(resultMap);
    }
    resultLayer.clearLayers();
    var pts = [[o.lat, o.lon]];
    L.circleMarker([o.lat, o.lon], { radius: 9, color: '#3F2A5E', fillColor: '#D2AE68', fillOpacity: 1 }).bindTooltip(U('start')).addTo(resultLayer);
    spots.forEach(function (s, i) {
      var icon = L.divIcon({ className: 'en-pin', html: '<span>' + (i + 1) + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] });
      L.marker([s.lat, s.lon], { icon: icon }).bindTooltip((i + 1) + '. ' + (enName(s) || s.name)).addTo(resultLayer);
      pts.push([s.lat, s.lon]);
    });
    setTimeout(function () { resultMap.invalidateSize(); resultMap.fitBounds(pts, { padding: [30, 30], maxZoom: 13 }); }, 50);
  }

  function gmapsDir(o, s, modeKey) {
    var m = cfg.travelModes[modeKey] ? cfg.travelModes[modeKey].gmaps : 'transit';
    return 'https://www.google.com/maps/dir/?api=1&origin=' + o.lat + ',' + o.lon + '&destination=' + s.lat + ',' + s.lon + '&travelmode=' + m;
  }

  function youBox(n, stars, tripDate) {
    var box = $('you-box');
    box.replaceChildren();
    var ol = K.outlook(stars, today(), 1);
    var a = el('div', 'en-you-item');
    a.append(el('div', 'en-you-label', U('yourStar')), el('div', 'en-you-value', EN.stars[stars.honmei]), el('p', 'small', EN.starNature[stars.honmei]));
    var b = el('div', 'en-you-item');
    b.append(el('div', 'en-you-label', U('yourLifePath')), el('div', 'en-you-value', String(n)), el('p', 'small', U('theme', { t: EN.numerology[n] })));
    var c = el('div', 'en-you-item');
    c.append(el('div', 'en-you-label', U('luckyDirsYear')),
      el('div', 'en-you-value en-you-dirs', ol.yearGood.length ? dirs(ol.yearGood) : U('noneThisYear')),
      el('p', 'small', ol.yearKyo.length ? U('avoidLong', { d: dirs(ol.yearKyo.map(function (x) { return x.dir; })) }) : ''));
    box.append(a, b, c);
    if (stars.notes && stars.notes.length) box.append(el('p', 'note en-you-note', U('bornOnTerm')));
    box.append(el('p', 'note en-you-note', tripDate
      ? U('dirsForDate', { d: fmtDate(tripDate) })
      : U('dirsThisMonth')));
  }

  function card(s, i, ctx) {
    var art = el('article', 'card en-card');
    art.append(el('div', 'rank', String(i + 1)));
    var body = el('div', 'en-card-body');
    body.append(nameBlock(s));
    var meta = el('p', 'en-meta');
    meta.textContent = (EN.categories[s.category] || s.category) + ' · ' + (EN.prefectures[s.prefecture_code] || '') +
      ' · ' + U('byMode', { t: fmtMin(s.minutes), m: EN.modes[ctx.mode].lower || EN.modes[ctx.mode].label.toLowerCase() }) + ' (' + fmtKm(s.km) +
      (s.direction && s.direction !== '—' ? SEP + (EN.palaces[s.direction] || s.direction) : '') + ')';
    body.append(meta);

    var days = (!ctx.tripDate && s.km >= 1) ? D.pickGoodDays(D.goodDays([ctx.stars], s.bearing, s.km, cfg, today(), 60), 4) : [];
    if (s.fortune) {
      var mk = s.fortune.mark, f = EN.fortune[mk] || EN.fortune['―'], txt;
      if (s.km < 1) txt = U('tooClose');
      else if (mk === '×') txt = U(ctx.tripDate ? 'notLuckyDay' : 'notLuckyMonth') + (days.length ? U('luckyAgain', { d: fmtDate(days[0].date) }) : '');
      else txt = f.text + U(ctx.tripDate ? 'onThatDay' : 'forYouThisMonth');
      body.append(el('p', 'en-fortune en-' + (s.km < 1 ? 'neutral' : f.cls), mk + ' ' + txt));
    }

    var why = el('ul', 'en-why');
    if (s.hitWishes.length) why.append(el('li', null, U('matchesWish', { w: s.hitWishes.map(wishText).join(SEP) })));
    if (s.numMatch) why.append(el('li', null, U('resonates', { n: ctx.n, t: EN.numerology[ctx.n] })));
    var blessings = (s.wishesInferred || []).filter(function (k) { return s.hitWishes.indexOf(k) === -1; }).slice(0, 4);
    if (blessings.length) why.append(el('li', null, U('tradFor', { w: blessings.map(wishText).join(SEP) })));
    if (s.verified) why.append(el('li', 'en-ok', U('checkedOfficial')));
    if (why.childNodes.length) body.append(why);

    if (days.length) {
      {
        var gd = el('div', 'en-good-days');
        gd.append(el('span', 'en-gd-label', U('goodDays')));
        days.forEach(function (d) {
          var b = el('button', 'en-gd' + (d.dayGood ? ' en-gd-best' : ''), (d.dayGood ? '◎ ' : '○ ') + fmtDate(d.date));
          b.type = 'button';
          b.title = U('checkThisDay');
          b.addEventListener('click', function () { $('trip-date').value = d.date; run(); });
          gd.append(b);
        });
        body.append(gd);
      }
    }

    var btns = el('div', 'en-btns');
    btns.append(link(gmapsDir(ctx.origin, s, ctx.mode), U('directionsGM'), 'btn-main en-btn'));
    var w = enWiki(s.wikidata);
    if (w) btns.append(link(w, 'Wikipedia', 'btn-sub en-btn'));
    if (s.verified && s.verified.official) btns.append(link(s.verified.official, U('officialSite'), 'btn-sub en-btn'));
    btns.append(MyList.button(listItem(s), 'en-btn'));
    body.append(btns);
    art.append(body);
    return art;
  }

  function addPhotos(items) {
    if (!window.SpotPhotos) return;
    SpotPhotos.lookup(items.map(function (x) { return x.s.wikidata; })).then(function (res) {
      items.forEach(function (x) {
        var info = res[x.s.wikidata];
        if (!info) return;
        var fig = el('figure', 'photo en-photo');
        var img = el('img');
        img.src = info.thumb; img.alt = U('photoOf', { n: enName(x.s) || x.s.name }); img.loading = 'lazy'; img.decoding = 'async';
        img.onerror = function () { fig.remove(); };
        var cap = el('figcaption');
        cap.append(link(info.page, U('photoCredit', { a: info.artist, l: info.license })));
        fig.append(img, cap);
        x.el.querySelector('.rank').after(fig);
      });
    });
  }

  function showError(list) {
    var box = $('form-error');
    box.replaceChildren();
    if (!list.length) { box.hidden = true; return; }
    var ul = el('ul');
    list.forEach(function (m) { ul.append(el('li', null, m)); });
    box.append(ul);
    box.hidden = false;
    box.focus();
  }

  function run() {
    var bday = $('birthday').value, tripDate = $('trip-date').value || '';
    var errs = [];
    var be = checkBirthday(bday); if (be) errs.push(be);
    if (!origin) errs.push(U('errOrigin'));
    if (tripDate && tripDate < today()) errs.push(U('errTripDate'));
    showError(errs);
    if (errs.length) return;
    try { localStorage.setItem('jps-en-bday', bday); } catch (e) { /* ignore */ }

    var wishes = Array.from(document.querySelectorAll('input[name=wish]:checked')).map(function (c) { return c.value; });
    var mode = document.querySelector('input[name=mode]:checked').value;
    var limit = Number($('time-limit').value) || null;
    var n = D.lifePath(bday);
    var stars = K.birthStars(bday);
    var boards = tripDate ? K.boardsFor(tripDate, stars) : Object.assign(K.boardsFor(today(), stars), { noDay: true });
    var all = rankForVisitors({ number: n, numbers: [n], origin: origin, wishes: wishes, mode: mode, limitMinutes: limit, boards: boards });
    var within = all.filter(function (s) { return s.withinLimit; });
    var shown = pickSpread(within.length ? within : all, cfg.resultCount, cfg.spreadKm);
    var more = (within.length ? within : all).filter(function (s) { return shown.indexOf(s) === -1; }).slice(0, 10);
    var ctx = { n: n, stars: stars, tripDate: tripDate, mode: mode, origin: origin };

    var res = $('results');
    res.hidden = false;
    $('result-cards').replaceChildren(el('p', 'small', U('finding')));
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });

    withTimeout(fetchLabels(shown.concat(more).map(function (s) { return s.wikidata; })), 4000).then(function () {
      youBox(n, stars, tripDate);
      var wrap = $('result-cards');
      wrap.replaceChildren();
      if (!within.length) wrap.append(el('p', 'notice', U('noneWithin')));
      else if (wishes.length && !all.anyWishHit) wrap.append(el('p', 'notice', U('noWishMatch')));
      var items = shown.map(function (s, i) { var c = card(s, i, ctx); wrap.append(c); return { s: s, el: c }; });
      addPhotos(items);

      var mb = $('more-box');
      mb.replaceChildren();
      if (more.length) {
        var det = el('details', 'en-more');
        det.append(el('summary', null, U('moreNearby', { n: more.length })));
        var ul = el('ul', 'en-more-list');
        more.forEach(function (s) {
          var li = el('li');
          var a = link(gmapsDir(origin, s, mode), enName(s) || s.name);
          if (!enName(s)) a.lang = 'ja';
          li.append(a, document.createTextNode(' — ' + (EN.categories[s.category] || s.category) + SEP + (EN.prefectures[s.prefecture_code] || '') + SEP + fmtMin(s.minutes)));
          ul.append(li);
        });
        det.append(ul);
        mb.append(det);
      }
      drawMap(origin, shown);
    });
  }

  /* ---------- model routes ---------- */
  var courseRegion = null;
  function renderCourses() {
    var list = window.MODEL_COURSES || [];
    var regions = [];
    list.forEach(function (c) { if (regions.indexOf(c.region) === -1) regions.push(c.region); });
    if (!courseRegion) courseRegion = regions.indexOf('近畿') !== -1 ? '近畿' : regions[0];
    var tabs = $('course-regions');
    tabs.replaceChildren();
    regions.forEach(function (r) {
      var b = el('button', 'en-region' + (r === courseRegion ? ' is-on' : ''), EN.regions[r] || r);
      b.type = 'button';
      b.setAttribute('aria-pressed', r === courseRegion ? 'true' : 'false');
      b.addEventListener('click', function () { courseRegion = r; renderCourses(); });
      tabs.append(b);
    });
    var box = $('course-list');
    box.replaceChildren();
    list.filter(function (c) { return c.region === courseRegion; }).forEach(function (c) {
      var t = EN.courses[c.id] || [c.title, c.lead];
      var art = el('article', 'en-course');
      art.append(el('h3', 'en-course-title', t[0]), el('p', 'small', t[1] + ' ' + U(c.mode === 'car' ? 'bestByCar' : 'easyByTrain')));
      var ol = el('ol', 'en-course-stops');
      c.stops.forEach(function (st) {
        var li = el('li');
        var en = enName({ q: st.q });
        var pu = pageUrl(st.q);
        var nm = el(pu ? 'a' : 'span', 'en-stop-name', en || st.name);
        if (pu) nm.href = pu;
        if (!en) nm.lang = 'ja';
        li.append(nm);
        if (en && en !== st.name) { var jp = el('span', 'en-jp', st.name); jp.lang = 'ja'; li.append(jp); }
        ol.append(li);
      });
      art.append(ol);
      var route = 'https://www.google.com/maps/dir/' + c.stops.map(function (st) { return st.lat + ',' + st.lon; }).join('/');
      art.append(link(route, U('openRoute'), 'btn-sub en-btn'));
      box.append(art);
    });
  }


  /* ---------- trip planner (旅行プランナー) ---------- */
  var MAX_DAYS = 21;
  function addDays(str, n) { return D.addDays(str, n); }
  function legRow(leg) {
    var row = el('div', 'en-leg');
    var city = el('select', 'en-leg-city'); city.setAttribute('aria-label', U('city'));
    EN.cities.forEach(function (c) { var o = el('option', null, c.label); o.value = c.key; city.append(o); });
    var from = el('input', 'en-leg-from'); from.type = 'date'; from.min = today(); from.setAttribute('aria-label', U('arrival'));
    var nights = el('select', 'en-leg-days'); nights.setAttribute('aria-label', U('daysLabel'));
    for (var i = 1; i <= 10; i++) { var o = el('option', null, U(i === 1 ? 'oneDay' : 'nDays', { n: i })); o.value = i; nights.append(o); }
    var del = el('button', 'en-leg-del', '✕'); del.type = 'button'; del.title = U('removeCity');
    del.addEventListener('click', function () { if ($('legs').children.length > 1) row.remove(); });
    city.value = leg.city; from.value = leg.from || ''; nights.value = leg.days || 2;
    var l1 = el('label', null, U('city')), l2 = el('label', null, U('from')), l3 = el('label', null, U('for'));
    l1.append(city); l2.append(from); l3.append(nights);
    row.append(l1, l2, l3, del);
    return row;
  }
  function readLegs() {
    return Array.from(document.querySelectorAll('.en-leg')).map(function (r) {
      return { city: r.querySelector('.en-leg-city').value, from: r.querySelector('.en-leg-from').value, days: Number(r.querySelector('.en-leg-days').value) };
    });
  }
  function initPlanner() {
    var tiles = $('plan-wish');
    var any = el('option', null, U('anything')); any.value = ''; tiles.append(any);
    EN.wishTiles.forEach(function (t, i) { var o = el('option', null, t.icon + ' ' + t.label); o.value = String(i); tiles.append(o); });
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem('jps-en-plan') || 'null'); } catch (e) { saved = null; }
    var legs = saved && saved.legs && saved.legs.length ? saved.legs : [{ city: 'tokyo', from: '', days: 3 }, { city: 'kyoto', from: '', days: 2 }];
    legs.forEach(function (l) { $('legs').append(legRow(l)); });
    if (saved && saved.wish != null) tiles.value = saved.wish;
    try { var b = localStorage.getItem('jps-en-bday'); if (b) $('plan-bday').value = b; } catch (e) { /* ignore */ }
    $('plan-bday').max = today();
    $('add-leg').addEventListener('click', function () {
      var ls = readLegs(), last = ls[ls.length - 1];
      var next = last && last.from ? addDays(last.from, last.days) : '';
      $('legs').append(legRow({ city: 'osaka', from: next, days: 2 }));
    });
    // when a date changes, fill the next city's date automatically
    $('legs').addEventListener('change', function () {
      var rows = document.querySelectorAll('.en-leg');
      for (var i = 1; i < rows.length; i++) {
        var prev = rows[i - 1], f = prev.querySelector('.en-leg-from').value, cur = rows[i].querySelector('.en-leg-from');
        if (f && !cur.dataset.touched) cur.value = addDays(f, Number(prev.querySelector('.en-leg-days').value));
      }
    });
    $('legs').addEventListener('input', function (e) { if (e.target.classList.contains('en-leg-from')) e.target.dataset.touched = '1'; });
    $('plan-form').addEventListener('submit', function (e) { e.preventDefault(); runPlan(); });
  }

  function runPlan() {
    var bday = $('plan-bday').value, legs = readLegs(), errs = [];
    var be = checkBirthday(bday); if (be) errs.push(be);
    legs.forEach(function (l, i) { if (!l.from) errs.push(U('errLegDate', { n: i + 1 })); else if (l.from < today()) errs.push(U('errLegPast', { n: i + 1 })); });
    var box = $('plan-error'); box.replaceChildren();
    if (errs.length) { var ul = el('ul'); errs.forEach(function (m) { ul.append(el('li', null, m)); }); box.append(ul); box.hidden = false; return; }
    box.hidden = true;
    var wishIdx = $('plan-wish').value;
    var wishes = wishIdx === '' ? [] : EN.wishTiles[Number(wishIdx)].wishes;
    try { localStorage.setItem('jps-en-bday', bday); localStorage.setItem('jps-en-plan', JSON.stringify({ legs: legs, wish: wishIdx })); } catch (e) { /* ignore */ }
    var n = D.lifePath(bday), stars = K.birthStars(bday);
    var days = [];
    legs.forEach(function (l) { for (var i = 0; i < l.days; i++) days.push({ date: addDays(l.from, i), city: EN.cities.filter(function (c) { return c.key === l.city; })[0] }); });
    days.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    days = days.slice(0, MAX_DAYS);
    var used = {}, all = [];
    var plan = days.map(function (d) {
      var origin = { lat: d.city.lat, lon: d.city.lon, label: d.city.label };
      var ranked = rankForVisitors({ number: n, numbers: [n], origin: origin, wishes: wishes, mode: 'transit', limitMinutes: 90, boards: K.boardsFor(d.date, stars) });
      var pick = [];
      for (var i = 0; i < ranked.length && pick.length < 2; i++) {
        var s = ranked[i];
        if (!s.withinLimit || used[s.wikidata] || (s.fortune && (s.fortune.mark === '×' || s.fortune.mark === '△'))) continue;
        if (pick.some(function (p) { return D.distanceKm(p.lat, p.lon, s.lat, s.lon) < 2; })) continue;
        used[s.wikidata] = true; pick.push(s);
      }
      // if no lucky direction is available, fall back to the best places anyway
      for (var j = 0; j < ranked.length && pick.length < 2; j++) {
        var t = ranked[j];
        if (!t.withinLimit || used[t.wikidata]) continue;
        used[t.wikidata] = true; pick.push(t);
      }
      all = all.concat(pick);
      return { d: d, origin: origin, pick: pick };
    });
    var out = $('plan-out');
    out.replaceChildren(el('p', 'small', U('planning')));
    withTimeout(fetchLabels(all.map(function (s) { return s.wikidata; })), 4000).then(function () {
      out.replaceChildren();
      out.append(el('p', 'note', U('planIntro', { s: EN.stars[stars.honmei] })));
      plan.forEach(function (x, i) {
        var day = el('section', 'en-day');
        day.append(el('h3', 'en-day-title', U('dayN', { n: i + 1 }) + ' · ' + fmtDate(x.d.date) + ' · ' + x.d.city.label));
        var list = el('div', 'en-day-list');
        x.pick.forEach(function (s) {
          var it = el('div', 'en-day-item');
          it.append(nameBlock(s, 'h4'));
          it.append(el('p', 'en-meta', (EN.categories[s.category] || s.category) + ' · ' + U('byMode', { t: fmtMin(s.minutes), m: EN.modes.transit.lower || EN.modes.transit.label.toLowerCase() }) + ' (' + fmtKm(s.km) + ')'));
          if (s.fortune) {
            var f = EN.fortune[s.fortune.mark] || EN.fortune['―'];
            it.append(el('p', 'en-fortune en-' + (s.km < 1 ? 'neutral' : f.cls), s.km < 1 ? U('closeHotel') : s.fortune.mark + ' ' + (s.fortune.mark === '×' ? U('notLuckyButBest') : f.text + U('onThatDay'))));
          }
          if (s.hitWishes.length) it.append(el('p', 'small', U('matchesWish', { w: s.hitWishes.map(wishText).join(SEP) })));
          var bt = el('div', 'en-btns');
          bt.append(link(gmapsDir(x.origin, s, 'transit'), U('directions'), 'btn-sub en-btn'), MyList.button(listItem(s), 'en-btn'));
          it.append(bt);
          list.append(it);
        });
        if (!x.pick.length) list.append(el('p', 'small', U('freeDay')));
        day.append(list);
        out.append(day);
      });
      var saveAll = el('button', 'btn-sub en-btn', U('saveAll'));
      saveAll.type = 'button';
      saveAll.addEventListener('click', function () { all.forEach(function (s) { MyList.add(listItem(s)); }); saveAll.textContent = U('savedAll'); });
      out.append(saveAll);
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- my list (行きたい場所リスト) ---------- */
  function renderList() {
    var items = MyList.read();
    document.querySelectorAll('[data-mylist-count]').forEach(function (e) { e.textContent = items.length ? '(' + items.length + ')' : ''; });
    var box = $('mylist-items'); box.replaceChildren();
    $('mylist-actions').hidden = !items.length;
    if (!items.length) { box.append(el('p', 'small', U('listEmpty'))); return; }
    var ol = el('ol', 'en-list');
    items.forEach(function (x) {
      var li = el('li');
      var name = x.s ? el('a', null, x.n || x.j) : el('span', null, x.n || x.j);
      if (x.s) name.href = SPOT_BASE + x.s + '.html';
      if (!x.n) name.lang = 'ja';
      li.append(name);
      if (x.n && x.n !== x.j) { var jp = el('span', 'en-jp-inline', ' ' + x.j); jp.lang = 'ja'; li.append(jp); }
      li.append(el('span', 'small', ' · ' + (EN.categories[x.c] || '') + (x.p ? SEP + EN.prefectures[x.p] : '')));
      var rm = el('button', 'en-leg-del', '✕'); rm.type = 'button'; rm.title = U('remove');
      rm.addEventListener('click', function () { MyList.remove(x.q); });
      li.append(rm);
      ol.append(li);
    });
    box.append(ol);
    $('list-route').href = MyList.routeUrl(items);
    $('list-route').textContent = U(items.length > 10 ? 'openFirst10' : 'openAsRoute');
  }
  function initList() {
    MyList.onChange(renderList);
    renderList();
    $('list-csv').addEventListener('click', function () {
      var blob = new Blob([MyList.csv(MyList.read(), APP_CONFIG.siteUrl + 'en/spots/')], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-japan-power-spots.csv';
      document.body.append(a); a.click(); a.remove();
    });
    $('list-share').addEventListener('click', function () {
      var url = APP_CONFIG.siteUrl + LANG + '/' + MyList.shareHash(MyList.read());
      var done = function () { $('list-msg').textContent = U('linkCopied'); };
      if (navigator.share) navigator.share({ title: U('shareTitle'), url: url }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { $('list-msg').textContent = url; });
      else $('list-msg').textContent = url;
    });
    // a shared list in the URL: #list=Q1,Q2
    var m = /#list=([Q0-9,]+)/.exec(location.hash);
    if (m) {
      var qs = m[1].split(',');
      var found = qs.map(function (q) { return POOL.filter(function (s) { return s.wikidata === q; })[0]; }).filter(Boolean);
      if (found.length) {
        fetchLabels(qs).then(function () {
          var box = $('shared-list'); box.hidden = false; box.replaceChildren();
          box.append(el('p', null, U('friendShared', { n: found.length })));
          var ul = el('ul', 'en-list');
          found.forEach(function (s) { var li = el('li'); li.append(nameBlock(s, 'span')); ul.append(li); });
          var add = el('button', 'btn-sub en-btn', U('addAll')); add.type = 'button';
          add.addEventListener('click', function () { found.forEach(function (s) { MyList.add(listItem(s)); }); box.hidden = true; });
          box.append(ul, add);
          $('mylist').scrollIntoView({ block: 'start' });
        });
      }
    }
  }

  /* ---------- start ---------- */
  buildForm();
  initOrigin();
  renderCourses();
  initPlanner();
  initList();
  $('finder-form').addEventListener('submit', function (e) { e.preventDefault(); run(); });
  var qs = [];
  (window.MODEL_COURSES || []).forEach(function (c) { c.stops.forEach(function (s) { qs.push(s.q); }); });
  fetchLabels(qs).then(renderCourses);
})();
