export interface BaseInputCommonProps {
  label: string
  required?: boolean | undefined
  placeholder?: string | undefined
  readonly?: boolean | undefined
  disabled?: boolean | undefined
  id?: string | undefined
  errorMessage?: string | undefined
  describedById?: string | undefined
}

export type TextInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'

export type TextInputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search'

// 足りなくなったら追加する
export type TextAutocomplete =
  | 'on'
  | 'off'
  | 'name'
  | 'given-name'
  | 'family-name'
  | 'nickname'
  | 'email'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'organization'
  | 'street-address'
  | 'postal-code'
  | 'country'
  | 'tel'
