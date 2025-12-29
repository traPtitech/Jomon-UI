# Specification: Evaluate and Prototype SearchSelect Libraries

## Overview

The goal of this track is to evaluate and select the best library for implementing `SearchSelect` and `SearchMultiSelect` components. The current custom implementation using Zag is proving difficult to maintain, so we are exploring alternatives: Headless UI, Reka UI, and potentially refining the Zag implementation.

## Objectives

1.  **Evaluate Candidates:** Analyze Zag, Headless UI, and Reka UI based on:
    - Support for searchable selection (filtering options).
    - Customizability of design.
    - Type safety.
    - Ease of implementation.
    - Bundle size impact.
2.  **Prototype Implementation:** Implement `SearchSelect` and `SearchMultiSelect` prototypes using each candidate library.
    - Components must be separated (`SearchSelect` and `SearchMultiSelect`) for better type safety.
    - Breaking changes from the current implementation are acceptable.
3.  **Comparison & Selection:** Compare the prototypes and select the best library for the final implementation.

## Requirements

- **Search Functionality:** Users must be able to filter options by typing.
- **Design Customization:** The library must allow full control over the visual styling (using Tailwind CSS).
- **Type Safety:** Strong TypeScript support is required.
- **Separation of Concerns:** Distinct components for single and multiple selection.

## Candidates

- **Zag:** Current library. Low-level state machine. High control but high boilerplate.
- **Headless UI:** Unstyled, accessible UI components for Vue. Good integration with Tailwind.
- **Reka UI:** (Formerly Radix Vue?) Unstyled, accessible components.

## Deliverables

- Analysis report (in `plan.md` or separate doc).
- Functional prototypes for `SearchSelect` and `SearchMultiSelect` for each candidate.
- Final recommendation and selection.
