import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { RequestDetail, PostRequest } from '/@/lib/apis'
import apis from '/@/lib/apis'

interface File {
  file: string
  name: string
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
  const editedValue = ref({
    created_by: request.value?.created_by ?? '',
    amount: request.value?.amount ?? 0,
    title: request.value?.title ?? '',
    content: request.value?.content ?? '',
    targets: targetIds,
    tags: tagIds,
    group: request.value?.group.id ?? ''
  })
  function changeEditMode(
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
      putRequest(request.value?.id ?? '', editedValue.value)
      editMode.value = ''
    }
  }

  const fetchRequestDetail = async (id: string) => {
    try {
      request.value = (await apis.getRequestDetail(id)).data
    } catch (err: any) {
      alert(err.message)
    }
  }
  const putRequest = async (id: string, willPutRequest: PostRequest) => {
    try {
      const res = (await apis.putRequestDetail(id, willPutRequest)).data
      request.value = res
    } catch (err: any) {
      alert(err.message)
    }
  }
  const fetchFiles = async (ids: string[]) => {
    try {
      ids.forEach(async id => {
        files.value.concat((await apis.getFile(id)).data)
      })
    } catch (err: any) {
      alert(err.message)
    }
  }

  return {
    request,
    files,
    targetIds,
    tagIds,
    editMode,
    editedValue,
    changeEditMode,
    fetchRequestDetail,
    putRequest,
    fetchFiles
  }
})
