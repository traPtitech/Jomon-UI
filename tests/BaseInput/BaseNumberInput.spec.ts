import { nextTick } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'

describe('BaseNumberInput', () => {
  it('number input として min/max/step/inputmode を反映する', () => {
    const wrapper = mount(BaseNumberInput, {
      props: {
        label: '数量',
        modelValue: null,
        min: 1,
        max: 10,
        step: 2,
        inputmode: 'numeric',
        required: true,
        errorMessage: 'エラーです',
        describedById: 'helper-id',
      },
    })

    const input = wrapper.get('input')

    expect(input.attributes('type')).toBe('number')
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('max')).toBe('10')
    expect(input.attributes('step')).toBe('2')
    expect(input.attributes('inputmode')).toBe('numeric')
    expect(input.attributes('aria-required')).toBe('true')
    expect(input.attributes('aria-invalid')).toBe('true')

    const error = wrapper.get('[role="alert"]')
    const errorId = error.attributes('id')

    expect(errorId).toBeDefined()

    if (!errorId) {
      throw new Error('error element must have an id')
    }

    expect(input.attributes('aria-describedby')).toBe(`helper-id ${errorId}`)
  })

  it('required でも readonly/disabled のときは required/aria-required を付与しない', async () => {
    const wrapper = mount(BaseNumberInput, {
      props: {
        label: '数量',
        modelValue: null,
        required: true,
        readonly: true,
      },
    })

    const input = wrapper.get('input')

    expect(input.attributes('required')).toBeUndefined()
    expect(input.attributes('aria-required')).toBeUndefined()

    await wrapper.setProps({ readonly: false, disabled: true })
    await nextTick()

    expect(input.attributes('required')).toBeUndefined()
    expect(input.attributes('aria-required')).toBeUndefined()
  })

  it('modelValue が null や NaN のときは空文字を表示する', async () => {
    const wrapper = mount(BaseNumberInput, {
      props: {
        label: '数量',
        modelValue: null,
      },
    })

    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('')

    await wrapper.setProps({ modelValue: Number.NaN })
    await nextTick()

    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('数値文字列を入力したとき number に変換して update:modelValue を emit する', async () => {
    const wrapper = mount(BaseNumberInput, {
      props: {
        label: '数量',
        modelValue: null,
      },
    })

    const input = wrapper.get('input')

    await input.setValue('42')

    const updateEvents = wrapper.emitted('update:modelValue') ?? []
    expect(updateEvents[0]).toEqual([42])

    // input イベント自体もフォワード
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('空文字を入力したときは null を emit する', async () => {
    const wrapper = mount(BaseNumberInput, {
      props: {
        label: '数量',
        modelValue: 10,
      },
    })

    const input = wrapper.get('input')

    await input.setValue('')

    const updateEvents = wrapper.emitted('update:modelValue') ?? []
    const last = updateEvents[updateEvents.length - 1]

    expect(last).toEqual([null])
  })

  it('focus/blur/keydown/change イベントをフォワードする', async () => {
    const wrapper = mount(BaseNumberInput, {
      props: {
        label: '数量',
        modelValue: null,
      },
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
