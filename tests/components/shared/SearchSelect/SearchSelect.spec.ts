import { CheckIcon } from '@heroicons/vue/24/outline'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

// Mock ResizeObserver for Zag.js/Floating UI
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
  { label: 'Option 3', key: 'opt3', disabled: true },
]

// Stub Teleport to render content in-place
const globalConfig = {
  stubs: {
    Teleport: true,
  },
}

describe('SearchSelect', () => {
  it('renders properly with options', () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
    })
    expect(wrapper.text()).toContain('Test Label')
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    // Check ID for accessibility
    expect(input.attributes('id')).toBeDefined()
    const id = input.attributes('id')
    expect(wrapper.find('label').attributes('for')).toBe(id)
  })

  it('filters options based on search term', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('click')
    await input.setValue('Option 1')

    // Wait for Zag to update
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    const list = wrapper.find('ul')
    expect(list.exists()).toBe(true)
    expect(list.text()).toContain('Option 1')
    expect(list.text()).not.toContain('Option 2')

    wrapper.unmount()
  })

  it('selects an option', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('click')

    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    const options = wrapper.findAll('li')
    const option1 = options.find(o => o.text().includes('Option 1'))

    expect(option1?.exists()).toBe(true)
    await option1?.trigger('click')

    await wrapper.vm.$nextTick()

    // Zag emits array of keys, our component emits single key
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt1'])

    wrapper.unmount()
  })

  it('does not select disabled option', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('click')
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    const disabledOption = wrapper
      .findAll('li')
      .find(o => o.text().includes('Option 3'))

    expect(disabledOption?.exists()).toBe(true)
    // Zag adds data-disabled attribute
    expect(disabledOption?.attributes('data-disabled')).toBeDefined()

    await disabledOption?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  it('closes menu when clicking outside', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('click')
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    expect(wrapper.find('ul').exists()).toBe(true)

    // Simulate click outside
    document.body.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true })
    )
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    document.body.click()

    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    expect(wrapper.find('ul').exists()).toBe(false)

    wrapper.unmount()
  })
  it('handles number keys correctly', async () => {
    const numberOptions: Option<number>[] = [
      { label: 'Num 1', key: 1 },
      { label: 'Num 2', key: 2 },
    ]

    const wrapper = mount(SearchSelect, {
      props: {
        options: numberOptions,
        label: 'Number Select',
        modelValue: 1, // Start selected
      },
      global: globalConfig,
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('click')
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    const list = wrapper.find('ul')
    // Zag + string conversion means check serialized value or label
    const option1 = list.findAll('li').find(o => o.text().includes('Num 1'))

    // Check if it's highlighted/selected (CheckIcon exists)
    expect(option1?.findComponent(CheckIcon).exists()).toBe(true)

    wrapper.unmount()
  })

  it('selects all text on focus', async () => {
    const wrapper = mount(SearchSelect, {
      props: { options: testOptions, label: 'Test', modelValue: 'opt1' },
      global: globalConfig,
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement
    // Mock select method
    const selectMock = vi.fn()
    element.select = selectMock

    await input.trigger('focus')
    expect(selectMock).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('disables filtering if input matches selected label (Smart Filtering)', async () => {
    const wrapper = mount(SearchSelect, {
      props: { options: testOptions, label: 'Test', modelValue: 'opt1' },
      global: globalConfig,
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('click')
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    // Assuming input value is 'Option 1' (Zag sets it from filtered items or initial)
    // Actually, Zag manages inputValue. The computed `effectiveSearchTerm` logic is in useSearchSelectMachine.
    // If input value is 'Option 1' (matches label), filter should be empty -> all options shown.

    // Simulate Zag updating input value to 'Option 1' (which happens on selection or initial load usually)
    // Ideally we set input value to 'Option 1' manually to mimic this state
    await input.setValue('Option 1')
    await wrapper.vm.$nextTick()

    const list = wrapper.find('ul')
    expect(list.exists()).toBe(true)
    // Should contain ALL options, not just Option 1
    expect(list.text()).toContain('Option 1')
    expect(list.text()).toContain('Option 2')

    wrapper.unmount()
  })
})
