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

### Development Flow

**Local Development**

- Start dev server: `npm run dev`
- Type check in parallel: `npm run type-check` (keep running to catch errors early)
- Format & Lint:
  - Run `npm run format` and `npm run lint` before committing.
  - CI uses `lint:nofix` and `format:check` to ensure quality without modifying code.

**CI (Pull Request)**

1. `npm ci`
2. `npm run gen-api` (Ensure generated code matches schema)
3. `npm run lint:nofix`
4. `npm run format:check`
5. `npm run type-check`
6. `npm run type-check:tests`
7. `npm run test:unit`
8. `npm run build`

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
    <feature>/           Domain feature modules
      entities.ts        Domain entities and seed types
      store.ts           Pinia store (Setup Store pattern)
      composables.ts     Composition API utilities
      data/              Layer handling OpenAPI data
        repository.ts    API access using the generated client
        converter.ts     Mapping between generated and domain models
        *.ts             Feature-specific utilities
      __mocks__/         MSW handlers and mock data
  lib/apis/generated/    Auto-generated OpenAPI client (Do not edit)
  pages/                 Page-level Vue components
  styles/                Global styles (Tailwind CSS v4)
tests/
  features/              Unit tests mirroring src/features
  components/            Component tests
```

### Best Practices

**Vue Components**

- Use `<script setup lang="ts">` for all new components.
- Define typed props/emits using `defineProps<Props>()` and `defineEmits<Events>()`.
- Keep components focused; extract logic to composables or sub-components when complex.

**State Management (Pinia)**

- Split stores by domain (e.g., `useAuthStore`, `useApplicationStore`).
- Use the Setup Store pattern (`defineStoreComposable`) for better type inference and flexibility.
- Keep UI state (like modal open/close) local to components unless shared globally.

**Testing**

- **Unit Tests (Vitest)**: Test behavior, not implementation details.
- **API Mocking (MSW)**: Use `src/mocks/handlers.ts` or feature-specific mocks.
- **Accessibility**: Use `vue-axe` for manual checks during development.

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

### 開発フロー

**ローカル開発**

- 開発サーバー: `npm run dev`
- 型チェック並行実行: `npm run type-check` (エラーを早期発見するため常時実行推奨)
- フォーマット・Lint:
  - コミット前に `npm run format` と `npm run lint` を実行
  - CI では `lint:nofix` と `format:check` を使い、コードを書き換えずに品質をチェックします

**CI (Pull Request)**

1. `npm ci`
2. `npm run gen-api` (生成コードが最新か確認)
3. `npm run lint:nofix`
4. `npm run format:check`
5. `npm run type-check`
6. `npm run type-check:tests`
7. `npm run test:unit`
8. `npm run build`

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
    <feature>/           ドメイン機能モジュール
      entities.ts        ドメインエンティティとシード型
      store.ts           Pinia ストア (Setup Store パターン)
      composables.ts     Composition API ベースのユーティリティ
      data/              OpenAPI 由来データを扱う層
        repository.ts    生成クライアントを利用した API アクセス
        converter.ts     生成型とドメイン型の相互変換
        *.ts             feature 固有の補助ロジック
      __mocks__/         MSW 用のモックハンドラとデータ
  lib/apis/generated/    OpenAPI から自動生成されたクライアント (編集禁止)
  pages/                 画面単位の Vue コンポーネント
  styles/                グローバルスタイル (Tailwind CSS v4)
tests/
  features/              src/features に対応する単体テスト
  components/            コンポーネントテスト
```

### ベストプラクティス

**Vue コンポーネント**

- 新規コンポーネントは `<script setup lang="ts">` で記述する。
- props/emits は `defineProps<Props>()` / `defineEmits<Events>()` で型定義する。
- コンポーネントの責務を絞り、複雑なロジックは composable やサブコンポーネントに切り出す。

**状態管理 (Pinia)**

- ストアはドメイン単位（例: `useAuthStore`, `useApplicationStore`）で分割する。
- Setup Store パターン (`defineStoreComposable`) を採用し、型推論と柔軟性を高める。
- モーダル開閉などの一時的な UI 状態は、共有不要ならコンポーネント内に閉じる。

**テスト**

- **単体テスト (Vitest)**: 実装詳細ではなく「振る舞い」をテストする。
- **API モック (MSW)**: `src/mocks/handlers.ts` や各 feature の mock を活用する。
- **アクセシビリティ**: 開発中に `vue-axe` で手動チェックを行う。

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
