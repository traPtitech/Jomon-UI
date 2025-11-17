import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('BaseTextInput', () => {
  it('デフォルトでは input[type=text] を描画し、基本的な ARIA を設定する', () => {
    const wrapper = mount(BaseTextInput, {
      props: {
        label: '名前',
        modelValue: '',
        required: true,
        errorMessage: 'エラーです',
        describedById: 'helper-id'
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('aria-required')).toBe('true')
    expect(input.attributes('aria-invalid')).toBe('true')

    // aria-describedby は describedById + errorMessageId の連結
    const error = wrapper.get('[role="alert"]')
    const errorId = error.attributes('id')

    expect(errorId).toBeDefined()

    if (!errorId) {
      throw new Error('error element must have an id')
    }

    expect(input.attributes('aria-describedby')).toBe(`helper-id ${errorId}`)
  })

  it('type/inputmode/autocomplete を input に反映する', () => {
    const wrapper = mount(BaseTextInput, {
      props: {
        label: 'メールアドレス',
        modelValue: '',
        type: 'email',
        inputmode: 'email',
        autocomplete: 'email'
      }
    })

    const input = wrapper.get('input')

    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('inputmode')).toBe('email')
    expect(input.attributes('autocomplete')).toBe('email')
  })

  it('textarea=true の場合は textarea を描画し、type 属性は付与しない', () => {
    const wrapper = mount(BaseTextInput, {
      props: {
        label: 'メモ',
        modelValue: '',
        textarea: true,
        rows: 4
      }
    })

    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)

    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('rows')).toBe('4')
    expect(textarea.attributes('type')).toBeUndefined()
  })

  it('v-model 経由で文字列を更新できる', async () => {
    const wrapper = mount(BaseTextInput, {
      props: {
        label: '名前',
        modelValue: 'initial'
      }
    })

    const input = wrapper.get('input')

    await input.setValue('changed')

    // defineModel による update:modelValue
    const updateEvents = wrapper.emitted('update:modelValue') ?? []
    expect(updateEvents[0]).toEqual(['changed'])

    // input イベントもそのままフォワード
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('focus/blur/keydown/change イベントをフォワードする', async () => {
    const wrapper = mount(BaseTextInput, {
      props: {
        label: '名前',
        modelValue: ''
      }
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('blur')
    await input.trigger('keydown')
    await input.trigger('change')

    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('keydown')).toHaveLength(1)
    expect(wrapper.emitted('change')).toHaveLength(1)
  })
})
