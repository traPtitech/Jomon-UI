<script lang="ts" setup>
import CommentLog from './CommentLog.vue'
import RequestImage from './RequestImage.vue'
import StatusChangeLog from './StatusChangeLog.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'

interface Log {
  created_at: Date
  kind: string
  index: number
}
const requestDetailStore = useRequestDetailStore()

const logs = () => {
  //2つの配列(commentsとstatuses)の中身の型が違うので1つにまとめ、ソートして表示ができない
  let array = new Array<Log>()
  //2つの配列からcreated_at、種類、インデックスだけ取り出して1つの配列にまとめる
  for (let i = 0; i < requestDetailStore.request.comments.length; i++) {
    array = array.concat([
      {
        created_at: new Date(requestDetailStore.request.comments[i].created_at),
        kind: 'comment',
        index: i
      }
    ])
  }
  for (let i = 0; i < requestDetailStore.request.statuses.length; i++) {
    array = array.concat([
      {
        created_at: new Date(requestDetailStore.request.statuses[i].created_at),
        kind: 'statusChange',
        index: i
      }
    ])
  }
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
  <div class="w-2/3 h-120 ml-12">
    <div class="overflow-y-scroll h-full">
      <RequestImage />
      <ul>
        <li v-for="log in logs()" :key="log.created_at.toDateString">
          <CommentLog v-if="log.kind === 'comment'" :index="log.index" />
          <StatusChangeLog
            v-if="log.kind === 'statusChange'"
            :index="log.index" />
          <div class="h-6 w-1 bg-zinc-300 ml-15.5" />
        </li>
      </ul>
    </div>
  </div>
</template>
