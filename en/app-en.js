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

  // Visitors care more about well-known places, so fame counts more than on the Japanese site.
  // 訪日客向け：知名度の配分を上げ、日盤・数秘を少し下げる（合計100）
  var cfg = Object.assign({}, APP_CONFIG, {
    weights: { wish: 28, kyusei: 10, day: 8, distance: 18, numerology: 6, fame: 22, reliability: 8 },
    fameFull: 250,
    resultCount: 5,
    spreadKm: 3
  });

  // Spots for visitors (en/pool-en.js): officially checked ones or well-known ones, about 1,400
  var POOL = EnPool.build(window.ALL_SPOTS || []);
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
  var LABEL_KEY = 'jps-en-labels-v1';
  var labels = {};
  try { labels = JSON.parse(localStorage.getItem(LABEL_KEY) || '{}') || {}; } catch (e) { labels = {}; }
  function saveLabels() { try { localStorage.setItem(LABEL_KEY, JSON.stringify(labels)); } catch (e) { /* storage full or blocked */ } }

  function fetchLabels(qids) {
    var need = qids.filter(function (q, i) { return q && !(q in labels) && !(LBL[q] && LBL[q][0]) && !(EN.names && EN.names[q]) && qids.indexOf(q) === i; });
    if (!need.length) return Promise.resolve();
    var chunks = [];
    for (var i = 0; i < need.length; i += 50) chunks.push(need.slice(i, i + 50));
    return Promise.all(chunks.map(function (c) {
      var url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels%7Csitelinks&languages=en&sitefilter=enwiki&format=json&origin=*&ids=' + encodeURIComponent(c.join('|'));
      return fetch(url).then(function (r) { return r.json(); }).then(function (d) {
        c.forEach(function (q) {
          var e = d.entities && d.entities[q];
          var lab = e && e.labels && e.labels.en && e.labels.en.value;
          var wiki = e && e.sitelinks && e.sitelinks.enwiki && e.sitelinks.enwiki.title;
          labels[q] = lab ? { n: lab, w: wiki || '' } : null;
        });
      }).catch(function () { /* offline: keep Japanese names */ });
    })).then(saveLabels);
  }
  function withTimeout(p, ms) { return Promise.race([p, new Promise(function (r) { setTimeout(r, ms); })]); }

  // Don't show a label that is just the Japanese name again
  function enName(s) {
    var q = s.wikidata || s.q;
    if (EN.names && EN.names[q]) return EN.names[q];
    if (LBL[q] && LBL[q][0]) return LBL[q][0];
    var l = labels[q];
    if (l && l.n && !/[\u3040-\u30ff\u4e00-\u9fff]/.test(l.n)) return l.n;
    return '';
  }
  function enWiki(q) {
    var t = (LBL[q] && LBL[q][2]) || (labels[q] && labels[q].w);
    return t ? 'https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')) : '';
  }
  function pageUrl(q) { return LBL[q] && LBL[q][1] ? 'spots/' + LBL[q][1] + '.html' : ''; }
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
    if (en) { var jp = el('span', 'en-jp', s.name); jp.lang = 'ja'; box.append(jp); }
    return box;
  }

  /* ---------- small formatters ---------- */
  function fmtMin(m) {
    if (m < 60) return 'about ' + Math.max(5, Math.round(m / 5) * 5) + ' min';
    var r = Math.round(m / 10) * 10, h = Math.floor(r / 60), mm = r % 60;
    return 'about ' + h + ' h' + (mm ? ' ' + mm + ' min' : '');
  }
  function fmtKm(km) { return km < 10 ? km.toFixed(1) + ' km' : Math.round(km) + ' km'; }
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(str) {
    var p = str.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return WD[d.getUTCDay()] + ', ' + MON[p[1] - 1] + ' ' + p[2];
  }
  function dirs(list) { return list.map(function (p) { return EN.palaces[p] || p; }).join(', '); }
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
      var o = el('option', null, m < 60 ? m + ' min' : (m / 60) + (m === 60 ? ' hour' : ' hours'));
      o.value = m; if (m === 120) o.selected = true;
      tl.append(o);
    });
    var any = el('option', null, 'no limit'); any.value = ''; tl.append(any);

    var sel = $('city');
    var ph = el('option', null, 'Choose a city…'); ph.value = ''; sel.append(ph);
    EN.cities.forEach(function (c) { var o = el('option', null, c.label); o.value = c.key; sel.append(o); });
    var pin = el('option', null, 'My pin on the map'); pin.value = 'pin'; pin.hidden = true; sel.append(pin);

    var t = today();
    $('trip-date').min = t;
    $('birthday').max = t;
  }

  /* ---------- starting point ---------- */
  var origin = null, originMap = null, originMarker = null;
  function setOrigin(o, fromMap) {
    origin = o;
    $('origin-status').textContent = 'Starting from: ' + o.label;
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
      setOrigin({ lat: e.latlng.lat, lon: e.latlng.lng, label: 'your pin on the map' }, true);
    });
  }
  function initOrigin() {
    initOriginMap();
    $('city').addEventListener('change', function () {
      var c = EN.cities.filter(function (x) { return x.key === this.value; }, this)[0];
      if (c) setOrigin({ lat: c.lat, lon: c.lon, label: c.label, key: c.key });
    });
    $('use-location').addEventListener('click', function () {
      if (!navigator.geolocation) { $('origin-status').textContent = 'Your browser cannot share its location. Please choose a city.'; return; }
      $('origin-status').textContent = 'Finding your location…';
      navigator.geolocation.getCurrentPosition(function (p) {
        $('city').value = 'pin';
        setOrigin({ lat: p.coords.latitude, lon: p.coords.longitude, label: 'your current location' });
      }, function () { $('origin-status').textContent = 'Could not get your location. Please choose a city or tap the map.'; }, { timeout: 10000 });
    });
    try {
      var saved = JSON.parse(localStorage.getItem('jps-en-origin') || 'null');
      if (saved && saved.lat) { $('city').value = saved.key || 'pin'; setOrigin(saved); }
    } catch (e) { /* ignore */ }
    try { var b = localStorage.getItem('jps-en-bday'); if (b) $('birthday').value = b; } catch (e) { /* ignore */ }
  }

  /* ---------- validation ---------- */
  function checkBirthday(v) {
    if (!v) return 'Please enter your birthday.';
    var p = v.split('-').map(Number);
    if (p.length !== 3 || p[0] < 1900) return 'Please enter a birthday from 1900 or later.';
    if (v > today()) return 'Your birthday cannot be in the future.';
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
    L.circleMarker([o.lat, o.lon], { radius: 9, color: '#3F2A5E', fillColor: '#D2AE68', fillOpacity: 1 }).bindTooltip('Start').addTo(resultLayer);
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
    a.append(el('div', 'en-you-label', 'Your Nine Star Ki'), el('div', 'en-you-value', EN.stars[stars.honmei]), el('p', 'small', EN.starNature[stars.honmei]));
    var b = el('div', 'en-you-item');
    b.append(el('div', 'en-you-label', 'Your life path number'), el('div', 'en-you-value', String(n)), el('p', 'small', 'Theme: ' + EN.numerology[n] + '.'));
    var c = el('div', 'en-you-item');
    c.append(el('div', 'en-you-label', 'Lucky directions this year'),
      el('div', 'en-you-value en-you-dirs', ol.yearGood.length ? dirs(ol.yearGood) : 'None this year'),
      el('p', 'small', ol.yearKyo.length ? 'Better avoided for long trips: ' + dirs(ol.yearKyo.map(function (x) { return x.dir; })) + '.' : ''));
    box.append(a, b, c);
    if (stars.notes && stars.notes.length) box.append(el('p', 'note en-you-note', 'You were born on a seasonal turning day of the Japanese calendar, so your stars may differ depending on your birth time.'));
    box.append(el('p', 'note en-you-note', tripDate
      ? 'Directions are checked from your starting point for ' + fmtDate(tripDate) + '.'
      : 'No date chosen, so directions are checked for this month. Each spot also shows good days to go.'));
  }

  function card(s, i, ctx) {
    var art = el('article', 'card en-card');
    art.append(el('div', 'rank', String(i + 1)));
    var body = el('div', 'en-card-body');
    body.append(nameBlock(s));
    var meta = el('p', 'en-meta');
    meta.textContent = (EN.categories[s.category] || s.category) + ' · ' + (EN.prefectures[s.prefecture_code] || '') +
      ' · ' + fmtMin(s.minutes) + ' by ' + EN.modes[ctx.mode].label.toLowerCase() + ' (' + fmtKm(s.km) +
      (s.direction && s.direction !== '—' ? ', ' + (EN.palaces[s.direction] || s.direction) : '') + ')';
    body.append(meta);

    var days = (!ctx.tripDate && s.km >= 1) ? D.pickGoodDays(D.goodDays([ctx.stars], s.bearing, s.km, cfg, today(), 60), 4) : [];
    if (s.fortune) {
      var mk = s.fortune.mark, f = EN.fortune[mk] || EN.fortune['―'], txt;
      if (s.km < 1) txt = 'Very close to your starting point, so direction does not apply';
      else if (mk === '×') txt = 'Not a lucky direction for you ' + (ctx.tripDate ? 'on that day' : 'this month') + (days.length ? '. Lucky again from ' + fmtDate(days[0].date) : '');
      else txt = f.text + (ctx.tripDate ? ' on that day' : ' for you this month');
      body.append(el('p', 'en-fortune en-' + (s.km < 1 ? 'neutral' : f.cls), mk + ' ' + txt));
    }

    var why = el('ul', 'en-why');
    if (s.hitWishes.length) why.append(el('li', null, 'Matches your wish: ' + s.hitWishes.map(wishText).join(', ')));
    if (s.numMatch) why.append(el('li', null, 'Resonates with your life path number ' + ctx.n + ' (' + EN.numerology[ctx.n] + ')'));
    var blessings = (s.wishesInferred || []).filter(function (k) { return s.hitWishes.indexOf(k) === -1; }).slice(0, 4);
    if (blessings.length) why.append(el('li', null, 'Traditionally visited for: ' + blessings.map(wishText).join(', ')));
    if (s.verified) why.append(el('li', 'en-ok', 'Details checked on the official website'));
    if (why.childNodes.length) body.append(why);

    if (days.length) {
      {
        var gd = el('div', 'en-good-days');
        gd.append(el('span', 'en-gd-label', 'Good days to go:'));
        days.forEach(function (d) {
          var b = el('button', 'en-gd' + (d.dayGood ? ' en-gd-best' : ''), (d.dayGood ? '◎ ' : '○ ') + fmtDate(d.date));
          b.type = 'button';
          b.title = 'Check spots for this day';
          b.addEventListener('click', function () { $('trip-date').value = d.date; run(); });
          gd.append(b);
        });
        body.append(gd);
      }
    }

    var btns = el('div', 'en-btns');
    btns.append(link(gmapsDir(ctx.origin, s, ctx.mode), 'Directions (Google Maps)', 'btn-main en-btn'));
    var w = enWiki(s.wikidata);
    if (w) btns.append(link(w, 'Wikipedia', 'btn-sub en-btn'));
    if (s.verified && s.verified.official) btns.append(link(s.verified.official, 'Official site', 'btn-sub en-btn'));
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
        img.src = info.thumb; img.alt = 'Photo of ' + (enName(x.s) || x.s.name); img.loading = 'lazy'; img.decoding = 'async';
        img.onerror = function () { fig.remove(); };
        var cap = el('figcaption');
        cap.append(link(info.page, 'Photo: ' + info.artist + ' / ' + info.license + ' (Wikimedia Commons)'));
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
    if (!origin) errs.push('Please choose where you are staying (a city, your location, or a pin on the map).');
    if (tripDate && tripDate < today()) errs.push('Please choose a travel date from today onward.');
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
    $('result-cards').replaceChildren(el('p', 'small', 'Finding your power spots…'));
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });

    withTimeout(fetchLabels(shown.concat(more).map(function (s) { return s.wikidata; })), 4000).then(function () {
      youBox(n, stars, tripDate);
      var wrap = $('result-cards');
      wrap.replaceChildren();
      if (!within.length) wrap.append(el('p', 'notice', 'Nothing was found within your time limit, so here are the closest good matches. Try a longer time or another way of travel.'));
      else if (wishes.length && !all.anyWishHit) wrap.append(el('p', 'notice', 'No place matched your wishes exactly, so we picked the best overall matches.'));
      var items = shown.map(function (s, i) { var c = card(s, i, ctx); wrap.append(c); return { s: s, el: c }; });
      addPhotos(items);

      var mb = $('more-box');
      mb.replaceChildren();
      if (more.length) {
        var det = el('details', 'en-more');
        det.append(el('summary', null, 'More places nearby (' + more.length + ')'));
        var ul = el('ul', 'en-more-list');
        more.forEach(function (s) {
          var li = el('li');
          var a = link(gmapsDir(origin, s, mode), enName(s) || s.name);
          if (!enName(s)) a.lang = 'ja';
          li.append(a, document.createTextNode(' — ' + (EN.categories[s.category] || s.category) + ', ' + (EN.prefectures[s.prefecture_code] || '') + ', ' + fmtMin(s.minutes)));
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
      art.append(el('h3', 'en-course-title', t[0]), el('p', 'small', t[1] + (c.mode === 'car' ? ' Best by car or taxi.' : ' Easy by train, bus and on foot.')));
      var ol = el('ol', 'en-course-stops');
      c.stops.forEach(function (st) {
        var li = el('li');
        var en = enName({ q: st.q });
        var pu = pageUrl(st.q);
        var nm = el(pu ? 'a' : 'span', 'en-stop-name', en || st.name);
        if (pu) nm.href = pu;
        if (!en) nm.lang = 'ja';
        li.append(nm);
        if (en) { var jp = el('span', 'en-jp', st.name); jp.lang = 'ja'; li.append(jp); }
        ol.append(li);
      });
      art.append(ol);
      var route = 'https://www.google.com/maps/dir/' + c.stops.map(function (st) { return st.lat + ',' + st.lon; }).join('/');
      art.append(link(route, 'Open route in Google Maps', 'btn-sub en-btn'));
      box.append(art);
    });
  }


  /* ---------- trip planner (旅行プランナー) ---------- */
  var MAX_DAYS = 21;
  function addDays(str, n) { return D.addDays(str, n); }
  function legRow(leg) {
    var row = el('div', 'en-leg');
    var city = el('select', 'en-leg-city'); city.setAttribute('aria-label', 'City');
    EN.cities.forEach(function (c) { var o = el('option', null, c.label); o.value = c.key; city.append(o); });
    var from = el('input', 'en-leg-from'); from.type = 'date'; from.min = today(); from.setAttribute('aria-label', 'Arrival date');
    var nights = el('select', 'en-leg-days'); nights.setAttribute('aria-label', 'Days');
    for (var i = 1; i <= 10; i++) { var o = el('option', null, i + (i === 1 ? ' day' : ' days')); o.value = i; nights.append(o); }
    var del = el('button', 'en-leg-del', '✕'); del.type = 'button'; del.title = 'Remove this city';
    del.addEventListener('click', function () { if ($('legs').children.length > 1) row.remove(); });
    city.value = leg.city; from.value = leg.from || ''; nights.value = leg.days || 2;
    var l1 = el('label', null, 'City'), l2 = el('label', null, 'From'), l3 = el('label', null, 'For');
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
    var any = el('option', null, 'Anything — surprise me'); any.value = ''; tiles.append(any);
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
    legs.forEach(function (l, i) { if (!l.from) errs.push('Please choose the arrival date for city ' + (i + 1) + '.'); else if (l.from < today()) errs.push('City ' + (i + 1) + ': please choose a date from today onward.'); });
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
    out.replaceChildren(el('p', 'small', 'Planning your trip…'));
    withTimeout(fetchLabels(all.map(function (s) { return s.wikidata; })), 4000).then(function () {
      out.replaceChildren();
      out.append(el('p', 'note', 'Your Nine Star Ki: ' + EN.stars[stars.honmei] + '. For each day we picked places in a lucky direction from where you stay that night, when possible.'));
      plan.forEach(function (x, i) {
        var day = el('section', 'en-day');
        day.append(el('h3', 'en-day-title', 'Day ' + (i + 1) + ' · ' + fmtDate(x.d.date) + ' · ' + x.d.city.label));
        var list = el('div', 'en-day-list');
        x.pick.forEach(function (s) {
          var it = el('div', 'en-day-item');
          it.append(nameBlock(s, 'h4'));
          it.append(el('p', 'en-meta', (EN.categories[s.category] || s.category) + ' · ' + fmtMin(s.minutes) + ' by train & bus (' + fmtKm(s.km) + ')'));
          if (s.fortune) {
            var f = EN.fortune[s.fortune.mark] || EN.fortune['―'];
            it.append(el('p', 'en-fortune en-' + (s.km < 1 ? 'neutral' : f.cls), s.km < 1 ? 'Close to your hotel' : s.fortune.mark + ' ' + (s.fortune.mark === '×' ? 'Not a lucky direction that day, but one of the best places nearby' : f.text + ' that day')));
          }
          if (s.hitWishes.length) it.append(el('p', 'small', 'Matches your wish: ' + s.hitWishes.map(wishText).join(', ')));
          var bt = el('div', 'en-btns');
          bt.append(link(gmapsDir(x.origin, s, 'transit'), 'Directions', 'btn-sub en-btn'), MyList.button(listItem(s), 'en-btn'));
          it.append(bt);
          list.append(it);
        });
        if (!x.pick.length) list.append(el('p', 'small', 'A free day. Explore the neighborhood!'));
        day.append(list);
        out.append(day);
      });
      var saveAll = el('button', 'btn-sub en-btn', '♡ Save all to my list');
      saveAll.type = 'button';
      saveAll.addEventListener('click', function () { all.forEach(function (s) { MyList.add(listItem(s)); }); saveAll.textContent = '♥ Saved to my list'; });
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
    if (!items.length) { box.append(el('p', 'small', 'Nothing saved yet. Tap ♡ Save on any place to add it here. Your list stays on this device.')); return; }
    var ol = el('ol', 'en-list');
    items.forEach(function (x) {
      var li = el('li');
      var name = x.s ? el('a', null, x.n || x.j) : el('span', null, x.n || x.j);
      if (x.s) name.href = 'spots/' + x.s + '.html';
      if (!x.n) name.lang = 'ja';
      li.append(name);
      if (x.n) { var jp = el('span', 'en-jp-inline', ' ' + x.j); jp.lang = 'ja'; li.append(jp); }
      li.append(el('span', 'small', ' · ' + (EN.categories[x.c] || '') + (x.p ? ', ' + EN.prefectures[x.p] : '')));
      var rm = el('button', 'en-leg-del', '✕'); rm.type = 'button'; rm.title = 'Remove';
      rm.addEventListener('click', function () { MyList.remove(x.q); });
      li.append(rm);
      ol.append(li);
    });
    box.append(ol);
    $('list-route').href = MyList.routeUrl(items);
    $('list-route').textContent = items.length > 10 ? 'Open the first 10 in Google Maps' : 'Open as a route in Google Maps';
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
      var url = APP_CONFIG.siteUrl + 'en/' + MyList.shareHash(MyList.read());
      var done = function () { $('list-msg').textContent = 'Link copied. Send it to your travel friends!'; };
      if (navigator.share) navigator.share({ title: 'My Japan power spots', url: url }).catch(function () {});
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
          box.append(el('p', null, 'A friend shared ' + found.length + ' places with you:'));
          var ul = el('ul', 'en-list');
          found.forEach(function (s) { var li = el('li'); li.append(nameBlock(s, 'span')); ul.append(li); });
          var add = el('button', 'btn-sub en-btn', '♡ Add all to my list'); add.type = 'button';
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
