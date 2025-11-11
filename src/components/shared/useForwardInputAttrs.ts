import { computed, useAttrs } from 'vue'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'vue'

type Attrs = Record<string, unknown>
type ControlType = 'input' | 'textarea'
type ControlHTMLAttrs<T extends ControlType> = T extends 'textarea'
  ? Partial<Omit<TextareaHTMLAttributes, 'value' | 'id'>>
  : Partial<Omit<InputHTMLAttributes, 'value' | 'id'>>

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
] as const
const defaultBlocklistKeys = ['id', 'value'] as const

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
  void controlType
  const frameEntries: [string, unknown][] = []
  const controlEntries: [string, unknown][] = []

  Object.entries(attrs).forEach(([key, value]) => {
    if (listenerPattern.test(key)) {
      if (frameListenerSet.has(key)) {
        frameEntries.push([key, value])
      } else {
        controlEntries.push([key, value])
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

    controlEntries.push([key, value])
  })

  return {
    frameAttrs: Object.fromEntries(frameEntries),
    controlAttrs: Object.fromEntries(controlEntries) as ControlHTMLAttrs<T>
  }
}

export const useForwardInputAttrs = <T extends ControlType = 'input'>(
  options?: ForwardInputAttrsOptions<T>
) => {
  const attrs = useAttrs()

  const containerClass = computed(() => attrs.class)
  const containerStyle = computed(() => attrs.style)
  const describedByAttr = computed(
    () => attrs['aria-describedby'] as string | undefined
  )

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
  const controlType = (options?.controlType ?? 'input') as T

  const baseForwardedAttrs = computed<Attrs>(() => {
    const rest = { ...(attrs as Attrs) }
    delete rest.class
    delete rest.style
    delete rest['aria-describedby']
    return rest
  })

  const forwardedAttrs = computed(() =>
    partitionForwardInputAttrs<T>(
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
    return partitionForwardInputAttrs<K>(
      baseForwardedAttrs.value,
      frameKeySet,
      finalBlocklist,
      overrideType ?? (controlType as unknown as K),
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
