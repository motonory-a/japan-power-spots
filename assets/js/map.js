/*
 * 地図まわり（Leaflet）
 * OSM標準タイルを使用。出典表示（attribution）は消さないでください。
 */
(function (root) {
  'use strict';

  var CATEGORY_COLORS = { '神社': '#c0392b', '寺院': '#7d4a9e', '滝': '#2471a3', '山': '#8a5a2b', '湧水': '#17a2b8', '温泉': '#e67e22',
    '巨木': '#2e7d32', '岩・磐座': '#6d6d6d', '洞窟': '#4e342e', '絶景': '#d4a017', '湖': '#1f6f8b', '祠': '#a04040' };
  var DEFAULT_COLOR = '#22684b';

  var map, spotLayer, rankLayer, homeLayer, markerById = {}, canvas;

  function colorOf(category) { return CATEGORY_COLORS[category] || DEFAULT_COLOR; }

  function icon(color, label) {
    return L.divIcon({
      className: 'pin-wrap',
      html: '<span class="pin" style="background:' + color + '">' + (label || '') + '</span>',
      iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12]
    });
  }

  function popupHtml(s) {
    var div = document.createElement('div');
    var b = document.createElement('strong'); b.textContent = s.name;
    var p = document.createElement('div'); p.textContent = s.prefecture + (s.municipality || '') + '・' + s.category;
    div.append(b, p);
    if (s.wishes && s.wishes.length) { var w = document.createElement('div'); w.style.fontSize = '12px'; w.textContent = s.wishes.slice(0, 5).join('・'); div.append(w); }
    return div;
  }

  function init(elId) {
    if (typeof L === 'undefined') {
      var el = document.getElementById(elId);
      el.classList.add('map-error');
      el.textContent = '地図を読み込めませんでした。通信環境を確認して再読み込みしてください。';
      return false;
    }
    map = L.map(elId, { scrollWheelZoom: false, preferCanvas: true }).setView([36.4, 138], 5);
    canvas = L.canvas({ padding: 0.3 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    // ページのスクロール中に地図が勝手に拡大しないよう、クリック後にホイール拡大を有効化
    map.on('click focus', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout blur', function () { map.scrollWheelZoom.disable(); });
    spotLayer = L.layerGroup().addTo(map);
    rankLayer = L.layerGroup().addTo(map);
    homeLayer = L.layerGroup().addTo(map);
    return true;
  }

  // 多数のスポットを軽く描くため、Canvas の小さな丸で表示する
  function showSpots(spots, fit) {
    if (!map) return;
    spotLayer.clearLayers();
    markerById = {};
    var radius = spots.length > 2000 ? 3 : (spots.length > 300 ? 4.5 : 6.5);
    spots.forEach(function (s) {
      var m = L.circleMarker([s.lat, s.lon], {
        renderer: canvas, radius: radius, weight: 1, color: '#ffffff', fillColor: colorOf(s.category), fillOpacity: 0.9
      });
      m.bindPopup(function () { return popupHtml(s); });
      m.addTo(spotLayer);
      markerById[s.id] = m;
    });
    if (fit === false) return;
    if (spots.length) {
      map.fitBounds(L.latLngBounds(spots.map(function (s) { return [s.lat, s.lon]; })).pad(0.15), { maxZoom: 13 });
    } else {
      map.setView([36.4, 138], 5);
    }
  }

  // 診断結果を順位番号つきで表示し、出発地の目安も示す
  function showRanking(ranked, origin) {
    if (!map) return;
    rankLayer.clearLayers();
    homeLayer.clearLayers();
    var pts = [[origin.lat, origin.lon]];
    L.circleMarker([origin.lat, origin.lon], { radius: 8, color: '#163b32', fillColor: '#f2c94c', fillOpacity: 1, weight: 2 })
      .bindPopup('出発地：' + origin.label).addTo(homeLayer);
    ranked.forEach(function (s, i) {
      L.marker([s.lat, s.lon], { icon: icon(colorOf(s.category), String(i + 1)), zIndexOffset: 1000, title: (i + 1) + '位 ' + s.name })
        .bindPopup(popupHtml(s)).addTo(rankLayer);
      pts.push([s.lat, s.lon]);
    });
    map.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 10 });
  }

  function focus(spot) {
    if (!map) return;
    map.setView([spot.lat, spot.lon], 13);
    var m = markerById[spot.id];
    if (m && spotLayer.hasLayer(m)) m.openPopup();
    else L.popup().setLatLng([spot.lat, spot.lon]).setContent(popupHtml(spot)).openOn(map);
  }

  function invalidate() { if (map) map.invalidateSize(); }

  root.SpotMap = {
    CATEGORY_COLORS: CATEGORY_COLORS, init: init, showSpots: showSpots,
    showRanking: showRanking, focus: focus, invalidate: invalidate
  };
})(this);
