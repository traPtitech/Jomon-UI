<script setup lang="ts" generic="T extends string | number | null">
import { nextTick, onMounted, useTemplateRef, watch } from 'vue'

import { PlusIcon } from '@heroicons/vue/24/outline'

import type { Option } from './types'

const props = defineProps<{
  filteredOptions: Option<T>[]
  searchTerm: string
  highlightedIndex: number
  modelValue: T | T[] | null
  allowCustom?: boolean
  options: Option<T>[]
  id?: string
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-option', value: T): void
  (e: 'add-custom'): void
}>()

const isSelected = (value: T, model: T | T[] | null): boolean => {
  if (Array.isArray(model)) {
    return model.includes(value)
  }
  return model === value
}

const listRef = useTemplateRef<HTMLElement>('listRef')

const scrollToHighlighted = async (index: number) => {
  if (index === -1 || !listRef.value) return
  await nextTick()
  const optionEls = listRef.value.querySelectorAll('[role="option"]')
  const highlightedOption = optionEls[index] as HTMLElement | undefined
  if (highlightedOption) {
    highlightedOption.scrollIntoView({ block: 'nearest' })
  }
}

watch(
  () => props.highlightedIndex,
  index => {
    void scrollToHighlighted(index)
  }
)

onMounted(() => {
  void scrollToHighlighted(props.highlightedIndex)
})
</script>

<template>
  <div class="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
    <!-- Options list -->
    <ul
      :id="id"
      ref="listRef"
      class="max-h-[200px] overflow-auto p-1"
      role="listbox"
      :aria-multiselectable="multiple || undefined">
      <li v-if="filteredOptions.length === 0" class="px-2 py-1.5 text-sm">
        {{ searchTerm ? '該当する項目がありません' : '項目がありません' }}
      </li>
      <!--
        This component implements the Combobox (Active Descendant) pattern.
        Focus remains on the input element, and key events are handled there.
        The 'li' elements are not focusable (tabindex="-1") and do not need key handlers.
        We disable the lint rule because it doesn't understand this pattern.
      -->
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
      <li
        v-for="(option, index) in filteredOptions"
        :id="`${id}-option-${index}`"
        :key="String(option.value)"
        role="option"
        :aria-selected="
          !option.disabled && isSelected(option.value, modelValue)
        "
        :aria-disabled="option.disabled || undefined"
        :class="[
          'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-2 text-left text-sm outline-none select-none',
          option.disabled
            ? 'cursor-not-allowed text-gray-400 opacity-50'
            : 'hover:bg-blue-100 hover:text-blue-500',
          highlightedIndex === index &&
            !option.disabled &&
            'bg-blue-100 text-blue-500',
          !option.disabled &&
            isSelected(option.value, modelValue) &&
            'bg-blue-100',
        ]"
        tabindex="-1"
        @mousedown.prevent
        @click="!option.disabled && emit('select-option', option.value)">
        <slot
          name="option-content"
          :option="option"
          :is-selected="isSelected(option.value, modelValue)">
          <span class="truncate">{{ option.key }}</span>
        </slot>
      </li>

      <!-- Add custom option -->
      <li
        v-if="
          allowCustom &&
          searchTerm &&
          !options.find(opt => opt.key === searchTerm)
        "
        role="option"
        :aria-selected="false"
        tabindex="-1"
        :class="[
          'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none',
          'border-t hover:bg-blue-100 hover:text-blue-500',
        ]"
        @mousedown.prevent
        @click="emit('add-custom')">
        <PlusIcon class="mr-2 h-4 w-4" />
        <span>"{{ searchTerm }}" を追加</span>
      </li>
    </ul>
  </div>
</template>
