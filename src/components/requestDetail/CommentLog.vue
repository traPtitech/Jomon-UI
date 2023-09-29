<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import { formatDateAndTime } from '/@/lib/date'

import MarkdownIt from '/@/components//shared/MarkdownIt.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'
import type { RequestComment } from '/@/features/requestComment/model'

interface Props {
  comment: RequestComment
}

const props = defineProps<Props>()

const formattedDateAndTime = formatDateAndTime(props.comment.createdAt)

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)

const route = useRoute()
const hash = computed(() => route.hash.substring(1))
</script>

<template>
  <div :id="comment.id" class="flex w-full p-2">
    <UserIcon class="w-12" :name="userMap[comment.user]" />
    <div class="w-full pl-2">
      <div class="flex h-12 items-center justify-between">
        {{ userMap[comment.user] }}がコメントしました。
        <span>
          {{ formattedDateAndTime }}
        </span>
      </div>
      <MarkdownIt
        :class="`border border-zinc-300 p-1 ${
          hash === comment.id && 'border-3 border border-yellow-300'
        }`"
        :text="comment.comment" />
    </div>
  </div>
</template>
