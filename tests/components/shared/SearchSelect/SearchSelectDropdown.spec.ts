import { computed } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelectDropdown from '@/components/shared/SearchSelect/SearchSelectDropdown.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

const { mockScrollTo } = vi.hoisted(() => ({ mockScrollTo: vi.fn() }))

vi.mock('@floating-ui/vue', () => ({
  useFloating: () => ({
    floatingStyles: { value: {} },
  }),
  offset: () => ({}),
  size: () => ({}),
  autoUpdate: () => {},
}))

vi.mock('@vueuse/core', async importOriginal => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useVirtualList: (list: any) => {
      const source = typeof list === 'function' ? computed(list) : list
      const mappedList = computed(() => {
        const val = source.value || []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return val.map((item: any, index: number) => ({ data: item, index }))
      })
      return {
        list: mappedList,
        containerProps: {},
        wrapperProps: {},
        scrollTo: mockScrollTo,
      }
    },
    onClickOutside: vi.fn(),
  }
})

// Stub Teleport to render content in-place
const globalConfig = {
  stubs: {
    Teleport: { template: '<div><slot /></div>' },
  },
}

describe('SearchSelectDropdown', () => {
  const options: Option<string>[] = [
    { label: 'Option 1', key: 'opt1' },
    { label: 'Option 2', key: 'opt2' },
    { label: 'Option 3', key: 'opt3', disabled: true },
  ]

  const defaultProps = {
    filteredOptions: options,
    searchTerm: '',
    highlightedIndex: -1,
    modelValue: null,
    listboxId: 'listbox-id',
    referenceElement: null,
  }

  it('renders options correctly', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
      global: globalConfig,
    })

    const items = wrapper.findAll('div[role="option"]')
    expect(items).toHaveLength(3)
    expect(items[0]?.text()).toBe('Option 1')
    expect(items[2]?.classes()).toContain('cursor-not-allowed')
  })

  it('emits select-option when an option is clicked', async () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
      global: globalConfig,
    })

    const items = wrapper.findAll('div[role="option"]')
    await items[0]?.trigger('click')

    expect(wrapper.emitted('select-option')).toBeTruthy()
    expect(wrapper.emitted('select-option')?.[0]).toEqual(['opt1'])
  })

  it('does not emit select-option when a disabled option is clicked', async () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
      global: globalConfig,
    })

    const items = wrapper.findAll('div[role="option"]')
    await items[2]?.trigger('click')

    expect(wrapper.emitted('select-option')).toBeFalsy()
  })

  it('applies highlighted and selected styles', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        ...defaultProps,
        highlightedIndex: 0,
        modelValue: 'opt2',
      },
      global: globalConfig,
    })

    const items = wrapper.findAll('div[role="option"]')

    // index 0 is highlighted
    expect(items[0]?.classes()).toContain('bg-blue-100')
    expect(items[0]?.classes()).toContain('text-blue-500')

    // 'opt2' (index 1) is selected
    expect(items[1]?.classes()).toContain('bg-blue-100')
    expect(items[1]?.classes()).toContain('text-blue-500')

    // index 2 is disabled, different style
    expect(items[2]?.classes()).not.toContain('bg-blue-100')
  })

  it('highlights the option at highlightedIndex', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        ...defaultProps,
        highlightedIndex: 1,
      },
      global: globalConfig,
    })

    const items = wrapper.findAll('div[role="option"]')
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
      global: globalConfig,
    })

    expect(wrapper.text()).toContain('該当する項目がありません')
  })

  it('displays empty message when filteredOptions is empty and no search term', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        highlightedIndex: 0,
        filteredOptions: [], // This should remain empty for the "empty message" test
        searchTerm: '',
        modelValue: null,
        listboxId: 'listbox-id',
        referenceElement: null,
      },
      global: globalConfig,
    })

    expect(wrapper.text()).toContain('項目がありません')
  })

  it('sets aria-selected correctly', () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: {
        ...defaultProps,
        modelValue: 'opt1',
      },
      global: globalConfig,
    })

    const items = wrapper.findAll('div[role="option"]')
    expect(items[0]?.attributes('aria-selected')).toBe('true')
    expect(items[1]?.attributes('aria-selected')).toBe('false')
  })

  it('calls scrollIntoView when highlightedIndex changes', async () => {
    const wrapper = mount(SearchSelectDropdown, {
      props: defaultProps,
      global: globalConfig,
    })

    await wrapper.setProps({ highlightedIndex: 1 })

    // Wait for nextTick inside the watcher
    await wrapper.vm.$nextTick()
    // And potentially another one for the async function
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockScrollTo).toHaveBeenCalled()

    wrapper.unmount()
  })
})
