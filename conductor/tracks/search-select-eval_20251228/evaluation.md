# Evaluation Report: SearchSelect Implementation

## Overview

We evaluated three libraries for implementing `SearchSelect` and `SearchMultiSelect` components in Jomon-UI: **Zag (current)**, **Headless UI**, and **Reka UI (v2)**.

The goal was to improve maintainability, visual consistency with `BaseInput`, and type safety.

## Comparison Matrix

| Feature              | Zag (Existing)             | Headless UI            | Reka UI (v2)              |
| :------------------- | :------------------------- | :--------------------- | :------------------------ |
| **Boilerplate**      | High (State machine logic) | Low (Component-based)  | Medium (High composition) |
| **Tailwind Support** | Excellent (Headless)       | Excellent (Headless)   | Excellent (Headless)      |
| **Type Safety**      | Complex (Manual mapping)   | Good (Stable generics) | Good (Stable generics)    |
| **Complexity**       | High                       | Low                    | Medium                    |
| **Accessibility**    | Built-in                   | Built-in               | Built-in                  |

## Key Findings

### 1. Zag (Current Implementation)

- **Strengths:** Maximum control over state machine behavior.
- **Weaknesses:** Requires a lot of boilerplate to connect the machine to Vue components. Type safety for generic `TValue` keys is difficult to maintain because Zag's internal collection logic prefers string keys, necessitating constant serialization/deserialization.

### 2. Headless UI (`@headlessui/vue`)

- **Strengths:** Very simple API. Works well with Vue 3.4+ `generic` SFC attributes.
- **Weaknesses:** Lacks declarative control for certain behaviors (e.g., "open on focus"), requiring imperative workarounds like DOM-level `.click()` triggers. Type definitions for some components are restrictive, requiring `v-bind` objects to pass standard HTML attributes without type errors.

### 3. Reka UI (`reka-ui` / v2)

- **Strengths:** Powerful composition via `as-child`. Provides declarative APIs for state control (e.g., `v-model:open`), avoiding implementation-dependent hacks. Excellent for building highly custom UI primitives.
- **Weaknesses:** Initial setup with Vue's generic SFC and `defineModel` was complex and required careful implementation to avoid type inference collapse. The composition model requires more boilerplate than Headless UI but less than Zag.

## Final Recommendation

(Final selection pending verification of Reka UI implementation details.)

### Criteria for Selection:

1.  **Maintainability:** Headless UI is simpler, but Reka UI offers cleaner, more declarative control.
2.  **Stability:** Reka UI's use of official props for state control is more robust than Headless UI's imperative workarounds.
3.  **Type Safety:** Both can achieve high type safety, though Reka UI's implementation is currently more refined in terms of declarative logic.
4.  **Visual Match:** Both libraries successfully matched the design of `BaseInput`.

## Implementation Details

The prototypes in `src/components/shared/SearchSelect/` demonstrate the structure for each candidate. They include:

- `MagnifyingGlassIcon` as a prefix.
- Floating label support.
- Proper handling of disabled/required states.
- Clean single and multiple selection logic.
- 100% type safety (verified by `vue-tsc`).
