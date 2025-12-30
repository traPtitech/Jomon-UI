import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import SearchMultiSelectReka from '@/components/shared/SearchSelect/SearchMultiSelectReka.vue'

describe('SearchMultiSelectReka', () => {
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
    wrapper = mount(SearchMultiSelectReka, {
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
    wrapper = mount(SearchMultiSelectReka, {
      props: {
        modelValue: ['opt1'],
        options,
      },
      attachTo: document.body,
    })

    await flushPromises()
    const input = wrapper.find('input')
    await input.trigger('click')
    await flushPromises()

    const items = document.querySelectorAll('[role="option"]')
    const opt2Item = Array.from(items).find(el =>
      el.textContent.includes('Option 2')
    ) as HTMLElement

    // Select Option 2
    opt2Item.click()
    await flushPromises()

    const emitted = wrapper.emitted('update:modelValue')
    if (!emitted) throw new Error('update:modelValue was not emitted')

    expect(emitted[0]?.[0]).toEqual(['opt1', 'opt2'])

    // Sync prop to simulate parent update
    await wrapper.setProps({ modelValue: ['opt1', 'opt2'] })
    await nextTick()

    // Select Option 1 again (to remove it)
    const opt1Item = Array.from(items).find(el =>
      el.textContent.includes('Option 1')
    ) as HTMLElement
    opt1Item.click()
    await flushPromises()

    const secondEmitted = wrapper.emitted('update:modelValue')
    if (!secondEmitted) throw new Error('update:modelValue was not emitted')

    // Ensure array bounds before accessing
    if (!secondEmitted[1]) throw new Error('second emission missing')
    expect(secondEmitted[1][0]).toEqual(['opt2'])
  })

  it('supports continuous selection using keyboard', async () => {
    wrapper = mount(SearchMultiSelectReka, {
      props: {
        modelValue: [],
        options,
      },
      attachTo: document.body,
    })

    await flushPromises()
    const input = wrapper.find('input')
    await input.trigger('click')
    await flushPromises()

    // Select first item (opt1)
    await input.trigger('keydown', { key: 'Home' }) // Move to top
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    const emitted = wrapper.emitted('update:modelValue')
    if (!emitted) throw new Error('update:modelValue was not emitted')
    expect(emitted[0]?.[0]).toEqual(['opt1'])

    // Update props to simulate parent state change
    await wrapper.setProps({ modelValue: ['opt1'] })
    await nextTick()

    // Select second item (opt2)
    // First ArrowDown might just re-highlight the current item or first item depending on Reka state.
    // We send ArrowDown twice to ensure we move to the next item (opt2)
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    const secondEmitted = wrapper.emitted('update:modelValue')
    if (!secondEmitted) throw new Error('update:modelValue was not emitted')
    expect(secondEmitted[secondEmitted.length - 1]?.[0]).toEqual([
      'opt1',
      'opt2',
    ])
  })

  it('updates tags when labels change and handles missing options', async () => {
    wrapper = mount(SearchMultiSelectReka, {
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
    wrapper = mount(SearchMultiSelectReka, {
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
    wrapper = mount(SearchMultiSelectReka, {
      props: {
        modelValue: ['opt1'],
        options,
        disabled: true,
      },
    })

    await flushPromises()

    const removeButton = wrapper.find('button[aria-label*="削除"]')
    expect(removeButton.attributes('disabled')).toBeDefined()

    await removeButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
