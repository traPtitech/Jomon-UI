<script lang="ts" setup>
import type { Comment } from '/@/lib/apis'
import { formatDateAndTime } from '/@/lib/date'

import MarkdownIt from '/@/components//shared/MarkdownIt.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

interface Props {
  log: Comment
}

const props = defineProps<Props>()

const formattedDateAndTime = formatDateAndTime(props.log.created_at)
</script>

<template>
  <div class="flex w-full p-2">
    <UserIcon class="w-12" :name="log.user" />
    <div class="w-full pl-2">
      <div class="flex h-12 items-center justify-between">
        {{ log.user }}がコメントしました。
        <span>
          {{ formattedDateAndTime }}
        </span>
      </div>
      <MarkdownIt class="border border-zinc-300 p-1" :text="log.comment" />
    </div>
  </div>
</template>
