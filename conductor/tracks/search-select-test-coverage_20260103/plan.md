# Track Plan: Improve SearchSelect Test Coverage

## Phase 1: Composable Unit Tests

- [x] Task: Create test file for useSearchSelect [71f350f]
  - [x] Create `tests/components/shared/SearchSelect/composables/useSearchSelect.spec.ts`.
  - [x] Implement tests for `filterFunction` logic.
  - [x] Implement tests for `getLabel` edge cases.
- [x] Task: Create test file for useSearchSelectField [67e3012]
  - [x] Create `tests/components/shared/SearchSelect/composables/useSearchSelectField.spec.ts`.
  - [x] Implement tests for `handleFocusOut` logic (mocking FocusEvent and unrelated targets).
- [x] Task: Verify Composable Coverage [b4a01fb]
  - [x] Run tests and check coverage for composables.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Composable Unit Tests' (Protocol in workflow.md) [b4a01fb]

## Phase 2: Component Interaction Tests

- [x] Task: Add disabled state tests for SearchMultiSelect [3c2c64b]
  - [x] Update `tests/components/shared/SearchSelect/SearchMultiSelect.spec.ts`.
  - [x] Add test case: "does not remove tag when disabled".
  - [x] Add test case: "does not focus input when container clicked while disabled".
- [x] Task: Final Coverage Verification [verified]
  - [x] Run full test suite with coverage enabled.
  - [x] Confirm coverage is >80%.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Component Interaction Tests' (Protocol in workflow.md) [verified]
