/*
 * 画面の組み立てと操作（入力・診断・検索・地図連動）
 * 読み込み順：config.js → data/spots-demo.js → diagnosis.js → map.js → app.js
 */
(function () {
  'use strict';

  var cfg = APP_CONFIG, D = Diagnosis;
  var SPOTS_ALL = window.ALL_SPOTS || SPOTS;
  var PAGE = 60;
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

  // 経路リンク。出発地をくわしく指定している場合だけ、その位置を出発地として渡す
  function routeUrl(s, modeKey, origin) {
    var mode = (cfg.travelModes[modeKey] || cfg.travelModes.transit).gmaps;
    var url = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(s.name + ' ' + s.prefecture) + '&travelmode=' + mode;
    if (origin && origin.precise) url += '&origin=' + origin.lat.toFixed(5) + ',' + origin.lon.toFixed(5);
    return url;
  }

  function limitText(min) {
    if (min < 60) return min + '分';
    var h = Math.floor(min / 60), m = min % 60;
    return h + '時間' + (m ? m + '分' : '');
  }

  function kmText(km) { return km < 10 ? km.toFixed(1) : String(Math.round(km)); }

  function statusBadge(s) {
    var map = { demo: ['デモデータ', 'badge-demo'], unverified: ['OSM・未確認', 'badge-warn'], verified: ['確認済み', 'badge-ok'] };
    var v = map[s.verification_status] || map.demo;
    return el('span', 'badge ' + v[1], v[0]);
  }

  function goMap(s) {
    $('map-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { SpotMap.focus(s); }, 350);
  }

  function actions(s, modeKey, origin) {
    var box = el('div', 'actions');
    var b = el('button', 'btn-sub', 'この地図で見る');
    b.type = 'button';
    b.addEventListener('click', function () { goMap(s); });
    var a = el('a', 'btn-link', '経路を調べる（Googleマップ）');
    a.href = routeUrl(s, modeKey, origin); a.target = '_blank'; a.rel = 'noopener noreferrer';
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
    var objTags = s.wishes.filter(function (w) { return !s.wishesInferred || s.wishesInferred.indexOf(w) === -1; });
    if (objTags.length) card.append(el('p', 'small', '特徴：' + objTags.join('・')));
    if (s.wishesInferred && s.wishesInferred.length) card.append(el('p', 'small', 'ご利益（名称などからの推定）：' + s.wishesInferred.join('・')));
    if (s.source_urls && s.source_urls.length) {
      var src = el('p', 'small src');
      src.append(document.createTextNode('情報元：'));
      s.source_urls.forEach(function (u, i) {
        var a = el('a', null, u.indexOf('wikipedia') !== -1 ? 'Wikipedia' : 'OpenStreetMap');
        a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer';
        if (i) src.append(document.createTextNode('・'));
        src.append(a);
      });
      card.append(src);
    }
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

    // 選んでいる願い・体験の表示
    var updateWishStatus = function () {
      var sel = Array.from(document.querySelectorAll('input[name=wish]:checked')).map(function (c) { return c.value; });
      $('wish-selected').textContent = sel.length ? '選択中：' + sel.join('・') + '（' + sel.length + '件）' : '選択中：なし';
      $('wish-clear').hidden = !sel.length;
    };
    $('wishes').addEventListener('change', updateWishStatus);
    $('wish-clear').addEventListener('click', function () {
      document.querySelectorAll('input[name=wish]:checked').forEach(function (c) { c.checked = false; });
      updateWishStatus();
    });

    // 所要時間の選択肢
    cfg.timeLimits.forEach(function (m) {
      var o = el('option', null, limitText(m) + '以内'); o.value = String(m); $('time-limit').append(o);
    });

    // 検索の種類はデータから自動生成
    Array.from(new Set(SPOTS_ALL.map(function (s) { return s.category; }))).forEach(function (c) {
      var o = el('option', null, c); o.value = c; $('category').append(o);
    });

    // 検索用の願い・体験
    WISH_OPTIONS.forEach(function (w) { var o = el('option', null, w.key); o.value = w.key; $('search-wish').append(o); });

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

  /* ---------- 方位の早見表 ---------- */
  var MARK = { best: '◎', good: '○', normal: '―', kyo: '×' };
  var PALACE_DEG = { '北': 0, '北東': 45, '東': 90, '南東': 135, '南': 180, '南西': 225, '西': 270, '北西': 315 };
  function renderFortuneTable(boards) {
    var box = $('fortune-table');
    box.replaceChildren();
    if (!boards) { box.hidden = true; return; }
    box.append(el('h3', null, 'この日の方位の早見表'));
    var tbl = el('table');
    var head = el('tr');
    ['方位', '年盤', '月盤', '日盤', '総合'].forEach(function (h) { head.append(el('th', null, h)); });
    tbl.append(head);
    Kyusei.PALACES.forEach(function (p) {
      var tr = el('tr');
      tr.append(el('th', null, p));
      ['year', 'month', 'day'].forEach(function (k) {
        var c = boards[k].palaces[p];
        var td = el('td', 'lv-' + c.level, MARK[c.level] + ' ' + Kyusei.STAR_SHORT[c.star]);
        if (c.bad.length) td.append(el('span', 'bad', c.bad.join('・')));
        tr.append(td);
      });
      var f = D.judgeFortune(boards, PALACE_DEG[p], 100, cfg);
      tr.append(el('td', 'total', f.mark + ' ' + f.label));
      tbl.append(tr);
    });
    box.append(tbl);
    box.append(el('p', 'note', '◎最大吉方（本命星・月命星の両方に吉）　○吉方（本命星に吉）　―吉凶なし　×凶。方位は東西南北30°・四隅60°、真北基準。年盤か月盤で凶の方位は「避けたい方位」として後ろに並べています。'));
    box.hidden = false;
  }

  function diagnose() {
    var birthday = $('birthday').value;
    var home = $('home').value;
    var origin = OriginPicker.current();
    var errs = [];
    var bErr = D.validateBirthday(birthday);
    if (bErr) errs.push(bErr);
    if (!origin) errs.push('お住まいの都道府県を選択してください。');
    var tripDate = $('trip-date').value;
    var tErr = null;
    if (tripDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tripDate)) tErr = '出かける日の形式が正しくありません。';
      else {
        var ty = Number(tripDate.slice(0, 4));
        if (ty < 1901 || ty > 2100) tErr = '出かける日は1901年〜2100年の範囲で入力してください。';
      }
      if (tErr) errs.push(tErr);
    }
    $('trip-date').setAttribute('aria-invalid', tErr ? 'true' : 'false');
    $('birthday').setAttribute('aria-invalid', bErr ? 'true' : 'false');
    $('home').setAttribute('aria-invalid', origin ? 'false' : 'true');
    showError(errs);
    if (errs.length) { $('form-error').focus(); return; }

    var wishes = Array.from(document.querySelectorAll('input[name=wish]:checked')).map(function (c) { return c.value; });
    var modeKey = document.querySelector('input[name=mode]:checked').value;
    var mode = cfg.travelModes[modeKey];
    var limit = Number($('time-limit').value) || null;
    var n = D.lifePath(birthday);
    var person = Kyusei.birthStars(birthday);
    var boards = tripDate ? Kyusei.boardsFor(tripDate, person) : null;
    var all = D.rankSpots(SPOTS_ALL, { number: n, origin: origin, wishes: wishes, mode: modeKey, limitMinutes: limit, boards: boards }, cfg);
    var within = all.filter(function (s) { return s.withinLimit; });
    var shown = within.length ? within.slice(0, cfg.resultCount) : all.slice(0, 3);

    var sum = $('summary');
    sum.replaceChildren();
    sum.append(el('div', 'summary-main', 'あなたの数秘ナンバー：' + n + '（' + D.NUMEROLOGY_MEANINGS[n] + '）'));
    var ul = el('ul', 'summary-list');
    ul.append(el('li', null, '出発地：' + origin.label + (origin.precise ? '（' + OriginPicker.SOURCE_LABEL[origin.source] + '）' : '・概算')));
    ul.append(el('li', null, '願い・体験：' + (wishes.length ? wishes.join('・') + '（一致するスポットを優先して表示）' : '指定なし')));
    ul.append(el('li', null, '交通手段：' + mode.label + (limit ? '・' + limitText(limit) + '以内（目安）' : '・所要時間の指定なし')));
    ul.append(el('li', null, '九星：本命星 ' + Kyusei.STAR_NAMES[person.honmei] + '／月命星 ' + Kyusei.STAR_NAMES[person.getsumei]));
    person.notes.forEach(function (t) { ul.append(el('li', 'warn', t)); });
    if (boards) {
      var td = tripDate.split('-').map(Number);
      ul.append(el('li', null, '出かける日：' + td[0] + '年' + td[1] + '月' + td[2] + '日（' + boards.dayGanzhi + '）　年盤 ' +
        Kyusei.STAR_SHORT[boards.year.center] + '中宮・月盤 ' + Kyusei.STAR_SHORT[boards.month.center] + '中宮・日盤 ' +
        Kyusei.STAR_SHORT[boards.day.center] + '中宮（' + (boards.daySwitch.yang ? '陽遁' : '陰遁') + '）'));
      if (boards.boundaryTerm) {
        ul.append(el('li', 'warn', 'この日は' + boards.boundaryTerm.name + 'の節入り日です（' + boards.boundaryTerm.hh + '時' +
          String(boards.boundaryTerm.mm).padStart(2, '0') + '分）。この日は新しい月の盤で判定しています。'));
      }
      if (boards.year.honmeiInCenter) ul.append(el('li', 'warn', '本命星が年盤の中宮にあります（八方塞がりとして、遠出を控える流派もあります）。'));
      if (boards.month.honmeiInCenter) ul.append(el('li', 'warn', '本命星が月盤の中宮にあります（八方塞がりとして、遠出を控える流派もあります）。'));
    } else {
      ul.append(el('li', null, '出かける日：指定なし（日付を入れると方位の吉凶も判定します）'));
    }
    sum.append(ul);
    renderFortuneTable(boards);

    var out = $('recommended');
    out.replaceChildren();
    if (limit && !within.length) {
      out.append(el('p', 'notice', mode.label + 'で' + limitText(limit) + '以内（目安）に行けるスポットは見つかりませんでした。いまはデモデータが8件だけのためです。参考として、条件に近い候補を表示します。'));
    } else if (limit && within.length < cfg.resultCount) {
      out.append(el('p', 'notice', mode.label + 'で' + limitText(limit) + '以内（目安）のスポットは' + within.length + '件でした。'));
    }
    if (wishes.length && !all.some(function (s) { return s.hitWishes.length; })) {
      out.append(el('p', 'notice', '選んだ願い・体験（' + wishes.join('・') + '）に当てはまるスポットは、いまのデモデータにはまだありません。全国のデータを追加すると表示されるようになります。参考として、ほかの条件で選んだ候補を表示します。'));
    }
    if (boards && shown.length && shown.every(function (s) { return s.fortune && s.fortune.tier === 0; })) {
      var goodDirs = [], cautionDirs = [];
      Kyusei.PALACES.forEach(function (p) {
        var f = D.judgeFortune(boards, PALACE_DEG[p], 100, cfg);
        if (f.mark === '◎' || f.mark === '○') goodDirs.push(p);
        else if (f.mark === '△') cautionDirs.push(p);
      });
      out.append(el('p', 'notice', 'この日は、候補のスポットがすべて年盤か月盤で凶の方位になりました。' +
        (goodDirs.length ? 'この日の吉方位は「' + goodDirs.join('・') + '」です（早見表参照）。'
          : cautionDirs.length ? '年盤・月盤では「' + cautionDirs.join('・') + '」が吉ですが、この日は日盤で凶です。'
          : 'この日は年盤・月盤ともに吉になる方位がありません。') +
        '別の日を選ぶか、参考として下の候補をご覧ください。'));
    }
    shown.forEach(function (s, i) {
      var c = baseCard(s);
      c.prepend(el('div', 'rank', '第' + (i + 1) + '位'));
      c.append(el('p', 'match', s.numMatch
        ? 'このスポットのテーマ（' + s.themes.join('・') + '）が、数秘ナンバー' + n + '「' + D.NUMEROLOGY_MEANINGS[n] + '」と重なります。'
        : 'テーマ：' + s.themes.join('・') + '。数秘ナンバーとの重なりはありませんが、他の条件から候補に入りました。'));

      var meta = el('dl', 'meta');
      [['方角', s.direction === '—' ? '—（出発地のすぐ近く）' : s.direction + '（真北から' + Math.round(s.bearing) + '°）'],
       ['距離', '直線 約' + kmText(s.km) + 'km' + (origin.precise ? '' : '（概算）')],
       ['所要時間', mode.label + 'で' + s.minutesText + '（目安）' + (s.withinLimit ? '' : '・指定時間を超えます')]].concat(
        s.fortune ? [['方位の運気', s.fortune.mark + ' ' + s.fortune.label + (s.fortune.nearEdge ? '（方位の境界付近）' : '')]] : []).concat([
       ['スコア', s.score + ' / 100'],
       ['データ', s.verification_status === 'demo' ? 'デモデータ（参考候補・内容未確認）' : s.verification_status === 'unverified' ? 'OpenStreetMapのデータ（内容は未確認）' : '確認済み']]).forEach(function (r) {
        meta.append(el('dt', null, r[0]), el('dd', null, r[1]));
      });
      c.append(meta);

      var det = el('details', 'reasons');
      det.append(el('summary', null, '推薦の根拠と点数の内訳'));
      var rl = el('ul');
      s.reasons.forEach(function (r) { rl.append(el('li', null, r)); });
      var p = s.scoreParts, w = cfg.weights;
      if (s.fortune) {
        s.fortune.detail.forEach(function (t) { rl.append(el('li', 'small-li', t)); });
        if (s.fortune.nearEdge) rl.append(el('li', 'small-li', '方位の区切り線から' + cfg.kyusei.edgeWarnDeg + '°以内です。出発地の位置で判定が変わることがあります。'));
      }
      rl.append(el('li', 'parts', '数秘 ' + p.numerology + '/' + w.numerology + '・願い ' + p.wish + '/' + w.wish +
        '・近さ ' + p.distance + '/' + w.distance + '・運気 ' + p.kyusei + '/' + w.kyusei + '・知名度 ' + p.fame + '/' + w.fame + '・データ信頼性 ' + p.reliability + '/' + w.reliability));
      if (s.access_note) rl.append(el('li', null, '訪問の注意：' + s.access_note));
      det.append(rl);
      c.append(det, actions(s, modeKey, origin));
      out.append(c);
    });

    $('diagnosis').hidden = false;
    SpotMap.showRanking(shown, origin);
    $('diagnosis').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- 検索 ---------- */
  var searchResult = [], shownCount = 0;
  function renderMore() {
    var out = $('results');
    var old = $('more-results'); if (old) old.remove();
    searchResult.slice(shownCount, shownCount + PAGE).forEach(function (s) {
      var c = baseCard(s);
      c.append(actions(s, 'transit'));
      out.append(c);
    });
    shownCount = Math.min(searchResult.length, shownCount + PAGE);
    if (shownCount < searchResult.length) {
      var b = el('button', 'btn-sub more', 'さらに表示（残り' + (searchResult.length - shownCount) + '件）');
      b.type = 'button'; b.id = 'more-results';
      b.addEventListener('click', renderMore);
      out.append(b);
    }
  }
  function search() {
    var q = $('keyword').value.trim().toLowerCase();
    var pref = $('pref').value, cat = $('category').value, wish = $('search-wish').value;
    searchResult = SPOTS_ALL.filter(function (s) {
      if (s.publication_status !== cfg.publicStatus) return false;
      if (pref && s.prefecture !== pref) return false;
      if (cat && s.category !== cat) return false;
      if (wish && s.wishes.indexOf(wish) === -1) return false;
      if (!q) return true;
      var text = s._text || (s._text = [s.name, s.prefecture, s.municipality, s.description, s.wishes.join(' ')].join(' ').toLowerCase());
      return text.indexOf(q) !== -1;
    }).sort(function (a, b) { return (b.fame || 0) - (a.fame || 0); });
    $('count').textContent = '（' + searchResult.length.toLocaleString() + '件）';
    var out = $('results');
    out.replaceChildren();
    shownCount = 0;
    if (!searchResult.length) out.append(el('p', 'notice', '該当するスポットはありません。条件を変えてお試しください。'));
    else out.append(el('p', 'note list-note', '知名度の高い順に表示しています。地図には条件に合うすべてのスポットを表示します。'));
    renderMore();
    SpotMap.showSpots(searchResult, !!(q || pref || cat || wish));
  }
  var searchTimer = null;
  function searchLater() { clearTimeout(searchTimer); searchTimer = setTimeout(search, 250); }

  /* ---------- 起動 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('version').textContent = 'v' + cfg.version;
    $('spot-total').textContent = SPOTS_ALL.length.toLocaleString();
    var mapOk = SpotMap.init('map');
    setupForm();
    OriginPicker.init({ config: cfg, prefLookup: function () { return prefByName($('home').value); } });
    $('home').addEventListener('change', OriginPicker.prefChanged);
    $('diagnose-form').addEventListener('submit', function (e) { e.preventDefault(); diagnose(); });
    $('keyword').addEventListener('input', searchLater);
    $('pref').addEventListener('change', search);
    $('category').addEventListener('change', search);
    $('search-wish').addEventListener('change', search);
    $('reset-search').addEventListener('click', function () {
      $('keyword').value = ''; $('pref').value = ''; $('category').value = ''; $('search-wish').value = ''; search();
    });
    search();
    if (mapOk) window.addEventListener('resize', SpotMap.invalidate);
  });
})();
