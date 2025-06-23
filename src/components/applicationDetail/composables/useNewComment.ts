import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { createCommentUsecase } from '/@/features/application/usecase'

export const useNewComment = (applicationId: string) => {
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
      await createCommentUsecase(applicationId, comment.value)
      comment.value = ''
      toast.success('コメントを送信しました')
    } catch {
      toast.error('送信に失敗しました')
    }
    isSending.value = false
  }
  return { comment, isSending, submit }
}
