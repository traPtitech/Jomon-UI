<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import RequestTags from '../components/requestDetail/RequestTags.vue'
import SimpleButton from '../components/shared/SimpleButton.vue'
import NewComment from '/@/components/requestDetail/NewComment.vue'
import RequestAmount from '/@/components/requestDetail/RequestAmount.vue'
import RequestContent from '/@/components/requestDetail/RequestContent.vue'
import RequestGroup from '/@/components/requestDetail/RequestGroup.vue'
import RequestLogs from '/@/components/requestDetail/RequestLogs.vue'
import RequestTargets from '/@/components/requestDetail/RequestTargets.vue'
import RequestTitle from '/@/components/requestDetail/RequestTitle.vue'
import StatusChangeButtons from '/@/components/requestDetail/StatusChangeButtons.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import apis from '/@/lib/apis'
import { formatDate } from '/@/lib/date'
import { toId } from '/@/lib/parsePathParams'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import type { File } from '/@/stores/requestDetail'
import { useTransactionStore } from '/@/stores/transaction'

const requestDetailStore = useRequestDetailStore()
const transactionStore = useTransactionStore()
const route = useRoute()
const id = toId(route.params.id)
const files = ref<File[]>()
const formattedDate = formatDate(requestDetailStore.request?.created_at ?? '')
const { request } = storeToRefs(requestDetailStore)

const fetchFiles = async (ids: string[]) => {
  ids.forEach(async id => {
    const file = (await apis.getFile(id)).data
    const fileMeta = (await apis.getFileMeta(id)).data
    const fileValues = { file: file, name: fileMeta.name }
    if (files.value !== undefined) {
      files.value.push(fileValues)
    } else {
      files.value = [fileValues]
    }
  })
}

onMounted(async () => {
  await requestDetailStore.fetchRequestDetail(id)
  transactionStore.fetchTransactions('') //idをparamsに渡して取得
  await fetchFiles(request.value?.files ?? [])
})
</script>

<template>
  <div v-if="request === undefined">loading...</div>
  <div v-else class="min-w-160 mx-auto flex flex-col px-12 pt-4">
    <div class="bottom-bar">
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex flex-col md:flex-row">
          <request-title :request="request" />
          <status-chip has-text :status="request.status" />
          <status-change-buttons :request="request" />
        </div>
        <div class="flex flex-col-reverse md:flex-row md:items-center md:gap-4">
          <request-group :request="request" />
          <div>申請者：{{ request.created_by }}</div>
          <div>申請日：{{ formattedDate }}</div>
          <request-amount :request="request" />
        </div>
      </div>
      <request-tags class="mt-4" :request="request" />
      <div class="mt-4 flex flex-col gap-4 md:flex-row">
        <request-content class="w-3/5" :request="request" />
        <request-targets class="w-2/5" :request="request" />
      </div>
    </div>
    <div class="flex">
      <request-logs :files="files" :request="request" />
      <div class="w-1/3">
        <div class="flex flex-col items-center gap-4 py-8">
          <router-link class="w-2/3" :to="`/transactions/new?requestID=${id}`">
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
        <new-comment :request="request" />
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
