import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export type EditMode = 'update' | 'cancel' | 'edit'

export interface EditedValue {
  title: string
  amount: number
  content: string
  targets: string[]
  tags: Tag[]
  group: string
  created_by: string
}

export const useRequestDetail = () => {
  const requestDetailStore = useRequestDetailStore()
  const toast = useToast()
  const tagStore = useTagStore()
  const { request } = storeToRefs(requestDetailStore)

  const isEditMode = ref(false)

  const changeEditMode = async (editMode: EditMode) => {
    if (editMode === 'edit') {
      isEditMode.value = true
      return
    } else if (editMode === 'cancel') {
      isEditMode.value = false
      return
    }
    const result = confirm(
      '入出金記録に紐づいている申請の情報を変更すると、入出金記録の情報にも変更が反映されます。よろしいですか？'
    )
    if (!result) return

    if (request.value !== undefined) {
      await putRequest(request.value.id, requestDetailStore.editedValue)
    } else {
      toast.error('申請の修正に失敗しました')
    }
    isEditMode.value = false
  }

  const putRequest = async (id: string, willPutRequest: EditedValue) => {
    let tags: Tag[]
    try {
      tags = await tagStore.createTagIfNotExist(willPutRequest.tags)
    } catch {
      return
    }
    const putRequest = {
      ...willPutRequest,
      targets: [...willPutRequest.targets],
      amount: willPutRequest.amount,
      tags: tags.map(tag => tag.id)
    }
    try {
      request.value = (await apis.putRequestDetail(id, putRequest)).data
      toast.success('申請を修正しました')
    } catch {
      toast.error('申請の修正に失敗しました')
    }
  }
  return {
    isEditMode,
    changeEditMode
  }
}
