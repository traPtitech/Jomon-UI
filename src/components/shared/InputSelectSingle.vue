<script lang="ts" setup>
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
}

const props = withDefaults(defineProps<Props>(), {
  closeOnSelect: true,
  placeholder: '',
  disabled: false
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const inputSelect = ref()
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
      class="flex w-full cursor-text gap-1 rounded border border-gray-300 py-1 px-2"
      :class="`${disabled && 'pointer-events-none'}`"
      @click="isListOpen = true">
      <div class="left-2 flex w-full">
        <span v-if="selectedValue">{{ selectedValue.key }}</span>
        <input
          v-model="searchQuery"
          class="bg-background flex-grow p-1 focus:outline-none"
          :placeholder="selectedValue === undefined ? placeholder : ''" />
      </div>
      <button v-if="selectedValue" @click="removeValue">×</button>
    </div>
    <ul
      v-if="isListOpen"
      class="absolute z-10 w-full rounded-b-lg border border-gray-200 bg-white shadow-lg">
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
