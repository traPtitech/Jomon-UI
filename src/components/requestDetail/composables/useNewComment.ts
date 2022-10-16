import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import type { Comment } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useNewComment = (requestId: string) => {
  const requestDetailStore = useRequestDetailStore()
  const toast = useToast()

  const comment = ref('')
  const isSending = ref(false)

  const submit = async () => {
    if (comment.value === '') {
      alert('1文字以上入力してください')
      return
    }
    let response: Comment
    try {
      isSending.value = true
      response = (
        await apis.postComment(requestId, {
          comment: comment.value
        })
      ).data
      comment.value = ''
      isSending.value = false
      toast.success('コメントを送信しました')
      requestDetailStore.request?.comments.push(response)
    } catch {
      isSending.value = false
      toast.error('コメントの送信に失敗しました')
      return
    }
  }
  return { comment, isSending, submit }
}
