<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { toPage } from '../lib/parseQueryParams'
import RequestFilteringMenu from '/@/components/RequestFilteringMenu.vue'
import RequestItem from '/@/components/RequestItem.vue'
import Button from '/@/components/shared/Button.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import type { Request } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

export interface Params {
  sort: string
  currentStatus: string | null
  target: string | null
  since: string
  until: string
  tag:
    | {
        id: string
        name: string
        created_at: string
        updated_at: string
      }[]
    | null
  group: string | null
}

const route = useRoute()
const page = ref(toPage(route.query.page))
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched } = storeToRefs(groupStore)
const { isUserFetched, isMeFetched } = storeToRefs(userStore)
const requests = ref<Request[]>(
  Array(100).fill({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'submitted',
    created_at: '2022-01-25T13:29:19.918Z',
    updated_at: '2022-01-25T13:29:19.918Z',
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    amount: 1200,
    title: 'SysAd講習会の開催費用',
    tags: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2021講習会',
        created_at: '2022-01-25T13:29:19.918Z',
        updated_at: '2022-01-25T13:29:19.918Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2022講習会',
        created_at: '2022-01-25T13:29:19.918Z',
        updated_at: '2022-01-25T13:29:19.918Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        created_at: '2022-01-25T13:29:19.918Z',
        updated_at: '2022-01-25T13:29:19.918Z'
      }
    ],
    group: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'SysAd',
      description: 'SysAd班',
      budget: 250000,
      created_at: '2022-01-25T13:29:19.918Z',
      updated_at: '2022-01-25T13:29:19.918Z'
    }
  })
)

const sliceRequestsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return requests.value.slice(start, end)
}

const defaultParams: Params = {
  sort: 'created_at',
  currentStatus: null,
  target: null,
  since: '',
  until: '',
  tag: null,
  group: null
}
async function fetchRequests(tmpParams: Params = defaultParams) {
  const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
  const params = { ...tmpParams, tag: '' }
  if (
    (tmpParams.since && !rule.test(tmpParams.since)) ||
    (tmpParams.until && !rule.test(tmpParams.until))
  ) {
    alert('日付が不正です')
    return
  }
  const tmpTagList = tmpParams.tag?.slice() || []
  for (let i = 0; i < tmpTagList.length; i++) {
    if (i === 0) {
      params.tag = tmpTagList[i].id
    } else {
      params.tag += ',' + tmpTagList[i].id
    }
  }
  requests.value = (
    await apis.getRequests(
      params.sort,
      params.currentStatus || '',
      params.target || '',
      params.since,
      params.until,
      params.tag || '',
      params.group || ''
    )
  ).data
}

onMounted(() => {
  fetchRequests()
  if (!isTagFetched) {
    tagStore.fetchTags()
  }
  if (!isGroupFetched) {
    groupStore.fetchGroups()
  }
  if (!isUserFetched) {
    userStore.fetchUsers()
  }
  if (!isMeFetched) {
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
  <RequestFilteringMenu :fetch-requests="fetchRequests" :requests="requests" />
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
    :total-pages="Math.ceil(requests.length / 7)" />
</template>
