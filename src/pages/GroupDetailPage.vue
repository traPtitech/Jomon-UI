<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

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

const { isSending, editMode, changeEditMode } = useGroupInformation()

const hasAuthority = groupDetailStore.canEditGroup(userStore.me)
const { isDeleting, deleteGroup } = useDeleteGroup()

await groupDetailStore.fetchGroup(id)
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
</script>

<template>
  <div
    v-if="groupDetailStore.group !== undefined"
    class="min-w-96 mx-auto h-full w-4/5 pt-4">
    <div class="flex justify-between">
      <GroupName
        class="flex-grow"
        :is-edit-mode="editMode === 'name'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)" />
      <SimpleButton
        v-if="hasAuthority"
        class="mx-2"
        font-size="sm"
        :is-disabled="isDeleting"
        kind="danger"
        padding="sm"
        @click.stop="deleteGroup(groupDetailStore.group?.id ?? '')">
        グループを削除
      </SimpleButton>
    </div>
    <div class="mt-4 flex h-full">
      <div class="flex-grow">
        <GroupDescription
          :is-edit-mode="editMode === 'description'"
          :is-sending="isSending"
          @change-edit-mode="changeEditMode($event)" />
        <GroupBudget
          class="mt-4"
          :is-edit-mode="editMode === 'budget'"
          :is-sending="isSending"
          @change-edit-mode="changeEditMode($event)" />
        <router-link
          class="mt-2 flex w-fit items-center"
          :to="`/transactions?group=${groupDetailStore.group.id}`">
          このグループの入出金記録へ
          <ArrowTopRightOnSquareIcon class="w-6" />
        </router-link>
      </div>
      <div class="flex w-1/4 flex-col gap-8">
        <GroupOwners />
        <GroupMembers />
      </div>
    </div>
  </div>
</template>
