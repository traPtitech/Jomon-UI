<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import Button from '../components/Button.vue'
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
    <div
      class="w-19/20 border border-gray-200 bg-gray-200 mr-auto ml-auto mt-4"
    ></div>
    <div class="flex">
      <RequestLogs />
      <div class="w-1/3">
        <div class="flex flex-col mt-8">
          <Button
            :onClick="createTransaction"
            class="w-2/3 mb-4 mr-auto ml-auto"
            text="text-md"
            padding="sm"
          >
            この申請から入出金記録を作成する
          </Button>
          <router-link
            :to="'/transactions?pageIndex=1&requestID=' + id"
            class="w-2/3 mr-auto ml-auto"
          >
            <Button class="w-full mb-4" text="text-md" padding="sm">
              この申請の入出金記録へ移動
            </Button>
          </router-link>
        </div>
        <NewComment />
      </div>
    </div>
  </div>
</template>
