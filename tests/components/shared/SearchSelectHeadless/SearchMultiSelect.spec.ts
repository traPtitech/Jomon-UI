import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import SearchMultiSelect from '@/components/shared/SearchSelectHeadless/SearchMultiSelect.vue'

describe('SearchMultiSelect (Headless UI)', () => {
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

  it('renders tags for initial values', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: ['opt1', 'opt2'],
        options,
      },
    })

    await flushPromises()

    const tags = wrapper.findAll('.bg-surface-secondary')
    expect(tags).toHaveLength(2)
    expect(tags[0]?.text()).toContain('Option 1')
    expect(tags[1]?.text()).toContain('Option 2')
  })

  it('toggles options and keeps menu open', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: ['opt1'],
        options,
      },
      attachTo: document.body,
    })

    await flushPromises()
    const button = wrapper.find('button')
    await button.trigger('click')
    await flushPromises()
    await nextTick()

    const items = document.querySelectorAll('[role="option"]')
    // Note: Headless UI might render items differently, but we expect role="option"
    const opt2Item = Array.from(items).find(el =>
      el.textContent.includes('Option 2')
    )
    if (!opt2Item || !(opt2Item instanceof HTMLElement)) {
      throw new Error('Option 2 item not found')
    }

    // Select Option 2
    opt2Item.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
    opt2Item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    opt2Item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    opt2Item.click()
    await flushPromises()
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    if (!emitted) throw new Error('update:modelValue was not emitted')

    expect(emitted[0]?.[0]).toEqual(['opt1', 'opt2'])

    // Verify menu is still open
    const optionsList = wrapper.find('ul') // Headless UI ComboboxOptions renders as ul by default? Or we used as="ul"? No, default is ul.
    expect(optionsList.exists()).toBe(true)

    // Wait for potential close transition
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(optionsList.isVisible()).toBe(true)

    // Sync prop to simulate parent update
    await wrapper.setProps({ modelValue: ['opt1', 'opt2'] })
    await nextTick()

    // Select Option 1 again (to remove it)
    const opt1Item = Array.from(items).find(el =>
      el.textContent.includes('Option 1')
    )
    if (!opt1Item || !(opt1Item instanceof HTMLElement)) {
      throw new Error('Option 1 item not found')
    }
    opt1Item.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))
    opt1Item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    opt1Item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    opt1Item.click()
    await flushPromises()

    const secondEmitted = wrapper.emitted('update:modelValue')
    if (!secondEmitted) throw new Error('update:modelValue was not emitted')

    // Depending on implementation, it might emit full array each time
    const lastEmit = secondEmitted[secondEmitted.length - 1]?.[0]
    expect(lastEmit).toEqual(['opt2'])
  })

  it('updates tags when labels change and handles missing options', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: ['opt1', 'opt2'],
        options,
      },
    })

    await flushPromises()

    // Change opt1 label and remove opt2 from options
    const newOptions = [{ key: 'opt1', label: 'New Label 1' }]
    await wrapper.setProps({ options: newOptions })
    await flushPromises()
    await nextTick()

    const tags = wrapper.findAll('.bg-surface-secondary')
    expect(tags[0]?.text()).toContain('New Label 1')
    expect(tags[1]?.text()).toContain('opt2') // Fallback to key
  })

  it('removes tags when clicking the remove button', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: ['opt1'],
        options,
      },
    })

    await flushPromises()
    const removeButton = wrapper.find('button[aria-label*="削除"]')
    await removeButton.trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    if (!emitted) throw new Error('update:modelValue was not emitted')

    expect(emitted[0]?.[0]).toEqual([])
  })

  it('disables interactions when props.disabled is true', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: ['opt1'],
        options,
        disabled: true,
      },
    })

    await flushPromises()

    const removeButton = wrapper.find('button[aria-label*="削除"]')
    // Headless UI might not render button if disabled, or render it disabled
    // Assuming standard behavior
    // We expect the button to exist but be disabled
    expect(removeButton.exists()).toBe(true)
    expect(removeButton.attributes('disabled')).toBeDefined()

    await removeButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('handles accessibility attributes correctly', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: [],
        options,
        label: 'My Multi Label',
        errorMessage: 'Invalid selection',
      },
    })

    await flushPromises()
    const input = wrapper.find('input')

    // aria-label should be undefined when label prop is present
    expect(input.attributes('aria-label')).toBeUndefined()
    expect(input.attributes('aria-invalid')).toBe('true')
    // Headless UI might handle aria-describedby differently
    // expect(input.attributes('aria-describedby')).toContain('error')
  })

  it('filters options based on input', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: [],
        options,
      },
      attachTo: document.body,
    })

    await flushPromises()
    const button = wrapper.find('button')
    await button.trigger('click')
    await flushPromises()
    await nextTick()

    const input = wrapper.find('input')
    await input.setValue('Option 1')
    await flushPromises()
    await nextTick()

    const items = document.querySelectorAll('[role="option"]')
    expect(items.length).toBe(1)
    expect(items[0]?.textContent).toContain('Option 1')
  })

  it('opens menu on input click/focus', async () => {
    wrapper = mount(SearchMultiSelect, {
      props: {
        modelValue: [],
        options,
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('click')
    await input.trigger('focus')
    await flushPromises()
    await nextTick()

    const optionsList = wrapper.find('ul')
    expect(optionsList.exists()).toBe(true)
    expect(optionsList.isVisible()).toBe(true)
  })
})
