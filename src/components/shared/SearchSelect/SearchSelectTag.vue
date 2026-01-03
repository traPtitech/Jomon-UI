<script lang="ts" setup>
import { computed } from 'vue'

import type { SearchSelectOption } from '@/components/shared/SearchSelect/types'
import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'

import SearchMultiSelect from './SearchMultiSelect.vue'

const model = defineModel<Tag[]>({ required: true })

const { tagOptions } = useTagStore()

/**
 * Reactive map of all available options (from store + currently selected).
 * Ensures correct labels are displayed even if the store is not yet loaded.
 */
const optionsMap = computed(() => {
  const map = new Map<string, SearchSelectOption<string>>()

  // Add options from the store
  tagOptions.value.forEach(option => {
    map.set(option.key, option)
  })

  // Add options from the current model (preserving labels)
  model.value.forEach(tag => {
    if (!map.has(tag.id)) {
      map.set(tag.id, { key: tag.id, label: tag.name })
    }
  })

  return map
})

/**
 * Array version of the options map for SearchMultiSelect.
 */
const mergedOptions = computed(() => Array.from(optionsMap.value.values()))

/**
 * Resolve selected IDs back to Tag objects using the local options map.
 */
const resolveTags = (ids: string[]): Tag[] => {
  const resolved: Tag[] = []

  for (const id of ids) {
    const found = optionsMap.value.get(id)
    if (found) {
      resolved.push({ id: found.key, name: found.label })
    } else {
      console.warn('[SearchSelectTag] Unknown tag ID encountered:', id)
    }
  }

  return resolved
}

const selectedValue = computed({
  get: () => model.value.map(tag => tag.id),
  set: (newIds: string[]) => {
    model.value = resolveTags(newIds)
  },
})
</script>

<template>
  <SearchMultiSelect
    v-model="selectedValue"
    :options="mergedOptions"
    label="タグ" />
</template>
