<script lang="ts" setup>
import type { EditMode } from '@/components/partitionDetail/composables/usePartitionInformation'
import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'
import EditButton from '@/components/shared/EditButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { isBudgetSet } from '@/features/partition/lib/isBudgetSet'
import { usePartitionStore } from '@/features/partition/store'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
  (e: 'finishEditing'): void
}>()

const { currentPartition: partition, editedValue } = usePartitionStore()
</script>

<template>
  <div v-if="partition" class="flex items-center gap-3">
    <h2 v-if="!props.isEditMode" class="grow text-xl">
      <span v-if="isBudgetSet(partition.budget)">
        {{ partition.budget }} 円
      </span>
      <span v-else>指定なし</span>
    </h2>

    <BaseNumberInput
      v-else
      v-model="editedValue.budget"
      type="number"
      label="予算"
      class="grow" />

    <SimpleButton
      v-if="props.isEditMode"
      font-size="base"
      padding="sm"
      @click="emit('finishEditing')">
      完了
    </SimpleButton>

    <EditButton
      :is-edit-mode="props.isEditMode"
      @click="
        props.isEditMode
          ? emit('changeEditMode', '')
          : emit('changeEditMode', 'budget')
      " />
  </div>
</template>
