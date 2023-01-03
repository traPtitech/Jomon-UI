<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import type { Status } from '/@/lib/apiTypes'
import { formatDateAndTime } from '/@/lib/date'

import StatusChip from '/@/components/shared/StatusChip.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

interface Props {
  log: Status
}
const props = defineProps<Props>()

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)

const formattedDateAndTime = formatDateAndTime(props.log.created_at)
</script>

<template>
  <div class="w-5/7 flex items-center pl-12">
    <UserIcon class="mr-2 w-12" :name="userMap[log.created_by]" />
    {{ userMap[log.created_by] }}
    が申請の状態を
    <StatusChip class="mx-2" has-text :status="log.status" />
    にしました。
    <div class="ml-auto">
      {{ formattedDateAndTime }}
    </div>
  </div>
</template>
