# Track Specification: Search Select Review Fixes

## Overview

This track addresses several review comments and bugs identified in the new `SearchSelect` and `SearchMultiSelect` components. The goal is to improve accessibility, type safety, and user experience.

## Objectives

- Fix keyboard interaction issues in `SearchMultiSelect`.
- Refactor `hasValue` logic to be more component-specific.
- Improve search filtering by allowing raw queries to be passed to custom filter functions.
- Simplify components by removing unused features like `resetOnSelect`.
- Improve visual layout of the search input.

## Key Changes

### Accessibility and Keyboard Interaction

- Removed redundant `role="button"` and `tabindex="0"` from the wrapper div in `SearchMultiSelect`.
- Allowed space characters to be entered in the search field without triggering selection by removing obstructive keydown handlers on the wrapper.

### State Management and Logic

- Decoupled `hasValue` from `useSearchSelect` to allow different definitions for single and multi-select components.
- Modified `useSearchSelect` to pass the original search term (not lowercased) to the `filterFunction` to allow for case-sensitive filtering if desired.

### Component Refinement

- Removed `resetOnSelect` feature as it was determined to be unnecessary and counter-intuitive for most use cases.
- Stopped resetting the search term when the dropdown is closed or when an item is selected.
- Cleaned up unused emits and event handlers.

### Visual Polish

- Updated the search input's minimum width to `min-w-12` to ensure a consistent and usable layout even when multiple tags are present.

## Verification Plan

- [x] Automated unit tests for `SearchSelect`, `SearchMultiSelect`, and `useSearchSelect`.
- [x] Manual verification of keyboard interaction (Space key in search field).
- [x] Manual verification of search filtering behavior.
- [x] Visual check of the input layout with multiple tags.
