import { computed, defineComponent, ref, unref } from 'vue'

import { Combobox } from '@headlessui/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchSelectDropdown from '@/components/shared/SearchSelect/SearchSelectDropdown.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

// Mock dependencies
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
    useVirtualList: (list: unknown) => {
      const source =
        typeof list === 'function' ? computed(list as () => unknown[]) : list
      const mappedList = computed(() => {
        const unrolled = unref(source)
        const val = Array.isArray(unrolled) ? unrolled : []
        return val.map((item: unknown, index: number) => ({
          data: item,
          index,
        }))
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

// Stub Teleport for tests
const globalConfig = {
  stubs: {
    Teleport: { template: '<div><slot /></div>' },
  },
}

const TestWrapper = defineComponent({
  components: { SearchSelectDropdown, Combobox },
  props: {
    filteredOptions: { type: Array, required: true },
    searchTerm: { type: String, default: '' },
  },
  setup(props) {
    const model = ref(null)
    const referenceElement = ref(document.createElement('div'))

    // Combobox needs to be open to render static props?
    // Actually our Dropdown uses ComboboxOptions with `static` prop? Yes.
    // If `static` is used, it renders ALWAYS (if wrapped in Teleport/logic allows).
    // Headless UI `ComboboxOptions` *only* renders if `open` is true, UNLESS `static` is true.
    // We used `static` prop in our implementation: <ComboboxOptions ... static>
    // So it should render if wrapped in Combobox.
    // However, if we want to test selection logic, we need to interact.

    return { model, props, referenceElement }
  },
  template: `
    <Combobox v-model="model" nullable>
      <SearchSelectDropdown 
        :filtered-options="props.filteredOptions"
        :reference-element="referenceElement"
        :search-term="props.searchTerm"
      />
    </Combobox>
  `,
})

describe('SearchSelectDropdown', () => {
  const options: Option<string>[] = [
    { label: 'Option 1', key: 'opt1' },
    { label: 'Option 2', key: 'opt2' },
    { label: 'Option 3', key: 'opt3', disabled: true },
  ]

  it('renders options correctly', () => {
    const wrapper = mount(TestWrapper, {
      props: {
        filteredOptions: options,
      },
      global: globalConfig,
    })

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(3)
    expect(items[0]?.text()).toBe('Option 1')
    // Disabled class check: ComboboxOption applies data-headlessui-state="disabled" etc.
    // Our implementation applies custom classes based on slot prop.
    expect(items[2]?.classes()).toContain('cursor-not-allowed')
  })

  it('displays no results message when filteredOptions is empty', () => {
    const wrapper = mount(TestWrapper, {
      props: {
        filteredOptions: [],
        searchTerm: 'query',
      },
      global: globalConfig,
    })

    expect(wrapper.text()).toContain('該当する項目がありません。')
  })

  it('displays empty message when filteredOptions is empty and no search term', () => {
    const wrapper = mount(TestWrapper, {
      props: {
        filteredOptions: [],
        searchTerm: '',
      },
      global: globalConfig,
    })

    expect(wrapper.text()).toContain('項目がありません。')
  })
})
