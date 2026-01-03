import type { ComponentPublicInstance } from 'vue'
import { ref, useId } from 'vue'

export function useSearchSelectField() {
  const inputId = useId()
  const errorId = `${inputId}-error`

  const isFocused = ref(false)

  const handleFocusOut = (
    e: FocusEvent,
    containerRef: ComponentPublicInstance | null
  ) => {
    const next = e.relatedTarget
    const el = containerRef?.$el
    if (el instanceof HTMLElement && next instanceof Node && el.contains(next))
      return
    isFocused.value = false
  }

  return {
    inputId,
    errorId,
    isFocused,
    handleFocusOut,
  }
}
