/* 最寄り駅と、食べ物の写真タイル（2026-11）
   - Nearby.station(el, spot, lang)：最寄り駅を el に書き込む。駅データ（data/stations.js）は初めて使うときに読み込む
   - Nearby.foodTiles(names, lang, enNames)：食べ物の写真タイル（写真は data/food-photos.js、Wikimedia Commons） */
(function (root) {
  var me = document.currentScript && document.currentScript.src;
  var DATA_URL = me ? me.replace(/assets\/js\/nearby\.js(\?.*)?$/, 'data/stations.js') : 'data/stations.js';
  var loading = null;
  function loadStations() {
    if (root.STATIONS) return Promise.resolve(root.STATIONS);
    if (loading) return loading;
    loading = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = DATA_URL; s.async = true;
      s.onload = function () { root.STATIONS ? res(root.STATIONS) : rej(new Error('no data')); };
      s.onerror = function () { loading = null; rej(new Error('load failed')); };
      document.head.appendChild(s);
    });
    return loading;
  }
  function km(a, b, c, d) {
    var p = Math.PI / 180, x = (d - b) * p * Math.cos((a + c) / 2 * p), y = (c - a) * p;
    return 6371 * Math.sqrt(x * x + y * y);
  }
  function nearest(lat, lon) {
    var S = root.STATIONS, best = null, bd = Infinity;
    for (var i = 0; i < S.s.length; i++) {
      var r = S.s[i];
      if (Math.abs(r[1] - lat) > 0.3 || Math.abs(r[2] - lon) > 0.4) continue;
      var d = km(lat, lon, r[1], r[2]);
      if (d < bd) { bd = d; best = r; }
    }
    if (!best) return null;
    var clean = function (x) { return x.replace(/[（(][^)）]*[)）]$/, ''); };
    var lines = [], linesEn = [];
    best[3].forEach(function (k) {
      var n = clean(S.l[k]); if (lines.indexOf(n) !== -1) return;
      lines.push(n); linesEn.push((S.le && S.le[k]) || n);
    });
    return { name: clean(best[0]), kana: best[4] || '', en: best[5] || '', km: bd, lines: lines, linesEn: linesEn };
  }
  var T = {
    ja: function (n) {
      var lines = n.lines.slice(0, 2).join('・') + (n.lines.length > 2 ? 'ほか' : '');
      var dist = n.km < 0.1 ? 'すぐ近く' : '直線で約' + Math.round(n.km * 10) / 10 + 'km';
      var walk = n.km <= 2.5 ? '・歩いて約' + Math.max(1, Math.round(n.km * 1.25 / 0.08)) + '分（目安）' : '（バスやタクシーが便利です）';
      var yomi = [n.kana, n.en].filter(Boolean).join('／');
      return { label: '最寄り駅', text: lines + '　' + n.name + '駅' + (yomi ? '（' + yomi + '）' : ''), sub: dist + walk };
    },
    en: function (n) {
      var lines = n.linesEn.slice(0, 2).join(' / ') + (n.lines.length > 2 ? ' and more' : '');
      var walk = n.km <= 2.5 ? ' · about ' + Math.max(1, Math.round(n.km * 1.25 / 0.08)) + ' min walk' : ' · bus or taxi recommended';
      return { label: 'Nearest station', text: (n.en || n.name) + ' Station' + (n.en ? ' (' + n.name + '駅)' : '') + ' · ' + lines, sub: 'About ' + (Math.round(n.km * 10) / 10) + ' km in a straight line' + walk };
    }
  };
  // 中国語・韓国語・フランス語・スペイン語（駅名はローマ字＋漢字、路線は中国語だけ日本語表記のまま）
  function mk(o) {
    return function (n) {
      var km = Math.round(n.km * 10) / 10, min = Math.max(1, Math.round(n.km * 1.25 / 0.08));
      var ls = (o.jaLines ? n.lines : n.linesEn).slice(0, 2).join(o.jaLines ? '・' : ' / ') + (n.lines.length > 2 ? o.more : '');
      var name = o.jaLines ? n.name + '站' + (n.en ? '（' + n.en + '）' : '') : (n.en || n.name) + ' (' + n.name + '駅)';
      return { label: o.label, text: name + ' · ' + ls, sub: o.dist(km) + (n.km <= 2.5 ? o.walk(min) : o.bus) };
    };
  }
  T.zh = mk({ jaLines: true, label: '最近車站', more: '等', dist: function (k) { return '直線距離約' + k + '公里'; }, walk: function (m) { return '・步行約' + m + '分鐘（參考）'; }, bus: '・建議搭公車或計程車' });
  T.ko = mk({ label: '가까운 역', more: ' 외', dist: function (k) { return '직선거리 약 ' + k + 'km'; }, walk: function (m) { return ' · 걸어서 약 ' + m + '분(기준)'; }, bus: ' · 버스나 택시가 편해요' });
  T.fr = mk({ label: 'Gare la plus proche', more: ' et autres', dist: function (k) { return 'Environ ' + String(k).replace('.', ',') + ' km à vol d’oiseau'; }, walk: function (m) { return ' · environ ' + m + ' min à pied'; }, bus: ' · bus ou taxi conseillé' });
  T.es = mk({ label: 'Estación más cercana', more: ' y otras', dist: function (k) { return 'Unos ' + String(k).replace('.', ',') + ' km en línea recta'; }, walk: function (m) { return ' · unos ' + m + ' min a pie'; }, bus: ' · mejor en autobús o taxi' });
  // 駅から5km以上離れているときは、駅名を出さずに案内だけ（山越えの駅を「最寄り」と出さないため）
  var FAR = {
    ja: { label: '公共交通', text: '鉄道の駅からは離れています（直線で5km以上）', sub: 'バスやタクシー、車での参拝がおすすめです' },
    en: { label: 'Getting there', text: 'More than 5 km from the nearest train station', sub: 'A bus, taxi or car is the easiest way' },
    zh: { label: '交通方式', text: '距離鐵路車站超過5公里', sub: '建議搭公車、計程車或開車前往' },
    ko: { label: '가는 방법', text: '기차역에서 5km 이상 떨어져 있어요', sub: '버스, 택시, 자동차가 편해요' },
    fr: { label: 'Accès', text: 'À plus de 5 km de la gare la plus proche', sub: 'Le plus simple : bus, taxi ou voiture' },
    es: { label: 'Cómo llegar', text: 'A más de 5 km de la estación de tren más cercana', sub: 'Lo más cómodo es ir en autobús, taxi o coche' }
  };
  function station(el, spot, lang) {
    if (!el || !spot || spot.lat == null) return;
    el.hidden = true;
    loadStations().then(function () {
      var n = nearest(spot.lat, spot.lon);
      if (!n) return;
      var t = n.km > 5 ? (FAR[lang] || FAR.ja) : (T[lang] || T.ja)(n);
      el.replaceChildren();
      var b = document.createElement('b'); b.textContent = t.label + (lang === 'ja' || lang === 'zh' ? '：' : ': ');
      var main = document.createElement('span'); main.className = 'st-name'; main.textContent = t.text;
      var sub = document.createElement('span'); sub.className = 'st-sub'; sub.textContent = t.sub;
      el.append(b, main, sub);
      el.hidden = false;
    }).catch(function () {});
  }

  // 食べ物の写真タイル。names は日本語名（写真データのキー）、labels は表示名。
  // 写真のあるものを最大3つタイルにし、写真のないものは下に名前だけ並べる
  function foodTiles(names, labels, lang, also) {
    var P = root.FOOD_PHOTOS || {}, en = lang && lang !== 'ja';
    var wrap = document.createElement('div'); wrap.className = 'food-tiles-wrap';
    var grid = document.createElement('div'); grid.className = 'food-tiles';
    var credits = [], rest = [];
    names.forEach(function (n, i) {
      var p = P[n], label = (labels && labels[i]) || n;
      if (!p || grid.children.length >= 3) { rest.push(label); return; }
      var tile = document.createElement('a');
      tile.className = 'food-tile'; tile.href = p[1]; tile.target = '_blank'; tile.rel = 'noopener noreferrer';
      tile.title = (p[2] ? p[2] + ' / ' : '') + p[3] + ' (Wikimedia Commons)';
      var img = document.createElement('img');
      img.src = p[0]; img.alt = label; img.loading = 'lazy'; img.decoding = 'async';
      img.onerror = function () { img.remove(); tile.classList.add('no-photo'); };
      var cap = document.createElement('span'); cap.textContent = label;
      tile.append(img, cap); grid.append(tile);
      credits.push(en ? (p[2] || 'unknown') + ' (' + p[3] + ')' : (p[2] || '作者不明') + '（' + p[3] + '）');
    });
    if (grid.children.length) wrap.append(grid);
    if (rest.length) {
      var r = document.createElement('p'); r.className = 'food-rest';
      r.textContent = (grid.children.length ? (also || (en ? 'Also: ' : 'ほかに：')) : '') + rest.join(en ? ', ' : '・');
      wrap.append(r);
    }
    return { el: wrap, credit: credits.join(en ? ', ' : '、') };
  }

  root.Nearby = { station: station, foodTiles: foodTiles, nearest: nearest, loadStations: loadStations };
})(window);
