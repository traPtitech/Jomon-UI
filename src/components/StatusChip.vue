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
</script>

<template>
  <div
    class="
      w-24
      h-12
      rounded-md
      flex
      justify-center
      items-center
      mx-1
      bg-blue-500
    "
  >
    <span class="">{{ statusToJpn(props.status) }}</span>
  </div>
</template>
