<script lang="ts" setup>
import { computed } from 'vue'

import { useTagStore } from '/@/stores/tag'

import type { Tag } from '/@/lib/apis'

import VueSelect from '/@/components/shared/VueSelect.vue'

interface Props {
  modelValue: Tag[]
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
const emit = defineEmits<{ (e: 'update:modelValue', value: Tag[]): void }>()

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
    :create-option="(tag: Tag) => ({ name: tag, id: '', created_at: '', updated_at: '' })"
    :disabled="disabled"
    label="name"
    multiple
    :options="tagStore.tags"
    placeholder="タグを選択"
    push-tags
    taggable />
</template>
