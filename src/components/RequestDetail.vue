<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '../stores/requestDetail'
import { useUserStore } from '../stores/user'
import StatusChip from './StatusChip.vue'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { me } = storeToRefs(userStore)
const { request } = storeToRefs(requestDetailStore)
function handleFix() {
  alert('修正画面へ')
}
function handleAddTag() {
  alert('タグ追加ダイアログを出す')
}
function changeStatus(status: string) {
  const statusRequest = {
    status: status
  }
  requestDetailStore.putStatus(request.value.id, statusRequest)
  alert('ステータスを' + status + 'に変更しました')
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between text-center mt-6 ml-12">
      <div class="flex">
        <span class="text-3xl mr-2">{{ request.title }}</span>
        <StatusChip :status="request.status" />
        <div class="ml-2">
          <button
            v-if="
              request.status === 'fix_required' ||
              (me.admin && request.status === 'accepted')
            "
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            承認待ちにする
          </button>
          <button
            v-if="me.admin && request.status === 'submitted'"
            @click="changeStatus('fix_required')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            要修正にする
          </button>
          <button
            v-if="me.admin && request.status === 'submitted'"
            @click="changeStatus('accepted')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            承認済みにする
          </button>
          <button
            v-if="me.admin && request.status === 'submitted'"
            @click="changeStatus('rejected')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            却下する
          </button>
        </div>
      </div>
      <div class="">
        <span class="mr-4">申請者：{{ request.created_by }}</span>
        <span class="mr-4"
          >申請日：{{ requestDetailStore.dateFormatter(request.created_at) }}
        </span>
        <span class="text-2xl">金額：{{ request.amount }}円</span>
        <button
          class="w-20 h-10 ml-4 mr-4 border border-solid border-black"
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
