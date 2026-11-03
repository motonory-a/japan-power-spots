/*
 * 九星気学の計算テスト（実在の暦との照合を含む）
 * 実行方法： node tests/run-kyusei-tests.js
 */
'use strict';
const assert = require('assert');
const K = require('../assets/js/kyusei.js');
const YK = require('./fixtures/yakumoin_2026.json');
const NAOJ = require('./fixtures/naoj_terms.json');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); pass++; console.log('  OK  ' + name); }
  catch (e) { fail++; console.log('  NG  ' + name + '\n      ' + e.message); }
}
const ymd = (s) => s.split('-').map(Number);

console.log('二十四節気（国立天文台 暦要項と照合）');
test('2025〜2027年の58件で日付が一致し、時刻の差は1分以内', () => {
  let n = 0;
  for (const y of Object.keys(NAOJ.terms)) {
    const list = K.terms(Number(y));
    for (const [name, ref] of Object.entries(NAOJ.terms[y])) {
      const t = list.find((x) => x.name === name);
      const [md, hm] = ref.split(' ');
      const [rm, rd] = md.split('-').map(Number), [rh, rmin] = hm.split(':').map(Number);
      assert.ok(t.m === rm && t.d === rd, y + name + ' 日付 ' + t.m + '/' + t.d + ' ≠ ' + md);
      assert.ok(Math.abs((t.hh * 60 + t.mm) - (rh * 60 + rmin)) <= 1, y + name + ' 時刻');
      n++;
    }
  }
  assert.strictEqual(n, 58);
});
test('1900〜2100年の各年で節気が24個・日付順に並ぶ', () => {
  for (let y = 1900; y <= 2100; y++) {
    const t = K.terms(y);
    assert.strictEqual(t.length, 24);
    for (let i = 1; i < 24; i++) assert.ok(t[i].dn > t[i - 1].dn, y + ' ' + t[i].name);
  }
});

console.log('日の九星・干支・月の九星（八雲院 九星気学カレンダー 2026年2月4日〜2027年2月3日 365日分と照合）');
test('日の九星 365日すべて一致', () => {
  const ng = YK.rows.filter((r) => K.dayStar(...ymd(r.date)) !== r.day).map((r) => r.date);
  assert.deepStrictEqual(ng, []);
});
test('日の干支 365日すべて一致', () => {
  const ng = YK.rows.filter((r) => { const [y, m, d] = ymd(r.date); return K.ganzhiName(K.dayGanzhiIndex(K.dayNum(y, m, d))) !== r.dayGz; }).map((r) => r.date);
  assert.deepStrictEqual(ng, []);
});
test('月の九星 365日すべて一致', () => {
  const ng = YK.rows.filter((r) => { const ym = K.kigakuYM(...ymd(r.date)); return K.monthStar(ym.kYear, ym.monthIdx) !== r.month; }).map((r) => r.date);
  assert.deepStrictEqual(ng, []);
});
test('年の九星は一白（2026年）', () => YK.rows.forEach((r) => assert.strictEqual(K.yearStar(K.kigakuYM(...ymd(r.date)).kYear), 1)));
test('陰遁始め 2026-06-19（甲子・九紫）、陽遁始め 2026-12-16（甲子・一白）', () => {
  assert.strictEqual(K.dayStarInfo(2026, 6, 19).switchDate, '2026-06-19');
  assert.strictEqual(K.dayStarInfo(2026, 12, 16).switchDate, '2026-12-16');
});

