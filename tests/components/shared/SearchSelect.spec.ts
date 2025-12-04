import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SearchSelect from '@/components/shared/SearchSelect.vue'
import type { Option } from '@/components/shared/types'

const options: Option<string>[] = [
  { key: 'Option 1', value: 'opt1' },
  { key: 'Option 2', value: 'opt2' },
  { key: 'Option 3', value: 'opt3', disabled: true },
]

describe('SearchSelect', () => {
  it('renders properly with options', () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
      },
    })
    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('filters options based on search term', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
      },
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('Option 1')

    const buttons = wrapper.findAll('li[role="option"]')
    const texts = buttons.map(b => b.text())
    expect(texts).toContain('Option 1')
    expect(texts).not.toContain('Option 2')
  })

  it('selects an option', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
      },
    })

    await wrapper.find('input').trigger('focus')
    const option1Button = wrapper
      .findAll('li[role="option"]')
      .find(b => b.text() === 'Option 1')
    await option1Button?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt1'])
  })

  it('does not select disabled option', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
      },
    })

    await wrapper.find('input').trigger('focus')
    const option3Button = wrapper
      .findAll('li[role="option"]')
      .find(b => b.text() === 'Option 3')
    expect(option3Button?.exists()).toBe(true)
    await option3Button?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('navigates options with keyboard', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await wrapper.vm.$nextTick() // Wait for watcher to update highlightedIndex
    await new Promise(resolve => setTimeout(resolve, 0)) // Wait for macro task just in case

    const optionsList = wrapper.findAll('li[role="option"]')

    // Focus should automatically highlight the first option
    expect(optionsList[0]?.classes()).toContain('bg-blue-100')
    expect(optionsList[0]?.classes()).toContain('text-blue-500')

    // ArrowDown to highlight second option
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(optionsList[1]?.classes()).toContain('bg-blue-100')
    expect(optionsList[1]?.classes()).toContain('text-blue-500')
    expect(optionsList[0]?.classes()).not.toContain('bg-blue-100')

    // Enter to select
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt2'])
  })

  it('closes menu when clicking outside', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
      },
      attachTo: document.body, // Needed for document click listener
    })

    const input = wrapper.find('input')
    await input.trigger('focus')

    // Menu should be open
    expect(wrapper.find('ul[role="listbox"]').exists()).toBe(true)

    // Click outside
    document.body.click()
    await wrapper.vm.$nextTick()

    // Menu should be closed
    expect(wrapper.find('ul[role="listbox"]').exists()).toBe(false)

    wrapper.unmount()
  })
})
