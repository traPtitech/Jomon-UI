<script lang="ts" setup>
import { computed } from 'vue'

import { useTagStore } from '/@/stores/tag'

import type { Tag } from '/@/lib/apis'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'

interface Props {
  modelValue: Tag[]
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:modelValue', value: Tag[]): void }>()

const tagStore = useTagStore()
const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <InputSelectMultiple
    v-model="value"
    :create-option="(tag: string) => ({ name: tag, id: '', created_at: '', updated_at: '' })"
    :options="tagStore.tagOptions"
    placeholder="タグを選択"
    taggable />
</template>
