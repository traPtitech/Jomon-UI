import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import apis from '/@/lib/apis'
import { convertRequestComment } from '/@/lib/date'

export const useNewComment = (requestId: string) => {
  const requestDetailStore = useRequestDetailStore()
  const toast = useToast()
  const { request } = storeToRefs(requestDetailStore)

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
      request.value?.comments.push(convertRequestComment(response))
      toast.success('コメントを送信しました')
    } catch {
      toast.error('コメントの送信に失敗しました')
    }
    isSending.value = false
  }
  return { comment, isSending, submit }
}
