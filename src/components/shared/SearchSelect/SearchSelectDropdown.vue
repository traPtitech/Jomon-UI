<script setup lang="ts" generic="T extends string | number">
import { computed, ref, toRef } from 'vue'
// Reset scroll when options change (filtering)
import { watch } from 'vue'

import { autoUpdate, flip, offset, size, useFloating } from '@floating-ui/vue'
import { ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { useVirtualList } from '@vueuse/core'

import { toString } from '@/components/shared/utils'

import type { Option, SearchSelectTheme } from './types'

const baseOptionsClass = [
  'absolute z-50 w-full overflow-hidden rounded-md bg-white',
  'py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
].join(' ')

const themeConfig = {
  blue: {
    active: 'bg-blue-100 text-blue-500',
    selected: 'bg-blue-50 text-blue-500',
    hover: 'hover:bg-blue-100 hover:text-blue-500',
  },
  gray: {
    active: 'bg-gray-100 text-gray-900',
    selected: 'bg-gray-50 text-gray-900',
    hover: 'hover:bg-gray-100 hover:text-gray-900',
  },
} as const

const props = withDefaults(
  defineProps<{
    filteredOptions: Option<T>[]
    referenceElement: HTMLElement | null
    theme?: SearchSelectTheme | undefined
    /**
     * Current search term.
     * Used mainly to switch between `noResultsText` and `noItemsText`.
     */
    searchTerm?: string | undefined
    noResultsText?: string | undefined
    noItemsText?: string | undefined
    itemHeight?: number | undefined
  }>(),
  {
    theme: () => ({ themeColor: 'blue' }),
    noResultsText: '該当する項目がありません。',
    noItemsText: '項目がありません。',
    searchTerm: '',
    itemHeight: 36,
  }
)

const floating = ref<HTMLElement | null>(null)

const OVERSCAN = 10

const { list, containerProps, wrapperProps } = useVirtualList(
  computed(() => props.filteredOptions),
  {
    itemHeight: () => props.itemHeight,
    overscan: OVERSCAN,
  }
)

watch(
  () => props.filteredOptions,
  () => {
    containerProps.ref.value?.scrollTo(0, 0)
  }
)

// Floating UI Logic
const referenceElement = toRef(props, 'referenceElement')
const { floatingStyles } = useFloating(referenceElement, floating, {
  whileElementsMounted: autoUpdate,
  strategy: 'fixed',
  placement: 'bottom-start',
  middleware: [
    offset(4),
    flip(),
    size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          width: `${toString(rects.reference.width)}px`,
        })
      },
    }),
  ],
})

const getOptionClass = (
  active: boolean,
  selected: boolean,
  disabled: boolean
) => {
  if (disabled) return 'cursor-not-allowed text-gray-400 opacity-50'
  // theme is guaranteed to be present due to default prop value.
  const theme = props.theme

  if (active) {
    if (theme.activeOptionClass) return theme.activeOptionClass
    return theme.themeColor === 'gray'
      ? themeConfig.gray.active
      : themeConfig.blue.active
  }
  if (selected) {
    if (theme.selectedOptionClass) return theme.selectedOptionClass
    return theme.themeColor === 'gray'
      ? themeConfig.gray.selected
      : themeConfig.blue.selected
  }
  if (theme.hoverOptionClass) return theme.hoverOptionClass
  return theme.themeColor === 'gray'
    ? themeConfig.gray.hover
    : themeConfig.blue.hover
}
</script>

<template>
  <Teleport to="body">
    <ComboboxOptions
      ref="floating"
      :class="baseOptionsClass"
      :style="floatingStyles"
      static>
      <!-- Empty State -->
      <div
        v-if="filteredOptions.length === 0"
        class="relative cursor-default px-4 py-2 text-gray-700 select-none"
        role="status">
        {{ searchTerm ? noResultsText : noItemsText }}
      </div>

      <!-- Virtual List Container -->
      <div v-bind="containerProps" class="max-h-60 overflow-y-auto">
        <div v-bind="wrapperProps">
          <ComboboxOption
            v-for="{ data: option } in list"
            :key="option.key"
            :value="option.key"
            :disabled="!!option.disabled"
            as="template"
            v-slot="{ active, selected }">
            <li
              :class="[
                'relative flex cursor-default items-center py-2 pr-9 pl-3 select-none',
                getOptionClass(active, selected, !!option.disabled),
              ]">
              <slot name="option-content" :option="option" :selected="selected">
                <span
                  class="block truncate"
                  :class="{ 'font-semibold': selected }">
                  {{ option.label }}
                </span>
              </slot>
            </li>
          </ComboboxOption>
        </div>
      </div>
    </ComboboxOptions>
  </Teleport>
</template>
