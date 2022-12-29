<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Value {
  key: string
  value: unknown
}

interface Props {
  modelValue: Props['options'][number]['value']
  isMultiple?: boolean
  placeholder?: string
  options: Value[]
  disabled?: boolean
  taggable?: boolean
  createOption?: (option: string) => Props['options'][number]['value']
}

const props = withDefaults(defineProps<Props>(), {
  closeOnSelect: true,
  isMultiple: false,
  placeholder: '',
  disabled: false,
  taggable: false,
  createOption: (option: string) => option
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const inputSelect = ref()
const isListOpen = ref(false)
const searchQuery = ref('')
const selectedValues = ref<Value[]>([])
const selectValue = (selectedOption: Value) => {
  //remove
  if (
    selectedValues.value.some(value => value.value === selectedOption.value)
  ) {
    removeValue(selectedOption)
    return
  }
  //add
  selectedValues.value = [...selectedValues.value, selectedOption]
  emit('update:modelValue', selectedValues.value)
}
const removeValue = (selectedOption: Value) => {
  selectedValues.value = selectedValues.value.filter(
    value => value !== selectedOption
  )
  emit('update:modelValue', selectedValues.value)
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (inputSelect.value === null) return
  if (!inputSelect.value.contains(target)) {
    isListOpen.value = false
  }
}

const searchedOptions = computed(() => {
  return props.options.filter(option => {
    const regexp = new RegExp(searchQuery.value, 'i')
    return regexp.test(option.key)
  })
})
const pushTag = () => {
  //todo:pushできない場合を場合分けしてエラー出したりUIで分かりやすくしたりする
  if (
    searchQuery.value === '' ||
    !props.taggable ||
    props.options.some(value => value.key === searchQuery.value) ||
    selectedValues.value.some(value => value.key === searchQuery.value)
  ) {
    return
  }
  selectedValues.value = [
    ...selectedValues.value,
    {
      key: searchQuery.value,
      value: props.createOption(searchQuery.value)
    }
  ]
  emit('update:modelValue', selectedValues.value)
  searchQuery.value = ''
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
    ref="inputSelect"
    :class="`relative ${disabled && 'cursor-not-allowed'}`">
    <div
      class="flex w-full cursor-text gap-1 overflow-x-scroll rounded border border-gray-300 p-1"
      :class="`${disabled && 'pointer-events-none'}`"
      @click="isListOpen = true">
      <div
        v-for="selectedValue in selectedValues"
        :key="selectedValue.key"
        class="flex items-center rounded border border-gray-200 bg-gray-200 px-1">
        {{ selectedValue.key }}
        <button @click="removeValue(selectedValue)">×</button>
      </div>
      <input
        v-model="searchQuery"
        class="bg-background flex-grow p-1 focus:outline-none"
        :placeholder="selectedValues.length === 0 ? placeholder : ''"
        @keyup.enter="pushTag" />
    </div>
    <ul
      v-if="isListOpen"
      class="absolute z-10 w-full rounded-b-lg border border-gray-200 bg-white shadow-lg">
      <li
        v-for="option in searchQuery !== '' ? searchedOptions : options"
        :key="option.key"
        :class="`py-1 last:rounded-b-md hover:bg-gray-100 ${
          selectedValues.some(value => value.value === option.value) &&
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