console.log('他の暦の掲載例と照合');
[
  ['2016-12-08', 1, '甲子・陽遁始め（2017年九星カレンダー）'],
  ['2017-01-01', 7, '戊子（同）'],
  ['2017-02-06', 7, '甲子（同）'],
  ['2024-01-01', 1, '甲子・陽遁始め'],
  ['2024-06-29', 9, '甲子・陰遁始め'],
  ['2029-01-01', 1, '辛卯（2029年九星カレンダー）'],
  ['2029-01-04', 4, '甲午（同）'],
  ['2019-11-23', 1, '甲子・陽遁始め（閏の前年）'],
  ['2020-06-20', 3, '甲午・閏で三碧から陰遁'],
  ['2031-12-20', 7, '甲午・閏で七赤から陽遁']
].forEach(([date, star, note]) => {
  test(date + ' は' + K.STAR_SHORT[star] + '（' + note + '）', () => assert.strictEqual(K.dayStar(...ymd(date)), star));
});
test('2020年は陽遁始めがない（閏の年）', () => {
  const list = K.effectiveSwitches(2021).filter((s) => s.dn >= K.dayNum(2020, 1, 1) && s.dn < K.dayNum(2021, 1, 1));
  assert.strictEqual(list.length, 1);
  assert.strictEqual(list[0].dir, -1);
});
test('閏は2008年冬・2020年夏・2031年冬（2000〜2035年）', () => {
  const leaps = new Set();
  for (let y = 2000; y <= 2035; y++) K.effectiveSwitches(y).filter((s) => s.leap).forEach((s) => { const d = new Date(s.dn * 864e5); leaps.add(d.toISOString().slice(0, 10) + (s.dir > 0 ? '冬' : '夏')); });
  assert.deepStrictEqual([...leaps].sort(), ['2008-12-20冬', '2020-06-20夏', '2031-12-20冬']);
});
test('1901〜2099年：日の九星は毎日±1ずつ動く（切替日を除く）', () => {
  let prev = K.dayStar(1901, 1, 1), prevInfo = K.dayStarInfo(1901, 1, 1);
  for (let dn = K.dayNum(1901, 1, 2); dn <= K.dayNum(2099, 12, 31); dn++) {
    const t = new Date(dn * 864e5), y = t.getUTCFullYear(), m = t.getUTCMonth() + 1, d = t.getUTCDate();
    const info = K.dayStarInfo(y, m, d);
    if (info.switchDate !== prevInfo.switchDate) { prevInfo = info; prev = info.star; continue; }
    const step = info.yang ? 1 : -1;
    assert.strictEqual(info.star, ((prev - 1 + step) % 9 + 9) % 9 + 1, y + '-' + m + '-' + d);
    prev = info.star;
  }
});

console.log('年・月の九星、本命星・月命星');
test('年の九星：2017一白・2018九紫・2026一白・2029七赤・1974八白', () => {
  assert.strictEqual(K.yearStar(2017), 1); assert.strictEqual(K.yearStar(2018), 9);
  assert.strictEqual(K.yearStar(2026), 1); assert.strictEqual(K.yearStar(2029), 7); assert.strictEqual(K.yearStar(1974), 8);
});
test('2029年1月5日〜2月2日は九紫（2029年九星カレンダー）', () => {
  const a = K.kigakuYM(2029, 1, 5), b = K.kigakuYM(2029, 2, 2), c = K.kigakuYM(2029, 1, 4);
  assert.strictEqual(K.monthStar(a.kYear, a.monthIdx), 9);
  assert.strictEqual(K.monthStar(b.kYear, b.monthIdx), 9);
  assert.notStrictEqual(K.monthStar(c.kYear, c.monthIdx), 9);
});
test('立春の前日は前の年（2026-02-03は二黒年、02-04は一白年）', () => {
  assert.strictEqual(K.yearStar(K.kigakuYM(2026, 2, 3).kYear), 2);
  assert.strictEqual(K.yearStar(K.kigakuYM(2026, 2, 4).kYear), 1);
});
test('1974-04-15生まれ：本命星 八白・月命星 九紫', () => {
  const b = K.birthStars('1974-04-15');
  assert.strictEqual(b.honmei, 8); assert.strictEqual(b.getsumei, 9); assert.strictEqual(b.notes.length, 0);
});
test('1月生まれは前年の星（2000-01-20 → 本命星 一白〈1999年〉）', () => assert.strictEqual(K.birthStars('2000-01-20').honmei, 1));
test('節入り日に生まれた場合は注意書きが付く（2026-02-04）', () => assert.strictEqual(K.birthStars('2026-02-04').notes.length, 1));

