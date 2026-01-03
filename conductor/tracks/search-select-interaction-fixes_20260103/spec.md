# Track Specification: Fix SearchSelect Interaction Bugs

## Overview

Fix interaction bugs and UX issues in `SearchSelect` and `SearchMultiSelect` components regarding focus behavior and clickable areas.

## Objectives

- Ensure clicking `MagnifyingGlassIcon` focuses the input and opens the menu.
- Ensure `ChevronDownIcon` area has appropriate cursor style and click behavior.
- Fix the issue where clicking the top padding of `SearchMultiSelect` focuses the input but fails to open the options list.

## Scope

- `src/components/shared/SearchSelect/SearchSelect.vue`
- `src/components/shared/SearchSelect/SearchMultiSelect.vue`

## Detailed Requirements

1. **MagnifyingGlassIcon**:
   - Make the icon wrapper clickable.
   - Clicking it should trigger the same behavior as clicking the input container (focus + open).
2. **ChevronDownIcon**:
   - Verify and fix cursor styles for the button wrapper.
3. **SearchMultiSelect Layout**:
   - Adjust the click handler on the container div to ensure it consistently opens the menu even when clicking empty space/padding.
