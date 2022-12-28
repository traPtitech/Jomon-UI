<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Value {
  key: string
  value: unknown
}

interface Props {
  modelValue: Props['options'][number]['value']
  closeOnSelect?: boolean
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
    selectedValues.value = selectedValues.value.filter(
      value => value.value !== selectedOption.value
    )
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
  if (searchQuery.value === '' || !props.taggable) return
  selectValue({
    key: searchQuery.value,
    value: props.createOption(searchQuery.value)
  })
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
  <div ref="inputSelect" :class="`${disabled && 'cursor-not-allowed'}`">
    <div
      class="flex flex gap-1 border border-gray-300 p-1"
      :class="`${disabled && 'pointer-events-none'}`">
      <div
        v-for="selectedValue in selectedValues"
        :key="selectedValue.key"
        class="rounded border border-gray-200 bg-gray-200 px-1 py-0.5">
        {{ selectedValue.key }}
        <button @click="removeValue(selectedValue)">×</button>
      </div>
      <input
        v-model="searchQuery"
        class="flex-grow p-1"
        @focus="isListOpen = true"
        @keyup.enter="pushTag" />
    </div>
    <ul v-if="isListOpen" class="rounded-b-lg border border-gray-200 shadow-lg">
      <li
        v-for="option in searchQuery !== '' ? searchedOptions : options"
        :key="option.key"
        :class="`py-1 ${
          selectedValues.some(value => value.value === option.value) &&
          'bg-gray-200'
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
