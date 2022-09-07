<script lang="ts" setup>
import CommentLog from './CommentLog.vue'
import RequestImage from './RequestImage.vue'
import StatusChangeLog from './StatusChangeLog.vue'
import type { RequestDetail } from '/@/lib/apis'
import type { File } from '/@/pages/composables/requestDetail/useRequestFile'

type LogKind = 'comment' | 'statusChange'

interface Props {
  files: File[] | undefined
  request: RequestDetail
}

interface Log {
  created_at: Date
  kind: LogKind
  index: number
}

const props = defineProps<Props>()

const logs = () => {
  //2つの配列(commentsとstatuses)の中身の型が違うので1つにまとめ、ソートして表示ができない
  let array = new Array<Log>()
  //2つの配列からcreated_at、種類、インデックスだけ取り出して1つの配列にまとめる
  array = props.request.comments
    .map(
      (comment, i): Log => ({
        created_at: new Date(comment.created_at),
        kind: 'comment',
        index: i
      })
    )
    .concat(
      props.request.statuses.map(
        (status, i): Log => ({
          created_at: new Date(status.created_at),
          kind: 'statusChange',
          index: i
        })
      )
    )
  //created_atでソート
  array = array.sort(function (a, b) {
    if (a.created_at > b.created_at) return 1
    if (b.created_at > a.created_at) return -1
    return 0
  })
  return array
  //その後この配列のkindで配列を選び、indexでindexを選ぶことで2つの配列をいい感じに並べ替えられる
}
</script>

<template>
  <div class="h-120 h-full w-2/3 overflow-y-scroll p-2">
    <request-image :files="files" />
    <ul>
      <li
        v-for="log in logs()"
        :key="log.created_at.toDateString"
        class="vertical-bar">
        <comment-log
          v-if="log.kind === 'comment'"
          :log="props.request.comments[log.index]" />
        <status-change-log
          v-if="log.kind === 'statusChange'"
          :log="props.request.statuses[log.index]" />
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
