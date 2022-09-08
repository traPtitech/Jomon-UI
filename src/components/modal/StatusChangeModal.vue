<script lang="ts" setup>
import { ref } from 'vue'

import MarkdownTextarea from '../shared/MarkdownTextarea.vue'
import SimpleButton from '../shared/SimpleButton.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import type { RequestStatus } from '/@/components/shared/StatusChip.vue'
import type { Status, RequestDetail } from '/@/lib/apis'
import apis from '/@/lib/apis'

interface Props {
  request: RequestDetail
  nextStatus: RequestStatus
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'pushStatus', value: Status): void
  (e: 'closeModal'): void
}>()

const comment = ref('')

async function putStatus(nextStatus: RequestStatus | '', comment: string) {
  if (nextStatus === '') {
    alert('エラーが発生しました')
    return
  }
  const statusRequest = {
    status: nextStatus,
    comment: comment
  }
  try {
    const response = (await apis.putStatus(props.request.id, statusRequest))
      .data
    //コメントをpushできない最上川
    emit('pushStatus', response)
    emit('closeModal')
  } catch (err) {
    alert(err)
  }
}
</script>

<template>
  <div
    className="h-1/2 w-1/2 absolute inset-0 my-auto mx-auto bg-white p-4 overflow-y-scroll shadow-lg">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="mx-12 mt-8 flex h-4/5 flex-col justify-around gap-4">
      <div class="flex items-center">
        申請の状態を
        <status-chip has-text :status="props.request.status" />
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
