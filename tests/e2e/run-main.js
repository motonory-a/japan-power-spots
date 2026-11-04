// v1.1 のブラウザ検証（PC/スマホ）
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
async function setBD(pg, v) { if (!v) { await pg.selectOption('#bd-y', ''); await pg.selectOption('#bd-m', ''); await pg.selectOption('#bd-d', ''); return; } const [y, m, d] = v.split('-').map(Number); await pg.selectOption('#bd-y', String(y)); await pg.selectOption('#bd-m', String(m)); await pg.selectOption('#bd-d', String(d)); }
const target = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
const LDIR = path.join(__dirname, 'node_modules/leaflet/dist');
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok }); console.log((ok ? '  OK  ' : '  NG  ') + name + (info ? '  ' + info : '')); };

async function route(page, { blockCdn = false } = {}) {
  await page.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.includes('unpkg.com/leaflet')) {
      if (blockCdn) return r.abort();
      const f = path.join(LDIR, u.split('/dist/')[1].split('?')[0]);
      const type = f.endsWith('.css') ? 'text/css' : f.endsWith('.png') ? 'image/png' : 'application/javascript';
      return r.fulfill({ status: 200, contentType: type, headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(f) });
    }
    if (u.includes('msearch.gsi.go.jp')) {
      const q = decodeURIComponent(u.split('q=')[1] || '');
      global.lastGsiQuery = q;
      if (global.gsiDown) return r.abort();
      let body = [];
      if (q.includes('西新宿')) body = [{ geometry: { coordinates: [139.6917, 35.6896], type: 'Point' }, type: 'Feature', properties: { addressCode: '', title: '東京都新宿区西新宿二丁目' } }];
      if (q.includes('本町')) body = [
        { geometry: { coordinates: [139.69, 35.69], type: 'Point' }, type: 'Feature', properties: { addressCode: '', title: '東京都渋谷区本町一丁目' } },
        { geometry: { coordinates: [139.48, 35.65], type: 'Point' }, type: 'Feature', properties: { addressCode: '', title: '東京都府中市本町一丁目' } }];
      return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
    }
    if (u.includes('wikidata.org/w/api.php') || u.includes('commons.wikimedia.org/w/api.php')) return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"entities":{}}' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    if (u.includes('tile.openstreetmap.org')) return r.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(path.join(__dirname, 'fixtures/tile.png')) });
    if (u.startsWith('file://')) return r.continue();
    return r.abort();
  });
}

