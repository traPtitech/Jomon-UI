<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Value {
  key: string
  value: unknown
}

interface Props {
  modelValue: Props['options'][number]['value']
  placeholder?: string
  options: Value[]
  disabled?: boolean
  above?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnSelect: true,
  placeholder: '',
  disabled: false,
  above: false
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const inputSelectRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)
const listItemRefs = ref<HTMLLIElement[] | null>(null)
const isListOpen = ref(false)
const searchQuery = ref('')
const selectedValue = ref<Value>()
const focusingListItemIndex = ref(-1)

const selectValue = (selectedOption: Value) => {
  //remove
  if (selectedValue.value?.value === selectedOption.value) {
    removeValue()
    return
  }
  //add
  selectedValue.value = selectedOption
  emit('update:modelValue', selectedValue.value)
}
const removeValue = () => {
  selectedValue.value = undefined
  emit('update:modelValue', selectedValue.value)
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (inputSelectRef.value === null) return
  if (!inputSelectRef.value.contains(target)) {
    isListOpen.value = false
  }
}

const searchedOptions = computed(() => {
  return props.options.filter(option => {
    const regexp = new RegExp(searchQuery.value, 'i')
    return regexp.test(option.key)
  })
})
const handleClick = () => {
  isListOpen.value = true
  if (inputRef.value === null) return
  inputRef.value.focus()
}
const aboveHeightCalc = computed(() => {
  if (listRef.value === null) return 0
  const height = listRef.value.offsetHeight
  return `-top-${height / 4}`
})
const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault()
  if (listItemRefs.value === null) return
  if (e.key === 'ArrowDown') {
    focusingListItemIndex.value =
      (focusingListItemIndex.value + 1) % listItemRefs.value.length
    const buttonEl = listItemRefs.value[focusingListItemIndex.value]
      .firstChild as HTMLButtonElement
    buttonEl.focus({ preventScroll: false })
    if (listRef.value === null) return
    if (focusingListItemIndex.value > 3) {
      listRef.value.scrollBy({
        top: 12,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
  if (e.key === 'ArrowUp') {
    focusingListItemIndex.value =
      (focusingListItemIndex.value - 1 + listItemRefs.value.length) %
      listItemRefs.value.length
    const buttonEl = listItemRefs.value[focusingListItemIndex.value]
      .firstChild as HTMLButtonElement
    buttonEl.focus({ preventScroll: false })
    if (listRef.value === null) return
    const length =
      searchQuery.value !== ''
        ? searchedOptions.value.length
        : props.options.length
    if (focusingListItemIndex.value < length - 3) {
      listRef.value.scrollBy({
        top: -12,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="inputSelectRef"
    :class="`relative ${disabled && 'cursor-not-allowed'}`">
    <div
      class="flex w-full cursor-text items-center gap-1 rounded border border-gray-300 py-1 pl-2 pr-1"
      :class="`${disabled && 'pointer-events-none'}`"
      @click="handleClick">
      <div class="left-2 flex w-full">
        <span v-if="selectedValue" class="flex items-center">
          {{ selectedValue.key }}
        </span>
        <input
          ref="inputRef"
          v-model="searchQuery"
          class="bg-background flex-grow focus:outline-none"
          :placeholder="selectedValue === undefined ? placeholder : ''"
          @keydown="handleKeydown" />
      </div>
      <button v-if="selectedValue" @click="removeValue">×</button>
      <ChevronDownIcon class="h-4 w-4" />
    </div>
    <ul
      v-if="isListOpen && searchedOptions.length > 0"
      ref="listRef"
      class="absolute z-10 max-h-40 w-full overflow-y-scroll border border-gray-200 bg-white shadow-lg"
      :class="`${above ? `${aboveHeightCalc} rounded-t-lg` : 'rounded-b-lg'}`">
      <li
        v-for="option in searchQuery !== '' ? searchedOptions : options"
        :key="option.key"
        ref="listItemRefs"
        :class="`py-1 last:rounded-b-md focus-within:bg-gray-100 hover:bg-gray-100 ${
          selectedValue?.value === option.value &&
          'bg-gray-200 hover:bg-gray-200'
        }`">
        <button
          class="h-full w-full px-4 text-left focus:outline-none"
          @click="selectValue(option)"
          @keydown="handleKeydown">
          {{ option.key }}
        </button>
      </li>
    </ul>
  </div>
</template>
