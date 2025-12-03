<script lang="ts" setup>
import { computed } from 'vue'

import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'

import SearchMultiSelect from './SearchMultiSelect.vue'

const model = defineModel<Tag[]>({ required: true })

const emit = defineEmits<{
  (e: 'close'): void
}>()

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
    model.value = newNames
      .map(
        name =>
          tagOptions.value.find(t => t.value.name === name)?.value ??
          model.value.find(t => t.name === name)
      )
      .filter(tag => tag !== undefined)
  },
})
</script>

<template>
  <SearchMultiSelect
    v-model="selectedValue"
    :options="searchOptions"
    label="タグ"
    @close="emit('close')" />
</template>
