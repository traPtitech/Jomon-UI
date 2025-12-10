/* eslint-disable vue/one-component-per-file */
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
  flip: () => ({}),
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
        containerProps: { ref: { value: null } },
        wrapperProps: {},
        scrollTo: mockScrollTo,
      }
    },
  }
})

vi.mock('@headlessui/vue', async () => {
  const { defineComponent, h, inject, provide } = await import('vue')

  const MockCombobox = defineComponent({
    name: 'HeadlessCombobox',
    props: {
      modelValue: {
        type: [String, Number, Array, Object],
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      nullable: {
        type: Boolean,
        default: false,
      },
      as: {
        type: String,
        default: 'div',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:modelValue'],
    setup(_, { slots, emit }) {
      provide('test-combobox', {
        select: (val: unknown) => {
          emit('update:modelValue', val)
        },
      })
      return () =>
        h('div', { 'data-test': 'combobox' }, slots.default?.({ open: true }))
    },
  })

  const MockComboboxInput = defineComponent({
    name: 'HeadlessComboboxInput',
    props: {
      displayValue: {
        type: Function,
        default: undefined,
      },
      as: {
        type: String,
        default: 'input',
      },
    },
    setup(props, { slots, attrs }) {
      if (props.as === 'template') {
        return () =>
          slots.default?.({ value: null, inputAttr: {}, inputEvents: {} })
      }
      return () =>
        h(
          'input',
          { ...attrs, 'data-test': 'combobox-input' },
          slots.default?.()
        )
    },
  })

  const MockComboboxButton = defineComponent({
    name: 'HeadlessComboboxButton',
    setup(_, { slots }) {
      return () =>
        h('button', { 'data-test': 'combobox-button' }, slots.default?.())
    },
  })

  const MockComboboxOptions = defineComponent({
    name: 'HeadlessComboboxOptions',
    props: {
      static: {
        type: Boolean,
        default: false,
      },
    },
    setup(_, { slots }) {
      return () =>
        h('ul', { 'data-test': 'combobox-options' }, slots.default?.())
    },
  })

  const MockComboboxOption = defineComponent({
    name: 'HeadlessComboboxOption',
    props: {
      value: {
        type: [String, Number, Object],
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      as: {
        type: String,
        default: 'li',
      },
    },
    setup(props, { slots }) {
      const context = inject('test-combobox') as {
        select: (val: unknown) => void
      }
      const handleClick = () => {
        if (!props.disabled) {
          context.select(props.value)
        }
      }
      return () =>
        h(
          'li',
          {
            'data-test': 'combobox-option',
            onClick: handleClick,
          },
          slots.default?.({ active: false, selected: false })
        )
    },
  })

  return {
    Combobox: MockCombobox,
    ComboboxInput: MockComboboxInput,
    ComboboxButton: MockComboboxButton,
    ComboboxOptions: MockComboboxOptions,
    ComboboxOption: MockComboboxOption,
  }
})

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
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('filters options based on search term', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
    })

    const input = wrapper.find('input')
    await input.setValue('Option 1')

    // Check if options are filtered
    expect(wrapper.text()).toContain('Option 1')
    expect(wrapper.text()).not.toContain('Option 2')
  })

  it('selects an option', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
    })

    await wrapper.find('input').trigger('focus')
    const option1Button = wrapper
      .findAll('li')
      .find(b => b.text() === 'Option 1')

    // With our mock, simple click works
    await option1Button?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt1'])
  })

  it('does not select disabled option', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      global: globalConfig,
    })

    const disabledOption = wrapper
      .findAll('li')
      .find(b => b.text() === 'Option 3')

    await disabledOption?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it.todo('navigates options with keyboard', async () => {
    // ...
  })

  it.todo('closes menu when clicking outside', async () => {
    const wrapper = mount(SearchSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: null,
      },
      attachTo: document.body,
      global: globalConfig,
    })

    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.find('ul').exists()).toBe(true)

    document.body.click()
    await wrapper.vm.$nextTick()

    // Menu should be closed
    // Combobox unmounts internal components when closed?
    // Usually yes (unless `static` prop which we apply to ComboboxOptions... wait, SearchSelectDropdown applies static?
    // Ah, SearchSelectDropdown.vue applies `static` to `ComboboxOptions`.
    // BUT `SearchSelectDropdown` itself is inside `v-if="open"` in `SearchSelect.vue`.
    // So the Wrapper (`SearchSelectDropdown`) is removed from DOM when `open` is false.
    // So checking wrapper.find('ul').exists() works.
    expect(wrapper.find('ul').exists()).toBe(false)

    wrapper.unmount()
  })
})
