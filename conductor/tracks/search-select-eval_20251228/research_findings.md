# Research Findings: SearchSelect Libraries

## 1. Headless UI (`@headlessui/vue`)

**Capabilities:**

- **Combobox Component:** Fully supports searchable select functionality.
- **Multiple Selection:** Supported via the `multiple` prop. `v-model` binds to an array of selected values.
- **Filtering:** Developer implements the filtering logic (e.g., `computed` property for `filteredPeople`). This is similar to the current implementation but simpler than Zag's machine.
- **Styling:** Completely unstyled. Uses `headlessui` specific components (`Combobox`, `ComboboxInput`, `ComboboxOptions`, etc.) which render as standard HTML elements (or `Fragment`).
- **Type Safety:** Generally strong. Components are generic.
- **Bundle Size:** Generally lightweight.
- **Design Control:** Excellent integration with Tailwind CSS.

**Pros:**

- Simple API.
- Good documentation.
- Already in `package.json`.
- Flexible rendering (can use `displayValue` prop for input display).

**Cons:**

- Might need manual handling for "floating label" logic (detecting focus/value presence), but this is standard Vue.

## 2. Reka UI / Radix Vue (`radix-vue`)

**Capabilities:**

- **Combobox Component:** Also supports searchable select.
- **Multiple Selection:** Supported natively. `v-model` handles arrays.
- **Filtering:** Similar to Headless UI, developer often handles the filtering logic, or it provides a `ComboboxItem` that can be filtered. (Need to verify if it has built-in filtering or relies on `v-for`). _Correction: Radix Vue often handles some filtering or relies on the developer to hide items._
- **Styling:** Unstyled primitives.
- **Accessibility:** Very strong focus on accessibility (WAI-ARIA).

**Pros:**

- Accessibility first.
- Unstyled.
- Granular control.

**Cons:**

- Not currently in `package.json` (would add a dependency).
- API might be slightly more verbose than Headless UI (more primitives).

## Conclusion for Prototyping

Both libraries are viable candidates.

- **Headless UI** is the "low hanging fruit" because it is already a dependency and matches the project's likely stack (Tailwind + Vue).
- **Radix Vue** is a strong contender if accessibility needs are complex or if Headless UI falls short on specific edge cases (e.g., complex popper positioning, though Headless UI has `Float` or uses `Teleport`).

We will proceed with prototyping both to see which DX is better for the specific requirements (Separation of Single/Multi, Custom Styling).
