import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SearchSelectInput from '@/components/shared/SearchSelectInput.vue'

describe('SearchSelectInput', () => {
  const defaultProps = {
    label: 'Test Label',
    menuState: 'close' as const,
    modelValue: '',
  }

  it('emits input event when event is instanceof InputEvent', () => {
    const wrapper = mount(SearchSelectInput, {
      props: defaultProps,
    })

    const input = wrapper.find('input')
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    })

    // Manually dispatch the event to ensure it's an InputEvent
    input.element.dispatchEvent(inputEvent)

    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')?.[0]).toEqual([inputEvent])
  })

  // Note: It's hard to simulate a non-InputEvent 'input' event in a way that triggers the handler naturally
  // without manually calling the handler or dispatching a custom event.
  // But we can verify that if we dispatch a generic Event, it might be ignored if our logic works.
  // However, JSDOM/Vue might wrap events.
  // Let's try dispatching a generic Event named 'input'.
})
