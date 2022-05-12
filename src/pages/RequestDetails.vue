<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import RequestDetailLower from '../components/RequestDetailLower.vue'
import { toId } from '../lib/parsePathParams'
import NewComment from '/@/components/NewComment.vue'
import RequestDetailUpper from '/@/components/RequestDetailUpper.vue'
import RequestLogs from '/@/components/RequestLogs.vue'
import Button from '/@/components/shared/Button.vue'
import apis from '/@/lib/apis'
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
  <div class="pt-4 px-12">
    <RequestDetailUpper />
    <RequestDetailLower />
    <div class="w-19/20 border border-gray-200 bg-gray-200 mx-auto my-4" />
    <div class="flex">
      <RequestLogs />
      <div class="w-1/3">
        <div class="flex flex-col mt-8 gap-4 items-center">
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
