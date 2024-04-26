<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import { useNewComment } from '/@/components/requestDetail/composables/useNewComment'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

const requestDetailStore = useRequestDetailStore()
const { request } = storeToRefs(requestDetailStore)
const { comment, isSending, submit } = useNewComment(request.value?.id ?? '')
</script>

<template>
  <div class="w-full">
    <MarkdownTextarea v-model="comment">
      <SimpleButton
        :disabled="isSending"
        font-size="md"
        padding="sm"
        type="success"
        @click="submit">
        コメントする
      </SimpleButton>
    </MarkdownTextarea>
  </div>
</template>
