# Analysis of Current SearchSelect Implementation

## Overview

The current implementation consists of two main components: `SearchSelect.vue` (single selection) and `SearchMultiSelect.vue` (multiple selection). Both share a common core logic driven by `@zag-js/combobox` state machine.

## Components Structure

- **`SearchSelect.vue`**:
  - Single value selection.
  - Features a floating label pattern.
  - Persists the selected item's label in the input field.
- **`SearchMultiSelect.vue`**:
  - Multiple value selection.
  - Displays selected items as tags _outside_ or _below_ the input field (in the current code, it seems to be below: `div class="mt-2 flex flex-wrap gap-1"`).
  - Input field clears on selection (`resetOnSelect: true`).
- **`useSearchSelectMachine.ts`**:
  - Wraps `@zag-js/vue`'s `useMachine`.
  - Handles reactive options and model value synchronization.
  - Implements "Smart Filtering" to prevent filtering when the input matches the selected value's label (for single select).
  - Maps generic keys (`string | number`) to string keys for Zag's internal logic.
- **Primitives**:
  - The implementation relies on several "Primitive" components (`SearchSelectPrimitiveRoot`, `SearchSelectPrimitiveInput`, etc.) which likely apply the props returned by Zag's API.

## Key Observations

1.  **Complexity**: The Zag implementation requires significant boilerplate (connecting machine, normalizing props, handling collections, mapping keys).
2.  **Type Safety**: While TypeScript is used, the bridge between the generic `TValue` and Zag's string-based values requires manual serialization/deserialization (`safeString`), which introduces a layer of complexity.
3.  **Styling**: Styling is fully custom using Tailwind CSS, applied to the primitive components and the main wrappers.
4.  **Floating Label**: Custom logic determines when the label should "float" based on input value, selection, or focus state.

## Requirements for Candidates

Any replacement library must support:

- **Combobox/Autocomplete**: Filtering options by typing.
- **Controlled State**: Full control over `modelValue` (v-model).
- **Custom Styling**: Must play well with Tailwind CSS (headless/unstyled).
- **TypeScript**: Generic type support for option keys/values.
- **Slots/Render Functions**: Custom rendering for options (e.g., checkmarks, highlighting).
- **Portals/Teleport**: Rendering the dropdown body to avoiding z-index/overflow issues.

## Candidates to Evaluate

1.  **Headless UI (`@headlessui/vue`)**: Known for simplicity and good Tailwind integration. Uses `Combobox` component.
2.  **Reka UI (`reka-ui` / `radix-vue`)**: Unstyled, accessible primitives. Likely `Combobox` or `Select` with search.
3.  **Zag (`@zag-js/vue`)**: The current incumbent. We will re-evaluate if a cleaner implementation is possible or if the complexity is inherent.
