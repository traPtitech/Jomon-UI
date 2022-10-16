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
  <form class="mx-4 w-full">
    <MarkdownTextarea v-model="comment" placeholder="コメント" />
    <div class="mt-1">
      <SimpleButton
        class="ml-auto"
        font-size="md"
        :is-disabled="isSending"
        padding="sm"
        @click.prevent="submit">
        コメントする
      </SimpleButton>
    </div>
  </form>
</template>
