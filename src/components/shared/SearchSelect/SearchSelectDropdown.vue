<script setup lang="ts" generic="T extends string | number">
import { computed, ref, toRef } from 'vue'
// Reset scroll when options change (filtering)
import { watch } from 'vue'

import { autoUpdate, flip, offset, size, useFloating } from '@floating-ui/vue'
import { ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { useVirtualList } from '@vueuse/core'

import { toString } from '@/components/shared/utils'

import type { Option, SearchSelectTheme } from './types'

const props = withDefaults(
  defineProps<{
    filteredOptions: Option<T>[]
    referenceElement: HTMLElement | null
    theme?: SearchSelectTheme | undefined
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

// Use a fixed item height for the Virtual List.
const ITEM_HEIGHT = props.itemHeight
const OVERSCAN = 10

const { list, containerProps, wrapperProps } = useVirtualList(
  computed(() => props.filteredOptions),
  {
    itemHeight: ITEM_HEIGHT,
    overscan: OVERSCAN,
  }
)

watch(
  () => props.filteredOptions,
  () => {
    if (containerProps.ref.value) {
      containerProps.ref.value.scrollTop = 0
    }
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
  const theme = props.theme

  if (active) {
    return (
      theme.activeOptionClass ??
      (theme.themeColor === 'gray'
        ? 'bg-gray-100 text-gray-900'
        : 'bg-blue-100 text-blue-500')
    )
  }
  if (selected) {
    return theme.themeColor === 'gray'
      ? 'bg-gray-50 text-gray-900'
      : 'bg-blue-50 text-blue-500'
  }
  return (
    theme.hoverOptionClass ??
    (theme.themeColor === 'gray'
      ? 'hover:bg-gray-100 hover:text-gray-900'
      : 'hover:bg-blue-100 hover:text-blue-500')
  )
}
</script>

<template>
  <Teleport to="body">
    <ComboboxOptions
      ref="floating"
      class="ring-opacity-5 absolute z-50 max-h-60 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm"
      :style="floatingStyles"
      static>
      <!-- Empty State -->
      <div
        v-if="filteredOptions.length === 0"
        class="relative cursor-default px-4 py-2 text-gray-700 select-none">
        {{ searchTerm ? noResultsText : noItemsText }}
      </div>

      <!-- Virtual List Container -->
      <div v-bind="containerProps" style="max-height: 200px; overflow-y: auto">
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
