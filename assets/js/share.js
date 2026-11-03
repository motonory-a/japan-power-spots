/*
 * 友だちに紹介する（シェア）ボタン
 *   リンクをコピー／LINEで送る／X／Facebook／（スマホでは）その他のアプリ
 *   各サービスの共有ページへのリンクだけで、外部のスクリプトや計測タグは読み込まない。
 *   生年月日・住所・診断結果など、個人に関わる内容は送る文章に入れない。
 */
(function (root) {
  'use strict';
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function siteUrl() { return (root.APP_CONFIG && APP_CONFIG.siteUrl) || root.location.href.split('#')[0]; }

  function copy(text) {
    if (root.navigator && navigator.clipboard && root.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    var ta = el('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  // opts: { heading, text（紹介文）, url（省略時はサイトのURL） }
  function box(opts) {
    var url = opts.url || siteUrl();
    var text = opts.text || '';
    var wrap = el('div', 'share-box');
    if (opts.heading) wrap.append(el('p', 'share-heading', opts.heading));
    var row = el('div', 'share-row');

    var line = el('a', 'share-btn share-line', 'LINEで友だちに送る');
    line.href = 'https://line.me/R/share?text=' + encodeURIComponent((text ? text + '\n' : '') + url);
    var x = el('a', 'share-btn share-x', 'Xでポスト');
    x.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
    var fb = el('a', 'share-btn share-fb', 'Facebook');
    fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    [line, x, fb].forEach(function (a) { a.target = '_blank'; a.rel = 'noopener noreferrer'; });

    row.append(line, x, fb);
    // スマホなど、端末の共有メニューが使えるときだけ
    if (root.navigator && typeof navigator.share === 'function') {
      var more = el('button', 'share-btn share-more', 'その他のアプリ');
      more.type = 'button';
      more.addEventListener('click', function () {
        navigator.share({ title: document.title, text: text, url: url }).catch(function () { /* 閉じただけなら何もしない */ });
      });
      row.append(more);
    }
    wrap.append(row);
    return wrap;
  }

  // 「🔗 このサイトのリンクをコピー」（魂の系統鑑定サイトと同じ形：ページのいちばん上と、いちばん下）
  function copyButton() {
    var wrap = el('span', 'copyurl-wrap');
    var b = el('button', 'copyurl', '🔗 このサイトのリンクをコピー');
    b.type = 'button';
    var orig = b.textContent, timer = null;
    var fail = el('span', 'copyurl-fail'); fail.hidden = true;
    b.addEventListener('click', function () {
      var url = siteUrl();
      copy(url).then(function (ok) {
        if (ok) {
          b.textContent = '✓ コピーしました！';
          b.classList.add('done');
          clearTimeout(timer);
          timer = setTimeout(function () { b.textContent = orig; b.classList.remove('done'); }, 2200);
        } else {
          fail.textContent = 'コピーできませんでした。このURLを長押ししてコピーしてください：' + url;
          fail.hidden = false;
        }
      });
    });
    wrap.append(b, fail);
    return wrap;
  }

  root.Share = { box: box, copyButton: copyButton, siteUrl: siteUrl };
})(typeof window !== 'undefined' ? window : globalThis);
