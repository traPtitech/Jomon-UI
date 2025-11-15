import BaseTextInput from '../src/components/shared/BaseTextInput.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

type UpdateModelValueHandler = (value: string) => void

interface MountOptions {
  props?: Partial<{
    modelValue: string
    textarea: boolean
    id: string
    errorMessage: string
    'onUpdate:modelValue': UpdateModelValueHandler
  }>
  attrs?: Record<string, unknown>
}

const mountBaseTextInput = (options: MountOptions = {}) => {
  const onUpdate: UpdateModelValueHandler =
    options.props?.['onUpdate:modelValue'] ?? vi.fn()

  return mount(BaseTextInput, {
    props: {
      label: 'Name',
      modelValue: options.props?.modelValue ?? '',
      'onUpdate:modelValue': onUpdate,
      ...options.props
    },
    attrs: options.attrs
  })
}

describe('BaseTextInput integration', () => {
  it('respects camel-cased ariaDescribedby attr for input controls', () => {
    const wrapper = mountBaseTextInput({
      attrs: { ariaDescribedby: 'external-id' }
    })

    const input = wrapper.find('input')
    expect(input.attributes('aria-describedby')).toBe('external-id')
  })

  it('merges forwarded aria-describedby with textarea error message id', () => {
    const wrapper = mountBaseTextInput({
      props: {
        textarea: true,
        id: 'custom-field',
        errorMessage: '必須です'
      },
      attrs: { ariaDescribedby: 'external-id' }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('aria-describedby')).toBe(
      'external-id custom-field-error'
    )
  })
})
