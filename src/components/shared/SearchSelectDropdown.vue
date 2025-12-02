<script setup lang="ts" generic="T extends string | null">
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
  const options = listRef.value.querySelectorAll('[role="option"]')
  const highlightedOption = options[index] as HTMLElement | undefined
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
  <div
    :id="id"
    class="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg"
    role="listbox">
    <!-- Options list -->
    <div ref="listRef" class="max-h-[200px] overflow-auto p-1">
      <div v-if="filteredOptions.length === 0" class="px-2 py-1.5 text-sm">
        {{ searchTerm ? '該当する項目がありません' : '項目がありません' }}
      </div>
      <button
        v-for="(option, index) in filteredOptions"
        :id="`${id}-option-${index}`"
        :key="String(option.value)"
        type="button"
        role="option"
        :aria-selected="isSelected(option.value, modelValue)"
        :class="[
          'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-2 text-left text-sm outline-none select-none',
          'hover:bg-blue-100 hover:text-blue-500',
          highlightedIndex === index && 'bg-blue-100 text-blue-500',
          option.disabled && 'cursor-not-allowed opacity-50',
          isSelected(option.value, modelValue) && 'bg-blue-100',
        ]"
        :disabled="option.disabled"
        @mousedown.prevent
        @click="!option.disabled && emit('select-option', option.value)">
        <slot
          name="option-content"
          :option="option"
          :is-selected="isSelected(option.value, modelValue)">
          <span class="truncate">{{ option.key }}</span>
        </slot>
      </button>

      <!-- Add custom option -->
      <button
        v-if="
          allowCustom &&
          searchTerm &&
          !options.find(opt => opt.value === searchTerm)
        "
        type="button"
        :class="[
          'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none',
          'border-t hover:bg-blue-100 hover:text-blue-500',
        ]"
        @click="emit('add-custom')">
        <PlusIcon class="mr-2 h-4 w-4" />
        <span>"{{ searchTerm }}" を追加</span>
      </button>
    </div>
  </div>
</template>
