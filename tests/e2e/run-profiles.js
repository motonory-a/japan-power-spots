// 入力内容の保存（ニックネーム）のブラウザ検証
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
async function setBD(pg, v) { if (!v) { await pg.fill('#bd-y', ''); await pg.selectOption('#bd-m', ''); await pg.selectOption('#bd-d', ''); return; } const [y, m, d] = v.split('-').map(Number); await pg.fill('#bd-y', String(y)); await pg.selectOption('#bd-m', String(m)); await pg.selectOption('#bd-d', String(d)); }
const target = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
const results = [];
const check = (name, ok, info = '') => { results.push(ok); console.log((ok ? '  OK  ' : '  NG  ') + name + (info ? '  ' + info : '')); };

async function route(page) {
  await page.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.includes('unpkg.com/leaflet')) return r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: u.endsWith('css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(__dirname, 'node_modules/leaflet/dist', u.split('/dist/')[1])) });
    if (u.includes('msearch.gsi.go.jp')) return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify([{ geometry: { coordinates: [139.7034, 35.6938], type: 'Point' }, type: 'Feature', properties: { title: '東京都新宿区新宿三丁目' } }]) });
    if (u.includes('tile.openstreetmap.org')) return r.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(path.join(__dirname, 'fixtures/tile.png')) });
    if (u.startsWith('file://')) return r.continue();
    return r.abort();
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await route(page);
  await page.goto('file://' + target); await page.waitForTimeout(500);

  check('初回は保存欄を表示しない', !(await page.$eval('#profile-box', (e) => getComputedStyle(e).display !== 'none')));
  check('保存のチェックは最初からオン', await page.$eval('#save-input', (e) => e.checked));

  // 1人目
  await page.fill('#nickname', 'わたし');
  await setBD(page, '1974-04-15');
  await page.selectOption('#home', '東京都');
  await page.fill('#address', '新宿三丁目'); await page.click('#address-search'); await page.waitForTimeout(400);
  await page.click('label.chip:has(input[value="金運"])');
  await page.click('label.chip:has(input[value=car])');
  await page.click('#diagnose'); await page.waitForTimeout(500);
  check('保存のお知らせ', (await page.textContent('#profile-msg')).includes('「わたし」として'));

  // 再読み込み
  await page.reload(); await page.waitForTimeout(600);
  check('再読み込みで生年月日が入る', (await page.inputValue('#birthday')) === '1974-04-15');
  check('都道府県が入る', (await page.inputValue('#home')) === '東京都');
  check('住所の文字が入る', (await page.inputValue('#address')) === '新宿三丁目');
  check('くわしい出発地が戻る', (await page.textContent('#origin-status')).includes('東京都新宿区新宿三丁目'));
  check('願いが戻る', await page.$eval('input[name=wish][value="金運"]', (e) => e.checked));
  check('交通手段が戻る', await page.$eval('input[name=mode][value=car]', (e) => e.checked));
  check('前回の入力を読み込んだお知らせ', (await page.textContent('#profile-msg')).includes('わたし'));
  check('保存欄が表示される', await page.$eval('#profile-box', (e) => getComputedStyle(e).display !== 'none'));

  // 2人目
  await page.selectOption('#profile-select', '');
  await page.waitForTimeout(200);
  check('「新しく入力する」で入力欄が空になる', (await page.inputValue('#birthday')) === '' && (await page.inputValue('#nickname')) === '');
  await page.fill('#nickname', '母');
  await setBD(page, '1950-08-20');
  await page.selectOption('#home', '神奈川県');
  await page.click('#diagnose'); await page.waitForTimeout(500);
  const opts = await page.$$eval('#profile-select option', (o) => o.map((x) => x.textContent));
  check('2人分が選べる', opts.length === 3 && opts.some((t) => t.startsWith('母（1950/08/20）')) && opts.some((t) => t.startsWith('わたし')), opts.join(' / '));

  // 切り替え
  const myId = await page.$eval('#profile-select', (s) => Array.from(s.options).find((o) => o.textContent.startsWith('わたし')).value);
  await page.selectOption('#profile-select', myId); await page.waitForTimeout(300);
  check('切り替えで「わたし」の内容になる', (await page.inputValue('#birthday')) === '1974-04-15' && (await page.inputValue('#home')) === '東京都');
  check('切り替えで出発地も戻る', (await page.textContent('#origin-status')).includes('新宿三丁目'));

  // 同じニックネームは上書き
  await setBD(page, '1974-04-16');
  await page.click('#diagnose'); await page.waitForTimeout(400);
  const opts2 = await page.$$eval('#profile-select option', (o) => o.map((x) => x.textContent));
  check('同じニックネームは上書き（件数は変わらない）', opts2.length === 3 && opts2.some((t) => t.includes('1974/04/16')), opts2.join(' / '));

  // 保存しない
  await page.selectOption('#profile-select', ''); await page.waitForTimeout(200);
  await page.uncheck('#save-input');
  await page.fill('#nickname', '友人'); await setBD(page, '1990-01-01'); await page.selectOption('#home', '大阪府');
  await page.click('#diagnose'); await page.waitForTimeout(400);
  check('チェックを外すと保存しない', (await page.$$('#profile-select option')).length === 3);

  // 削除
  const momId = await page.$eval('#profile-select', (s) => Array.from(s.options).find((o) => o.textContent.startsWith('母')).value);
  await page.selectOption('#profile-select', momId); await page.waitForTimeout(200);
  await page.click('#profile-delete'); await page.waitForTimeout(200);
  check('1人分を削除できる', (await page.$$('#profile-select option')).length === 2 && (await page.textContent('#profile-msg')).includes('削除'));

  // すべて消す
  await page.click('#profile-clear-all'); await page.waitForTimeout(200);
  check('すべて消すと保存欄が消える', !(await page.$eval('#profile-box', (e) => getComputedStyle(e).display !== 'none')));
  check('ブラウザの保存領域も空', await page.evaluate(() => localStorage.getItem('jps.profiles.v1') === null));
  await page.reload(); await page.waitForTimeout(500);
  check('再読み込みしても何も入らない', (await page.inputValue('#birthday')) === '');

  check('エラーなし', errs.length === 0, errs.join(' | '));
  await browser.close();
  const ng = results.filter((x) => !x).length;
  console.log(`\n結果：${results.length - ng}件成功 / ${ng}件失敗`);
  process.exit(ng ? 1 : 0);
})();
