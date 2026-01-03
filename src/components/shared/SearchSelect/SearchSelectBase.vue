<script setup lang="ts" generic="T extends string | number, M extends T | null">
import { type ComponentPublicInstance, computed, useTemplateRef } from 'vue'

import { Combobox, ComboboxButton, ComboboxInput } from '@headlessui/vue'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import SearchSelectOptionsList from './SearchSelectOptionsList.vue'
import { useSearchSelect } from './composables/useSearchSelect'
import { useSearchSelectField } from './composables/useSearchSelectField'
import type { SearchSelectCommonProps } from './types'

const props = withDefaults(
  defineProps<SearchSelectCommonProps<T> & { nullable?: boolean }>(),
  {
    placeholder: '検索',
    disabled: false,
    required: false,
    nullable: false,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const model = defineModel<M>({ required: true })

const { inputId, errorId, isFocused, handleFocusOut } = useSearchSelectField()

const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef')
const containerRef = useTemplateRef<ComponentPublicInstance>('containerRef')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

const { searchTerm, filteredOptions, getLabel } = useSearchSelect(
  computed(() => props.options),
  props.filterFunction
)

const hasValue = computed(() => model.value !== null)

const focusInputAndOpen = (e: Event, open: boolean) => {
  if (props.disabled) return

  if (e.target instanceof HTMLElement) {
    if (e.target.closest('button') || e.target.closest('input')) {
      return
    }
  }

  if (document.activeElement !== inputRef.value) {
    inputRef.value?.focus()
  } else if (!open) {
    buttonRef.value?.click()
  }
}

const handleChange = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    searchTerm.value = e.target.value
  }
}

const handleAfterLeave = () => {
  searchTerm.value = ''
  emit('close')
}

defineOptions({
  name: 'SearchSelectBase',
})
</script>

<template>
  <Combobox
    ref="containerRef"
    v-model="model"
    :name="name"
    :disabled="disabled"
    :nullable="props.nullable"
    as="div"
    class="group relative"
    v-slot="{ open }"
    v-bind="{
      onFocusin: () => (isFocused = true),
      onFocusout: (e: FocusEvent) => handleFocusOut(e, containerRef),
    }">
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
    <div
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[
        props.disabled
          ? 'cursor-not-allowed bg-surface-secondary opacity-60'
          : 'cursor-pointer bg-white',
      ]"
      @click="focusInputAndOpen($event, open)">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon
          class="w-6 text-text-secondary"
          aria-hidden="true" />
      </div>

      <div
        class="relative w-full"
        :class="[props.disabled ? 'pointer-events-none' : '']">
        <ComboboxInput
          as="template"
          :display-value="(val: unknown) => (open ? searchTerm : getLabel(val))"
          @change="handleChange">
          <input
            ref="inputRef"
            @focus="!open && buttonRef?.click()"
            @click.stop="!open && buttonRef?.click()"
            :id="inputId"
            class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
            :class="[
              label ? 'pt-6' : 'pt-2',
              props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
            :placeholder="
              isFocused || hasValue || open || !props.label ? placeholder : ''
            "
            :aria-label="!label ? (placeholder ?? '選択') : undefined"
            :aria-invalid="!!errorMessage"
            :aria-describedby="errorMessage ? errorId : undefined"
            :aria-errormessage="errorMessage ? errorId : undefined"
            :aria-required="required || undefined"
            :disabled="props.disabled"
            autocomplete="off" />
        </ComboboxInput>

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
      @after-leave="handleAfterLeave" />
  </Combobox>
</template>
