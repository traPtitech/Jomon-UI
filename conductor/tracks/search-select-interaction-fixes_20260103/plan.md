# Track Plan: Fix SearchSelect Interaction Bugs

## Phase 1: MagnifyingGlassIcon & Chevron Interaction

- [~] Task: Fix MagnifyingGlassIcon click behavior
  - [ ] Add `@click` handler to the `div` wrapping `MagnifyingGlassIcon` in both `SearchSelect.vue` and `SearchMultiSelect.vue`.
  - [ ] Ensure it calls `focusInputAndOpen` (or equivalent).
- [ ] Task: Fix ChevronDownIcon cursor style
  - [ ] Check `ComboboxButton` styling in both components.
  - [ ] Ensure `cursor-pointer` is applied (or implied by button tag).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: MagnifyingGlassIcon & Chevron Interaction' (Protocol in workflow.md)

## Phase 2: SearchMultiSelect Layout & Focus

- [x] Task: Fix container click behavior in SearchMultiSelect [current]
  - [x] Investigate why clicking top padding fails to open menu.
  - [x] Adjust `@mousedown.prevent` or click handlers on the wrapper div.
  - [x] Ensure `focusInputAndOpen` correctly toggles or opens the menu.
- [~] Task: Verify fixes with tests
  - [ ] Add test cases to verify clicking these areas opens the menu.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: SearchMultiSelect Layout & Focus' (Protocol in workflow.md)
