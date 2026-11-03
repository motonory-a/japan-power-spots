# 画面の自動テスト

ブラウザ（Chromium）で index.html を開き、実際に入力・クリックして動きを確かめます。
外部への通信はすべて止め、地図ライブラリ・地図タイル・写真は手元のファイルで代用します。

| ファイル | 内容 |
|---|---|
| run-main.js | 入力・診断・地図・出発地・検索・障害時の動き（全体） |
| run-profiles.js | 入力の保存とニックネーム |
| run-photos.js | おすすめ上位の写真 |
| run-phase2.js | トップ画面（メイン画像・コピー・願いごとから探す）、日本時間、動きを減らす設定 |

```
npm install
npx playwright install chromium
npm test
```
