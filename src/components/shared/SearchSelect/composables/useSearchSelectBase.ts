import type { Option, SearchSelectTheme } from '../types'

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
