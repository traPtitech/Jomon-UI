import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useUserStore } from '/@/stores/user'

import type { FileSeed } from '/@/features/file/model'
import { createFilesUsecase } from '/@/features/file/usecase'
import type { RequestSeed } from '/@/features/request/model'
import { createRequestUsecase } from '/@/features/request/usecase'
import type { Tag } from '/@/features/tag/model'
import { createTagIfNotExistUsecase } from '/@/features/tag/usecase'

export const useNewRequest = () => {
  const toast = useToast()
  const router = useRouter()
  const { me } = useUserStore()

  const isSending = ref(false)

  const request = ref<RequestSeed>({
    createdBy: me.value?.id ?? '',
    title: '',
    targets: [{ target: '', amount: 0 }],
    content: '',
    tags: [],
    group: null
  })
  const files = ref<FileSeed[]>([])

  const postRequest = async () => {
    if (
      request.value.title === '' ||
      request.value.content === '' ||
      request.value.targets.length === 0
    ) {
      toast.warning('タイトル、詳細、対象者は必須です')
      return
    }
    if (
      request.value.targets.some(
        target => target.target === '' || target.amount === 0
      )
    ) {
      toast.warning('対象者の選択と金額の入力は必須です')
      return
    }
    isSending.value = true

    let tags: Tag[]
    try {
      tags = await createTagIfNotExistUsecase(request.value.tags)
    } catch (e) {
      if (e instanceof Error) {
        toast.error('新規タグの作成に失敗しました')
      }
      isSending.value = false
      return
    }

    try {
      const requestSeedWithNewTags = {
        ...request.value,
        tags
      }
      const res = await createRequestUsecase(requestSeedWithNewTags)
      try {
        await createFilesUsecase(res.id, files.value)
        toast.success('申請を作成しました')
        router.push('/')
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message)
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }
  return { isSending, request, files, postRequest }
}
