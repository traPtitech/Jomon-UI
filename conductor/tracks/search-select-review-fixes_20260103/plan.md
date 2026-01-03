# Track Plan: Search Select Review Fixes

## Phase 1: Fix Keyboard Interaction in SearchMultiSelect [checkpoint: 7d1ab21]

- [x] Task: Remove obstructive accessibility attributes and handlers [verified]
  - [x] Remove `role="button"`, `tabindex="0"`, and `@keydown.space.prevent` from the wrapper div in `SearchMultiSelect.vue`. [verified]
  - [x] Add `eslint-disable-next-line vuejs-accessibility/no-static-element-interactions` to the wrapper div to suppress lint errors while maintaining desired mouse behavior. [verified]
- [x] Task: Verify fix with tests [verified]
  - [x] Run existing tests to ensure no regression. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Fix Keyboard Interaction in SearchMultiSelect' (Protocol in workflow.md) [7d1ab21]

## Phase 2: Refactor hasValue Logic [checkpoint: 6d0f420]

- [x] Task: Decouple hasValue from useSearchSelect [verified]
  - [x] Remove `hasValue` computed property from `src/components/shared/SearchSelect/composables/useSearchSelect.ts`. [verified]
  - [x] Implement `hasValue` in `SearchSelectBase.vue`: `computed(() => model.value !== null)`. [verified]
  - [x] Implement `hasValue` in `SearchMultiSelect.vue`: `computed(() => model.value.length > 0)`. [verified]
- [x] Task: Verify with tests [verified]
  - [x] Run unit tests to ensure label floating behavior is correct. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 2: Refactor hasValue Logic' (Protocol in workflow.md) [6d0f420]

## Phase 3: Minor Cleanup [checkpoint: 6d0f420]

- [x] Task: Refactor inline handlers [verified]
  - [x] Move inline `@after-leave` handler logic to a named method `handleAfterLeave` in both components. [verified]
- [x] Task: Final Polish [verified]
  - [x] Run lint and format. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 3: Minor Cleanup' (Protocol in workflow.md) [6d0f420]

## Phase 4: Additional Review Fixes [checkpoint: 313bb75]

- [x] Task: Fix query case sensitivity in filterFunction [verified]
  - [x] Pass raw query to `filterFunction` in `useSearchSelect.ts`. [verified]
- [x] Task: Remove unused close emit in SearchSelectTag [verified]
  - [x] Remove `@close` listener and corresponding emit in `SearchSelectTag.vue`. [verified]
- [x] Task: Remove search term reset on selection [verified]
  - [x] Remove `resetOnSelect` prop and watch logic from `SearchMultiSelect.vue`. [verified]
  - [x] Update tests in `SearchMultiSelect.spec.ts` to expect search term retention. [verified]
- [x] Task: Improve input layout [verified]
  - [x] Update input width class to `min-w-12` for better spacing. [verified]
- [x] Task: Finalize behavior [verified]
  - [x] Remove search term reset on close event in `SearchMultiSelect.vue`. [verified]
- [x] Task: Conductor - User Manual Verification 'Phase 4: Additional Review Fixes' (Protocol in workflow.md) [313bb75]
