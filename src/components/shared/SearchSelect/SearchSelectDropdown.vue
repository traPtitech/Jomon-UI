<script
  setup
  lang="ts"
  generic="T extends string | number, TModel extends T | T[] | null">
import { computed, nextTick, onMounted, watch } from 'vue'

import { useVirtualList } from '@vueuse/core'

import type { Option, SearchSelectTheme } from './types'

const props = withDefaults(
  defineProps<{
    filteredOptions: Option<T>[]
    searchTerm: string
    highlightedIndex: number
    modelValue: TModel
    listboxId: string
    multiple?: boolean
    itemHeight?: number | undefined
    /**
     * Text to display when no options match the search term.
     * @default '該当する項目がありません。'
     */
    noResultsText?: string | undefined
    /**
     * Text to display when there are no options available at all.
     * @default '項目がありません。'
     */
    /**
     * Text to display when there are no options available at all.
     * @default '項目がありません。'
     */
    noItemsText?: string | undefined
    /**
     * Theming options.
     */
    theme?: SearchSelectTheme | undefined
  }>(),
  {
    noResultsText: '該当する項目がありません。',
    noItemsText: '項目がありません。',
    theme: () => ({
      themeColor: 'blue',
    }),
  }
)

// Use a fixed item height for the Virtual List.
// If option content varies significantly, consider implementing dynamic height measurement
// or requiring the parent to pass a specific `itemHeight`.
const ITEM_HEIGHT = props.itemHeight ?? 36
const OVERSCAN = 10

const emit = defineEmits<{
  (e: 'select-option', value: T): void
}>()

const isSelected = (value: T, model: TModel): boolean => {
  if (Array.isArray(model)) {
    return model.includes(value)
  }
  return model === value
}

const optionsList = computed(() => props.filteredOptions)

// Note: We use useVirtualList for performance with large datasets.
// This means only visible items are rendered in the DOM.
// WE MUST ENSURE that the highlighted item (`aria-activedescendant`) is always scrolled into view
// so that it exists in the DOM for screen readers to detect it.
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  optionsList,
  {
    itemHeight: ITEM_HEIGHT,
    overscan: OVERSCAN,
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

  // Determine styles based on theme or custom classes
  const themeColor = props.theme.themeColor ?? 'blue'
  const isGray = themeColor === 'gray'

  const activeClass =
    props.theme.activeOptionClass ??
    (isGray ? 'bg-gray-100 text-gray-900' : 'bg-blue-100 text-blue-500')

  const hoverClass =
    props.theme.hoverOptionClass ??
    (isGray
      ? 'hover:bg-gray-100 hover:text-gray-900'
      : 'hover:bg-blue-100 hover:text-blue-500')

  const classes = [baseClass, hoverClass]

  if (props.highlightedIndex === index) {
    classes.push(activeClass)
  } else if (isSelected(option.key, props.modelValue)) {
    // Selected options also get the active style (or maybe just bg, but standard behavior usually highlights selected)
    // The original code applied `bg-blue-100` for selected, and `bg-blue-100 text-blue-500` for highlighted.
    // Let's stick closer to original: Highlighted gets full active class.
    // Selected gets background tint.
    // But `activeClass` might be complex.
    // Using `activeClass` for selected as well ensures consistency.
    classes.push(activeClass)
  }

  return classes
}
</script>

<template>
  <div class="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
    <div
      role="status"
      aria-live="polite"
      class="sr-only"
      :id="`${listboxId}-status`">
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
      :id="listboxId"
      class="max-h-[200px] p-1 focus:outline-none"
      role="listbox"
      :aria-multiselectable="multiple || undefined"
      :aria-describedby="`${listboxId}-status`">
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
          :id="`${listboxId}-option-${index}`"
          :key="option.key !== null ? option.key : index"
          role="option"
          :aria-selected="
            !option.disabled && isSelected(option.key, modelValue)
          "
          :aria-disabled="option.disabled || undefined"
          :class="getOptionClass(option, index)"
          tabindex="-1"
          @mousedown.prevent
          @click="!option.disabled && emit('select-option', option.key)">
          <slot
            name="option-content"
            :option="option"
            :is-selected="isSelected(option.key, modelValue)">
            <span class="truncate">{{ option.label }}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
