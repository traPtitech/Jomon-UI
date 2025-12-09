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
