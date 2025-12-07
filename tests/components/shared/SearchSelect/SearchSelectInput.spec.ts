import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SearchSelectInput from '@/components/shared/SearchSelect/SearchSelectInput.vue'

describe('SearchSelectInput', () => {
  const defaultProps = {
    label: 'Test Label',
    isOpen: false,
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

  it('emits events correctly', async () => {
    const wrapper = mount(SearchSelectInput, {
      props: defaultProps,
    })

    const input = wrapper.find('input')

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('keydown')).toBeTruthy()

    await input.trigger('compositionstart')
    expect(wrapper.emitted('compositionstart')).toBeTruthy()

    await input.trigger('compositionend')
    expect(wrapper.emitted('compositionend')).toBeTruthy()

    const toggleButton = wrapper.find('button')
    await toggleButton.trigger('click')
    expect(wrapper.emitted('toggle-menu')).toBeTruthy()
  })

  it('applies disabled styles', () => {
    const wrapper = mount(SearchSelectInput, {
      props: {
        ...defaultProps,
        disabled: true,
      },
    })

    const inputWrapper = wrapper.findComponent({ name: 'BaseTextInput' })
    expect(inputWrapper.classes()).toContain('cursor-not-allowed')
    expect(inputWrapper.classes()).toContain('opacity-50')

    const toggleButton = wrapper.find('button')
    expect(toggleButton.attributes('disabled')).toBeDefined()
  })

  it('rotates chevron icon based on menuState', async () => {
    const wrapper = mount(SearchSelectInput, {
      props: {
        ...defaultProps,
        isOpen: false,
      },
    })

    const chevron = wrapper.find('svg.transition-transform')
    expect(chevron.classes()).not.toContain('rotate-180')

    await wrapper.setProps({ isOpen: true })
    expect(chevron.classes()).toContain('rotate-180')
  })
})
