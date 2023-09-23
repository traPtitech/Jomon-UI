<script lang="ts" setup>
import type { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import CommentLog from './CommentLog.vue'
import RequestFiles from './RequestFiles.vue'
import StatusChangeLog from './StatusChangeLog.vue'

type LogType = 'comment' | 'statusChange'

interface Log {
  createdAt: DateTime
  type: LogType
  index: number
}

const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

const logs = computed(() => {
  //2つの配列(commentsとstatuses)の中身の型が違うので1つにまとめ、ソートして表示ができない
  let array = new Array<Log>()
  //2つの配列からcreated_at、種類、インデックスだけ取り出して1つの配列にまとめる
  array =
    request.value?.comments
      .map(
        (comment, i): Log => ({
          createdAt: comment.createdAt,
          type: 'comment',
          index: i
        })
      )
      .concat(
        request.value.statuses.map(
          (status, i): Log => ({
            createdAt: status.createdAt,
            type: 'statusChange',
            index: i
          })
        )
      ) ?? []
  //created_atでソート
  array = array.sort(function (a, b) {
    if (a.createdAt > b.createdAt) return 1
    if (b.createdAt > a.createdAt) return -1
    return 0
  })
  return array
  //その後この配列のtypeで配列を選び、indexでindexを選ぶことで2つの配列をいい感じに並べ替えられる
})
</script>

<template>
  <div v-if="request" class="h-120 overflow-y-scroll p-2">
    <RequestFiles />
    <ul>
      <li v-for="log in logs" :key="log.createdAt.toISO()" class="vertical-bar">
        <CommentLog
          v-if="log.type === 'comment'"
          :comment="request.comments[log.index]" />
        <StatusChangeLog
          v-if="log.type === 'statusChange'"
          :log="request.statuses[log.index]" />
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
