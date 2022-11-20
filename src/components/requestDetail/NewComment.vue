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
  <form class="relative w-3/4">
    <MarkdownTextarea v-model="comment" placeholder="コメント" />
    <SimpleButton
      class="absolute right-4 bottom-2"
      font-size="md"
      :is-disabled="isSending"
      kind="success"
      padding="sm"
      @click.prevent="submit">
      コメントする
    </SimpleButton>
  </form>
</template>
