<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Value {
  key: string
  value: unknown
}

interface Props {
  modelValue: Props['options'][number]['value'][]
  isMultiple?: boolean
  placeholder?: string
  options: Value[]
  disabled?: boolean
  taggable?: boolean
  createOption?: (option: string) => Props['options'][number]['value']
  above?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnSelect: true,
  isMultiple: false,
  placeholder: '',
  disabled: false,
  taggable: false,
  createOption: (option: string) => option,
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
const selectedValues = computed(() => {
  return props.modelValue
    .map(value => {
      const selectedValue = props.options.find(option => option.value === value)
      if (selectedValue === undefined) {
        return pushedTags.value.find(tag => tag.value === value)
      }
      return selectedValue
    })
    .filter((value): value is Value => value !== undefined)
})
const focusingListItemIndex = ref(-1)
const pushedTags = ref<Value[]>([])

const selectValue = (selectedOption: Value) => {
  //remove
  if (props.modelValue.some(value => value === selectedOption.value)) {
    removeValue(selectedOption)
    return
  }
  //add
  emit('update:modelValue', [...props.modelValue, selectedOption.value])
  if (inputRef.value === null) return
  inputRef.value.focus()
}
const removeValue = (selectedOption: Value) => {
  emit(
    'update:modelValue',
    props.modelValue.filter(value => value !== selectedOption.value)
  )
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
const pushTag = () => {
  //todo:pushできない場合を場合分けしてエラー出したりUIで分かりやすくしたりする
  if (
    searchQuery.value === '' ||
    !props.taggable ||
    props.options.some(value => value.key === searchQuery.value) ||
    props.modelValue.some(
      value => value === props.createOption(searchQuery.value)
    )
  ) {
    return
  }
  pushedTags.value = [
    ...pushedTags.value,
    {
      key: searchQuery.value,
      value: props.createOption(searchQuery.value)
    }
  ]
  emit('update:modelValue', [
    ...props.modelValue,
    props.createOption(searchQuery.value)
  ])
  searchQuery.value = ''
}
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
  if (listItemRefs.value === null) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
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
    e.preventDefault()
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
  if (e.key === 'Enter') {
    if (focusingListItemIndex.value === -1) {
      pushTag()
      return
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
      class="flex w-full cursor-text items-center gap-1 overflow-x-scroll rounded border border-gray-300 p-1"
      :class="`${disabled && 'pointer-events-none'}`"
      @click="handleClick">
      <div
        v-for="selectedValue in selectedValues"
        :key="selectedValue.key"
        class="flex items-center rounded border border-gray-200 bg-gray-200 px-1">
        <span>{{ selectedValue.key }}</span>
        <button @click="removeValue(selectedValue)">×</button>
      </div>
      <input
        ref="inputRef"
        v-model="searchQuery"
        class="bg-background flex-grow pl-1 focus:outline-none"
        :placeholder="selectedValues.length === 0 ? placeholder : ''"
        @keydown="handleKeydown" />
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
          selectedValues.some(value => value.value === option.value) &&
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
