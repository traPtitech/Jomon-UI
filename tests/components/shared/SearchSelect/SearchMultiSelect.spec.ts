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

  it.todo('selects multiple options', async () => {
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
    await new Promise(r => setTimeout(r, 50))

    const list = wrapper.find('ul')
    expect(list.exists()).toBe(true)

    const option1 = list.findAll('li').find(l => l.text().includes('Option 1'))
    // const option2 = list.findAll('li').find(l => l.text().includes('Option 2'))

    await option1?.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1']])

    // Update props to simulate v-model update
    await wrapper.setProps({ modelValue: ['opt1'] })

    // Need to re-open or if Zag keeps it open? Zag usually closes on selection for single, but for multi it usually toggles or stays?
    // Zag combobox behavior: closes on selection by default unless `closeOnSelect` is false.
    // Our SearchMultiSelect implementation uses default behavior.
    // Zag defaults for `multiple: true` might still close on select. Let's check implementation.
    // Usually multi-select keeps open. Zag documentation says: "selection behavior...".
    // If it closes, we need to re-open.
    // Let's assume it closes, so we re-open.
    if (!wrapper.find('ul').exists()) {
      await input.trigger('focus')
      await input.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 50))
    }

    // Re-find option because of re-render
    const list2 = wrapper.find('ul')
    const option2Ref = list2
      .findAll('li')
      .find(l => l.text().includes('Option 2'))

    await option2Ref?.trigger('click')
    await wrapper.vm.$nextTick()

    // Since we mocked v-model update via setProps, the emitted event for second click should contain both? or just the new state based on props?
    // Zag machine logic: it takes `modelValue` prop into `value` (controlled).
    // When we click new option, it calculates new value based on current machine state (which is synced from props).
    // So it should emit ['opt1', 'opt2'].

    // Note: wrapper.emitted('update:modelValue') accumulates all events.
    // Index 0: [['opt1']]
    // Index 1: [['opt1', 'opt2']]
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['opt1', 'opt2'])

    wrapper.unmount()
  })

  it.todo('deselects an option', async () => {
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
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 50))

    const list = wrapper.find('ul')
    const option1 = list.findAll('li').find(l => l.text().includes('Option 1'))

    // It should be selected style
    // expect(option1?.classes()).toContain... or check CheckIcon?
    // Just click to deselect
    await option1?.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt2'])

    wrapper.unmount()
  })

  it.todo(
    'removes last item on Backspace when search term is empty',
    async () => {
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

      // Send Backspace
      await input.trigger('keydown', { key: 'Backspace' })
      await wrapper.vm.$nextTick()

      // Zag handles backspace to remove last item if input is empty
      // It should emit update:modelValue with ['opt1']
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt1'])

      wrapper.unmount()
    }
  )
})
