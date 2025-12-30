import { describe, expect, it } from 'vitest'

import { safeString } from '@/components/shared/SearchSelect/utils'

describe('serializeOptionKey', () => {
  it('serializes string correctly', () => {
    expect(safeString('foo')).toBe('foo')
    expect(safeString('')).toBe('')
  })

  it('serializes number correctly', () => {
    expect(safeString(123)).toBe('123')
    expect(safeString(0)).toBe('0')
    expect(safeString(-1)).toBe('-1')
  })
})
