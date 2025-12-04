import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SearchMultiSelect from '@/components/shared/SearchMultiSelect.vue'
import type { Option } from '@/components/shared/types'

const options: Option<string>[] = [
  { key: 'Option 1', value: 'opt1' },
  { key: 'Option 2', value: 'opt2' },
  { key: 'Option 3', value: 'opt3', disabled: true },
]

describe('SearchMultiSelect', () => {
  it('renders properly with options', () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: [],
      },
    })
    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('selects multiple options', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: [],
      },
    })

    await wrapper.find('input').trigger('focus')

    const option1Button = wrapper
      .findAll('li[role="option"]')
      .find(b => b.text() === 'Option 1')
    await option1Button?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1']])

    await wrapper.setProps({ modelValue: ['opt1'] })

    const option2Button = wrapper
      .findAll('li[role="option"]')
      .find(b => b.text() === 'Option 2')
    await option2Button?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([
      ['opt1', 'opt2'],
    ])
  })

  it('deselects an option', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
    })

    await wrapper.find('input').trigger('focus')

    const option1Button = wrapper
      .findAll('li[role="option"]')
      .find(b => b.text() === 'Option 1')
    await option1Button?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt2']])
  })

  it('allows adding custom value when allowCustom is true', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: [],
        allowCustom: true,
      },
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('Custom Value')

    const addButton = wrapper
      .findAll('li[role="option"]')
      .find(b => b.text().includes('"Custom Value" を追加'))
    expect(addButton?.exists()).toBe(true)

    await addButton?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['Custom Value'],
    ])
  })

  it('removes last item on Backspace when search term is empty', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
    })

    await wrapper.find('input').trigger('focus')
    // Ensure search term is empty (default)
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1']])
  })

  it('removes item when chip delete button is clicked', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
    })

    // Find the delete button for the first item (opt1)
    // The template renders items in order of modelValue
    const deleteButtons = wrapper.findAll('button.rounded-full')
    expect(deleteButtons).toHaveLength(2)

    await deleteButtons[0]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt2']])
  })
})
