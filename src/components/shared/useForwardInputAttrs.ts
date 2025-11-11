import { computed, useAttrs } from 'vue'

type Attrs = Record<string, unknown>

const listenerPattern = /^on[A-Z]/
const frameSpecificKeys = new Set(['role', 'tabindex'])

const shouldStayOnFrame = (key: string) =>
  key.startsWith('data-') ||
  key.startsWith('aria-') ||
  frameSpecificKeys.has(key)

export const useForwardInputAttrs = () => {
  const attrs = useAttrs()

  const containerClass = computed(() => attrs.class)
  const containerStyle = computed(() => attrs.style)
  const describedByAttr = computed(
    () => attrs['aria-describedby'] as string | undefined
  )

  const baseForwardedAttrs = computed<Attrs>(() => {
    const rest = { ...(attrs as Attrs) }
    delete rest.class
    delete rest.style
    delete rest['aria-describedby']
    return rest
  })

  const frameAttrs = computed<Attrs>(() =>
    Object.fromEntries(
      Object.entries(baseForwardedAttrs.value).filter(([key]) => {
        if (listenerPattern.test(key)) return false
        return shouldStayOnFrame(key)
      })
    )
  )

  const inputAttrs = computed<Attrs>(() =>
    Object.fromEntries(
      Object.entries(baseForwardedAttrs.value).filter(([key]) => {
        if (listenerPattern.test(key)) return false
        if (shouldStayOnFrame(key)) return false
        return key !== 'id' && key !== 'value'
      })
    )
  )

  return {
    containerClass,
    containerStyle,
    describedByAttr,
    frameAttrs,
    inputAttrs
  }
}
