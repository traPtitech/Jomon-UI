import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelectHeadless from '@/components/shared/SearchSelect/SearchSelectHeadless.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

// Stub ResizeObserver if needed (Headless UI might use it internally or via floating-ui deps if any)
vi.stubGlobal('ResizeObserver', class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
})

const testOptions: Option<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
  { label: 'Option 3', key: 'opt3', disabled: true },
]

describe('SearchSelectHeadless', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchSelectHeadless, {
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

  it('filters options', async () => {
    const wrapper = mount(SearchSelectHeadless, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      attachTo: document.body
    })

    const input = wrapper.find('input')
    await input.trigger('click') // Open combobox
    await input.setValue('Option 1')
    
    // Headless UI updates are usually fast, but await nextTick is safe
    await wrapper.vm.$nextTick()

    // ComboboxOptions are rendered. Headless UI often uses portals but here we didn't stub Teleport so it might be in body or inline?
    // The implementation used <TransitionRoot> which wraps <ComboboxOptions>.
    // Usually Headless UI renders options only when open.
    
    // We need to find the options. They might be in a portal if Headless UI forces it, 
    // but default <ComboboxOptions> renders in place unless <Portal> is used (which is separate in Headless UI 1.7).
    // The implementation didn't use <Portal>, so it should be in the wrapper or body.
    
    // Wait for transition?
    await new Promise(r => setTimeout(r, 150)) 

    // Look for text in the document body if portals are involved, or wrapper if not.
    // Since we attached to document.body, checking document.body.innerHTML or wrapper.html()
    
    // Actually, Headless UI 1.7 ComboboxOptions renders in place by default.
    const options = wrapper.findAll('li')
    // Should verify one is visible/exists that matches 'Option 1'
    // Depending on implementation, filtered out options might not be rendered.
    
    // Note: Headless UI filters by unmounting/not rendering non-matching options if we filter in the v-for.
    // In my implementation: v-for="option in filteredOptions"
    
    const visibleOptions = options.filter(o => o.text().includes('Option 1'))
    const hiddenOptions = options.filter(o => o.text().includes('Option 2'))
    
    expect(visibleOptions.length).toBeGreaterThan(0)
    expect(hiddenOptions.length).toBe(0)
    
    wrapper.unmount()
  })

  it('selects an option', async () => {
    const wrapper = mount(SearchSelectHeadless, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      attachTo: document.body
    })

    const input = wrapper.find('input')
    // Trigger focus which should click button and open
    await input.trigger('focus')
    
    await wrapper.vm.$nextTick()
    
    // Navigate down to first option
    await input.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    
    // Select it
    await input.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    
    // Check emit
    console.log('Emitted events (keyboard):', wrapper.emitted())
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const events = wrapper.emitted('update:modelValue')
    if (events) {
      expect(events[0]).toEqual(['opt1'])
    }
    
    // Note: wrapper.props('modelValue') won't update unless we manually update it or use a real parent component.
    // Checking emitted event is the correct way for unit testing.
    
    wrapper.unmount()
  })
})