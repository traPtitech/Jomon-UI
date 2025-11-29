<script lang="ts" setup>
import type { EditMode } from '@/components/partitionDetail/composables/usePartitionInformation'
import EditButton from '@/components/shared/EditButton.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { usePartitionStore } from '@/features/partition/store'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
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
const { partitionGroupIdNameToMap, partitionGroupOptions } =
  usePartitionGroupStore()
</script>

<template>
  <div v-if="partition" class="flex items-center gap-3">
    <SearchSelect
      required
      v-if="props.isEditMode"
      v-model="editedValue.parentPartitionGroupId"
      class="grow"
      :options="partitionGroupOptions"
      label="パーティショングループ" />
    <h2 v-else class="grow text-xl">
      {{
        partitionGroupIdNameToMap.get(partition.parentPartitionGroupId) ??
        '不明なパーティショングループ'
      }}
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
          : emit('changeEditMode', 'partitionGroup')
      " />
  </div>
</template>
