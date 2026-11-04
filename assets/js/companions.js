/*
 * 一緒に行く人（パートナー・友だち・家族など）
 *   生年月日を入れると、全員にとっての方位の吉凶と数秘で、デートやお出かけの行き先を選ぶ。
 *   入力した生年月日は、このページの中だけで計算に使う（サーバーへは送らない）。
 *   「入力内容をこの端末に保存する」がオンのときだけ、保存した入力（ニックネームごと）と一緒に端末内に保存する。
 */
(function (root) {
  'use strict';
  var MAX = 3;
  var RELS = ['パートナー', '友だち', '家族', 'その他'];
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var rows = [], seq = 0, eraLabel = function () { return ''; }, profilesFn = function () { return []; };

  function daysIn(y, m) { return new Date(y || 2000, m, 0).getDate(); }
  function thisYear() { return root.JSTDate ? JSTDate.parts().y : new Date().getFullYear(); }

  function addRow(data) {
    if (rows.length >= MAX) return null;
    var id = 'cp' + (++seq);
    var row = el('div', 'companion');
    row.dataset.id = id;
    var head = el('div', 'companion-head');
    var relSel = el('select', 'companion-rel');
    relSel.setAttribute('aria-label', '一緒に行く人との関係');
    RELS.forEach(function (r) { var o = el('option', null, r); o.value = r; relSel.append(o); });
    var del = el('button', 'btn-text companion-del', 'この人を外す');
    del.type = 'button';
    head.append(relSel, del);

    var saved = profilesFn();
    var pick = null;
    if (saved.length) {
      pick = el('select', 'companion-pick');
      pick.setAttribute('aria-label', '保存した人から選ぶ');
      var o0 = el('option', null, '保存した人から選ぶ'); o0.value = ''; pick.append(o0);
      saved.forEach(function (p) { var o = el('option', null, p.nickname + '（' + p.birthday.replace(/-/g, '/') + '）'); o.value = p.birthday; o.dataset.nick = p.nickname; pick.append(o); });
    }

    var bd = el('div', 'bd-row');
    bd.setAttribute('role', 'group');
    bd.setAttribute('aria-label', '一緒に行く人の生年月日');
    var ys = el('select'), ms = el('select'), ds = el('select');
    ys.setAttribute('aria-label', '生まれた年'); ms.setAttribute('aria-label', '生まれた月'); ds.setAttribute('aria-label', '生まれた日');
    var y0 = el('option', null, '年'); y0.value = ''; ys.append(y0);
    for (var y = thisYear(); y >= 1920; y--) { var oy = el('option', null, y + '年（' + eraLabel(y) + '）'); oy.value = String(y); ys.append(oy); }
    var m0 = el('option', null, '月'); m0.value = ''; ms.append(m0);
    for (var m = 1; m <= 12; m++) { var om = el('option', null, m + '月'); om.value = String(m); ms.append(om); }
    function fillDays() {
      var cur = ds.value, n = ms.value ? daysIn(Number(ys.value), Number(ms.value)) : 31;
      ds.replaceChildren(); var d0 = el('option', null, '日'); d0.value = ''; ds.append(d0);
      for (var d = 1; d <= n; d++) { var od = el('option', null, d + '日'); od.value = String(d); ds.append(od); }
      if (cur && Number(cur) <= n) ds.value = cur;
    }
    fillDays();
    ys.addEventListener('change', fillDays); ms.addEventListener('change', fillDays);
    bd.append(ys, ms, ds);

    var r = { id: id, el: row, rel: relSel, y: ys, m: ms, d: ds, nick: '' };
    function setBirthday(v) {
      var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
      ys.value = p ? String(Number(p[1])) : ''; ms.value = p ? String(Number(p[2])) : ''; fillDays(); ds.value = p ? String(Number(p[3])) : '';
    }
    r.setBirthday = setBirthday;
    if (pick) {
      pick.addEventListener('change', function () {
        if (!pick.value) return;
        setBirthday(pick.value);
        r.nick = pick.options[pick.selectedIndex].dataset.nick || '';
        pick.value = '';
      });
    }
    // 自分で生年月日を変えたら、保存した人の名前は外す
    [ys, ms, ds].forEach(function (s) { s.addEventListener('change', function () { r.nick = ''; }); });

    row.append(head);
    if (pick) row.append(pick);
    row.append(bd);
    del.addEventListener('click', function () { remove(id); });
    $('companion-list').append(row);
    rows.push(r);
    if (data) { relSel.value = RELS.indexOf(data.rel) !== -1 ? data.rel : 'その他'; setBirthday(data.birthday); r.nick = data.nick || ''; }
    update();
    return r;
  }

  function remove(id) {
    rows = rows.filter(function (r) { if (r.id === id) { r.el.remove(); return false; } return true; });
    update();
  }

  function update() {
    $('companion-add').hidden = rows.length >= MAX;
    $('companion-add').textContent = rows.length ? '＋ もう一人追加' : '＋ 一緒に行く人を追加';
    $('companion-box').classList.toggle('has-companions', rows.length > 0);
  }

  function birthdayOf(r) {
    var y = r.y.value, m = r.m.value, d = r.d.value;
    return (y && m && d) ? y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0') : '';
  }

  // 入力されている人の一覧（生年月日が未入力の行は含めない）
  function get() {
    return rows.map(function (r) { return { rel: r.rel.value, nick: r.nick || '', birthday: birthdayOf(r), row: r }; })
      .filter(function (c) { return c.birthday; })
      .map(function (c) { return { rel: c.rel, nick: c.nick, birthday: c.birthday }; });
  }
  // 入力の途中（年だけ選んだなど）の行
  function incomplete() {
    return rows.filter(function (r) { var any = r.y.value || r.m.value || r.d.value; return any && !birthdayOf(r); }).length;
  }
  function label(c, i, list) {
    var same = list.filter(function (x) { return x.rel === c.rel; }).length > 1;
    if (c.nick) return c.nick + 'さん';
    return c.rel + (same ? (list.filter(function (x, j) { return x.rel === c.rel && j <= i; }).length) : '');
  }
  function set(list) {
    rows.slice().forEach(function (r) { remove(r.id); });
    (list || []).slice(0, MAX).forEach(function (c) { addRow(c); });
  }
  function setInvalid(bad) {
    rows.forEach(function (r) { var b = bad && !birthdayOf(r) && (r.y.value || r.m.value || r.d.value); [r.y, r.m, r.d].forEach(function (s) { s.setAttribute('aria-invalid', b ? 'true' : 'false'); }); });
  }

  function init(opts) {
    if (opts && opts.eraLabel) eraLabel = opts.eraLabel;
    if (opts && opts.profiles) profilesFn = opts.profiles;
    $('companion-add').addEventListener('click', function () {
      var r = addRow();
      if (r) r.rel.focus();
    });
    update();
  }

  root.Companions = { init: init, get: get, set: set, incomplete: incomplete, label: label, setInvalid: setInvalid, MAX: MAX };
})(typeof window !== 'undefined' ? window : globalThis);