console.log('盤・吉凶・方位');
test('一白中宮の盤：北に六白、南に五黄', () => {
  const b = K.board(1); assert.strictEqual(b['北'], 6); assert.strictEqual(b['南'], 5); assert.strictEqual(b['北東'], 4);
});
test('五黄中宮の盤は後天定位と同じ', () => assert.deepStrictEqual(K.board(5), { '北': 1, '北東': 8, '東': 3, '南東': 4, '南': 9, '南西': 2, '西': 7, '北西': 6 }));
test('吉星の表（相生・比和、五黄と自分の星は除く）', () => {
  const exp = { 1: [3, 4, 6, 7], 2: [6, 7, 8, 9], 3: [1, 4, 9], 4: [1, 3, 9], 5: [2, 6, 7, 8, 9], 6: [1, 2, 7, 8], 7: [1, 2, 6, 8], 8: [2, 6, 7, 9], 9: [2, 3, 4, 8] };
  for (let s = 1; s <= 9; s++) assert.deepStrictEqual(K.goodStars(s), exp[s], String(s));
});
test('2026年（一白中宮・午年）：南は五黄殺、北は暗剣殺と歳破', () => {
  const j = K.judgeBoard(1, K.yearBranch(2026), '歳破', { honmei: 8, getsumei: 9 });
  assert.ok(j.palaces['南'].bad.includes('五黄殺'));
  assert.ok(j.palaces['北'].bad.includes('暗剣殺'));
  assert.ok(j.palaces['北'].bad.includes('歳破'));
});
test('本命殺・本命的殺（八白の人、一白中宮：八白は東 → 東が本命殺・西が本命的殺）', () => {
  const j = K.judgeBoard(1, 0, '歳破', { honmei: 8, getsumei: 9 });
  assert.deepStrictEqual(K.board(1), { '北': 6, '北東': 4, '東': 8, '南東': 9, '南': 5, '南西': 7, '西': 3, '北西': 2 });
  assert.ok(j.palaces['東'].bad.includes('本命殺'));
  assert.ok(j.palaces['西'].bad.includes('本命的殺'));
});
test('定位対冲：九紫が北に入ると凶', () => {
  const j = K.judgeBoard(5, 0, '破', { honmei: 1, getsumei: 1 });
  // 五黄中宮では定位どおりなので対冲なし
  K.PALACES.forEach((p) => assert.ok(!j.palaces[p].bad.includes('定位対冲')));
  const j9 = K.judgeBoard(9, 6, '破', { honmei: 3, getsumei: 3 }); // 九紫中宮→北は五黄
  const b = K.board(9);
  K.PALACES.forEach((p) => { const opp = { '北': 9, '南': 1, '東': 7, '西': 3, '北東': 2, '南西': 8, '南東': 6, '北西': 4 }[p]; if (b[p] === opp) assert.ok(j9.palaces[p].bad.includes('定位対冲'), p); });
});
test('最大吉方：本命星・月命星の両方に吉', () => {
  const j = K.judgeBoard(1, 3, '破', { honmei: 8, getsumei: 9 });
  K.PALACES.forEach((p) => {
    const c = j.palaces[p];
    if (c.level === 'best') assert.ok(K.isGoodStar(8, c.star) && K.isGoodStar(9, c.star));
    if (c.level === 'good') assert.ok(K.isGoodStar(8, c.star) && !K.isGoodStar(9, c.star));
  });
});
test('方位の区切り（30°・60°）', () => {
  const t = [[0, '北'], [14.9, '北'], [15, '北東'], [74.9, '北東'], [75, '東'], [104.9, '東'], [105, '南東'], [165, '南'], [195, '南西'], [255, '西'], [285, '北西'], [344.9, '北西'], [345, '北']];
  t.forEach(([d, p]) => assert.strictEqual(K.palaceFromBearing(d), p, String(d)));
});
test('区切り線までの角度', () => { assert.strictEqual(K.edgeDistance(16), 1); assert.strictEqual(K.edgeDistance(0), 15); });

console.log('今の状態と吉方位');
test('1974-04-15生まれ・2026-11-03：本命星は年盤で東（震宮）、今月は南東', () => {
  const o = K.outlook(K.birthStars('1974-04-15'), '2026-11-03', 6);
  assert.strictEqual(o.yearPlace, '東'); assert.strictEqual(o.yearMeaning.name, '震宮'); assert.strictEqual(o.monthPlace, '南東');
});
test('6か月分、節入り日から始まる（10/8・11/7・12/7・1/5・2/4・3/6）', () => {
  const o = K.outlook(K.birthStars('1974-04-15'), '2026-11-03', 6);
  assert.deepStrictEqual(o.months.map((m) => m.start.m + '/' + m.start.d), ['10/8', '11/7', '12/7', '1/5', '2/4', '3/6']);
});
test('立春後は新しい年の盤（2027年は九紫中宮）', () => {
  const o = K.outlook(K.birthStars('1974-04-15'), '2026-11-03', 6);
  assert.strictEqual(o.months[4].kYear, 2027); assert.strictEqual(o.months[4].yearCenter, 9);
});
test('各月の方位は8つすべてどれかに分類', () => {
  const o = K.outlook(K.birthStars('1974-04-15'), '2026-11-03', 6);
  o.months.forEach((m) => {
    const n = m.dirs.best.length + m.dirs.good2.length + m.dirs.good1.length + m.dirs.kyo.length;
    assert.ok(n <= 8);
  });
});
test('八白中宮の月（2026年11月）は本命星（八白）が中宮', () => {
  const o = K.outlook(K.birthStars('1974-04-15'), '2026-11-03', 6);
  assert.strictEqual(o.months[1].monthCenter, 8); assert.ok(o.months[1].honmeiInCenter);
});
test('今年の吉方位と年盤の判定が一致', () => {
  const p = K.birthStars('1974-04-15'), o = K.outlook(p, '2026-11-03', 1);
  const j = K.judgeBoard(1, K.yearBranch(2026), '歳破', p);
  assert.deepStrictEqual(o.yearGood, K.PALACES.filter((d) => ['best', 'good'].includes(j.palaces[d].level)));
});

console.log('\n結果：' + pass + '件成功 / ' + fail + '件失敗');
process.exit(fail ? 1 : 0);
