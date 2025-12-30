import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import SearchMultiSelectReka from '@/components/shared/SearchSelect/SearchMultiSelectReka.vue'

describe('SearchMultiSelectReka', () => {
  const options = [
    { key: 'opt1', label: 'Option 1' },
    { key: 'opt2', label: 'Option 2' },
    { key: 'opt3', label: 'Option 3' },
  ]

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders tags for initial values', async () => {
    const wrapper = mount(SearchMultiSelectReka, {
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
    const wrapper = mount(SearchMultiSelectReka, {
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

    expect(secondEmitted[1]?.[0]).toEqual(['opt2'])
  })

  it('removes tags when clicking the remove button', async () => {
    const wrapper = mount(SearchMultiSelectReka, {
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
    const wrapper = mount(SearchMultiSelectReka, {
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
