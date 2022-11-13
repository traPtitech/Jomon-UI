import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import apis from '/@/lib/apis'

export const useNewComment = (requestId: string) => {
  const requestDetailStore = useRequestDetailStore()
  const toast = useToast()

  const comment = ref('')
  const isSending = ref(false)

  const submit = async () => {
    if (comment.value === '') {
      toast.warning('1文字以上入力してください')
      return
    }
    try {
      isSending.value = true
      const response = (
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
