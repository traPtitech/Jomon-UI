<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parseQueryParams'

import NewComment from '/@/components/requestDetail/NewComment.vue'
import RequestAmount from '/@/components/requestDetail/RequestAmount.vue'
import RequestGroup from '/@/components/requestDetail/RequestGroup.vue'
import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestTags from '/@/components/requestDetail/RequestTags.vue'
import RequestTargets from '/@/components/requestDetail/RequestTargets.vue'
import RequestTitle from '/@/components/requestDetail/RequestTitle.vue'
//import StatusChangeForm from '/@/components/requestDetail/StatusChangeForm.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'

import { useRequestDetail } from './composables/useRequestDetail'

const route = useRoute()
const id = toId(route.params.id)

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()

const { editMode, changeEditMode } = useRequestDetail()
const { request } = storeToRefs(requestDetailStore)

await requestDetailStore.fetchRequestDetail(id)
if (!groupStore.isGroupFetched) {
  await groupStore.fetchGroups()
}
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
if (!tagStore.isTagFetched) {
  await tagStore.fetchTags()
}
</script>

<template>
  <div v-if="request !== undefined" class="min-w-100 mx-auto w-4/5 px-12 pt-4">
    <div class="bottom-bar">
      <div class="flex items-center justify-between">
        <StatusChip has-text :status="request.status" />
        <!-- todo:StatusChangeFormを置く -->
        <RequestTitle
          class="ml-2"
          :is-edit-mode="editMode === 'title'"
          @change-edit-mode="changeEditMode($event)" />
      </div>
      <div class="mt-2 flex justify-between">
        <RequestGroup
          :is-edit-mode="editMode === 'group'"
          @change-edit-mode="changeEditMode($event)" />
        <RequestAmount
          :is-edit-mode="editMode === 'amount'"
          @change-edit-mode="changeEditMode($event)" />
      </div>
      <div class="mt-2 flex justify-between">
        <RequestTags
          class="mt-2"
          :is-edit-mode="editMode === 'tags'"
          @change-edit-mode="changeEditMode($event)" />
      </div>
      <div class="mt-2 flex justify-between">
        <RequestTargets
          :is-edit-mode="editMode === 'targets'"
          @change-edit-mode="changeEditMode($event)" />
      </div>
    </div>
    <div>
      <RequestLogs
        class="w-3/4"
        :edit-mode="editMode"
        @change-edit-mode="changeEditMode($event)" />
      <NewComment class="mb-12" />
    </div>
  </div>
</template>

<style scoped>
.bottom-bar::after {
  content: '';
  display: block;
  border: 1px solid #e5e7eb;
  margin: 12px auto;
  background-color: #e5e7eb;
}
</style>
