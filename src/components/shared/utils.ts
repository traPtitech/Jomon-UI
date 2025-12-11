export function toString(val: unknown): string {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  return ''
}

/**
 * Sanitizes props for v-bind to avoid strict type checks on undefined values.
 * Useful when working with libraries like Zag.js that might return explicit undefined for optional props.
 * Also bypasses strict Index Signature checks by returning a loose Record.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeBind(props: object): Record<string, any> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result
}
