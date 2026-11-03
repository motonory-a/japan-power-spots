/*
 * 全国スポットデータ（data/spots-osm.js）の検査
 * 実行方法： node tests/run-data-tests.js
 */
'use strict';
const assert = require('assert');
const { SPOTS_OSM, SPOTS_OSM_META } = require('../data/spots-osm.js');
global.PREFECTURES = require('../data/spots-demo.js').PREFECTURES;
global.SPOTS = require('../data/spots-demo.js').SPOTS;
global.SPOTS_OSM = SPOTS_OSM;
global.SPOTS_OSM_META = SPOTS_OSM_META;
const SpotData = require('../assets/js/data.js');
const D = require('../assets/js/diagnosis.js');
const cfg = require('../assets/js/config.js');
const { WISH_OPTIONS } = require('../data/spots-demo.js');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); pass++; console.log('  OK  ' + name); }
  catch (e) { fail++; console.log('  NG  ' + name + '\n      ' + e.message); }
}

const all = SpotData.mergeCurated(SPOTS_OSM.map(SpotData.fromRow), global.SPOTS);

console.log('全国データ');
test('1万件前後（9,900件以上）', () => assert.ok(SPOTS_OSM.length >= 9900, String(SPOTS_OSM.length)));
test('IDの重複なし', () => assert.strictEqual(new Set(all.map((s) => s.id)).size, all.length));
test('名前・座標・都道府県がそろっている', () => all.forEach((s) => {
  assert.ok(s.name && s.prefecture, s.id);
  assert.ok(s.lat > 20 && s.lat < 46 && s.lon > 122 && s.lon < 154, s.id + ' ' + s.lat + ',' + s.lon);
}));
test('47都道府県すべてに30件以上', () => {
  const c = {};
  all.forEach((s) => { c[s.prefecture] = (c[s.prefecture] || 0) + 1; });
  global.PREFECTURES.forEach((p) => assert.ok((c[p[1]] || 0) >= 30, p[1] + ' ' + c[p[1]]));
});
test('都道府県の判定が大きく外れていない（県庁から600km以内、北海道・東京・鹿児島・沖縄は離島があるため除く）', () => {
  const far = all.filter((s) => {
    if (['北海道', '東京都', '鹿児島県', '沖縄県'].indexOf(s.prefecture) !== -1) return false;
    const p = global.PREFECTURES.find((x) => x[1] === s.prefecture);
    return D.distanceKm(p[2], p[3], s.lat, s.lon) > 600;
  });
  assert.deepStrictEqual(far.map((s) => s.name), []);
});
test('タグはすべて選択肢に存在する', () => {
  const keys = new Set(WISH_OPTIONS.map((w) => w.key));
  all.forEach((s) => s.wishes.forEach((w) => assert.ok(keys.has(w), s.name + ' ' + w)));
});
test('数秘ナンバーは1〜9が1〜3個', () => all.forEach((s) => {
  assert.ok(s.numbers.length >= 1 && s.numbers.length <= 3, s.name);
  s.numbers.forEach((n) => assert.ok(n >= 1 && n <= 9));
}));
test('日本語の名前（英字だけの名前なし）', () => all.forEach((s) => assert.ok(/[぀-ヿ㐀-鿿]/.test(s.name), s.name)));
test('親スポットは実在する', () => {
  const ids = new Set(all.map((s) => s.id));
  all.filter((s) => s.parent_id).forEach((s) => assert.ok(ids.has(s.parent_id), s.name));
});
test('出典URL（OpenStreetMap）が付いている', () => all.filter((s) => s.id.indexOf('osm-') === 0).forEach((s) => assert.ok(/^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/.test(s.source_urls[0]), s.id)));
test('同じ名前で1km以内の重複がない', () => {
  const byName = {};
  all.forEach((s) => (byName[s.name] = byName[s.name] || []).push(s));
  const ng = [];
  Object.values(byName).forEach((list) => {
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      if (D.distanceKm(list[i].lat, list[i].lon, list[j].lat, list[j].lon) < 1) ng.push(list[i].name);
    }
  });
  assert.deepStrictEqual(ng, []);
});

console.log('代表的なスポットが入っている');
['伊勢神宮', '出雲大社', '明治神宮', '伏見稲荷大社', '鹿島神宮', '香取神宮', '熊野那智大社', '那智滝', '金剛峯寺', '富士山',
  '厳島神社', '日光東照宮', '太宰府天満宮', '箱根神社', '戸隠神社', '三峯神社', '宗像大社', '浅草寺', '清水寺', '善光寺',
  '春日大社', '熱田神宮', '住吉大社', '鶴岡八幡宮', '石清水八幡宮', '大神神社', '高千穂峰', '霧島神宮', '諏訪大社'].forEach((n) => {
  test(n, () => assert.ok(all.some((s) => s.name.indexOf(n) !== -1), n));
});
test('手入力の説明文が反映されている（明治神宮）', () => {
  const m = all.find((s) => s.name === '明治神宮' && s.prefecture === '東京都');
  assert.ok(m && m.curated && m.description.indexOf('鎮守の森') !== -1);
});

console.log('推薦の計算（1万件）');
test('東京から、出かける日あり・願いありで1秒以内に計算できる', () => {
  const K = require('../assets/js/kyusei.js');
  const t = Date.now();
  const boards = K.boardsFor('2026-11-04', K.birthStars('1974-04-15'));
  const r = D.rankSpots(all, { number: 4, origin: { lat: 35.69, lon: 139.692 }, wishes: ['商売繁盛', '滝'], mode: 'transit', limitMinutes: 180, boards }, cfg);
  const ms = Date.now() - t;
  assert.ok(ms < 1000, ms + 'ms');
  assert.ok(r[0].withinLimit && r[0].hitWishes.length > 0);
});
test('商売繁盛を選ぶと稲荷・恵比寿などが上位に入る', () => {
  const r = D.rankSpots(all, { number: 8, origin: { lat: 34.686, lon: 135.52 }, wishes: ['商売繁盛'], mode: 'transit' }, cfg);
  assert.ok(r.slice(0, 5).every((s) => s.wishes.indexOf('商売繁盛') !== -1), r.slice(0, 5).map((s) => s.name).join(','));
});

console.log('\n結果：' + pass + '件成功 / ' + fail + '件失敗');
process.exit(fail ? 1 : 0);
