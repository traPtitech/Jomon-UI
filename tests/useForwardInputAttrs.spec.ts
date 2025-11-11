import { partitionForwardInputAttrs } from '../src/components/shared/useForwardInputAttrs'
import { describe, expect, it } from 'vitest'

type Attrs = Record<string, unknown>

const buildAttrs = (overrides: Attrs = {}): Attrs => ({
  'data-testid': 'frame',
  'aria-label': 'Frame label',
  min: 1,
  max: 3,
  onPaste: () => undefined,
  onCompositionstart: () => undefined,
  placeholder: 'value',
  id: 'external-id',
  value: 'shadow',
  ...overrides
})

describe('partitionForwardInputAttrs', () => {
  const defaultSet = new Set(['role', 'tabindex'])

  it('keeps structural attrs on frame and listeners on control', () => {
    const result = partitionForwardInputAttrs(buildAttrs(), defaultSet)

    expect(result.frameAttrs).toEqual({
      'data-testid': 'frame',
      'aria-label': 'Frame label'
    })
    expect(result.inputAttrs.min).toBe(1)
    expect(result.inputAttrs.max).toBe(3)
    expect(result.inputAttrs).toHaveProperty('onPaste')
    expect(result.inputAttrs).toHaveProperty('onCompositionstart')
    expect(result.inputAttrs).not.toHaveProperty('id')
    expect(result.inputAttrs).not.toHaveProperty('value')
  })

  it('respects custom frame key overrides', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ title: 'Heading' }),
      new Set(['role', 'tabindex', 'title'])
    )
    expect(result.frameAttrs.title).toBe('Heading')
    expect(result.inputAttrs).not.toHaveProperty('title')
  })

  it('filters optionally undefined aria/data attrs from input', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ 'aria-controls': undefined, 'data-qa': undefined }),
      defaultSet
    )
    expect(result.inputAttrs).not.toHaveProperty('aria-controls')
    expect(result.inputAttrs).not.toHaveProperty('data-qa')
  })
})
