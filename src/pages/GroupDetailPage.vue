<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parsePathParams'

import GroupBudget from '/@/components/groupDetail/GroupBudget.vue'
import GroupDescription from '/@/components/groupDetail/GroupDescription.vue'
import GroupMembers from '/@/components/groupDetail/GroupMembers.vue'
import GroupName from '/@/components/groupDetail/GroupName.vue'
import GroupOwners from '/@/components/groupDetail/GroupOwners.vue'
import { useDeleteGroup } from '/@/components/groupDetail/composables/useDeleteGroup'
import { useGroupInformation } from '/@/components/groupDetail/composables/useGroupInformation'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()

const { group } = storeToRefs(groupDetailStore)

const { isSending, editMode, changeEditMode } = useGroupInformation()

const hasAuthority = groupDetailStore.canEditGroup(userStore.me)
const { isDeleting, deleteGroup } = useDeleteGroup()

await groupDetailStore.fetchGroup(id)
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
</script>

<template>
  <div v-if="group !== undefined" class="min-w-96 mx-auto h-full w-4/5 pt-4">
    <div class="flex h-12 justify-between">
      <GroupName
        class="flex-grow"
        :is-edit-mode="editMode === 'name'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)" />
    </div>
    <div class="mt-4 flex h-full">
      <div class="flex-grow">
        <GroupDescription
          :is-edit-mode="editMode === 'description'"
          :is-sending="isSending"
          @change-edit-mode="changeEditMode($event)" />
        <GroupBudget
          class="mt-4 h-8"
          :is-edit-mode="editMode === 'budget'"
          :is-sending="isSending"
          @change-edit-mode="changeEditMode($event)" />
        <RouterLink
          class="mt-4 flex w-fit items-center"
          :to="`/transactions?group=${group.id}`">
          このグループの入出金記録へ
          <ArrowTopRightOnSquareIcon class="ml-1 w-6" />
        </RouterLink>
        <div class="text-right">
          <SimpleButton
            v-if="hasAuthority"
            class="mr-8"
            font-size="sm"
            :is-disabled="isDeleting"
            padding="sm"
            type="danger"
            @click.stop="deleteGroup(group?.id ?? '')">
            グループを削除
          </SimpleButton>
        </div>
      </div>
      <div class="flex w-1/4 flex-col gap-8">
        <GroupOwners />
        <GroupMembers />
      </div>
    </div>
  </div>
</template>
