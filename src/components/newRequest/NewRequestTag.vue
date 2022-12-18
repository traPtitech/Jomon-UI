<script lang="ts" setup>
import type { RequestRequest } from '/@/stores/requestDetail'

import type { Tag } from '/@/lib/apis'

import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'

interface Props {
  request: RequestRequest
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: Tag[]): void }>()
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
