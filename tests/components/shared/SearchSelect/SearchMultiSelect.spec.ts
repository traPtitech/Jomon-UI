import { computed } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchMultiSelect from '@/components/shared/SearchSelect/SearchMultiSelect.vue'
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

describe('SearchMultiSelect', () => {
  it('renders properly with options', () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: [],
      },
      global: globalConfig,
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
      global: globalConfig,
    })

    await wrapper.find('input').trigger('focus')

    const option1Button = wrapper
      .findAll('div[role="option"]')
      .find(b => b.text() === 'Option 1')
    await option1Button?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1']])

    await wrapper.setProps({ modelValue: ['opt1'] })

    const option2Button = wrapper
      .findAll('div[role="option"]')
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
      global: globalConfig,
    })

    await wrapper.find('input').trigger('focus')

    const option1Button = wrapper
      .findAll('div[role="option"]')
      .find(b => b.text() === 'Option 1')
    await option1Button?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt2']])
  })

  it('removes last item on Backspace when search term is empty', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
      global: globalConfig,
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
      global: globalConfig,
    })

    // Find the delete button for the first item (opt1)
    // The template renders items in order of modelValue
    const deleteButtons = wrapper.findAll('button.rounded-full')
    expect(deleteButtons).toHaveLength(2)

    await deleteButtons[0]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // Initial was ['opt1', 'opt2'], removing 'opt1' (index 0) results in [['opt2']]
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt2']])
  })

  it('shows dynamic placeholder when items are selected', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
        placeholder: 'Default Placeholder',
      },
      global: globalConfig,
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('2個選択中...')

    await wrapper.setProps({ modelValue: [] })
    expect(input.attributes('placeholder')).toBe('Default Placeholder')
  })
})
