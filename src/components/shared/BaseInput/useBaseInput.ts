import { computed, useId } from 'vue'

import type { BaseInputCommonProps } from './BaseInput.types'

type UseBaseInputProps = Pick<
  BaseInputCommonProps,
  'id' | 'required' | 'readonly' | 'disabled' | 'errorMessage' | 'describedById'
>

export function useBaseInput(props: UseBaseInputProps) {
  const generatedId = useId()
  const inputId = computed(() => props.id ?? generatedId)

  const isFieldRequired = computed(
    () => props.required && !props.readonly && !props.disabled
  )

  const errorMessageId = computed(() =>
    props.errorMessage ? `${inputId.value}-error` : undefined
  )

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.describedById) {
      ids.push(props.describedById)
    }
    if (errorMessageId.value) {
      ids.push(errorMessageId.value)
    }
    return ids.length ? ids.join(' ') : undefined
  })

  return {
    inputId,
    isFieldRequired,
    errorMessageId,
    describedBy,
  }
}
