/*
 * 日本時間の日付処理のテスト
 * 実行方法： node tests/run-jst-tests.js
 * 端末の時間帯を変えても同じ結果になることを、子プロセスで TZ を変えて確かめる。
 */
'use strict';
const assert = require('assert');
const { execFileSync } = require('child_process');
const path = require('path');
const J = require('../assets/js/jst-date.js');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); pass++; console.log('  OK  ' + name); }
  catch (e) { fail++; console.log('  NG  ' + name + '\n      ' + e.message); }
}
const at = (iso) => new Date(iso);

console.log('日付の境目（日本時間の0時）');
test('UTC 14:59:59 は日本時間 23:59:59 → まだ当日', () => assert.strictEqual(J.today(at('2026-11-03T14:59:59Z')), '2026-11-03'));
test('UTC 15:00:00 は日本時間 0:00 → 翌日', () => assert.strictEqual(J.today(at('2026-11-03T15:00:00Z')), '2026-11-04'));
test('大みそか → 元日', () => assert.strictEqual(J.today(at('2026-12-31T15:00:00Z')), '2027-01-01'));
test('うるう日 2028-02-29', () => assert.strictEqual(J.today(at('2028-02-28T15:30:00Z')), '2028-02-29'));
test('月末 → 月初', () => assert.strictEqual(J.today(at('2026-04-30T15:00:00Z')), '2026-05-01'));

console.log('年月日・曜日');
test('2026-11-04 は水曜（3）', () => { const p = J.parts(at('2026-11-04T03:00:00Z')); assert.deepStrictEqual(p, { y: 2026, m: 11, d: 4, wd: 3 }); });
test('時刻の数値でも使える', () => assert.strictEqual(J.today(Date.parse('2026-11-03T15:00:00Z')), '2026-11-04'));
test('todayDate は端末の暦の0時', () => { const d = J.todayDate(at('2026-11-03T15:00:00Z')); assert.deepStrictEqual([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours()], [2026, 11, 4, 0]); });

console.log('通し日数（日替わりの番号）');
test('1970-01-01 は 0', () => assert.strictEqual(J.dayNumber('1970-01-01'), 0));
test('翌日は +1', () => assert.strictEqual(J.dayNumber('2026-11-05') - J.dayNumber('2026-11-04'), 1));
test('年をまたいでも +1', () => assert.strictEqual(J.dayNumber('2027-01-01') - J.dayNumber('2026-12-31'), 1));
test('形式違いは NaN', () => assert.ok(Number.isNaN(J.dayNumber('2026/11/04'))));

console.log('端末の時間帯に左右されない');
const probe = "const J=require(" + JSON.stringify(path.resolve(__dirname, '../assets/js/jst-date.js')) + ");" +
  "process.stdout.write([J.today(new Date('2026-11-03T15:00:00Z')),J.today(new Date('2026-11-03T14:59:00Z'))].join(','))";
['Asia/Tokyo', 'UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Pacific/Pago_Pago'].forEach((tz) => {
  test('TZ=' + tz, () => {
    const out = execFileSync(process.execPath, ['-e', probe], { env: Object.assign({}, process.env, { TZ: tz }) }).toString();
    assert.strictEqual(out, '2026-11-04,2026-11-03');
  });
});

console.log('\n結果：' + pass + '件成功 / ' + fail + '件失敗');
process.exit(fail ? 1 : 0);
