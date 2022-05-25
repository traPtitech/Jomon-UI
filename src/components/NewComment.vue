<script lang="ts" setup>
import { ref } from 'vue'

import Button from './shared/Button.vue'
import MarkdownTextarea from './shared/MarkdownTextarea.vue'
import apis from '/@/lib/apis'
import { useRequestDetailStore } from '/@/stores/requestDetail'

const requestDetailStore = useRequestDetailStore()
const comment = ref('')

async function submit() {
  const res = (
    await apis.postComment(requestDetailStore.request.id, {
      comment: comment.value
    })
  ).data
  requestDetailStore.request.comments.push(res)
  comment.value = ''
}
</script>

<template>
  <form class="pl-4">
    <MarkdownTextarea
      placeholder="コメント"
      :value="comment"
      @input="comment = $event" />
    <div class="text-right mt-2">
      <Button font-size="md" padding="sm" @click.prevent="submit">
        コメントする
      </Button>
    </div>
  </form>
</template>
