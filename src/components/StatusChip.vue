<script lang="ts" setup>
type Props = { status: string }
const props = defineProps<Props>()
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
    case 'submitted':
      return 'bg-yellow-500 text-white-500'
    case 'rejected':
      return 'bg-gray-500 text-black-500'
    case 'fix_required':
      return 'bg-red-500 text-white-500'
    case 'accepted':
      return 'bg-blue-500 text-white-500'
    case 'fully_repaid':
      return 'bg-green-500 text-black-500'
    default:
      return 'ERROR'
  }
}
</script>

<template>
  <div class="rounded-1/2 w-8 h-8" :class="statusColor(props.status)">
    <span class=""></span>
  </div>
</template>
