<script lang="ts" setup>
import { ref } from 'vue'

import Button from './shared/Button.vue'
import MarkdownIt from './shared/MarkdownIt.vue'
import apis from '/@/lib/apis'
import { useRequestDetailStore } from '/@/stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
const comment = ref('')

async function postComment(id: string, comment: string) {
  await apis.postComment(id, { comment: comment })
  requestDetailStore.fetchRequestDetail(id)
}
function submit() {
  postComment(requestDetailStore.request.id, comment.value)
  comment.value = ''
}
</script>

<template>
  <div class="mt-12 mx-4">
    <textarea
      v-model="comment"
      class="resize-none h-32 w-full p-1 rounded"
      placeholder="コメント" />
    <div class="text-right">
      <Button
        class="w-24 mr-4 mt-2"
        font-size="md"
        padding="sm"
        @click="submit">
        コメントする
      </Button>
    </div>
    <details class="w-full">
      <summary>MDプレビュー</summary>
      <MarkdownIt
        :class="comment ? 'p-1 border border-gray-200' : ''"
        :text="comment" />
    </details>
  </div>
</template>
