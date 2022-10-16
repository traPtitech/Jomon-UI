import type { AxiosResponse } from 'axios'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

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
  const tagStore = useTagStore()
  const toast = useToast()
  const { request } = storeToRefs(requestDetailStore)

  const editMode = ref<EditMode>('')

  const changeEditMode = async (kind: EditMode) => {
    if (kind !== '') {
      editMode.value = kind
      return
    }
    if (
      editMode.value === 'amount' &&
      (isNaN(Number(requestDetailStore.editedValue.amount)) ||
        Number(requestDetailStore.editedValue.amount) === 0)
    ) {
      alert('金額の形式が不正です')
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
    const tagPostPromises: Promise<AxiosResponse<Tag>>[] = []
    let preTags = [...willPutRequest.tags]
    preTags.forEach((tag: string) => {
      if (tagStore.tags?.some(t => t.id === tag)) {
        return
      }
      tagPostPromises.push(apis.postTag({ name: tag }))
    })
    try {
      preTags = preTags.concat(
        (await Promise.all(tagPostPromises)).map(
          (tag: AxiosResponse<Tag>) => tag.data.id
        )
      )
    } catch {
      toast.error('申請の修正に失敗しました')
      return
    }
    const putRequest = {
      ...willPutRequest,
      targets: [...willPutRequest.targets],
      amount: Number(willPutRequest.amount),
      tags: preTags
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
