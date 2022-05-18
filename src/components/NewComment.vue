<script lang="ts" setup>
import { ref } from 'vue'

import Button from './shared/Button.vue'
import MarkdownIt from './shared/MarkdownIt.vue'
import apis from '/@/lib/apis'
import { useRequestDetailStore } from '/@/stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
const comment = ref('')

async function submit() {
  await apis.postComment(requestDetailStore.request.id, {
    comment: comment.value
  })
  comment.value = ''
}
</script>

<template>
  <form class="pt-12 px-4">
    <textarea
      v-model="comment"
      class="min-h-32 w-full p-1 rounded"
      placeholder="コメント" />
    <div class="text-right">
      <Button
        class="ml-auto mt-2 block"
        font-size="md"
        padding="sm"
        @click.prevent="submit">
        コメントする
      </Button>
    </div>
    <details class="w-full">
      <summary>MDプレビュー</summary>
      <MarkdownIt
        :class="comment ? 'p-1 border border-gray-200' : ''"
        :text="comment" />
    </details>
  </form>
</template>
