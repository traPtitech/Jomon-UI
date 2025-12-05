import { nextTick, ref } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import { useSearchSelectMenu } from '@/components/shared/composables/useSearchSelectMenu'

vi.mock('@vueuse/core', () => ({
  onClickOutside: vi.fn(),
}))

describe('useSearchSelectMenu', () => {
  it('should initialize with closed state', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { menuState } = useSearchSelectMenu({}, dropdownRef, emit)
    expect(menuState.value).toBe('close')
  })

  it('should toggle menu state', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { menuState, toggleMenu } = useSearchSelectMenu({}, dropdownRef, emit)

    toggleMenu()
    expect(menuState.value).toBe('presearch')

    toggleMenu()
    expect(menuState.value).toBe('close')
  })

  it('should not toggle if disabled', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { menuState, toggleMenu } = useSearchSelectMenu(
      { disabled: true },
      dropdownRef,
      emit
    )

    toggleMenu()
    expect(menuState.value).toBe('close')
  })

  it('should open menu', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { menuState, openMenu } = useSearchSelectMenu({}, dropdownRef, emit)

    openMenu()
    expect(menuState.value).toBe('presearch')

    // Should stay open (or presearch) if called again
    openMenu()
    expect(menuState.value).toBe('presearch')
  })

  it('should close menu', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { menuState, openMenu, closeMenu } = useSearchSelectMenu(
      {},
      dropdownRef,
      emit
    )

    openMenu()
    expect(menuState.value).toBe('presearch')

    closeMenu()
    expect(menuState.value).toBe('close')
  })

  it('should emit close event when menu closes', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { menuState, openMenu, closeMenu } = useSearchSelectMenu(
      {},
      dropdownRef,
      emit
    )

    openMenu()
    expect(menuState.value).toBe('presearch')
    expect(emit).not.toHaveBeenCalled()

    closeMenu()
    expect(emit).toHaveBeenCalledWith('close')
  })

  it('should be reactive', async () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { menuState } = useSearchSelectMenu({}, dropdownRef, emit)

    let dummy = 0

    const { watch } = await import('vue')
    watch(menuState, () => {
      dummy++
    })

    menuState.value = 'presearch'
    await nextTick()
    expect(dummy).toBe(1)
  })
})
