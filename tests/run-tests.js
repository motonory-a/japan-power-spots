/*
 * 診断ロジックの自動テスト
 * 実行方法： node tests/run-tests.js   （Node.js 16以上）
 */
'use strict';
const assert = require('assert');
const D = require('../assets/js/diagnosis.js');
const cfg = require('../assets/js/config.js');
const { SPOTS, PREFECTURES } = require('../data/spots-demo.js');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); pass++; console.log('  OK  ' + name); }
  catch (e) { fail++; console.log('  NG  ' + name + '\n      ' + e.message); }
}
const pref = (n) => { const p = PREFECTURES.find((x) => x[1] === n); return { name: p[1], lat: p[2], lon: p[3] }; };

console.log('数秘ナンバー');
test('1974-04-15 → 31 → 4', () => assert.strictEqual(D.lifePath('1974-04-15'), 4));
test('2000-01-01 → 4', () => assert.strictEqual(D.lifePath('2000-01-01'), 4));
test('1999-12-31 → 44 → 8', () => assert.strictEqual(D.lifePath('1999-12-31'), 8));
test('1989-09-29 → 47 → 11 → 2（マスターナンバーは還元）', () => assert.strictEqual(D.lifePath('1989-09-29'), 2));
test('1900-01-01 → 12 → 3', () => assert.strictEqual(D.lifePath('1900-01-01'), 3));
test('結果は必ず1〜9', () => {
  const start = new Date(1900, 0, 1);
  for (let i = 0; i < 46000; i += 7) {
    const d = new Date(start.getTime() + i * 864e5);
    const s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const n = D.lifePath(s);
    assert.ok(n >= 1 && n <= 9, s + ' → ' + n);
  }
});
test('形式違いは例外', () => assert.throws(() => D.lifePath('1974/04/15')));

console.log('生年月日チェック');
const today = new Date(2026, 10, 3);
test('正常な日付は null', () => assert.strictEqual(D.validateBirthday('1974-04-15', today), null));
test('空欄', () => assert.ok(D.validateBirthday('', today)));
test('存在しない日付 2023-02-29', () => assert.strictEqual(D.validateBirthday('2023-02-29', today), '存在しない日付です。'));
test('うるう日 2024-02-29 は有効', () => assert.strictEqual(D.validateBirthday('2024-02-29', today), null));
test('当日は有効', () => assert.strictEqual(D.validateBirthday('2026-11-03', today), null));
test('翌日は未来でエラー', () => assert.strictEqual(D.validateBirthday('2026-11-04', today), '未来の日付は入力できません。'));
test('1899年はエラー', () => assert.ok(D.validateBirthday('1899-12-31', today)));

console.log('距離・方角');
test('東京都庁→大阪府庁 約400km（±10km）', () => {
  const km = D.distanceKm(35.690, 139.692, 34.686, 135.520);
  assert.ok(Math.abs(km - 397) < 10, String(km));
});
test('真北は0°・北', () => { assert.ok(Math.abs(D.bearingDeg(35, 139, 36, 139)) < 1e-9); assert.strictEqual(D.direction8(0), '北'); });
test('真東は約90°・東', () => assert.strictEqual(D.direction8(D.bearingDeg(35, 139, 35, 140)), '東'));
test('真南は180°・南', () => assert.strictEqual(D.direction8(D.bearingDeg(36, 139, 35, 139)), '南'));
test('境界 22.5°は北東、22.4°は北、337.5°は北', () => {
  assert.strictEqual(D.direction8(22.5), '北東'); assert.strictEqual(D.direction8(22.4), '北'); assert.strictEqual(D.direction8(337.5), '北');
});
test('東京都→出雲大社は西', () => {
  const t = pref('東京都');
  assert.strictEqual(D.direction8(D.bearingDeg(t.lat, t.lon, 35.4020, 132.6855)), '西');
});

