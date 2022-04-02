<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import Button from '../components/Button.vue'
import NewRequestModal from '../components/NewRequestModal.vue'
import PaginationBar from '../components/PaginationBar.vue'
import Request from '../components/Request.vue'
import RequestFilteringMenu from '../components/RequestFilteringMenu.vue'
import { useGeneralStore } from '../stores/general'
import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'

const route = useRoute()
const pageIndex = Number(route.query.pageIndex)
const generalStore = useGeneralStore()
const requestStore = useRequestStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { isModalOpen } = storeToRefs(generalStore)

onMounted(() => {
  requestStore.getRequests()
  tagStore.getTags()
  groupStore.getGroups()
  userStore.getUsers()
  userStore.getMe()
})
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
          <Button :onClick="changeIsModalOpen" text="text-lg" padding="md"
            >申請の新規作成</Button
          >
        </div>
      </div>
      <RequestFilteringMenu class="mt-4 mb-2" />
      <span v-if="requestStore.requestsLength() !== 0" class="ml-50">
        {{ requestStore.requestsLength() }}件取得しました</span
      >
      <span v-if="requestStore.requestsLength() === 0" class="ml-50">
        条件に一致する申請は見つかりませんでした</span
      >
      <div
        :class="
          pageIndex === Math.ceil(requestStore.requestsLength() / 7)
            ? 'h-123'
            : ''
        "
      >
        <div
          v-if="requestStore.requestsLength() !== 0"
          class="w-3/4 mt-4 mr-auto ml-auto shadow"
        >
          <ul class="w-full mr-auto ml-auto">
            <li
              v-for="(request, index) in requestStore.requestsFilter(pageIndex)"
              :key="request.id"
            >
              <Request :index="index" />
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-4">
        <PaginationBar
          :pageIndex="pageIndex"
          :itemLength="requestStore.requestsLength()"
          :unit="7"
          kind="requests"
        />
      </div>
    </div>
  </div>
</template>
