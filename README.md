# 日本全国パワースポット巡り！

生年月日とお住まいの都道府県から、合いそうなパワースポットを探すサイトです（試作版）。

公開ページ：https://motonory-a.github.io/japan-power-spots/
関連サイト：https://motonory-a.github.io/my-first-project/ （魂の系統鑑定）

## いまの状態（v1.1）

- スポットは8件のデモデータです。ご利益などのタグは仮の設定で、出典の確認はまだです。
- 診断は数秘術（暫定ロジック）・願いと体験・近さ・データの信頼性を合わせた点数で並べます。
- 九星気学は未実装です。画面の「方角」は地図上の向きを示しているだけです。
- 交通手段は直線距離の目安だけで判断しています。所要時間は出していません。

## ファイル構成

```
index.html              画面
assets/css/style.css    見た目
assets/js/config.js     点数の配分・交通手段ごとの距離の目安（ここを直せば推薦の重みが変わる）
assets/js/diagnosis.js  数秘・距離・方角・点数の計算（画面に依存しない）
assets/js/map.js        地図（Leaflet + OpenStreetMap）
assets/js/app.js        入力・診断・検索の画面処理
data/spots-demo.js      デモデータ8件と都道府県の代表地点
tests/run-tests.js      計算部分の自動テスト
docs/                   報告書・更新手順
```

ファイルはすべて相対パスで読み込んでいるので、GitHub Pages でも、パソコンで index.html を直接開いても動きます。

## テストの実行

Node.js 16以上が入っていれば：

```
node tests/run-tests.js
```

## データについて

地図は © OpenStreetMap contributors。OSM標準タイルの利用ポリシーに従い、出典表示は消さないでください。
