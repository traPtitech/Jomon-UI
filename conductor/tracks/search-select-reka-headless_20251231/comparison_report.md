# Comparison Report: Reka UI vs Headless UI for SearchSelect

## Executive Summary

After implementing and evaluating both Reka UI and Headless UI versions of the `SearchSelect` and `SearchMultiSelect` components, **Headless UI is recommended** for adoption in Jomon UI.

Headless UI provides a more type-safe and maintainable solution, resolving the critical `v-model` type inference issues encountered with Reka UI without requiring aggressive workarounds.

## Detailed Comparison

| Criteria            | Reka UI                                                                                     | Headless UI                                                                                              | Winner                                                                                                                                                                                     |
| :------------------ | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **Type Safety**     | **Problematic.** `ComboboxRoot`'s generic definition causes `v-model` type leakage (`string | string[]`), requiring `DefineComponent` casting hacks to block inference.                                | **Excellent.** Works seamlessly with Vue 3's `defineModel` and generics. No type leakage observed. Minor `vue-tsc` issues with HTML attributes were easily resolved using `as="template"`. | **Headless UI** |
| **Accessibility**   | **Good.** Comprehensive ARIA support.                                                       | **Good.** Automatic management of ARIA attributes (`aria-expanded`, `aria-activedescendant`).            | **Draw**                                                                                                                                                                                   |
| **Customizability** | **High.** Granular sub-components (`ComboboxPortal`, etc.).                                 | **High.** `as` prop and `as="template"` allow for flexible rendering. Transitions are easy to integrate. | **Draw**                                                                                                                                                                                   |
| **Maintainability** | **Low.** The type casting workaround introduces complexity and risk.                        | **High.** Clean implementation code. Standard usage patterns.                                            | **Headless UI**                                                                                                                                                                            |
| **Integration**     | **Moderate.** Requires `reka-ui` dependency and specific setup.                             | **High.** Easy to integrate into existing Vue 3 setup.                                                   | **Headless UI**                                                                                                                                                                            |

## Key Findings

### 1. The Type Inference Issue

The primary driver for this investigation was a type error where Reka UI's `ComboboxRoot` forced the parent's `v-model` to infer a union type (`T | T[]`) regardless of the `multiple` prop. This caused cascading type errors throughout the application (`AccountManagerPage`, etc.).

**Reka UI Workaround:**

```typescript
const ComboboxRootUnsafe = ComboboxRoot as unknown as DefineComponent<...>
```

This workaround effectively disables type checking for the root component to prevent the leak, which is risky and non-idiomatic.

**Headless UI Solution:**
Headless UI's `Combobox` correctly respects the `multiple` prop and generic type arguments, allowing Vue's inference to work as expected without any hacks.

### 2. Implementation Experience

Headless UI's API is slightly more concise. The handling of the `display-value` prop required some attention (using an inline function to handle open/closed states), but it provided a robust way to control the input's display text. The `as="template"` pattern proved very useful for applying standard HTML attributes to the underlying input element without type errors.

### 3. Migration Path

The migration to Headless UI has already been performed in the codebase as part of the verification process. All existing tests pass, and new tests covering Headless UI specifics (including menu state and filtering) have been added.

## Recommendation

**Adopt Headless UI.**
The current implementation in `src/components/shared/SearchSelectHeadless` should be finalized as the canonical `SearchSelect` components. The Reka UI implementation should be removed.
