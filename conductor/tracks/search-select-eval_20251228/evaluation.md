# Evaluation Report: SearchSelect Implementation

## Overview

We evaluated three libraries for implementing `SearchSelect` and `SearchMultiSelect` components in Jomon-UI: **Zag (current)**, **Headless UI**, and **Reka UI (v2)**.

The goal was to improve maintainability, visual consistency with `BaseInput`, and type safety.

## Comparison Matrix

| Feature              | Zag (Existing)             | Headless UI            | Reka UI (v2)                 |
| :------------------- | :------------------------- | :--------------------- | :--------------------------- |
| **Boilerplate**      | High (State machine logic) | Low (Component-based)  | Medium (High composition)    |
| **Tailwind Support** | Excellent (Headless)       | Excellent (Headless)   | Excellent (Headless)         |
| **Type Safety**      | Complex (Manual mapping)   | Good (Stable generics) | Fragile (Generic SFC issues) |
| **Complexity**       | High                       | Low                    | Medium                       |
| **Accessibility**    | Built-in                   | Built-in               | Built-in                     |

## Key Findings

### 1. Zag (Current Implementation)

- **Strengths:** Maximum control over state machine behavior.
- **Weaknesses:** Requires a lot of boilerplate to connect the machine to Vue components. Type safety for generic `TValue` keys is difficult to maintain because Zag's internal collection logic prefers string keys, necessitating constant serialization/deserialization.

### 2. Headless UI (`@headlessui/vue`)

- **Strengths:** Very simple API. It is already used in the project, making it a low-risk addition. It works well with Vue 3.4+ `generic` SFC attributes.
- **Weaknesses:** The TypeScript types for `ComboboxInput` do not explicitly include standard HTML attributes like `placeholder` or event handlers, though they fall through at runtime. This required a `v-bind="inputAttrs"` workaround to pass strict `vue-tsc` checks without using `any` or `ts-ignore`.

### 3. Reka UI (`reka-ui` / v2)

- **Strengths:** Powerful composition via `as-child`. Excellent for building highly custom UI primitives while maintaining accessibility.
- **Weaknesses:** During prototyping, we encountered severe type inference issues when combining Reka's complex generic types with Vue SFC's `generic` attribute and `defineModel`. This often resulted in the component type collapsing to `never` in the parent scope. We had to fix the type to `string | number` to achieve stability.

## Final Recommendation

We recommend **Headless UI (`@headlessui/vue`)** for the final implementation of `SearchSelect` and `SearchMultiSelect`.

### Reasons:

1.  **Maintainability:** The implementation is significantly simpler than Zag while providing the same feature set.
2.  **Stability:** It integrates more smoothly with Vue's generic SFC system, allowing us to keep `TValue` flexible for consumers.
3.  **Consistency:** Headless UI is already an established dependency in Jomon-UI.
4.  **Visual Match:** We successfully matched the design of `BaseInput` using Headless UI's unstyled components.

## Implementation Details

The prototypes in `src/components/shared/SearchSelect/` (Headless UI versions) demonstrate the final proposed structure. They include:

- `MagnifyingGlassIcon` as a prefix.
- Floating label support.
- Proper handling of disabled/required states.
- Clean single and multiple selection logic.
- 100% type safety (verified by `vue-tsc`).
