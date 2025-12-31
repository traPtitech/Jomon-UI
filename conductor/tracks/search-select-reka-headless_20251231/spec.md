# Track Specification: Resolve Type Safety Issues in SearchSelect and Compare Reka UI vs Headless UI

## Overview

Current `SearchSelect` and `SearchMultiSelect` components implemented with Reka UI require aggressive type casting workarounds to satisfy Vue's type inference for `v-model`. This track aims to document the current issues and implemented workarounds for Reka UI, and parallelly implement equivalent components using Headless UI. The goal is to perform a comprehensive comparison by integrating both solutions into the actual application (replacing current usages) to determine the best long-term solution.

## Functional Requirements

1.  **Documentation of Reka UI Issues:**
    - Document the "string | string[]" type leakage issue caused by Reka UI's `ComboboxRoot` / `ListboxRoot` model value definitions.
    - Document the specific workaround applied (casting `ComboboxRoot` to `DefineComponent<Record<...>>` to block internal type inference).
    - Verify and document that current Reka UI implementation passes lint, type-check, and unit tests.

2.  **Headless UI Implementation:**
    - Implement `SearchSelect` (single) and `SearchMultiSelect` (multiple) using Headless UI.
    - Ensure feature parity with the current Reka UI implementation.

3.  **Integration & Verification:**
    - Integrate the Headless UI implementation into **all existing usage points** in the application (e.g., `AccountManagerPage`, `ApplicationFilters`, `SearchSelectTag`, etc.).
    - Verify that `v-model` type inference works correctly without aggressive workarounds.
    - Ensure no functionality regressions occur after integration.

4.  **Comparison & Selection:**
    - Compare Reka UI and Headless UI implementations based on:
      - **Type Safety:** Compatibility with Vue 3's type inference (generics, multiple prop).
      - **Accessibility (A11y):** Compliance with standard accessibility patterns.
      - **Customizability:** Ease of styling and extending.
      - **Maintainability:** Code complexity and need for hacks/workarounds.
    - Decide on the final library to adopt.

## Non-Functional Requirements

- **Code Quality:** The selected implementation must pass strict type checking (`vue-tsc`) without `any` casts or `ts-ignore` unless absolutely necessary and documented.
- **Prohibit Type Assertions:** Prohibit the use of type assertions (`as Type`, `<Type>`) as a general rule. Types must be handled through proper inference, guards, or generic definitions.
- **Prohibit Lint Disabling:** Prohibit the use of `eslint-disable` comments as a general rule. Any linting issues should be resolved by fixing the code or updating the global configuration if appropriate.
- **Testing:** Existing unit tests should pass (or be updated to pass) with the new implementation.

## Acceptance Criteria

- [ ] A document summarizing the Reka UI type issues and the applied workaround is created (can be part of the final report).
- [ ] `SearchSelect` and `SearchMultiSelect` are implemented using Headless UI.
- [ ] Headless UI implementation is integrated into all actual usage points in the app and verified to work.
- [ ] A comparison report (covering Type Safety, A11y, Customizability, Maintainability) is created.
- [ ] A final decision on which library to use is made.
- [ ] The codebase reflects the chosen library (unused implementation is removed or archived).

## Out of Scope

- Bundle size optimization (considered negligible).
- Searching for other alternative UI libraries (Reka and Headless are the only candidates).
