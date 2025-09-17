<script lang="ts" setup>
import MarkdownIt from '@/components//shared/MarkdownIt.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { ApplicationComment } from '@/features/applicationComment/entities'
import { useUserStore } from '@/features/user/store'
import { formatDateAndTime } from '@/lib/date'

const props = defineProps<{
  comment: ApplicationComment
}>()

const formattedDateAndTime = formatDateAndTime(props.comment.createdAt)

const { userMap } = useUserStore()
</script>

<template>
  <div :id="comment.id" class="w-full flex flex-col gap-3">
    <div class="flex w-full items-center">
      <div class="flex items-center gap-4 flex-1">
        <UserIcon class="w-12" :name="userMap[comment.user]" />
        <div>
          <span class="font-bold">{{ userMap[comment.user] }}</span>
          がコメントしました
        </div>
      </div>
      <time
        class="text-text-secondary"
        :datetime="comment.createdAt.toISO() ?? ''">
        {{ formattedDateAndTime }}
      </time>
    </div>
    <div class="ml-16">
      <MarkdownIt
        class="border border-surface-secondary px-4 py-3 rounded-lg"
        :text="comment.comment" />
    </div>
  </div>
</template>
