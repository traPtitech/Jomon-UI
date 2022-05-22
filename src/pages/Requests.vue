<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { toPage } from '../lib/parseQueryParams'
import { useRequestStore } from '../stores/request'
import RequestFilteringMenu from '/@/components/RequestFilteringMenu.vue'
import RequestItem from '/@/components/RequestItem.vue'
import Button from '/@/components/shared/Button.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

const route = useRoute()
const page = ref(toPage(route.query.page))
const requestStore = useRequestStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()

const sliceRequestsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return requestStore.requests.slice(start, end)
}

onMounted(() => {
  if (!requestStore.isRequestFetched) {
    requestStore.fetchRequests()
  }
  if (!tagStore.isTagFetched) {
    tagStore.fetchTags()
  }
  if (!groupStore.isGroupFetched) {
    groupStore.fetchGroups()
  }
  if (!userStore.isUserFetched) {
    userStore.fetchUsers()
  }
  if (!userStore.isMeFetched) {
    userStore.fetchMe()
  }
})
watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div class="flex flex-col mx-auto min-w-160 w-2/3">
    <div class="flex w-full py-8 justify-center items-center relative">
      <h1 class="text-3xl text-center">申請一覧</h1>
      <div class="right-0 absolute">
        <router-link to="/requests/new">
          <Button font-size="lg" padding="md">申請の新規作成</Button>
        </router-link>
      </div>
    </div>
  </div>
  <RequestFilteringMenu />
  <div class="min-h-120">
    <div
      v-if="requestStore.requests.length !== 0"
      class="w-3/4 mt-4 mx-auto shadow">
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
