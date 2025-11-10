# BaseInput リファクタリング設計メモ

## 背景

- `src/components/shared/BaseInput.vue` は `defineModel<string | number | null>` で 3 種類の型を同居させており、`type="number"` のときだけ `null` と数値変換を手動で扱っている。
- 呼び出し元はタイプ別に `string` (タイトル、名前、検索条件など) と `number | null` (金額入力) が明確に分かれており、現在の実装は型ガードと `props.type` の条件分岐が集中している。
- Vue 3.4 以降のベストプラクティスでは `defineModel` を用途ごとに型付けし、UI シェルと値変換を分離してメンテ性と型安全性を高めることが推奨されている。この方針に従い、入力タイプごとの責務を分割する。

## 課題整理

1. **型安全性不足**: すべての利用箇所で `string | number | null` 型が伝播し、`v-model` 呼び出し元で型ガードが必要になる。IDE 補完も不明瞭。
2. **責務過多**: ラベル・フォーカス制御と値変換ロジックが 1 コンポーネントに同居し、textarea・number などの挙動分岐が増え拡張が難しい。
3. **テストしづらさ**: 値変換と UI のロジックが密結合のため、種類ごとのユニットテストを切り出しにくい。

## ゴール

- `string` 入力と `number | null` 入力で `v-model` の型を静的に保証する。
- ラベル・枠線・フォーカスなどの UI シェルを共有化し、タイプ差分は薄いラッパーで隠蔽する。
- 今後 `textarea` や `search select` など追加拡張が容易な構造にする。

## 検討した案

| 案                                     | 内容                                                                                                | メリット                                           | デメリット                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| A. 現状維持で `props.type` を列挙型化  | 既存実装に `type` ユニオン (text/number/textarea) を導入                                            | 変更規模が最小                                     | 型安全性は改善せず、`defineModel` の型問題が残る             |
| B. `BaseInput` をジェネリック化        | `<BaseInput v-model="string" mode="text" />` と `<BaseInput<number                                  | null> ...>`                                        | API は 1 つで済む                                            | Vue SFC ではコンポーネントごとのジェネリックが定義しづらく、利用側の記述が冗長 |
| **C. UI シェル + 型別ラッパー (推奨)** | `BaseInputFrame` で見た目とラベル制御を共通化し、`BaseTextInput`/`BaseNumberInput` が型付きでラップ | `defineModel` を用途別に固定でき、Props もシンプル | コンポーネントが増えるが、責務分離によりトレードオフは小さい |

## 推奨アーキテクチャ (案C)

```
src/components/shared/
  BaseInputFrame.vue   # ラベル、枠線、slot を含む純粋な UI コンテナ
  BaseTextInput.vue    # string v-model + text/textarea 切り替え
  BaseNumberInput.vue  # number|null v-model + 数値変換
```

### BaseInputFrame.vue

- Props: `label`, `required`, `readonly`, `placeholder`, `isTextarea`, `floating`, `errorMessage` など。
- Slot: `default` (実際の `<input>` / `<textarea>`)、`suffix` (アイコンやボタン) を想定。
- ロジック: フォーカス時のスタイル制御、必須表示、ARIA ラベル付与。
- ベストプラクティス: UI レイヤとデータ変換を分割し、Wrapper コンポーネントから `expose()` でフォーカス制御を提供。

### BaseTextInput.vue

- `defineModel<string>({ required: true })`。
- Props: `label`, `required`, `placeholder`, `readonly`, `inputmode`, `textarea` (bool), `rows`, `maxlength`。
- 実装: `<BaseInputFrame>` 内で `<input type="text">` または `<textarea>` を描画。`textarea` 指定時も `string` 型を維持。
- イベント: `focus`, `blur`, `keydown`, `input` をそのまま透過。

### BaseNumberInput.vue

- `defineModel<number | null>({ required: true })`。
- Props: `label`, `required`, `placeholder`, `readonly`, `min`, `max`, `step`, `allowEmpty`。
- 変換: `handleInput` で `target.value` を `'' → null`、それ以外を `Number()` し、`Number.isNaN` の場合は `null` もしくは直前値を保持。
- アクセシビリティ: `inputmode="decimal"` / `aria-valuemin` などを設定し、スクリーンリーダー向けヒントを `aria-description` で提供。
- ベストプラクティス: 数値入力は常に `number | null` として扱い、`step` のデフォルト (例: `1`) と `min=0` は props から制御してマジックナンバーを避ける。

### SearchSelect / MarkdownTextarea などの連携

- `SearchSelect` など独自入力は `BaseInputFrame` を直接利用し、独自の `v-model` ロジックを持つことで過剰なラッパーを避ける。
- `MarkdownTextarea` は `BaseTextInput` の `textarea` モードを利用するか、より高度なカスタムが必要なら `BaseInputFrame` へ移行。

## マイグレーション計画

1. **段階 1**: `BaseInputFrame.vue` を追加し、既存 `BaseInput` から見た目ロジックを抽出。
2. **段階 2**: `BaseTextInput.vue`/`BaseNumberInput.vue` を新規追加。既存 `BaseInput` は一時的にこれらを内部で使用するアダプターとして残し、互換 API を提供 (Deprecated コメントを追加)。
3. **段階 3**: 各利用箇所を型に応じて置き換え。
   - Text 系: `NewApplicationPage`, `NewPartitionPage`, `ApplicationTitle`, `ApplicationFilters` など。
   - Number 系: `NewApplicationTargets`, `ApplicationTarget` など。
4. **段階 4**: すべて置き換え完了後に旧 `BaseInput.vue` を削除。

## リスクと対策

- **スタイル差異**: Frame 抽出時に Tailwind クラスの重複が発生する恐れ → `@apply` や共通クラスを導入して回帰を防ぐ。
- **イベント透過漏れ**: 新ラッパーで `v-on="$attrs"` を forward し、`defineOptions({ inheritAttrs: false })` を活用。
- **SearchSelect 等の Slot 互換性**: Slot 名と構造 (`default` のみ) を維持するか、置換先コンポーネントで `slot` を再配置する。

## 今後の拡張

- `BaseInputFrame` にエラー表示 (`errorMessage` prop) や `description` slot を追加し、フォームバリデーションの UI を統一。
- `useInputFocus()` のような composable でフォーカス状態を共有すれば、さらに薄い UI コンポーネントに分割可能。
- 数値入力に `formatOnBlur` (`1_000` → `1,000`) 等のフォーマッタを注入するための `formatter` / `parser` props を用意すると柔軟性が高まる。

## 未解決事項 / 要確認

- `SearchSelect` などが `BaseInput` の slot 構造に依存しているため、直接置き換えるか `BaseInputFrame` を局所的に利用するかを決める必要がある。
- `MarkdownTextarea` は行数制御やマークダウン支援 UI を持つため、`BaseTextInput` の `textarea` モードで十分か検証。
- 既存の E2E/手動確認手順 (vue-axe を用いたアクセシビリティ確認) を再実施し、ラベル‐入力の関連付け (`for`/`id`) が保たれているか確認する。
