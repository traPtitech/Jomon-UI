<script lang="ts" setup>
import { computed } from 'vue'

import ApplicationContent from '@/components/applicationDetail/ApplicationContent.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import type { ApplicationComment } from '@/features/applicationComment/entities'
import type { ApplicationStatusDetail } from '@/features/applicationStatus/entities'

import CommentLog from './CommentLog.vue'
import NewComment from './NewComment.vue'
import StatusChangeLog from './StatusChangeLog.vue'

const props = defineProps<{
  application: ApplicationDetail
}>()

type CommentWithType = ApplicationComment & { type: 'comment' }
type StatusWithType = ApplicationStatusDetail & { type: 'statusChange' }

type Log = CommentWithType | StatusWithType

const logs = computed((): Log[] => {
  const comments: CommentWithType[] = props.application.comments.map(
    comment => ({
      ...comment,
      type: 'comment',
    })
  )
  const statuses: StatusWithType[] = props.application.statuses.map(status => ({
    ...status,
    type: 'statusChange',
  }))

  const logs = [...comments, ...statuses]

  return logs.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
})
</script>

<template>
  <div v-if="application">
    <ul>
      <li class="vertical-bar">
        <ApplicationContent :application="application" />
      </li>
      <li
        v-for="(log, i) in logs"
        :key="log.createdAt.toISO() ?? i"
        class="vertical-bar">
        <CommentLog v-if="log.type === 'comment'" :comment="log" />
        <StatusChangeLog v-else-if="log.type === 'statusChange'" :log="log" />
      </li>
    </ul>
    <NewComment :application="application" />
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
