import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useApplicationStore } from '/@/features/application/store'

export const useNewComment = (applicationId: string) => {
  const toast = useToast()
  const { createComment } = useApplicationStore()

  const comment = ref('')
  const isSending = ref(false)

  const submit = async () => {
    if (comment.value === '') {
      toast.warning('1文字以上入力してください')
      return
    }
    try {
      isSending.value = true
      await createComment(applicationId, comment.value)
      comment.value = ''
      toast.success('コメントを送信しました')
    } catch (e) {
      if (e instanceof Error && e.message) {
        toast.error(e.message)
      } else {
        toast.error('送信に失敗しました')
      }
    }
    isSending.value = false
  }
  return { comment, isSending, submit }
}
