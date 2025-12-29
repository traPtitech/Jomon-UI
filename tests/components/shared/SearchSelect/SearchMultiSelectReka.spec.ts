import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchMultiSelectReka from '@/components/shared/SearchSelect/SearchMultiSelectReka.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

vi.stubGlobal(
  'ResizeObserver',
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

// Reka UI uses scrollIntoView which isn't in JSDOM
Element.prototype.scrollIntoView = vi.fn()
Element.prototype.hasPointerCapture = vi.fn()
Element.prototype.releasePointerCapture = vi.fn()
Element.prototype.setPointerCapture = vi.fn()

const testOptions: Option<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
]

describe('SearchMultiSelectReka', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchMultiSelectReka, {
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

  it('selects multiple options', async () => {
    const wrapper = mount(SearchMultiSelectReka, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: [],
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    // Focus or click to open
    await input.trigger('click')
    await wrapper.vm.$nextTick()

    // Simulate typing
    await input.setValue('Option 1')
    await input.trigger('input')
    await wrapper.vm.$nextTick()

    // Select first
    await input.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    await input.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeDefined()
    expect(events?.[0]).toEqual([['opt1']])
    wrapper.unmount()
  })
})
