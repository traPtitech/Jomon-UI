<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parsePathParams'

import GroupBudget from '/@/components/groupDetail/GroupBudget.vue'
import GroupDescription from '/@/components/groupDetail/GroupDescription.vue'
import GroupMembers from '/@/components/groupDetail/GroupMembers.vue'
import GroupName from '/@/components/groupDetail/GroupName.vue'
import GroupOwners from '/@/components/groupDetail/GroupOwners.vue'
import { useGroupInformation } from '/@/components/groupDetail/composables/useGroupInformation'
import { useFetchGroup } from '/@/features/group/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()

const { group } = storeToRefs(groupDetailStore)
const { isUserFetched } = storeToRefs(userStore)

const { isSending, editMode, changeEditMode, finishEditing } =
  useGroupInformation()

await useFetchGroup(id)
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
</script>

<template>
  <div v-if="group !== undefined" class="mx-auto w-4/5 mt-5 mb-5">
    <div class="flex">
      <GroupName
        class="flex-grow"
        :is-edit-mode="editMode === 'name'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
    <div class="mt-6 flex h-full gap-10 flex-col md:flex-row">
      <div class="flex-grow">
        <GroupDescription
          :is-edit-mode="editMode === 'description'"
          :is-sending="isSending"
          @change-edit-mode="changeEditMode($event)"
          @finish-editing="finishEditing" />
        <GroupBudget
          class="mt-6"
          :is-edit-mode="editMode === 'budget'"
          :is-sending="isSending"
          @change-edit-mode="changeEditMode($event)"
          @finish-editing="finishEditing" />
      </div>
      <div class="flex w-full md:w-1/3 flex-col gap-10">
        <GroupOwners />
        <GroupMembers />
      </div>
    </div>
  </div>
</template>
