<div align="center">
  <h1>Jomon UI</h1>
  <p><strong>会計支援サービス Jomon のフロントエンド</strong></p>
  <p>
    <a href="https://apis.trap.jp/?urls.primaryName=Jomon%20v2%20API">Jomon API</a>&emsp;<a href="https://github.com/traPtitech/Jomon">Jomon Backend</a>
  </p>
  <p>
    <a href="https://github.com/traPtitech/Jomon-UI/actions/workflows/main.yml"><img src="https://github.com/traPtitech/Jomon-UI/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  </p>
</div>

## 概要

- 会計支援サービス Jomon のフロントエンドリポジトリです。デジタル創作同好会 traP で開発・利用しています。
- Vue 3 + TypeScript と Vite を用いており、機能単位のモジュール構成で保守性を高めています。
- OpenAPI から生成したクライアントを活用し、バックエンドと型安全に連携します。

## 技術スタック

- フレームワーク: Vue 3 (Composition API)
- ビルド: Vite 7, vue-tsc
- 状態管理: Pinia
- HTTP クライアント: axios
- スタイル: Tailwind CSS 4, 自作コンポーネント
- テスト/品質: ESLint, Prettier, vue-axe, MSW

## 必要条件

- Node.js 22.12 以上 (Vite 7 が要求する Node.js 20.19+ / 22.12+ を満たすため推奨)
- npm (Node.js に同梱)
- JVM (OpenAPI Generator 利用のため Java 17 以上を推奨)

Node.js 環境は [Volta](https://volta.sh/) や [fnm](https://github.com/Schniz/fnm) などのバージョンマネージャで固定すると開発が安定します。

## セットアップ

1. 依存パッケージのインストール
   ```sh
   npm install
   ```
2. 環境変数ファイルの作成
   - `.env.local` をプロジェクトルートに配置し、`VITE_` プレフィックス付きの設定を記述します。
3. 開発サーバーを起動

   ```sh
   npm run dev
   ```

   - Vite の開発サーバーが `http://localhost:5173` (既定) で起動し、HMR が有効になります。

## 主要スクリプト

| コマンド               | 説明                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Vite の開発サーバーを起動します。                                   |
| `npm run build`        | `vue-tsc --noEmit` で型検証後、Vite で本番ビルドを生成します。      |
| `npm run serve`        | 生成済みビルドを `vite preview` で確認します。                      |
| `npm run build:watch`  | ビルドを監視モードで実行します。                                    |
| `npm run lint`         | ESLint を自動修正付きで実行します。                                 |
| `npm run lint:nofix`   | 自動修正なしで ESLint を実行します。                                |
| `npm run type-check`   | `vue-tsc --noEmit` による型検証のみを実行します。                   |
| `npm run format`       | Prettier でコード整形を行います。                                   |
| `npm run format:check` | Prettier の整形差分を確認します。                                   |
| `npm run gen-api`      | OpenAPI スキーマから TypeScript クライアントを生成します。          |
| `npm run clean`        | 生成済み API クライアント (`src/lib/apis/generated`) を削除します。 |

> `npm install` 後に `postinstall` スクリプトで `npm run gen-api` が自動実行されます。API スキーマ更新時は `npm run clean && npm run gen-api` を手動で再実行してください。

## プロジェクト構成

```
src/
  components/            再利用可能な UI コンポーネント
  features/
    <feature>/
      entities.ts        ドメインエンティティとシード型
      store.ts           Pinia ストア (必要な機能のみ)
      composables.ts     Composition API ベースのユーティリティ (任意)
      data/              OpenAPI 由来データを扱う層
        repository.ts    OpenAPI クライアントを利用した API アクセス
        converter.ts     生成型↔ドメイン型の変換
        *.ts             feature 固有の補助ロジック
      __mocks__/         MSW 用のモックハンドラとデータ
  lib/apis/generated/     OpenAPI から自動生成されたクライアント (編集禁止)
  pages/                 画面単位の Vue コンポーネント
  styles/                グローバルスタイル
```

GET 系データは `data/converter.ts` で生成型からドメイン型へ、POST/PUT 時は `data/repository.ts` でドメイン型から生成型へ変換しながら送信する設計です。`store.ts` や `composables.ts` は feature ごとに必要なもののみ配置しています。

## コーディング規約

- TypeScript `strict` 設定のもと、Composition API ベースで実装します。
- ファイル命名はケバブケース、型・インターフェースはパスカルケース、Composable は `useXxx` で統一します。
- Prettier (2 スペース・シングルクォート) で整形し、コミット前に `npm run format` を推奨します。
- ESLint (`plugin:vue/strongly-recommended`, `vuejs-accessibility`) を活用し、ARIA 属性とラベルの対応を必ず確認してください。
- UI のアクセシビリティ回帰は `vue-axe` を用いた手動確認を実施します。

## テストと品質

- 静的解析: `npm run lint`, `npm run type-check`
- UI ロジックの自動テストを追加する場合は Vue Test Utils と MSW を利用し、モックは `src/features/<feature>/__mocks__` を再利用します。
- 主要フォームやダイアログは `vue-axe` を併用してアクセシビリティ検証を行ってください。

## API クライアント運用

1. `openapitools.json` と `scripts/generate-apis.ts` を更新してスキーマを同期します。
2. `npm run gen-api` を実行し、`src/lib/apis/generated` にクライアントを再生成します。
3. 生成物はコミットし、差分がレビューできるようにしてください。
4. MSW のワーカーを更新する際は `npx msw init public/ --save` を利用します。

## リンク

- [Jomon Backend](https://github.com/traPtitech/Jomon)
- [Jomon API ドキュメント](https://apis.trap.jp/?urls.primaryName=Jomon%20v2%20API)
- [Vite ドキュメント](https://vite.dev/guide/)
- [Vue 3 ドキュメント](https://vuejs.org/guide/introduction.html)
