# GitHub への反映手順（Windows・ブラウザだけで行う方法）

## 事前の確認（パソコンだけで試す）

1. 受け取った ZIP（japan-power-spots_v1.1.zip）を右クリック →「すべて展開」。
2. 展開してできたフォルダ「japan-power-spots」を開き、中の index.html をダブルクリック。
3. Edge か Chrome で開くので、生年月日と都道府県を入れて「おすすめスポットを診断する」を押し、結果と地図が出ることを確認。
   （ネットにつながっていないと地図は出ません。診断は動きます）

## 反映

4. ブラウザで https://github.com/motonory-a/japan-power-spots を開き、ログインしておく。
5. ファイル一覧の上にある「Add file」→「Upload files」を押す。
6. エクスプローラーで手順2のフォルダを開き、中身を全部選択（Ctrl+A）して、ブラウザの「Drag files here」の枠にドラッグ＆ドロップ。
   - index.html、README.md、assets、data、docs、tests が並んでいればOK。
   - フォルダごと（assets など）ドラッグして大丈夫です。中の構成はそのまま上がります。
   - 「japan-power-spots」フォルダそのものではなく、その「中身」をドラッグしてください。
7. 下の「Commit changes」欄の1行目に「v1.1 診断画面の改善とファイル分割」と入力。
8. 「Commit directly to the main branch」が選ばれていることを確認して「Commit changes」を押す。
9. 1〜2分待ってから https://motonory-a.github.io/japan-power-spots/ を開き、Ctrl+F5（強制再読み込み）。
10. 画面上部に黄色の「試作版です」の帯が出ていれば反映できています。診断と地図を試してください。スマホでも一度開いてみてください。

反映されないときは、リポジトリの「Actions」タブで「pages build and deployment」が緑のチェックになっているか確認してください。黄色の丸なら処理中なので、もう少し待ちます。

## 元に戻したいとき

ZIPと一緒にお渡しした index_v1.0_backup.html の名前を index.html に変えて、手順4〜8と同じようにアップロードすれば、以前の画面に戻ります（assets などのフォルダは残っていても問題ありません）。
GitHub の履歴（index.html を開いて「History」）からも以前の内容を見られます。
