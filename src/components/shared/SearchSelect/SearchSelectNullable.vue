<script setup lang="ts" generic="T extends string | number">
import SearchSelectBase from './SearchSelectBase.vue'
import type { SearchSelectCommonProps } from './types'

const props = defineProps<SearchSelectCommonProps<T>>()
const emit = defineEmits<{ (e: 'close'): void }>()
const model = defineModel<T | null>({ required: true })

defineOptions({ name: 'SearchSelectNullable' })
</script>

<template>
  <SearchSelectBase
    v-model="model"
    v-bind="props"
    :nullable="true"
    @close="emit('close')" />
</template>
