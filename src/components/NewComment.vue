<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useRequestDetailStore } from '../stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
const { request } = storeToRefs(requestDetailStore)
const comment = ref('')
function submit() {
  const commentRequest = { comment: comment.value }
  requestDetailStore.postComment(request.value.id, commentRequest)
  comment.value = ''
}
</script>

<template>
  <div class="mt-12 mr-4 ml-4">
    <textarea
      v-model="comment"
      class="resize-none h-20 w-full"
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
  </div>
</template>
