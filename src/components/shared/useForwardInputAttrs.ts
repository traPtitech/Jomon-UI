import {
  getAttrAliasMap,
  isAriaAttributeKey,
  isDataAttributeKey,
  normalizeAttributeKey,
  toKebabCase,
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

const listenerPattern = /^on[A-Z]/
const listenerModifierPattern =
  /(Once|Capture|Passive|Self|Ctrl|Shift|Alt|Meta|Stop|Prevent|Left|Middle|Right|Exact)+$/
const defaultFrameKeys: readonly string[] = []
const defaultFrameKeyPrefixes: readonly string[] = []
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
const defaultBlocklistKeys = ['id', 'value'] satisfies readonly string[]

const assignControlAttr = <T extends ControlType>(
  target: ControlHTMLAttrs<T>,
  key: string,
  value: unknown
) => {
  ;(target as Record<string, unknown>)[key] = value
}

const describedByAttrName = 'aria-describedby'

const matchesDescribedByKey = (key: string) =>
  normalizeAttributeKey(key) === describedByAttrName ||
  toKebabCase(key) === describedByAttrName

const stripListenerModifiers = (key: string): string =>
  listenerPattern.test(key) ? key.replace(listenerModifierPattern, '') : key

const shouldStayOnFrame = (
  key: string,
  frameKeySet: Set<string>,
  frameKeyPrefixes: readonly string[]
) =>
  frameKeySet.has(key) ||
  frameKeyPrefixes.some(prefix => key.startsWith(prefix))

const getControlAttrKey = (
  key: string,
  aliasMap: Record<string, string | undefined>
): string => {
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
  frameListenerSet: Set<string> = new Set(defaultFrameListenerKeys)
): ForwardedInputAttrs<T> => {
  const frameEntries: [string, unknown][] = []
  const controlAttrs = {} as ControlHTMLAttrs<T>
  const aliasMap = getAttrAliasMap(controlType)

  const processAttribute = ([key, value]: [string, unknown]) => {
    if (matchesDescribedByKey(key)) {
      return
    }

    const normalizedKey = normalizeAttributeKey(key)
    if (listenerPattern.test(key)) {
      const normalizedListenerKey = stripListenerModifiers(key)
      if (
        frameListenerSet.has(key) ||
        frameListenerSet.has(normalizedListenerKey)
      ) {
        frameEntries.push([key, value])
      } else {
        assignControlAttr(controlAttrs, key, value)
      }
      return
    }

    if (shouldStayOnFrame(key, frameKeySet, frameKeyPrefixes)) {
      frameEntries.push([key, value])
      return
    }

    if (blocklistSet.has(normalizedKey)) {
      return
    }

    const controlKey = getControlAttrKey(key, aliasMap)
    assignControlAttr(controlAttrs, controlKey, value)
  }

  Object.entries(attrs).forEach(processAttribute)

  return {
    frameAttrs: Object.fromEntries(frameEntries),
    controlAttrs
  }
}

export const useForwardInputAttrs = <T extends ControlType = 'input'>(
  options?: ForwardInputAttrsOptions<T>
) => {
  const attrs = useAttrs()
  const attrsEntries = computed(() => Object.entries(attrs))

  const describedByAttr = computed(() => {
    for (const [key, value] of attrsEntries.value) {
      if (matchesDescribedByKey(key) && typeof value === 'string') {
        return value
      }
    }
    return undefined
  })

  const frameKeySet = new Set([
    'class',
    'style',
    ...defaultFrameKeys,
    ...(options?.frameKeys ?? [])
  ])
  const frameKeyPrefixes = [
    ...defaultFrameKeyPrefixes,
    ...(options?.frameKeyPrefixes ?? [])
  ]
  const frameListenerSet = new Set([
    ...defaultFrameListenerKeys,
    ...(options?.frameListenerKeys ?? [])
  ])
  const blocklistSet = new Set(
    [...defaultBlocklistKeys, ...(options?.blocklistKeys ?? [])].map(
      normalizeAttributeKey
    )
  )
  const controlType: T = options?.controlType ?? ('input' as T)

  const forwardedAttrs = computed(() =>
    partitionForwardInputAttrs(
      attrs,
      frameKeySet,
      blocklistSet,
      controlType,
      frameKeyPrefixes,
      frameListenerSet
    )
  )

  const getControlAttrs = <K extends ControlType = T>(
    overrideType?: K,
    extraBlocklistKeys: string[] = []
  ): ControlHTMLAttrs<K> => {
    const finalBlocklist = new Set(blocklistSet)
    extraBlocklistKeys.forEach(key =>
      finalBlocklist.add(normalizeAttributeKey(key))
    )
    const targetType = (overrideType ?? controlType) as K
    return partitionForwardInputAttrs(
      attrs,
      frameKeySet,
      finalBlocklist,
      targetType,
      frameKeyPrefixes,
      frameListenerSet
    ).controlAttrs
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

const globalProcess = (
  globalThis as {
    process?: { env?: Record<string, string | undefined> }
  }
).process

const isTestEnv = !!globalProcess && globalProcess.env?.VITEST === 'true'

export const __useForwardInputAttrsTestUtils = isTestEnv
  ? {
      stripListenerModifiers,
      matchesDescribedByKey
    }
  : undefined
