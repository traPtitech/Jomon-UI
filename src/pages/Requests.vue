<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FilteringMenu from '../components/FilteringMenu.vue'
import Request2 from '../components/Request2.vue'
import { useRequestStore } from '../stores/request'
const route = useRoute()
const pageIndex = Number(route.query.pageIndex)
const requestStore = useRequestStore()
const { requestsLength, requestsFilter } = storeToRefs(requestStore)
const isOpen = ref(false)
onMounted(() => {
  requestStore.getRequests()
})
function open() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <h1 class="text-xl text-center">申請一覧</h1>
  <div>
    <div class="text-right relative">
      <button @click="open">絞り込み</button>
      <FilteringMenu v-if="isOpen" class="absolute right-8 top-8" />
    </div>
  </div>
  <div class="w-6/10 mr-auto ml-auto border-solid border-black border-2">
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
          class="
            w-29/30
            bg-gray-400
            border border-solid border-gray-400
            mr-auto
            ml-auto
            mt-1
          "
          :class="index === 6 ? 'bg-white border-none' : ''"
        />
        <!-- todo:デザイン改善 -->
      </li>
    </ul>
  </div>
  <div class="text-center">
    <router-link
      v-show="pageIndex !== 1"
      :to="'/requests/?pageIndex=' + (pageIndex - 1).toString()"
      ><span class="border border-solid border-black">
        前のページへ
      </span></router-link
    >
    <router-link
      v-show="Math.ceil(requestsLength() / 7) !== pageIndex"
      :to="'/requests/?pageIndex=' + (pageIndex + 1).toString()"
      ><span class="border border-solid border-black">
        次のページへ
      </span></router-link
    >
  </div>
</template>
