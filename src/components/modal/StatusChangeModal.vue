<script lang="ts" setup>
import { closeModal } from 'jenesius-vue-modal'
import { ref } from 'vue'

import Button from '/@/components/shared/Button.vue'
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import type { RequestStatus } from '/@/components/shared/StatusChip.vue'
import apis from '/@/lib/apis'
import type { StatusEnum } from '/@/lib/apis'
import { useRequestDetailStore } from '/@/stores/requestDetail'

type Props = { nextStatus: RequestStatus }

defineProps<Props>()

const comment = ref('')
const requestDetailStore = useRequestDetailStore()

async function putStatus(nextStatus: StatusEnum | '', comment: string) {
  if (nextStatus === '') {
    alert('エラーが発生しました')
    return
  }
  const statusRequest = {
    status: nextStatus,
    comment: comment
  }
  try {
    const response = (
      await apis.putStatus(requestDetailStore.request.id, statusRequest)
    ).data
    requestDetailStore.request.status = nextStatus
    requestDetailStore.request.statuses.push(response)
    closeModal()
  } catch (err: any) {
    alert(err.message)
  }
}
</script>

<template>
  <div class="bg-white pt-8 w-2/5">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="flex flex-col h-4/5 mx-12 mt-8 gap-4 justify-around">
      <div class="flex items-center">
        申請の状態を
        <StatusChip has-text :status="requestDetailStore.request.status" />
        から
        <StatusChip has-text :status="nextStatus" />
        へ変更します
      </div>
      <div>
        <div class="flex flex-col">
          <label>コメント</label>
          <textarea
            v-model="comment"
            class="border rounded border-gray-300 h-20 p-1 resize-none" />
        </div>
        <details class="mb-2">
          <summary>MDプレビュー</summary>
          <div
            class="w-full px-2"
            :class="comment ? 'border border-gray-200' : ''">
            <MarkdownIt class="w-full" :text="comment" />
          </div>
        </details>
      </div>
      <div class="mt-8 text-center">
        <Button
          class="mb-4 w-60"
          font-size="xl"
          padding="sm"
          @click="putStatus(nextStatus, comment)">
          申請の状態を変更する
        </Button>
      </div>
    </div>
  </div>
</template>
