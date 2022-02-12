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
  <div class="border border-solid border-black">
    <div v-if="kind === 'comment'">
      <span>{{ request.comments[props.index].user }}がコメントしました。</span>
      <div>{{ request.comments[props.index].comment }}</div>
      <span>{{
        requestDetailStore.dateFormatter(
          request.comments[props.index].created_at
        )
      }}</span>
    </div>
    <div v-if="kind === 'statusChange'">
      <span>{{ request.statuses[props.index].created_by }}が申請の状態を</span>
      <StatusChip :status="request.statuses[props.index].status" />
      <span>にしました。</span>
      <div v-if="request.statuses[props.index].reason">
        理由：{{ request.statuses[props.index].reason }}
      </div>
      <span>{{
        requestDetailStore.dateFormatter(
          request.statuses[props.index].created_at
        )
      }}</span>
    </div>
  </div>
</template>
