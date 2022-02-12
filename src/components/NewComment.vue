<script lang="ts" setup>
import { ref } from 'vue'
const kind = ref('comment')
const status = ref('submitted')
const comment = ref('')
function submit() {
  kind.value = 'comment'
  status.value = 'submitted'
  comment.value = ''
}
</script>

<template>
  <div class="flex flex-col mt-4">
    <div class="flex justify-between">
      <select v-model="kind">
        <option value="comment">コメント</option>
        <option value="statusChange">状態変更</option>
      </select>
      <select v-if="kind === 'statusChange'" v-model="status">
        <option value="submitted">承認待ち</option>
        <option value="fix_required">要修正</option>
        <option value="accepted">承認済み</option>
        <option value="fully_repaid">返済完了</option>
        <option value="rejected">却下</option>
      </select>
    </div>
    <textarea
      v-model="comment"
      class="resize-none h-20"
      :placeholder="kind === 'comment' ? 'コメント' : '変更理由'"
    ></textarea>
    <div class="text-right">
      <button
        class="w-20 border border-solid border-black rounded-md mr-4 mt-2"
        @click="submit"
      >
        {{ kind === 'comment' ? 'コメントする' : '変更する' }}
      </button>
    </div>
  </div>
</template>
