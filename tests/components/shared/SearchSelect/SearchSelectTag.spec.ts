import { nextTick } from 'vue'

import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelectTag from '@/components/shared/SearchSelect/SearchSelectTag.vue'
import { TagRepositoryKey } from '@/di'
import type { Tag } from '@/features/tag/entities'

describe('SearchSelectTag', () => {
  const mockTags: { key: string; value: Tag }[] = [
    { key: 'Tag 1', value: { id: '1', name: 'Tag 1' } },
    { key: 'Tag 2', value: { id: '2', name: 'Tag 2' } },
  ]
  const createWrapper = (initialTags: Tag[] = []) => {
    return mount(SearchSelectTag, {
      props: {
        modelValue: initialTags,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              tag: {
                tags: mockTags.map(t => t.value),
              },
            },
          }),
        ],
        provide: {
          [TagRepositoryKey as symbol]: {},
        },
      },
    })
  }

  it('renders correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('maps modelValue to selected names', () => {
    const initialTags = [mockTags[0]?.value].filter((t): t is Tag => !!t)
    const wrapper = createWrapper(initialTags)

    const searchMultiSelect = wrapper.getComponent({
      name: 'SearchMultiSelect',
    })
    expect(searchMultiSelect.props('modelValue')).toEqual(['1'])
  })

  it('updates modelValue when selection changes', async () => {
    const wrapper = createWrapper()
    const searchMultiSelect = wrapper.getComponent({
      name: 'SearchMultiSelect',
    })

    await searchMultiSelect.vm.$emit('update:modelValue', ['2'])

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      [mockTags[1]?.value],
    ])
  })

  it('handles tags not in options (preserve existing)', async () => {
    const unknownTag: Tag = {
      id: 'unknown',
      name: 'Unknown',
    }
    const wrapper = createWrapper([unknownTag])
    const searchMultiSelect = wrapper.getComponent({
      name: 'SearchMultiSelect',
    })

    expect(searchMultiSelect.props('modelValue')).toEqual(['unknown'])

    await searchMultiSelect.vm.$emit('update:modelValue', ['unknown', '1'])

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      [unknownTag, mockTags[0]?.value],
    ])
  })

  it('filters out undefined tags', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = createWrapper()
    const searchMultiSelect = wrapper.getComponent({
      name: 'SearchMultiSelect',
    })

    await searchMultiSelect.vm.$emit('update:modelValue', ['NonExistent'])

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('updates selection when prop modelValue changes', async () => {
    const wrapper = createWrapper()
    const initialTags = [mockTags[0]?.value].filter((t): t is Tag => !!t)

    await wrapper.setProps({ modelValue: initialTags })
    await nextTick()

    const searchMultiSelect = wrapper.getComponent({
      name: 'SearchMultiSelect',
    })
    expect(searchMultiSelect.props('modelValue')).toEqual(['1'])
  })
})
