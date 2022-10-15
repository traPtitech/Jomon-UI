<script lang="ts" setup>
import { useRequestDetailStore } from '/@/stores/requestDetail'

import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useComment } from './composables/useComment'

const requestDetailStore = useRequestDetailStore()

const { comment, isSending, submit } = useComment()
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
        @click.prevent="submit(requestDetailStore.request?.id ?? '')">
        コメントする
      </SimpleButton>
    </div>
  </form>
</template>
