# Track Plan: Search Select Review Fixes

## Phase 1: Fix Keyboard Interaction in SearchMultiSelect

- [ ] Task: Remove obstructive accessibility attributes and handlers
  - [ ] Remove `role="button"`, `tabindex="0"`, and `@keydown.space.prevent` from the wrapper div in `SearchMultiSelect.vue`.
  - [ ] Add `eslint-disable-next-line vuejs-accessibility/no-static-element-interactions` to the wrapper div to suppress lint errors while maintaining desired mouse behavior.
- [ ] Task: Verify fix with tests
  - [ ] Run existing tests to ensure no regression.
  - [ ] (Optional) Add a test case to verify space input in the search field if feasible.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Fix Keyboard Interaction in SearchMultiSelect' (Protocol in workflow.md)

## Phase 2: Refactor hasValue Logic

- [ ] Task: Decouple hasValue from useSearchSelect
  - [ ] Remove `hasValue` computed property from `src/components/shared/SearchSelect/composables/useSearchSelect.ts`.
  - [ ] Implement `hasValue` in `SearchSelectBase.vue`: `computed(() => model.value !== null)`.
  - [ ] Implement `hasValue` in `SearchMultiSelect.vue`: `computed(() => model.value.length > 0)`.
- [ ] Task: Verify with tests
  - [ ] Run unit tests to ensure label floating behavior is correct.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Refactor hasValue Logic' (Protocol in workflow.md)

## Phase 3: Minor Cleanup

- [ ] Task: Refactor inline handlers
  - [ ] Move inline `@after-leave` handler logic to a named method `handleAfterLeave` in both components.
- [ ] Task: Final Polish
  - [ ] Run lint and format.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Minor Cleanup' (Protocol in workflow.md)
