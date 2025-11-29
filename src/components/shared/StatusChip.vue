<script lang="ts" setup>
import { computed } from 'vue'

import {
  CheckCircleIcon,
  ChevronDownIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  XCircleIcon,
} from '@heroicons/vue/24/solid'

import type { ApplicationStatus } from '@/features/applicationStatus/entities'

interface Props {
  status: ApplicationStatus
  hasText?: boolean
  hasMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasText: false,
  hasMenu: false,
})

const statusToJpn = computed(() => (status: ApplicationStatus) => {
  switch (status) {
    case 'pending_review':
      return '承認待ち'
    case 'change_requested':
      return '要修正'
    case 'approved':
      return '承認済み'
    case 'payment_finished':
      return '返済完了'
    case 'rejected':
      return '却下'
    default:
      return 'ERROR'
  }
})

const backgroundColor = computed(() => (status: ApplicationStatus) => {
  switch (status) {
    case 'pending_review':
      return 'bg-status-pending-review'
    case 'change_requested':
      return 'bg-status-change-requested'
    case 'approved':
      return 'bg-status-approved'
    case 'payment_finished':
      return 'bg-status-payment-finished'
    case 'rejected':
      return 'bg-status-rejected'
    default:
      return 'bg-status-rejected'
  }
})
</script>

<template>
  <div
    :class="`flex items-center gap-2 rounded-3xl px-2 py-2 text-white ${backgroundColor(
      status
    )} ${hasMenu ? 'cursor-pointer' : ''}`"
    :title="statusToJpn(status)">
    <CheckCircleIcon v-if="status === 'approved'" class="w-6" />
    <ExclamationTriangleIcon
      v-else-if="status === 'pending_review'"
      class="w-6" />
    <XCircleIcon v-else-if="status === 'change_requested'" class="w-6" />
    <CloudArrowUpIcon v-else-if="status === 'rejected'" class="w-6" />
    <HandThumbUpIcon v-else-if="status === 'payment_finished'" class="w-6" />
    <span v-if="props.hasText">
      {{ statusToJpn(status) }}
    </span>
    <div v-if="hasMenu">
      <ChevronDownIcon class="w-4" />
    </div>
  </div>
</template>
