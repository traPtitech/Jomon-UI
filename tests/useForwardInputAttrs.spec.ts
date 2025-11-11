import { partitionForwardInputAttrs } from '../src/components/shared/useForwardInputAttrs'
import { describe, expect, it } from 'vitest'

type Attrs = Record<string, unknown>

const baseFrameSet = new Set<string>()
const baseBlocklistSet = new Set(['id', 'value'])

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
  it('sends data/aria attrs to control by default and keeps listeners', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs(),
      baseFrameSet,
      baseBlocklistSet,
      'input'
    )

    expect(result.frameAttrs).toEqual({})
    expect(result.controlAttrs['data-testid']).toBe('frame')
    expect(result.controlAttrs['aria-label']).toBe('Frame label')
    expect(result.controlAttrs.min).toBe(1)
    expect(result.controlAttrs.max).toBe(3)
    expect(result.controlAttrs).toHaveProperty('onPaste')
    expect(result.controlAttrs).toHaveProperty('onCompositionstart')
    expect(result.controlAttrs).not.toHaveProperty('id')
    expect(result.controlAttrs).not.toHaveProperty('value')
  })

  it('respects custom frame key overrides', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ title: 'Heading' }),
      new Set(['title']),
      baseBlocklistSet,
      'input'
    )
    expect(result.frameAttrs.title).toBe('Heading')
    expect(result.controlAttrs).not.toHaveProperty('title')
  })

  it('supports frame key prefixes when needed', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs(),
      baseFrameSet,
      baseBlocklistSet,
      'input',
      ['data-']
    )
    expect(result.frameAttrs['data-testid']).toBe('frame')
    expect(result.controlAttrs).not.toHaveProperty('data-testid')
  })

  it('keeps pointer/mouse listeners on frame by default', () => {
    const result = partitionForwardInputAttrs(
      { ...buildAttrs(), onClick: () => undefined },
      baseFrameSet,
      baseBlocklistSet,
      'input'
    )
    expect(result.frameAttrs).toHaveProperty('onClick')
    expect(result.controlAttrs).not.toHaveProperty('onClick')
  })

  it('supports textarea control typing and blocklist overrides', () => {
    const blocklist = new Set(['id', 'value', 'placeholder'])
    const result = partitionForwardInputAttrs(
      buildAttrs({ rows: 5 }),
      baseFrameSet,
      blocklist,
      'textarea'
    )
    expect(result.controlAttrs).toHaveProperty('rows')
    expect(result.controlAttrs).not.toHaveProperty('placeholder')
  })
})
