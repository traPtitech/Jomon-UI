<script lang="ts" setup>
import {
  ThumbUpIcon,
  CloudUploadIcon,
  ExclamationIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/solid'

type Props = { status: string; hasText: boolean }
withDefaults(defineProps<Props>(), {
  hasText: false
})
function statusToJpn(status: string) {
  switch (status) {
    case 'submitted':
      return '承認待ち'
    case 'fix_required':
      return '要修正'
    case 'accepted':
      return '承認済み'
    case 'fully_repaid':
      return '返済完了'
    case 'rejected':
      return '却下'
    default:
      return 'ERROR'
  }
}
</script>

<template>
  <div class="relative inline">
    <div class="px-4 flex items-center" :title="statusToJpn(status)">
      <CheckCircleIcon
        v-if="status === 'accepted'"
        class="text-green-500 w-8 inline-block" />
      <ExclamationIcon
        v-else-if="status === 'submitted'"
        class="text-yellow-500 w-8 inline-block" />
      <XCircleIcon
        v-else-if="status === 'fix_required'"
        class="text-red-500 w-8 inline-block" />
      <CloudUploadIcon
        v-else-if="status === 'submitted'"
        class="text-gray-500 w-8 inline-block" />
      <ThumbUpIcon
        v-else-if="status === 'completed'"
        class="text-gray-500 w-8 inline-block" />
      <span v-if="hasText === true" class="align-top">{{
        statusToJpn(status)
      }}</span>
    </div>
  </div>
</template>
