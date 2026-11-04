/*
 * Phase 4（診断の磨き込み）と「一緒に行く人」の画面テスト
 * 実行方法： cd tests/e2e && node run-phase4.js [index.htmlのパス]
 */
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const target = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
const LDIR = path.join(__dirname, 'node_modules/leaflet/dist');
const results = [];
const check = (name, ok, info = '') => { results.push(ok); console.log((ok ? '  OK  ' : '  NG  ') + name + (info ? '  ' + info : '')); };
async function route(page) {
  await page.route('**/*', (r) => {
    const u = r.request().url();
    if (u.includes('unpkg.com/leaflet')) {
      const f = path.join(LDIR, u.split('/dist/')[1].split('?')[0]);
      return r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(f) });
    }
    if (u.includes('tile.openstreetmap.org')) return r.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(path.join(__dirname, 'fixtures/tile.png')) });
    if (u.includes('wikidata.org') || u.includes('commons.wikimedia')) return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"entities":{}}' });
    if (u.startsWith('file:')) return r.continue();
    return r.abort();
  });
}
async function setBD(page, v) { const [y, m, d] = v.split('-').map(Number); await page.selectOption('#bd-y', String(y)); await page.selectOption('#bd-m', String(m)); await page.selectOption('#bd-d', String(d)); }
async function setRowBD(row, v) { const s = await row.$$('.bd-row select'); const [y, m, d] = v.split('-').map(Number); await s[0].selectOption(String(y)); await s[1].selectOption(String(m)); await s[2].selectOption(String(d)); }

