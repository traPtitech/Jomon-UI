<script lang="ts" setup>
import { computed } from 'vue'

import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'

import SearchMultiSelect from './SearchMultiSelect.vue'

const model = defineModel<Tag[]>({ required: true })

const { tagOptions, tags } = useTagStore()

const resolveTags = (ids: string[]) => {
  return ids
    .map(id => {
      const found =
        tags.value.find(t => t.id === id) ?? model.value.find(t => t.id === id)
      if (!found) {
        console.warn('[SearchSelectTag] Unknown tag ID encountered:', id)
      }
      return found
    })
    .filter((tag): tag is Tag => {
      // If tag is not found in store or current model, it is silently dropped.
      // This is expected behavior to clean up invalid IDs.
      return tag !== undefined
    })
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
    :options="tagOptions"
    label="タグ" />
</template>
