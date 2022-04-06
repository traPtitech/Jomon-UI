<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'

import { useRequestDetailStore } from '../stores/requestDetail'
import { Comment } from '../types/requestTypes'
import Button from './shared/Button.vue'
import MarkdownIt from './shared/MarkdownIt.vue'

const requestDetailStore = useRequestDetailStore()
const comment = ref('')

async function postComment(id: string, commentRequest: Comment) {
  await axios.post('/api/requests/' + id + '/comments', commentRequest)
  requestDetailStore.fetchRequestDetail(id)
}
function submit() {
  const commentRequest = { comment: comment.value }
  postComment(requestDetailStore.request.id!, commentRequest)
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
        :on-click="submit"
        padding="sm">
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
