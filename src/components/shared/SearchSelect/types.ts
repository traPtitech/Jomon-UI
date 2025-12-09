/**
 * Represents an option in a selection list.
 * @template T - The type of the value.
 */
export interface Option<T extends string | number> {
  /** Display label shown in the UI */
  label: string
  /**
   * Unique identifier for the option.
   * Must be unique across the options list.
   * If duplicates exist, behavior (like selection mapping) may be incorrect.
   */
  key: T
  disabled?: boolean
}

export type SearchSelectBaseEmit = {
  (e: 'focus', event: FocusEvent): void
  (e: 'close'): void
  (e: 'search-input', value: string): void
}

export type SearchSelectEmit<T> = SearchSelectBaseEmit & {
  (e: 'update:modelValue', value: T): void
}

export interface SearchSelectTheme {
  /**
   * Theme color for the component.
   * @default 'blue'
   */
  themeColor?: 'blue' | 'gray'
  /**
   * Custom class for the active (highlighted) option.
   * If provided, overrides default theme styles for the active state.
   */
  activeOptionClass?: string
  /**
   * Custom class for the hovered option.
   * If provided, overrides default theme styles for the hover state.
   */
  hoverOptionClass?: string
}
