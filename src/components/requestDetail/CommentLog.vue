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
  <div class="flex w-full p-2">
    <user-icon class="w-12" :name="log.user" />
    <div class="w-full pl-2">
      <div class="flex h-12 items-center justify-between">
        {{ log.user }}がコメントしました。
        <p>
          {{ formattedDateAndTime }}
        </p>
      </div>
      <markdown-it class="border border-zinc-300 p-2" :text="log.comment" />
    </div>
  </div>
</template>
