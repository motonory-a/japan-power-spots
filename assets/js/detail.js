/*
 * スポットのくわしい画面（仕様書v2.0 07・08）
 *   ・公式サイトなどで確認した情報（所在地・参拝時間・料金・アクセス・御祭神・出典・最終確認日）
 *   ・確認できていない情報は書かず、「公式サイトでご確認ください」と案内する
 *   ・行きたい／行った／お気に入り／週末の候補、地図で行き方を見る、近くの聖地
 *   ・URLの末尾 #spot=スポットID で、この画面を直接ひらける（紹介用）
 */
(function (root) {
  'use strict';
  var ui = null, dlg = null, lastFocus = null;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function link(text, href) { var a = el('a', null, text); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; }
  function dateJ(str) { var p = (str || '').split('-').map(Number); return p.length === 3 ? p[0] + '年' + p[1] + '月' + p[2] + '日' : str; }

  function distKm(a, b) {
    var r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    var x = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.pow(Math.sin(dLon / 2), 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function nearby(s, n, km) {
    var all = root.ALL_SPOTS || [], out = [];
    for (var i = 0; i < all.length; i++) {
      var t = all[i];
      if (t.id === s.id || t.publication_status !== 'public' || t.category === '祠') continue;
      if (Math.abs(t.lat - s.lat) > 0.2 || Math.abs(t.lon - s.lon) > 0.25) continue;
      var d = distKm(s, t);
      if (d <= km && d > 0.05) out.push({ s: t, km: d });
    }
    return out.sort(function (a, b) { return ((b.s.featured ? 1000 : 0) + (b.s.fame || 0)) - ((a.s.featured ? 1000 : 0) + (a.s.fame || 0)) || a.km - b.km; }).slice(0, n);
  }

  function findById(id) {
    var all = root.ALL_SPOTS || [];
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function build(s) {
    var body = el('div', 'detail-body');
    var head = el('div', 'detail-head');
    var h = el('h2', 'detail-title', s.name);
    h.id = 'detail-title';
    var close = el('button', 'detail-close', '閉じる');
    close.type = 'button';
    close.addEventListener('click', closeDlg);
    head.append(h, close);
    body.append(head);

    var tags = el('div', 'tags');
    tags.append(el('span', 'tag', s.prefecture + (s.municipality ? ' ' + s.municipality : '')), el('span', 'tag tag-cat', s.category));
    if (s.verified) tags.append(el('span', 'badge badge-ok', '公式情報を確認済み（' + dateJ(s.verified.checked) + '）'));
    else tags.append(el('span', 'badge badge-warn', '内容は未確認'));
    body.append(tags);

    var photo = el('div', 'detail-photo');
    body.append(photo);
    if (root.SpotPhotos && s.wikidata) SpotPhotos.attach([{ el: photo, spot: s }]);

    body.append(el('p', 'detail-desc', s.description || ''));

    var v = s.verified;
    var box = el('section', 'detail-info');
    box.append(el('h3', null, '参拝の基本情報'));
    if (v) {
      var dl = el('dl', 'meta');
      [['所在地', v.address], ['参拝時間', v.hours], ['料金', v.fee], ['アクセス', v.access], ['御祭神', v.deities && v.deities.join('・')], ['補足', v.notes]].forEach(function (r) {
        if (r[1]) dl.append(el('dt', null, r[0]), el('dd', null, r[1]));
      });
      if (!v.hours) dl.append(el('dt', null, '参拝時間'), el('dd', 'muted', '公式サイトに記載が見当たりませんでした。お出かけ前に公式サイトでご確認ください。'));
      if (v.official) { var dd = el('dd'); dd.append(link(v.official.replace(/^https?:\/\//, '').replace(/\/$/, ''), v.official)); dl.append(el('dt', null, '公式サイト'), dd); }
      box.append(dl);
      var src = el('p', 'small src');
      src.append(document.createTextNode('確認した資料（' + dateJ(v.checked) + '確認）：'));
      v.sources.forEach(function (x, i) { if (i) src.append(document.createTextNode('・')); src.append(link(x[0], x[1])); });
      box.append(src);
      box.append(el('p', 'note', '時間や料金は変わることがあります。お出かけ前に公式サイトの最新情報をご確認ください。'));
    } else {
      box.append(el('p', null, 'このスポットの参拝時間・料金・アクセスは、まだ確認できていません。お出かけ前に、公式サイトや自治体・観光協会の情報をご確認ください。'));
      var q = el('p');
      q.append(link('「' + s.name + '」の公式情報を探す（Google検索）', 'https://www.google.com/search?q=' + encodeURIComponent(s.name + ' ' + (s.municipality || s.prefecture) + ' 公式')));
      box.append(q);
    }
    body.append(box);

    var objTags = (s.wishes || []).filter(function (w) { return !s.wishesInferred || s.wishesInferred.indexOf(w) === -1; });
    if (objTags.length) body.append(el('p', 'small', '特徴：' + objTags.join('・')));
    if (s.wishesInferred && s.wishesInferred.length) body.append(el('p', 'small', 'ご利益（祭神・名称からの一般的な推定）：' + s.wishesInferred.join('・')));
    if (root.Food) {
      var meib = Food.meibutsu(s.prefecture);
      if (meib.length) {
        var fp = el('p', 'small food-line', 'せっかくなら味わいたい' + s.prefecture.replace(/[都府県]$/, '') + 'の名物：' + meib.join('・') + '　');
        fp.append(link('近くのお店を探す', 'https://www.google.com/maps/search/' + encodeURIComponent('グルメ') + '/@' + s.lat + ',' + s.lon + ',15z'));
        body.append(fp);
      }
    }

    // 行動のボタン
    var act = el('div', 'detail-actions');
    if (root.Collection) act.append(Collection.buttons(s, true));
    var row = el('div', 'detail-btns');
    var route = link('地図で行き方を見る（Googleマップ）', ui.routeUrl(s));
    route.className = 'btn-sub';
    var onMap = el('button', 'btn-sub', 'このサイトの地図で見る');
    onMap.type = 'button';
    onMap.addEventListener('click', function () { closeDlg(); ui.goMap(s); });
    row.append(route, onMap);
    act.append(row);
    body.append(act);

    // このスポットをめぐるモデルコース
    if (root.Courses) {
      var cs = Courses.near(s, 0.3).filter(function (x) { return x.includes || x.km < 0.3; });
      if (cs.length) {
        var cbox = el('section', 'detail-courses');
        cbox.append(el('h3', null, 'このスポットをめぐるモデルコース'));
        cs.forEach(function (x) { cbox.append(Courses.linkButton(x.c, '「' + x.c.title + '」を見る')); });
        body.append(cbox);
      }
    }

    // 近くの聖地
    var near = nearby(s, 5, 15);
    if (near.length) {
      var ns = el('section', 'detail-near');
      ns.append(el('h3', null, '近くの聖地（15km以内）'));
      var ul = el('ul');
      near.forEach(function (x) {
        var li = el('li');
        var b = el('button', 'near-btn');
        b.type = 'button';
        b.append(el('span', 'near-name', x.s.name), el('span', 'near-sub', x.s.category + '・約' + (x.km < 10 ? x.km.toFixed(1) : Math.round(x.km)) + 'km' + (x.s.verified ? '・公式情報あり' : '')));
        b.addEventListener('click', function () { open(x.s); });
        li.append(b);
        ul.append(li);
      });
      ns.append(ul);
      body.append(ns);
    }

    // 紹介（このスポットへのリンク）
    if (root.Share) {
      var url = (root.APP_CONFIG && APP_CONFIG.siteUrl ? APP_CONFIG.siteUrl : root.location.href.split('#')[0]) + '#spot=' + encodeURIComponent(s.id);
      body.append(Share.box({ heading: 'この聖地を紹介する', text: '「' + s.name + '」（' + s.prefecture + '）', url: url }));
    }
    body.append(el('p', 'note', 'スポットの情報：' + (s.license || '') + '。ご利益は一般的な推定で、効果を約束するものではありません。'));
    return body;
  }

  function open(s) {
    if (!dlg || !s) return;
    if (!dlg.open) lastFocus = document.activeElement;
    dlg.replaceChildren(build(s));
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    dlg.scrollTop = 0;
    var h = dlg.querySelector('.detail-close');
    if (h) h.focus({ preventScroll: true });
    try { history.replaceState(null, '', '#spot=' + encodeURIComponent(s.id)); } catch (e) { /* 無視 */ }
  }
  function closeDlg() {
    if (!dlg) return;
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
  }
  function onClosed() {
    try { if (/^#spot=/.test(root.location.hash)) history.replaceState(null, '', root.location.pathname + root.location.search); } catch (e) { /* 無視 */ }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // #spot=ID で開く（追加データにしかないスポットは、読み込み後に開く）
  function openFromHash() {
    var m = /^#spot=(.+)$/.exec(root.location.hash || '');
    if (!m) return;
    var id = decodeURIComponent(m[1]);
    var s = findById(id);
    if (s) { open(s); return; }
    if (root.SpotData && SpotData.loadExtras) SpotData.loadExtras().then(function () { var t = findById(id); if (t) open(t); });
  }

  function init(opts) {
    ui = opts;
    dlg = document.getElementById('spot-detail');
    if (!dlg) return;
    dlg.addEventListener('close', onClosed);
    // 外側（暗い部分）を押したら閉じる
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
    openFromHash();
    root.addEventListener('hashchange', openFromHash);
  }

  root.SpotDetail = { init: init, open: open, close: closeDlg, nearby: nearby };
})(typeof window !== 'undefined' ? window : globalThis);
