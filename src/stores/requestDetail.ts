import { defineStore } from 'pinia'
import { watch, computed, ref } from 'vue'

import type { RequestDetail, PostRequest } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface File {
  id: string
  file: string
  name: string
}
interface EditedValue {
  title: string
  amount: number
  content: string
  targets: string[]
  tags: string[]
  group: string
  created_by: string
}

export const useRequestDetailStore = defineStore('requestDetail', () => {
  const request = ref<RequestDetail>()
  const files = ref<File[]>([])
  const targetIds = computed(() => {
    return request.value?.targets.map(target => target.id) ?? []
  })
  const tagIds = computed(() => {
    return request.value?.tags.map(tag => tag.id) ?? []
  })

  const editMode = ref('')
  const editedValue = ref<EditedValue>({
    created_by: '',
    amount: 0,
    title: '',
    content: '',
    targets: [],
    tags: [],
    group: ''
  })

  async function changeEditMode(
    kind: 'title' | 'content' | 'amount' | 'group' | 'tags' | 'targets' | ''
  ) {
    if (
      editMode.value === 'amount' &&
      kind === '' &&
      !/^[1-9][0-9]*$|^0$/.test(editedValue.value.amount.toString())
    ) {
      alert('金額の形式が不正です')
      return
    }
    if (editMode.value !== 'tags' && kind === '') {
      const result = confirm(
        '入出金記録に紐づいている申請のこの情報を変更すると、入出金記録の情報にも変更が反映されます。よろしいですか？'
      )
      if (!result) return
    }
    if (kind !== '') {
      editMode.value = kind
    } else {
      await putRequest(request.value?.id ?? '', editedValue.value)
      editMode.value = ''
    }
  }

  const fetchRequestDetail = async (id: string) => {
    try {
      request.value = (await apis.getRequestDetail(id)).data
    } catch (err) {
      alert(err)
    }
  }
  const putRequest = async (id: string, willPutRequest: PostRequest) => {
    try {
      request.value = (await apis.putRequestDetail(id, willPutRequest)).data
    } catch (err) {
      alert(err)
    }
  }

  watch(request, request => {
    editedValue.value = {
      title: request?.title ?? '',
      amount: request?.amount ?? 0,
      content: request?.content ?? '',
      targets: request?.targets.map(target => target.id) ?? [],
      tags: request?.tags.map(tag => tag.id) ?? [],
      group: request?.group.id ?? '',
      created_by: request?.created_by ?? ''
    }
  })

  return {
    request,
    files,
    targetIds,
    tagIds,
    editMode,
    editedValue,
    changeEditMode,
    fetchRequestDetail,
    putRequest
  }
})
