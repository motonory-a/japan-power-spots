/*
 * スポットデータの読み込み
 *   data/spots-osm.js（全国データ・配列形式）を、サイトで使う形に組み立てて ALL_SPOTS にする。
 *   data/spots-demo.js の手入力スポット（説明文など）は、同じ名前・近い位置のスポットに上書きで反映する。
 * 読み込み順：config.js → spots-demo.js → spots-osm.js → data.js
 */
(function (root) {
  'use strict';

  var PREFS = root.PREFECTURES || (typeof require !== 'undefined' ? require('../../data/spots-demo.js').PREFECTURES : []);

  function prefName(code) {
    for (var i = 0; i < PREFS.length; i++) if (PREFS[i][0] === code) return PREFS[i][1];
    return '';
  }

  var CAT_LABEL = { '神社': '神社', '寺院': '寺院', '滝': '滝', '山': '山', '湧水': '湧水', '温泉': '温泉',
    '巨木': '巨木・御神木', '岩・磐座': '岩・磐座', '洞窟': '洞窟', '絶景': '展望地', '湖': '湖・池', '祠': '祠' };

  function osmUrl(id) {
    var t = { n: 'node', w: 'way', r: 'relation' }[id.charAt(0)];
    return 'https://www.openstreetmap.org/' + t + '/' + id.slice(1);
  }

  function wikiUrl(w) {
    if (!w) return '';
    var i = w.indexOf(':');
    if (i < 0) return '';
    return 'https://' + w.slice(0, i) + '.wikipedia.org/wiki/' + encodeURIComponent(w.slice(i + 1).replace(/ /g, '_'));
  }

  function fromRow(r) {
    var obj = r[7] ? r[7].split('|') : [];
    var inferred = r[8] ? r[8].split('|') : [];
    var pref = prefName(r[3]);
    var urls = [osmUrl(r[0])];
    if (r[10]) urls.push(wikiUrl(r[10]));
    return {
      id: 'osm-' + r[0], source_ids: ['osm:' + r[0]], name: r[1], aliases: [], category: r[2],
      prefecture_code: r[3], prefecture: pref, municipality: r[4], lat: r[5], lon: r[6],
      geometry_type: 'point', parent_id: r[12] ? 'osm-' + r[12] : null,
      wishes: obj.concat(inferred), wishesInferred: inferred,
      themes: obj.concat(inferred).slice(0, 4),
      numbers: r[9].split('').map(Number),
      description: pref + (r[4] ? r[4] : '') + 'にある' + (CAT_LABEL[r[2]] || r[2]) + '。',
      source_urls: urls, wikipedia: r[10] || '', wikidata: r[11] || '',
      license: 'ODbL 1.0（© OpenStreetMap contributors）',
      verification_status: 'unverified', access_status: 'open', publication_status: 'public',
      updated_at: (root.SPOTS_OSM_META || {}).built || '', fame: r[13] || 0
    };
  }

  function dist(a, b) {
    var r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    var x = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.pow(Math.sin(dLon / 2), 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  // 手入力スポットを全国データに重ねる
  function mergeCurated(list, curated) {
    curated.forEach(function (c) {
      var hit = null;
      for (var i = 0; i < list.length; i++) {
        var s = list[i];
        if (s.prefecture === c.prefecture && (s.name === c.name || s.name.indexOf(c.name.split(' ')[0]) === 0) && dist(s, c) < 3) { hit = s; break; }
      }
      if (hit) {
        hit.description = c.description;
        hit.themes = c.themes.slice();
        c.wishes.forEach(function (w) {
          if (hit.wishes.indexOf(w) === -1) { hit.wishes.push(w); if (hit.wishesInferred.indexOf(w) === -1) hit.wishesInferred.push(w); }
        });
        hit.numbers = c.numbers.slice();
        if (c.access_note) hit.access_note = c.access_note;
        hit.curated = true;
      } else {
        var copy = Object.assign({}, c, { verification_status: 'unverified', wishesInferred: c.wishes.filter(function (w) { return ['神社', '寺院', '霊山', '滝', '登山', '自然', '森林', '浄化', '御神木・巨木', '湖・湧水', '絶景', '巡礼'].indexOf(w) === -1; }), fame: 80, curated: true });
        list.push(copy);
      }
    });
    return list;
  }

  function build() {
    var rows = root.SPOTS_OSM || [];
    var list = rows.map(fromRow);
    if (!list.length) return (root.SPOTS || []).slice(); // 全国データがないときはデモデータ
    return mergeCurated(list, root.SPOTS || []);
  }

  var api = { build: build, fromRow: fromRow, mergeCurated: mergeCurated, wikiUrl: wikiUrl, osmUrl: osmUrl, CAT_LABEL: CAT_LABEL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { root.SpotData = api; root.ALL_SPOTS = build(); }
})(this);
