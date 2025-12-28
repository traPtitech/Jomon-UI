# Evaluation: SearchSelect Libraries

## Overview
We evaluated three approaches for implementing the `SearchSelect` and `SearchMultiSelect` components:
1.  **Zag (Current):** Low-level state machine (`@zag-js/combobox`).
2.  **Headless UI:** Unstyled Vue components (`@headlessui/vue`).
3.  **Reka UI (Radix Vue):** Unstyled, accessible primitives (`reka-ui`).

## Comparison

| Feature | Zag (Current) | Headless UI | Reka UI |
| :--- | :--- | :--- | :--- |
| **API Simplicity** | Low. Requires machine setup, prop normalization, and context bridging. | **High**. Intuitive `Combobox` component with `v-model`. | Medium. verbose composition (`Root` -> `Portal` -> `Content` ...). |
| **Type Safety** | Medium. Requires manual serialization of keys (strings only). | **High**. Generic support `TValue` works well. | **High**. Generic support. |
| **Styling** | Manual. Full control but boilerplate. | **High**. Easy Tailwind integration. | **High**. Unstyled, granular control. |
| **Accessibility** | High. | High. | **Very High**. Strict adherence. |
| **Positioning** | Manual/Popper. | Built-in (basic) or Portal. | **Built-in**. Uses Popper.js (floating-ui) via `ComboboxPortal`. |
| **Bundle Size** | Moderate (Zag core + Vue adapter). | **Light**. | Moderate (Reka core + Floating UI). |
| **DX (Developer Exp)** | Complex. Boilerplate heavy. | **Excellent**. minimal code for result. | Good, but steep learning curve for structure. |

## Implementation Findings

### Zag
-   **Pros:** Very stable logic, separation of state and view.
-   **Cons:** The "machine" code is verbose. Handling generic types requires a map/serialization layer.
-   **Verdict:** Good if we need complex custom logic not supported by others, but overkill for standard combobox.

### Headless UI
-   **Pros:** Extremely quick to implement. `v-model` works seamlessly for both single and multiple selection. Floating label logic was easy to implement.
-   **Cons:** "Open on focus" required a small workaround (button ref click) as it defaults to toggle. Custom positioning (if needed beyond default absolute) might need `Float` or manual CSS.
-   **Verdict:** Best balance of simplicity and functionality. Matches the existing "Vue + Tailwind" stack perfectly.

### Reka UI
-   **Pros:** Robust positioning (Popper) out of the box. Portal support is first-class. "Smart" features like auto-focus management.
-   **Cons:** Verbose template structure (`Root`, `Anchor`, `Input`, `Trigger`, `Portal`, `Content`, `Viewport`, `Group`, `Item`...). CSS Variable naming changed recently (`radix` -> `reka`), causing some confusion during prototype (fixed).
-   **Verdict:** Powerful, but maybe too verbose for this specific component if Headless UI suffices.

## Recommendation

**Select: Headless UI**

Reasons:
1.  **Simplicity:** The code is significantly cleaner and easier to read than the Zag implementation.
2.  **Existing Dependency:** `@headlessui/vue` is already in `package.json`.
3.  **Maintenance:** Easier for other developers to understand standard Vue components than Zag state machines.
4.  **Performance:** Lightweight and effective.

## Status
Prototypes for all three (Zag Refined, Headless UI, Reka UI) are implemented and available for review at `/comparison`. Design has been aligned across all three.