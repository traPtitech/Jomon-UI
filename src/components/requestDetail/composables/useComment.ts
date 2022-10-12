import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { Comment } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useComment = () => {
  const toast = useToast()

  const comment = ref('')
  const isSending = ref(false)

  const submit = async (requestId: string) => {
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
    } catch {
      toast.error('コメントの投稿に失敗しました')
      isSending.value = false
      return
    }
    return response
  }
  return { comment, isSending, submit }
}
