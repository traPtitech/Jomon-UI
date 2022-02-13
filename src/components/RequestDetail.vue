<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useFileStore } from '../stores/file'
import { useRequestDetailStore } from '../stores/requestDetail'
import StatusChip from './StatusChip.vue'
const requestDetailStore = useRequestDetailStore()
const fileStore = useFileStore()
const { files } = storeToRefs(fileStore)
const { request } = storeToRefs(requestDetailStore)
function handleFix() {
  alert('修正画面へ')
}
</script>

<template>
  <div class="w-3/5 h-160 border border-solid border-black">
    <div class="flex text-center relative mt-2">
      <div class="absolute inset-x-1">
        <!--なぜindet-x-1で真ん中にできたのか不明 -->
        <span class="text-3xl"
          >申請詳細<!--申請の種類を分けるかどうかが不明--></span
        >
        <StatusChip :status="request.status" />
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
    <div class="flex justify-between h-4/5">
      <div class="w-3/7 flex flex-col justify-around ml-8">
        <div>
          <span>タイトル</span>
          <br />
          <span>{{ request.title }}</span>
        </div>
        <div>
          <span>申請日</span>
          <br />
          <span>{{
            requestDetailStore.dateFormatter(request.created_at)
          }}</span>
        </div>
        <div>
          <span>申請者</span>
          <br />
          <span>{{ request.created_by }}</span>
        </div>
        <div>
          <span>支払金額</span>
          <br />
          <span>{{ request.amount }}円</span>
        </div>
        <div>
          <span>タグ</span>
          <br />
          <span
            v-for="tag in request.tags"
            :key="tag.id"
            class="border border-solid border-black rounded mr-2"
            >{{ tag.name }}</span
          >
        </div>
        <div>
          <span>グループ</span>
          <br />
          <span>{{ request.group.name }}</span>
        </div>
        <div>
          <span>詳細</span>
          <br />
          <span>{{ request.content }}</span>
        </div>
      </div>
      <div
        v-if="files.length"
        class="w-4/7 mt-4 mr-12 overflow-x-scroll flex items-start"
      >
        <img
          v-for="file in files"
          :key="file.file"
          alt="file.name"
          class="h-full"
          :src="file.file"
        />
      </div>
      <div v-else class="w-4/7 text-center mr-auto ml-auto">
        画像はありません
      </div>
    </div>
  </div>
</template>
