import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import apis from '/@/lib/apis'

import { usePostTags } from './usePostTags'

export type EditMode =
  | 'title'
  | 'content'
  | 'amount'
  | 'group'
  | 'tags'
  | 'targets'
  | ''

export interface EditedValue {
  title: string
  amount: number
  content: string
  targets: string[]
  tags: string[]
  group: string
  created_by: string
}

export const useRequestDetail = () => {
  const requestDetailStore = useRequestDetailStore()
  const toast = useToast()
  const { postTags } = usePostTags()
  const { request } = storeToRefs(requestDetailStore)

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
      await putRequest(request.value.id, requestDetailStore.editedValue)
    } else {
      toast.error('申請の修正に失敗しました')
    }
    editMode.value = ''
  }

  const putRequest = async (id: string, willPutRequest: EditedValue) => {
    let tags
    try {
      tags = await postTags(willPutRequest.tags)
    } catch {
      return
    }
    const putRequest = {
      ...willPutRequest,
      targets: [...willPutRequest.targets],
      amount: Number(willPutRequest.amount),
      tags: tags
    }
    try {
      request.value = (await apis.putRequestDetail(id, putRequest)).data
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
