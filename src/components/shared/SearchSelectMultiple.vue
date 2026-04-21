<script setup lang="ts" generic="T extends string">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { XMarkIcon } from '@heroicons/vue/24/outline'

import type { MenuState, SearchSelectProps } from './SearchSelect.types'
import SearchSelectInput from './SearchSelectInput.vue'
import SearchSelectOption from './SearchSelectOption.vue'

const props = withDefaults(defineProps<SearchSelectProps<T>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()
const model = defineModel<T[]>({ required: true })

const menuState = ref<MenuState>('close')
const searchTerm = ref('')
const highlightedIndex = ref(-1)
const dropdownRef = ref<HTMLElement | null>(null)

const filteredOptions = computed(() => {
  if (menuState.value === 'presearch') {
    return props.options
  }

  return props.options.filter(option =>
    option.key.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const getPlaceholderText = computed(() => {
  if (model.value.length > 0) {
    return `${String(model.value.length)}個選択中...`
  }
  return props.placeholder
})

const handleClickOutside = (event: MouseEvent) => {
  if (typeof Node === 'undefined') {
    return
  }
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    menuState.value = 'close'
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

watch(menuState, () => {
  if (menuState.value === 'close') emit('close')
})

const handleSelect = (selectedValue: T) => {
  model.value = model.value.includes(selectedValue)
    ? model.value.filter(v => v !== selectedValue)
    : [...model.value, selectedValue]
  searchTerm.value = '' // Clear search after selection
}

const handleInputFocus = () => {
  emit('focus')
  menuState.value = 'presearch'
}

const handleChange = () => {
  menuState.value = 'searched'
  highlightedIndex.value = -1
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (
    menuState.value === 'close' &&
    (e.key === 'ArrowDown' || e.key === 'Enter')
  ) {
    e.preventDefault()
    menuState.value = 'presearch'
    return
  }
  if (menuState.value === 'close') return
  emit('keydown', e)

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value =
        highlightedIndex.value < filteredOptions.value.length - 1
          ? highlightedIndex.value + 1
          : highlightedIndex.value
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value =
        highlightedIndex.value > 0
          ? highlightedIndex.value - 1
          : highlightedIndex.value
      break
    case 'Enter': {
      e.preventDefault()
      const option = filteredOptions.value[highlightedIndex.value]
      if (option && !option.disabled) {
        handleSelect(option.value)
      }
      break
    }
    case 'Escape':
      menuState.value = 'close'
      searchTerm.value = ''
      break
    case 'Tab':
      menuState.value = 'close'
      break
  }
}

const getKeyByValue = (value: T) =>
  props.options.find(opt => opt.value === value)?.key || value
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <SearchSelectInput
      v-model:search-term="searchTerm"
      :is-options-opened="menuState !== 'close'"
      :label="label"
      :placeholder="getPlaceholderText"
      :disabled="disabled"
      :required="required"
      @focus="handleInputFocus"
      @input="handleChange"
      @keydown="handleKeyDown"
      @click-toggle-button="
        menuState === 'close'
          ? (menuState = 'presearch')
          : (menuState = 'close')
      " />

    <!-- Selected items for multiple selection -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div v-for="val in model" :key="val" class="text-xs">
        {{ getKeyByValue(val) }}
        <button
          type="button"
          class="ml-1 rounded-full hover:bg-blue-100"
          :aria-label="`${getKeyByValue(val)} を選択解除`"
          @click.stop="handleSelect(val)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <div
      v-if="menuState !== 'close'"
      class="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
      <!-- Options list -->
      <div class="max-h-50 overflow-auto p-1">
        <div v-if="filteredOptions.length === 0" class="px-2 py-1.5 text-sm">
          {{ searchTerm ? '該当する項目がありません' : '項目がありません' }}
        </div>
        <SearchSelectOption
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          :option="option"
          :selected="model.includes(option.value)"
          :highlighted="index === highlightedIndex"
          @select="() => handleSelect(option.value)" />
      </div>
    </div>
  </div>
</template>
