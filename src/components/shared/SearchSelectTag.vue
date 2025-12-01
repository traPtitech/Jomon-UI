<script lang="ts" setup>
import { computed } from 'vue'

import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'

import SearchMultiSelect from './SearchMultiSelect.vue'

const model = defineModel<Tag[]>({ required: true })

const { tagOptions } = useTagStore()

const searchOptions = computed(() =>
  tagOptions.value.map(tag => ({
    key: tag.key,
    value: tag.value.name,
  }))
)

const selectedValue = computed({
  get: () => model.value.map(tag => tag.name),
  set: (newNames: string[]) => {
    const currentTags = model.value
    model.value = newNames
      .map(name => {
        const optionTag = tagOptions.value.find(
          t => t.value.name === name
        )?.value
        if (optionTag) return optionTag
        return currentTags.find(t => t.name === name)
      })
      .filter(tag => tag !== undefined)
  },
})
</script>

<template>
  <SearchMultiSelect
    v-model="selectedValue"
    :options="searchOptions"
    label="タグ" />
</template>
