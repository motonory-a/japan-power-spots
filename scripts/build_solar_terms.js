/*
 * 二十四節気（節入り）の日本時間の表を作る開発用スクリプト
 *   必要：npm i astronomy-engine@2
 *   実行：node scripts/build_solar_terms.js > data/solar-terms.js
 * サイト本体はこの出力ファイルだけを読み込むので、公開時に astronomy-engine は不要。
 *
 * 出力形式：SOLAR_TERMS[年] = 24個の「MMDDhhmm」（日本時間、分は四捨五入）
 *   並びは 小寒(285°) 大寒 立春(315°) 雨水 啓蟄 春分 清明 穀雨 立夏 小満 芒種 夏至(90°)
 *         小暑 大暑 立秋 処暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至(270°)
 */
'use strict';
const A = require('astronomy-engine');
const FROM = 1899, TO = 2101;
const pad = (n) => String(n).padStart(2, '0');

const out = {};
for (let y = FROM; y <= TO; y++) {
  const list = [];
  for (let i = 0; i < 24; i++) {
    const lon = (285 + i * 15) % 360;
    // 各節気のおおよその日付（1月5日ごろから約15.2日おき）の10日前から探す
    const approx = Date.UTC(y, 0, 5) + i * 15.2184 * 864e5;
    const t = A.SearchSunLongitude(lon, new Date(approx - 10 * 864e5), 25);
    if (!t) throw new Error('not found ' + y + ' ' + lon);
    const jst = new Date(t.date.getTime() + 9 * 3600e3 + 30e3); // 分は四捨五入（国立天文台の表記に合わせる）
    if (jst.getUTCFullYear() !== y) throw new Error('year mismatch ' + y + ' ' + lon);
    list.push(pad(jst.getUTCMonth() + 1) + pad(jst.getUTCDate()) + pad(jst.getUTCHours()) + pad(jst.getUTCMinutes()));
  }
  out[y] = list.join(' ');
}

const lines = Object.keys(out).map((y) => '  ' + y + ": '" + out[y] + "'");
process.stdout.write(
  '/* 二十四節気の日本時間（自動生成：scripts/build_solar_terms.js、Astronomy Engine で計算） */\n' +
  'var SOLAR_TERMS_RAW = {\n' + lines.join(',\n') + '\n};\n' +
  "if (typeof module !== 'undefined') module.exports = SOLAR_TERMS_RAW;\n");
