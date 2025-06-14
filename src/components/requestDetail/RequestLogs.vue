<script lang="ts" setup>
import { computed } from 'vue'

import type { ApplicationComment } from '/@/features/requestComment/model'
import type { ApplicationStatusDetail } from '/@/features/requestStatus/model'

import CommentLog from './CommentLog.vue'
import StatusChangeLog from './StatusChangeLog.vue'
import NewComment from './NewComment.vue'
import RequestContent from '/@/components/requestDetail/RequestContent.vue'
import type { ApplicationDetail } from '/@/features/request/model'

const props = defineProps<{
  request: ApplicationDetail
}>()

type CommentWithType = ApplicationComment & { type: 'comment' }
type StatusWithType = ApplicationStatusDetail & { type: 'statusChange' }

type Log = CommentWithType | StatusWithType

const logs = computed((): Log[] => {
  const comments: CommentWithType[] =
    props.request.comments.map(comment => ({
      ...comment,
      type: 'comment'
    })) ?? []
  const statuses: StatusWithType[] =
    props.request?.statuses.map(status => ({
      ...status,
      type: 'statusChange'
    })) ?? []

  const logs = [...comments, ...statuses]

  return logs.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
})
</script>

<template>
  <div v-if="request">
    <ul>
      <li class="vertical-bar">
        <RequestContent :request="request" />
      </li>
      <li
        v-for="(log, i) in logs.slice(1)"
        :key="log.createdAt.toISO() ?? i"
        class="vertical-bar">
        <CommentLog v-if="log.type === 'comment'" :comment="log" />
        <StatusChangeLog v-else-if="log.type === 'statusChange'" :log="log" />
      </li>
    </ul>
    <NewComment :request="request" />
  </div>
</template>

<style scoped>
.vertical-bar::after {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #d4d4d8;
  margin-left: 70px;
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
