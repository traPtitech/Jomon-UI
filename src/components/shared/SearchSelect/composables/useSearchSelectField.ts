import { ref, useId } from 'vue'
import type { ComponentPublicInstance } from 'vue'

export function useSearchSelectField(emitClose: () => void) {
  const inputId = useId()
  const errorId = `${inputId}-error`

  const isOpen = ref(false)
  const isFocused = ref(false)

  const onOpen = () => {
    isOpen.value = true
  }

  const onClose = () => {
    isOpen.value = false
    emitClose()
  }

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
    isOpen,
    isFocused,
    onOpen,
    onClose,
    handleFocusOut,
  }
}
