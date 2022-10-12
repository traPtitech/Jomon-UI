<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

import type { Status, Comment } from '/@/lib/apis'
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
import { useRequestDetail } from '/@/pages/composables/requestDetail/useRequestDetail'
import { useRequestFile } from '/@/pages/composables/requestDetail/useRequestFile'

const route = useRoute()
const id = toId(route.params.id)

const transactionStore = useTransactionStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()

const { editedValue, editMode, request, fetchRequestDetail, changeEditMode } =
  useRequestDetail()
const { files, fetchFiles } = useRequestFile()
const formattedDate = computed(() =>
  formatDate(request.value?.created_at ?? '')
)

function pushComment(comment: Comment) {
  if (request.value) {
    request.value.comments.push(comment)
  }
}
function pushStatus(status: Status) {
  if (request.value) {
    request.value.statuses.push(status)
    request.value.status = status.status
  }
}

function removeFile(fileId: string) {
  if (files.value) {
    files.value = files.value.filter(file => file.id !== fileId)
  }
}

onMounted(async () => {
  await fetchRequestDetail(id)
  transactionStore.fetchTransactions({
    sort: 'created_at',
    target: request.value?.id ?? '',
    tag: null,
    group: null
  }) //idをparamsに渡して取得
  await fetchFiles(request.value?.files ?? [])
  if (!groupStore.isGroupFetched) {
    await groupStore.fetchGroups()
  }
  if (!userStore.isUserFetched) {
    await userStore.fetchUsers()
  }
  if (!tagStore.isTagFetched) {
    await tagStore.fetchTags()
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
          :request="request"
          :value="editedValue.title"
          @change-edit-mode="changeEditMode($event)"
          @input="editedValue.title = $event" />
        <div class="ml-2">
          <StatusChangeButtons
            :request="request"
            @push-status="pushStatus($event)" />
        </div>
      </div>
      <div class="mt-4 flex justify-between">
        <RequestTags
          :is-edit-mode="editMode === 'tags'"
          :request="request"
          :value="editedValue.tags"
          @change-edit-mode="changeEditMode($event)"
          @input="editedValue.tags = $event" />
        <div class="flex items-center gap-4">
          <RequestGroup
            :is-edit-mode="editMode === 'group'"
            :request="request"
            :value="editedValue.group"
            @change-edit-mode="changeEditMode($event)"
            @input="editedValue.group = $event" />
          <p>申請者：{{ request.created_by }}</p>
          <p>申請日：{{ formattedDate }}</p>
          <RequestAmount
            :is-edit-mode="editMode === 'amount'"
            :request="request"
            :value="editedValue.amount"
            @change-edit-mode="changeEditMode($event)"
            @input="editedValue.amount = $event" />
        </div>
      </div>
      <div class="mt-4 flex">
        <RequestContent
          :is-edit-mode="editMode === 'content'"
          :request="request"
          :value="editedValue.content"
          @change-edit-mode="changeEditMode($event)"
          @input="editedValue.content = $event" />
        <RequestTargets
          :is-edit-mode="editMode === 'targets'"
          :request="request"
          :value="editedValue.targets"
          @change-edit-mode="changeEditMode($event)"
          @input="editedValue.targets = $event" />
      </div>
    </div>
    <div class="flex">
      <RequestLogs
        class="w-2/3"
        :files="files"
        :request="request"
        @remove-file="removeFile($event)" />
      <div class="w-1/3">
        <ToTransactionButtons :id="id" />
        <NewComment
          :request-id="request.id"
          @push-comment="pushComment($event)" />
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
