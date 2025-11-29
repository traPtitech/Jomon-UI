<div align="center">
  <h1>Jomon UI</h1>
  <p><strong>Accounting support service "Jomon" frontend / 会計支援サービス Jomon のフロントエンド</strong></p>
  <p>
    <a href="https://apis.trap.jp/?urls.primaryName=Jomon%20v2%20API">Jomon API</a>&emsp;<a href="https://github.com/traPtitech/Jomon">Jomon Backend</a>
  </p>
  <p>
    <a href="https://github.com/traPtitech/Jomon-UI/actions/workflows/main.yml"><img src="https://github.com/traPtitech/Jomon-UI/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  </p>
  <p>
    <a href="#english">English</a> | <a href="#日本語">日本語</a>
  </p>
</div>

## English

### Overview

- Frontend repository for the accounting support service Jomon, developed and operated by the Digital Creation Club traP.
- Built with Vue 3 + TypeScript on top of Vite, following a feature-based module structure for maintainability.
- Uses the OpenAPI-generated TypeScript client for type-safe integration with the backend.

### Tech Stack

- Framework: Vue 3 (Composition API)
- Build: Vite 7, vue-tsc
- State Management: Pinia
- HTTP Client: axios
- Styling: Tailwind CSS 4, custom components
- Testing & Quality: ESLint, Prettier, vue-axe, MSW

### Requirements

- Node.js 24.11 or higher
- npm (bundled with Node.js)
- JVM (Java 17+ recommended for OpenAPI Generator)

