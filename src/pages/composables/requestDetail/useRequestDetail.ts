import type { AxiosResponse } from 'axios'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { RequestDetail, Tag } from '/@/lib/apis'
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
  amount: string
  content: string
  targets: string[]
  tags: string[]
  group: string
  created_by: string
}

export const useRequestDetail = () => {
  const toast = useToast()

  const request = ref<RequestDetail>()

  const targetIds = computed(() => {
    return request.value?.targets.map(target => target.id) ?? []
  })
  const tagIds = computed(() => {
    return request.value?.tags.map(tag => tag.id) ?? []
  })
  const editedValue = computed(() => {
    return {
      title: request.value?.title ?? '',
      amount: request.value?.amount.toString() ?? '',
      content: request.value?.content ?? '',
      targets: targetIds.value,
      tags: tagIds.value,
      group: request.value?.group?.id ?? '',
      created_by: request.value?.created_by ?? ''
    }
  })
  const editMode = ref<EditMode>('')

  const fetchRequestDetail = async (id: string) => {
    try {
      request.value = (await apis.getRequestDetail(id)).data
    } catch {
      toast.error('申請の取得に失敗しました')
    }
  }

  const changeEditMode = async (kind: EditMode) => {
    if (kind !== '') {
      editMode.value = kind
      return
    }
    if (
      editMode.value === 'amount' &&
      (isNaN(Number(editedValue.value.amount)) ||
        Number(editedValue.value.amount) === 0)
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
      await putRequest(request.value.id, editedValue.value)
    } else {
      toast.error('申請の修正に失敗しました')
    }
    editMode.value = ''
  }
  const putRequest = async (id: string, willPutRequest: EditedValue) => {
    const tagPostPromises: Promise<AxiosResponse<Tag>>[] = []
    const preTags = [...willPutRequest.tags]
    preTags.forEach((tag: string) => {
      if (tag !== '') {
        return
      }
      tagPostPromises.push(apis.postTag({ name: tag }))
    })
    let tags: string[] = []
    try {
      tags = (await Promise.all(tagPostPromises)).map(
        (tag: AxiosResponse<Tag>) => tag.data.id
      )
    } catch {
      toast.error('申請の修正に失敗しました')
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
    editedValue,
    editMode,
    request,
    targetIds,
    tagIds,
    fetchRequestDetail,
    changeEditMode
  }
}
