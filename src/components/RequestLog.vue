<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '../stores/requestDetail'
import StatusChip from './StatusChip.vue'

const requestDetailStore = useRequestDetailStore()
const { request } = storeToRefs(requestDetailStore)
type Props = { kind: string; index: number }
const props = defineProps<Props>()
</script>

<template>
  <div class="m-2">
    <div v-if="kind === 'comment'" class="border border-solid border-black">
      <div class="flex justify-between">
        <span
          >{{ request.comments[props.index].user }}がコメントしました。</span
        >
        <span>{{
          requestDetailStore.dateFormatter(
            request.comments[props.index].created_at
          )
        }}</span>
      </div>
      <div>{{ request.comments[props.index].comment }}</div>
    </div>
    <div
      v-if="kind === 'statusChange'"
      class="flex justify-between w-9/10 ml-8 border border-solid border-black"
    >
      <div>
        <span
          >{{ request.statuses[props.index].created_by }}が申請の状態を</span
        >
        <StatusChip :status="request.statuses[props.index].status" />
        <span>にしました。</span>
      </div>
      <span>{{
        requestDetailStore.dateFormatter(
          request.statuses[props.index].created_at
        )
      }}</span>
    </div>
  </div>
</template>
