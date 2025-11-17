<script lang="ts" setup>
import type { EditMode } from '@/components/partitionDetail/composables/usePartitionInformation'
import EditButton from '@/components/shared/EditButton.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { usePartitionStore } from '@/features/partition/store'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import { defineProps, defineEmits } from 'vue'

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
const { partitionGroupIdNameToMap, partitionGroupOptions } =
  usePartitionGroupStore()
</script>

<template>
  <div v-if="partition" class="flex items-center gap-3">
    <h2 v-if="!props.isEditMode" class="grow text-xl">
      {{
        partitionGroupIdNameToMap.get(partition.parentPartitionGroupId) ??
        '指定なし'
      }}
    </h2>

    <SearchSelect
      v-else
      v-model="editedValue.parentPartitionGroupId"
      class="grow"
      :options="partitionGroupOptions"
      label="パーティショングループ" />

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
          : emit('changeEditMode', 'partitionGroup')
      " />
  </div>
</template>
