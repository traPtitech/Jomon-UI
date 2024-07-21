<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import { formatDateAndTime } from '/@/lib/date'

import MarkdownIt from '/@/components//shared/MarkdownIt.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import type { RequestComment } from '/@/features/requestComment/model'

const props = defineProps<{
  comment: RequestComment
}>()

const formattedDateAndTime = formatDateAndTime(props.comment.createdAt)

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)
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
    <div class="ml-15">
      <MarkdownIt
        class="border border-secondary px-4 py-3 rounded-lg"
        :text="comment.comment" />
    </div>
  </div>
</template>
