<script lang="ts" setup>
import {
  HandThumbUpIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import { computed } from 'vue'

export type RequestStatus =
  | 'submitted'
  | 'fix_required'
  | 'accepted'
  | 'completed'
  | 'rejected'
  | ''

interface Props {
  status: RequestStatus
  hasText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasText: false
})

const statusToJpn = computed(() => (status: RequestStatus) => {
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
})

const backgroundColor = computed(() => (status: RequestStatus) => {
  switch (status) {
    case 'submitted':
      return 'bg-yellow-400'
    case 'fix_required':
      return 'bg-red-400'
    case 'accepted':
      return 'bg-green-400'
    case 'completed':
      return 'bg-gray-400'
    case 'rejected':
      return 'bg-gray-400'
    default:
      return 'bg-gray-400'
  }
})
</script>

<template>
  <div
    :class="`inline flex items-center rounded-full p-2 text-white ${backgroundColor(
      status
    )}`"
    :title="statusToJpn(status)">
    <check-circle-icon v-if="status === 'accepted'" class="w-8" />
    <exclamation-triangle-icon v-else-if="status === 'submitted'" class="w-8" />
    <x-circle-icon v-else-if="status === 'fix_required'" class="w-8" />
    <cloud-arrow-up-icon v-else-if="status === 'rejected'" class="w-8" />
    <hand-thumb-up-icon v-else-if="status === 'completed'" class="w-8" />
    <span v-if="props.hasText === true">
      {{ statusToJpn(status) }}
    </span>
  </div>
</template>
