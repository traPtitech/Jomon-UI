import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelectDropdown from '@/components/shared/SearchSelectDropdown.vue'
import type { Option } from '@/components/shared/types'

describe('SearchSelectDropdown', () => {
  const options: Option<string>[] = [
    { key: 'Option 1', value: 'opt1' },
    { key: 'Option 2', value: 'opt2' },
    { key: 'Option 3', value: 'opt3', disabled: true },
  ]

  const defaultProps = {
    filteredOptions: options,
    searchTerm: '',
    highlightedIndex: -1,
    modelValue: null,
    id: 'test-dropdown',
  }

  it('renders options correctly', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
    })

    const items = wrapper.findAll('li[role="option"]')
    expect(items).toHaveLength(3)
    expect(items[0]?.text()).toBe('Option 1')
    expect(items[2]?.classes()).toContain('cursor-not-allowed')
  })

  it('emits select-option when an option is clicked', async () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
    })

    const items = wrapper.findAll('li[role="option"]')
    await items[0]?.trigger('click')

    expect(wrapper.emitted('select-option')).toBeTruthy()
    expect(wrapper.emitted('select-option')?.[0]).toEqual(['opt1'])
  })

  it('does not emit select-option when a disabled option is clicked', async () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
    })

    const items = wrapper.findAll('li[role="option"]')
    await items[2]?.trigger('click')

    expect(wrapper.emitted('select-option')).toBeFalsy()
  })

  it('highlights the option at highlightedIndex', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        ...defaultProps,
        highlightedIndex: 1,
      },
    })

    const items = wrapper.findAll('li[role="option"]')
    expect(items[1]?.classes()).toContain('bg-blue-100')
    expect(items[1]?.classes()).toContain('text-blue-500')
  })

  it('displays no results message when filteredOptions is empty', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        ...defaultProps,
        filteredOptions: [],
        searchTerm: 'query',
      },
    })

    expect(wrapper.text()).toContain('該当する項目がありません')
  })

  it('displays empty message when filteredOptions is empty and no search term', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        ...defaultProps,
        filteredOptions: [],
        searchTerm: '',
      },
    })

    expect(wrapper.text()).toContain('項目がありません')
  })

  it('sets aria-selected correctly', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        ...defaultProps,
        modelValue: 'opt1',
      },
    })

    const items = wrapper.findAll('li[role="option"]')
    expect(items[0]?.attributes('aria-selected')).toBe('true')
    expect(items[1]?.attributes('aria-selected')).toBe('false')
  })

  it('calls scrollIntoView when highlightedIndex changes', async () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoViewMock

    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
      attachTo: document.body, // Needed for scrolling to work potentially, or just to ensure elements are "visible" to jsdom
    })

    await wrapper.setProps({ highlightedIndex: 1 })

    // Wait for nextTick inside the watcher
    await wrapper.vm.$nextTick()
    // And potentially another one for the async function
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(scrollIntoViewMock).toHaveBeenCalled()

    wrapper.unmount()
  })
})
