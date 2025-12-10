import { defineComponent, ref } from 'vue'

import { Combobox } from '@headlessui/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SearchSelectInput from '@/components/shared/SearchSelect/SearchSelectInput.vue'

// Helper component to provide Combobox context
const TestWrapper = defineComponent({
  components: { SearchSelectInput, Combobox },
  props: {
    displayValue: {
      type: Function,
      default: (item: unknown) => (typeof item === 'string' ? item : ''),
    },
    disabled: Boolean,
  },
  setup(props) {
    const model = ref('')
    const query = ref('')
    return { model, query, props }
  },
  template: `
    <Combobox v-model="model" :disabled="props.disabled">
      <SearchSelectInput
        label="Test Label"
        :display-value="props.displayValue"
        :disabled="props.disabled"
        :query="query"
        :is-open="false"
        @change-query="query = $event"
      />
    </Combobox>
  `,
})

describe('SearchSelectInput', () => {
  it('renders correctly', () => {
    const wrapper = mount(TestWrapper)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Test Label')
  })

  it.todo('emits change-query on input', async () => {
    // ...
  })

  it('applies disabled styles', () => {
    const wrapper = mount(TestWrapper, {
      props: {
        disabled: true,
      },
    })

    const inputWrapper = wrapper.findComponent({ name: 'BaseInputFrame' })
    expect(inputWrapper.classes()).toContain('cursor-not-allowed')

    // The button logic depends on Headless UI state or direct disabled prop?
    // In our implementation we rely on Headless UI context for the button disabled state
    // OR the disabled prop passed to SearchSelectInput
    // Let's check SearchSelectInput implementation... it passes :disabled to BaseTextInput.
    // For ComboboxButton, it relies on context.
    const toggleButton = wrapper.find('button')
    // Headless UI Combobox renders attributes based on context.
    // If Combobox is disabled, button should have disabled attribute.
    expect(toggleButton.attributes('disabled')).toBeDefined()
  })
})
