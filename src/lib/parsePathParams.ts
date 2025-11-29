export const toId = (v: string | string[] | undefined) => {
  if (v === undefined) return ''
  if (Array.isArray(v)) {
    return v[0] ?? ''
  }
  return v
}
