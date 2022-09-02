<script lang="ts" setup>
import { closeModal } from 'jenesius-vue-modal'
import { ref } from 'vue'

import MarkdownTextarea from '../shared/MarkdownTextarea.vue'
import SimpleButton from '../shared/SimpleButton.vue'
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
  <div class="w-2/5 bg-white pt-8">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="mx-12 mt-8 flex h-4/5 flex-col justify-around gap-4">
      <div class="flex items-center">
        申請の状態を
        <status-chip has-text :status="requestDetailStore.request.status" />
        から
        <status-chip has-text :status="nextStatus" />
        へ変更します
      </div>
      <markdown-textarea
        placeholder="コメント"
        :value="comment"
        @input="comment = $event" />
      <div class="mt-8 text-center">
        <simple-button
          class="mb-4 w-60"
          font-size="xl"
          padding="sm"
          @click="putStatus(nextStatus, comment)">
          申請の状態を変更する
        </simple-button>
      </div>
    </div>
  </div>
</template>