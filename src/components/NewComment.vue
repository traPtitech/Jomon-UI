<script lang="ts" setup>
import { ref } from 'vue'

import apis from '../lib/apis'
import { useRequestDetailStore } from '../stores/requestDetail'
import Button from './shared/Button.vue'
import MarkdownIt from './shared/MarkdownIt.vue'

const requestDetailStore = useRequestDetailStore()
const comment = ref('')

async function postComment(id: string, comment: string) {
  await apis.postComment(id, { comment: comment })
  requestDetailStore.fetchRequestDetail(id)
}
function submit() {
  postComment(requestDetailStore.request.id!, comment.value)
  comment.value = ''
}
</script>

<template>
  <div class="mt-12 mr-4 ml-4">
    <textarea
      v-model="comment"
      class="resize-none h-32 w-full p-0.5"
      placeholder="コメント"></textarea>
    <div class="text-right">
      <Button
        class="w-24 mr-4 mt-2"
        font-size="md"
        padding="sm"
        @click="submit">
        コメントする
      </Button>
    </div>
    <details>
      <summary>MDプレビュー</summary>
      <div>
        <MarkdownIt
          :class="comment ? 'borderd border-gray-200' : ''"
          :text="comment" />
      </div>
    </details>
  </div>
</template>
