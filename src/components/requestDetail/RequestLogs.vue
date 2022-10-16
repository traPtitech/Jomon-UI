<script lang="ts" setup>
import { computed } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import CommentLog from './CommentLog.vue'
import RequestFiles from './RequestFiles.vue'
import StatusChangeLog from './StatusChangeLog.vue'

type LogKind = 'comment' | 'statusChange'

interface Log {
  created_at: Date
  kind: LogKind
  index: number
}

const requestDetailStore = useRequestDetailStore()

const logs = computed(() => {
  //2つの配列(commentsとstatuses)の中身の型が違うので1つにまとめ、ソートして表示ができない
  let array = new Array<Log>()
  //2つの配列からcreated_at、種類、インデックスだけ取り出して1つの配列にまとめる
  array =
    requestDetailStore.request?.comments
      .map(
        (comment, i): Log => ({
          created_at: new Date(comment.created_at),
          kind: 'comment',
          index: i
        })
      )
      .concat(
        requestDetailStore.request.statuses.map(
          (status, i): Log => ({
            created_at: new Date(status.created_at),
            kind: 'statusChange',
            index: i
          })
        )
      ) ?? []
  //created_atでソート
  array = array.sort(function (a, b) {
    if (a.created_at > b.created_at) return 1
    if (b.created_at > a.created_at) return -1
    return 0
  })
  return array
  //その後この配列のkindで配列を選び、indexでindexを選ぶことで2つの配列をいい感じに並べ替えられる
})
</script>

<template>
  <div v-if="requestDetailStore.request" class="h-120 overflow-y-scroll p-2">
    <RequestFiles />
    <ul>
      <li
        v-for="log in logs"
        :key="log.created_at.toDateString"
        class="vertical-bar">
        <CommentLog
          v-if="log.kind === 'comment'"
          :comment="requestDetailStore.request.comments[log.index]" />
        <StatusChangeLog
          v-if="log.kind === 'statusChange'"
          :log="requestDetailStore.request.statuses[log.index]" />
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
