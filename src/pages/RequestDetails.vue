<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import NewComment from '/@/components/NewComment.vue'
import NewTransactionModal from '/@/components/NewTransactionModal.vue'
import RequestDetail from '/@/components/RequestDetail.vue'
import RequestLogs from '/@/components/RequestLogs.vue'
import Button from '/@/components/shared/Button.vue'
import { useFileStore } from '/@/stores/file'
import { useGeneralStore } from '/@/stores/general'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTransactionStore } from '/@/stores/transaction'

const generalStore = useGeneralStore()
const requestDetailStore = useRequestDetailStore()
const transactionStore = useTransactionStore()
const fileStore = useFileStore()
const { isModalOpen } = storeToRefs(generalStore)
const route = useRoute()
const id = String(route.params.id)

onMounted(() => {
  requestDetailStore.fetchRequestDetail(id)
  transactionStore.fetchTransactions('') //idをparamsに渡して取得
  fileStore.fetchFiles(requestDetailStore.request.files)
})
function createTransaction() {
  isModalOpen.value = true
}
</script>

<template>
  <NewTransactionModal v-if="isModalOpen" :request-id="id" />
  <div class="pt-4 px-12">
    <RequestDetail />
    <div class="w-19/20 border border-gray-200 bg-gray-200 mx-auto my-4" />
    <div class="flex">
      <RequestLogs />
      <div class="w-1/3">
        <div class="flex flex-col mt-8 gap-4 items-center">
          <Button
            class="w-2/3"
            font-size="md"
            padding="sm"
            @click="createTransaction">
            この申請から入出金記録を作成する
          </Button>
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
