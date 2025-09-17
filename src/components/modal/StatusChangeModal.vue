<script lang="ts" setup>
import MarkdownTextarea from '@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import StatusChip from '@/components/shared/StatusChip.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationStatus } from '@/features/applicationStatus/entities'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  application: ApplicationDetail
  nextStatus: ApplicationStatus
}>()
const emit = defineEmits<(e: 'closeModal') => void>()

const toast = useToast()
const { changeStatus } = useApplicationStore()

const comment = ref('')

const putStatus = async (
  nextStatus: ApplicationStatus,
  commentValue: string
) => {
  try {
    await changeStatus(props.application.id, nextStatus, commentValue)
    toast.success('申請の状態を変更しました')
    emit('closeModal')
  } catch (e) {
    if (e instanceof Error && e.message) {
      toast.error(e.message)
    } else {
      toast.error('変更に失敗しました')
    }
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    putStatus(props.nextStatus, comment.value)
  }
}
</script>

<template>
  <div
    class="absolute inset-0 m-auto flex h-3/5 min-h-100 w-19/20 max-w-200 flex-col gap-6 bg-white px-12 pt-4 shadow-lg lg:w-3/5">
    <h1 class="text-center text-3xl">申請の状態変更</h1>
    <div class="flex h-full min-h-60 flex-col gap-4">
      <div class="flex flex-wrap items-center gap-1">
        <span>申請の状態を</span>
        <StatusChip class="mx-1" has-text :status="application.status" />
        <span>から</span>
        <StatusChip class="mx-1" has-text :status="props.nextStatus" />
        <span>へ変更します</span>
      </div>
      <MarkdownTextarea
        v-model="comment"
        label="コメント"
        @keydown="handleKeydown" />
      <div class="flex justify-end">
        <SimpleButton
          class="mb-5"
          font-size="xl"
          padding="sm"
          type="success"
          @click="putStatus(nextStatus, comment)">
          申請の状態を変更する
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
