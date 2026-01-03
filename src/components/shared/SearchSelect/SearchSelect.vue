<script setup lang="ts" generic="T extends string | number">
import SearchSelectBase from './SearchSelectBase.vue'
import type { SearchSelectCommonProps } from './types'

const props = defineProps<SearchSelectCommonProps<T>>()
const emit = defineEmits<{ (e: 'close'): void }>()
const model = defineModel<T>({ required: true })

defineOptions({ name: 'SearchSelect' })
</script>

<template>
  <SearchSelectBase
    v-model="model"
    v-bind="props"
    :nullable="false"
    @close="emit('close')" />
</template>
