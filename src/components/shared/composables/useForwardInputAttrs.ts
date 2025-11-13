import {
  getAttrAliasMap,
  isAriaAttributeKey,
  isDataAttributeKey,
  normalizeAttributeKey,
  toKebabCase,
  type AttrAliasMap,
  type ControlType
} from './runtimeAttrMap'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'vue'
import { computed, useAttrs } from 'vue'

type Attrs = Record<string, unknown>

type BaseControlAttrs<T extends ControlType> = T extends 'textarea'
  ? Partial<Omit<TextareaHTMLAttributes, 'id' | 'value'>>
  : Partial<Omit<InputHTMLAttributes, 'id' | 'value'>>

type DataAttributeValue = string | number | boolean | null | undefined

type DataAttributeRecord = Record<`data-${string}`, DataAttributeValue>

export type ControlHTMLAttrs<T extends ControlType> = BaseControlAttrs<T> &
  Partial<DataAttributeRecord>

export interface ForwardInputAttrsOptions<T extends ControlType = 'input'> {
  frameKeys?: string[]
  frameKeyPrefixes?: string[]
  frameListenerKeys?: string[]
  blocklistKeys?: string[]
  controlType?: T
}

export interface ForwardedInputAttrs<T extends ControlType> {
  frameAttrs: Attrs
  controlAttrs: ControlHTMLAttrs<T>
}

export interface PartitionedForwardInputAttrs<T extends ControlType>
  extends ForwardedInputAttrs<T> {
  describedBy?: string
}

const listenerPattern = /^on[A-Z]/
const listenerModifierPattern =
  /(Once|Capture|Passive|Self|Ctrl|Shift|Alt|Meta|Stop|Prevent|Left|Middle|Right|Exact)+$/

const defaultFrameListenerKeys = [
  'onClick',
  'onDblclick',
  'onPointerdown',
  'onPointerup',
  'onPointerenter',
  'onPointerleave',
  'onPointercancel',
  'onMousedown',
  'onMouseup',
  'onMouseenter',
  'onMouseleave',
  'onMousemove',
  'onTouchstart',
  'onTouchend'
] satisfies readonly string[]

const assignControlAttr = <T extends ControlType>(
  target: ControlHTMLAttrs<T>,
  key: string,
  value: unknown
) => {
  ;(target as Record<string, unknown>)[key] = value
}

const buildFrameKeySet = (keys: readonly string[]) => {
  const set = new Set<string>()
  keys.forEach(key => {
    set.add(key)
    set.add(normalizeAttributeKey(key))
  })
  return set
}

const describedByAttrName = 'aria-describedby'

const matchesDescribedByKey = (key: string) =>
  normalizeAttributeKey(key) === describedByAttrName ||
  toKebabCase(key) === describedByAttrName

const stripListenerModifiers = (key: string): string =>
  listenerPattern.test(key) ? key.replace(listenerModifierPattern, '') : key

const shouldStayOnFrame = (
  key: string,
  normalizedKey: string,
  frameKeySet: Set<string>,
  normalizedFrameKeyPrefixes: readonly string[]
) =>
  frameKeySet.has(key) ||
  frameKeySet.has(normalizedKey) ||
  normalizedFrameKeyPrefixes.some(prefix => normalizedKey.startsWith(prefix))

const getControlAttrKey = (key: string, aliasMap: AttrAliasMap): string => {
  const lowerKey = normalizeAttributeKey(key)
  if (isDataAttributeKey(lowerKey)) {
    return lowerKey
  }
  if (isAriaAttributeKey(lowerKey)) {
    return lowerKey
  }
  const kebabKey = toKebabCase(key)
  return aliasMap[lowerKey] ?? aliasMap[kebabKey] ?? aliasMap[key] ?? key
}

