import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import SearchSelect from '@/components/shared/SearchSelectHeadless/SearchSelect.vue'

describe('SearchSelect (Headless UI)', () => {
  const options = [
    { key: 'opt1', label: 'Option 1' },
    { key: 'opt2', label: 'Option 2' },
    { key: 'opt3', label: 'Option 3' },
  ]

  let wrapper: ReturnType<typeof mount> | null = null

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('renders initial label when closed', async () => {
    wrapper = mount(SearchSelect, {
      props: {
        modelValue: 'opt1',
        options,
      },
    })

    await flushPromises()
    await nextTick()

    const input = wrapper.find('input')
    expect(input.element.value).toBe('Option 1')
  })

  it('clears query and shows search mode when opened', async () => {
    wrapper = mount(SearchSelect, {
      props: {
        modelValue: 'opt1',
        options,
      },
      attachTo: document.body,
    })

    await flushPromises()
    const input = wrapper.find('input')

    // Open the menu
    await input.trigger('click')
    await flushPromises()
    await nextTick()

    // Should be empty now
    expect(input.element.value).toBe('')

    // Type something
    await input.setValue('opt')
    expect(input.element.value).toBe('opt')

    // Close the menu via Escape
    await input.trigger('keydown', { key: 'Escape' })
    await flushPromises()
    await nextTick()

    expect(input.element.value).toBe('Option 1')
  })

  it('reverts to label when clicking outside', async () => {
    wrapper = mount(SearchSelect, {
      props: {
        modelValue: 'opt1',
        options,
      },
      attachTo: document.body,
    })

    await flushPromises()
    const input = wrapper.find('input')

    await input.trigger('click')
    await flushPromises()
    await nextTick()
    expect(input.element.value).toBe('')

    // Simulate clicking outside more thoroughly
    document.body.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true })
    )
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await flushPromises()
    await nextTick()

    // It should close and show the label
    expect(input.element.value).toBe('Option 1')
  })

  it('handles accessibility attributes correctly', async () => {
    wrapper = mount(SearchSelect, {
      props: {
        modelValue: null,
        options,
        label: 'My Label',
        errorMessage: 'Something went wrong',
      },
    })

    await flushPromises()
    const input = wrapper.find('input')

    // Since we have a label element, aria-label should be undefined to avoid duplication
    expect(input.attributes('aria-label')).toBeUndefined()
    expect(input.attributes('aria-invalid')).toBe('true')
    // Headless UI might handle aria-describedby differently or via direct prop binding
    // For now we expect standard behavior
    expect(input.attributes('aria-describedby')).toContain('error')

    const error = wrapper.find('[id$="-error"]')
    expect(error.text()).toBe('Something went wrong')
  })

  it('navigates and selects using keyboard', async () => {
    wrapper = mount(SearchSelect, {
      props: {
        modelValue: null,
        options,
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('click')
    await flushPromises()
    await nextTick()

    await input.trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()
    await nextTick()

    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    if (!emitted) throw new Error('update:modelValue was not emitted')

    const firstEmit = emitted[0]
    if (!firstEmit) throw new Error('first emit is undefined')

    const selectedKey = firstEmit[0] as string | number
    expect(options.map(o => o.key)).toContain(selectedKey)
  })
})
