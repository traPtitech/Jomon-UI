<script lang="ts" setup>
import { useTagStore } from '/@/stores/tag'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import type { Tag } from '/@/features/tag/model'

const model = defineModel<Tag[]>({ required: true })

const { tagOptions } = useTagStore()
</script>

<template>
  <InputSelectMultiple
    v-model="model"
    :create-option="
      (tag: string) => ({ name: tag, id: '', created_at: '', updated_at: '' })
    "
    :options="tagOptions"
    placeholder="タグを選択"
    taggable
    :uniq-keys="['name', 'name']" />
</template>
