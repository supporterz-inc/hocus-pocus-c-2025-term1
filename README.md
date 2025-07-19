Hocus Pocus | Knowledge Sharing Platform for GEEK-Project
===============================================================================

ベースとなるプロジェクトは "ニュートラルな設計" であることに重きを置いています。

これは、サマーインターンシップで形成されるチームの性質に応じて、 実装に特色が出ていくことを期待しているからです。

**"Hocus Pocus"** というプロジェクト名称自体も、「何が起こるかわからない」[^1]という観点から命名されています。


## Getting Started

この章に記載の項目は、セットアップ時に一度のみ実施してください：

1. [Node.js](https://nodejs.org/en/download) をインストールします
    - 動作確認済みのバージョンは `v24.2.0` です
2. Git-root にて `npm ci` コマンドを実行し、必要なライブラリをインストールします


## How to Use

### ローカル環境における動作確認

1. `npm run build` : Node.js ランタイム向けに、**src** 配下にある TypeScript をトランスパイルする
2. `npm run start` : **target** 配下にあるアプリケーションを、[localhost:8080](http://localhost:8080) に配信する
    - `export NODE_ENV="development"` の要領で環境変数が設定されている場合、JWT の認証処理を回避できます


## Mission

`GEMINI.md` を参照しながら、チームで協力してベースアプリケーションのスコープを実装してください。


[^1]: https://dragon-quest.org/wiki/Hocus_Pocus
