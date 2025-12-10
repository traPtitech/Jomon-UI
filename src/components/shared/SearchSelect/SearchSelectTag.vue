<script lang="ts" setup>
import { computed } from 'vue'

import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'

import SearchMultiSelect from './SearchMultiSelect.vue'

const model = defineModel<Tag[]>({ required: true })

const { tagOptions, tags } = useTagStore()

const resolveTags = (ids: string[]) => {
  return ids
    .map(
      id =>
        tags.value.find(t => t.id === id) ?? model.value.find(t => t.id === id)
    )
    .filter((tag): tag is Tag => tag !== undefined)
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
