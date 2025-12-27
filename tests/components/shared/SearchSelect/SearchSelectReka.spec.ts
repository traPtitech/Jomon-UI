import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelectReka from '@/components/shared/SearchSelect/SearchSelectReka.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

vi.stubGlobal('ResizeObserver', class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
})

// Reka UI uses scrollIntoView which isn't in JSDOM
Element.prototype.scrollIntoView = vi.fn()
Element.prototype.hasPointerCapture = vi.fn()
Element.prototype.releasePointerCapture = vi.fn()
Element.prototype.setPointerCapture = vi.fn()

const testOptions: Option<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
]

describe('SearchSelectReka', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchSelectReka, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
    })
    expect(wrapper.text()).toContain('Test Label')
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
  })

  it('selects an option', async () => {
    const wrapper = mount(SearchSelectReka, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      attachTo: document.body
    })

    const input = wrapper.find('input')
    // Focus or click to open
    await input.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Simulate typing to filter
    await input.setValue('Option 1')
    await wrapper.vm.$nextTick()
    
    // Select using keyboard
    await input.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    await input.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    
    // DEBUG
    console.log('Reka events:', wrapper.emitted())

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const events = wrapper.emitted('update:modelValue')
    if (events) {
       // Expect selection
       expect(events[0]).toBeDefined()
    }
    
    wrapper.unmount()
  })
})
