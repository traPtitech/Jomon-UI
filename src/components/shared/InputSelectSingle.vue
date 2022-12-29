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
const isListOpen = ref(false)
const searchQuery = ref('')
const selectedValue = ref<Value>()
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
          :placeholder="selectedValue === undefined ? placeholder : ''" />
      </div>
      <button v-if="selectedValue" @click="removeValue">×</button>
      <ChevronDownIcon class="h-4 w-4" />
    </div>
    <ul
      v-if="isListOpen && searchedOptions.length > 0"
      class="absolute z-10 max-h-40 w-full overflow-y-scroll rounded-b-lg border border-gray-200 bg-white shadow-lg"
      :class="`${above ? `${aboveHeightCalc} rounded-t-lg` : 'rounded-b-lg'}`">
      <li
        v-for="option in searchQuery !== '' ? searchedOptions : options"
        :key="option.key"
        :class="`py-1 last:rounded-b-md hover:bg-gray-100 ${
          selectedValue?.value === option.value &&
          'bg-gray-200 hover:bg-gray-200'
        }`">
        <button
          class="h-full w-full px-4 text-left"
          @click="selectValue(option)">
          {{ option.key }}
        </button>
      </li>
    </ul>
  </div>
</template>
