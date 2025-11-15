import { __setAttrAliasMapForTesting } from '../src/components/shared/composables/runtimeAttrMap'
import {
  __useForwardInputAttrsTestUtils,
  partitionForwardInputAttrs
} from '../src/components/shared/composables/useForwardInputAttrs'
import { beforeEach, describe, expect, it } from 'vitest'

type Attrs = Record<string, unknown>

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
    const result = partitionForwardInputAttrs(buildAttrs(), 'input')

    expect(result.frameAttrs).toEqual({})
    expect(result.controlAttrs['data-testid']).toBe('frame')
    expect(result.controlAttrs['aria-label']).toBe('Frame label')
    expect(result.controlAttrs.min).toBe(1)
    expect(result.controlAttrs.max).toBe(3)
    expect(result.controlAttrs).toHaveProperty('onPaste')
    expect(result.controlAttrs).toHaveProperty('onCompositionstart')
    expect(result.controlAttrs).not.toHaveProperty('id')
    expect(result.controlAttrs).not.toHaveProperty('value')
    expect(result.describedBy).toBeUndefined()
  })

  it('aggregates string aria-describedby values and mirrors them on control attrs', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({
        'aria-describedby': 'helper-text',
        ariaDescribedby: 'fallback'
      }),
      'input'
    )

    expect(result.describedBy).toBe('helper-text fallback')
    expect(result.controlAttrs['aria-describedby']).toBe('helper-text fallback')
  })

  it('normalizes string[] aria-describedby values to space-separated string', () => {
    const nonStringValue = ['id1', 'id2']
    const result = partitionForwardInputAttrs(
      buildAttrs({ ariaDescribedby: nonStringValue }),
      'input'
    )

    expect(result.describedBy).toBe('id1 id2')
    expect(result.controlAttrs['aria-describedby']).toBe('id1 id2')
  })

  it('ignores non-string aria-describedby values that cannot be normalized', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ ariaDescribedby: 123 }),
      'input'
    )

    expect(result.describedBy).toBeUndefined()
    expect(result.controlAttrs['aria-describedby']).toBeUndefined()
  })

  it('keeps pointer/mouse listeners on frame by default', () => {
    const result = partitionForwardInputAttrs(
      { ...buildAttrs(), onClick: () => undefined },
      'input'
    )
    expect(result.frameAttrs).toHaveProperty('onClick')
    expect(result.controlAttrs).not.toHaveProperty('onClick')
  })

  it('keeps pointer/mouse listeners with modifiers on frame', () => {
    const result = partitionForwardInputAttrs(
      { ...buildAttrs(), onPointerdownCaptureOnce: () => undefined },
      'input'
    )
    expect(result.frameAttrs).toHaveProperty('onPointerdownCaptureOnce')
    expect(result.controlAttrs).not.toHaveProperty('onPointerdownCaptureOnce')
  })

  it('accepts lowercase aliases like enterkeyhint', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ enterkeyhint: 'search' }),
      'input'
    )

    expect(result.controlAttrs).toHaveProperty('enterKeyHint', 'search')
  })

  it('prefers the first canonical key when duplicates exist', () => {
    const result = partitionForwardInputAttrs(
      buildAttrs({ PLACEHOLDER: 'value', rows: 3 }),
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
