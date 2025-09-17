<script lang="ts" setup>
import PartitionBudget from '@/components/partitionDetail/PartitionBudget.vue'
import PartitionName from '@/components/partitionDetail/PartitionName.vue'
import { usePartitionInformation } from '@/components/partitionDetail/composables/usePartitionInformation'
import { usePartitionStore } from '@/features/partition/store'
import { useUserStore } from '@/features/user/store'
import { toId } from '@/lib/parsePathParams'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = toId(route.params.id)

const { isUserFetched, fetchUsers } = useUserStore()
const { currentPartition: partition, fetchPartition } = usePartitionStore()

const { isSending, editMode, changeEditMode, finishEditing } =
  usePartitionInformation()

await fetchPartition(id)
if (!isUserFetched.value) {
  await fetchUsers()
}
</script>

<template>
  <div v-if="partition !== undefined" class="flex flex-col gap-6">
    <div class="flex">
      <PartitionName
        class="grow"
        :is-edit-mode="editMode === 'name'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
    <div class="grow flex flex-col gap-6">
      <PartitionBudget
        :is-edit-mode="editMode === 'budget'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
  </div>
</template>
