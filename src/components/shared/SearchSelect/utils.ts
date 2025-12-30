export function safeString(val: string | number): string {
  return String(val)
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
