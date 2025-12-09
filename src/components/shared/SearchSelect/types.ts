/**
 * Represents an option in a selection list.
 * @template T - The type of the value.
 */
export interface Option<T> {
  /** Display label */
  key: string
  /**
   * Unique identifier for the option.
   * Note: The UI assumes values are unique across the options list.
   * If duplicates exist, behavior (like selection mapping) may be incorrect.
   */
  value: T
  disabled?: boolean
}

export type SearchSelectBaseEmit = {
  (e: 'focus', event: FocusEvent): void
  (e: 'close'): void
  (e: 'search-input', value: string): void
}

export type SearchSelectEmit<T = unknown> = SearchSelectBaseEmit & {
  (e: 'update:modelValue', value: T): void
}
