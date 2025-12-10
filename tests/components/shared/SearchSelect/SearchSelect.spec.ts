import { computed } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'
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
  }
})

const options: Option<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
  { label: 'Option 3', key: 'opt3', disabled: true },
]

// Stub Teleport to render content in-place
const globalConfig = {
  stubs: {
    Teleport: { template: '<div><slot /></div>' },
  },
}

describe('SearchSelect', () => {
  it('renders properly with options', () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
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
      global: globalConfig,
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('Option 1')

    const buttons = wrapper.findAll('div[role="option"]')
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
      global: globalConfig,
    })

    await wrapper.find('input').trigger('focus')
    const option1Button = wrapper
      .findAll('div[role="option"]')
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
      global: globalConfig,
    })

    await wrapper.find('input').trigger('focus')
    const option3Button = wrapper
      .findAll('div[role="option"]')
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
      global: globalConfig,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await wrapper.vm.$nextTick() // Wait for watcher to update highlightedIndex
    await new Promise(resolve => setTimeout(resolve, 0)) // Wait for macro task just in case

    const optionsList = wrapper.findAll('div[role="option"]')

    // Focus should automatically highlight the first option
    expect(optionsList[0]?.classes()).toContain('bg-blue-100')
    expect(optionsList[0]?.classes()).toContain('text-blue-500')

    // ArrowDown to highlight second option
    await input.trigger('keydown', { key: 'ArrowDown' })
    const updatedOptionsList = wrapper.findAll('div[role="option"]')

    expect(updatedOptionsList[1]?.classes()).toContain('bg-blue-100')
    expect(updatedOptionsList[1]?.classes()).toContain('text-blue-500')
    expect(updatedOptionsList[0]?.classes()).not.toContain('bg-blue-100')

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
      global: globalConfig,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')

    // Menu should be open
    expect(wrapper.find('div[role="listbox"]').exists()).toBe(true)

    // Click outside
    document.body.click()
    await wrapper.vm.$nextTick()

    // Menu should be closed
    expect(wrapper.find('div[role="listbox"]').exists()).toBe(false)

    wrapper.unmount()
  })
})
