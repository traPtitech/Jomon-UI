import type { LocationQueryValue } from 'vue-router'

export const toPage = (
  v: LocationQueryValue | LocationQueryValue[] | undefined
) => {
  const value = Array.isArray(v) ? v[0] : v
  if (!value) return 1
  const parsed = parseInt(value)
  return isNaN(parsed) ? 1 : parsed
}

export const toId = (
  v: LocationQueryValue | LocationQueryValue[] | undefined
) => {
  if (v === undefined) return ''
  if (Array.isArray(v)) {
    return v[0] ?? ''
  }
  return v ?? ''
}
