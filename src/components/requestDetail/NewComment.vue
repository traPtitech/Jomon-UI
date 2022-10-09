<script lang="ts" setup>
import { ArrowPathIcon } from '@heroicons/vue/24/solid'

import { useComment } from './composables/useComment'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { Comment } from '/@/lib/apis'

interface Props {
  requestId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'pushComment', value: Comment): void
}>()

const { comment, isSending, submit } = useComment()

async function handleSubmit() {
  const response = await submit(props.requestId)
  if (response) {
    emit('pushComment', response)
  }
}
</script>

<template>
  <form class="md:ml-2">
    <markdown-textarea
      placeholder="コメント"
      :value="comment"
      @input="comment = $event" />
    <div class="mt-1">
      <simple-button
        :class="`ml-auto flex items-center ${isSending && 'px-8'}`"
        font-size="md"
        padding="sm"
        @click.prevent="handleSubmit">
        <p v-if="!isSending">コメントする</p>
        <arrow-path-icon v-else class="w-5 animate-spin" />
      </simple-button>
    </div>
  </form>
</template>
