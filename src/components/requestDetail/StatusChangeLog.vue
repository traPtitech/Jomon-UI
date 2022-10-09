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
  <div class="min-w-90 w-5/7 flex items-center pl-4 md:pl-12">
    <user-icon class="mr-2 w-12" :name="log.created_by" />
    <p class="md:flex md:items-center">
      {{ log.created_by }}が申請の状態を
      <status-chip class="mx-2" has-text :status="log.status" />
      にしました。
    </p>
    <p class="ml-auto">
      {{ formattedDateAndTime }}
    </p>
  </div>
</template>
