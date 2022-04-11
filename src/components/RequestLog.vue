<script lang="ts" setup>
import { useRequestDetailStore } from '../stores/requestDetail'
import { formatDate } from '../utiles/date'
import MarkdownIt from './shared/MarkdownIt.vue'
import StatusChip from './shared/StatusChip.vue'
import UserIcon from './shared/UserIcon.vue'

const requestDetailStore = useRequestDetailStore()
type Props = { kind: string; index: number }
const props = defineProps<Props>()
</script>

<template>
  <div class="m-2">
    <div v-if="kind === 'comment'" class="border border-zinc-300">
      <div class="flex justify-between">
        <span class="flex h-12 items-center">
          <UserIcon
            class="ml-2 mt-2"
            :name="requestDetailStore.request.comments[props.index].user" />
          <span class="ml-2 mt-2">
            {{
              requestDetailStore.request.comments[props.index].user
            }}がコメントしました。
          </span>
        </span>
        <span class="mr-2 mt-2 text-zinc-400">
          {{
            formatDate(
              requestDetailStore.request.comments[props.index].created_at
            )
          }}
        </span>
      </div>
      <div class="ml-12 mb-2">
        <span class="align-top">コメント：</span>
        <MarkdownIt
          class="inline-block"
          :text="requestDetailStore.request.comments[props.index].comment" />
      </div>
    </div>
    <div
      v-if="kind === 'statusChange'"
      class="w-9/10 ml-8 h-12 flex items-center">
      <UserIcon
        class="mr-2"
        :name="requestDetailStore.request.statuses[props.index].created_by" />
      <span>
        {{
          requestDetailStore.request.statuses[props.index].created_by
        }}が申請の状態を
      </span>
      <StatusChip
        :status="requestDetailStore.request.statuses[props.index].status"
        :text="true!" /><!--todo:文字の高さずれるのどうにかする-->
      <span>にしました。</span>
      <span class="ml-4 text-zinc-400">
        {{
          formatDate(
            requestDetailStore.request.statuses[props.index].created_at
          )
        }}
      </span>
    </div>
  </div>
</template>