export const partitionForwardInputAttrs = <T extends ControlType>(
  attrs: Attrs,
  frameKeySet: Set<string>,
  blocklistSet: Set<string>,
  controlType: T,
  frameKeyPrefixes: readonly string[] = [],
  frameListenerSet: Set<string> = new Set(
    defaultFrameListenerKeys.map(stripListenerModifiers)
  )
): PartitionedForwardInputAttrs<T> => {
  const frameEntries: [string, unknown][] = []
  const controlAttrs = {} as ControlHTMLAttrs<T>
  const aliasMap = getAttrAliasMap(controlType)
  const normalizedFrameKeyPrefixes = frameKeyPrefixes.map(normalizeAttributeKey)
  let describedBy: string | undefined

  for (const [key, value] of Object.entries(attrs)) {
    if (matchesDescribedByKey(key)) {
      if (typeof value === 'string') {
        describedBy = describedBy ? `${describedBy} ${value}` : value
        assignControlAttr(controlAttrs, describedByAttrName, describedBy)
      } else {
        assignControlAttr(controlAttrs, describedByAttrName, value)
      }
      continue
    }

    const normalizedKey = normalizeAttributeKey(key)

    if (listenerPattern.test(key)) {
      const normalizedListenerKey = stripListenerModifiers(key)
      if (frameListenerSet.has(normalizedListenerKey)) {
        frameEntries.push([key, value])
      } else {
        assignControlAttr(controlAttrs, key, value)
      }
      continue
    }

    if (
      shouldStayOnFrame(
        key,
        normalizedKey,
        frameKeySet,
        normalizedFrameKeyPrefixes
      )
    ) {
      frameEntries.push([key, value])
      continue
    }

    if (blocklistSet.has(normalizedKey)) {
      continue
    }

    const controlKey = getControlAttrKey(key, aliasMap)
    assignControlAttr(controlAttrs, controlKey, value)
  }

  return {
    frameAttrs: Object.fromEntries(frameEntries),
    controlAttrs,
    describedBy
  }
}

export const useForwardInputAttrs = <T extends ControlType = 'input'>(
  options?: ForwardInputAttrsOptions<T>
) => {
  const attrs = useAttrs()

  const frameKeySet = buildFrameKeySet([
    'class',
    'style',
    ...(options?.frameKeys ?? [])
  ])

  const frameKeyPrefixes = options?.frameKeyPrefixes ?? []

  const frameListenerSet = new Set(
    [...defaultFrameListenerKeys, ...(options?.frameListenerKeys ?? [])].map(
      stripListenerModifiers
    )
  )

  const blocklistSet = new Set(
    ['id', 'value', ...(options?.blocklistKeys ?? [])].map(
      normalizeAttributeKey
    )
  )

  const controlType: T = options?.controlType ?? ('input' as T)

  const runPartition = <K extends ControlType = T>(
    overrideType?: K,
    overrideBlocklist?: Set<string>
  ): PartitionedForwardInputAttrs<K> =>
    partitionForwardInputAttrs(
      attrs,
      frameKeySet,
      overrideBlocklist ?? blocklistSet,
      (overrideType ?? controlType) as K,
      frameKeyPrefixes,
      frameListenerSet
    )

  const forwardedAttrs = computed<PartitionedForwardInputAttrs<T>>(() =>
    runPartition()
  )

  const describedByAttr = computed(() => forwardedAttrs.value.describedBy)

  const getControlAttrs = <K extends ControlType = T>(
    overrideType?: K,
    extraBlocklistKeys: string[] = []
  ): ControlHTMLAttrs<K> => {
    if (!overrideType && extraBlocklistKeys.length === 0) {
      return forwardedAttrs.value.controlAttrs as ControlHTMLAttrs<K>
    }
    const finalBlocklist = new Set(blocklistSet)
    extraBlocklistKeys.forEach(key =>
      finalBlocklist.add(normalizeAttributeKey(key))
    )
    return runPartition(overrideType, finalBlocklist).controlAttrs
  }

  const frameAttrs = computed<Attrs>(() => forwardedAttrs.value.frameAttrs)
  const inputAttrs = computed<ControlHTMLAttrs<T>>(
    () => forwardedAttrs.value.controlAttrs
  )

  return {
    describedByAttr,
    frameAttrs,
    inputAttrs,
    getControlAttrs
  }
}

export const __useForwardInputAttrsTestUtils = {
  stripListenerModifiers,
  matchesDescribedByKey
}
