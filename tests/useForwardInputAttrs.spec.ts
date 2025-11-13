import { __setAttrAliasMapForTesting } from '../src/components/shared/runtimeAttrMap'
import {
  partitionForwardInputAttrs,
  __useForwardInputAttrsTestUtils
} from '../src/components/shared/useForwardInputAttrs'
import { beforeEach, describe, expect, it } from 'vitest'

type Attrs = Record<string, unknown>

const baseFrameSet = new Set<string>()
const baseBlocklistSet = new Set(['id', 'value'])

if (!__useForwardInputAttrsTestUtils) {
  throw new Error('Test utils are unavailable outside test mode')
}

const { stripListenerModifiers, matchesDescribedByKey } =
  __useForwardInputAttrsTestUtils

const toKebab = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const buildAliasMap = (keys: string[]) => {
  const map: Record<string, string> = Object.create(null)
  keys.forEach(key => {
    map[key] = key
    map[key.toLowerCase()] = key
    map[toKebab(key)] = key
  })
  return map
}

beforeEach(() => {
  __setAttrAliasMapForTesting(
    'input',
    buildAliasMap(['placeholder', 'enterKeyHint', 'maxlength', 'min', 'max'])
  )
  __setAttrAliasMapForTesting(
    'textarea',
    buildAliasMap(['placeholder', 'rows'])
  )
})

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

  it('keeps pointer/mouse listeners with modifiers on frame', () => {
    const result = partitionForwardInputAttrs(
      { ...buildAttrs(), onPointerdownCaptureOnce: () => undefined },
      baseFrameSet,
      baseBlocklistSet,
      'input'
    )
    expect(result.frameAttrs).toHaveProperty('onPointerdownCaptureOnce')
    expect(result.controlAttrs).not.toHaveProperty('onPointerdownCaptureOnce')
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

  it('accepts lowercase aliases like enterkeyhint', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ enterkeyhint: 'search' }),
      baseFrameSet,
      baseBlocklistSet,
      'input'
    )

    expect(result.controlAttrs).toHaveProperty('enterKeyHint', 'search')
  })

  it('prefers the first canonical key when duplicates exist', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ PLACEHOLDER: 'value', rows: 3 }),
      baseFrameSet,
      baseBlocklistSet,
      'textarea'
    )

    expect(result.controlAttrs).toHaveProperty('placeholder', 'value')
    expect(result.controlAttrs).toHaveProperty('rows', 3)
  })
})

describe('useForwardInputAttrs test utilities', () => {
  it('strips known listener modifiers', () => {
    expect(stripListenerModifiers('onClickOnceCapturePassive')).toBe('onClick')
    expect(stripListenerModifiers('onPointerdown')).toBe('onPointerdown')
  })

  it('matches aria-describedby regardless of casing', () => {
    expect(matchesDescribedByKey('aria-describedby')).toBe(true)
    expect(matchesDescribedByKey('ariaDescribedby')).toBe(true)
    expect(matchesDescribedByKey('aria-label')).toBe(false)
  })
})
