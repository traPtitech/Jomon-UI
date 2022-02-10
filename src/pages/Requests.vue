<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import FilteringMenu from '../components/FilteringMenu.vue'
import Request from '../components/Request.vue'
import { useRequestStore } from '../stores/request'
const requestStore = useRequestStore()
const { requests } = storeToRefs(requestStore)
const isOpen = ref(false)
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
  <div class="w-9/10 mr-auto ml-auto">
    <div class="flex justify-around">
      <div class="flex-1 text-center">状態</div>
      <div class="flex-1 text-center">タイトル</div>
      <div class="flex-1 text-center">申請者</div>
      <div class="flex-1 text-center">申請日</div>
      <div class="flex-1 text-center">金額</div>
      <div class="flex-1 text-center">タグ</div>
      <div class="flex-1 text-center">グループ</div>
    </div>
    <ul class="w-full mr-auto ml-auto">
      <li v-for="(request, index) in requests" :key="request.id">
        <Request :index="index" />
      </li>
    </ul>
  </div>
</template>
