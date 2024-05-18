<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useTagStore } from '/@/stores/tag'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import type { Tag } from '/@/features/tag/model'

interface Props {
  modelValue: Tag[]
  id?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:modelValue', value: Tag[]): void }>()

const tagStore = useTagStore()
const { tagOptions } = storeToRefs(tagStore)

const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<template>
  <InputSelectMultiple
    :id="props.id"
    v-model="value"
    :create-option="
      (tag: string) => ({ name: tag, id: '', created_at: '', updated_at: '' })
    "
    :options="tagOptions"
    placeholder="タグを選択"
    taggable
    :uniq-keys="['name', 'name']" />
</template>
