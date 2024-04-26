<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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

const route = useRoute()
const hash = computed(() => route.hash.substring(1))
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
      <time class="text-gray-400" :datetime="comment.createdAt.toISO() ?? ''">
        {{ formattedDateAndTime }}
      </time>
    </div>
    <div class="ml-15">
      <MarkdownIt
        class="border border-zinc-300 px-4 py-3 rounded-lg"
        :text="comment.comment" />
    </div>
  </div>
</template>
