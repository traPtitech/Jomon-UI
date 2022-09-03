<script lang="ts" setup>
import {
  HandThumbUpIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'

export type RequestStatus =
  | 'submitted'
  | 'fix_required'
  | 'accepted'
  | 'completed'
  | 'rejected'

interface Props {
  status: RequestStatus
  hasText?: boolean
}

withDefaults(defineProps<Props>(), {
  hasText: false
})

function statusToJpn(status: RequestStatus) {
  switch (status) {
    case 'submitted':
      return '承認待ち'
    case 'fix_required':
      return '要修正'
    case 'accepted':
      return '承認済み'
    case 'completed':
      return '返済完了'
    case 'rejected':
      return '却下'
    default:
      return 'ERROR'
  }
}
</script>

<template>
  <div class="inline flex items-center px-2" :title="statusToJpn(status)">
    <check-circle-icon
      v-if="status === 'accepted'"
      class="w-8 text-green-500" />
    <exclamation-triangle-icon
      v-else-if="status === 'submitted'"
      class="w-8 text-yellow-500" />
    <x-circle-icon
      v-else-if="status === 'fix_required'"
      class="w-8 text-red-500" />
    <cloud-arrow-up-icon
      v-else-if="status === 'rejected'"
      class="w-8 text-gray-500" />
    <hand-thumb-up-icon
      v-else-if="status === 'completed'"
      class="w-8 text-gray-500" />
    <span v-if="hasText === true">{{ statusToJpn(status) }}</span>
  </div>
</template>
