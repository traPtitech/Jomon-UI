<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import FilteringMenu from '../components/FilteringMenu.vue'
import Request2 from '../components/Request2.vue'
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
const { requestsLength, requestsFilter } = storeToRefs(requestStore)

onMounted(() => {
  requestStore.getRequests()
  tagStore.getTags()
  groupStore.getGroups()
  userStore.getUsers()
  userStore.getMe()
})
</script>

<template>
  <div class="flex justify-between">
    <div class="flex-grow">
      <h1 class="text-3xl mt-2 text-center">申請一覧</h1>
      <div
        class="w-9/10 mt-4 mr-auto ml-auto border-solid border-black border-2"
      >
        <!-- <div class="flex justify-around">
      <div class="flex-1 text-center">状態</div>
      <div class="flex-1 text-center">タイトル</div>
      <div class="flex-1 text-center">申請者</div>
      <div class="flex-1 text-center">申請日</div>
      <div class="flex-1 text-center">金額</div>
      <div class="flex-1 text-center">タグ</div>
      <div class="flex-1 text-center">グループ</div>
    </div> -->
        <ul class="w-full mr-auto ml-auto">
          <li
            v-for="(request, index) in requestsFilter(pageIndex)"
            :key="request.id"
          >
            <Request2 :index="index" />
            <div
              class="w-29/30 bg-gray-400 border border-solid border-gray-400 mr-auto ml-auto mt-1"
              :class="
                index === requestsFilter(pageIndex).length - 1
                  ? 'bg-white border-none'
                  : ''
              "
            />
          </li>
        </ul>
      </div>
      <div class="text-center w-full mt-2">
        <!-- 絶対位置でページの下部に置きたい(フルで入っていないときに上の方に表示されてしまうため) -->
        <div class="flex justify-center">
          <router-link
            class="w-24 h-8 block border border-solid border-black"
            :class="pageIndex === 1 ? 'bg-gray-200' : ''"
            :to="
              pageIndex !== 1
                ? '/requests/?pageIndex=' + (pageIndex - 1).toString()
                : '/requests/?pageIndex=1'
            "
            ><span class=""> 前のページへ </span></router-link
          >
          <router-link
            v-for="index in [
              ...Array(Math.ceil(requestsLength() / 7) + 1).keys()
            ].slice(1)"
            :key="index"
            class="mr-2 ml-2 w-8 h-8 block border border-solid border-black"
            :class="index === pageIndex ? 'bg-blue-300' : ''"
            :to="'/requests/?pageIndex=' + index.toString()"
          >
            <span>{{ index }}</span></router-link
          >
          <router-link
            class="w-24 h-8 block border border-solid border-black"
            :class="
              pageIndex === Math.ceil(requestsLength() / 7) ? 'bg-gray-200' : ''
            "
            :to="
              pageIndex !== Math.ceil(requestsLength() / 7)
                ? '/requests/?pageIndex=' + (pageIndex + 1).toString()
                : '/requests/?pageIndex=' +
                  Math.ceil(requestsLength() / 7).toString()
            "
            ><span class=""> 次のページへ </span></router-link
          >
        </div>
      </div>
    </div>
    <div class="mt-20 mr-8">
      <FilteringMenu />
      {{ requestsLength() }}件取得しました
    </div>
  </div>
</template>
