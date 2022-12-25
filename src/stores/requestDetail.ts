import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { RequestDetail } from '/@/lib/apiTypes'
import type { PostRequest, User, Tag, RequestTarget } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertRequestDetail } from '/@/lib/date'

export interface RequestRequest {
  created_by: string
  title: string
  content: string
  targets: RequestTarget[]
  tags: Tag[]
  group: string
}

export const useRequestDetailStore = defineStore('requestDetail', () => {
  const toast = useToast()

  const request = ref<RequestDetail>()

  const targets = computed((): RequestTarget[] => {
    if (request.value === undefined) {
      return []
    }
    return request.value.targets.map(target => ({
      target: target.id,
      amount: target.amount
    }))
  })

  const editMode = ref('')
  const editedValue = ref<RequestRequest>({
    created_by: '',
    title: '',
    content: '',
    targets: [],
    tags: [],
    group: ''
  })
  const isRequestCreater = (user: User | undefined) => {
    if (!user || request.value === undefined) return false
    return user.id === request.value.created_by
  }

  const fetchRequestDetail = async (id: string) => {
    try {
      const response = (await apis.getRequestDetail(id)).data
      request.value = convertRequestDetail(response)

      editedValue.value = {
        created_by: request.value.created_by,
        title: request.value.title,
        content: request.value.content,
        targets: targets.value,
        tags: request.value.tags,
        group: request.value.group.id
      }
    } catch {
      toast.error('申請の取得に失敗しました')
    }
  }
  const putRequest = async (id: string, willPutRequest: PostRequest) => {
    try {
      const response = (await apis.putRequestDetail(id, willPutRequest)).data
      request.value = convertRequestDetail(response)

      toast.success('申請の修正に成功しました')
    } catch {
      toast.error('申請の修正に失敗しました')
    }
  }

  return {
    request,
    targets,
    editMode,
    editedValue,
    isRequestCreater,
    fetchRequestDetail,
    putRequest
  }
})
