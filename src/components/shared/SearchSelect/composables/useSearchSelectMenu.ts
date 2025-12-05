import { type Ref, ref, watch } from 'vue'

import { onClickOutside } from '@vueuse/core'

export type MenuState = 'close' | 'presearch' | 'searched'

export interface UseSearchSelectMenuProps {
  disabled?: boolean | undefined
}

export const useSearchSelectMenu = (
  props: UseSearchSelectMenuProps,
  dropdownRef: Ref<HTMLElement | null>,
  emit: (e: 'close') => void
) => {
  const menuState = ref<MenuState>('close')

  const toggleMenu = () => {
    if (props.disabled) return
    if (menuState.value === 'close') {
      menuState.value = 'presearch'
    } else {
      menuState.value = 'close'
    }
  }

  const openMenu = () => {
    if (props.disabled) return
    if (menuState.value === 'close') {
      menuState.value = 'presearch'
    }
  }

  const closeMenu = () => {
    menuState.value = 'close'
  }

  onClickOutside(dropdownRef, () => {
    closeMenu()
  })

  watch(
    menuState,
    newVal => {
      if (newVal === 'close') {
        emit('close')
      }
    },
    { flush: 'sync' }
  )

  return {
    menuState,
    toggleMenu,
    openMenu,
    closeMenu,
  }
}
