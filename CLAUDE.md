# このリポジトリで作業するAIへ

## Googleアナリティクス（2026-11-18 追加）
- 全ページの `<head>` の直後に Googleアナリティクスのタグ（測定ID `G-CX2WH9VGQ5`）を入れています。
- scripts/ のページ作成プログラム（build_food_guides.py・build_en_pages.js）には追加済みです。ほかの方法でページを作るときも、このタグを必ず入れてください。

## ホーム画面アプリ(PWA)(2026-11-27 追加)
- manifest.webmanifest・sw.js(ルート)・assets/js/pwa.js・assets/img/icon/ を追加。日本語トップの「アプリのように使う」カード(#install-card)は pwa.js が出し入れする。
- ページを作り直すときは、`<head>` に `<link rel="manifest" href="(../)manifest.webmanifest">`、`</body>` の前に `<script src="(../)assets/js/pwa.js" defer></script>` を入れる(build_food_guides.py には追加済み)。
- sw.js の中身を変えたら VER("psj-v1")を上げる。ig/ はキャッシュしない。
