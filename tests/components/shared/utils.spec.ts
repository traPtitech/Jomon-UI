import { describe, expect, it } from 'vitest'

import { serializeOptionKey } from '@/components/shared/utils'

describe('serializeOptionKey', () => {
  it('serializes string correctly', () => {
    expect(serializeOptionKey('foo')).toBe('foo')
    expect(serializeOptionKey('')).toBe('')
  })

  it('serializes number correctly', () => {
    expect(serializeOptionKey(123)).toBe('123')
    expect(serializeOptionKey(0)).toBe('0')
    expect(serializeOptionKey(-1)).toBe('-1')
  })
})
