# Repository Guidelines

## プロジェクト構成とモジュール

Jomon UIはViteとVue 3 + TypeScriptで構築されています。`src/`配下にアプリケーションコードがあり、`src/features/<feature>`にはmodel・repository・usecase・converter・mockがまとまりで存在します。画面レベルのVueコンポーネントは`src/pages/`、共有UIは`src/components/`、スタイルは`src/styles/`で管理します。自動生成されたOpenAPIクライアントは`src/lib/apis/generated`に出力されるため、手動編集は避けてください。

## ビルド・テスト・開発コマンド

- `npm run dev`: Vite開発サーバーを起動し、ホットリロードを有効化します。
- `npm run build`: `vue-tsc`で型検証後に本番ビルドを生成します。
- `npm run serve`: ビルド成果物を`vite preview`で確認します。
- `npm run lint` / `npm run format:check`: ESLintとPrettierで静的解析とフォーマット確認を行います。
- `npm run type-check`: `vue-tsc --noEmit`による型検証のみを実行します。
- `npm run gen-api` / `npm run clean`: OpenAPIコード生成と生成物のクリーニングに使用します。

## コーディングスタイルと命名規約

すべてのアプリコードはTypeScript標準（`strict`）に従い、Composition APIベースで記述してください。Prettier既定設定（2スペースインデント・シングルクォート）を保つため、保存前後に`npm run format`を活用します。ESLintは`plugin:vue/strongly-recommended`とアクセシビリティルールを適用しているため、ARIA属性とラベルの対応を必ず確認してください。ファイル名はケバブケース、TypeScriptの型・インターフェースはパスカルケース、storeやComposableは`useXxx`プレフィックスで統一します。

### Tailwind CSS v4ポリシー

- このリポジトリはTailwind CSS v4系を基準とします。スタイルはCSSファースト構成を採用し、`@import "tailwindcss";` と `@theme` / `@utility` / `@variant` を使ってカスタマイズしてください。従来の `@tailwind base;` などv3専用ディレクティブや`bg-opacity-*`系ユーティリティは使用禁止です。
- 別CSS（Vue SFCの`<style>`やCSS Modules）で`@apply`を使う場合、必ず`@reference`でグローバルスタイルを参照し、コンパイラがv4テーマを解決できるようにします。`@layer`ではなく`@utility`に載せ替え、`not-*`や`starting:*`などv4の新バリアントを優先的に使ってください。
- 既存コードにv3シンタックスが混在しないよう、PRではTailwind v4チェックリストを確認し、CIで`npx @tailwindcss/upgrade --verify`（Node 20+）を実行して差分を検証します。クラス名の`!`サフィックスや`not-focus-visible:`などv4固有表現が壊れていないかも併せて確認します。
- 開発やコードレビューの前に、Context7（`/tailwindlabs/tailwindcss`ライブラリ）または公式ドキュメントから最新v4ガイドを取り込み、エージェントが共有プロンプトに貼り付けてから作業を開始してください。これにより旧バージョン知識での提案を防ぎます。

## テストガイドライン

現状の自動テストは型検証とESLintが中心です。UIロジックにテストを追加する場合はVue Test Utilsとmswを利用し、HTTP通信は`src/features/<feature>/mock`のハンドラを再利用してください。テストファイルは対象モジュール近くに`*.spec.ts`として配置し、シナリオ単位で命名します。アクセシビリティ回帰を防ぐため、主要なフォーム・ダイアログでは`vue-axe`を併用した手動検証を行ってください。

## コミットとPull Requestガイドライン

コミットメッセージは`feat`, `fix`, `chore`, `refactor`などのConventional Commitsを踏襲し、内容を日本語または英語で簡潔に表現します。複数変更を含む場合は論理単位でコミットを分割してください。PRでは概要、動機、確認手順（`npm run dev`や`npm run build`など）、必要に応じてスクリーンショットと関連Issue番号を記載します。APIスキーマを変更した場合は生成されたクライアント差分を必ず含め、レビュアーが追跡できるようにしてください。

## APIクライアントと設定

`openapitools.json`と`scripts/generate-apis.ts`が生成プロセスを管理しているため、API仕様更新時はまずスキーマを同期し`npm run gen-api`を実行します。`public/mockServiceWorker.js`はMSWのワーカーであり、変更が必要な場合は`npx msw init public/ --save`で再生成してください。環境変数は`.env.local`を用い、Vueの公開設定は`VITE_`プレフィックスを付与します。
