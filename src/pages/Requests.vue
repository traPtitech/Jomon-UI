<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import FilteringMenu from '../components/FilteringMenu.vue'
import NewRequestModal from '../components/NewRequestModal.vue'
import PaginationBar from '../components/PaginationBar.vue'
import Request from '../components/Request.vue'
import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'

const route = useRoute()
const pageIndex = Number(route.query.pageIndex)
const requestStore = useRequestStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { requestsLength, requestsFilter, isModalOpen } =
  storeToRefs(requestStore)

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
  <div class="flex justify-between h-[calc(100%-3rem)]">
    <div class="flex-grow relative">
      <div class="flex relative">
        <div class="text-3xl mt-2 text-center absolute right-1 left-1">
          申請一覧
        </div>
        <div class="ml-auto mr-12 mt-4 z-1">
          <button
            @click="changeIsModalOpen"
            class="text-xl border border-solid border-black"
          >
            申請の新規作成
          </button>
        </div>
      </div>
      <div>
        <div
          class="w-9/10 mt-4 mr-auto ml-auto border-solid border-black border-2"
        >
          <ul class="w-full mr-auto ml-auto">
            <li
              v-for="(request, index) in requestsFilter(pageIndex)"
              :key="request.id"
            >
              <Request :index="index" />
              <div
                class="w-29/30 bg-gray-400 border border-solid border-gray-400 mr-auto ml-auto"
                :class="
                  index === requestsFilter(pageIndex).length - 1
                    ? 'bg-white border-none'
                    : ''
                "
              />
            </li>
          </ul>
        </div>
      </div>
      <PaginationBar
        :pageIndex="pageIndex"
        :itemLength="requestsLength()"
        :unit="7"
        kind="requests"
      />
    </div>
    <div class="mt-20 mr-8">
      <FilteringMenu />
      {{ requestsLength() }}件取得しました
    </div>
  </div>
</template>
