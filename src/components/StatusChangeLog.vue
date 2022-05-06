<script lang="ts" setup>
import StatusChip from './shared/StatusChip.vue'
import UserIcon from './shared/UserIcon.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { formatDateAndTime } from '/@/utils/date'

const requestDetailStore = useRequestDetailStore()
type Props = { index: number }
const props = defineProps<Props>()
</script>

<template>
  <div class="m-2 w-4/7 ml-10 h-12 flex items-center">
    <UserIcon
      class="mr-2"
      :name="requestDetailStore.request.statuses[props.index].created_by" />
    <span>
      {{
        requestDetailStore.request.statuses[props.index].created_by
      }}が申請の状態を
    </span>
    <StatusChip
      has-text
      :status="requestDetailStore.request.statuses[props.index].status" />
    <span>にしました。</span>
    <div class="ml-auto text-zinc-400">
      {{
        formatDateAndTime(
          new Date(requestDetailStore.request.statuses[props.index].created_at)
        )
      }}
    </div>
  </div>
</template>
