<script lang="ts" setup>
import { ref } from 'vue'

import type { Status, RequestDetail } from '/@/lib/apis'
import apis from '/@/lib/apis'

import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import type { RequestStatus } from '/@/components/shared/StatusChip.vue'

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
  <div class="absolute inset-0 m-auto h-3/5 w-1/2 bg-white p-4 shadow-lg">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="mx-12 mt-8 flex flex-col justify-around gap-4">
      <div class="mb-4 flex items-center">
        申請の状態を
        <StatusChip class="mx-1" has-text :status="props.request.status" />
        から
        <StatusChip class="mx-1" has-text :status="nextStatus" />
        へ変更します
      </div>
      <MarkdownTextarea
        placeholder="コメント"
        :value="comment"
        @input="comment = $event" />
      <div class="mt-4 text-center">
        <SimpleButton
          class="mb-4 w-60"
          font-size="xl"
          padding="sm"
          @click="putStatus(nextStatus, comment)">
          申請の状態を変更する
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
