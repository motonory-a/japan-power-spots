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
    if (s.wishesInferred && s.wishesInferred.length) card.append(el('p', 'small', 'ご利益（' + (s.deities && s.deities.length ? '祭神・名称' : '名称') + 'からの推定）：' + s.wishesInferred.join('・')));
    if (cfg.reportForms && cfg.reportForms.fix) {
      var fix = el('a', 'report-link', '情報の誤りを報告');
      fix.href = cfg.reportForms.fix + (cfg.reportForms.fix.indexOf('github.com') !== -1
        ? '&title=' + encodeURIComponent('【訂正】' + s.name) + '&name=' + encodeURIComponent(s.name) + '&spot_id=' + encodeURIComponent(s.id) : '');
      fix.target = '_blank'; fix.rel = 'noopener noreferrer';
      card.append(fix);
    }
    if (s.source_urls && s.source_urls.length) {
      var src = el('p', 'small src');
      src.append(document.createTextNode('情報元：'));
      s.source_urls.forEach(function (u, i) {
        var a = el('a', null, u.indexOf('wikipedia') !== -1 ? 'Wikipedia' : (u.indexOf('wikidata') !== -1 ? 'Wikidata' : (u.indexOf('biodic') !== -1 ? '環境省 巨樹・巨木林データベース' : 'OpenStreetMap')));
        a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer';
        if (i) src.append(document.createTextNode('・'));
        src.append(a);
      });
      card.append(src);
    }
    return card;
  }

  /* ---------- 生年月日（年・月・日の選択） ---------- */
  // 和暦の表示（改元の年は両方）
  function eraLabel(y) {
    var eras = [[2019, '令和'], [1989, '平成'], [1926, '昭和'], [1912, '大正'], [1868, '明治']];
    var out = [];
    for (var i = 0; i < eras.length; i++) {
      var e = eras[i];
      if (y >= e[0]) {
        var n = y - e[0] + 1;
        out.unshift(e[1] + (n === 1 ? '元' : n));
        // 改元の年は、前の元号の最終年も
        if (n === 1 && eras[i + 1]) out.unshift(eras[i + 1][1] + (y - eras[i + 1][0] + 1));
        break;
      }
    }
    return out.join('・') + '年';
  }
  function daysIn(y, m) { return new Date(y || 2000, m, 0).getDate(); }
  var Birthday = {
    init: function () {
      var thisYear = new Date().getFullYear();
      for (var y = thisYear; y >= 1920; y--) {
        var o = el('option', null, y + '年（' + eraLabel(y) + '）'); o.value = String(y); $('bd-y').append(o);
      }
      for (var m = 1; m <= 12; m++) { var om = el('option', null, m + '月'); om.value = String(m); $('bd-m').append(om); }
      Birthday.fillDays();
      ['bd-y', 'bd-m', 'bd-d'].forEach(function (id) {
        $(id).addEventListener('change', function () { if (id !== 'bd-d') Birthday.fillDays(); Birthday.toHidden(); });
      });
    },
    fillDays: function () {
      var y = Number($('bd-y').value), m = Number($('bd-m').value), cur = $('bd-d').value;
      var n = m ? daysIn(y, m) : 31;
      $('bd-d').replaceChildren(el('option', null, '日'));
      $('bd-d').firstChild.value = '';
      for (var d = 1; d <= n; d++) { var o = el('option', null, d + '日'); o.value = String(d); $('bd-d').append(o); }
      if (cur && Number(cur) <= n) $('bd-d').value = cur;
    },
    toHidden: function () {
      var y = $('bd-y').value, m = $('bd-m').value, d = $('bd-d').value;
      $('birthday').value = (y && m && d) ? y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0') : '';
    },
    // 隠し項目（保存した内容の読み込みなど）から選択欄へ
    sync: function () {
      var v = $('birthday').value, p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
      if (!p) { $('bd-y').value = ''; $('bd-m').value = ''; Birthday.fillDays(); $('bd-d').value = ''; return; }
      $('bd-y').value = String(Number(p[1])); $('bd-m').value = String(Number(p[2]));
      Birthday.fillDays(); $('bd-d').value = String(Number(p[3]));
    },
    setInvalid: function (bad) { ['bd-y', 'bd-m', 'bd-d'].forEach(function (id) { $(id).setAttribute('aria-invalid', bad ? 'true' : 'false'); }); }
  };
  window.BirthdayInput = Birthday;

  /* ---------- 入力欄の準備 ---------- */
  function setupForm() {
    PREFECTURES.forEach(function (p) {
      ['home', 'pref'].forEach(function (id) {
        var o = el('option', null, p[1]); o.value = p[1]; $(id).append(o);
      });
    });
    Birthday.init();

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
    var presentCats = new Set(SPOTS_ALL.map(function (x) { return x.category; }));
    Object.keys(SpotMap.CATEGORY_COLORS).filter(function (c) { return presentCats.has(c); }).forEach(function (c) {
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

  /* ---------- あなたの気学（今の状態と吉方位） ---------- */
  function todayStr() {
    var t = new Date();
    return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  }
  function renderKigaku(person, boards) {
    var K = Kyusei, box = $('kigaku-panel');
    box.replaceChildren();
    var today = todayStr();
    var o;
    try { o = K.outlook(person, today, 6); } catch (e) { return; }
    var td = today.split('-').map(Number);
    box.append(el('h3', null, 'あなたの気学 ― 今の状態と吉方位（' + td[0] + '年' + td[1] + '月' + td[2] + '日時点）'));

    // 八角形の方位盤（今年・今月・出かける日を切り替え）
    if (window.KigakuBoard) {
      var t0 = today.split('-').map(Number), ym = K.kigakuYM(t0[0], t0[1], t0[2]);
      var views = [
        { key: 'year', label: '今年の盤（' + o.kYear + '年）', judged: K.judgeBoard(o.yearCenter, K.yearBranch(ym.kYear), '歳破', person) },
        { key: 'month', label: '今月の盤（' + o.months[0].start.m + '/' + o.months[0].start.d + '〜）', judged: K.judgeBoard(o.monthCenter, K.monthBranch(ym.monthIdx), '月破', person) }
      ];
      if (boards) {
        var bd = boards.date.split('-').map(Number);
        views.push({ key: 'day', label: '出かける日（' + bd[1] + '/' + bd[2] + '）の日盤', judged: boards.day });
      }
      var bwrap = el('div', 'kg-board-wrap');
      var tabs = el('div', 'kg-tabs');
      tabs.setAttribute('role', 'tablist');
      var holder = el('div', 'kg-board-holder');
      var caption = el('p', 'kg-caption');
      var show = function (i) {
        holder.replaceChildren(KigakuBoard.draw(views[i].judged, person, { title: views[i].label }));
        Array.prototype.forEach.call(tabs.children, function (b, j) { b.setAttribute('aria-selected', i === j ? 'true' : 'false'); });
        var place = K.placeOfStar(views[i].judged.center, person.honmei);
        caption.textContent = views[i].label + '：中宮は' + K.STAR_NAMES[views[i].judged.center] + '。あなたの本命星（' + K.STAR_SHORT[person.honmei] + '）は' +
          (place === '中宮' ? '中宮' : place) + 'にあります。';
      };
      views.forEach(function (v, i) {
        var b = el('button', 'kg-tab', v.label);
        b.type = 'button'; b.setAttribute('role', 'tab');
        b.addEventListener('click', function () { show(i); });
        tabs.append(b);
      });
      bwrap.append(tabs, holder, caption, KigakuBoard.legend());
      box.append(bwrap);
      show(boards ? views.length - 1 : 0);
    }

    var dl = el('dl', 'kg-stars');
    dl.append(el('dt', null, '本命星　' + K.STAR_NAMES[o.honmei]), el('dd', null, o.honmeiNature + '（生まれ年の星。運気の流れを見る基本の星）'));
    dl.append(el('dt', null, '月命星　' + K.STAR_NAMES[o.getsumei]), el('dd', null, o.getsumeiNature + '（生まれ月の星。性格や、吉方位を絞るときに使う星）'));
    box.append(dl);

    var st = el('div', 'kg-state');
    var y1 = el('p');
    y1.append(el('strong', null, '今年（' + o.kYear + '年・' + K.STAR_SHORT[o.yearCenter] + '中宮）：'),
      document.createTextNode('本命星は「' + (o.yearPlace === '中宮' ? '中宮' : o.yearPlace + '（' + o.yearMeaning.name + '）') + '」に入っています。' + o.yearMeaning.text));
    var cm = o.months[0];
    var m1 = el('p');
    m1.append(el('strong', null, '今月（' + cm.start.m + '月' + cm.start.d + '日〜・' + K.STAR_SHORT[o.monthCenter] + '中宮）：'),
      document.createTextNode('本命星は「' + (o.monthPlace === '中宮' ? '中宮' : o.monthPlace + '（' + o.monthMeaning.name + '）') + '」。' + o.monthMeaning.text));
    st.append(y1, m1);
    box.append(st);

    var yg = el('p', 'kg-dirs');
    yg.append(el('strong', null, '今年の方位：'),
      document.createTextNode('吉方位 ' + (o.yearGood.length ? o.yearGood.join('・') : 'なし') +
        (o.yearBest.length ? '（最大吉方：' + o.yearBest.join('・') + '）' : '') + '／避けたい方位 ' +
        o.yearKyo.map(function (k) { return k.dir + '（' + k.why.join('・') + '）'; }).join('、')));
    box.append(yg);

    box.append(el('h4', null, 'これからの6か月の吉方位（年盤・月盤で判定）'));
    var wrap = el('div', 'kg-table');
    var tbl = el('table'), hr = el('tr');
    ['期間', '◎ 年・月とも吉', '○ 年か月が吉', '× 避けたい方位'].forEach(function (h) { hr.append(el('th', null, h)); });
    tbl.append(hr);
    o.months.forEach(function (m, i) {
      var next = o.months[i + 1];
      var tr = el('tr');
      var period = m.start.m + '/' + m.start.d + '〜' + (next ? (function () {
        var d = new Date(Date.UTC(next.start.y, next.start.m - 1, next.start.d - 1));
        return (d.getUTCMonth() + 1) + '/' + d.getUTCDate();
      })() : '');
      var th = el('th', null, period);
      th.append(el('span', 'sub', K.STAR_SHORT[m.monthCenter] + '中宮' + (m.kYear !== o.kYear ? '・' + m.kYear + '年' : '')));
      if (m.honmeiInCenter) th.append(el('span', 'sub warn', '本命星が中宮（八方塞がり）'));
      tr.append(th);
      var good2 = m.dirs.best.map(function (d) { return d + '（最大吉方）'; }).concat(m.dirs.good2);
      tr.append(el('td', 'lv-best', good2.length ? good2.join('・') : 'なし'));
      tr.append(el('td', 'lv-good', m.dirs.good1.length ? m.dirs.good1.join('・') : 'なし'));
      tr.append(el('td', 'lv-kyo', m.dirs.kyo.join('・')));
      if (i === 0) tr.classList.add('now');
      tbl.append(tr);
    });
    wrap.append(tbl);
    box.append(wrap);
    if (o.months.some(function (m) { return m.honmeiInCenter; })) {
      box.append(el('p', 'note warn', '「本命星が中宮（八方塞がり）」の期間は、どの方位にも吉方位が出にくく、遠出や大きな決断を控えるとする流派もあります。'));
    }
    box.append(el('p', 'note', '方位の吉凶は九星気学の一般的な考え方（年盤・月盤、東西南北30°・四隅60°）による目安で、流派によって異なります。出かける日を入れると、その日の日盤も含めた早見表が下に出ます。'));
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

  var extrasReady = false;
  function diagnose() {
    if (!extrasReady && window.SpotData && SpotData.loadExtras) {
      var btn = $('diagnose');
      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = '全国のデータを読み込み中…';
      var done = false;
      var go = function () { if (done) return; done = true; btn.disabled = false; btn.textContent = label; runDiagnose(); };
      SpotData.loadExtras().then(go);
      setTimeout(go, 15000); // 読み込みが遅いときは、読めた分で診断する
      return;
    }
    runDiagnose();
  }

  function runDiagnose() {
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
    Birthday.setInvalid(!!bErr);
    $('home').setAttribute('aria-invalid', origin ? 'false' : 'true');
    showError(errs);
    if (errs.length) { $('form-error').focus(); $('form-error').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (window.Profiles) Profiles.remember();

    var wishes = Array.from(document.querySelectorAll('input[name=wish]:checked')).map(function (c) { return c.value; });
    var modeKey = document.querySelector('input[name=mode]:checked').value;
    var mode = cfg.travelModes[modeKey];
    var limit = Number($('time-limit').value) || null;
    var n = D.lifePath(birthday);
    var person = Kyusei.birthStars(birthday);
    var boards = tripDate ? Kyusei.boardsFor(tripDate, person) : null;
    var all = D.rankSpots(SPOTS_ALL, { number: n, origin: origin, wishes: wishes, mode: modeKey, limitMinutes: limit, boards: boards }, cfg, { top: 300 });
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
    renderKigaku(person, boards);
    renderFortuneTable(boards);

    var out = $('recommended');
    out.replaceChildren();
    if (limit && !within.length) {
      out.append(el('p', 'notice', mode.label + 'で' + limitText(limit) + '以内（目安）に行けるスポットは見つかりませんでした。いまはデモデータが8件だけのためです。参考として、条件に近い候補を表示します。'));
    } else if (limit && all.withinCount < cfg.resultCount) {
      out.append(el('p', 'notice', mode.label + 'で' + limitText(limit) + '以内（目安）のスポットは' + all.withinCount + '件でした。'));
    }
    if (wishes.length && !all.anyWishHit) {
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
    var photoCards = [];
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
      photoCards.push({ spot: s, el: c });
    });

    $('diagnosis').hidden = false;
    if (window.SpotPhotos) SpotPhotos.attach(photoCards);
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
    var filtered = !!(q || pref || cat || wish);
    var onMap = filtered ? searchResult : searchResult.filter(function (s) { return s.tier !== 2; });
    if (onMap.length > 20000) onMap = onMap.slice(0, 20000);
    $('map-note').textContent = filtered ? (onMap.length < searchResult.length ? '地図には知名度の高い順に' + onMap.length.toLocaleString() + '件を表示しています。' : '')
      : '地図には知名度の高い' + onMap.length.toLocaleString() + '件を表示しています。種類や地域で絞り込むと、すべてのスポットを表示します。';
    SpotMap.showSpots(onMap, filtered);
  }
  var searchTimer = null, searchTouched = false;
  function searchLater() { searchTouched = true; clearTimeout(searchTimer); searchTimer = setTimeout(search, 250); }

  /* ---------- 起動 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('version').textContent = 'v' + cfg.version;
    if (cfg.reportForms && cfg.reportForms.add) $('report-add').href = cfg.reportForms.add; else $('report-panel').hidden = true;
    $('spot-total').textContent = SPOTS_ALL.length.toLocaleString();
    var mapOk = SpotMap.init('map');
    setupForm();
    OriginPicker.init({ config: cfg, prefLookup: function () { return prefByName($('home').value); } });
    $('home').addEventListener('change', OriginPicker.prefChanged);
    if (window.Profiles) Profiles.init();
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
    if (window.SpotData && SpotData.loadExtras && (window.SPOTS_OSM_META || {}).extraParts && SPOTS_OSM_META.extraParts.length) {
      var total = SPOTS_OSM_META.total || SPOTS_ALL.length;
      $('spot-total').textContent = '約' + (Math.round(total / 1000) * 1000).toLocaleString();
      $('load-status').textContent = '（追加データを読み込み中…）';
      SpotData.onExtraProgress(function (n, all, err) {
        $('load-status').textContent = err ? '（一部のデータを読み込めませんでした）' : (n < all ? '（追加データを読み込み中… ' + n + '/' + all + '）' : '');
      });
      setTimeout(function () {
        SpotData.loadExtras().then(function () {
          extrasReady = true;
          $('spot-total').textContent = SPOTS_ALL.length.toLocaleString();
          search();
        });
      }, 300);
    } else {
      extrasReady = true;
    }
  });
})();
