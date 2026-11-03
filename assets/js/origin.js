/*
 * 出発地の詳しい指定
 *   ・住所検索（国土地理院の住所検索。ボタンを押したときだけ、入力した住所の文字を国土地理院へ送る）
 *   ・地図上でピンを置く／動かす（外部へは何も送らない）
 *   ・現在地（ブラウザの位置情報。端末の中だけで使う）
 * 指定がなければ、都道府県庁付近を出発地にする。
 * 住所・緯度経度は保存しない。
 */
(function (root) {
  'use strict';

  var cfg, onChange, prefLookup;
  var precise = null;          // {lat, lon, label, source}
  var miniMap = null, pin = null;
  var SOURCE_LABEL = { address: '住所検索', map: '地図で指定', gps: '現在地' };

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function setMsg(text, kind) {
    var m = $('origin-msg');
    m.textContent = text || '';
    m.className = 'origin-msg' + (kind ? ' ' + kind : '');
    m.hidden = !text;
  }

  function fmt(n) { return n.toFixed(5); }

  function renderStatus() {
    var box = $('origin-status');
    box.replaceChildren();
    var cur = current();
    if (!cur) { box.append(el('span', 'muted', '出発地：都道府県を選ぶと、都道府県庁付近になります。')); return; }
    var main = el('div', 'origin-now');
    main.append(el('strong', null, '出発地：'), document.createTextNode(cur.label));
    var sub = el('div', 'origin-sub', (precise ? SOURCE_LABEL[precise.source] : '都道府県庁付近・概算') +
      '｜緯度 ' + fmt(cur.lat) + '・経度 ' + fmt(cur.lon));
    box.append(main, sub);
    if (precise) {
      var b = el('button', 'btn-text', '都道府県庁付近に戻す');
      b.type = 'button';
      b.addEventListener('click', function () { clear(); setMsg('', null); });
      box.append(b);
    }
  }

  function set(p) {
    precise = p;
    if (miniMap) placePin(p.lat, p.lon, true);
    renderStatus();
    if (onChange) onChange();
  }

  function clear() {
    precise = null;
    if (pin && miniMap) { miniMap.removeLayer(pin); pin = null; }
    $('address-candidates').replaceChildren();
    renderStatus();
    if (onChange) onChange();
  }

  // 出発地（詳しい指定 → なければ都道府県庁付近）
  function current() {
    if (precise) return { lat: precise.lat, lon: precise.lon, label: precise.label, source: precise.source, precise: true };
    var p = prefLookup();
    return p ? { lat: p.lat, lon: p.lon, label: p.name + '（都道府県庁付近）', source: 'prefecture', precise: false } : null;
  }

  /* ---------- 住所検索 ---------- */
  function buildQuery(text) {
    var q = text.trim().replace(/\s+/g, '');
    var p = prefLookup();
    if (p && q.indexOf(p.name) !== 0) q = p.name + q;
    return q;
  }

  function searchAddress() {
    var text = $('address').value;
    $('address-candidates').replaceChildren();
    if (!text.trim()) { setMsg('住所を入力してください。', 'err'); return; }
    var q = buildQuery(text);
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, cfg.geocoder.timeoutMs);
    var btn = $('address-search');
    btn.disabled = true;
    setMsg('住所を探しています…', null);

    fetch(cfg.geocoder.url + encodeURIComponent(q), ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (list) {
        var items = (Array.isArray(list) ? list : []).filter(function (f) {
          return f && f.geometry && Array.isArray(f.geometry.coordinates) && f.properties && f.properties.title;
        }).slice(0, cfg.geocoder.maxCandidates);
        if (!items.length) {
          setMsg('住所が見つかりませんでした。町名まで（例：新宿区西新宿二丁目）にするか、下の地図で位置を指定してください。', 'err');
          return;
        }
        var toPlace = function (f) {
          return { lat: Number(f.geometry.coordinates[1]), lon: Number(f.geometry.coordinates[0]), label: f.properties.title, source: 'address' };
        };
        set(toPlace(items[0]));
        if (items.length === 1) {
          setMsg('位置を設定しました。ずれている場合は、下の地図でピンを動かして調整できます。', 'ok');
          return;
        }
        setMsg('候補が複数見つかりました。いちばん上を仮に設定しています。違う場合は選び直してください。', 'ok');
        var wrap = $('address-candidates');
        items.forEach(function (f, i) {
          var b = el('button', 'cand' + (i === 0 ? ' on' : ''), f.properties.title);
          b.type = 'button';
          b.addEventListener('click', function () {
            Array.prototype.forEach.call(wrap.children, function (c) { c.classList.remove('on'); });
            b.classList.add('on');
            set(toPlace(f));
          });
          wrap.append(b);
        });
      })
      .catch(function () {
        setMsg('住所検索サービスにつながりませんでした。時間をおいて試すか、下の地図で位置を指定してください。', 'err');
      })
      .then(function () { clearTimeout(timer); btn.disabled = false; });
  }

  /* ---------- 現在地 ---------- */
  function useGps() {
    if (!navigator.geolocation) { setMsg('このブラウザでは現在地を使えません。', 'err'); return; }
    setMsg('現在地を取得しています…（ブラウザの確認画面が出たら「許可」を押してください）', null);
    navigator.geolocation.getCurrentPosition(function (pos) {
      var acc = Math.round(pos.coords.accuracy);
      set({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: '現在地（誤差 約' + acc + 'm）', source: 'gps' });
      setMsg('現在地を出発地にしました。', 'ok');
    }, function (err) {
      setMsg(err.code === 1 ? '位置情報の利用が許可されませんでした。住所検索か地図での指定をお使いください。'
        : '現在地を取得できませんでした。住所検索か地図での指定をお使いください。', 'err');
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }

  /* ---------- 地図で指定 ---------- */
  function placePin(lat, lon, recenter) {
    if (!pin) {
      pin = L.marker([lat, lon], { draggable: true, title: '出発地（ドラッグで移動）' }).addTo(miniMap);
      pin.on('dragend', function () {
        var ll = pin.getLatLng();
        set({ lat: ll.lat, lon: ll.lng, label: '地図で指定した地点', source: 'map' });
        setMsg('地図で指定した位置を出発地にしました。', 'ok');
      });
    } else {
      pin.setLatLng([lat, lon]);
    }
    if (recenter) miniMap.setView([lat, lon], Math.max(miniMap.getZoom(), 15));
  }

  function openMiniMap() {
    if (typeof L === 'undefined') { $('origin-map').textContent = '地図を読み込めませんでした。'; return; }
    var cur = current();
    if (!miniMap) {
      miniMap = L.map('origin-map', { scrollWheelZoom: false });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19
      }).addTo(miniMap);
      miniMap.on('click', function (e) {
        miniMap.scrollWheelZoom.enable();
        set({ lat: e.latlng.lat, lon: e.latlng.lng, label: '地図で指定した地点', source: 'map' });
        setMsg('地図で指定した位置を出発地にしました。ピンはドラッグで動かせます。', 'ok');
      });
      miniMap.on('mouseout', function () { miniMap.scrollWheelZoom.disable(); });
      miniMap.setView(cur ? [cur.lat, cur.lon] : [36.4, 138], cur ? (precise ? 16 : 11) : 5);
      if (precise) placePin(precise.lat, precise.lon, false);
    }
    setTimeout(function () {
      miniMap.invalidateSize();
      if (precise) miniMap.setView([precise.lat, precise.lon], Math.max(miniMap.getZoom(), 15));
      else if (cur) miniMap.setView([cur.lat, cur.lon], 11);
    }, 50);
  }

  function init(options) {
    cfg = options.config;
    onChange = options.onChange;
    prefLookup = options.prefLookup;
    $('address-search').addEventListener('click', searchAddress);
    $('address').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); searchAddress(); } });
    $('use-gps').addEventListener('click', useGps);
    $('origin-map-box').addEventListener('toggle', function () { if ($('origin-map-box').open) openMiniMap(); });
    renderStatus();
  }

  // 都道府県の選択が変わったとき
  function prefChanged() {
    if (!precise) {
      renderStatus();
      if (miniMap && $('origin-map-box').open) { var c = current(); if (c) miniMap.setView([c.lat, c.lon], 11); }
    }
  }

  root.OriginPicker = { init: init, current: current, clear: clear, prefChanged: prefChanged, buildQuery: buildQuery, SOURCE_LABEL: SOURCE_LABEL };
})(this);
