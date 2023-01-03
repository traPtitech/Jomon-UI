<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import apis from '/@/lib/apis'
import { convertRequestComment, convertRequestStatus } from '/@/lib/date'

import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import type { RequestStatus } from '/@/consts/consts'

interface Props {
  nextStatus: RequestStatus
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const toast = useToast()
const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

const comment = ref('')

async function putStatus(nextStatus: RequestStatus, comment: string) {
  const statusRequest = {
    status: nextStatus,
    comment: comment
  }
  try {
    if (request.value === undefined) {
      throw new Error('request is undefined')
    }
    const response = (await apis.putStatus(request.value.id, statusRequest))
      .data
    request.value.statuses.push(convertRequestStatus(response))
    if (response.comment !== undefined) {
      request.value.comments.push(convertRequestComment(response.comment))
    }
    request.value.status = response.status
    emit('closeModal')
  } catch {
    toast.error('状態の変更に失敗しました')
  }
}
</script>

<template>
  <div
    v-if="request"
    class="absolute inset-0 m-auto h-3/5 w-1/2 bg-white p-4 shadow-lg">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="mx-12 mt-8 flex flex-col justify-around gap-4">
      <div class="mb-4 flex items-center">
        申請の状態を
        <StatusChip class="mx-1" has-text :status="request.status" />
        から
        <StatusChip class="mx-1" has-text :status="props.nextStatus" />
        へ変更します
      </div>
      <MarkdownTextarea v-model="comment" auto-focus placeholder="コメント" />
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
