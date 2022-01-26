<script lang="ts" setup>
import { ref } from 'vue'
import FilteringMenu from '../components/FilteringMenu.vue'
import Request from '../components/Request.vue'
const requests = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'submitted',
    created_at: '2022-01-25T13:29:19.918Z',
    updated_at: '2022-01-25T13:29:19.918Z',
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    amount: 1200,
    title: 'SysAd講習会の開催費用',
    content: 'サーバー代 1200円',
    tags: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
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
  }
]
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
    </div>
    <ul class="w-full mr-auto ml-auto">
      <li v-for="request in requests" :key="request.id">
        <Request :request="request" />
      </li>
    </ul>
  </div>
</template>
