<script lang="ts" setup>
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import type { RequestRequest } from '/@/pages/composables/useNewRequest'

interface Props {
  request: RequestRequest
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: string[]): void }>()
</script>

<template>
  <div class="flex flex-col">
    <label>タグ</label>
    <div class="flex">
      <InputSelectTagWithCreation
        class="w-2/3"
        :model-value="props.request.tags"
        @update:model-value="emit('input', $event)" />
    </div>
  </div>
</template>
