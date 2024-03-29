<script lang="ts" setup>
import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { formatDate } from '/@/lib/date'
import { toId } from '/@/lib/parseQueryParams'

import NewComment from '/@/components/requestDetail/NewComment.vue'
import RequestAmount from '/@/components/requestDetail/RequestAmount.vue'
import RequestContent from '/@/components/requestDetail/RequestContent.vue'
import RequestGroup from '/@/components/requestDetail/RequestGroup.vue'
import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestTags from '/@/components/requestDetail/RequestTags.vue'
import RequestTargets from '/@/components/requestDetail/RequestTargets.vue'
import RequestTitle from '/@/components/requestDetail/RequestTitle.vue'
import StatusChangeButtons from '/@/components/requestDetail/StatusChangeButtons.vue'
import ToTransactionButtons from '/@/components/requestDetail/ToTransactionButtons.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchRequestUsecase } from '/@/features/request/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

import { useRequestDetail } from './composables/useRequestDetail'

const route = useRoute()
const id = toId(route.params.id)

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()
const { isUserFetched, userMap } = storeToRefs(userStore)
const { isGroupFetched } = storeToRefs(groupStore)
const { isTagFetched } = storeToRefs(tagStore)

const { editMode, changeEditMode } = useRequestDetail()
const { request } = storeToRefs(requestDetailStore)

const formattedDate = computed(() =>
  formatDate(request.value?.createdAt ?? DateTime.fromISO(''))
)

await useFetchRequestUsecase(id)
if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}
onMounted(() => {
  if (route.hash !== '') {
    document.getElementById(route.hash.substring(1))?.scrollIntoView(true)
  }
})
</script>

<template>
  <div v-if="request !== undefined" class="min-w-160 mx-auto px-12 pt-4">
    <div class="bottom-bar">
      <div class="flex items-center justify-between">
        <StatusChip has-text :status="request.status" />
        <RequestTitle
          class="ml-2"
          :is-edit-mode="editMode === 'title'"
          @change-edit-mode="changeEditMode($event)" />
        <div class="ml-2">
          <StatusChangeButtons />
        </div>
      </div>
      <div class="mt-4 flex justify-between">
        <RequestTags
          :is-edit-mode="editMode === 'tags'"
          @change-edit-mode="changeEditMode($event)" />
        <div class="flex items-center gap-4">
          <RequestGroup
            :is-edit-mode="editMode === 'group'"
            @change-edit-mode="changeEditMode($event)" />
          <p>申請者：{{ userMap[request.created_by] }}</p>
          <p>申請日：{{ formattedDate }}</p>
          <RequestAmount />
        </div>
      </div>
      <div class="mt-4 flex">
        <RequestContent
          :is-edit-mode="editMode === 'content'"
          @change-edit-mode="changeEditMode($event)" />
        <RequestTargets
          :is-edit-mode="editMode === 'targets'"
          @change-edit-mode="changeEditMode($event)" />
      </div>
    </div>
    <div class="flex">
      <RequestLogs class="w-2/3" />
      <div class="w-1/3">
        <ToTransactionButtons />
        <NewComment />
      </div>
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
