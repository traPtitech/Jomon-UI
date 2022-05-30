<script lang="ts" setup>
import type { RequestStatus } from '/@/components/shared/StatusChip.vue'
import StatusChip from '/@/components/shared/StatusChip.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import { formatDateAndTime } from '/@/lib/date'

interface Props {
  log: {
    created_by: string
    status: RequestStatus
    created_at: string
  }
}
const props = defineProps<Props>()
const formattedDateAndTime = formatDateAndTime(props.log.created_at)
</script>

<template>
  <div class="w-5/7 pl-12 flex items-center">
    <UserIcon class="mr-2 w-12" :name="log.created_by" />
    {{ log.created_by }}
    が申請の状態を
    <StatusChip has-text :status="log.status" />
    にしました。
    <div class="ml-auto">
      {{ formattedDateAndTime }}
    </div>
  </div>
</template>
