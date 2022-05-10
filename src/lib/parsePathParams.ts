export const toId = (v: string | string[]) => {
  if (Array.isArray(v)) {
    v = v[0]
  }
  if (!v) return ''
  return v
}
