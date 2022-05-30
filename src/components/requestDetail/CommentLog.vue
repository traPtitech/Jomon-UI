<script lang="ts" setup>
import MarkdownIt from '/@/components//shared/MarkdownIt.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import { formatDateAndTime } from '/@/lib/date'

interface Props {
  log: {
    id: string
    user: string
    comment: string
    created_at: string
    updated_at: string
  }
}
const props = defineProps<Props>()
const formattedDateAndTime = formatDateAndTime(props.log.created_at)
</script>

<template>
  <div class="flex p-2 w-full">
    <UserIcon class="w-12" :name="log.user" />
    <div class="w-full pl-2">
      <div class="flex justify-between items-center h-12">
        {{ log.user }}がコメントしました。
        <div class="">
          {{ formattedDateAndTime }}
        </div>
      </div>
      <MarkdownIt class="p-2 border border-zinc-300" :text="log.comment" />
    </div>
  </div>
</template>
