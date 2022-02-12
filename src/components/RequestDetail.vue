<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRequestDetailStore } from '../stores/requestDetail'
import StatusChip from './StatusChip.vue'
const requestDetailStore = useRequestDetailStore()
const { request } = storeToRefs(requestDetailStore)
const status = 'submitted'
function handleFix() {
  alert('修正画面へ')
}
</script>

<template>
  <div class="w-3/5 h-160 border border-solid border-black">
    <div class="w-full mr-auto ml-auto text-center">
      <span class="text-3xl"
        >申請詳細<!--申請の種類を分けるかどうかが不明--></span
      >
      <StatusChip :status="status" />
      <button
        class="w-20 h-10 border border-solid border-black"
        @click="handleFix"
      >
        修正
      </button>
    </div>
    <div>
      <span>タイトル</span>
      <br />
      <span>{{ request.title }}</span>
    </div>
    <div>
      <span>申請日</span>
      <br />
      <span>{{ requestDetailStore.dateFormatter(request.created_at) }}</span>
    </div>
    <div>
      <span>申請者</span>
      <!--APIになかったので不明-->
    </div>
    <div>
      <span>支払金額</span>
      <br />
      <span>{{ request.amount }}</span>
    </div>
    <div>
      <span>タグ</span>
      <br />
      <span v-for="tag in request.tags" :key="tag.id">{{ tag.name }},</span>
    </div>
    <div>
      <span>グループ</span>
      <br />
      <span>{{ request.group.name }}</span>
    </div>
    <span>詳細</span>
    <br />
    <span>{{ request.content }}</span>
  </div>
</template>
