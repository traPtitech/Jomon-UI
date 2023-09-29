import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import type { RequestSeed } from '/@/features/request/model'
import { editRequestUsecase } from '/@/features/request/usecase'
import type { Tag } from '/@/features/tag/model'
import { createTagIfNotExistUsecase } from '/@/features/tag/usecase'

export type EditMode =
  | 'title'
  | 'content'
  | 'amount'
  | 'group'
  | 'tags'
  | 'targets'
  | ''

export const useRequestDetail = () => {
  const requestDetailStore = useRequestDetailStore()
  const toast = useToast()
  const { request, editedValue } = storeToRefs(requestDetailStore)

  const isSending = ref(false)
  const editMode = ref<EditMode>('')

  const changeEditMode = async (kind: EditMode) => {
    if (kind !== '') {
      editMode.value = kind
      return
    }
    if (editMode.value !== 'tags') {
      const result = confirm(
        '入出金記録に紐づいている申請のこの情報を変更すると、入出金記録の情報にも変更が反映されます。よろしいですか？'
      )
      if (!result) return
    }
    if (request.value !== undefined) {
      await putRequest(request.value.id, editedValue.value)
    } else {
      toast.error('申請の更新に失敗しました')
    }
    editMode.value = ''
  }

  const putRequest = async (id: string, requestSeed: RequestSeed) => {
    isSending.value = true
    let tags: Tag[]
    try {
      tags = await createTagIfNotExistUsecase(requestSeed.tags)
    } catch {
      toast.error('新規タグの作成に失敗しました')
      isSending.value = false
      return
    }
    try {
      const requestSeedWithNewTags = {
        ...requestSeed,
        tags
      }
      await editRequestUsecase(id, requestSeedWithNewTags)
      toast.success('申請を更新しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }

  return {
    isSending,
    editMode,
    changeEditMode
  }
}
