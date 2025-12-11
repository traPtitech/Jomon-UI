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

/**
 * Emits for the SearchSelect component.
 * Designed to work with `defineModel`.
 */
export type SearchSelectEmit<T> = {
  (e: 'update:modelValue', value: T): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'close'): void
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
  /**
   * Custom class for the selected option.
   * If provided, overrides default theme styles for the selected state.
   */
  selectedOptionClass?: string
}

export interface SearchSelectCommonProps<
  TValue extends string | number | null,
> {
  options: Option<NonNullable<TValue>>[]
  label: string
  placeholder?: string | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
  /**
   * Error message to display.
   */
  errorMessage?: string | undefined
  /**
   * Optional custom filter function.
   * Return true to include the option in the filtered list.
   * @param option The option to test.
   * @param searchTerm The current search term (not lower-cased).
   */
  filterFunction?:
    | ((option: Option<NonNullable<TValue>>, searchTerm: string) => boolean)
    | undefined
  /**
   * Whether to reset the search term when an item is selected.
   * MultiSelect uses `true` by default, while SingleSelect components (SearchSelect.vue) override this to `false` to persist the selected label.
   */
  resetOnSelect?: boolean | undefined
  /**
   * Text to display when no options match the search term.
   * @default '該当する項目がありません。'
   */
  noResultsText?: string | undefined
  /**
   * Text to display when there are no options available at all.
   * @default '項目がありません。'
   */
  noItemsText?: string | undefined
  /**
   * Height of each item in the virtual list (pixels).
   * @default 36
   */
  itemHeight?: number | undefined
  /**
   * Theming options.
   */
  theme?: SearchSelectTheme | undefined
}

export interface SearchSelectInputRef {
  focus: () => void
  select: () => void
  el: HTMLElement | null
}
