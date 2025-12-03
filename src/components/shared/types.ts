export interface Option<T> {
  key: string
  value: T
  disabled?: boolean
}

export type SearchSelectEmit = {
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}
