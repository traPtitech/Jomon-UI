import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'

import type { RequestTarget, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertRequestDetail } from '/@/lib/date'

export type EditMode =
  | 'title'
  | 'content'
  | 'amount'
  | 'group'
  | 'tags'
  | 'targets'
  | ''

export interface EditedRequest {
  created_by: string
  title: string
  content: string
  targets: RequestTarget[]
  tags: Tag[]
  group: string | null
}

export const useRequestDetail = () => {
  const requestDetailStore = useRequestDetailStore()
  const toast = useToast()
  const tagStore = useTagStore()
  const { createTagIfNotExist } = tagStore
  const { request, editedValue } = storeToRefs(requestDetailStore)

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
      toast.error('申請の修正に失敗しました')
    }
    editMode.value = ''
  }

  const putRequest = async (id: string, editedRequest: EditedRequest) => {
    let tags: Tag[]
    try {
      tags = await createTagIfNotExist(editedRequest.tags)
    } catch {
      return
    }
    const willPutRequest = {
      ...editedRequest,
      tags: tags.map(tag => tag.id)
    }
    try {
      const response = (await apis.putRequestDetail(id, willPutRequest)).data
      request.value = convertRequestDetail(response)
      toast.success('申請を修正しました')
    } catch {
      toast.error('申請の修正に失敗しました')
    }
  }
  return {
    editMode,
    changeEditMode
  }
}
