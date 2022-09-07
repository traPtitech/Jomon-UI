<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import NewComment from '/@/components/requestDetail/NewComment.vue'
import RequestAmount from '/@/components/requestDetail/RequestAmount.vue'
import RequestContent from '/@/components/requestDetail/RequestContent.vue'
import RequestGroup from '/@/components/requestDetail/RequestGroup.vue'
import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestTags from '/@/components/requestDetail/RequestTags.vue'
import RequestTargets from '/@/components/requestDetail/RequestTargets.vue'
import RequestTitle from '/@/components/requestDetail/RequestTitle.vue'
import StatusChangeButtons from '/@/components/requestDetail/StatusChangeButtons.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import type { Status, Comment } from '/@/lib/apis'
import { isAdmin } from '/@/lib/authorityCheck'
import { formatDate } from '/@/lib/date'
import { toId } from '/@/lib/parseQueryParams'
import { useRequestDetail } from '/@/pages/composables/requestDetail/useRequestDetail'
import { useRequestFile } from '/@/pages/composables/requestDetail/useRequestFile'
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

const route = useRoute()
const id = toId(route.params.id)

const transactionStore = useTransactionStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()

const hasAuthority = isAdmin(userStore.me)
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

onMounted(async () => {
  await fetchRequestDetail(id)
  transactionStore.fetchTransactions('') //idをparamsに渡して取得
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
  <div v-if="request === undefined">loading...</div>
  <div v-else class="min-w-160 mx-auto flex flex-col px-12 pt-4">
    <div class="bottom-bar">
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex flex-col md:flex-row">
          <request-title
            :is-edit-mode="editMode === 'title'"
            :request="request"
            :value="editedValue.title"
            @change-edit-mode="changeEditMode($event)"
            @input="editedValue.title = $event" />
          <status-chip has-text :status="request.status" />
          <status-change-buttons
            :request="request"
            @push-status="pushStatus($event)" />
        </div>
        <div class="flex flex-col-reverse md:flex-row md:items-center md:gap-4">
          <request-group
            :is-edit-mode="editMode === 'group'"
            :request="request"
            :value="editedValue.group"
            @change-edit-mode="changeEditMode($event)"
            @input="editedValue.group = $event" />
          <div>申請者：{{ request.created_by }}</div>
          <div>申請日：{{ formattedDate }}</div>
          <request-amount
            :is-edit-mode="editMode === 'amount'"
            :request="request"
            :value="editedValue.amount"
            @change-edit-mode="changeEditMode($event)"
            @input="editedValue.amount = $event" />
        </div>
      </div>
      <request-tags
        class="mt-4"
        :is-edit-mode="editMode === 'tags'"
        :request="request"
        :value="editedValue.tags"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.tags = $event" />
      <div class="mt-4 flex flex-col gap-4 md:flex-row">
        <request-content
          class="w-3/5"
          :is-edit-mode="editMode === 'content'"
          :request="request"
          :value="editedValue.content"
          @change-edit-mode="changeEditMode($event)"
          @input="editedValue.content = $event" />
        <request-targets
          class="w-2/5"
          :is-edit-mode="editMode === 'targets'"
          :request="request"
          :value="editedValue.targets"
          @change-edit-mode="changeEditMode($event)"
          @input="editedValue.targets = $event" />
      </div>
    </div>
    <div class="flex">
      <request-logs :files="files" :request="request" />
      <div class="w-1/3">
        <div class="flex flex-col items-center gap-4 py-8">
          <router-link
            v-if="hasAuthority"
            class="w-2/3"
            :to="`/transactions/new?requestID=${id}`">
            <simple-button class="w-full" font-size="md" padding="sm">
              この申請から入出金記録を作成する
            </simple-button>
          </router-link>
          <router-link class="w-2/3" :to="`/transactions?requestID=${id}`">
            <simple-button class="w-full" font-size="md" padding="sm">
              この申請の入出金記録へ移動
            </simple-button>
          </router-link>
        </div>
        <new-comment
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
