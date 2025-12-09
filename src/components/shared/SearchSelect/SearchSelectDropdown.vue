<script setup lang="ts" generic="T extends string | number | null">
import { computed, nextTick, onMounted, watch } from 'vue'

import { useVirtualList } from '@vueuse/core'

import type { Option } from '@/components/shared/types'

const props = withDefaults(
  defineProps<{
    filteredOptions: Option<T>[]
    searchTerm: string
    highlightedIndex: number
    modelValue: T | T[] | null
    id: string
    multiple?: boolean
    itemHeight?: number
    /**
     * Text to display when no options match the search term.
     * @default '該当する項目がありません。'
     */
    noResultsText?: string | undefined
    /**
     * Text to display when there are no options available at all.
     * @default '項目がありません。'
     */
    noItemsText?: string | undefined
  }>(),
  {
    noResultsText: '該当する項目がありません。',
    noItemsText: '項目がありません。',
  }
)

const emit = defineEmits<{
  (e: 'select-option', value: T): void
}>()

const isSelected = (value: T, model: T | T[] | null): boolean => {
  if (Array.isArray(model)) {
    return model.includes(value)
  }
  return model === value
}

const optionsList = computed(() => props.filteredOptions)

// Virtual Scroll setup
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  optionsList,
  {
    itemHeight: props.itemHeight ?? 36, // Approximate height of each option (py-2 * 2 + text-sm + leading/border)
    overscan: 10,
  }
)

const scrollToHighlighted = async (index: number) => {
  if (index === -1) return
  await nextTick()
  scrollTo(index)
}

watch(
  () => props.highlightedIndex,
  index => {
    void scrollToHighlighted(index)
  }
)

onMounted(() => {
  void scrollToHighlighted(props.highlightedIndex)
})
const getOptionClass = (option: Option<T>, index: number) => {
  const baseClass =
    'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-2 text-left text-sm outline-none select-none'

  if (option.disabled) {
    return [baseClass, 'cursor-not-allowed text-gray-400 opacity-50']
  }

  const classes = [baseClass, 'hover:bg-blue-100 hover:text-blue-500']

  if (props.highlightedIndex === index) {
    classes.push('bg-blue-100 text-blue-500')
  } else if (isSelected(option.value, props.modelValue)) {
    classes.push('bg-blue-100')
  }

  return classes
}
</script>

<template>
  <div class="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
    <div role="status" aria-live="polite" class="sr-only" :id="`${id}-status`">
      {{
        filteredOptions.length > 0
          ? `${filteredOptions.length} 件の結果が見つかりました。`
          : searchTerm
            ? noResultsText
            : noItemsText
      }}
    </div>
    <!-- Options list -->
    <div
      v-bind="containerProps"
      :id="id"
      class="max-h-[200px] p-1 focus:outline-none"
      role="listbox"
      :aria-multiselectable="multiple || undefined"
      :aria-describedby="`${id}-status`">
      <div v-bind="wrapperProps">
        <div
          v-if="filteredOptions.length === 0"
          class="p-2 text-sm text-text-secondary"
          role="status"
          aria-live="polite">
          {{ searchTerm ? noResultsText : noItemsText }}
        </div>
        <!--
          This component implements the Combobox (Active Descendant) pattern.
          Focus remains on the input element, and key events are handled there.
          The 'div' elements (options) represent the options but are not focusable.
          WARNING: Since this uses a Virtual List, options outside the view port are NOT in the DOM.
          `aria-activedescendant` may point to a missing ID if not careful.
          However, `useSearchSelectHighlight` and `scrollToHighlighted` ensure the highlighted
          item is scrolled into view (and thus rendered) whenever the index changes.
        -->
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
          v-for="{ data: option, index } in list"
          :id="`${id}-option-${index}`"
          :key="option.value !== null ? option.value : index"
          role="option"
          :aria-selected="
            !option.disabled && isSelected(option.value, modelValue)
          "
          :aria-disabled="option.disabled || undefined"
          :class="getOptionClass(option, index)"
          tabindex="-1"
          @mousedown.prevent
          @click="!option.disabled && emit('select-option', option.value)">
          <slot
            name="option-content"
            :option="option"
            :is-selected="isSelected(option.value, modelValue)">
            <span class="truncate">{{ option.key }}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
