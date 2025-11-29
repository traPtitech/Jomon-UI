<script lang="ts" setup>
import StatusChip from '@/components/shared/StatusChip.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { ApplicationStatusDetail } from '@/features/applicationStatus/entities'
import { useUserStore } from '@/features/user/store'
import { formatDateAndTime } from '@/lib/date'

interface Props {
  log: ApplicationStatusDetail
}
const props = defineProps<Props>()

const { getUserName } = useUserStore()

const formattedDateAndTime = formatDateAndTime(props.log.createdAt)
</script>

<template>
  <div class="flex w-full items-center">
    <div class="flex flex-1 items-center gap-4">
      <UserIcon class="w-12" :name="getUserName(log.createdBy)" />
      <p class="flex flex-wrap items-center gap-2">
        <span class="font-bold">{{
          getUserName(log.createdBy) ?? '不明なユーザー'
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
