<script lang="ts" setup>
import { DateTime } from 'luxon'

import StatusChip from './shared/StatusChip.vue'
import UserIcon from './shared/UserIcon.vue'
import { formatDateAndTime } from '/@/lib/date'
import { useRequestDetailStore } from '/@/stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
type Props = { index: number }
const props = defineProps<Props>()
</script>

<template>
  <div class="m-2 w-4/7 ml-10 h-12 flex items-center">
    <UserIcon
      class="mr-2 w-12"
      :name="requestDetailStore.request.statuses[props.index].created_by" />
    {{ requestDetailStore.request.statuses[props.index].created_by }}
    が申請の状態を
    <StatusChip
      has-text
      :status="requestDetailStore.request.statuses[props.index].status" />
    にしました。
    <div class="ml-auto text-zinc-400">
      {{
        formatDateAndTime(
          DateTime.fromISO(
            requestDetailStore.request.statuses[props.index].created_at
          )
        )
      }}
    </div>
  </div>
</template>
