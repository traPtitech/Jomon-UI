<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type ValueValue = Record<string, any> | string | null

interface Value {
  key: string
  value: ValueValue
}

interface Props {
  modelValue: ValueValue[]
  placeholder?: string
  options: Value[] | undefined
  disabled?: boolean
  taggable?: boolean
  createOption?: (option: string) => ValueValue
  isDropdownAbove?: boolean
  /* [optionsのkey, modelValueのkey] modelValueをselectedValuesに適用するときに使う*/
  uniqKeys?: [string, string]
  /* デフォルト幅を設定するため */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  taggable: false,
  createOption: (option: string) => option,
  isDropdownAbove: false,
  uniqKeys: () => ['id', 'id'],
  class: ''
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: ValueValue[]): void
  (e: 'close'): void
}>()

const inputSelectRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)
const listItemRefs = ref<HTMLLIElement[] | null>(null)
const isDropdownOpen = ref(false)
/* 検索クエリ。タグの作成にも使う */
const searchQuery = ref('')
/* ドロップダウンの位置を計算するのに使う */
const dropdownHeight = ref(0)

const convertValue = (value: ValueValue, key: string) => {
  if (typeof value === 'string') {
    return value
  }
  if (value === null) return undefined
  return value[key]
}

/* 実際に表示するoption */
const selectedValues = computed(() => {
  return props.modelValue
    .map(value => {
      const selectedValue = props.options?.find(
        option =>
          convertValue(option.value, props.uniqKeys[0]) ===
          convertValue(value, props.uniqKeys[1])
      )
      if (selectedValue === undefined) {
        return pushedTags.value.find(
          tag =>
            convertValue(tag.value, props.uniqKeys[0]) ===
            convertValue(value, props.uniqKeys[1])
        )
      }
      return selectedValue
    })
    .filter((value): value is Value => value !== undefined)
})
const focusingListItemIndex = ref(-1)
/* 作成されたタグ。selectedValuesの計算のために別で持っている */
const pushedTags = ref<Value[]>([])

const selectValue = (selectedOption: Value) => {
  //remove
  if (
    props.modelValue.some(
      value =>
        convertValue(value, props.uniqKeys[1]) ===
        convertValue(selectedOption.value, props.uniqKeys[0])
    )
  ) {
    removeValue(selectedOption)
    return
  }
  //add
  emit('update:modelValue', [...props.modelValue, selectedOption.value])
  if (inputRef.value === null) return
  inputRef.value.focus()
}
const removeValue = (selectedOption: Value) => {
  //handleClickOutsideより先に時刻されてしまい、消してアイテムのNode.containsがfalseになってドロップダウンが閉じてしまうので、setTimeoutで遅らせる
  setTimeout(() => {
    emit(
      'update:modelValue',
      props.modelValue.filter(
        value =>
          convertValue(value, props.uniqKeys[1]) !==
          convertValue(selectedOption.value, props.uniqKeys[0])
      )
    )
  }, 10)
}

/* コンポーネント外がクリックされたときの処理 */
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (inputSelectRef.value === null) return
  if (!inputSelectRef.value.contains(target)) {
    isDropdownOpen.value = false
    emit('close')
  }
}

