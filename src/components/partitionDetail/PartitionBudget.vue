<script lang="ts" setup>
import type { EditMode } from '@/components/partitionDetail/composables/usePartitionInformation'
import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { isBudgetSet } from '@/features/partition/lib/isBudgetSet'
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
    <BaseNumberInput
      v-if="props.isEditMode"
      v-model="editedValue.budget"
      label="予算"
      class="grow" />

    <h2 v-else class="grow text-xl">
      <span v-if="isBudgetSet(partition.budget)">
        {{ partition.budget }} 円
      </span>
      <span v-else>指定なし</span>
    </h2>

    <SimpleButton
      v-if="props.isEditMode"
      font-size="base"
      padding="sm"
      @click="emit('finishEditing')"
      :disabled="props.isSending">
      完了
    </SimpleButton>

    <EditButton
      v-if="canEditPartition(me)"
      :is-edit-mode="props.isEditMode"
      @click="
        props.isEditMode
          ? emit('changeEditMode', '')
          : emit('changeEditMode', 'budget')
      " />
  </div>
</template>
