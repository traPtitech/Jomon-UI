<script lang="ts" setup>
import {
  ThumbUpIcon,
  CloudUploadIcon,
  ExclamationIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/solid'
import { ref } from 'vue'

type Props = { status: string; text: boolean }
const props = withDefaults(defineProps<Props>(), {
  text: false
})
const flag = ref(false)
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
function statusColor(status: string) {
  switch (status) {
    case 'accepted':
      return 'bg-green-500 text-black'
    case 'submitted':
      return 'bg-yellow-500 text-black'
    case 'fix_required':
      return 'bg-red-500 text-white'
    case 'rejected':
      return 'bg-gray-500 text-black'
    case 'completed':
      return 'bg-gray-500 text-black'
    default:
      return 'ERROR'
  }
}
function handleMouseOver() {
  flag.value = true
}
function handleMouseLeave() {
  flag.value = false
}
</script>

<template>
  <div class="relative inline">
    <div
      v-if="flag && !text"
      class="absolute top-6 left-6 w-16 h-6 bg-zinc-300 rounded-md z-1 shadow-md text-center">
      {{ statusToJpn(status) }}
    </div>
    <div
      class="ml-4 mr-4"
      @mouseleave="handleMouseLeave"
      @mouseover="handleMouseOver">
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
      <span v-if="text === true" class="align-top">{{
        statusToJpn(status)
      }}</span>
    </div>
  </div>
</template>