(async () => {
  const browser = await chromium.launch();
  for (const [label, vp] of [['pc', { width: 1280, height: 900 }], ['sp', { width: 390, height: 844 }]]) {
    console.log('[' + label + ']');
    const ctx = await browser.newContext({ viewport: vp, geolocation: { latitude: 35.6664, longitude: 139.3160, accuracy: 20 }, permissions: ['geolocation'] });
    const page = await ctx.newPage();
    const logs = [];
    page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
    page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
    let dialogs = 0; page.on('dialog', async (d) => { dialogs++; await d.dismiss(); });
    await route(page);
    await page.goto('file://' + target);
  await page.evaluate(() => { const d = document.getElementById('wish-more'); if (d) d.open = true; });
    await page.evaluate(() => { const d = document.getElementById('wish-more'); if (d) d.open = true; });
    await page.waitForTimeout(500);

    await page.waitForFunction(() => document.querySelector('#load-status') && document.querySelector('#load-status').textContent === '' && Number(document.querySelector('#spot-total').textContent.replace(/[^0-9]/g, '')) >= 90000, null, { timeout: 20000 }).catch(() => {});
    check('追加データの読み込み完了：全国5万件', Number((await page.textContent('#spot-total')).replace(/[^0-9]/g, '')) >= 49500, await page.textContent('.trial-banner'));
    check('検索の件数も5万件に', Number((await page.textContent('#count')).replace(/[^0-9]/g, '')) >= 49500);
    check('地図は知名度の高い分だけ表示の案内', (await page.textContent('#map-note')).includes('知名度の高い'));
    check('初期表示：検索結果9,900件以上', Number((await page.textContent('#count')).replace(/[^0-9]/g, '')) >= 9900, await page.textContent('#count'));
    check('初期表示：地図はCanvasで描画', (await page.$$('#map canvas')).length >= 1);
    check('検索結果は60件ずつ表示', (await page.$$('#results .card')).length === 60);
    check('さらに表示ボタン', !!(await page.$('#more-results')));
    await page.click('#more-results'); await page.waitForTimeout(200);
    check('さらに表示で120件', (await page.$$('#results .card')).length === 120);
    check('OSM出典表示あり', (await page.textContent('.leaflet-control-attribution')).includes('OpenStreetMap'));
    check('バナーに件数、フッターに出典', /全国[0-9,]+件/.test(await page.textContent('.trial-banner')) && (await page.textContent('footer')).includes('OpenStreetMap'));
    check('フッターにODbL', (await page.textContent('footer')).includes('ODbL'));

    const yopts = await page.$$eval('#bd-y option', (o) => o.map((x) => x.textContent));
    check('生年月日：年に和暦の表示', yopts.includes('1974年（昭和49年）') && yopts.includes('1989年（昭和64・平成元年）') && yopts.includes('2019年（平成31・令和元年）'));
    await page.selectOption('#bd-y', '2023'); await page.selectOption('#bd-m', '2');
    check('生年月日：2023年2月は28日まで', (await page.$$('#bd-d option')).length === 29);
    await page.selectOption('#bd-y', '2024');
    check('生年月日：2024年2月は29日まで（うるう年）', (await page.$$('#bd-d option')).length === 30);
    await page.selectOption('#bd-d', '15');
    check('生年月日：選ぶと内部の値が入る', (await page.inputValue('#birthday')) === '2024-02-15');
    await setBD(page, '');
    check('生年月日：未選択に戻すと値も空', (await page.inputValue('#birthday')) === '');
    await page.click('#diagnose');
    await page.waitForTimeout(200);
    const err1 = await page.textContent('#form-error');
    check('未入力でエラー表示（2件）', err1.includes('生年月日') && err1.includes('都道府県'), JSON.stringify(err1));
    check('結果欄は非表示のまま', await page.$eval('#diagnosis', (e) => e.hidden));

    await setBD(page, '2026-12-31');
    await page.selectOption('#home', '東京都');
    await page.click('#diagnose');
    await page.waitForTimeout(200);
    check('未来日付でエラー', (await page.textContent('#form-error')).includes('未来'));

    await setBD(page, '1974-04-15');
    await page.click('#diagnose');
    await page.waitForTimeout(900);
    check('エラーが消える', await page.$eval('#form-error', (e) => e.hidden));
    const summary = await page.textContent('#summary');
    const kg = await page.textContent('#kigaku-panel');
    check('あなたの気学：本命星・今年の状態・6か月の表', kg.includes('本命星　八白土星') && kg.includes('震宮') && (await page.$$('#kigaku-panel tr')).length === 7);
    check('八角形の方位盤：8つの宮と中宮', (await page.$$('.kg-board .kg-palace')).length === 8 && (await page.textContent('.kg-board')).includes('中宮'));
    check('方位盤：あなたの本命星に金色の枠', (await page.$$('.kg-board .kg-you')).length === 1);
    check('方位盤：今年・今月のタブ', (await page.$$('.kg-tab')).length >= 2);
    await page.click('.kg-tab >> nth=1'); await page.waitForTimeout(100);
    check('方位盤：今月に切り替え', (await page.textContent('.kg-caption')).startsWith('今月の盤'));
    const addHref = await page.getAttribute('#report-add', 'href');
    check('「載っていない場所を教える」のリンク', addHref.includes('/issues/new?template=spot-add.yml'), addHref);
    const fixHref = await page.getAttribute('#recommended .report-link >> nth=0', 'href');
    check('カードの「情報の誤りを報告」に名前とIDが入る', fixHref.includes('template=spot-fix.yml') && fixHref.includes('&name=') && fixHref.includes('&spot_id='), fixHref.slice(0, 120));
    check('数秘ナンバー4を表示', summary.includes('数秘ナンバー：4'), summary.slice(0, 40));
    let names = await page.$$eval('#recommended .card h3', (e) => e.map((x) => x.textContent));
    check('おすすめ5件', names.length === 5, names.join(','));
    check('全カードにデータの状態表示', (await page.$$('#recommended .badge')).length === 5);
    check('カードに情報元リンク', (await page.$$('#recommended .src a')).length >= 5);
    check('方角・距離を表示', (await page.textContent('#recommended .card:nth-child(2) .meta')).includes('km'));
    check('順位マーカー5個＋出発地', (await page.$$eval('#map .pin', (e) => e.filter((x) => /^[1-5]$/.test(x.textContent)).length)) === 5);
    await page.screenshot({ path: path.join(__dirname, `new_${label}_result1.png`), fullPage: true });

    // 願い「滝」「浄化」、車
    await page.click('#wishes label.chip:has(input[value="滝"])');
    await page.click('#wishes label.chip:has(input[value="浄化"])');
    await page.click('label.chip:has(input[value=car])');
    await page.click('#diagnose');
    await page.waitForTimeout(700);
    names = await page.$$eval('#recommended .card h3', (e) => e.map((x) => x.textContent));
    const feat = await page.$$eval('#recommended .card', (cs) => cs.map((c) => c.innerText));
    check('願い「滝・浄化」：上位5件すべてが一致', feat.every((t) => /特徴：.*(滝|浄化)/.test(t)), names.join(','));
    const sm = await page.textContent('#summary');
    check('サマリーに願い・交通手段', sm.includes('浄化') && sm.includes('滝') && sm.includes('車'));

    // 根拠の展開
    await page.click('#recommended .card:first-child details summary');
    check('根拠の内訳を表示', (await page.textContent('#recommended .card:first-child details')).includes('データ信頼性'));

    // 経路リンク
    const href = await page.getAttribute('#recommended .card:first-child .btn-link', 'href');
    check('経路リンクが車モード', href.includes('travelmode=driving'), href);

    // 所要時間の表示と時間指定
    check('カードに所要時間の目安', (await page.textContent('#recommended .card:first-child .meta')).includes('車で約'));
    check('カードに方角の角度', /真北から\d+°/.test(await page.textContent('#recommended .card:first-child .meta')));
    await page.click('label.chip:has(input[value=transit])');
    await page.selectOption('#time-limit', '180');
    await page.click('#diagnose'); await page.waitForTimeout(500);
    let tx = await page.$$eval('#recommended .meta', (e) => e.map((x) => x.innerText));
    check('3時間以内：表示は全件が時間内', tx.length > 0 && tx.every((t) => !t.includes('指定時間を超え')), String(tx.length) + '件');
    check('3時間以内：5件表示', tx.length === 5);
    check('サマリーに時間指定', (await page.textContent('#summary')).includes('3時間以内'));
    // 徒歩・1時間・沖縄
    await page.click('label.chip:has(input[value=walk])');
    await page.selectOption('#time-limit', '60');
    await page.selectOption('#home', '沖縄県');
    await page.click('#diagnose');
    await page.waitForTimeout(500);
    let tw = await page.$$eval('#recommended .meta', (e) => e.map((x) => x.innerText));
    check('徒歩1時間（沖縄）：時間内の候補', tw.length > 0 && tw.every((t) => !t.includes('指定時間を超え')), tw.length + '件');
    await page.selectOption('#time-limit', '');
    await page.click('label.chip:has(input[value=car])');

    // 地図で見る
    await page.click('#recommended .card:nth-of-type(1) .btn-sub');
    await page.waitForTimeout(1200);
    check('「この地図で見る」でポップアップ', (await page.$$('.leaflet-popup')).length === 1);

    // 検索
    await page.fill('#keyword', '那智'); await page.waitForTimeout(500);
    check('キーワード「那智」で那智滝が出る', (await page.textContent('#results')).includes('那智滝'));
    await page.selectOption('#category', '滝');
    await page.waitForTimeout(200);
    check('種類「滝」で絞り込み', (await page.$$eval('#results .tag-cat', (e) => e.every((x) => x.textContent === '滝'))));
    await page.fill('#keyword', 'zzzz');
    await page.waitForTimeout(500);
    check('該当なしメッセージ', (await page.textContent('#results')).includes('該当する'));
    await page.click('#reset-search');
    await page.waitForTimeout(200);
    check('クリアで全件に戻る', Number((await page.textContent('#count')).replace(/[^0-9]/g, '')) >= 9900);
    await page.selectOption('#search-wish', '商売繁盛'); await page.waitForTimeout(300);
    check('願い・体験で検索（商売繁盛）', (await page.$$eval('#results .card', (cs) => cs.slice(0, 20).every((c) => c.innerText.includes('商売繁盛')))));
    await page.selectOption('#search-wish', '');

    // ---- 自転車・カテゴリー ----
    // 複数選択の表示
    await page.click('#wishes label.chip:has(input[value="金運"])'); await page.click('#wishes label.chip:has(input[value="温泉"])'); await page.click('#wishes label.chip:has(input[value="神社"])');
    check('複数選択：選択中の表示', (await page.textContent('#wish-selected')).includes('金運・温泉・神社（3件）') || (await page.textContent('#wish-selected')).includes('（5件）'), await page.textContent('#wish-selected'));
    await page.click('#wishes label.chip:has(input[value="金運"])'); await page.click('#wishes label.chip:has(input[value="温泉"])'); await page.click('#wishes label.chip:has(input[value="神社"])');
    check('複数選択：解除で元に戻る', !(await page.textContent('#wish-selected')).includes('金運'));
    check('願いの選択肢が30個', (await page.$$('input[name=wish]')).length === 30);
    check('商売繁盛の選択肢がある', !!(await page.$('input[name=wish][value="商売繁盛"]')));
    await page.selectOption('#home', '東京都');
    await page.click('label.chip:has(input[value=bike])');
    await page.click('#diagnose'); await page.waitForTimeout(500);
    check('自転車：所要時間の目安を表示', (await page.textContent('#recommended .meta >> nth=0')).includes('自転車で約'));
    check('自転車：経路リンクがbicycling', (await page.getAttribute('#recommended .btn-link >> nth=0', 'href')).includes('travelmode=bicycling'));
    check('自転車：サマリーに表示', (await page.textContent('#summary')).includes('交通手段：自転車'));
    await page.click('#wishes label.chip:has(input[value="滝"])'); await page.click('#wishes label.chip:has(input[value="浄化"])');
    await page.click('#wishes label.chip:has(input[value="商売繁盛"])');
    await page.click('#diagnose'); await page.waitForTimeout(400);
    check('商売繁盛：上位が一致', (await page.$$eval('#recommended .card', (cs) => cs.every((c) => c.innerText.includes('商売繁盛')))));
    await page.click('#wishes label.chip:has(input[value="商売繁盛"])');
    await page.click('#wishes label.chip:has(input[value="滝"])'); await page.click('#wishes label.chip:has(input[value="浄化"])');
    await page.click('#diagnose'); await page.waitForTimeout(400);
    check('一致があればお知らせは出ない（滝・浄化）', !(await page.textContent('#recommended')).includes('いまのデモデータにはまだありません'));
    await page.click('label.chip:has(input[value=car])');

    // ---- 出かける日（九星気学） ----
    await page.selectOption('#home', '東京都');
    await page.fill('#trip-date', '2026-11-21');
    await page.click('#diagnose'); await page.waitForTimeout(600);
    const sumK = await page.textContent('#summary');
    check('本命星・月命星を表示', sumK.includes('本命星 八白土星') && sumK.includes('月命星 九紫火星'), sumK.slice(0, 0));
    check('出かける日の盤を表示（一白・八白・七赤中宮）', sumK.includes('年盤 一白中宮') && sumK.includes('月盤 八白中宮') && sumK.includes('日盤 七赤中宮') && sumK.includes('己亥'));
    check('方位の早見表が8方位', (await page.$$('#fortune-table tr')).length === 9);
    check('早見表：北は年盤で暗剣殺・歳破', (await page.textContent('#fortune-table tr:nth-child(2)')).includes('暗剣殺・歳破'));
    const cardsK = await page.$$eval('#recommended .card', (cs) => cs.map((c) => ({ name: c.querySelector('h3').textContent, meta: c.querySelector('.meta').innerText })));
    check('カードに方位の運気', cardsK.every((c) => c.meta.includes('方位の運気')));
    const firstX = cardsK.findIndex((c) => c.meta.includes('× 避けたい'));
    check('避けたい方位のスポットは後ろ', firstX === -1 || cardsK.slice(firstX).every((c) => c.meta.includes('× 避けたい')), cardsK.map((c) => c.name + (c.meta.match(/方位の運気\s*(\S)/) || [])[1]).join(','));
    check('1万件なら1位は避けたい方位ではない', !cardsK[0].meta.includes('× 避けたい'), cardsK[0].name + ' ' + cardsK[0].meta.replace(/\n/g,' '));
    await page.click('#recommended .card >> nth=0 >> details summary');
    check('根拠に年盤・月盤・日盤の内訳', /年盤：.+月盤：.+日盤：/s.test(await page.textContent('#recommended .card >> nth=0 >> details')));

    await page.screenshot({ path: path.join(__dirname, `new_${label}_kyusei.png`), fullPage: true });
    await page.fill('#trip-date', '1800-01-01');
    await page.click('#diagnose'); await page.waitForTimeout(300);
    check('範囲外の日付はエラー', (await page.textContent('#form-error')).includes('1901年'));
    await page.fill('#trip-date', '');
    await page.click('#diagnose'); await page.waitForTimeout(300);
    check('日付を消すと早見表は非表示', await page.$eval('#fortune-table', (e) => e.hidden));

    // ---- 出発地のくわしい指定 ----
    await page.selectOption('#home', '東京都');
    check('出発地表示：都道府県庁付近', (await page.textContent('#origin-status')).includes('都道府県庁付近'));
    await page.fill('#address', '西新宿二丁目');
    await page.click('#address-search'); await page.waitForTimeout(400);
    check('住所検索：都道府県名を前に付けて検索', global.lastGsiQuery === '東京都西新宿二丁目', global.lastGsiQuery);
    check('住所検索：位置を設定', (await page.textContent('#origin-status')).includes('東京都新宿区西新宿二丁目'));
    await page.click('#diagnose'); await page.waitForTimeout(600);
    check('サマリーに住所検索の出発地', (await page.textContent('#summary')).includes('西新宿二丁目（住所検索）'));
    let href2 = await page.getAttribute('#recommended .card:first-child .btn-link', 'href');
    check('経路リンクに出発地の緯度経度', href2.includes('origin=35.68960,139.69170'), href2);
    // 候補が複数
    await page.fill('#address', '本町一丁目'); await page.press('#address', 'Enter'); await page.waitForTimeout(400);
    check('候補が複数なら選択ボタン', (await page.$$('#address-candidates .cand')).length === 2);
    await page.click('#address-candidates .cand:nth-child(2)'); await page.waitForTimeout(200);
    check('候補を選び直せる', (await page.textContent('#origin-status')).includes('府中市'));
    // 見つからない
    await page.fill('#address', 'あいうえお'); await page.click('#address-search'); await page.waitForTimeout(400);
    check('見つからない旨の表示', (await page.textContent('#origin-msg')).includes('見つかりませんでした'));
    // サービス障害
    global.gsiDown = true;
    await page.fill('#address', '西新宿'); await page.click('#address-search'); await page.waitForTimeout(400);
    check('住所検索の障害時メッセージ', (await page.textContent('#origin-msg')).includes('つながりませんでした'));
    global.gsiDown = false;
    // 地図で指定
    await page.click('#origin-map-box summary'); await page.waitForTimeout(500);
    const box = await page.$('#origin-map'); const bb = await box.boundingBox();
    await page.mouse.click(bb.x + bb.width / 2 + 40, bb.y + bb.height / 2 + 20); await page.waitForTimeout(300);
    check('地図クリックで出発地を設定', (await page.textContent('#origin-status')).includes('地図で指定した地点'));
    check('ピンが立つ', (await page.$$('#origin-map .leaflet-marker-icon')).length === 1);
    // 現在地
    await page.click('#use-gps'); await page.waitForTimeout(500);
    check('現在地を出発地に', (await page.textContent('#origin-status')).includes('現在地（誤差 約20m）'));
    await page.click('#diagnose'); await page.waitForTimeout(600);
    const meiji = await page.$$eval('#recommended .card', (cs) => { const c = cs.find((x) => x.querySelector('h3').textContent === '明治神宮'); return c ? c.querySelector('.meta').innerText : ''; });
    check('現在地からの方角を表示', (await page.textContent('#recommended .meta >> nth=0')).includes('真北から'));
    await page.screenshot({ path: path.join(__dirname, `new_${label}_origin.png`), fullPage: true });
    // 戻す
    await page.click('#origin-status .btn-text'); await page.waitForTimeout(200);
    check('都道府県庁付近に戻せる', (await page.textContent('#origin-status')).includes('都道府県庁付近') && !(await page.$('#origin-status .btn-text')));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    check('横はみ出しなし', !overflow);
    check('alertダイアログを使っていない', dialogs === 0);
    const real = logs.filter((l) => l !== 'Failed to load resource: net::ERR_FAILED');
    check('コンソールエラーなし（意図した住所検索の障害1件を除く）', real.length === 0 && logs.length - real.length === 1, logs.join(' | '));
    await page.screenshot({ path: path.join(__dirname, `new_${label}_final.png`), fullPage: true });
    await ctx.close();
  }

  // CDN障害時
  console.log('[CDN障害時]');
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await route(page, { blockCdn: true });
  await page.goto('file://' + target);
  await page.evaluate(() => { const d = document.getElementById('wish-more'); if (d) d.open = true; });
  await page.waitForTimeout(400);
  check('地図が読めない旨を表示', (await page.textContent('#map')).includes('読み込めません'));
  await setBD(page, '1974-04-15'); await page.selectOption('#home', '東京都');
  await page.click('#diagnose'); await page.waitForSelector('#recommended .card', { timeout: 20000 }).catch(() => {});
  check('地図なしでも診断は動く', (await page.$$('#recommended .card')).length === 5, errs.join('|'));
  await browser.close();
  const ng = results.filter((r) => !r.ok).length;
  console.log(`\n結果：${results.length - ng}件成功 / ${ng}件失敗`);
  process.exit(ng ? 1 : 0);
})();
