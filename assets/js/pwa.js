/* ホーム画面に追加(アプリのように使う)。日本語トップだけ案内カードを出す */
(function(){
  var root = (document.currentScript && document.currentScript.src || "").replace(/assets\/js\/pwa\.js.*$/, "");
  var standalone = false;
  try { standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch(e){}
  function ga(n){ try { if (typeof gtag === "function") gtag("event", n); } catch(e){} }
  if ("serviceWorker" in navigator && root) addEventListener("load", function(){ navigator.serviceWorker.register(root + "sw.js", {scope: root}).catch(function(){}); });
  if (standalone) ga("open_from_homescreen");
  addEventListener("appinstalled", function(){ ga("app_installed"); var c = document.getElementById("install-card"); if (c) c.hidden = true; });
  var card = document.getElementById("install-card");
  if (!card || standalone) return;
  var ua = navigator.userAgent, ios = /iPhone|iPad|iPod/.test(ua) || (ua.indexOf("Mac") > -1 && "ontouchend" in document);
  var how = card.querySelector(".install-how"), btn = card.querySelector(".install-btn"), evt = null;
  how.innerHTML = ios
    ? "<li>Safariの下にある<b>共有ボタン</b>(四角から矢印が出ているマーク)を押す</li><li><b>「ホーム画面に追加」</b>を選ぶ</li><li>右上の<b>「追加」</b>を押す</li>"
    : "<li>ブラウザのメニュー(︙)を開く</li><li><b>「ホーム画面に追加」</b>または<b>「アプリをインストール」</b>を選ぶ</li>";
  card.hidden = false;
  addEventListener("beforeinstallprompt", function(e){ e.preventDefault(); evt = e; btn.hidden = false; how.hidden = true; });
  btn.addEventListener("click", function(){ if (!evt) return; evt.prompt(); evt.userChoice.then(function(){ evt = null; }); });
})();
