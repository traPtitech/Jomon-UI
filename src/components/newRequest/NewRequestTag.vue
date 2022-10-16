<script lang="ts" setup>
import FormTagSelect from '/@/components/shared/FormTagSelect.vue'
import type { RequestRequest } from '/@/pages/NewRequestPage.vue'

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
      <FormTagSelect
        class="w-2/3"
        :model-value="props.request.tags"
        @update:model-value="emit('input', $event)" />
    </div>
  </div>
</template>
