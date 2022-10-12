<script lang="ts" setup>
import { ArrowPathIcon } from '@heroicons/vue/24/solid'

import type { Comment } from '/@/lib/apis'

import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useComment } from './composables/useComment'

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
  <form class="mx-4 w-full">
    <MarkdownTextarea
      placeholder="コメント"
      :value="comment"
      @input="comment = $event" />
    <div class="mt-1">
      <SimpleButton
        :class="`ml-auto flex items-center ${isSending && 'px-8'}`"
        font-size="md"
        padding="sm"
        @click.prevent="handleSubmit">
        <p v-if="!isSending">コメントする</p>
        <ArrowPathIcon v-else class="w-5 animate-spin" />
      </SimpleButton>
    </div>
  </form>
</template>
