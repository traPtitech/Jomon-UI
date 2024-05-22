<script lang="ts" setup>
import { useNewComment } from '/@/components/requestDetail/composables/useNewComment'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { RequestDetail } from '/@/features/request/model'

const props = defineProps<{
  request: RequestDetail
}>()

const { comment, isSending, submit } = useNewComment(props.request.id)
</script>

<template>
  <div class="w-full">
    <MarkdownTextarea v-model="comment">
      <SimpleButton
        :disabled="isSending"
        font-size="md"
        padding="md"
        type="success"
        @click="submit">
        コメントする
      </SimpleButton>
    </MarkdownTextarea>
  </div>
</template>
