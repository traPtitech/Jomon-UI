<script lang="ts" setup>
import MarkdownIt from './shared/MarkdownIt.vue'
import UserIcon from './shared/UserIcon.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { formatDateAndTime } from '/@/utils/date'

const requestDetailStore = useRequestDetailStore()
type Props = { index: number }
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
            new Date(
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
