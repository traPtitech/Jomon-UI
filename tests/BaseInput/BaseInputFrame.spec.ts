import BaseInputFrame from '@/components/shared/BaseInput/BaseInputFrame.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

describe('BaseInputFrame', () => {
  const baseProps = {
    label: 'ラベル',
    inputId: 'field-id'
  }

  it('label を表示し、for 属性で inputId と関連付ける', () => {
    const wrapper = mount(BaseInputFrame, {
      props: baseProps,
      slots: {
        default: '<input />'
      }
    })

    const label = wrapper.get('label')

    expect(label.text()).toContain('ラベル')
    expect(label.attributes('for')).toBe('field-id')
  })

  it('required かつ readonly/disabled でないときだけ * を表示する', async () => {
    const wrapper = mount(BaseInputFrame, {
      props: { ...baseProps, required: true },
      slots: { default: '<input />' }
    })

    // required=true
    const requiredMark = wrapper.find('label span.text-red-500')
    expect(requiredMark.exists()).toBe(true)
    expect(requiredMark.text()).toBe('*')

    // readonly -> 必須扱いしない
    await wrapper.setProps({ readonly: true })
    expect(wrapper.find('label span.text-red-500').exists()).toBe(false)

    // disabled -> 必須扱いしない
    await wrapper.setProps({ readonly: false, disabled: true })
    expect(wrapper.find('label span.text-red-500').exists()).toBe(false)
  })

  it('hasValue に応じてラベルの位置クラスを切り替える', async () => {
    const wrapper = mount(BaseInputFrame, {
      props: { ...baseProps, hasValue: false },
      slots: { default: '<input />' }
    })

    const label = wrapper.get('label')

    // 初期状態: 非浮遊
    expect(label.classes()).toContain('top-1/2')

    await wrapper.setProps({ hasValue: true })
    await nextTick()

    // 値あり: 浮遊ラベル
    expect(label.classes()).toContain('top-1')
  })

  it('focusin/out でフォーカス状態に応じてラベル位置を切り替える', async () => {
    const wrapper = mount(BaseInputFrame, {
      props: { ...baseProps, hasValue: false },
      slots: { default: '<input />' }
    })

    const label = wrapper.get('label')

    // 初期状態: 非浮遊
    expect(label.classes()).toContain('top-1/2')

    // focusin でラベルが浮遊する
    await wrapper.trigger('focusin')
    await nextTick()
    expect(label.classes()).toContain('top-1')

    // focusout で元に戻る
    await wrapper.trigger('focusout')
    await nextTick()
    expect(label.classes()).toContain('top-1/2')
  })

  it('isTextarea=true かつ hasValue=false のとき textarea 用の位置クラスを使う', () => {
    const wrapper = mount(BaseInputFrame, {
      props: { ...baseProps, isTextarea: true, hasValue: false },
      slots: { default: '<textarea />' }
    })

    const label = wrapper.get('label')

    expect(label.classes()).toContain('top-8')
  })

  it('エラーメッセージを id, ARIA 属性付きで表示する', () => {
    const wrapper = mount(BaseInputFrame, {
      props: {
        ...baseProps,
        errorMessage: 'エラーです',
        errorMessageId: 'field-id-error'
      },
      slots: { default: '<input />' }
    })

    const error = wrapper.get('[role="alert"]')

    expect(error.text()).toContain('エラーです')
    expect(error.attributes('id')).toBe('field-id-error')
    expect(error.attributes('aria-live')).toBe('assertive')
    expect(error.attributes('aria-atomic')).toBe('true')
  })

  it('prefix スロットを描画する', () => {
    const wrapper = mount(BaseInputFrame, {
      props: baseProps,
      slots: {
        prefix: '<span class="prefix">P</span>',
        default: '<input />'
      }
    })

    expect(wrapper.find('.prefix').exists()).toBe(true)
  })
})
