<script lang="ts" setup>
import { DateTime } from 'luxon'

import MarkdownIt from './shared/MarkdownIt.vue'
import UserIcon from './shared/UserIcon.vue'
import { formatDateAndTime } from '/@/lib/date'
import { useRequestDetailStore } from '/@/stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
interface Props {
  index: number
}
const props = defineProps<Props>()
</script>

<template>
  <div class="m-2 p-2 border border-zinc-300">
    <div class="flex justify-between">
      <div class="flex h-12 items-center">
        <UserIcon
          class="mr-2"
          :name="requestDetailStore.request.comments[props.index].user" />
        {{
          requestDetailStore.request.comments[props.index].user
        }}がコメントしました。
      </div>
      <span class="text-zinc-400">
        {{
          formatDateAndTime(
            DateTime.fromISO(
              requestDetailStore.request.comments[props.index].created_at
            )
          )
        }}
      </span>
    </div>
    <MarkdownIt
      class="ml-12"
      :text="requestDetailStore.request.comments[props.index].comment" />
  </div>
</template>
