<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import { editMode } from './GroupDetail.vue'
import FixButton from '/@/components/shared/FixButton.vue'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'

interface Props {
  group: GroupDetailType
  editMode: editMode
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeEditMode', value: editMode): void
}>()
</script>

<template>
  <p>詳細</p>
  <div
    v-if="!(editMode === 'description')"
    class="flex w-full items-start md:w-2/3">
    <p class="h-32 w-full overflow-y-scroll border border-gray-300 pl-1">
      {{ props.group.description }}
    </p>
    <fix-button @click="emit('changeEditMode', 'description')" />
  </div>
  <div v-if="editMode === 'description'" class="w-full md:w-2/3">
    <textarea
      class="h-32 w-4/5 resize-none p-1"
      placeholder="詳細"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLTextAreaElement).value)" />
    <simple-button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </simple-button>
  </div>
</template>
