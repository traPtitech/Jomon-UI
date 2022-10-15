<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import apis from '/@/lib/apis'

import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import type { Status } from '/@/consts/consts'

interface Props {
  nextStatus: Status
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const toast = useToast()
const requestDetailStore = useRequestDetailStore()

const comment = ref('')

async function putStatus(nextStatus: Status | '', comment: string) {
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
      await apis.putStatus(requestDetailStore.request?.id ?? '', statusRequest)
    ).data
    //コメントをpushできない最上川
    if (requestDetailStore.request === undefined) {
      throw new Error('request is undefined')
    }
    requestDetailStore.request.statuses.push(response)
    requestDetailStore.request.status = response.status
    emit('closeModal')
  } catch {
    toast.error('状態の変更に失敗しました')
  }
}
</script>

<template>
  <div
    v-if="requestDetailStore.request"
    class="absolute inset-0 m-auto h-3/5 w-1/2 bg-white p-4 shadow-lg">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="mx-12 mt-8 flex flex-col justify-around gap-4">
      <div class="mb-4 flex items-center">
        申請の状態を
        <StatusChip
          class="mx-1"
          has-text
          :status="requestDetailStore.request.status" />
        から
        <StatusChip class="mx-1" has-text :status="props.nextStatus" />
        へ変更します
      </div>
      <MarkdownTextarea v-model="comment" placeholder="コメント" />
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