(async () => {
  const browser = await chromium.launch();
  for (const [label, viewport] of [['スマホ 390px', { width: 390, height: 844 }], ['パソコン 1280px', { width: 1280, height: 900 }]]) {
    console.log('[' + label + ']');
    const ctx = await browser.newContext({ viewport, timezoneId: 'Asia/Tokyo' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await route(page);
    await page.clock.setFixedTime(new Date('2026-11-04T01:00:00Z'));
    await page.goto('file://' + target);
    await page.waitForSelector('.chip-cat');

    // 入力の流れ：願いごと → あなた → 出発地 → 出かける日
    const legends = await page.$$eval('#diagnose-form legend', (ls) => ls.map((l) => l.textContent.replace(/\s/g, '')));
    check('入力の順番：一 願いごと → 二 あなたのこと → 三 出発地 → 四 出かける日', /^一願いごと/.test(legends[0]) && /^二あなたのこと/.test(legends[1]) && /^三出発地/.test(legends[2]) && /^四出かける日/.test(legends[3]), legends.join(' / '));
    check('願いごとは8分類', (await page.$$('.chip-cat')).length === 8);
    check('30項目は「くわしく選ぶ」の中（最初は閉じている）', !(await page.$eval('#wish-more', (d) => d.open)) && (await page.$$('#wishes input[name=wish]')).length === 30);
    await page.click('.chip-cat:has-text("癒やし")');
    const sel = await page.$$eval('#wishes input:checked', (cs) => cs.map((c) => c.value).sort());
    check('「癒やし」で浄化・自然・森林', JSON.stringify(sel) === JSON.stringify(['森林', '浄化', '自然'].sort()), sel.join('・'));
    await page.click('.chip-cat:has-text("総合運")');
    await page.click('.chip-cat:has-text("人生の転機")');
    check('同じ項目を使う分類を外しても、もう一方は残る（開運）', await page.isChecked('#wishes input[value="開運"]') === false || await page.isChecked('.chip-cat:has-text("総合運") input'));
    await page.click('#wish-clear');
    check('解除で8分類も外れる', (await page.$$('.chip-cat input:checked')).length === 0);
    await page.click('#wish-more summary');
    await page.click('#wishes label.chip:has(input[value="温泉"])');
    check('くわしい項目だけでも選べる', /温泉/.test(await page.textContent('#wish-selected')));
    await page.click('#wish-clear');
    await page.click('.chip-cat:has-text("金運")');

    // 一緒に行く人
    await setBD(page, '1974-04-15');
    await page.selectOption('#home', '東京都');
    check('最初は一緒に行く人の欄なし', (await page.$$('.companion')).length === 0);
    await page.click('#companion-add');
    check('「＋」で一人追加', (await page.$$('.companion')).length === 1);
    const row = await page.$('.companion');
    await (await row.$$('.bd-row select'))[0].selectOption('1980');
    await page.click('#diagnose');
    check('生年月日が途中ならエラー', /一緒に行く人の生年月日/.test(await page.textContent('#form-error')));
    await setRowBD(row, '1980-08-20');
    await page.fill('#trip-date', '2027-02-20');
    await page.click('#diagnose');
    await page.waitForSelector('#recommended .card', { timeout: 30000 });
    check('見出しが「お二人へのおすすめ」', (await page.textContent('#h-result')).trim() === 'お二人へのおすすめ');
    const sum = await page.textContent('#summary');
    check('一緒に行く人の数秘と九星', /一緒に行く人（パートナー）：数秘ナンバー 1/.test(sum) && /本命星 二黒土星/.test(sum));
    check('お二人ともに吉方位になる方角', /お二人ともに吉方位になる方角/.test(sum));
    const cards = await page.$$('#recommended .card');
    check('おすすめは5件', cards.length === 5);
    const whys = await page.$$eval('#recommended .why-text', (ws) => ws.map((w) => w.textContent));
    check('5件すべてに「選ばれた理由」の文章', whys.length === 5 && whys.every((t) => t.length > 20 && /目安/.test(t)), whys[0]);
    check('理由に願いごと', whys.some((t) => /「[^」]*金運/.test(t)));
    const reasons = await page.$$eval('#recommended .reasons li', (ls) => ls.map((l) => l.textContent).join('\n'));
    check('くわしい根拠に二人それぞれの判定（出発地のすぐ近くは方位なし）', (/【あなた】/.test(reasons) && /【パートナー】/.test(reasons)) || /すぐ近くのため方位なし/.test(reasons));
    const scores = await page.$$eval('#recommended .meta', (ms) => ms.map((m) => Number((/スコア(\d+)/.exec(m.textContent) || [])[1])));
    check('スコアは0〜100', scores.every((x) => x >= 0 && x <= 100), scores.join(','));

    // お出かけの提案（STEP5）
    check('お出かけの提案が出る', await page.isVisible('#outing') && /2月20日（土）、ここへ行ってみない？/.test(await page.textContent('#outing h3')));
    const inv = await page.getAttribute('#outing .btn-invite', 'href');
    check('LINEで誘う：日付とスポット名だけ（生年月日は入れない）', inv.startsWith('https://line.me/R/share?text=') && decodeURIComponent(inv).includes('2月20日（土）') && !/1974|1980/.test(decodeURIComponent(inv)));
    check('お出かけの提案に保存ボタン', (await page.$$('#outing .keep-btn')).length === 3);

    // 専門的な表は開いたときだけ
    check('6か月の表は最初は閉じている', !(await page.$eval('#kigaku-panel .pro-details', (d) => d.open)));
    check('この日の早見表も最初は閉じている', !(await page.$eval('#fortune-table .pro-details', (d) => d.open)));
    await page.click('#fortune-table .pro-details summary');
    check('開くと表が見える', await page.isVisible('#fortune-table table'));

    // 保存と読み込み（一緒に行く人も）
    await page.reload();
    await page.waitForSelector('.companion');
    const back = await page.$$eval('.companion .bd-row select', (s) => s.map((x) => x.value));
    check('一緒に行く人も保存され、次回入る', back.join('-') === '1980-8-20', back.join('-'));
    await page.click('.companion-del');
    check('「この人を外す」で外せる', (await page.$$('.companion')).length === 0);
    await page.click('#diagnose');
    await page.waitForSelector('#recommended .card');
    check('一人なら「あなたへのおすすめ」', (await page.textContent('#h-result')).trim() === 'あなたへのおすすめ');

    // 出かける日なし：今月の盤で判定
    await page.fill('#trip-date', '');
    await page.click('#diagnose');
    await page.waitForSelector('#recommended .card');
    check('日付なしでも方位を今月の盤で判定', /今月/.test(await page.textContent('#recommended')) && /今月の年盤・月盤/.test(await page.textContent('#summary')));
    check('日付なしの提案は「次のお休み」', /次のお休み（11月7日（土））/.test(await page.textContent('#outing h3')));

    // 保存した人から選ぶ
    await page.click('#companion-add');
    const pick = await page.$('.companion .companion-pick');
    check('保存した人から選べる', !!pick);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check('横にはみ出さない', overflow <= 0, 'overflow=' + overflow);
    check('エラーなし', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
  await browser.close();
  const ng = results.filter((r) => !r).length;
  console.log('\n結果：' + (results.length - ng) + '件成功 / ' + ng + '件失敗');
  process.exit(ng ? 1 : 0);
})();
