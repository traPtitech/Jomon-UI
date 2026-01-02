# Track Plan: Resolve Type Safety Issues and Compare UI Libraries

## Phase 1: Reka UI Documentation & Baseline Verification [checkpoint: 1b5d0b3]

- [x] Task: Document Reka UI Issues and Workarounds [caaa646]
  - [ ] Create a markdown file (e.g., `conductor/tracks/search-select-reka-headless_20251231/reka_ui_analysis.md`) summarizing the "string | string[]" type leakage and the specific `DefineComponent` cast workaround used.
- [x] Task: Verify Baseline Stability [verified]
  - [ ] Run `npm run type-check` to confirm the current Reka UI implementation passes without errors.
  - [ ] Run `npm run lint` to confirm no lint errors.
  - [ ] Run unit tests to confirm current functionality.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Reka UI Documentation & Baseline Verification' (Protocol in workflow.md) [1b5d0b3]

## Phase 2: Headless UI Implementation & Integration [checkpoint: 7fe8247]

- [x] Task: Scaffold Headless UI Components [verified]
  - [ ] Create `src/components/shared/SearchSelectHeadless/` directory.
  - [ ] Install `@headlessui/vue` (if not already installed).
- [x] Task: Implement SearchSelect (Headless UI) [verified]
  - [x] Sub-task: Write Comprehensive Tests for Headless SearchSelect. [fc75114]
    - **CRITICAL:** Reference the existing Reka UI `SearchSelect.spec.ts` to ensure all functionality and edge cases are covered.
  - [x] Sub-task: Implement `SearchSelect` using Headless UI `Combobox` / `Listbox`. [verified]
  - [x] Sub-task: Verify Type Safety (ensure no assertions/lint disables needed). [verified]
- [x] Task: Implement SearchMultiSelect (Headless UI) [verified]
  - [x] Sub-task: Write Comprehensive Tests for Headless SearchMultiSelect. [verified]
    - **CRITICAL:** Reference existing tests to ensure parity in features like multiple selection, tag removal, and filtering.
  - [x] Sub-task: Implement `SearchMultiSelect` using Headless UI. [verified]
  - [x] Sub-task: Verify Type Safety (v-model array handling). [verified]
- [x] Task: Full Integration Verification [verified]
  - [x] Replace `SearchSelect`/`SearchMultiSelect` imports in all usage points (`AccountManagerPage`, `ApplicationFilters`, `SearchSelectTag`, etc.) with the Headless UI versions. [verified]
  - [x] Run `npm run type-check` to verify integration type safety. [verified]
  - [x] Run application and verify behavior manually. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 2: Headless UI Implementation & Integration' (Protocol in workflow.md) [7fe8247]

## Phase 3: Comparison & Final Decision [verified]

- [x] Task: Create Comparison Report [verified]
  - [x] Create `conductor/tracks/search-select-reka-headless_20251231/comparison_report.md`. [verified]
  - [x] Compare Reka UI vs Headless UI based on: [verified]
    - Type Safety (Cleanliness of implementation, avoidance of workarounds)
    - Accessibility (A11y audits based on standard patterns)
    - Customizability (Ease of styling and component structure)
    - Maintainability (Overall code quality and clarity)
- [x] Task: Select Final Library [verified]
  - [x] Review report and decide on the winner. [verified]
  - [x] Record decision in the report. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 3: Comparison & Final Decision' (Protocol in workflow.md) [verified]

## Phase 4: Finalize Codebase [checkpoint: 7056ef3]

- [x] Task: Apply Final Selection [verified]
  - [x] If Headless UI wins: Clean up Reka UI components and rename Headless components to main names. [verified]
  - [x] If Reka UI wins: Revert integration changes, keeping Headless UI code in a reference/archive folder or deleting it, and document why Reka was chosen despite the workaround. [skipped]
  - [x] Ensure `src/components/shared/` reflects the final choice. [verified]
- [x] Task: Final Quality Check [verified]
  - [x] Run full test suite, lint, and type-check one last time. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 4: Finalize Codebase' (Protocol in workflow.md) [075e625]

## Phase 5: Code Review Refactoring [checkpoint: bdf2558]

- [x] Task: Refactor SearchSelect components based on review [verified]
  - [x] Sub-task: Centralize `SearchSelectOption` type definition in `types.ts`. [verified]
  - [x] Sub-task: Sync `open` state in `useSearchSelect` via `OpenStateEmitter` integration. [verified]
  - [x] Sub-task: Implement `resetOnSelect` logic in `SearchMultiSelect.vue`. [verified]
  - [x] Sub-task: Improve `isTValue` type guard. [verified]
  - [x] Sub-task: Verify changes with existing tests and add new tests for `resetOnSelect`. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 5: Code Review Refactoring' (Protocol in workflow.md) [bdf2558]

## Phase 6: Additional Improvements [checkpoint: 87a6114]

