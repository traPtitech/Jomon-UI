<script lang="ts" setup>
import { ref } from 'vue'

import SimpleButton from '../shared/SimpleButton.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import apis from '/@/lib/apis'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import type{RequestDetail} from '/@/lib/apis'

interface Props{
  request: RequestDetail
}

const props=defineProps<Props>()

const requestDetailStore = useRequestDetailStore()
const comment = ref('')

async function submit() {
  if (comment.value === '') {
    alert('1文字以上入力してください')
    return
  }
  try {
    const response = (
      await apis.postComment(props.request.id, {
        comment: comment.value
      })
    ).data
    props.request.comments.push(response)
    comment.value = ''
  } catch (err: any) {
    alert(err.message)
  }
}
</script>

<template>
  <form class="pl-4">
    <markdown-textarea
      placeholder="コメント"
      :value="comment"
      @input="comment = $event" />
    <div class="mt-2 text-right">
      <simple-button font-size="md" padding="sm" @click.prevent="submit">
        コメントする
      </simple-button>
    </div>
  </form>
</template>
