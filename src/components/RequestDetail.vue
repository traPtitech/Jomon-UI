<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '../stores/requestDetail'
import StatusChip from './StatusChip.vue'

const requestDetailStore = useRequestDetailStore()
const { request } = storeToRefs(requestDetailStore)
function handleFix() {
  alert('修正画面へ')
}
function handleAddTag() {
  alert('タグ追加ダイアログを出す')
}
</script>

<template>
  <div class="w-full">
    <div class="flex text-center mt-6 ml-12">
      <div class="">
        <span class="text-3xl">{{ request.title }}</span>
        <StatusChip :status="request.status" />
        <span class="mr-4">申請者：{{ request.created_by }}</span>
        <span class="mr-4"
          >申請日：{{ requestDetailStore.dateFormatter(request.created_at) }}
        </span>
        <span class="text-2xl">金額：{{ request.amount }}円</span>
      </div>
      <div class="w-20 mr-2 mt-2 ml-auto">
        <button
          class="w-20 h-10 border border-solid border-black"
          @click="handleFix"
        >
          修正
        </button>
      </div>
    </div>
    <div>
      <span class="ml-12">グループ：</span>
      <span>{{ request.group.name }}</span>
      <div class="ml-12">
        <span>タグ：</span>
        <span
          v-for="tag in request.tags"
          :key="tag.id"
          class="border border-solid border-black rounded mr-2"
          >{{ tag.name }}</span
        >
        <button class="border border-solid border-black" @click="handleAddTag">
          タグを追加
        </button>
      </div>
    </div>
  </div>
</template>
