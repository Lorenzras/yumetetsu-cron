# ゆめここ　クーロンジョッブ

このプロジェクトはTypescriptで書かれた、ゆめてつとここすものための自動化のコレクションです。

[英語版](README.md)

- [ゆめここ　クーロンジョッブ](#ゆめここクーロンジョッブ)
  - [使い方](#使い方)
  - [設定](#設定)
  - [ジョブ](#ジョブ)
  - [テスト](#テスト)
  - [パス](#パス)
  - [用語の定義](#用語の定義)

## 使い方

1. ルートに以下のコマンドを順番に実行してください。[CMDの使い方](https://www.wikihow.jp/%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%E3%81%A7%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B)

   ```bash
   git fetch
   npm i
   npm run build
   ```

2. ルートで **start.bat**　を実行してください。

3. 終わり。設定で指定したタスクを自動的に実行されます。

## 設定

- [Cron Jobs](src/main.ts)
スケージュールやタスクが設定出来ます。
[Cron Generator](https://crontab.guru/)を参照してください。

## ジョブ

- [ポータルチェック](src/tasks/syncs/portalCheck/readme.md)
- [donetの顧客をKintoneに同期する](src/tasks/syncs/doNet/syncDoNetCust.ts)
- [donetの物件Kintoneに同期する](src/tasks/syncs/doNet/syncDonetProperties.ts)
(非実行)
- [レインズ物件Kintoneに同期する](src/tasks/syncs/reins/syncProperties.ts)
(非実行)

## テスト

このプロジェクトは [jest](https://jestjs.io/)を利用しています.

*.test.ts のあるファイルはテスト出来ます。コマンドは以下の通りです。

```bash
jest [相対パス] -t [テスト名]
```

例えば、ポータルチェックをテストする場合、以下のコマンドで実行します。

```bash
jest portalCheckMainTask -t main
```

テストを実行する前に、条件があるときもあります。テストファイルのコードをご確認ください。

詳しくは[jest](https://jestjs.io/)にご参考ください。

## パス

- ログ:
   ルートの**logs**というフォールだーにあります。

- ダウンロード:
  ルートの**downloads**というフォールだーにあります。

- [その他](./src/utils/paths.ts).

## 用語の定義

- **ルート**:
階層型ファイル構造における最上階層のフォルダのことである。

- **クローン**:
UnixやLinuxで広く使われるスケジューラー。一定時間ごとに、プログラムを実行することができる。

- **ジョッブ**:
クローンが実行するタスクのこと。

- **Typescript**:
JavaScript(ジャバスクリプト)と上位互換性をもつオブジェクト指向の簡易プログラミング言語であり、オープンソースとして利用可能。グーグル社内の標準開発言語の一つ。
