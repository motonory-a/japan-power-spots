/*
 * 毎日の楽しみ（幸せの扉・日替わりの聖地・コレクション）のテスト
 * 実行方法： node tests/run-daily-tests.js
 */
'use strict';
const assert = require('assert');
const path = require('path');

// localStorage の代わり
const mem = {};
global.localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; }
};
global.window = global;
global.JSTDate = require('../assets/js/jst-date.js');
const { DAILY_MESSAGES, DAILY_MISSIONS, OMIKUJI_LEVELS, OMIKUJI_ITEMS, LUCKY_COLORS, LUCKY_ITEMS } = require('../data/daily-content.js');
Object.assign(global, require('../data/daily-content.js'));
const { SPOTS_OSM, SPOTS_OSM_META } = require('../data/spots-osm.js');
global.PREFECTURES = require('../data/spots-demo.js').PREFECTURES;
global.SPOTS_OSM_META = SPOTS_OSM_META;
const SpotData = require('../assets/js/data.js');
require('../assets/js/daily.js');
const Daily = global.Daily;
const Collection = require('../assets/js/collection.js');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); pass++; console.log('  OK  ' + name); }
  catch (e) { fail++; console.log('  NG  ' + name + '\n      ' + e.message); }
}

const spots = SPOTS_OSM.map(SpotData.fromRow);
const pool = Daily.buildPool(spots);

console.log('日替わりの聖地');
test('候補が500件以上', () => assert.ok(pool.length >= 500, pool.length));
test('候補は47都道府県すべてにある', () => assert.strictEqual(new Set(pool.map((s) => s.prefecture)).size, 47));
test('候補には祠を入れない', () => assert.ok(pool.every((s) => s.category !== '祠')));
test('候補はすべてWikidataの登録あり（写真が出やすい）', () => assert.ok(pool.every((s) => s.wikidata)));
test('同じ日なら同じ聖地', () => assert.strictEqual(Daily.pickSpotFrom(spots, '2026-11-04').id, Daily.pickSpotFrom(spots.slice().reverse(), '2026-11-04').id));
test('1年間、2日続けて同じ聖地にならない', () => {
  let prev = null;
  for (let i = 0; i < 366; i++) {
    const d = JSTDate.today(new Date(Date.UTC(2026, 0, 1, 3) + i * 864e5));
    const id = Daily.pickSpotFrom(spots, d).id;
    assert.notStrictEqual(id, prev, d);
    prev = id;
  }
});
test('1年間で300種類以上の聖地が出る', () => {
  const ids = new Set();
  for (let i = 0; i < 366; i++) ids.add(Daily.pickSpotFrom(spots, JSTDate.today(new Date(Date.UTC(2026, 0, 1, 3) + i * 864e5))).id);
  assert.ok(ids.size >= 300, ids.size);
});
test('数の作り方は決まっている（FNV-1a）', () => assert.strictEqual(Daily.hash('a'), 0xe40c292c));

console.log('メッセージとミッション');
test('メッセージは30件以上', () => assert.ok(DAILY_MESSAGES.length >= 30));
test('ミッションは20件以上', () => assert.ok(DAILY_MISSIONS.length >= 20));
const ng = /必ず|絶対|叶う|叶います|金運が上が|運気が上が|治る|効く|お金を|購入|買って|寄付|毎日続け|連続/;
test('効果の約束・支出・継続の強制にあたる言葉がない', () => {
  DAILY_MESSAGES.concat(DAILY_MISSIONS).forEach((t) => assert.ok(!ng.test(t), t));
});
test('どれも短い（60文字以内）', () => DAILY_MESSAGES.concat(DAILY_MISSIONS).forEach((t) => assert.ok(t.length <= 60, t)));
test('重複がない', () => {
  assert.strictEqual(new Set(DAILY_MESSAGES).size, DAILY_MESSAGES.length);
  assert.strictEqual(new Set(DAILY_MISSIONS).size, DAILY_MISSIONS.length);
});

