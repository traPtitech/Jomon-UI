<script setup lang="ts">
import { ref, useId, useTemplateRef, watch } from 'vue'

import { ComboboxButton, ComboboxInput } from '@headlessui/vue'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import BaseInputFrame from '../BaseInput/BaseInputFrame.vue'

const props = defineProps<{
  label: string
  placeholder?: string | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
  // Input passes displayValue exactly as is to ComboboxInput.
  // The transformation logic resides in the parent (SearchSelect/SearchMultiSelect).
  displayValue: (item: unknown) => string
  isOpen: boolean
  query: string
  hasValue: boolean
  errorMessage?: string | undefined
}>()

const emit = defineEmits<{
  (e: 'change-query', value: string): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'close'): void
}>()

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const rootRef = useTemplateRef<HTMLElement>('rootRef')
const buttonRef = ref<InstanceType<typeof ComboboxButton> | null>(null)

watch(
  () => props.isOpen,
  (newVal, oldVal) => {
    if (oldVal && !newVal) {
      emit('close')
    }
  }
)

const focus = () => {
  inputRef.value?.focus()
}

const select = () => {
  inputRef.value?.select()
}

defineExpose({
  focus,
  select,
  get el() {
    return rootRef.value
  },
})

const handleInput = (e: Event) => {
  const target = e.target
  if (target instanceof HTMLInputElement) {
    emit('change-query', target.value)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  emit('keydown', e)
}

const handleFocus = () => {
  // Workaround: Headless UI Combobox doesn't provide a public API to open programmatically,
  // so we simulate a click on the button to open it.
  if (!props.isOpen && buttonRef.value?.$el) {
    buttonRef.value.$el.click()
  }
}

const inputId = useId()
</script>

<template>
  <div ref="rootRef" class="relative">
    <BaseInputFrame
      :label="label"
      :required="required"
      :disabled="disabled"
      :has-value="hasValue"
      :input-id="inputId"
      :error-message="errorMessage">
      <template #prefix>
        <MagnifyingGlassIcon class="ml-3 w-6 text-text-secondary" />
      </template>
      <template #default="{ inputProps }">
        <ComboboxInput
          ref="inputRef"
          as="input"
          :id="inputId"
          v-bind="
            {
              class: [
                inputProps.class,
                'w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none',
                'not-focus-visible:placeholder:text-transparent', // placeholder behavior
                label ? 'pt-6' : 'pt-2',
                disabled ? 'cursor-not-allowed' : '',
                'pr-8',
              ],
              placeholder,
              disabled,
              required,
              displayValue,
              'aria-labelledby': undefined,
              'aria-label': undefined,
              onInput: handleInput,
              onKeydown: handleKeyDown,
              onFocus: handleFocus,
              onClick: handleFocus,
            } as any
          " />
      </template>
    </BaseInputFrame>

    <ComboboxButton
      as="button"
      ref="buttonRef"
      class="absolute inset-y-0 right-0 flex items-center pr-2">
      <ChevronDownIcon
        class="ui-open:rotate-180 h-4 w-4 text-text-secondary transition-transform"
        aria-hidden="true" />
    </ComboboxButton>
  </div>
</template>
