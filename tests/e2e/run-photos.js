const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
async function setBD(pg, v) { if (!v) { await pg.selectOption('#bd-y', ''); await pg.selectOption('#bd-m', ''); await pg.selectOption('#bd-d', ''); return; } const [y, m, d] = v.split('-').map(Number); await pg.selectOption('#bd-y', String(y)); await pg.selectOption('#bd-m', String(m)); await pg.selectOption('#bd-d', String(d)); }
const results = []; const check = (n, ok, i = '') => { results.push(ok); console.log((ok ? '  OK  ' : '  NG  ') + n + (i ? '  ' + i : '')); };
(async () => {
  const b = await chromium.launch();
  for (const [label, down] of [['通常', false], ['Wikimedia障害時', true]]) {
    console.log('[' + label + ']');
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    let wdCalls = 0;
    await p.route('**/*', (r) => { const u = r.request().url();
      if (u.includes('unpkg')) return r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: u.endsWith('css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(__dirname, 'node_modules/leaflet/dist/') + u.split('/dist/')[1]) });
      if (u.includes('wikidata.org/w/api.php')) {
        wdCalls++;
        if (down) return r.abort();
        const ids = decodeURIComponent(u.split('ids=')[1]).split('|');
        const entities = {};
        ids.forEach((q, i) => { entities[q] = { claims: i % 2 === 0 ? { P18: [{ mainsnak: { datavalue: { value: 'Test photo ' + q + '.jpg' } } }] } : {} }; });
        return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ entities }) });
      }
      if (u.includes('commons.wikimedia.org/w/api.php')) {
        const titles = decodeURIComponent(u.split('titles=')[1]).split('|');
        const pages = {}, normalized = [];
        titles.forEach((t, i) => { const to = t.replace(/_/g, ' '); if (to !== t) normalized.push({ from: t, to });
          pages[-1 - i] = { title: to, imageinfo: [{ thumburl: 'https://upload.wikimedia.org/thumb/' + i + '.jpg', descriptionurl: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(t), extmetadata: { Artist: { value: '<a href="x">山田 太郎</a>' }, LicenseShortName: { value: 'CC BY-SA 4.0' } } }] }; });
        return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ query: { normalized, pages } }) });
      }
      if (u.includes('upload.wikimedia.org')) return r.fulfill({ status: 200, contentType: 'image/jpeg', body: fs.readFileSync(path.join(__dirname, 'fixtures/photo.jpg')) });
      if (u.startsWith('file')) return r.continue(); return r.abort(); });
    await p.goto('file://' + path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'))); await p.waitForTimeout(400);
    await setBD(p, '1974-04-15'); await p.selectOption('#home', '奈良県');
    await p.click('label.chip:has(input[value="神社"])');
    await p.click('#diagnose'); await p.waitForSelector('#recommended .card', { timeout: 30000 }); await p.waitForTimeout(1500);
    const withWd = await p.$$eval('#recommended .card', (cs) => cs.length);
    const figs = await p.$$('#recommended .card figure.photo');
    const loading = await p.$$('#recommended .photo-loading');
    if (!down) {
      check('上位5件に写真が付く（P18のあるものだけ）', figs.length >= 1 && figs.length <= 5, figs.length + '枚 / ' + withWd + '件');
      check('写真の読み込み中表示が残らない', loading.length === 0);
      const cap = await p.textContent('#recommended figure.photo figcaption');
      check('撮影者・ライセンス・出典を表示', cap.includes('山田 太郎') && cap.includes('CC BY-SA 4.0') && cap.includes('Wikimedia Commons'), cap);
      check('元の写真ページへのリンク', (await p.getAttribute('#recommended figure.photo figcaption a', 'href')).startsWith('https://commons.wikimedia.org/wiki/'));
      check('画像が表示されている', await p.$eval('#recommended figure.photo img', (i) => i.complete && i.naturalWidth > 0));
      check('写真の取得は1回のまとめ問い合わせ', wdCalls === 1, String(wdCalls));
      await (await p.$('#recommended .card:has(figure.photo)')).screenshot({ path: 'photos_sp.png' });
    } else {
      check('障害時は写真なしで表示（読み込み中が残らない）', figs.length === 0 && loading.length === 0);
      check('障害時もおすすめは5件', withWd === 5);
    }
    check('エラーなし', errs.length === 0, errs.join(' | '));
    await p.close();
  }
  await b.close();
  const ng = results.filter((x) => !x).length; console.log(`\n結果：${results.length - ng}件成功 / ${ng}件失敗`); process.exit(ng ? 1 : 0);
})();
