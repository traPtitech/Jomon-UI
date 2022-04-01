<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'

import { useRequestDetailStore } from '../stores/requestDetail'
import { Comment } from '../types/requestTypes'
import MarkdownIt from './MarkdownIt.vue'

const requestDetailStore = useRequestDetailStore()
const comment = ref('')

async function postComment(id: string, commentRequest: Comment) {
  await axios.post('/api/requests/' + id + '/comments', commentRequest)
  requestDetailStore.getRequestDetail(id)
}
function submit() {
  const commentRequest = { comment: comment.value }
  postComment(requestDetailStore.request.id, commentRequest)
  comment.value = ''
}
</script>

<template>
  <div class="mt-12 mr-4 ml-4">
    <textarea
      v-model="comment"
      class="resize-none h-32 w-full"
      placeholder="コメント"
    ></textarea>
    <div class="text-right">
      <button
        class="w-20 border border-solid border-black rounded-md mr-4 mt-2"
        @click="submit"
      >
        コメントする
      </button>
    </div>
    <details>
      <summary>MDプレビュー</summary>
      <div>
        <MarkdownIt
          :text="comment"
          :class="comment ? 'border border-solid border-gray-200' : ''"
        />
      </div>
    </details>
  </div>
</template>
