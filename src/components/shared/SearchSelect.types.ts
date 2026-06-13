export interface SearchSelectOption<T extends string> {
  key: string
  value: T
  disabled?: boolean
}

export interface SearchSelectProps<T extends string> {
  options: SearchSelectOption<T>[]
  label: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export type MenuState = 'close' | 'presearch' | 'searched'
