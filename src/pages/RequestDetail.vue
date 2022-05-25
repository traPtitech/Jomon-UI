<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import NewComment from '/@/components/NewComment.vue'
import RequestDetailLower from '/@/components/RequestDetailLower.vue'
import RequestDetailUpper from '/@/components/RequestDetailUpper.vue'
import RequestLogs from '/@/components/RequestLogs.vue'
import Button from '/@/components/shared/Button.vue'
import apis from '/@/lib/apis'
import { toId } from '/@/lib/parsePathParams'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTransactionStore } from '/@/stores/transaction'

interface File {
  file: string
  name: string
}

const requestDetailStore = useRequestDetailStore()
const transactionStore = useTransactionStore()
const route = useRoute()
const id = toId(route.params.id)
const files = ref<File[]>([])

const fetchFiles = async (ids: string[]) => {
  ids.forEach(async id => {
    files.value.push((await apis.getFile(id)).data)
  })
}

onMounted(() => {
  requestDetailStore.fetchRequestDetail(id)
  transactionStore.fetchTransactions('') //idをparamsに渡して取得
  fetchFiles(requestDetailStore.request.files)
})
</script>

<template>
  <div class="flex flex-col mx-auto min-w-160 px-12 pt-4">
    <div class="bar">
      <RequestDetailUpper />
      <RequestDetailLower />
    </div>
    <div class="flex">
      <RequestLogs />
      <div class="w-1/3">
        <div class="flex flex-col py-8 gap-4 items-center">
          <router-link class="w-2/3" :to="'/transactions/new?requestID=' + id">
            <Button class="w-full" font-size="md" padding="sm">
              この申請から入出金記録を作成する
            </Button>
          </router-link>
          <router-link class="w-2/3" :to="'/transactions?requestID=' + id">
            <Button class="w-full" font-size="md" padding="sm">
              この申請の入出金記録へ移動
            </Button>
          </router-link>
        </div>
        <NewComment />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar::after {
  content: '';
  display: block;
  border: 1px solid #e5e7eb;
  margin: 12px auto;
  background-color: #e5e7eb;
}
</style>
