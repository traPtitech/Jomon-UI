import { computed, useAttrs } from 'vue'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'vue'

type Attrs = Record<string, unknown>
type ControlHTMLAttrs = Partial<
  Omit<InputHTMLAttributes & TextareaHTMLAttributes, 'value' | 'id'>
>

export interface ForwardInputAttrsOptions {
  frameKeys?: string[]
}

export interface ForwardedInputAttrs {
  frameAttrs: Attrs
  inputAttrs: ControlHTMLAttrs
}

const listenerPattern = /^on[A-Z]/
const defaultFrameKeys = ['role', 'tabindex'] as const

const shouldStayOnFrame = (key: string, frameKeySet: Set<string>) =>
  key.startsWith('data-') || key.startsWith('aria-') || frameKeySet.has(key)

export const partitionForwardInputAttrs = (
  attrs: Attrs,
  frameKeySet: Set<string>
): ForwardedInputAttrs => {
  const frameEntries: [string, unknown][] = []
  const inputEntries: [string, unknown][] = []

  Object.entries(attrs).forEach(([key, value]) => {
    if (listenerPattern.test(key)) {
      inputEntries.push([key, value])
      return
    }

    if (shouldStayOnFrame(key, frameKeySet)) {
      frameEntries.push([key, value])
      return
    }

    if (key === 'id' || key === 'value') {
      return
    }

    inputEntries.push([key, value])
  })

  return {
    frameAttrs: Object.fromEntries(frameEntries),
    inputAttrs: Object.fromEntries(inputEntries) as ControlHTMLAttrs
  }
}

export const useForwardInputAttrs = (options?: ForwardInputAttrsOptions) => {
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

  const baseForwardedAttrs = computed<Attrs>(() => {
    const rest = { ...(attrs as Attrs) }
    delete rest.class
    delete rest.style
    delete rest['aria-describedby']
    return rest
  })

  const forwardedAttrs = computed(() =>
    partitionForwardInputAttrs(baseForwardedAttrs.value, frameKeySet)
  )

  const frameAttrs = computed<Attrs>(() => forwardedAttrs.value.frameAttrs)
  const inputAttrs = computed<ControlHTMLAttrs>(
    () => forwardedAttrs.value.inputAttrs
  )

  return {
    containerClass,
    containerStyle,
    describedByAttr,
    frameAttrs,
    inputAttrs
  }
}
