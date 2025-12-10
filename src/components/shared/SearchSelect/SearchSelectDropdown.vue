<script
  setup
  lang="ts"
  generic="T extends string | number, TModel extends T | T[] | null">
import { computed, nextTick, ref, watch } from 'vue'

import { autoUpdate, offset, size, useFloating } from '@floating-ui/vue'
import { useVirtualList } from '@vueuse/core'

import { toString } from '../utils'
import type { Option, SearchSelectTheme } from './types'

const props = withDefaults(
  defineProps<{
    filteredOptions: Option<T>[]
    searchTerm: string
    highlightedIndex: number
    modelValue: TModel
    listboxId: string
    referenceElement: HTMLElement | null
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

const emit = defineEmits<{
  (e: 'select-option', value: T): void
}>()

// Floating UI setup
const floating = ref<HTMLElement | null>(null)

// Use a fixed item height for the Virtual List.
const ITEM_HEIGHT = props.itemHeight ?? 36
const OVERSCAN = 10

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

// Floating UI Logic
const { floatingStyles } = useFloating(
  computed(() => props.referenceElement),
  floating,
  {
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${toString(rects.reference.width)}px`,
          })
        },
      }),
    ],
  }
)

// Expose the floating element so parent can ignore clicks on it
defineExpose({
  get el() {
    return floating.value
  },
})

const getOptionClass = (option: Option<T>, index: number) => {
  if (option.disabled) {
    return 'cursor-not-allowed text-gray-400 opacity-50'
  }
  const isHighlighted = props.highlightedIndex === index
  const selected = isSelected(option.key, props.modelValue)

  if (isHighlighted || selected) {
    return (
      props.theme.activeOptionClass ??
      (props.theme.themeColor === 'gray'
        ? 'bg-gray-100 text-gray-900'
        : 'bg-blue-100 text-blue-500')
    )
  }
  return (
    props.theme.hoverOptionClass ??
    (props.theme.themeColor === 'gray'
      ? 'hover:bg-gray-100 hover:text-gray-900'
      : 'hover:bg-blue-100 hover:text-blue-500')
  )
}
</script>

<script lang="ts">
// Separate script for props that need to be hoisted or complex types if needed
</script>

<template>
  <!-- Teleport the dropdown to body to avoid clipping -->
  <Teleport to="body">
    <div
      ref="floating"
      class="z-50 rounded-md border bg-white shadow-lg focus:outline-none"
      :style="floatingStyles">
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
      <!--
        This component implements the Combobox (Active Descendant) pattern.
        Focus remains on the input element, and key events are handled there.
        The 'div' elements (options) represent the options but are not focusable.
        WARNING: Since this uses a Virtual List, options outside the view port are NOT in the DOM.
        `aria-activedescendant` may point to a missing ID if not careful.
      -->
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
          <!-- Option Items -->
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
            :class="[
              'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-2 text-left text-sm outline-none select-none',
              getOptionClass(option, index),
            ]"
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
  </Teleport>
</template>
