/*
 * 画面の組み立てと操作（入力・診断・検索・地図連動）
 * 読み込み順：config.js → data/spots-demo.js → diagnosis.js → map.js → app.js
 */
(function () {
  'use strict';

  var cfg = APP_CONFIG, D = Diagnosis;
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function prefByName(name) {
    var p = PREFECTURES.find(function (x) { return x[1] === name; });
    return p ? { code: p[0], name: p[1], lat: p[2], lon: p[3] } : null;
  }

  function routeUrl(s, modeKey) {
    var mode = (cfg.travelModes[modeKey] || cfg.travelModes.transit).gmaps;
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(s.name + ' ' + s.prefecture) + '&travelmode=' + mode;
  }

  function statusBadge(s) {
    var map = { demo: ['デモデータ', 'badge-demo'], unverified: ['未確認', 'badge-warn'], verified: ['確認済み', 'badge-ok'] };
    var v = map[s.verification_status] || map.demo;
    return el('span', 'badge ' + v[1], v[0]);
  }

  function goMap(s) {
    $('map-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { SpotMap.focus(s); }, 350);
  }

  function actions(s, modeKey) {
    var box = el('div', 'actions');
    var b = el('button', 'btn-sub', 'この地図で見る');
    b.type = 'button';
    b.addEventListener('click', function () { goMap(s); });
    var a = el('a', 'btn-link', '経路を調べる（Googleマップ）');
    a.href = routeUrl(s, modeKey); a.target = '_blank'; a.rel = 'noopener noreferrer';
    box.append(b, a);
    return box;
  }

  function baseCard(s) {
    var card = el('article', 'card');
    var head = el('div', 'card-head');
    head.append(el('h3', null, s.name), statusBadge(s));
    var tags = el('div', 'tags');
    tags.append(el('span', 'tag', s.prefecture + (s.municipality ? ' ' + s.municipality : '')),
      el('span', 'tag tag-cat', s.category));
    card.append(head, tags, el('p', null, s.description));
    return card;
  }

  /* ---------- 入力欄の準備 ---------- */
  function setupForm() {
    PREFECTURES.forEach(function (p) {
      ['home', 'pref'].forEach(function (id) {
        var o = el('option', null, p[1]); o.value = p[1]; $(id).append(o);
      });
    });
    var t = new Date();
    $('birthday').max = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    $('birthday').min = '1900-01-01';

    var groups = {};
    WISH_OPTIONS.forEach(function (w) { (groups[w.group] = groups[w.group] || []).push(w.key); });
    Object.keys(groups).forEach(function (g) {
      var row = el('div', 'chip-row');
      row.append(el('span', 'chip-group', g));
      groups[g].forEach(function (k) {
        var lab = el('label', 'chip');
        var cb = el('input'); cb.type = 'checkbox'; cb.name = 'wish'; cb.value = k;
        lab.append(cb, el('span', null, k));
        row.append(lab);
      });
      $('wishes').append(row);
    });

    // 検索の種類はデータから自動生成
    Array.from(new Set(SPOTS.map(function (s) { return s.category; }))).forEach(function (c) {
      var o = el('option', null, c); o.value = c; $('category').append(o);
    });

    // 凡例
    Object.keys(SpotMap.CATEGORY_COLORS).forEach(function (c) {
      var item = el('span', 'legend-item');
      var dot = el('span', 'legend-dot'); dot.style.background = SpotMap.CATEGORY_COLORS[c];
      item.append(dot, document.createTextNode(c));
      $('legend').append(item);
    });
  }

  /* ---------- 診断 ---------- */
  function showError(msgs) {
    var box = $('form-error');
    box.replaceChildren();
    if (!msgs.length) { box.hidden = true; return; }
    msgs.forEach(function (m) { box.append(el('div', null, m)); });
    box.hidden = false;
  }

  function diagnose() {
    var birthday = $('birthday').value;
    var home = $('home').value;
    var errs = [];
    var bErr = D.validateBirthday(birthday);
    if (bErr) errs.push(bErr);
    if (!home) errs.push('お住まいの都道府県を選択してください。');
    $('birthday').setAttribute('aria-invalid', bErr ? 'true' : 'false');
    $('home').setAttribute('aria-invalid', home ? 'false' : 'true');
    showError(errs);
    if (errs.length) { $('form-error').focus(); return; }

    var wishes = Array.from(document.querySelectorAll('input[name=wish]:checked')).map(function (c) { return c.value; });
    var modeKey = document.querySelector('input[name=mode]:checked').value;
    var mode = cfg.travelModes[modeKey];
    var n = D.lifePath(birthday);
    var origin = prefByName(home);
    var ranked = D.rankSpots(SPOTS, { number: n, origin: origin, wishes: wishes, mode: modeKey }, cfg).slice(0, cfg.resultCount);

    var sum = $('summary');
    sum.replaceChildren();
    sum.append(el('div', 'summary-main', 'あなたの数秘ナンバー：' + n + '（' + D.NUMEROLOGY_MEANINGS[n] + '）'));
    var ul = el('ul', 'summary-list');
    ul.append(el('li', null, '出発地の目安：' + home + '（都道府県庁付近・概算）'));
    ul.append(el('li', null, '願い・体験：' + (wishes.length ? wishes.join('・') + '（一致するスポットを優先して表示）' : '指定なし')));
    ul.append(el('li', null, '交通手段：' + mode.label + '（直線' + mode.rangeKm + 'km以内を「近い」と見なす目安）'));
    sum.append(ul);

    var out = $('recommended');
    out.replaceChildren();
    if (modeKey === 'walk' && !ranked.some(function (s) { return s.inRange; })) {
      out.append(el('p', 'notice', '徒歩の目安圏内（直線' + mode.rangeKm + 'km）にスポットがありません。デモデータが8件だけのためです。下の候補は参考としてご覧ください。'));
    }
    ranked.forEach(function (s, i) {
      var c = baseCard(s);
      c.prepend(el('div', 'rank', '第' + (i + 1) + '位'));
      c.append(el('p', 'match', s.numMatch
        ? 'このスポットのテーマ（' + s.themes.join('・') + '）が、数秘ナンバー' + n + '「' + D.NUMEROLOGY_MEANINGS[n] + '」と重なります。'
        : 'テーマ：' + s.themes.join('・') + '。数秘ナンバーとの重なりはありませんが、他の条件から候補に入りました。'));

      var meta = el('dl', 'meta');
      [['方角・距離', s.direction + '／直線 約' + Math.round(s.km) + 'km（概算）'],
       ['スコア', s.score + ' / 100'],
       ['データ', s.verification_status === 'demo' ? 'デモデータ（参考候補・内容未確認）' : s.verification_status]].forEach(function (r) {
        meta.append(el('dt', null, r[0]), el('dd', null, r[1]));
      });
      c.append(meta);

      var det = el('details', 'reasons');
      det.append(el('summary', null, '推薦の根拠と点数の内訳'));
      var rl = el('ul');
      s.reasons.forEach(function (r) { rl.append(el('li', null, r)); });
      var p = s.scoreParts, w = cfg.weights;
      rl.append(el('li', 'parts', '数秘 ' + p.numerology + '/' + w.numerology + '・願い ' + p.wish + '/' + w.wish +
        '・近さ ' + p.distance + '/' + w.distance + '・データ信頼性 ' + p.reliability + '/' + w.reliability));
      if (s.access_note) rl.append(el('li', null, '訪問の注意：' + s.access_note));
      det.append(rl);
      c.append(det, actions(s, modeKey));
      out.append(c);
    });

    $('diagnosis').hidden = false;
    SpotMap.showRanking(ranked, origin);
    $('diagnosis').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- 検索 ---------- */
  function search() {
    var q = $('keyword').value.trim().toLowerCase();
    var pref = $('pref').value, cat = $('category').value;
    var arr = SPOTS.filter(function (s) {
      if (s.publication_status !== cfg.publicStatus) return false;
      var text = [s.name, s.prefecture, s.municipality, s.description, s.themes.join(' '), s.wishes.join(' ')].join(' ').toLowerCase();
      return (!pref || s.prefecture === pref) && (!cat || s.category === cat) && (!q || text.indexOf(q) !== -1);
    });
    $('count').textContent = '（' + arr.length + '件）';
    var out = $('results');
    out.replaceChildren();
    if (!arr.length) out.append(el('p', 'notice', '該当するスポットはありません。条件を変えてお試しください。'));
    arr.forEach(function (s) {
      var c = baseCard(s);
      var t = el('p', 'small', 'テーマ：' + s.themes.join('・'));
      c.append(t, actions(s, 'transit'));
      out.append(c);
    });
    SpotMap.showSpots(arr);
  }

  /* ---------- 起動 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('version').textContent = 'v' + cfg.version;
    $('spot-total').textContent = SPOTS.length;
    var mapOk = SpotMap.init('map');
    setupForm();
    $('diagnose-form').addEventListener('submit', function (e) { e.preventDefault(); diagnose(); });
    $('keyword').addEventListener('input', search);
    $('pref').addEventListener('change', search);
    $('category').addEventListener('change', search);
    $('reset-search').addEventListener('click', function () {
      $('keyword').value = ''; $('pref').value = ''; $('category').value = ''; search();
    });
    search();
    if (mapOk) window.addEventListener('resize', SpotMap.invalidate);
  });
})();
