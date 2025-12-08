import { type Ref, ref, watch } from 'vue'

import { onClickOutside } from '@vueuse/core'

export interface UseSearchSelectMenuProps {
  disabled?: boolean | undefined
}

export const useSearchSelectMenu = (
  props: UseSearchSelectMenuProps,
  dropdownRef: Ref<HTMLElement | null>,
  onClose: () => void
) => {
  const isOpen = ref(false)

  const toggleMenu = () => {
    if (props.disabled) return
    isOpen.value = !isOpen.value
  }

  const openMenu = () => {
    if (props.disabled) return
    isOpen.value = true
  }

  const closeMenu = () => {
    isOpen.value = false
  }

  onClickOutside(dropdownRef, () => {
    closeMenu()
  })

  // Close menu if disabled prop changes to true
  watch(
    () => props.disabled,
    disabled => {
      if (disabled) {
        isOpen.value = false
      }
    }
  )

  watch(
    isOpen,
    newVal => {
      if (!newVal) {
        onClose()
      }
    },
    { flush: 'sync' }
  )

  return {
    isOpen,
    toggleMenu,
    openMenu,
    closeMenu,
  }
}
