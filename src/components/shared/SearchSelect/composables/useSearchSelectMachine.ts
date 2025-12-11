import { type MaybeRef, computed, ref, toValue } from 'vue'

import * as combobox from '@zag-js/combobox'
import { normalizeProps, useMachine } from '@zag-js/vue'

import { serializeOptionKey } from '@/components/shared/utils'

import type { Option } from '../types'
import { useSearchSelectFiltering } from './useSearchSelectFiltering'

export interface UseSearchSelectMachineProps<T extends string | number> {
  id: string
  options: MaybeRef<readonly Option<T>[]>
  disabled?: MaybeRef<boolean> | undefined
  readOnly?: MaybeRef<boolean> | undefined
  placeholder?: MaybeRef<string> | undefined
  multiple?: MaybeRef<boolean> | undefined
  modelValue?: MaybeRef<T | T[] | null> | undefined
  filterFunction?:
    | ((option: Option<T>, searchTerm: string) => boolean)
    | undefined
}

export function useSearchSelectMachine<T extends string | number>(
  props: UseSearchSelectMachineProps<T>,
  emit: (event: 'update:modelValue', value: T | T[] | null) => void
) {
  // Local state for filtering
  const searchTerm = ref('')

  const filteredOptions = useSearchSelectFiltering(
    props.options,
    searchTerm,
    props.filterFunction
  )

  // Create a map for O(1) lookup and validation of string keys
  const keyToOptionMap = computed(() => {
    const map = new Map<string, Option<T>>()
    const allOptions = toValue(props.options)
    for (const option of allOptions) {
      const keyStr = serializeOptionKey(option.key)
      if (import.meta.env.DEV && map.has(keyStr)) {
        console.warn(
          `[SearchSelect] Duplicate key found: "${keyStr}". Keys must be unique when converted to string to ensure correct selection.`
        )
      }
      map.set(keyStr, option)
    }
    return map
  })

  const collection = computed(() =>
    combobox.collection({
      items: filteredOptions.value,
      itemToString: item => (item ? item.label : ''),
      itemToValue: item => (item ? serializeOptionKey(item.key) : ''),
    })
  )

  // Computed Props for useMachine
  // Zag Vue accepts a computed object for options to be reactive
  const machineOptions = computed(() => {
    const modelVal = toValue(props.modelValue)
    let value: string[] = []
    if (Array.isArray(modelVal)) {
      value = modelVal.map(v => serializeOptionKey(v))
    } else if (modelVal !== null && modelVal !== undefined) {
      value = [serializeOptionKey(modelVal)]
    }

    return {
      id: props.id,
      collection: collection.value,
      multiple: toValue(props.multiple),
      readOnly: toValue(props.readOnly),
      disabled: toValue(props.disabled),
      placeholder: toValue(props.placeholder),
      value, // Controlled selection
      openOnClick: true,
      // We do NOT control inputValue here, we let Zag manage it and listen to changes

      onValueChange: (details: combobox.ValueChangeDetails) => {
        const val = details.value // string[]

        const selectedKeys: T[] = []
        for (const k of val) {
          const found = keyToOptionMap.value.get(k)
          if (found) {
            selectedKeys.push(found.key)
          }
        }

        const isMulti = toValue(props.multiple)
        if (isMulti) {
          emit('update:modelValue', selectedKeys)
        } else {
          emit('update:modelValue', selectedKeys[0] ?? null)
        }
      },
      onInputValueChange: (details: combobox.InputValueChangeDetails) => {
        searchTerm.value = details.inputValue
      },
    }
  })

  // Pass computed options to useMachine
  const service = useMachine(combobox.machine, machineOptions)

  const api = computed(() => combobox.connect(service, normalizeProps))

  return {
    api,
    filteredOptions,
  }
}
