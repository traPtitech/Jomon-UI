<script lang="ts" setup>
import type { Comment } from '/@/lib/convertRequestDetailResponse'
import { formatDateAndTime } from '/@/lib/date'

import MarkdownIt from '/@/components//shared/MarkdownIt.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

interface Props {
  comment: Comment
}

const props = defineProps<Props>()

const formattedDateAndTime = formatDateAndTime(props.comment.created_at)
</script>

<template>
  <div class="flex w-full p-2">
    <UserIcon class="w-12" :name="comment.user" />
    <div class="w-full pl-2">
      <div class="flex h-12 items-center justify-between">
        {{ comment.user }}がコメントしました。
        <span>
          {{ formattedDateAndTime }}
        </span>
      </div>
      <MarkdownIt class="border border-zinc-300 p-1" :text="comment.comment" />
    </div>
  </div>
</template>
