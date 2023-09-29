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
  <div class="w-5/7 flex items-center pl-12">
    <UserIcon class="mr-2 w-12" :name="userMap[log.createdBy]" />
    {{ userMap[log.createdBy] }}
    が申請の状態を
    <StatusChip class="mx-2" has-text :status="log.status" />
    にしました。
    <div class="ml-auto">
      {{ formattedDateAndTime }}
    </div>
  </div>
</template>
