<script lang="ts" setup>
import { formatDateAndTime } from '@/lib/date'

import StatusChip from '@/components/shared/StatusChip.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { ApplicationStatusDetail } from '@/features/applicationStatus/entities'
import { useUserStore } from '@/features/user/store'

interface Props {
  log: ApplicationStatusDetail
}
const props = defineProps<Props>()

const { getUserName, getUserNameWithFallback } = useUserStore()

const formattedDateAndTime = formatDateAndTime(props.log.createdAt)
</script>

<template>
  <div class="flex w-full items-center">
    <div class="flex flex-1 items-center gap-4">
      <UserIcon class="w-12" :name="getUserName(log.createdBy)" />
      <p class="flex flex-wrap items-center gap-2">
        <span class="font-bold">{{
          getUserNameWithFallback(log.createdBy)
        }}</span>
        が申請の状態を
        <StatusChip has-text :status="log.status" />
        にしました
      </p>
    </div>
    <div class="text-text-secondary">
      {{ formattedDateAndTime }}
    </div>
  </div>
</template>
