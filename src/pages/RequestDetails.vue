<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import NewComment from '../components/NewComment.vue'
import NewTransactionModal from '../components/NewTransactionModal.vue'
import RequestDetail from '../components/RequestDetail.vue'
import RequestLogs from '../components/RequestLogs.vue'
import { useFileStore } from '../stores/file'
import { useGeneralStore } from '../stores/general'
import { useRequestDetailStore } from '../stores/requestDetail'

const generalStore = useGeneralStore()
const requestDetailStore = useRequestDetailStore()
const fileStore = useFileStore()
const { isModalOpen } = storeToRefs(generalStore)
const route = useRoute()
const id = route.params.request_id.toString()
onMounted(() => {
  requestDetailStore.getRequestDetail(id)
  fileStore.getFile(requestDetailStore.request.files)
})
function createTransaction() {
  isModalOpen.value = true
}
</script>

<template>
  <NewTransactionModal v-if="isModalOpen" :request_id="id" />
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
            class="w-2/3 border border-solid border-black mr-auto ml-auto"
          >
            <router-link :to="'/transactions?pageIndex=1&requestID=' + id">
              この申請の入出金記録へ移動
            </router-link>
          </button>
        </div>
        <NewComment />
      </div>
    </div>
  </div>
</template>