We recommend locking Node.js versions via tools like [Volta](https://volta.sh/) or [fnm](https://github.com/Schniz/fnm) for consistent local environments.

### Setup

Install dependencies.

```sh
npm install
```

### Development Server

Start the development server (defaults to `http://localhost:5173` with hot module replacement enabled).

```sh
npm run dev
```

### Scripts

| Command                    | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `npm run dev`              | Start the Vite development server.                                |
| `npm run build`            | Run `vue-tsc --noEmit` then produce a production build with Vite. |
| `npm run serve`            | Preview an existing production build via `vite preview`.          |
| `npm run build:watch`      | Continuously watch and rebuild during development.                |
| `npm run lint`             | Execute ESLint with automatic fixes.                              |
| `npm run lint:nofix`       | Execute ESLint without applying fixes.                            |
| `npm run type-check`       | Run type-only checks using `vue-tsc --noEmit`.                    |
| `npm run format`           | Format code using Prettier.                                       |
| `npm run format:check`     | Verify formatting differences with Prettier.                      |
| `npm run test:unit`        | Run unit tests with Vitest.                                       |
| `npm run type-check:tests` | Run type-only checks for tests using `vue-tsc --noEmit`.          |
| `npm run gen-api`          | Generate the TypeScript client from the OpenAPI schema.           |
| `npm run clean`            | Remove generated API clients in `src/lib/apis/generated`.         |

> After `npm install`, the `postinstall` script automatically triggers `npm run gen-api`. When the API schema changes, run `npm run clean && npm run gen-api` manually.

### Project Structure

```
src/
  components/            Reusable UI components
  features/
    <feature>/
      entities.ts        Domain entities and seed types
      store.ts           Pinia store (added per feature as needed)
      composables.ts     Composition API utilities (optional)
      data/              Layer handling OpenAPI data
        repository.ts    API access using the generated client
        converter.ts     Mapping between generated and domain models
        *.ts             Feature-specific utilities
      __mocks__/         MSW handlers and mock data
  lib/apis/generated/     Auto-generated OpenAPI client (Do not edit)
  pages/                 Page-level Vue components
  styles/                Global styles
```

GET flows convert generated models to domain models in `data/converter.ts`, while POST/PUT requests transform domain models back to generated schemas in `data/repository.ts`. Each feature includes only the stores or composables it truly needs.

### Coding Guidelines

- Implement with the Composition API under TypeScript `strict` mode.
- Use kebab-case for file names, PascalCase for types/interfaces, and prefix composables with `use`.
- Keep formatting consistent with Prettier (2 spaces, single quotes); run `npm run format` before committing.
- Rely on ESLint (`plugin:vue/strongly-recommended`, `vuejs-accessibility`) and verify ARIA attribute/label pairing.
- Perform manual accessibility checks with `vue-axe` for key forms and dialogs.

### Testing & Quality

- Static checks: `npm run lint`, `npm run type-check`, `npm run type-check:tests`
- Unit tests: `npm run test:unit`
- For UI logic tests, use Vue Test Utils with MSW, reusing handlers under `src/features/<feature>/__mocks__`.
- Conduct accessibility validation on major forms/dialogs with `vue-axe` during manual testing.

### API Client Workflow

1. Update `openapitools.json` and `scripts/generate-apis.ts` to sync schema changes.
2. Run `npm run gen-api` to regenerate clients under `src/lib/apis/generated`.
3. Commit generated artifacts so reviewers can track differences.
4. To refresh the MSW worker, run `npx msw init public/ --save`.

### Links

- [Jomon Backend](https://github.com/traPtitech/Jomon)
- [Jomon API Documentation](https://apis.trap.jp/?urls.primaryName=Jomon%20v2%20API)
- [Vite Documentation](https://vite.dev/guide/)
- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)

---

## 日本語

### 概要

- 会計支援サービス Jomon のフロントエンドリポジトリです。デジタル創作同好会 traP で開発・運用しています。
- Vue 3 + TypeScript と Vite を用い、機能単位のモジュール構成で保守性を高めています。
- OpenAPI から生成した TypeScript クライアントを活用し、バックエンドと型安全に連携します。

### 技術スタック

- フレームワーク: Vue 3 (Composition API)
- ビルド: Vite 7, vue-tsc
- 状態管理: Pinia
- HTTP クライアント: axios
- スタイル: Tailwind CSS 4, 自作コンポーネント
- テスト/品質: ESLint, Prettier, vue-axe, MSW

### 必要条件

- Node.js 24.11 以上
- npm (Node.js に同梱)
- JVM (OpenAPI Generator 利用のため Java 17 以上を推奨)

Node.js 環境は [Volta](https://volta.sh/) や [fnm](https://github.com/Schniz/fnm) などのバージョンマネージャで固定すると安定します。

### セットアップ

依存パッケージをインストールします。

```sh
npm install
```

### 開発サーバーの起動

`npm run dev` で Vite の開発サーバーが立ち上がり、デフォルトで `http://localhost:5173` が開きます。

```sh
npm run dev
```

### 主要スクリプト

| コマンド                   | 説明                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| `npm run dev`              | Vite の開発サーバーを起動します。                                   |
| `npm run build`            | `vue-tsc --noEmit` で型検証後、Vite で本番ビルドを生成します。      |
| `npm run serve`            | 生成済みビルドを `vite preview` で確認します。                      |
| `npm run build:watch`      | 監視モードでビルドを実行します。                                    |
| `npm run lint`             | ESLint を自動修正付きで実行します。                                 |
| `npm run lint:nofix`       | 自動修正なしで ESLint を実行します。                                |
| `npm run type-check`       | `vue-tsc --noEmit` による型検証のみを実行します。                   |
| `npm run format`           | Prettier でコード整形を行います。                                   |
| `npm run format:check`     | Prettier の整形差分を確認します。                                   |
| `npm run test:unit`        | Vitest で単体テストを実行します。                                   |
| `npm run type-check:tests` | テストファイルの型検証のみを実行します。                            |
| `npm run gen-api`          | OpenAPI スキーマから TypeScript クライアントを生成します。          |
| `npm run clean`            | 生成済み API クライアント (`src/lib/apis/generated`) を削除します。 |

> `npm install` 後に `postinstall` スクリプトで `npm run gen-api` が自動実行されます。API スキーマ更新時は `npm run clean && npm run gen-api` を手動で再実行してください。

### プロジェクト構成

```
src/
  components/            再利用可能な UI コンポーネント
  features/
    <feature>/
      entities.ts        ドメインエンティティとシード型
      store.ts           Pinia ストア (必要な機能のみ配置)
      composables.ts     Composition API ベースのユーティリティ (任意)
      data/              OpenAPI 由来データを扱う層
        repository.ts    生成クライアントを利用した API アクセス
        converter.ts     生成型とドメイン型の相互変換
        *.ts             feature 固有の補助ロジック
      __mocks__/         MSW 用のモックハンドラとデータ
  lib/apis/generated/     OpenAPI から自動生成されたクライアント (編集禁止)
  pages/                 画面単位の Vue コンポーネント
  styles/                グローバルスタイル
```

GET 系データは `data/converter.ts` で生成型からドメイン型へ、POST/PUT 時は `data/repository.ts` でドメイン型から生成型へ変換しながら送信する設計です。`store.ts` や `composables.ts` は feature ごとに必要なもののみ配置しています。

### コーディング規約

- TypeScript `strict` 設定のもとで Composition API を用いて実装します。
- ファイル命名はケバブケース、型・インターフェースはパスカルケース、Composable は `use` プレフィックスで統一します。
- Prettier (2 スペース・シングルクォート) で整形し、コミット前に `npm run format` を推奨します。
- ESLint (`plugin:vue/strongly-recommended`, `vuejs-accessibility`) を活用し、ARIA 属性とラベルの対応を確認します。
- 主要フォームやダイアログでは `vue-axe` を活用した手動アクセシビリティ検証を行います。

### テストと品質

- 静的解析: `npm run lint`, `npm run type-check`, `npm run type-check:tests`
- 単体テスト: `npm run test:unit`
- UI ロジックの自動テストを追加する場合は Vue Test Utils と MSW を利用し、モックは `src/features/<feature>/__mocks__` を再利用します。
- 主要なフォーム・ダイアログでは `vue-axe` を併用してアクセシビリティ検証を行ってください。

### API クライアント運用

1. `openapitools.json` と `scripts/generate-apis.ts` を更新してスキーマを同期します。
2. `npm run gen-api` を実行し、`src/lib/apis/generated` にクライアントを再生成します。
3. 生成物はコミットし、差分がレビューできるようにしてください。
4. MSW のワーカーを更新する際は `npx msw init public/ --save` を利用します。

### リンク

- [Jomon Backend](https://github.com/traPtitech/Jomon)
- [Jomon API ドキュメント](https://apis.trap.jp/?urls.primaryName=Jomon%20v2%20API)
- [Vite ドキュメント](https://vite.dev/guide/)
- [Vue 3 ドキュメント](https://vuejs.org/guide/introduction.html)
