import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import SearchSelectReka from '@/components/shared/SearchSelect/SearchSelectReka.vue'

describe('SearchSelectReka', () => {
  const options = [
    { key: 'opt1', label: 'Option 1' },
    { key: 'opt2', label: 'Option 2' },
    { key: 'opt3', label: 'Option 3' },
  ]

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders initial label when closed', async () => {
    const wrapper = mount(SearchSelectReka, {
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
    const wrapper = mount(SearchSelectReka, {
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

    // Close the menu
    await input.trigger('keydown', { key: 'Escape' })
    await flushPromises()
    await nextTick()

    expect(input.element.value).toBe('Option 1')
  })

  it('handles accessibility attributes correctly', async () => {
    const wrapper = mount(SearchSelectReka, {
      props: {
        modelValue: null,
        options,
        label: 'My Label',
        errorMessage: 'Something went wrong',
      },
    })

    await flushPromises()
    const input = wrapper.find('input')

    expect(input.attributes('aria-label')).toBeUndefined()
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toContain('error')

    const error = wrapper.find('[id$="-error"]')
    expect(error.text()).toBe('Something went wrong')
  })

  it('navigates and selects using keyboard', async () => {
    const wrapper = mount(SearchSelectReka, {
      props: {
        modelValue: null,
        options,
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('click')
    await flushPromises()

    await input.trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()

    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    // Guard clause for type safety
    if (!emitted) throw new Error('update:modelValue was not emitted')

    // Check first emission
    const firstEmit = emitted[0]
    expect(firstEmit).toBeDefined()

    const selectedKey = firstEmit?.[0]
    expect(options.map(o => o.key)).toContain(selectedKey)

    const expectedLabel = options.find(o => o.key === selectedKey)?.label
    expect(input.element.value).toBe(expectedLabel)
  })
})
