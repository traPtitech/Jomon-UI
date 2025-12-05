import { type PropType, defineComponent } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { useBaseInput } from '@/components/shared/BaseInput/useBaseInput'

const TestComponent = defineComponent({
  props: {
    id: { type: String as PropType<string | undefined>, default: undefined },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    errorMessage: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    describedById: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const state = useBaseInput(props)
    return state
  },
  template: '<div />',
})

describe('useBaseInput', () => {
  it('id が指定されていればそのまま inputId に使う', () => {
    const wrapper = mount(TestComponent, {
      props: { id: 'custom-id' },
    })

    expect(wrapper.vm.inputId).toBe('custom-id')
  })

  it('id が未指定の場合は useId により一意な id を生成する', () => {
    const wrapper = mount(TestComponent)

    expect(wrapper.vm.inputId).toBeTruthy()
  })

  it('required かつ readonly/disabled でないときだけ isFieldRequired が true になる', async () => {
    const wrapper = mount(TestComponent, {
      props: { required: true },
    })

    expect(wrapper.vm.isFieldRequired).toBe(true)

    await wrapper.setProps({ readonly: true })
    expect(wrapper.vm.isFieldRequired).toBe(false)

    await wrapper.setProps({ readonly: false, disabled: true })
    expect(wrapper.vm.isFieldRequired).toBe(false)
  })

  it('errorMessage があるときだけ errorMessageId を生成する', async () => {
    const wrapper = mount(TestComponent)

    expect(wrapper.vm.errorMessageId).toBeUndefined()

    await wrapper.setProps({ errorMessage: 'エラーです' })

    expect(wrapper.vm.errorMessageId).toBe(`${wrapper.vm.inputId}-error`)
  })

  it('describedById と errorMessageId を aria-describedby 用に連結する', async () => {
    const wrapper = mount(TestComponent, {
      props: { describedById: 'helper-id' },
    })

    // errorMessage がないので helper-id のみ
    expect(wrapper.vm.describedBy).toBe('helper-id')

    await wrapper.setProps({ errorMessage: 'エラーです' })
    const errorId = wrapper.vm.errorMessageId

    expect(errorId).toBeDefined()

    if (!errorId) {
      throw new Error('errorMessageId must be defined when errorMessage is set')
    }

    expect(wrapper.vm.describedBy).toBe(`helper-id ${errorId}`)

    await wrapper.setProps({
      describedById: undefined,
      errorMessage: undefined,
    })
    expect(wrapper.vm.describedBy).toBeUndefined()
  })

  it('describedById がなくても errorMessage があれば errorMessageId のみを返す', () => {
    const wrapper = mount(TestComponent, {
      props: { errorMessage: 'エラーです' },
    })

    const errorId = wrapper.vm.errorMessageId

    expect(errorId).toBeDefined()

    if (!errorId) {
      throw new Error('errorMessageId must be defined when errorMessage is set')
    }

    expect(wrapper.vm.describedBy).toBe(errorId)
  })
})
