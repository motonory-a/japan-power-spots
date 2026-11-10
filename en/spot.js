/*
 * English edition: spot page (英語版のスポットページ)
 *   Photo, map, ♡ Save, and "Your lucky days to visit" (Nine Star Ki) for one spot. SPOT is written into the page.
 */
(function () {
  'use strict';
  var D = window.Diagnosis, K = window.Kyusei, S = window.SPOT;
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(str) { var p = str.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2])); return WD[d.getUTCDay()] + ', ' + MON[p[1] - 1] + ' ' + p[2]; }

  // count in the header
  function paintCount() { var n = MyList.read().length; document.querySelectorAll('[data-mylist-count]').forEach(function (e) { e.textContent = n ? '(' + n + ')' : ''; }); }
  MyList.onChange(paintCount); paintCount();
  $('save-slot').append(MyList.button(S, 'en-save-big'));

  // photo
  if (window.SpotPhotos) {
    SpotPhotos.lookup([S.q]).then(function (res) {
      var info = res[S.q];
      if (!info) return;
      var fig = el('figure', 'photo en-photo');
      var img = el('img'); img.src = info.thumb; img.alt = 'Photo of ' + S.n; img.decoding = 'async';
      img.onerror = function () { fig.remove(); };
      var cap = el('figcaption'), a = el('a', null, 'Photo: ' + info.artist + ' / ' + info.license + ' (Wikimedia Commons)');
      a.href = info.page; a.target = '_blank'; a.rel = 'noopener noreferrer';
      cap.append(a); fig.append(img, cap); $('photo-slot').append(fig);
    });
  }

  // map
  if (window.L) {
    var map = L.map('spot-map', { scrollWheelZoom: false }).setView([S.lat, S.lon], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    L.marker([S.lat, S.lon]).addTo(map).bindTooltip(S.n);
  }

  // lucky days
  var sel = $('lk-city');
  var nearest = EN.cities.map(function (c) { return { c: c, km: D.distanceKm(c.lat, c.lon, S.lat, S.lon) }; }).sort(function (a, b) { return a.km - b.km; });
  nearest.forEach(function (x, i) { var o = el('option', null, x.c.label); o.value = x.c.key; if (i === 0) o.selected = true; sel.append(o); });
  try {
    var b = localStorage.getItem('jps-en-bday'); if (b) $('lk-bday').value = b;
    var o = JSON.parse(localStorage.getItem('jps-en-origin') || 'null');
    if (o && o.key && nearest.some(function (x) { return x.c.key === o.key && x.km < 150; })) sel.value = o.key;
  } catch (e) { /* ignore */ }
  $('lk-bday').max = JSTDate.today();

  $('lk-go').addEventListener('click', function () {
    var out = $('lk-out'); out.replaceChildren();
    var bday = $('lk-bday').value;
    if (!bday || bday > JSTDate.today() || bday < '1900-01-01') { out.append(el('p', 'form-error', 'Please enter your birthday.')); return; }
    try { localStorage.setItem('jps-en-bday', bday); } catch (e) { /* ignore */ }
    var c = EN.cities.filter(function (x) { return x.key === sel.value; })[0];
    var km = D.distanceKm(c.lat, c.lon, S.lat, S.lon), deg = D.bearingBy(APP_CONFIG.bearingMethod, c.lat, c.lon, S.lat, S.lon);
    var stars = K.birthStars(bday);
    var box = el('div', 'en-lucky-result');
    box.append(el('p', null, 'Your Nine Star Ki: ' + EN.stars[stars.honmei] + '. From ' + c.label + ', ' + S.n + ' lies to the ' + (EN.palaces[K.palaceFromBearing(deg)] || '').toLowerCase() + ' (' + Math.round(km) + ' km).'));
    if (km < 1) { box.append(el('p', null, 'It is very close to where you stay, so direction does not matter. Any day is fine.')); out.append(box); return; }
    var days = D.goodDays([stars], deg, km, APP_CONFIG, JSTDate.today(), 92);
    if (!days.length) {
      box.append(el('p', 'en-fortune en-neutral', 'No especially lucky days in the next three months from this base. Try staying in another city, or simply visit with a grateful heart.'));
    } else {
      box.append(el('p', 'en-gd-label', 'Lucky days (◎ = especially good):'));
      var wrap = el('div', 'en-good-days');
      D.pickGoodDays(days, 10).forEach(function (d) { wrap.append(el('span', 'en-gd' + (d.dayGood ? ' en-gd-best' : ''), (d.dayGood ? '◎ ' : '○ ') + fmtDate(d.date))); });
      box.append(wrap);
    }
    box.append(el('p', 'small', 'Nine Star Ki is a traditional Japanese practice for choosing where and when to travel. Please enjoy it as a cultural guide.'));
    out.append(box);
  });
})();
