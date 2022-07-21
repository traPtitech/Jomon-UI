import type { LocationQueryValue } from 'vue-router'

export const toPage = (v: LocationQueryValue | LocationQueryValue[]) => {
  if (Array.isArray(v)) {
    v = v[0]
  }
  if (!v) return 1
  const parsed = parseInt(v)
  return isNaN(parsed) ? 1 : parsed
}

export const toId = (v: LocationQueryValue | LocationQueryValue[]) => {
  if (Array.isArray(v)) {
    v = v[0]
  }
  if (!v) return ''
  return v
}