console.log('聖地みくじ・ラッキーカラー・ラッキーアイテム');
const allKuji = OMIKUJI_LEVELS.map((l) => l.word).concat(...OMIKUJI_ITEMS.map((i) => i.high.concat(i.gentle)));
test('運勢は大吉〜凶の6段階', () => assert.deepStrictEqual(OMIKUJI_LEVELS.map((l) => l.name), ['大吉', '中吉', '小吉', '吉', '末吉', '凶']));
test('出やすさの合計は100', () => assert.strictEqual(OMIKUJI_LEVELS.reduce((a, l) => a + l.weight, 0), 100));
test('凶にも前向きなことば', () => assert.ok(/ていねい|やさしく|整える/.test(OMIKUJI_LEVELS[5].word)));
test('みくじのことばに効果の約束・支出の勧めがない', () => allKuji.forEach((t) => assert.ok(!ng.test(t), t)));
test('9つの星すべてに色4つとアイテム4つ', () => { for (let i = 1; i <= 9; i++) { assert.strictEqual(LUCKY_COLORS[i].colors.length, 4); assert.strictEqual(LUCKY_ITEMS[i].length, 4); } });
test('色はすべて正しい色コード', () => { for (let i = 1; i <= 9; i++) LUCKY_COLORS[i].colors.forEach((c) => assert.ok(/^#[0-9A-F]{6}$/i.test(c[1]), c)); });
test('1万回引いた割合が設定どおり（±2%）', () => {
  const total = OMIKUJI_LEVELS.reduce((a, l) => a + l.weight, 0), cnt = {};
  for (let i = 0; i < 10000; i++) {
    let r = Daily.hash('lv|seed' + i) % total;
    for (const l of OMIKUJI_LEVELS) { if (r < l.weight) { cnt[l.name] = (cnt[l.name] || 0) + 1; break; } r -= l.weight; }
  }
  OMIKUJI_LEVELS.forEach((l) => assert.ok(Math.abs(cnt[l.name] / 100 - l.weight) <= 2, l.name + ' ' + cnt[l.name]));
});

console.log('コレクション（行きたい・行った・お気に入り）');
const a = spots[0], b = spots[1];
test('最初は何も保存されていない', () => assert.deepStrictEqual(Collection.get(a.id), { want: false, visited: false, fav: false }));
test('行きたいを押すと保存', () => { Collection.toggle(a, 'want'); assert.strictEqual(Collection.get(a.id).want, true); });
test('もう一度押すと外れる', () => { Collection.toggle(a, 'want'); assert.strictEqual(Collection.get(a.id).want, false); });
test('全部外すと記録自体が消える', () => assert.strictEqual(Collection.list().length, 0));
test('3種類を別々に保存できる', () => {
  Collection.set(a, 'want', true); Collection.set(a, 'fav', true); Collection.set(b, 'visited', true);
  assert.strictEqual(Collection.list('want').length, 1);
  assert.strictEqual(Collection.list('visited').length, 1);
  assert.strictEqual(Collection.list('fav').length, 1);
  assert.strictEqual(Collection.list().length, 2);
});
test('保存するのは表示に必要な最小限の情報だけ', () => {
  const it = JSON.parse(mem[Collection.KEY]).items[a.id];
  const keys = Object.keys(it).filter((k) => !/At$/.test(k)).sort();
  assert.deepStrictEqual(keys, ['category', 'fav', 'id', 'lat', 'lon', 'name', 'prefecture', 'want', 'wikidata'].sort());
});
test('変更を知らせる', () => { let n = 0; Collection.onChange(() => n++); Collection.set(b, 'fav', true); assert.strictEqual(n, 1); });
test('一つだけ外せる', () => { Collection.remove(a.id); assert.strictEqual(Collection.list().length, 1); });
test('すべて消せる', () => { Collection.clear(); assert.strictEqual(Collection.list().length, 0); assert.ok(!(Collection.KEY in mem)); });
test('壊れた保存データでも動く', () => { mem[Collection.KEY] = '{broken'; assert.strictEqual(Collection.list().length, 0); Collection.set(a, 'want', true); assert.strictEqual(Collection.list().length, 1); });

console.log('\n結果：' + pass + '件成功 / ' + fail + '件失敗');
process.exit(fail ? 1 : 0);
