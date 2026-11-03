/*
 * 入力内容の保存（ニックネームごと）
 *  ・保存先はこの端末のブラウザの中（localStorage）だけ。サーバーへは送らない。
 *  ・保存する項目：ニックネーム・生年月日・都道府県・住所の文字・くわしい出発地（緯度経度）・願い・交通手段・所要時間
 *  ・ブラウザの設定で保存できない場合は、何もしない（画面の機能はそのまま使える）。
 */
(function (root) {
  'use strict';

  var KEY = 'jps.profiles.v1';
  var $ = function (id) { return document.getElementById(id); };
  var store = null;

  function load() {
    try {
      var raw = root.localStorage.getItem(KEY);
      var d = raw ? JSON.parse(raw) : null;
      return d && Array.isArray(d.list) ? d : { list: [], lastId: null };
    } catch (e) { return null; }
  }
  function save(d) {
    try { root.localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch (e) { return false; }
  }
  function available() {
    try { var k = KEY + '.test'; root.localStorage.setItem(k, '1'); root.localStorage.removeItem(k); return true; } catch (e) { return false; }
  }
  function newId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function el(tag, text) { var e = document.createElement(tag); if (text != null) e.textContent = text; return e; }

  function renderSelect(selectedId) {
    var sel = $('profile-select');
    sel.replaceChildren();
    var o0 = el('option', '新しく入力する'); o0.value = ''; sel.append(o0);
    store.list.slice().sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); }).forEach(function (p) {
      var o = el('option', p.nickname + '（' + p.birthday.replace(/-/g, '/') + '）');
      o.value = p.id;
      sel.append(o);
    });
    sel.value = selectedId || '';
    $('profile-delete').hidden = !sel.value;
    $('profile-box').classList.toggle('has-profiles', store.list.length > 0);
    $('profile-clear-all').hidden = store.list.length === 0;
  }

  function setChecked(name, values) {
    document.querySelectorAll('input[name=' + name + ']').forEach(function (c) { c.checked = values.indexOf(c.value) !== -1; });
    var any = document.querySelector('input[name=wish]');
    if (any) any.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // 保存した内容を入力欄に入れる
  function apply(p) {
    $('nickname').value = p.nickname || '';
    $('birthday').value = p.birthday || '';
    $('home').value = p.home || '';
    $('home').dispatchEvent(new Event('change'));
    $('address').value = p.address || '';
    if (p.origin && root.OriginPicker) root.OriginPicker.restore(p.origin); else if (root.OriginPicker) root.OriginPicker.clear();
    if (p.wishes) setChecked('wish', p.wishes);
    if (p.mode) { var r = document.querySelector('input[name=mode][value="' + p.mode + '"]'); if (r) r.checked = true; }
    if (p.limit != null) $('time-limit').value = p.limit;
  }

  function clearForm() {
    $('nickname').value = '';
    $('birthday').value = '';
    $('home').value = '';
    $('home').dispatchEvent(new Event('change'));
    $('address').value = '';
    if (root.OriginPicker) root.OriginPicker.clear();
    setChecked('wish', []);
  }

  function msg(text) {
    var m = $('profile-msg');
    m.textContent = text || '';
    m.hidden = !text;
  }

  // 診断ボタンを押したときに呼ぶ
  function remember() {
    if (!store || !$('save-input').checked) return;
    var origin = root.OriginPicker ? root.OriginPicker.current() : null;
    var nick = $('nickname').value.trim() || 'わたし';
    var p = {
      nickname: nick,
      birthday: $('birthday').value,
      home: $('home').value,
      address: $('address').value.trim(),
      origin: origin && origin.precise ? { lat: origin.lat, lon: origin.lon, label: origin.label, source: origin.source } : null,
      wishes: Array.from(document.querySelectorAll('input[name=wish]:checked')).map(function (c) { return c.value; }),
      mode: (document.querySelector('input[name=mode]:checked') || {}).value || 'transit',
      limit: $('time-limit').value,
      updatedAt: Date.now()
    };
    // 同じニックネームがあれば上書き
    var cur = store.list.find(function (x) { return x.nickname === nick; });
    if (cur) { p.id = cur.id; Object.assign(cur, p); } else { p.id = newId(); store.list.push(p); }
    store.lastId = p.id;
    if (save(store)) {
      $('nickname').value = nick;
      renderSelect(p.id);
      msg('「' + nick + '」として、この端末に保存しました。');
    }
  }

  function init() {
    if (!available()) { $('profile-box').hidden = true; $('save-row').hidden = true; return; }
    store = load() || { list: [], lastId: null };
    var last = store.list.find(function (x) { return x.id === store.lastId; });
    renderSelect(last ? last.id : '');
    if (last) { apply(last); msg('前回の入力（' + last.nickname + '）を読み込みました。'); }

    $('profile-select').addEventListener('change', function () {
      var p = store.list.find(function (x) { return x.id === $('profile-select').value; });
      if (p) { apply(p); store.lastId = p.id; save(store); msg('「' + p.nickname + '」の内容を読み込みました。'); }
      else { clearForm(); msg(''); }
      $('profile-delete').hidden = !p;
    });
    $('profile-delete').addEventListener('click', function () {
      var id = $('profile-select').value;
      var p = store.list.find(function (x) { return x.id === id; });
      if (!p) return;
      store.list = store.list.filter(function (x) { return x.id !== id; });
      if (store.lastId === id) store.lastId = null;
      save(store);
      clearForm();
      renderSelect('');
      msg('「' + p.nickname + '」を削除しました。');
    });
    $('profile-clear-all').addEventListener('click', function () {
      store = { list: [], lastId: null };
      try { root.localStorage.removeItem(KEY); } catch (e) { /* 何もしない */ }
      clearForm();
      renderSelect('');
      msg('この端末に保存した内容をすべて消しました。');
    });
  }

  root.Profiles = { init: init, remember: remember, KEY: KEY };
})(this);
