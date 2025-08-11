<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import type { ApplicationDetail } from '/@/features/application/model'
import { changeStatusUsecase } from '/@/features/application/usecase'
import type { ApplicationStatus } from '/@/features/applicationStatus/model'

const props = defineProps<{
  application: ApplicationDetail
  nextStatus: ApplicationStatus
}>()
const emit = defineEmits<(e: 'closeModal') => void>()

const toast = useToast()

const comment = ref('')

const putStatus = async (nextStatus: ApplicationStatus, comment: string) => {
  try {
    await changeStatusUsecase(props.application.id, nextStatus, comment)
    toast.success('申請の状態を変更しました')
    emit('closeModal')
  } catch {
    toast.error('変更に失敗しました')
  }
}
</script>

<template>
  <div
    class="absolute inset-0 m-auto min-h-100 h-6/10 w-19/20 lg:w-3/5 max-w-200  bg-white shadow-lg flex flex-col gap-6 pt-4 px-12">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="flex flex-col gap-4 h-full min-h-60">
      <div class="flex flex-wrap items-center gap-1">
        <span>申請の状態を</span>
        <StatusChip class="mx-1" has-text :status="application.status" />
        <span>から</span>
        <StatusChip class="mx-1" has-text :status="props.nextStatus" />
        <span>へ変更します</span>
      </div>
      <MarkdownTextarea v-model="comment" label="コメント" />
      <div class="flex justify-end">
        <SimpleButton class="mb-5" font-size="xl" padding="sm" type="success" @click="putStatus(nextStatus, comment)">
          申請の状態を変更する
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
