# Track Specification: Fix focus loss after removing tag in SearchMultiSelect

## Overview

When a user clicks the "x" button on a tag in `SearchMultiSelect`, the tag is removed from the DOM. Since the button that was clicked disappears, the browser loses focus on the component. This track fixes this by ensuring the focus moves to the search input after removal.

## Objectives

- Maintain focus within the component after a tag is removed.
- Improve test coverage for focus behavior during interactions.

## Key Changes

- Update `removeTag` in `SearchMultiSelect.vue` to call `.focus()` on the input.
- Add/Update unit tests to verify `document.activeElement` after tag removal.
