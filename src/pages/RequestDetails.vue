<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import NewComment from '../components/NewComment.vue'
import RequestDetail from '../components/RequestDetail.vue'
import RequestLogs from '../components/RequestLogs.vue'
import { useFileStore } from '../stores/file'
import { useRequestDetailStore } from '../stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
const fileStore = useFileStore()
const route = useRoute()
const id = route.params.request_id.toString()
onMounted(() => {
  requestDetailStore.getRequestDetail(id)
  fileStore.getFile(requestDetailStore.request.files)
})
function createTransaction() {
  alert('モーダル表示時にrouteのパスからrequest idを取ってきて渡す')
}
function goToTransactions() {
  alert('/transaction?requestID=へ移動')
}
</script>

<template>
  <div class="mt-4">
    <RequestDetail />
    <div class="flex">
      <RequestLogs />
      <div class="w-1/3">
        <div class="flex flex-col mt-8">
          <button
            @click="createTransaction"
            class="w-2/3 border border-solid border-black mb-4 mr-auto ml-auto"
          >
            この申請から入出金記録を作成する
          </button>
          <button
            @click="goToTransactions"
            class="w-2/3 border border-solid border-black mr-auto ml-auto"
          >
            この申請の入出金記録へ移動
          </button>
        </div>
        <NewComment />
      </div>
    </div>
  </div>
</template>
