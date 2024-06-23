<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import { formatDateAndTime } from '/@/lib/date'

import StatusChip from '/@/components/shared/StatusChip.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import type { RequestStatusDetail } from '/@/features/requestStatus/model'

interface Props {
  log: RequestStatusDetail
}
const props = defineProps<Props>()

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)

const formattedDateAndTime = formatDateAndTime(props.log.createdAt)
</script>

<template>
  <div class="w-full flex items-center">
    <div class="flex items-center gap-4 flex-1">
      <UserIcon class="w-12" :name="userMap[log.createdBy]" />
      <div class="flex items-center gap-2">
        <span>
          <span class="font-bold">{{ userMap[log.createdBy] }}</span>
          が申請の状態を
        </span>
        <StatusChip has-text :status="log.status" />
        <span>にしました</span>
      </div>
    </div>
    <div class="text-gray-400">
      {{ formattedDateAndTime }}
    </div>
  </div>
</template>
