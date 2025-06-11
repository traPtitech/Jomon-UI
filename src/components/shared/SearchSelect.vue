<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import BaseInput from './BaseInput.vue'
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Option {
  key: string
  value: string
  disabled?: boolean
}

interface Props {
  options: Option[]
  label: string
  placeholder?: string
  searchPlaceholder?: string
  multiple?: boolean
  allowCustom?: boolean
  className?: string
  disabled?: boolean
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '選択してください',
  searchPlaceholder: '検索',
  multiple: false,
  allowCustom: false,
  disabled: false,
  maxHeight: '200px'
})

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()
const model = defineModel<string | string[] | null>({ required: true })

const menuState = ref('close')
const searchTerm = ref('')
const highlightedIndex = ref(-1)
const dropdownRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLElement | null>(null)

const filteredOptions = computed(() => {
  if (menuState.value === 'presearch') {
    return props.options
  }

  return props.options.filter(option =>
    option.key.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const selectedValues = computed(() => {
  return Array.isArray(model.value)
    ? model.value
    : model.value
      ? [model.value]
      : []
})

const getPlaceholderText = computed(() => {
  if (props.multiple && Array.isArray(model.value) && model.value.length > 0) {
    return `${model.value.length}個選択中...`
  }
  return props.searchPlaceholder
})

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    menuState.value = 'close'
    if (!props.multiple && model.value) {
      const selectedOption = props.options.find(
        opt => opt.value === model.value
      )
      searchTerm.value = selectedOption?.key || ''
    } else if (!props.multiple) {
      searchTerm.value = ''
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  if (!props.multiple && model.value && !searchTerm.value) {
    const selectedOption = props.options.find(opt => opt.value === model.value)
    searchTerm.value = selectedOption?.key || ''
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

watch(menuState, () => {
  if (menuState.value === 'close') emit('close')
})

const handleSelect = (selectedValue: string) => {
  if (props.multiple) {
    const currentValues = Array.isArray(model.value) ? model.value : []
    model.value = currentValues.includes(selectedValue)
      ? currentValues.filter(v => v !== selectedValue)
      : [...currentValues, selectedValue]
    searchTerm.value = '' // Clear search after selection
  } else {
    model.value = selectedValue
    const selectedOption = props.options.find(
      opt => opt.value === selectedValue
    )
    searchTerm.value = selectedOption?.key || selectedValue
    menuState.value = 'close'
  }
}

const handleAddCustom = () => {
  if (
    searchTerm.value &&
    !props.options.find(opt => opt.value === searchTerm.value)
  ) {
    handleSelect(searchTerm.value)
  }
}

const handleInputFocus = () => {
  emit('focus')
  menuState.value = 'presearch'
  if (!props.multiple && model.value) {
    const selectedOption = props.options.find(opt => opt.value === model.value)
    searchTerm.value = selectedOption?.key || ''
  }
}

const handleChange = () => {
  menuState.value = 'searched'
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
    case 'Enter':
      e.preventDefault()
      if (
        highlightedIndex.value >= 0 &&
        highlightedIndex.value < filteredOptions.value.length
      ) {
        handleSelect(filteredOptions.value[highlightedIndex.value].value)
      } else if (props.allowCustom && searchTerm.value) {
        handleAddCustom()
      }
      break
    case 'Escape':
      menuState.value = 'close'
      if (!props.multiple && model.value) {
        const selectedOption = props.options.find(
          opt => opt.value === model.value
        )
        searchTerm.value = selectedOption?.key || ''
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
  <div ref="dropdownRef" class="relative" :class="className">
    <div class="relative">
      <BaseInput
        ref="inputRef"
        v-model="searchTerm"
        :label="label"
        :class="['pr-8', disabled && 'opacity-50 cursor-not-allowed']"
        :placeholder="getPlaceholderText"
        :disabled="disabled"
        @focus="handleInputFocus"
        @input="handleChange"
        @keydown="handleKeyDown">
        <MagnifyingGlassIcon class="w-6 ml-3 text-text-secondary" />
      </BaseInput>
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-2"
        :disabled="disabled"
        @click="
          !disabled && menuState === 'close'
            ? (menuState = 'presearch')
            : (menuState = 'close')
        ">
        <ChevronDownIcon
          :class="[
            'h-4 w-4 text-text-secondary transition-transform',
            menuState !== 'close' && 'rotate-180'
          ]" />
      </button>
    </div>

    <!-- Selected items for multiple selection -->
    <div
      v-if="multiple && Array.isArray(model) && model.length > 0"
      class="flex flex-wrap gap-1 mt-2">
      <div v-for="val in model" :key="val" variant="secondary" class="text-xs">
        {{ options.find(opt => opt.value === val)?.key || val }}
        <button
          type="button"
          class="ml-1 hover:bg-accent-secondary rounded-full"
          @click.stop="handleSelect(val)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <div
      v-if="menuState !== 'close'"
      class="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
      <!-- Options list -->
      <div class="max-h-[200px] overflow-auto p-1">
        <div v-if="filteredOptions.length === 0" class="px-2 py-1.5 text-sm">
          {{ searchTerm ? '該当する項目がありません' : '項目がありません' }}
        </div>
        <button
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          type="button"
          :class="[
            'w-full text-left relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
            'hover:bg-blue-100 hover:text-blue-500',
            highlightedIndex === index && 'bg-blue-100 text-blue-500',
            option.disabled && 'opacity-50 cursor-not-allowed',
            selectedValues.includes(option.value) && 'bg-blue-100'
          ]"
          :disabled="option.disabled"
          @click="!option.disabled && handleSelect(option.value)">
          <div
            v-if="multiple"
            class="mr-2 flex h-4 w-4 items-center justify-center">
            <CheckIcon
              v-if="selectedValues.includes(option.value)"
              class="h-4 w-4" />
          </div>
          <span class="truncate">{{ option.key }}</span>
          <CheckIcon
            v-if="!multiple && selectedValues.includes(option.value)"
            class="ml-auto h-4 w-4" />
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
            'w-full text-left relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
            'hover:bg-accent-secondary hover:text-accent-primary border-t'
          ]"
          @click="handleAddCustom">
          <PlusIcon class="mr-2 h-4 w-4" />
          <span>"{{ searchTerm }}" を追加</span>
        </button>
      </div>
    </div>
  </div>
</template>
