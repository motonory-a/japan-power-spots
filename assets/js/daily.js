/*
 * 毎日の楽しみ（仕様書v2.0 04）
 *   ・今日の幸せの扉：1日1回ひらく扉。今日の聖地・小さな幸せメッセージ・開運ミッションが現れる。
 *   ・今日の運命の聖地：日替わりのおすすめスポットと、週末のお出かけ提案。
 *   ・開運スタンプ帳：行きたい／行った／お気に入りのコレクションと、都道府県のスタンプ。
 * 「今日」は日本時間で決める。同じ日なら、何度読み込んでも同じ内容になる。
 * 連続ログインの記録や、見逃すと損をするような仕組みは作らない。
 */
(function (root) {
  'use strict';
  var DOOR_KEY = 'jps.door.v1';
  var MISSION_KEY = 'jps.mission.v1';
  var WD = ['日', '月', '火', '水', '木', '金', '土'];
  var ui, pool = [], todaySpot = null;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function store() { try { var s = root.localStorage; s.setItem('__jps', '1'); s.removeItem('__jps'); return s; } catch (e) { return null; } }
  function readJSON(k) { var s = store(); if (!s) return null; try { return JSON.parse(s.getItem(k) || 'null'); } catch (e) { return null; } }
  function writeJSON(k, v) { var s = store(); if (!s) return; try { s.setItem(k, JSON.stringify(v)); } catch (e) { /* 保存できなくても表示は続ける */ } }
  function reduced() { return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  // 文字列から決まった数を作る（FNV-1a）。日付が同じなら必ず同じ結果になる
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }

  // 日替わりの候補：Wikidataに登録があり（写真が出やすい）、ある程度知られたスポット
  function buildPool(spots) {
    return spots.filter(function (s) {
      if (!s.wikidata || s.publication_status !== 'public') return false;
      if (s.category === '神社' || s.category === '寺院') return (s.sitelinks || 0) >= 3;
      return s.category !== '祠';
    }).sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; });
  }

  function pickSpot(dateStr) {
    if (!pool.length) return null;
    var i = hash('spot|' + dateStr) % pool.length;
    var prev = hash('spot|' + JSTDate.today(new Date(Date.parse(dateStr + 'T00:00:00+09:00') - 864e5))) % pool.length;
    if (i === prev) i = (i + 1) % pool.length; // 2日続けて同じにならないように
    return pool[i];
  }

  function dateLabel(dateStr) {
    var p = dateStr.split('-').map(Number);
    var wd = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
    return p[1] + '月' + p[2] + '日（' + WD[wd] + '）';
  }

  // 生年月日が入っていれば数秘ナンバー（任意）
  function personalNumber() {
    var b = $('birthday') && $('birthday').value;
    if (!b || !root.Diagnosis || Diagnosis.validateBirthday(b)) return null;
    return Diagnosis.lifePath(b);
  }

  /* ---------- 今日の幸せの扉 ---------- */
  function doorContent(today, rec) {
    var box = el('div', 'door-content');
    box.id = 'door-content';
    box.append(el('p', 'door-date', dateLabel(today) + 'の扉'));
    var list = el('div', 'door-items');

    var s = todaySpot;
    var a = el('div', 'door-item');
    a.append(el('p', 'door-item-title', '今日の聖地'));
    if (s) {
      a.append(el('p', 'door-spot', s.name), el('p', 'door-sub', s.prefecture + (s.municipality ? ' ' + s.municipality : '') + '・' + s.category));
      var more = el('a', 'door-more', 'くわしく見る');
      more.href = '#h-daily-spot';
      a.append(more);
    } else a.append(el('p', 'door-sub', '準備中です。'));

    var b = el('div', 'door-item');
    b.append(el('p', 'door-item-title', '今日の小さな幸せ'));
    if (rec.n) b.append(el('p', 'door-sub', '数秘ナンバー' + rec.n + '（' + Diagnosis.NUMEROLOGY_MEANINGS[rec.n] + '）のあなたへ'));
    b.append(el('p', 'door-msg', DAILY_MESSAGES[rec.msg % DAILY_MESSAGES.length]));

    var c = el('div', 'door-item');
    c.append(el('p', 'door-item-title', '今日の開運ミッション'));
    c.append(el('p', 'door-msg', DAILY_MISSIONS[rec.mis % DAILY_MISSIONS.length]));
    var lab = el('label', 'check door-check');
    var cb = el('input'); cb.type = 'checkbox'; cb.id = 'mission-done';
    var m = readJSON(MISSION_KEY);
    cb.checked = !!(m && m.date === today && m.done);
    var thanks = el('span', 'door-thanks', 'すてきな一日になりますように。');
    thanks.hidden = !cb.checked;
    cb.addEventListener('change', function () { writeJSON(MISSION_KEY, { date: today, done: cb.checked }); thanks.hidden = !cb.checked; });
    lab.append(cb, document.createTextNode(' やってみた（記録は任意です）'));
    c.append(lab, thanks);

    list.append(a, b, c);
    box.append(list);
    box.append(el('p', 'note', '日替わりの読みものです。毎日0時（日本時間）に新しい扉になります。ご利益や効果を約束するものではありません。'));
    return box;
  }

  function renderDoor() {
    var sec = $('daily-door');
    var today = JSTDate.today();
    var saved = readJSON(DOOR_KEY);
    var opened = saved && saved.date === today;
    var wrap = el('div', 'door-wrap');
    sec.querySelectorAll('.door-wrap, .lead-small').forEach(function (n) { n.remove(); });
    sec.append(el('p', 'lead-small', '1日に1回、扉をひらくと、今日の聖地・小さな幸せ・開運ミッションが現れます。'), wrap);
    sec.hidden = false;

    if (opened) { wrap.append(doorContent(today, saved)); wrap.classList.add('is-open'); return; }

    var btn = el('button', 'door');
    btn.type = 'button';
    btn.id = 'door-open';
    btn.setAttribute('aria-label', dateLabel(today) + 'の扉をひらく');
    btn.append(el('span', 'door-light'), el('span', 'door-leaf door-l'), el('span', 'door-leaf door-r'));
    var cap = el('span', 'door-cap');
    cap.append(el('span', 'door-cap-date', dateLabel(today)), el('span', 'door-cap-text', '扉をひらく'));
    btn.append(cap);
    wrap.append(btn);
    btn.addEventListener('click', function () {
      var n = personalNumber();
      var rec = { date: today, n: n, msg: hash('msg|' + today + '|' + (n || 0)) % DAILY_MESSAGES.length, mis: hash('mis|' + today + '|' + (n || 0)) % DAILY_MISSIONS.length };
      writeJSON(DOOR_KEY, rec);
      var show = function () {
        btn.remove();
        var content = doorContent(today, rec);
        wrap.append(content);
        wrap.classList.add('is-open');
        content.setAttribute('tabindex', '-1');
        content.focus({ preventScroll: true });
      };
      if (reduced()) { show(); return; }
      btn.classList.add('opening');
      btn.disabled = true;
      setTimeout(show, 1100);
    });
  }

  /* ---------- 今日の運命の聖地と週末のお出かけ提案 ---------- */
  function nextWeekend() {
    var p = JSTDate.parts();
    var base = Date.UTC(p.y, p.m - 1, p.d);
    var add = p.wd === 0 ? -1 : 6 - p.wd; // 日曜は「この週末」（前日の土曜から）
    var sat = new Date(base + add * 864e5);
    var sun = new Date(base + (add + 1) * 864e5);
    var f = function (d) { return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); };
    return { sat: f(sat), sun: f(sun), isNow: p.wd === 6 || p.wd === 0, sunday: p.wd === 0 };
  }

  function renderDailySpot() {
    var sec = $('daily-spot');
    var body = $('daily-spot-body') || el('div');
    body.id = 'daily-spot-body';
    body.replaceChildren();
    sec.append(body);
    sec.hidden = false;
    var s = todaySpot;
    if (!s) { body.append(el('p', 'note', '今日の聖地を準備中です。')); return; }

    body.append(el('p', 'daily-label', '日替わりおすすめ'));
    var card = ui.baseCard(s);
    card.classList.add('card-daily');
    card.append(ui.actions(s, 'transit', null));
    body.append(card);
    body.append(el('p', 'note', '日付で選んだ日替わりのおすすめです。あなたの生年月日や出発地から見た吉方位とは関係ありません。参拝時間や立ち入りは、公式情報でご確認ください。'));
    if (root.SpotPhotos) SpotPhotos.attach([{ el: card, spot: s }]);

    if (root.Share) {
      body.append(Share.box({ heading: '今日の聖地を紹介する', text: '今日の運命の聖地は「' + s.name + '」（' + s.prefecture + '）。毎日ちがう聖地に出会える『日本全国パワースポット巡り』' }));
    }
    var w = nextWeekend();
    var box = el('div', 'weekend');
    box.append(el('h3', null, '週末のお出かけ提案'));
    var dl = dateLabel(w.sat) + '・' + dateLabel(w.sun).replace(/^\d+月/, '');
    var lead = w.sunday ? '今日' + dateLabel(w.sun) + 'のお出かけに。' : (w.isNow ? 'この週末（' + dl + '）のお出かけに。' : '次のお休み（' + dl + '）に、聖地へ出かけてみませんか。');
    box.append(el('p', null, lead + '出かける日を入れて診断すると、その日の方位の吉凶も合わせて、あなたに合う聖地を選びます。'));
    var row = el('div', 'weekend-btns');
    [[w.sunday ? null : w.sat], [w.sun]].forEach(function (x) {
      if (!x[0]) return;
      var b = el('button', 'btn-sub', dateLabel(x[0]) + 'で診断する');
      b.type = 'button';
      b.addEventListener('click', function () {
        $('trip-date').value = x[0];
        $('trip-date').dispatchEvent(new Event('change', { bubbles: true }));
        $('weekend-msg').textContent = '出かける日に' + dateLabel(x[0]) + 'を入れました。生年月日と出発地を確かめて、診断してください。';
        $('h-diagnose').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      });
      row.append(b);
    });
    var msg = el('p', 'weekend-msg'); msg.id = 'weekend-msg'; msg.setAttribute('role', 'status');
    box.append(row, msg);
    body.append(box);
  }

  /* ---------- 開運スタンプ帳・聖地コレクション ---------- */
  var tab = 'want', clearArmed = null;
  function findSpot(it) {
    var all = root.ALL_SPOTS || [];
    for (var i = 0; i < all.length; i++) if (all[i].id === it.id) return all[i];
    return { id: it.id, name: it.name, prefecture: it.prefecture, category: it.category, lat: it.lat, lon: it.lon, description: '', wishes: [] };
  }

  function renderCollection() {
    var sec = $('collection');
    sec.hidden = false;
    var body = $('collection-body') || el('div');
    body.id = 'collection-body';
    body.replaceChildren();
    sec.append(body);

    body.append(el('p', 'lead-small', '気になる聖地の「☆ 行きたい」「○ 行った」「♡ お気に入り」を押すと、ここに集まります。'));

    // 都道府県のスタンプ
    var visited = Collection.list('visited');
    var prefs = {};
    visited.forEach(function (it) { prefs[it.prefecture] = (prefs[it.prefecture] || 0) + 1; });
    var nPref = Object.keys(prefs).length;
    var stamp = el('div', 'stamp-book');
    var head = el('div', 'stamp-head');
    head.append(el('h3', null, '都道府県のスタンプ'), el('p', 'stamp-count', nPref + ' / 47'));
    stamp.append(head);
    var grid = el('ul', 'stamp-grid');
    (root.PREFECTURES || []).forEach(function (p) {
      var on = !!prefs[p[1]];
      var li = el('li', 'stamp' + (on ? ' on' : ''));
      li.append(el('span', 'stamp-name', p[1].replace(/(都|府|県)$/, '').replace(/^北海道$/, '北海道')));
      if (on) li.setAttribute('aria-label', p[1] + '：行った聖地 ' + prefs[p[1]] + '件');
      else li.setAttribute('aria-label', p[1] + '：まだ');
      grid.append(li);
    });
    stamp.append(grid);
    // 種類別
    if (visited.length) {
      var cats = {};
      visited.forEach(function (it) { cats[it.category] = (cats[it.category] || 0) + 1; });
      stamp.append(el('p', 'stamp-cats', '行った聖地の種類：' + Object.keys(cats).map(function (k) { return k + ' ' + cats[k]; }).join('・')));
    }
    body.append(stamp);

    // 一覧のタブ
    var tabs = el('div', 'col-tabs');
    tabs.setAttribute('role', 'tablist');
    Collection.KINDS.forEach(function (k) {
      var b = el('button', 'col-tab', k.label + '（' + Collection.list(k.key).length + '）');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(tab === k.key));
      b.dataset.kind = k.key;
      b.addEventListener('click', function () { tab = k.key; renderCollection(); var t = sec.querySelector('.col-tab[data-kind="' + k.key + '"]'); if (t) t.focus(); });
      tabs.append(b);
    });
    body.append(tabs);

    var items = Collection.list(tab);
    var ul = el('ul', 'col-list');
    ul.setAttribute('role', 'tabpanel');
    if (!items.length) ul.append(el('li', 'col-empty', 'まだありません。'));
    items.forEach(function (it) {
      var li = el('li', 'col-item');
      var info = el('div', 'col-info');
      info.append(el('span', 'col-name', it.name), el('span', 'col-sub', it.prefecture + '・' + it.category));
      var acts = el('div', 'col-acts');
      var mapB = el('button', 'btn-text', '地図で見る');
      mapB.type = 'button';
      mapB.addEventListener('click', function () { ui.goMap(findSpot(it)); });
      var del = el('button', 'btn-text', 'ここから外す');
      del.type = 'button';
      del.addEventListener('click', function () { Collection.set(findSpot(it), tab, false); });
      acts.append(mapB, del);
      li.append(info, acts);
      ul.append(li);
    });
    body.append(ul);

    var foot = el('div', 'col-foot');
    foot.append(el('p', 'note', '保存は、この端末のブラウザの中だけです（サーバーへは送りません）。「行った」は自己申告で、位置情報は使いません。一つずつ外すときは「ここから外す」、まとめて消すときは下のボタンを使ってください。'));
    var all = el('button', 'btn-text', 'コレクションをすべて消す');
    all.type = 'button';
    all.id = 'collection-clear';
    all.disabled = !Collection.list().length;
    all.addEventListener('click', function () {
      if (clearArmed) { clearTimeout(clearArmed); clearArmed = null; Collection.clear(); return; }
      all.textContent = '本当に消す場合は、もう一度押してください';
      clearArmed = setTimeout(function () { clearArmed = null; all.textContent = 'コレクションをすべて消す'; }, 5000);
    });
    foot.append(all);
    body.append(foot);
  }

  function init(opts) {
    ui = opts;
    if (!root.JSTDate || !root.DAILY_MESSAGES) return;
    pool = buildPool(opts.spots || []);
    todaySpot = pickSpot(JSTDate.today());
    try { renderDoor(); } catch (e) { $('daily-door').hidden = true; }
    try { renderDailySpot(); } catch (e) { $('daily-spot').hidden = true; }
    if (root.Collection) {
      try { renderCollection(); Collection.onChange(renderCollection); } catch (e) { $('collection').hidden = true; }
    }
  }

  root.Daily = { init: init, hash: hash, buildPool: buildPool, pickSpotFrom: function (spots, d) { pool = buildPool(spots); return pickSpot(d); } };
})(typeof window !== 'undefined' ? window : globalThis);