- [x] Task: Address additional code review feedback [verified]
  - [x] Sub-task: Fix `TransitionRoot` usage in `SearchSelect.vue` and `SearchMultiSelect.vue` (pass `:show="open"`). [verified]
  - [x] Sub-task: Improve `hasValue` computed property in `useSearchSelect.ts` to handle `undefined`. [verified]
  - [x] Sub-task: Simplify input event handling in `SearchMultiSelect.vue` (remove redundant `v-model` on inner input or `@change` on ComboboxInput). [verified]
  - [x] Sub-task: Verify changes with tests. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 6: Additional Improvements' (Protocol in workflow.md) [87a6114]

## Phase 7: Review Feedback Implementation [checkpoint: b105ff8]

- [x] Task: Unify input event handling in `SearchMultiSelect.vue` [verified]
  - [x] Remove `v-model` from inner input and rely on `ComboboxInput` `@change`. [verified]
  - [x] Ensure `value` binding is correct. [verified]
- [x] Task: Enhance `resetOnSelect` logic [verified]
  - [x] Modify `watch` to clear search term on any model change (length change or value replacement) if `resetOnSelect` is true. [verified]
- [x] Task: Safely reconstruct Tags in `SearchSelectTag.vue` [verified]
  - [x] Update `resolveTags` to preserve existing Tag objects from `model` to avoid data loss. [verified]
- [x] Task: Optimize open triggers [verified]
  - [x] Remove `@click` handler from inputs in `SearchSelect.vue` and `SearchMultiSelect.vue`, relying on `@focus` (and button click) to avoid redundancy. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 7: Review Feedback Implementation' (Protocol in workflow.md) [b105ff8]

## Phase 8: Component Separation and Refinement [checkpoint: 8e9a245]

- [x] Task: Split SearchSelect into Required and Nullable versions [verified]
  - [x] Create `SearchSelectNullable.vue` based on current `SearchSelect.vue`. [verified]
  - [x] Modify `SearchSelect.vue` to be non-nullable (remove `nullable` prop from Combobox, restrict generic T). [verified]
  - [x] Update usages: Check each usage of `SearchSelect` and switch to `SearchSelectNullable` if `null` is allowed/expected. [verified]
- [x] Task: Fix HTML Structure in ComboboxOptions [verified]
  - [x] Change "No results" `div` to `li` in all SearchSelect components. [verified]
- [x] Task: Refactor Input Handling in SearchMultiSelect [verified]
  - [x] Remove `v-model` from inner input and rely purely on `ComboboxInput`'s `displayValue` and `@change`. [verified]
- [x] Task: Improve Focus Styling [verified]
  - [x] Remove manual `isFocused` tracking. [verified]
  - [x] Use CSS `focus-within` for styling the wrapper. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 8: Component Separation and Refinement' (Protocol in workflow.md) [8e9a245]

## Phase 9: Further Refinement [checkpoint: 65dc803]

- [x] Task: Improve focus handling safety [verified]
  - [x] Fix `handleFocusOut` in `SearchSelect.vue`, `SearchSelectNullable.vue`, `SearchMultiSelect.vue` to safely access `$el`. [verified]
  - [x] Refine `buttonRef` type definition to `HTMLButtonElement`. [verified]
- [x] Task: Enhance auto-open behavior [verified]
  - [x] Add `inputRef` and restore focus to input after clicking button programmatically to prevent focus loss. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 9: Further Refinement' (Protocol in workflow.md) [65dc803]

## Phase 10: Final Review Adjustments [checkpoint: c694cda]

- [x] Task: Consolidate Logic and Improve Accessibility [verified]
  - [x] Sub-task: Create `SearchSelectBase.vue` to unify `SearchSelect` and `SearchSelectNullable` implementations. [skipped]
  - [x] Sub-task: Remove `OpenStateEmitter.vue` and move `isFloating` logic to template. [skipped]
  - [x] Sub-task: Add `:disabled` and `:aria-required` attributes to inputs/buttons. [verified]
  - [x] Sub-task: Verify changes with existing tests and add new tests for `resetOnSelect`. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 10: Final Review Adjustments' (Protocol in workflow.md) [c694cda]

## Phase 11: Final Refactoring - Duplication Reduction

- [ ] Task: Reduce duplication between SearchSelect and SearchSelectNullable
  - [ ] Sub-task: Define `SearchSelectCommonProps` in `types.ts`.
  - [ ] Sub-task: Create `SearchSelectBase.vue` implementing the core logic.
  - [ ] Sub-task: Refactor `SearchSelect.vue` to wrap `SearchSelectBase`.
  - [ ] Sub-task: Refactor `SearchSelectNullable.vue` to wrap `SearchSelectBase`.
  - [ ] Sub-task: Verify with tests.
- [ ] Task: Conductor - User Manual Verification 'Phase 11: Final Refactoring - Duplication Reduction' (Protocol in workflow.md)
