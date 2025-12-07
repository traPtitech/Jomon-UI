import { nextTick, ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { useSearchSelectHighlight } from '@/components/shared/SearchSelect/composables/useSearchSelectHighlight'
import type { MenuState } from '@/components/shared/SearchSelect/composables/useSearchSelectMenu'
import type { Option } from '@/components/shared/types'

describe('useSearchSelectHighlight', () => {
  const options: Option<string>[] = [
    { key: 'Option 1', value: '1' },
    { key: 'Option 2', value: '2' },
  ]
  const listboxId = 'test-id'

  it('should initialize with no highlight', () => {
    const filteredOptions = ref(options)
    const menuState = ref<MenuState>('close')
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      menuState,
      listboxId
    )
    expect(highlightedIndex.value).toBe(-1)
  })

  it('should highlight first option when menu opens', async () => {
    const filteredOptions = ref(options)
    const menuState = ref<MenuState>('close')
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      menuState,
      listboxId
    )

    menuState.value = 'presearch'
    await nextTick()
    expect(highlightedIndex.value).toBe(0)
  })

  it('should reset highlight when menu closes', async () => {
    const filteredOptions = ref(options)
    const menuState = ref<MenuState>('presearch')
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      menuState,
      listboxId
    )

    highlightedIndex.value = 1
    menuState.value = 'close'
    await nextTick()
    expect(highlightedIndex.value).toBe(-1)
  })

  it('should reset highlight when options change', async () => {
    const filteredOptions = ref(options)
    const menuState = ref<MenuState>('presearch')
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      menuState,
      listboxId
    )

    highlightedIndex.value = 1
    filteredOptions.value = [{ key: 'Option 3', value: '3' }]
    await nextTick()
    expect(highlightedIndex.value).toBe(0)
  })

  it('should provide activeOptionId', () => {
    const filteredOptions = ref(options)
    const menuState = ref<MenuState>('close')
    const { highlightedIndex, activeOptionId } = useSearchSelectHighlight(
      filteredOptions,
      menuState,
      listboxId
    )

    highlightedIndex.value = 1
    expect(activeOptionId.value).toBe(`${listboxId}-option-1`)

    highlightedIndex.value = -1
    expect(activeOptionId.value).toBeUndefined()
  })
})
