<script lang="ts" setup>
import { useUserStore } from '/@/features/user/store'

import { formatDateAndTime } from '/@/lib/date'

import StatusChip from '/@/components/shared/StatusChip.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import type { ApplicationStatusDetail } from '/@/features/applicationStatus/entities'

interface Props {
  log: ApplicationStatusDetail
}
const props = defineProps<Props>()

const { userMap } = useUserStore()

const formattedDateAndTime = formatDateAndTime(props.log.createdAt)
</script>

<template>
  <div class="w-full flex items-center">
    <div class="flex items-center gap-4 flex-1">
      <UserIcon class="w-12" :name="userMap[log.createdBy]" />
      <p class="flex flex-wrap items-center gap-2">
        <span class="font-bold">{{ userMap[log.createdBy] }}</span>
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
