<script lang="ts" setup>
import { computed } from 'vue'

import { useTagStore } from '/@/stores/tag'

import VueSelect from '/@/components/shared/VueSelect.vue'

interface Props {
  modelValue: string[]
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string[]): void }>()

const tagStore = useTagStore()

const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <VueSelect
    v-model="value"
    :close-on-select="false"
    :create-option="(tag: any) => ({ name: tag, id: tag, created_at: '', updated_at: '' })"
    label="name"
    multiple
    :options="tagStore.tags"
    placeholder="タグを選択"
    push-tags
    :reduce="(tag:any) => tag.id"
    taggable />
</template>
