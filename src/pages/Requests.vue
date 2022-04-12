<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import NewRequestModal from '../components/NewRequestModal.vue'
import Request from '../components/Request.vue'
import RequestFilteringMenu from '../components/RequestFilteringMenu.vue'
import Button from '../components/shared/Button.vue'
import PaginationBar from '../components/shared/PaginationBar.vue'
import { useGeneralStore } from '../stores/general'
import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'

const route = useRoute()
const pageIndex = ref<number>(
  route.query.pageIndex ? Number(route.query.pageIndex) : 1
)
const generalStore = useGeneralStore()
const requestStore = useRequestStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { isModalOpen } = storeToRefs(generalStore)
const { requests } = storeToRefs(requestStore)
onMounted(() => {
  requestStore.fetchRequests()
  tagStore.fetchTags()
  groupStore.fetchGroups()
  userStore.getUsers()
  userStore.getMe()
})
watch(
  () => route.query.pageIndex,
  newId => {
    if (typeof newId === 'string') {
      pageIndex.value = Number(newId)
    }
  }
)
function changeIsModalOpen() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <NewRequestModal v-if="isModalOpen" />
  <div class="flex justify-between">
    <div class="flex-grow">
      <div class="flex relative">
        <div class="text-3xl mt-2 text-center absolute right-1 left-1">
          申請一覧
        </div>
        <div class="ml-auto mr-40 mt-4 z-1">
          <Button font-size="lg" padding="md" @click="changeIsModalOpen">
            申請の新規作成
          </Button>
        </div>
      </div>
      <RequestFilteringMenu class="mt-4 mb-2" />
      <span v-if="requests.length !== 0" class="ml-50">
        {{ requests.length }}件取得しました
      </span>
      <span v-if="requests.length === 0" class="ml-50">
        条件に一致する申請は見つかりませんでした
      </span>
      <div :class="pageIndex === Math.ceil(requests.length / 7) ? 'h-123' : ''">
        <div
          v-if="requests.length !== 0"
          class="w-3/4 mt-4 mr-auto ml-auto shadow">
          <ul class="w-full mr-auto ml-auto">
            <li
              v-for="request in requestStore.requestsFilter(pageIndex)"
              :key="request.id">
              <Request :request="request" />
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-4">
        <PaginationBar
          :item-length="requests.length"
          kind="requests"
          :page-index="pageIndex"
          :unit="7" />
      </div>
    </div>
  </div>
</template>
