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
const pageIndex = ref(route.query.pageIndex ? Number(route.query.pageIndex) : 1)
const generalStore = useGeneralStore()
const requestStore = useRequestStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { isModalOpen } = storeToRefs(generalStore)
const { requests, isRequestFetched } = storeToRefs(requestStore)
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched } = storeToRefs(groupStore)
onMounted(() => {
  if (isRequestFetched) {
    requestStore.fetchRequests()
  }
  if (isTagFetched) {
    tagStore.fetchTags()
  }
  if (isGroupFetched) {
    groupStore.fetchGroups()
  }
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
  <div class="flex relative py-8 justify-center items-center">
    <h1 class="text-3xl text-center">申請一覧</h1>
    <div class="right-20 absolute">
      <Button font-size="lg" padding="md" @click="changeIsModalOpen">
        申請の新規作成
      </Button>
    </div>
  </div>
  <RequestFilteringMenu />
  <span v-if="requests.length !== 0" class="ml-50">
    {{ requests.length }}件取得しました
  </span>
  <span v-if="requests.length === 0" class="ml-50">
    条件に一致する申請は見つかりませんでした
  </span>
  <div class="h-120">
    <div v-if="requests.length !== 0" class="w-3/4 mt-4 mr-auto ml-auto shadow">
      <ul>
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
</template>
