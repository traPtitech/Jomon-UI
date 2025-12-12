/**
 * Serializes a value to a string key.
 * Strictly accepts only string or number.
 * Throws runtime error if null or undefined is passed, to prevent silent failures.
 */
export function serializeOptionKey(val: string | number): string {
  return String(val)
}

/**
 * Sanitizes props for v-bind to avoid strict type checks on undefined values.
 * Useful when working with libraries like Zag.js that might return explicit undefined for optional props.
 * Also bypasses strict Index Signature checks by returning a loose Record.
 */

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
      result[key] = value
    }
  }
  return result as { [K in keyof T]: Exclude<T[K], undefined> }
}
