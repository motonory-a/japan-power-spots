/*
 * 日本時間（JST, UTC+9）の日付を扱う小さな道具。
 * 見ている人の端末がどの時間帯に設定されていても、「今日」を日本の日付で決めるために使う。
 * 日本は夏時間がないため、UTCに9時間を足すだけで日本の暦日が求まる。
 */
(function (root) {
  'use strict';
  var OFFSET_MS = 9 * 60 * 60 * 1000;
  var DAY_MS = 24 * 60 * 60 * 1000;

  function pad(n) { return String(n).padStart(2, '0'); }

  // 日本時間での年・月・日・曜日（0=日曜）
  function parts(date) {
    var t = (date instanceof Date ? date.getTime() : (typeof date === 'number' ? date : Date.now())) + OFFSET_MS;
    var d = new Date(t);
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), wd: d.getUTCDay() };
  }

  // 'YYYY-MM-DD'（日本時間の今日、または指定した時刻の日本の日付）
  function today(date) {
    var p = parts(date);
    return p.y + '-' + pad(p.m) + '-' + pad(p.d);
  }

  // 日本の日付を、端末の暦で同じ年月日の0時として返す（日付どうしの比較用）
  function todayDate(date) {
    var p = parts(date);
    return new Date(p.y, p.m - 1, p.d);
  }

  // 'YYYY-MM-DD' を 1970-01-01 からの通し日数にする（日替わりの番号に使う）
  function dayNumber(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || today());
    if (!m) return NaN;
    return Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS);
  }

  var api = { parts: parts, today: today, todayDate: todayDate, dayNumber: dayNumber };
  root.JSTDate = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
