<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parsePathParams'

import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import GroupBudget from '/@/components/groupDetail/GroupBudget.vue'
import GroupName from '/@/components/groupDetail/GroupName.vue'
import { useGroupInformation } from '/@/components/groupDetail/composables/useGroupInformation'
import { useFetchGroup } from '/@/features/group/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

const route = useRoute()
const id = toId(route.params.id)

const { isUserFetched } = useUserStore()
const { group } = useGroupDetailStore()

const { isSending, editMode, changeEditMode, finishEditing } =
  useGroupInformation()

await useFetchGroup(id)
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
</script>

<template>
  <div v-if="group !== undefined" class="flex flex-col gap-6">
    <div class="flex">
      <GroupName
        class="grow"
        :is-edit-mode="editMode === 'name'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
    <div class="grow flex flex-col gap-6">
      <GroupBudget
        :is-edit-mode="editMode === 'budget'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
      <RouterLink
        class="flex w-fit items-center"
        :to="`/transactions?group=${group.id}`">
        このグループの入出金記録へ
        <ArrowTopRightOnSquareIcon class="ml-1 w-6" />
      </RouterLink>
    </div>
  </div>
</template>
