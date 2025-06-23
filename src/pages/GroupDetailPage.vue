<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'

import { usePartitionDetailStore } from '/@/stores/partitionDetail'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parsePathParams'

import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import PartitionBudget from '/@/components/partitionDetail/PartitionBudget.vue'
import PartitionName from '/@/components/partitionDetail/PartitionName.vue'
import { usePartitionInformation } from '/@/components/partitionDetail/composables/usePartitionInformation'
import { useFetchPartition } from '/@/features/partition/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

const route = useRoute()
const id = toId(route.params.id)

const { isUserFetched } = useUserStore()
const { partition } = usePartitionDetailStore()

const { isSending, editMode, changeEditMode, finishEditing } =
  usePartitionInformation()

await useFetchPartition(id)
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
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
      <RouterLink
        class="flex w-fit items-center"
        :to="`/transactions?partition=${partition.id}`">
        このパーティションの入出金記録へ
        <ArrowTopRightOnSquareIcon class="ml-1 w-6" />
      </RouterLink>
    </div>
  </div>
</template>
