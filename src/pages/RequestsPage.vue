<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import RequestFilteringMenu from '/@/components/RequestFilteringMenu.vue'
import RequestItem from '/@/components/RequestItem.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { toPage } from '/@/lib/parseQueryParams'
import { useGroupStore } from '/@/stores/group'
import { useRequestStore } from '/@/stores/request'
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
  return requestStore.requests?.slice(start, end) ?? []
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
})

watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <div class="relative flex w-full items-center justify-center pb-8">
      <h1 class="text-center text-3xl">申請一覧</h1>
      <div class="absolute right-0">
        <router-link to="/requests/new">
          <simple-button font-size="lg" padding="md">
            申請の新規作成
          </simple-button>
        </router-link>
      </div>
    </div>
  </div>
  <request-filtering-menu />
  <div class="min-h-120">
    <div class="mx-auto mt-4 w-3/4 rounded-xl shadow">
      <ul>
        <li
          v-for="request in sliceRequestsAt(page, 7)"
          :key="request.id"
          class="hover:bg-zinc-100 first:hover:rounded-t-xl last:hover:rounded-b-xl">
          <request-item :request="request" />
        </li>
      </ul>
    </div>
  </div>
  <pagination-bar
    v-if="requestStore.requests"
    class="mt-4"
    :current-page="page"
    path="/requests"
    :total-pages="Math.ceil(requestStore.requests.length / 7)" />
</template>
