# 日本全国パワースポット巡り！

生年月日とお住まいの都道府県から、合いそうなパワースポットを探すサイトです（試作版）。

公開ページ：https://motonory-a.github.io/japan-power-spots/
関連サイト：https://motonory-a.github.io/my-first-project/ （魂の系統鑑定）

## いまの状態（v2.5）

- スポットは全国約9.1万件（OpenStreetMap と Wikidata をもとに選定、10万件以内）。知名度の高い約1万件を最初に読み込み、残りは表示後に読み込みます（data/extra/）。作り方と選び方は docs/DATA_SPEC.md、件数の内訳は docs/DATA_REPORT.md。
- ご利益は、Wikidata の祭神・本尊と、神社・寺院の名称（稲荷・天満宮・八幡など）から一般的なものを推定しています。内容は全件「未確認」の扱いです。
- 診断は数秘術（暫定ロジック）・願いと体験・近さ・方位の運気・知名度・データの信頼性を合わせた点数で並べます。
- 診断結果の最初に「あなたの気学」として、本命星・月命星、今年・今月の本命星の位置とその意味、今年の吉方位、これから6か月の月ごとの吉方位を表示します。
- 出かける日を入れると、九星気学（年盤・月盤・日盤）で方位の吉凶を判定し、運気の良い方位のスポットを優先します。決まりごとと検証結果は docs/KYUSEI_SPEC.md。
- 入力内容（生年月日・出発地・願いなど）は、ニックネームごとにこの端末のブラウザ内（localStorage）に保存できます。サーバーには送りません。
- 出発地は、都道府県庁付近のほか、住所検索（国土地理院）・地図でのピン指定・現在地でくわしく指定できます。
- 方角は真北基準の角度（大圏コース）で、東西南北30°・四隅60°で区切って表示します。計算方法は config.js の bearingMethod で切り替えられます。
- 交通手段は公共交通・車・自転車・徒歩。所要時間は、直線距離と交通手段ごとの平均的な速さ（自転車は時速15km）から出した目安です。「◯時間以内」で絞り込めます。

## ファイル構成

```
index.html              画面
assets/css/style.css    見た目
assets/js/config.js     点数の配分・交通手段ごとの距離の目安（ここを直せば推薦の重みが変わる）
assets/js/diagnosis.js  数秘・距離・方角・点数の計算（画面に依存しない）
assets/js/kyusei.js     九星気学（暦・年月日の盤・本命星・吉凶方位）
assets/js/kigaku-board.js  八角形の方位盤の図（SVG）
assets/js/photos.js     おすすめ上位の写真（Wikidata の代表写真を Wikimedia Commons から表示）
assets/js/map.js        地図（Leaflet + OpenStreetMap）
assets/js/origin.js     出発地のくわしい指定（住所検索・地図・現在地）
assets/js/profiles.js   入力内容の保存（ニックネームごと、端末内のみ）
assets/js/app.js        入力・診断・検索の画面処理
data/spots-demo.js      手入力のスポット（説明文など）・都道府県の代表地点・願いの選択肢
data/spots-osm.js       全国スポットデータ約1万件（scripts/build_spots.py で生成）
data/manifest.json      全国データの件数・都道府県別件数
assets/js/data.js       全国データの読み込み
scripts/osm_candidates.py / wikidata_fetch.py / build_spots.py  OSM・Wikidataからの抽出・選定
.github/workflows/wikidata-extract.yml  Wikidata取得（GitHub Actions）
.github/workflows/osm-extract.yml  OSM抽出（GitHub Actions）
data/solar-terms.js     二十四節気の日本時間（1899〜2101年、scripts/build_solar_terms.js で生成）
tests/run-tests.js      計算部分の自動テスト
tests/run-kyusei-tests.js 九星気学のテスト（国立天文台・実在の暦と照合）
docs/                   報告書・更新手順
```

ファイルはすべて相対パスで読み込んでいるので、GitHub Pages でも、パソコンで index.html を直接開いても動きます。

## テストの実行

Node.js 16以上が入っていれば：

```
node tests/run-tests.js
node tests/run-kyusei-tests.js
node tests/run-data-tests.js
```

## 更新履歴

- v2.5（2026-11-03）全国約9.1万件（Wikidata で知名度・祭神・文化財を追加、OSMにない寺社を補充）、推薦計算の高速化
- v2.4（2026-11-03）おすすめ1〜5位に写真（Wikimedia Commons、撮影者・ライセンス表示）
- v2.3（2026-11-03）八角形の方位盤の図（今年・今月・出かける日、五行の色、本命星・吉凶方位の表示）
- v2.2（2026-11-03）全国約5万件（分割読み込み）、「あなたの気学」（今の状態と6か月の吉方位）
- v2.1（2026-11-03）入力内容の保存とニックネーム登録（端末内のみ）
- v2.0（2026-11-03）全国約1万件のスポットデータ（OpenStreetMap）、知名度の点数、願い・体験での検索、地図の高速表示
- v1.4.1（2026-11-03）願い・体験の複数選択をわかりやすく（✓表示・選択中の一覧・すべて解除）
- v1.4（2026-11-03）願い・体験のカテゴリーを30種類に拡充（商売繁盛・厄除け・御神木など）、交通手段に自転車を追加
- v1.3（2026-11-03）出かける日の方位の吉凶（九星気学）、方位の早見表、方角表示を30°・60°の区切りに統一
- v1.2（2026-11-03）出発地のくわしい指定、方角の角度表示、所要時間の目安と時間指定
- v1.1（2026-11-03）ファイル分割、願い・交通手段、推薦の根拠、地図連動

## データについて

地図は © OpenStreetMap contributors。OSM標準タイルの利用ポリシーに従い、出典表示は消さないでください。
住所検索は国土地理院の住所検索を利用しています（提供の継続は保証されていないため、使えないときは地図での指定に案内します）。
