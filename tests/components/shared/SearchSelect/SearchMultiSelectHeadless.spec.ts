import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchMultiSelectHeadless from '@/components/shared/SearchSelect/SearchMultiSelectHeadless.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

vi.stubGlobal(
  'ResizeObserver',
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

const testOptions: Option<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
]

describe('SearchMultiSelectHeadless', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchMultiSelectHeadless, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: [],
      },
    })
    expect(wrapper.text()).toContain('Test Label')
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
  })
})
