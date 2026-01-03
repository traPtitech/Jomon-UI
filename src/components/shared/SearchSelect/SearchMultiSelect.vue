<script setup lang="ts" generic="T extends string | number">
import { type ComponentPublicInstance, computed, useTemplateRef } from 'vue'

import { Combobox, ComboboxButton, ComboboxInput } from '@headlessui/vue'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import SearchSelectOptionsList from './SearchSelectOptionsList.vue'
import { useSearchSelect } from './composables/useSearchSelect'
import { useSearchSelectField } from './composables/useSearchSelectField'
import type { SearchMultiSelectProps } from './types'

const props = withDefaults(defineProps<SearchMultiSelectProps<T>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const model = defineModel<T[]>({ required: true })

const { inputId, errorId, isFocused, handleFocusOut } = useSearchSelectField()

const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef')
const containerRef = useTemplateRef<ComponentPublicInstance>('containerRef')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

const { searchTerm, filteredOptions, getLabel } = useSearchSelect(
  computed(() => props.options),
  props.filterFunction
)

const hasValue = computed(() => model.value.length > 0)

const removeTag = (key: T) => {
  if (props.disabled) return
  model.value = model.value.filter(v => v !== key)
}

const focusInputAndOpen = (open: boolean) => {
  if (props.disabled) return
  if (document.activeElement === inputRef.value) {
    if (!open) buttonRef.value?.click()
  } else {
    inputRef.value?.focus()
  }
}

const onInputKeydown = (e: KeyboardEvent) => {
  if (
    e.key === 'Backspace' &&
    searchTerm.value === '' &&
    model.value.length > 0
  ) {
    const lastKey = model.value[model.value.length - 1]
    if (lastKey !== undefined) {
      removeTag(lastKey)
    }
  }
}

const handleChange = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    searchTerm.value = e.target.value
  }
}

const handleAfterLeave = () => {
  emit('close')
}

defineOptions({
  name: 'SearchMultiSelect',
})
</script>

<template>
  <Combobox
    ref="containerRef"
    v-model="model"
    :name="name"
    :disabled="disabled"
    as="div"
    class="group relative"
    multiple
    v-slot="{ open }"
    v-bind="{
      onFocusin: () => (isFocused = true),
      onFocusout: (e: FocusEvent) => handleFocusOut(e, containerRef),
    }">
    <div
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[
        props.disabled
          ? 'cursor-not-allowed bg-surface-secondary opacity-60'
          : 'bg-white',
      ]">
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
      <div
        class="flex items-center justify-center pl-3"
        :class="[props.disabled ? '' : 'cursor-pointer']"
        @click.prevent="focusInputAndOpen(open)">
        <MagnifyingGlassIcon
          class="w-6 text-text-secondary"
          aria-hidden="true" />
      </div>

      <div
        class="relative w-full"
        :class="[props.disabled ? 'pointer-events-none' : '']">
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
        <div
          class="flex w-full flex-wrap items-center gap-1 px-3 pb-2"
          :class="[
            label ? 'pt-6' : 'pt-2',
            props.disabled ? 'cursor-not-allowed' : '',
          ]"
          @click.self.prevent="focusInputAndOpen(open)">
          <div
            v-for="key in model"
            :key="key"
            class="flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-xs text-text-primary">
            {{ getLabel(key) }}
            <button
              type="button"
              :disabled="props.disabled"
              :aria-label="`${getLabel(key)} を削除`"
              class="ml-1 rounded-full hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              @mousedown.stop
              @click.stop="removeTag(key)">
              <XMarkIcon class="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          <ComboboxInput as="template" @change="handleChange">
            <input
              ref="inputRef"
              :value="searchTerm"
              @keydown="onInputKeydown"
              @focus="!open && buttonRef?.click()"
              @click="!open && buttonRef?.click()"
              :id="inputId"
              class="min-w-12 flex-1 border-none bg-transparent p-0 text-base text-text-primary ring-0 outline-none"
              :placeholder="
                isFocused || hasValue || open || !props.label ? placeholder : ''
              "
              :aria-label="!label ? (placeholder ?? '検索') : undefined"
              :aria-invalid="!!errorMessage"
              :aria-describedby="errorMessage ? errorId : undefined"
              :aria-errormessage="errorMessage ? errorId : undefined"
              :aria-required="required || undefined"
              :disabled="props.disabled"
              autocomplete="off" />
          </ComboboxInput>
        </div>

        <label
          v-if="label"
          :for="inputId"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out"
          :class="[
            isFocused || hasValue || open
              ? 'top-1 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2 text-base',
            isFocused ? 'text-blue-500' : '',
          ]">
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </label>
      </div>

      <ComboboxButton as="template">
        <button
          ref="buttonRef"
          type="button"
          class="flex items-center pr-2"
          :class="[props.disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
          :aria-label="label ? `${label}を開く` : '選択肢を開く'"
          :disabled="props.disabled">
          <ChevronDownIcon
            class="h-4 w-4 text-text-secondary"
            aria-hidden="true" />
        </button>
      </ComboboxButton>
    </div>

    <p
      v-if="errorMessage"
      :id="errorId"
      class="mt-1 px-3 text-sm text-error-primary">
      {{ errorMessage }}
    </p>

    <SearchSelectOptionsList
      :filtered-options="filteredOptions"
      :search-term="searchTerm"
      :no-results-text="props.noResultsText"
      check-icon-position="left"
      @after-leave="handleAfterLeave" />
  </Combobox>
</template>
