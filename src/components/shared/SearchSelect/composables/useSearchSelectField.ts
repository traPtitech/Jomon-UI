import { ref, useId } from 'vue'
import type { ComponentPublicInstance } from 'vue'

export function useSearchSelectField() {
  const inputId = useId()
  const errorId = `${inputId}-error`

  const isFocused = ref(false)

  const handleFocusOut = (
    e: FocusEvent,
    containerRef: ComponentPublicInstance | null
  ) => {
    const next = e.relatedTarget
    const root = containerRef?.$el as HTMLElement | undefined
    if (next instanceof Node && root?.contains(next)) {
      return
    }
    isFocused.value = false
  }

  return {
    inputId,
    errorId,
    isFocused,
    handleFocusOut,
  }
}
