<script setup lang="ts">
import type { EditMode } from '@/components/partitionDetail/composables/usePartitionInformation'
import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { usePartitionStore } from '@/features/partition/store'
import { useUserStore } from '@/features/user/store'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
  (e: 'finishEditing'): void
}>()

const { me } = useUserStore()
const {
  canEditPartition,
  currentPartition: partition,
  editedValue
} = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex items-center gap-3">
    <BaseTextInput
      v-if="props.isEditMode"
      v-model="editedValue.name"
      label="パーティション名"
      class="grow" />
    <h1 v-else class="grow text-2xl">
      {{ partition.name }}
    </h1>
    <SimpleButton
      v-if="isEditMode"
      font-size="base"
      padding="sm"
      @click="emit('finishEditing')">
      完了
    </SimpleButton>
    <EditButton
      v-if="canEditPartition(me)"
      :is-edit-mode="props.isEditMode"
      @click="
        props.isEditMode
          ? emit('changeEditMode', '')
          : emit('changeEditMode', 'name')
      " />
  </div>
</template>
