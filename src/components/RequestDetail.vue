<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useFileStore } from '../stores/file'
import { useRequestDetailStore } from '../stores/requestDetail'
import StatusChip from './StatusChip.vue'
const requestDetailStore = useRequestDetailStore()
const fileStore = useFileStore()
const { files } = storeToRefs(fileStore)
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
      <StatusChip
        :status="status"
      /><!--statusがdetailsに存在しないのでどうなるか不明-->
      <button
        class="w-20 h-10 border border-solid border-black"
        @click="handleFix"
      >
        修正
      </button>
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col">
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
        <div>
          <span>詳細</span>
          <br />
          <span>{{ request.content }}</span>
        </div>
      </div>
      <div class="w-3/7 mt-4 mr-12">
        <img
          v-for="file in files"
          :key="file.file"
          alt="example"
          :src="file.file"
        />
      </div>
    </div>
  </div>
</template>
