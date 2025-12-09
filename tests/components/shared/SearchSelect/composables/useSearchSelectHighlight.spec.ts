import { nextTick, ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { useSearchSelectHighlight } from '@/components/shared/SearchSelect/composables/useSearchSelectHighlight'
import type { Option } from '@/components/shared/SearchSelect/types'

describe('useSearchSelectHighlight', () => {
  const options: Option<string>[] = [
    { key: 'Option 1', value: '1' },
    { key: 'Option 2', value: '2' },
  ]
  const listboxId = 'test-id'

  it('should initialize with no highlight', () => {
    const filteredOptions = ref(options)
    const isOpen = ref(false)
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      isOpen,
      listboxId
    )
    expect(highlightedIndex.value).toBe(-1)
  })

  it('should highlight first option when menu opens', async () => {
    const filteredOptions = ref(options)
    const isOpen = ref(false)
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      isOpen,
      listboxId
    )

    isOpen.value = true
    await nextTick()
    expect(highlightedIndex.value).toBe(0)
  })

  it('should reset highlight when menu closes', async () => {
    const filteredOptions = ref(options)
    const isOpen = ref(true)
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      isOpen,
      listboxId
    )

    highlightedIndex.value = 1
    isOpen.value = false
    await nextTick()
    expect(highlightedIndex.value).toBe(-1)
  })

  it('should reset highlight when options change', async () => {
    const filteredOptions = ref(options)
    const isOpen = ref(true)
    const { highlightedIndex } = useSearchSelectHighlight(
      filteredOptions,
      isOpen,
      listboxId
    )

    highlightedIndex.value = 1
    filteredOptions.value = [{ key: 'Option 3', value: '3' }]
    await nextTick()
    expect(highlightedIndex.value).toBe(0)
  })

  it('should provide activeOptionId', () => {
    const filteredOptions = ref(options)
    const isOpen = ref(false)
    const { highlightedIndex, activeOptionId } = useSearchSelectHighlight(
      filteredOptions,
      isOpen,
      listboxId
    )

    highlightedIndex.value = 1
    expect(activeOptionId.value).toBe(`${listboxId}-option-1`)

    highlightedIndex.value = -1
    expect(activeOptionId.value).toBeUndefined()
  })
})
