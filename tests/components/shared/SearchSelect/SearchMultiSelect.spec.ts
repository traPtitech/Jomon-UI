/* eslint-disable vue/one-component-per-file */
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
    setup(props, { slots, emit }) {
      provide('test-combobox', {
        select: (val: unknown) => {
          // Check for multiple (boolean attribute comes as empty string or true depending on definition,
          // but with array props it's the raw attribute value. <Combobox multiple> -> '' if compiled?
          // Actually vue-test-utils/Vue compiler usually treats boolean attributes on components:
          // If prop not defined as Boolean, it passes string "" (if shorthand) or value.
          // Let's assume presence means true.
          const isMultiple = props.multiple

          if (isMultiple) {
            const current = Array.isArray(props.modelValue)
              ? [...props.modelValue]
              : []
            const index = current.indexOf(val)
            if (index >= 0) {
              current.splice(index, 1)
            } else {
              current.push(val)
            }
            emit('update:modelValue', current)
          } else {
            emit('update:modelValue', val)
          }
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

describe('SearchMultiSelect', () => {
  it('renders properly with options', () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options: testOptions,
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
        options: testOptions,
        label: 'Test Label',
        modelValue: [],
      },
      global: globalConfig,
    })

    const option1 = wrapper
      .findAll('li')
      .find(l => l.text().includes('Option 1'))
    const option2 = wrapper
      .findAll('li')
      .find(l => l.text().includes('Option 2'))

    await option1?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1']])

    // Update props to simulate v-model update
    await wrapper.setProps({ modelValue: ['opt1'] })

    await option2?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([
      ['opt1', 'opt2'],
    ])
  })

  it('deselects an option', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
      global: globalConfig,
    })

    const option1 = wrapper
      .findAll('li')
      .find(l => l.text().includes('Option 1'))

    await option1?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt2']])
  })

  it('removes last item on Backspace when search term is empty', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
      global: globalConfig,
    })

    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Backspace' })

    // Should remove the last item ('opt2')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1']])
  })
})
