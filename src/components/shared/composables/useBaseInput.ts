import { computed, useId, type Ref } from 'vue'

interface UseBaseInputProps {
  id?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  errorMessage?: string
}

export function useBaseInput(
  props: UseBaseInputProps,
  describedByAttr: Ref<string | undefined>
) {
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
    if (describedByAttr.value) {
      ids.push(describedByAttr.value)
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
    describedBy
  }
}
