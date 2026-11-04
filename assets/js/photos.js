/*
 * スポットの写真（Wikimedia Commons）
 *  ・スポットの Wikidata ID から代表写真（P18）を調べ、Wikimedia Commons の縮小画像を表示する
 *  ・撮影者とライセンスを必ず表示し、元の写真ページへリンクする
 *  ・送るのは Wikidata ID と写真のファイル名だけ（利用者の情報は送らない）
 */
(function (root) {
  'use strict';

  var WD_API = 'https://www.wikidata.org/w/api.php';
  var COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
  var cache = {}; // QID → { thumb, page, artist, license } または null

  function getJSON(url, ms) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 8000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function stripHtml(s) {
    var d = document.createElement('div');
    d.innerHTML = s || '';
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // QID の配列 → { QID: 写真情報 or null }
  // Wikidata・Commons は1回50件までなので、50件ずつに分けて問い合わせる
  function lookup(qids) {
    var need = qids.filter(function (q, i) { return !(q in cache) && qids.indexOf(q) === i; });
    if (need.length > 50) {
      var chunks = [];
      for (var i = 0; i < need.length; i += 50) chunks.push(need.slice(i, i + 50));
      return chunks.reduce(function (p, c) { return p.then(function () { return lookupChunk(c); }); }, Promise.resolve()).then(function () { return pick(qids); });
    }
    return lookupChunk(need).then(function () { return pick(qids); });
  }
  function lookupChunk(qids) {
    var need = qids.filter(function (q) { return !(q in cache); });
    if (!need.length) return Promise.resolve(pick(qids));
    var url = WD_API + '?action=wbgetentities&props=claims&format=json&origin=*&ids=' + encodeURIComponent(need.join('|'));
    return getJSON(url).then(function (d) {
      var files = {};
      need.forEach(function (q) {
        var e = d.entities && d.entities[q];
        var c = e && e.claims && e.claims.P18;
        var f = c && c[0] && c[0].mainsnak && c[0].mainsnak.datavalue && c[0].mainsnak.datavalue.value;
        if (f) files['File:' + f] = q; else cache[q] = null;
      });
      var titles = Object.keys(files);
      if (!titles.length) return pick(qids);
      var u2 = COMMONS_API + '?action=query&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&format=json&origin=*&titles=' +
        encodeURIComponent(titles.join('|'));
      return getJSON(u2).then(function (d2) {
        var pages = (d2.query && d2.query.pages) || {};
        var norm = {};
        ((d2.query && d2.query.normalized) || []).forEach(function (n) { norm[n.to] = n.from; });
        Object.keys(pages).forEach(function (k) {
          var p = pages[k];
          var q = files[p.title] || files[norm[p.title]];
          var ii = p.imageinfo && p.imageinfo[0];
          if (!q) return;
          if (!ii || !ii.thumburl) { cache[q] = null; return; }
          var m = ii.extmetadata || {};
          cache[q] = {
            thumb: ii.thumburl,
            page: ii.descriptionurl,
            artist: stripHtml(m.Artist && m.Artist.value) || '撮影者不明',
            license: stripHtml(m.LicenseShortName && m.LicenseShortName.value) || 'ライセンスは元ページを参照'
          };
        });
        titles.forEach(function (t) { var q = files[t]; if (!(q in cache)) cache[q] = null; });
        return pick(qids);
      });
    }).catch(function () { return pick(qids); });
  }

  function pick(qids) {
    var o = {};
    qids.forEach(function (q) { o[q] = cache[q] || null; });
    return o;
  }

  // カードに写真を入れる。cards：[{ spot, el }]
  function attach(cards) {
    var list = cards.filter(function (c) { return c.spot.wikidata; });
    if (!list.length) return Promise.resolve();
    list.forEach(function (c) {
      var ph = document.createElement('div');
      ph.className = 'photo photo-loading';
      ph.setAttribute('aria-hidden', 'true');
      var after = c.el.querySelector('.rank');
      if (after) after.after(ph); else c.el.prepend(ph);
      c.placeholder = ph;
    });
    return lookup(list.map(function (c) { return c.spot.wikidata; })).then(function (res) {
      list.forEach(function (c) {
        var info = res[c.spot.wikidata];
        if (!info) { c.placeholder.remove(); return; }
        var fig = document.createElement('figure');
        fig.className = 'photo';
        var img = document.createElement('img');
        img.src = info.thumb;
        img.alt = c.spot.name + 'の写真';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = function () { fig.remove(); };
        var cap = document.createElement('figcaption');
        var a = document.createElement('a');
        a.href = info.page; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = '写真：' + info.artist + '／' + info.license + '（Wikimedia Commons）';
        cap.append(a);
        fig.append(img, cap);
        c.placeholder.replaceWith(fig);
      });
    });
  }

  root.SpotPhotos = { attach: attach, lookup: lookup };
})(this);
