<script lang="ts" setup>
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import type { Tag } from '/@/features/tag/model'

interface Props {
  tags: Tag[]
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: Tag[]): void }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <label>タグ</label>
    <InputSelectTagWithCreation
      class="w-full"
      :model-value="props.tags"
      @update:model-value="emit('input', $event)" />
  </div>
</template>
