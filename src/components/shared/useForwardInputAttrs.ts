import { computed, useAttrs } from 'vue'

type Attrs = Record<string, unknown>
type ControlType = 'input' | 'textarea'

export interface ForwardInputAttrsOptions {
  frameKeys?: string[]
  frameKeyPrefixes?: string[]
  frameListenerKeys?: string[]
  blocklistKeys?: string[]
  controlType?: ControlType
}

export interface ForwardedInputAttrs {
  frameAttrs: Attrs
  controlAttrs: Attrs
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

const shouldStayOnFrame = (
  key: string,
  frameKeySet: Set<string>,
  frameKeyPrefixes: readonly string[]
) =>
  frameKeySet.has(key) ||
  frameKeyPrefixes.some(prefix => key.startsWith(prefix))

export const partitionForwardInputAttrs = (
  attrs: Attrs,
  frameKeySet: Set<string>,
  blocklistSet: Set<string>,
  controlType: ControlType,
  frameKeyPrefixes: readonly string[] = [],
  frameListenerSet: Set<string> = new Set(defaultFrameListenerKeys)
): ForwardedInputAttrs => {
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
    controlAttrs: Object.fromEntries(controlEntries)
  }
}

export const useForwardInputAttrs = (options?: ForwardInputAttrsOptions) => {
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
  const controlType: ControlType = options?.controlType ?? 'input'

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

  const getControlAttrs = (
    overrideType?: ControlType,
    extraBlocklistKeys: string[] = []
  ): Attrs => {
    const finalBlocklist = new Set([...blocklistSet, ...extraBlocklistKeys])
    return partitionForwardInputAttrs(
      baseForwardedAttrs.value,
      frameKeySet,
      finalBlocklist,
      overrideType ?? controlType,
      frameKeyPrefixes,
      frameListenerSet
    ).controlAttrs
  }

  const frameAttrs = computed<Attrs>(() => forwardedAttrs.value.frameAttrs)
  const inputAttrs = computed<Attrs>(() => forwardedAttrs.value.controlAttrs)

  return {
    containerClass,
    containerStyle,
    describedByAttr,
    frameAttrs,
    inputAttrs,
    getControlAttrs
  }
}
