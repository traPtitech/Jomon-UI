<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import type { StatusEnum } from '../lib/apis/generated'
import { useRequestDetailStore } from '../stores/requestDetail'
import Button from './shared/Button.vue'
import MarkdownIt from './shared/MarkdownIt.vue'
import Modal from './shared/Modal.vue'
import StatusChip from './shared/StatusChip.vue'
import apis from '/@/lib/apis'
import { useGeneralStore } from '/@/stores/general'

type Props = { nextStatus: StatusEnum | '' }

defineProps<Props>()

const comment = ref('')
const generalStore = useGeneralStore()
const requestDetailStore = useRequestDetailStore()
const { isModalOpen2 } = storeToRefs(generalStore)

async function putStatus(nextStatus: StatusEnum | '', comment: string) {
  if (nextStatus === '') return
  const statusRequest = {
    status: nextStatus,
    comment: comment
  }
  await apis.putStatus(requestDetailStore.request.id, statusRequest)
  requestDetailStore.fetchRequestDetail(requestDetailStore.request.id)
  isModalOpen2.value = false
}
</script>

<template>
  <Modal :layer="2" size="sm">
    <div class="pt-8">
      <h1 class="text-3xl text-center">申請の状態変更</h1>
      <div class="flex flex-col gap-4 justify-around mx-12 mt-8 h-4/5">
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
              class="h-20 border border-gray-300 resize-none p-1 rounded" />
          </div>
          <details class="mb-2">
            <summary>MDプレビュー</summary>
            <div
              class="px-2 w-full"
              :class="comment ? 'border border-gray-200' : ''">
              <MarkdownIt class="w-full" :text="comment" />
            </div>
          </details>
        </div>
        <div class="text-center mt-8">
          <Button
            class="w-60 mb-4"
            font-size="xl"
            padding="sm"
            @click="putStatus(nextStatus, comment)">
            申請の状態を変更する
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>
