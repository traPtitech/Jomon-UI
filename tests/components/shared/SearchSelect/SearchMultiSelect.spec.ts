import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import SearchMultiSelect from '@/components/shared/SearchSelect/SearchMultiSelect.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

vi.hoisted(() => ({ mockScrollTo: vi.fn() }))

// Mock ResizeObserver
vi.stubGlobal(
  'ResizeObserver',
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

vi.mock('@floating-ui/vue', () => ({
  useFloating: vi.fn(() => ({
    x: 0,
    y: 0,
    strategy: 'absolute',
    reference: { value: null },
    floating: { value: null },
    update: vi.fn(),
  })),
  autoUpdate: vi.fn(() => vi.fn()),
}))

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
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus') // Open
    await input.trigger('click') // Ensure open
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    const list = wrapper.find('ul')
    expect(list.exists()).toBe(true)

    const option1 = list.findAll('li').find(l => l.text().includes('Option 1'))

    await option1?.trigger('click')
    await wrapper.vm.$nextTick()

    // First emission
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1']])

    // Update props to simulate v-model update
    await wrapper.setProps({ modelValue: ['opt1'] })

    // Ensure menu is open (multi select usually stays open or might close depending on Zag config)
    // We re-open just in case
    if (!wrapper.find('ul').exists()) {
      await input.trigger('focus')
      await input.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 60))
    }

    const list2 = wrapper.find('ul')
    const option2 = list2.findAll('li').find(l => l.text().includes('Option 2'))

    await option2?.trigger('click')
    await wrapper.vm.$nextTick()

    // Second emission should contain both (based on prop update logic in machine)
    // Note: Zag machine logic emits the NEW value.
    // Index 1: [['opt1', 'opt2']]
    // Index 1: [['opt1', 'opt2']]
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[1]?.[0]).toEqual(['opt1', 'opt2'])

    wrapper.unmount()
  })

  it('deselects an option via tag removal', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
      global: globalConfig,
      attachTo: document.body,
    })

    // Tags are rendered outside of the list in SearchMultiSelect (usually)
    // Check if tags exist
    const tags = wrapper.findAll('.rounded.bg-gray-100')
    expect(tags.length).toBe(2)

    // Find remove button for opt1
    // The component renders tags with text content.
    const tag1 = tags.find(t => t.text().includes('Option 1'))
    const removeBtn = tag1?.find('button')

    expect(removeBtn?.exists()).toBe(true)
    await removeBtn?.trigger('click')

    // Should emit update with removed item
    // Note: Zag machine might handle removal logic internally and emit new value
    // Should emit update with removed item
    // Note: Zag machine might handle removal logic internally and emit new value
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[0]?.[0]).toEqual(['opt2'])

    wrapper.unmount()
  })

  it('removes last item on Backspace when search term is empty', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: ['opt1', 'opt2'],
      },
      global: globalConfig,
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    // Ensure input value is empty
    expect((input.element as HTMLInputElement).value).toBe('')

    // Ensure input value is synchronized as empty for Zag
    await input.setValue('')

    // Zag checks `input.selectionStart === 0`. JSDOM inputs usually have 0.
    const element = input.element as HTMLInputElement
    element.focus() // essential for Zag to recognize it as active

    // Verify focus
    expect(document.activeElement).toBe(element)

    element.selectionStart = 0
    element.selectionEnd = 0

    // Provide full keydown event details (First Backspace - Highlight)
    await input.trigger('keydown', {
      key: 'Backspace',
      code: 'Backspace',
      keyCode: 8,
      which: 8,
    })
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    // Second Backspace - Remove
    await input.trigger('keydown', {
      key: 'Backspace',
      code: 'Backspace',
      keyCode: 8,
      which: 8,
    })
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 60))

    const emitted = wrapper.emitted('update:modelValue')
    // Check if emission occurred
    expect(emitted).toBeDefined()
    // If double backspace was needed, we might have 1 emission now.
    // If single was needed, we might have 2 (one for each).
    // Zag usually updates state.
    // We check the LAST emission if multiple.
    const lastEmission = emitted?.[emitted.length - 1]
    expect(lastEmission?.[0]).toEqual(['opt1'])

    wrapper.unmount()
  })

  it('selects all text on focus', async () => {
    const wrapper = mount(SearchMultiSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
        modelValue: [],
      },
      global: globalConfig,
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement
    // Mock select method
    const selectMock = vi.fn()
    element.select = selectMock

    await input.trigger('focus')
    expect(selectMock).toHaveBeenCalled()
    wrapper.unmount()
  })
})
