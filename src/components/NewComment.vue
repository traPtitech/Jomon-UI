<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRequestDetailStore } from '../stores/requestDetail'
import { useUserStore } from '../stores/user'
const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const { request } = storeToRefs(requestDetailStore)
const { me } = storeToRefs(userStore)
const kind = ref('comment')
const status = ref('')
const comment = ref('')
function submit() {
  if (kind.value === 'comment') {
    const commentRequest = { comment: comment.value }
    requestDetailStore.postComment(request.value.id, commentRequest)
    kind.value = 'comment'
    comment.value = ''
  }
  if (kind.value === 'statusChange') {
    const statusRequest = { status: status.value, reason: comment.value }
    requestDetailStore.putStatus(request.value.id, statusRequest)
    kind.value = 'statusChange'
    status.value = ''
    comment.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col mt-4">
    <div class="flex justify-between">
      <select v-model="kind">
        <option value="comment">コメント</option>
        <option
          v-if="me.admin || request.created_by == me.name"
          value="statusChange"
        >
          状態変更
        </option>
      </select>
      <select v-if="kind === 'statusChange'" v-model="status">
        <option disabled value="">申請の状態を選択</option>
        <option
          v-if="
            request.status === 'fix_required' ||
            (me.admin && request.status === 'accepted')
          "
          value="submitted"
        >
          承認待ち
        </option>
        <option
          v-if="me.admin && request.status === 'submitted'"
          value="fix_required"
        >
          要修正
        </option>
        <option
          v-if="me.admin && request.status === 'submitted'"
          value="accepted"
        >
          承認済み
        </option>
        <option value="fully_repaid">返済完了</option>
        <option
          v-if="me.admin && request.status === 'submitted'"
          value="rejected"
        >
          却下
        </option>
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
