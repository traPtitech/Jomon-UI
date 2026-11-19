<script lang="ts" setup>
import { computed } from 'vue'

import { formatDateAndTime } from '@/lib/date'

import MarkdownIt from '@/components/shared/MarkdownIt.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { ApplicationComment } from '@/features/applicationComment/entities'
import { useUserStore } from '@/features/user/store'

const props = defineProps<{
  comment: ApplicationComment
}>()

const traqMatch = computed(() => {
  const patterns = [
    /^https:\/\/q\.trap\.jp\/messages\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  ]

  const text = props.comment.comment
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
})

const embedUrl = computed(() => {
  if (!traqMatch.value) return null
  return `https://q.trap.jp/widget/?type=message&id=${traqMatch.value}`
})

const formattedDateAndTime = formatDateAndTime(props.comment.createdAt)

const { getUserName, getUserNameWithFallback } = useUserStore()
</script>

<template>
  <div :id="comment.id" class="flex w-full flex-col gap-3">
    <div class="flex w-full items-center">
      <div class="flex flex-1 items-center gap-4">
        <UserIcon class="w-12" :name="getUserName(comment.user)" />
        <div>
          <span class="font-bold">{{
            getUserNameWithFallback(comment.user)
          }}</span>
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
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        title="traq"
        class="w-full rounded-lg"
        scrolling="no"
        frameborder="0">
      </iframe>
      <MarkdownIt
        v-else
        class="rounded-lg border border-surface-secondary px-4 py-3"
        :text="comment.comment" />
    </div>
  </div>
</template>
