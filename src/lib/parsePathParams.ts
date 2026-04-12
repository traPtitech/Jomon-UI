export const toId = (v: string | readonly string[] | undefined) => {
  if (v === undefined) return ''
  if (Array.isArray(v)) {
    return v[0] ?? ''
  }
  return v
}
