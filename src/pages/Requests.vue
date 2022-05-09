<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { toPage } from '../lib/parseQueryParams'
import NewRequestModal from '/@/components/NewRequestModal.vue'
import RequestFilteringMenu from '/@/components/RequestFilteringMenu.vue'
import RequestItem from '/@/components/RequestItem.vue'
import Button from '/@/components/shared/Button.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import { useGeneralStore } from '/@/stores/general'
import { useGroupStore } from '/@/stores/group'
import { useRequestStore } from '/@/stores/request'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

const route = useRoute()
const page = ref(toPage(route.query.page))
const generalStore = useGeneralStore()
const requestStore = useRequestStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { isModalOpen } = storeToRefs(generalStore)
const { requests, isRequestFetched } = storeToRefs(requestStore)
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched } = storeToRefs(groupStore)
const { isUserFetched, isMeFetched } = storeToRefs(userStore)

const sliceRequestsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return requestStore.requests.slice(start, end)
}

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
  if (isUserFetched) {
    userStore.fetchUsers()
  }
  if (isMeFetched) {
    userStore.fetchMe()
  }
})
watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
function changeIsModalOpen() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <NewRequestModal v-if="isModalOpen" />
  <div class="flex flex-col mx-auto min-w-160 w-2/3">
    <div class="flex w-full py-8 justify-center items-center relative">
      <h1 class="text-3xl text-center">申請一覧</h1>
      <div class="right-0 absolute">
        <Button font-size="lg" padding="md" @click="changeIsModalOpen">
          申請の新規作成
        </Button>
      </div>
    </div>
  </div>
  <RequestFilteringMenu />
  <div class="min-h-120">
    <div v-if="requests.length !== 0" class="w-3/4 mt-4 mx-auto shadow">
      <ul>
        <li v-for="request in sliceRequestsAt(page, 7)" :key="request.id">
          <RequestItem :request="request" />
        </li>
      </ul>
    </div>
  </div>
  <PaginationBar
    class="mt-4"
    :current-page="page"
    path="/requests"
    :total-pages="Math.ceil(requestStore.requests.length / 7)" />
</template>