console.log('推薦スコア');
test('スコアは0〜100、内訳の合計と一致', () => {
  const r = D.rankSpots(SPOTS, { number: 4, origin: pref('東京都'), wishes: ['滝', '神社'], mode: 'car' }, cfg);
  r.forEach((s) => {
    const p = s.scoreParts;
    assert.strictEqual(s.score, p.numerology + p.wish + p.distance + p.reliability);
    assert.ok(s.score >= 0 && s.score <= 100);
  });
});
test('スコア順に並ぶ', () => {
  const r = D.rankSpots(SPOTS, { number: 7, origin: pref('北海道'), wishes: [], mode: 'transit' }, cfg);
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].score >= r[i].score);
});
test('東京・数秘4・願いなし → 1位は明治神宮', () => {
  const r = D.rankSpots(SPOTS, { number: 4, origin: pref('東京都'), wishes: [], mode: 'transit' }, cfg);
  assert.strictEqual(r[0].name, '明治神宮');
});
test('願い「滝」を選ぶと那智の滝が上位3件に入る（東京・数秘4）', () => {
  const r = D.rankSpots(SPOTS, { number: 4, origin: pref('東京都'), wishes: ['滝'], mode: 'transit' }, cfg);
  assert.ok(r.slice(0, 3).some((s) => s.name === '那智の滝'), r.map((s) => s.name).join(','));
});
test('願いを選ぶと一致スポットが先に並ぶ（東京・数秘4・滝+浄化）', () => {
  const r = D.rankSpots(SPOTS, { number: 4, origin: pref('東京都'), wishes: ['滝', '浄化'], mode: 'car' }, cfg);
  const firstMiss = r.findIndex((s) => s.hitWishes.length === 0);
  assert.ok(r.slice(firstMiss).every((s) => s.hitWishes.length === 0), r.map((s) => s.name).join(','));
  assert.notStrictEqual(r[0].name, '明治神宮');
});
test('願い「恋愛」で出雲大社が願い点満点', () => {
  const r = D.rankSpots(SPOTS, { number: 1, origin: pref('島根県'), wishes: ['恋愛'], mode: 'car' }, cfg);
  assert.strictEqual(r.find((s) => s.name === '出雲大社').scoreParts.wish, cfg.weights.wish);
});
test('デモデータは信頼性0点・低信頼扱い', () => {
  const r = D.rankSpots(SPOTS, { number: 1, origin: pref('東京都'), wishes: [], mode: 'car' }, cfg);
  r.forEach((s) => { assert.strictEqual(s.scoreParts.reliability, 0); assert.strictEqual(s.lowConfidence, true); });
});
test('非公開・立入禁止のスポットは除外', () => {
  const extra = [
    Object.assign({}, SPOTS[0], { id: 'x1', publication_status: 'hidden' }),
    Object.assign({}, SPOTS[0], { id: 'x2', access_status: 'closed' })
  ];
  const r = D.rankSpots(SPOTS.concat(extra), { number: 1, origin: pref('東京都'), wishes: [], mode: 'car' }, cfg);
  assert.ok(!r.some((s) => s.id === 'x1' || s.id === 'x2'));
  assert.strictEqual(r.length, SPOTS.length);
});
test('47都道府県すべてで計算できる', () => {
  PREFECTURES.forEach((p) => {
    const r = D.rankSpots(SPOTS, { number: 5, origin: { lat: p[2], lon: p[3] }, wishes: ['自然'], mode: 'walk' }, cfg);
    assert.strictEqual(r.length, 8);
  });
});

console.log('データ');
test('必須項目がそろっている', () => {
  const req = ['id', 'source_ids', 'name', 'aliases', 'category', 'prefecture_code', 'prefecture', 'municipality', 'lat', 'lon',
    'geometry_type', 'parent_id', 'themes', 'wishes', 'description', 'source_urls', 'license', 'verification_status',
    'access_status', 'publication_status', 'updated_at'];
  SPOTS.forEach((s) => req.forEach((k) => assert.ok(k in s, s.name + ' に ' + k + ' がない')));
});
test('idが重複していない', () => assert.strictEqual(new Set(SPOTS.map((s) => s.id)).size, SPOTS.length));
test('座標が日本の範囲内', () => SPOTS.forEach((s) => assert.ok(s.lat > 20 && s.lat < 46 && s.lon > 122 && s.lon < 154, s.name)));
test('都道府県コードと名称が一致', () => SPOTS.forEach((s) => {
  const p = PREFECTURES.find((x) => x[0] === s.prefecture_code); assert.strictEqual(p[1], s.prefecture);
}));

console.log('\n結果：' + pass + '件成功 / ' + fail + '件失敗');
process.exit(fail ? 1 : 0);
