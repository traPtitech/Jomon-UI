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

    // Wait for computed property to update
    expect(wrapper.text()).toContain('Option 1')
    // Option 2 should be filtered out (assuming logic works, but text might still be in DOM if not re-rendered, checking filteredOptions length via internal state if possible or DOM elements)
    // Since we can't easily access internal state without exposing it, we check DOM.
    // However, the dropdown renders based on filteredOptions.
    // We need to ensure the dropdown is open.
    // The component opens dropdown on focus.

    // Check if Option 2 is NOT visible/rendered in the list
    // Note: The component renders all filtered options.
    const buttons = wrapper.findAll('button.relative.flex')
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
      .findAll('button.relative.flex')
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
      .findAll('button.relative.flex')
      .find(b => b.text() === 'Option 3')
    await option3Button?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('allows adding custom value when allowCustom is true', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
        allowCustom: true,
      },
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('Custom Value')

    // Find the "Add custom" button
    const addButton = wrapper
      .findAll('button')
      .find(b => b.text().includes('"Custom Value" を追加'))
    expect(addButton?.exists()).toBe(true)

    await addButton?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Custom Value'])
  })

  it('does not allow adding custom value when allowCustom is false', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
        allowCustom: false,
      },
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('Custom Value')

    const addButton = wrapper
      .findAll('button')
      .find(b => b.text().includes('"Custom Value" を追加'))
    expect(addButton).toBeUndefined()
  })
})
