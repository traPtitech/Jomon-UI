<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { toId } from '@/lib/parsePathParams'

import PartitionBudget from '@/components/partitionDetail/PartitionBudget.vue'
import PartitionGroup from '@/components/partitionDetail/PartitionGroup.vue'
import PartitionName from '@/components/partitionDetail/PartitionName.vue'
import { usePartitionInformation } from '@/components/partitionDetail/composables/usePartitionInformation'
import { usePartitionStore } from '@/features/partition/store'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import { useUserStore } from '@/features/user/store'

const route = useRoute()
const id = toId(route.params.id)

const { isUserFetched, fetchUsers } = useUserStore()
const { currentPartition: partition, fetchPartition } = usePartitionStore()

const { isSending, editMode, changeEditMode, finishEditing, editedValue } =
  usePartitionInformation()
const { isPartitionGroupFetched, fetchPartitionGroups } =
  usePartitionGroupStore()
await fetchPartition(id)
if (!isUserFetched.value) {
  await fetchUsers()
}
if (!isPartitionGroupFetched.value) {
  await fetchPartitionGroups()
}
</script>

<template>
  <div v-if="partition !== undefined" class="flex flex-col gap-6">
    <div class="flex grow flex-col">
      <p>パーティション名</p>
      <PartitionName
        v-model="editedValue.name"
        :is-edit-mode="editMode === 'name'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
    <div class="flex grow flex-col">
      <p>パーティショングループ</p>
      <PartitionGroup
        v-model="editedValue.parentPartitionGroupId"
        :is-edit-mode="editMode === 'partitionGroup'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
    <div class="flex grow flex-col">
      <p>予算</p>
      <PartitionBudget
        v-model="editedValue.budget"
        :is-edit-mode="editMode === 'budget'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
  </div>
</template>
