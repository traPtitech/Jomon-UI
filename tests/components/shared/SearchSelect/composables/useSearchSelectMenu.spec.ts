import { nextTick, ref } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import { useSearchSelectMenu } from '@/components/shared/SearchSelect/composables/useSearchSelectMenu'

vi.mock('@vueuse/core', () => ({
  onClickOutside: vi.fn(),
}))

describe('useSearchSelectMenu', () => {
  it('should initialize with closed state', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { isOpen } = useSearchSelectMenu({}, dropdownRef, emit)
    expect(isOpen.value).toBe(false)
  })

  it('should toggle menu state', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { isOpen, toggleMenu } = useSearchSelectMenu({}, dropdownRef, emit)

    toggleMenu()
    expect(isOpen.value).toBe(true)

    toggleMenu()
    expect(isOpen.value).toBe(false)
  })

  it('should not toggle if disabled', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { isOpen, toggleMenu } = useSearchSelectMenu(
      { disabled: true },
      dropdownRef,
      emit
    )

    toggleMenu()
    expect(isOpen.value).toBe(false)
  })

  it('should open menu', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { isOpen, openMenu } = useSearchSelectMenu({}, dropdownRef, emit)

    openMenu()
    expect(isOpen.value).toBe(true)

    // Should stay open (or presearch) if called again
    openMenu()
    expect(isOpen.value).toBe(true)
  })

  it('should close menu', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { isOpen, openMenu, closeMenu } = useSearchSelectMenu(
      {},
      dropdownRef,
      emit
    )

    openMenu()
    expect(isOpen.value).toBe(true)

    closeMenu()
    expect(isOpen.value).toBe(false)
  })

  it('should emit close event when menu closes', () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { isOpen, openMenu, closeMenu } = useSearchSelectMenu(
      {},
      dropdownRef,
      emit
    )

    openMenu()
    expect(isOpen.value).toBe(true)
    expect(emit).not.toHaveBeenCalled()

    closeMenu()
    expect(emit).toHaveBeenCalledWith('close')
  })

  it('should be reactive', async () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const { isOpen } = useSearchSelectMenu({}, dropdownRef, emit)

    let dummy = 0

    const { watch } = await import('vue')
    watch(isOpen, () => {
      dummy++
    })

    isOpen.value = true
    await nextTick()
    expect(dummy).toBe(1)
  })

  it('should close menu when disabled prop changes to true', async () => {
    const dropdownRef = ref(null)
    const emit = vi.fn()
    const props = ref({ disabled: false })

    const { isOpen, openMenu } = useSearchSelectMenu(
      props.value,
      dropdownRef,
      emit
    )

    openMenu()
    expect(isOpen.value).toBe(true)

    // Simulate prop change
    props.value.disabled = true
    await nextTick()
    expect(isOpen.value).toBe(false)
  })
})
