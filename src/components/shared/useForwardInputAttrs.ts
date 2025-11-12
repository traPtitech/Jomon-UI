import {
  getAttrAliasMap,
  isAriaAttributeKey,
  isDataAttributeKey,
  normalizeAttributeKey,
  type ControlType
} from './runtimeAttrMap'
import { computed, useAttrs } from 'vue'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'vue'

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

const toKebabCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()

const assignControlAttr = <T extends ControlType>(
  target: ControlHTMLAttrs<T>,
  key: string,
  value: unknown
) => {
  ;(target as Record<string, unknown>)[key] = value
}

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
    return key
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

  Object.entries(attrs).forEach(([key, value]) => {
    const normalizedKey = normalizeAttributeKey(key)
    if (listenerPattern.test(key)) {
      if (frameListenerSet.has(key)) {
        frameEntries.push([key, value])
      } else {
        ;(controlAttrs as Record<string, unknown>)[key] = value
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
  })

  return {
    frameAttrs: Object.fromEntries(frameEntries),
    controlAttrs
  }
}

export const useForwardInputAttrs = <T extends ControlType = 'input'>(
  options?: ForwardInputAttrsOptions<T>
) => {
  const attrs = useAttrs()

  const containerClass = computed(() => attrs.class)
  const containerStyle = computed(() => attrs.style)
  const describedByAttr = computed(() => {
    const value = attrs['aria-describedby']
    return typeof value === 'string' ? value : undefined
  })

  const frameKeySet = new Set([
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

  const baseForwardedAttrs = computed<Attrs>(() => {
    const rest: Attrs = {}
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class' || key === 'style' || key === 'aria-describedby') {
        return
      }
      rest[key] = value
    })
    return rest
  })

  const forwardedAttrs = computed(() =>
    partitionForwardInputAttrs(
      baseForwardedAttrs.value,
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
      baseForwardedAttrs.value,
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
    containerClass,
    containerStyle,
    describedByAttr,
    frameAttrs,
    inputAttrs,
    getControlAttrs
  }
}
