<script lang="ts" setup>
import { useNewComment } from '/@/components/applicationDetail/composables/useNewComment'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { ApplicationDetail } from '/@/features/application/entities'

const props = defineProps<{
  application: ApplicationDetail
}>()

const { comment, isSending, submit } = useNewComment(props.application.id)
</script>

<template>
  <div class="w-full">
    <MarkdownTextarea v-model="comment" label="コメント">
      <SimpleButton
        :disabled="isSending"
        font-size="base"
        padding="md"
        type="success"
        @click="submit">
        コメントする
      </SimpleButton>
    </MarkdownTextarea>
  </div>
</template>
