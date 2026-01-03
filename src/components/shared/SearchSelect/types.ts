export interface SearchSelectOption<T extends string | number> {
  label: string
  key: T
  disabled?: boolean
}

export interface SearchSelectCommonProps<T extends string | number> {
  options: SearchSelectOption<T>[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  name?: string
  noResultsText?: string
  errorMessage?: string
  filterFunction?: (option: SearchSelectOption<T>, query: string) => boolean
}
