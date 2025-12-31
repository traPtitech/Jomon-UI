/**
 * Safely converts a value to a string for display or keys.
 */
export function safeString(val: unknown): string {
  if (typeof val === 'string') return val
  if (
    typeof val === 'number' ||
    typeof val === 'bigint' ||
    typeof val === 'boolean'
  ) {
    return String(val)
  }
  if (typeof val === 'object' && val !== null) {
    if ('label' in val && typeof val.label === 'string') return val.label
    if (
      'id' in val &&
      (typeof val.id === 'string' || typeof val.id === 'number')
    )
      return String(val.id)
    try {
      return JSON.stringify(val)
    } catch {
      return '[Object]'
    }
  }
  return ''
}

/**
 * Sanitizes props for v-bind to avoid strict type checks on undefined values.
 * Useful when working with libraries like Zag.js that might return explicit undefined for optional props.
 * Used with v-bind, which handles Generics gracefully.
 */
export function safeBind<T extends object>(
  props: T
): { [K in keyof T]: Exclude<T[K], undefined> } {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) {
      if (key === 'htmlFor') {
        result['for'] = value
      } else {
        result[key] = value
      }
    }
  }
  return result as { [K in keyof T]: Exclude<T[K], undefined> }
}
