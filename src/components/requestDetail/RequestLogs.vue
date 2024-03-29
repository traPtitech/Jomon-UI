<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import type { RequestComment } from '/@/features/requestComment/model'
import type { RequestStatusDetail } from '/@/features/requestStatus/model'

import CommentLog from './CommentLog.vue'
import RequestFiles from './RequestFiles.vue'
import StatusChangeLog from './StatusChangeLog.vue'

type CommentWithType = RequestComment & { type: 'comment' }
type StatusWithType = RequestStatusDetail & { type: 'statusChange' }

type Log = CommentWithType | StatusWithType

const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

const logs = computed((): Log[] => {
  const comments: CommentWithType[] =
    request.value?.comments.map(comment => ({
      ...comment,
      type: 'comment'
    })) ?? []
  const statuses: StatusWithType[] =
    request.value?.statuses.map(status => ({
      ...status,
      type: 'statusChange'
    })) ?? []

  const logs = [...comments, ...statuses]

  return logs.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
})
</script>

<template>
  <div v-if="request" class="h-120 overflow-y-scroll p-2">
    <RequestFiles />
    <ul>
      <li
        v-for="(log, i) in logs"
        :key="log.createdAt.toISO() ?? i"
        class="vertical-bar">
        <CommentLog v-if="log.type === 'comment'" :comment="log" />
        <StatusChangeLog v-if="log.type === 'statusChange'" :log="log" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.vertical-bar::after {
  content: '';
  display: inline-block;
  width: 4px;
  height: 36px;
  background-color: #d4d4d8;
  margin-left: 70px;
}
</style>
