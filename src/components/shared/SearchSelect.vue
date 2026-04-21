<script setup lang="ts" generic="T extends string | null">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import type { MenuState, SearchSelectProps } from './SearchSelect.types'
import SearchSelectInput from './SearchSelectInput.vue'
import SearchSelectOption from './SearchSelectOption.vue'

const props = withDefaults(defineProps<SearchSelectProps<NonNullable<T>>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()
const model = defineModel<T>({ required: true })

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
    if (model.value) {
      const selectedOption = props.options.find(
        opt => opt.value === model.value
      )
      searchTerm.value = selectedOption?.key ?? ''
    } else {
      searchTerm.value = ''
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  if (model.value && !searchTerm.value) {
    const selectedOption = props.options.find(opt => opt.value === model.value)
    searchTerm.value = selectedOption?.key ?? ''
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

watch(menuState, () => {
  if (menuState.value === 'close') emit('close')
})

const handleSelect = (selectedValue: NonNullable<T>) => {
  model.value = selectedValue
  const selectedOption = props.options.find(opt => opt.value === selectedValue)
  searchTerm.value = selectedOption?.key ?? selectedValue
  menuState.value = 'close'
}

const handleInputFocus = () => {
  emit('focus')
  menuState.value = 'presearch'
  if (model.value) {
    const selectedOption = props.options.find(opt => opt.value === model.value)
    searchTerm.value = selectedOption?.key ?? ''
  }
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
      if (model.value) {
        const selectedOption = props.options.find(
          opt => opt.value === model.value
        )
        searchTerm.value = selectedOption?.key ?? ''
      } else {
        searchTerm.value = ''
      }
      break
    case 'Tab':
      menuState.value = 'close'
      break
  }
}
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <SearchSelectInput
      v-model:search-term="searchTerm"
      :is-options-opened="menuState !== 'close'"
      :label="label"
      :placeholder="placeholder"
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
          :selected="option.value === model"
          :highlighted="index === highlightedIndex"
          @select="() => handleSelect(option.value)" />
      </div>
    </div>
  </div>
</template>
