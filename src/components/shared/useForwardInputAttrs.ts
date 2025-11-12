import { computed, useAttrs } from 'vue'
import type {
  AriaAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes
} from 'vue'

type Attrs = Record<string, unknown>
type ControlType = 'input' | 'textarea'

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

const htmlAttributeKeys = [
  'innerHTML',
  'class',
  'style',
  'accesskey',
  'contenteditable',
  'contextmenu',
  'dir',
  'draggable',
  'hidden',
  'id',
  'inert',
  'lang',
  'placeholder',
  'spellcheck',
  'tabindex',
  'title',
  'translate',
  'radiogroup',
  'role',
  'about',
  'datatype',
  'inlist',
  'prefix',
  'property',
  'resource',
  'typeof',
  'vocab',
  'autocapitalize',
  'autocorrect',
  'autosave',
  'color',
  'itemprop',
  'itemscope',
  'itemtype',
  'itemid',
  'itemref',
  'results',
  'security',
  'unselectable',
  'inputmode',
  'is'
] as const satisfies readonly string[]

const inputSpecificAttributeKeys = [
  'accept',
  'alt',
  'autocomplete',
  'autofocus',
  'capture',
  'checked',
  'crossorigin',
  'disabled',
  'enterKeyHint',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'height',
  'indeterminate',
  'list',
  'max',
  'maxlength',
  'min',
  'minlength',
  'multiple',
  'name',
  'pattern',
  'readonly',
  'required',
  'size',
  'src',
  'step',
  'type',
  'width'
] as const satisfies readonly string[]

const textareaSpecificAttributeKeys = [
  'autocomplete',
  'autofocus',
  'cols',
  'dirname',
  'disabled',
  'form',
  'maxlength',
  'minlength',
  'name',
  'placeholder',
  'readonly',
  'required',
  'rows',
  'wrap'
] as const satisfies readonly string[]

const inputAttributeSet = new Set<string>([
  ...htmlAttributeKeys,
  ...inputSpecificAttributeKeys
])
const textareaAttributeSet = new Set<string>([
  ...htmlAttributeKeys,
  ...textareaSpecificAttributeKeys
])

type HtmlAttributeKey = (typeof htmlAttributeKeys)[number]
type InputSpecificAttributeKey = (typeof inputSpecificAttributeKeys)[number]
type TextareaSpecificAttributeKey =
  (typeof textareaSpecificAttributeKeys)[number]
type DataAttributeKey = `data-${string}`
type AriaAttributeKey = Extract<keyof AriaAttributes, `aria-${string}`>

interface ControlAttrKeyMap {
  input:
    | HtmlAttributeKey
    | InputSpecificAttributeKey
    | AriaAttributeKey
    | DataAttributeKey
  textarea:
    | HtmlAttributeKey
    | TextareaSpecificAttributeKey
    | AriaAttributeKey
    | DataAttributeKey
}

const createAttributeAliasMap = (keys: readonly string[]) =>
  keys.reduce<Record<string, string>>((map, key) => {
    const lowerKey = key.toLowerCase()
    if (lowerKey === key) {
      return map
    }
    if (!(lowerKey in map)) {
      map[lowerKey] = key
    }
    return map
  }, {})

const attributeKeyAliases: Record<string, string> = {
  ...createAttributeAliasMap(htmlAttributeKeys),
  ...createAttributeAliasMap(inputSpecificAttributeKeys),
  ...createAttributeAliasMap(textareaSpecificAttributeKeys)
}

const isDataAttributeKey = (key: string): key is DataAttributeKey =>
  key.startsWith('data-')

const isAriaAttributeKey = (key: string): key is AriaAttributeKey =>
  key.startsWith('aria-')

const getControlAttrKey = <T extends ControlType>(
  key: string,
  controlType: T
): ControlAttrKeyMap[T] | null => {
  const lowerKey = normalizeAttributeKey(key)
  const canonicalKey = attributeKeyAliases[lowerKey] ?? key
  if (isDataAttributeKey(lowerKey) || isAriaAttributeKey(lowerKey)) {
    const finalKey = isDataAttributeKey(lowerKey) ? lowerKey : canonicalKey
    return finalKey as ControlAttrKeyMap[T]
  }
  if (controlType === 'input') {
    return inputAttributeSet.has(canonicalKey)
      ? (canonicalKey as ControlAttrKeyMap[T])
      : null
  }
  return textareaAttributeSet.has(canonicalKey)
    ? (canonicalKey as ControlAttrKeyMap[T])
    : null
}

const normalizeAttributeKey = (key: string) => key.toLowerCase()

const assignControlAttr = <T extends ControlType>(
  target: ControlHTMLAttrs<T>,
  key: ControlAttrKeyMap[T],
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

  Object.entries(attrs).forEach(([key, value]) => {
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

    if (blocklistSet.has(key)) {
      return
    }

    const controlKey = getControlAttrKey(key, controlType)
    if (controlKey) {
      assignControlAttr(controlAttrs, controlKey, value)
      return
    }

    frameEntries.push([key, value])
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
  const blocklistSet = new Set([
    ...defaultBlocklistKeys,
    ...(options?.blocklistKeys ?? [])
  ])
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
    const finalBlocklist = new Set([...blocklistSet, ...extraBlocklistKeys])
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