/* 検索処理 */
const searchedOptions = computed(() => {
  return (
    props.options?.filter(option => {
      const regexp = new RegExp(searchQuery.value, 'i')
      return regexp.test(option.key)
    }) ?? []
  )
})
const pushTag = () => {
  if (searchQuery.value === '' || !props.taggable) {
    return
  }
  //同じ選択肢がある
  if (props.options?.some(value => value.key === searchQuery.value)) {
    return
  }
  //既に同じタグを作った
  if (
    props.modelValue.some(
      value =>
        convertValue(value, props.uniqKeys[1]) ===
        convertValue(props.createOption(searchQuery.value), props.uniqKeys[0])
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
  isDropdownOpen.value = true
  if (inputRef.value === null) return
  inputRef.value.focus()
}

/* キーボードによる操作の処理 */
const handleKeydown = (e: KeyboardEvent, option: Value) => {
  if (e.key === 'Tab') {
    isDropdownOpen.value = false
    emit('close')
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (searchQuery.value !== '') return
    if (listItemRefs.value === null) return
    const length =
      searchQuery.value !== ''
        ? searchedOptions.value.length
        : props.options?.length ?? 0
    focusingListItemIndex.value = (focusingListItemIndex.value + 1) % length
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
    if (searchQuery.value !== '') return
    if (listItemRefs.value === null) return
    const length =
      searchQuery.value !== ''
        ? searchedOptions.value.length
        : props.options?.length ?? 0
    focusingListItemIndex.value =
      (focusingListItemIndex.value - 1 + length) % length
    const buttonEl = listItemRefs.value[focusingListItemIndex.value]
      .firstChild as HTMLButtonElement
    buttonEl.focus({ preventScroll: false })
    if (listRef.value === null) return

    if (focusingListItemIndex.value < length - 3) {
      listRef.value.scrollBy({
        top: -12,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    if (focusingListItemIndex.value === -1) {
      pushTag()
    } else {
      selectValue(option)
    }
  }
}
const handleInputKeydown = (e: KeyboardEvent) => {
  if (listItemRefs.value === null) return

  if (e.key === 'Enter') {
    e.preventDefault()
    pushTag()
  } else {
    handleKeydown(e, {} as Value)
  }
}

const calcWidth = computed(() => {
  if (/w-/.test(props.class)) {
    return props.class
  }
  return `${props.class} w-70`
})

/* ドロップダウンの位置を計算する処理 */
const updateHeight = () => {
  if (listRef.value === null) return
  dropdownHeight.value = listRef.value.offsetHeight / 4
}
const resizeObserver = new ResizeObserver(updateHeight)
watch([listRef], () => {
  if (listRef.value === null) return
  resizeObserver.observe(listRef.value)
})
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  if (listRef.value === null) return
  resizeObserver.observe(listRef.value)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  resizeObserver.disconnect()
})
</script>

<template>
  <div
    ref="inputSelectRef"
    :class="`relative ${
      disabled && 'cursor-not-allowed'
    } min-w-70 ${calcWidth}`">
    <div
      class="flex w-full cursor-text items-center rounded border border-gray-300 py-1 pl-1"
      :class="`${disabled && 'pointer-events-none'}`"
      @click.prevent="handleClick">
      <div class="flex w-full items-center overflow-x-scroll">
        <div
          v-for="selectedValue in selectedValues"
          :key="selectedValue.key"
          class="ml-1 flex items-center rounded border border-gray-200 bg-gray-200 px-1">
          <span class="whitespace-nowrap">{{ selectedValue.key }}</span>
          <button type="button" @click="removeValue(selectedValue)">×</button>
        </div>
        <input
          ref="inputRef"
          v-model="searchQuery"
          class="flex-grow bg-transparent pl-1 focus:outline-none"
          :placeholder="selectedValues.length === 0 ? placeholder : ''"
          @focus="isDropdownOpen = true"
          @keydown="handleInputKeydown" />
      </div>
      <ChevronDownIcon class="min-w-4 mx-1 h-4" />
    </div>
    <ul
      v-if="isDropdownOpen && searchedOptions.length > 0"
      ref="listRef"
      class="absolute z-10 max-h-40 w-full overflow-y-scroll border border-gray-200 bg-white shadow-lg"
      :class="`${
        isDropdownAbove ? `-top-${dropdownHeight} rounded-t-lg` : 'rounded-b-lg'
      }`">
      <li
        v-for="option in searchQuery !== '' ? searchedOptions : options"
        :key="option.key"
        ref="listItemRefs"
        :class="`last:not-first:rounded-b-lg focus-within:bg-gray-100 hover:bg-gray-100 ${
          selectedValues.some(value => value.value === option.value) &&
          'bg-gray-200 hover:bg-gray-200'
        }`">
        <button
          class="h-full w-full px-4 py-1 text-left focus:outline-none"
          type="button"
          @click="selectValue(option)"
          @keydown="handleKeydown($event, option)">
          {{ option.key }}
        </button>
      </li>
    </ul>
  </div>
</template>
