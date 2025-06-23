<script lang="ts" setup>
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  XCircleIcon
} from '@heroicons/vue/24/solid'
import { computed } from 'vue'

import type { ApplicationStatus } from '/@/features/applicationStatus/model'

interface Props {
  status: ApplicationStatus
  hasText?: boolean
  hasMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasText: false,
  hasMenu: false
})

const statusToJpn = computed(() => (status: ApplicationStatus) => {
  switch (status) {
    case 'submitted':
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
    case 'submitted':
      return 'bg-status-submitted'
    case 'change_requested':
      return 'bg-status-fix-required'
    case 'approved':
      return 'bg-status-accepted'
    case 'payment_finished':
      return 'bg-status-completed'
    case 'rejected':
      return 'bg-status-rejected'
    default:
      return 'bg-status-rejected'
  }
})
</script>

<template>
  <div
    :class="`flex items-center rounded-3xl px-2 py-2 gap-2 text-white ${backgroundColor(
      status
    )}${hasMenu ? ' cursor-pointer' : ''}`"
    :title="statusToJpn(status)">
    <CheckCircleIcon v-if="status === 'approved'" class="w-6" />
    <ExclamationTriangleIcon v-else-if="status === 'submitted'" class="w-6" />
    <XCircleIcon v-else-if="status === 'change_requested'" class="w-6" />
    <CloudArrowUpIcon v-else-if="status === 'rejected'" class="w-6" />
    <HandThumbUpIcon v-else-if="status === 'payment_finished'" class="w-6" />
    <!-- todo:アイコン考える。別のアイコンライブラリ使うのもありかも -->
    <span v-if="props.hasText">
      {{ statusToJpn(status) }}
    </span>
    <div v-if="hasMenu">
      <ChevronDownIcon class="w-4" />
    </div>
  </div>
</template>
