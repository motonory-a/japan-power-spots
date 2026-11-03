/*
 * 聖地コレクション（行きたい／行った／お気に入り）
 *   この端末のブラウザの中（localStorage）にだけ保存する。サーバーへは送らない。
 *   「行った」は自己申告。位置情報（GPS）で自動判定はしない。
 *   保存するのはスポットを表示するのに必要な最小限の情報（名前・都道府県・種類・位置）だけ。
 */
(function (root) {
  'use strict';
  var KEY = 'jps.collection.v1';
  var KINDS = [
    { key: 'want', label: '行きたい', on: '行きたい', icon: '☆', iconOn: '★' },
    { key: 'visited', label: '行った', on: '行った', icon: '○', iconOn: '✓' },
    { key: 'fav', label: 'お気に入り', on: 'お気に入り', icon: '♡', iconOn: '♥' }
  ];
  var listeners = [];
  var memory = null; // localStorage が使えないときの代わり（ページを閉じると消える）

  function storage() {
    try { var s = root.localStorage; var t = '__jps'; s.setItem(t, '1'); s.removeItem(t); return s; } catch (e) { return null; }
  }
  function load() {
    var s = storage();
    if (!s) return memory || (memory = { v: 1, items: {} });
    try {
      var d = JSON.parse(s.getItem(KEY) || 'null');
      if (d && d.items && typeof d.items === 'object') return d;
    } catch (e) { /* 壊れていたら空から */ }
    return { v: 1, items: {} };
  }
  function save(d) {
    var s = storage();
    if (!s) { memory = d; return; }
    try { s.setItem(KEY, JSON.stringify(d)); } catch (e) { memory = d; }
  }
  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) { /* 表示の失敗は無視 */ } }); }

  function get(id) {
    var it = load().items[id];
    return it ? { want: !!it.want, visited: !!it.visited, fav: !!it.fav } : { want: false, visited: false, fav: false };
  }

  function set(spot, kind, on) {
    var d = load();
    var it = d.items[spot.id] || {
      id: spot.id, name: spot.name, prefecture: spot.prefecture, category: spot.category,
      lat: Math.round(spot.lat * 1e5) / 1e5, lon: Math.round(spot.lon * 1e5) / 1e5, wikidata: spot.wikidata || ''
    };
    it[kind] = !!on;
    if (on) it[kind + 'At'] = Date.now(); else delete it[kind + 'At'];
    if (!it.want && !it.visited && !it.fav) delete d.items[spot.id];
    else d.items[spot.id] = it;
    save(d);
    emit();
  }
  function toggle(spot, kind) { var on = !get(spot.id)[kind]; set(spot, kind, on); return on; }

  function list(kind) {
    var items = load().items;
    return Object.keys(items).map(function (k) { return items[k]; })
      .filter(function (it) { return !kind || it[kind]; })
      .sort(function (a, b) { return (b[(kind || 'want') + 'At'] || 0) - (a[(kind || 'want') + 'At'] || 0); });
  }
  function remove(id) { var d = load(); delete d.items[id]; save(d); emit(); }
  function clear() {
    var s = storage();
    if (s) { try { s.removeItem(KEY); } catch (e) { /* 無視 */ } }
    memory = null;
    emit();
  }
  function onChange(f) { listeners.push(f); }

  // カードに付ける「行きたい・行った・お気に入り」ボタン
  // 同じスポットのボタンが画面に複数あっても、保存を変えると全部の表示がそろう。
  function paintBox(box) {
    var st = get(box.dataset.spotId);
    box.querySelectorAll('.keep-btn').forEach(function (b) {
      var k = KINDS.filter(function (x) { return x.key === b.dataset.kind; })[0];
      var on = st[k.key];
      b.setAttribute('aria-pressed', String(on));
      b.textContent = (on ? k.iconOn : k.icon) + ' ' + k.label;
    });
  }
  function buttons(spot) {
    var box = document.createElement('div');
    box.className = 'keep-row';
    box.dataset.spotId = spot.id;
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', spot.name + 'を保存');
    KINDS.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'keep-btn keep-' + k.key;
      b.dataset.kind = k.key;
      b.addEventListener('click', function () { toggle(spot, k.key); });
      box.append(b);
    });
    paintBox(box);
    return box;
  }
  if (typeof document !== 'undefined') {
    onChange(function () { document.querySelectorAll('.keep-row').forEach(paintBox); });
  }

  root.Collection = { KEY: KEY, KINDS: KINDS, get: get, set: set, toggle: toggle, list: list, remove: remove, clear: clear, onChange: onChange, buttons: buttons };
  if (typeof module !== 'undefined') module.exports = root.Collection;
})(typeof window !== 'undefined' ? window : globalThis);
