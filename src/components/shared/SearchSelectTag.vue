<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'

import SearchSelect from './SearchSelect.vue'

const model = defineModel<Tag[]>({ required: true })

const { tagOptions } = useTagStore()

const selectedValue = ref(model.value.map(tag => tag.name))
const searchOptions = computed(() =>
  tagOptions.value.map(tag => ({
    key: tag.key,
    value: tag.value.name,
  }))
)

watch(selectedValue, () => {
  model.value = selectedValue.value.map(
    name =>
      tagOptions.value.find(tag => tag.value.name === name)?.value ?? {
        id: '',
        name,
      }
  )
})
</script>

<template>
  <SearchSelect
    v-model="selectedValue"
    :options="searchOptions"
    label="タグ"
    multiple />
</template>
