# Reka UI Type Inference Analysis

## Issue: `v-model` Type Leakage in SearchSelect / SearchMultiSelect

### Phenomenon

When using `SearchMultiSelect` with `v-model="string[]"`, a type error occurs indicating that `string | string[]` cannot be assigned to `string[]`. This issue cascades to multiple usage points such as `AccountManagerPage`, `ApplicationFilters`, and `SearchSelectTag`.

### Root Cause

1.  **Reka UI Definition**: The `ComboboxRoot` / `ListboxRoot` components in Reka UI define their `modelValue` prop as `T | T[]`. This union type exists regardless of the `multiple` prop state.
2.  **Vue SFC Inference**: Vue's SFC template type inference allows child component prop types to influence the parent's `v-model` type inference. Consequently, `SearchMultiSelect`'s internal use of `ComboboxRoot` causes its `modelValue` to broaden to `T | T[]`.
3.  **Result**: The parent component sees `v-model` as `string | string[]` instead of the expected `string[]`, causing a mismatch with the reactive variable.

### Attempted Solutions (Ineffective)

- **`defineModel<T[]>`**: Even with explicit definition, the template inference mixes `T | T[]` from the child component, failing to resolve the issue.
- **Module Augmentation**: Attempting to genericize `ComboboxRoot` via augmentation failed because SFC templates cannot specify type arguments for components, leading to `unknown` leakage.
- **`@vue-generic`**: Effective for the generic SFC itself but had limited effect on the external library components.

### Implemented Workaround (Effective)

The solution involves isolating the internal Reka UI components from Vue's template type inference mechanism.

1.  **Strict Public API**: `SearchSelect` and `SearchMultiSelect` explicitly define their public API using `defineModel` with `required: true`, preventing `undefined` injection.
2.  **Type Inference Blockade**: Inside the template, `ComboboxRoot` is cast to `DefineComponent<Record<string, any>>` (or similar loose type) to sever the type inference link.
    - This treats `ComboboxRoot` as an opaque component during type checking.
    - The outer `modelValue` / `update:modelValue` types are enforced by the `SearchSelect` / `SearchMultiSelect` definitions, maintaining type safety at the component boundary.

### Result

- Linting, type-checking, and unit tests pass.
- All `v-model` usages are correctly inferred as `string | null` (single) or `string[]` (multiple).
- The leak of `string | string[]` union type is eliminated.
