import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { RequestDetail, PostRequest, User, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

interface EditedValue {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: Tag[]
  group: string
}

export const useRequestDetailStore = defineStore('requestDetail', () => {
  const toast = useToast()

  const request = ref<RequestDetail>()

  const targetIds = computed(() => {
    const targetIds = new Array<string>()
    if (request.value === undefined) {
      return []
    }
    for (let i = 0; i < request.value.targets.length; i++) {
      targetIds.push(request.value.targets[i].id)
    }
    return targetIds
  })

  const editedValue = ref<EditedValue>({
    created_by: '',
    amount: 0,
    title: '',
    content: '',
    targets: [],
    tags: [],
    group: ''
  })
  const isRequestCreater = (user: User | undefined) => {
    if (!user || request.value === undefined) return false
    return user.name === request.value.created_by
  }

  const fetchRequestDetail = async (id: string) => {
    try {
      request.value = (await apis.getRequestDetail(id)).data
      editedValue.value = {
        created_by: request.value.created_by,
        amount: request.value.amount,
        title: request.value.title,
        content: request.value.content,
        targets: targetIds.value,
        tags: request.value.tags,
        group: request.value.group.id
      }
    } catch {
      toast.error('申請の取得に失敗しました')
    }
  }
  const putRequest = async (id: string, willPutRequest: PostRequest) => {
    try {
      const res = (await apis.putRequestDetail(id, willPutRequest)).data
      request.value = res
      toast.success('申請の修正に成功しました')
    } catch {
      toast.error('申請の修正に失敗しました')
    }
  }

  return {
    request,
    targetIds,
    editedValue,
    isRequestCreater,
    fetchRequestDetail,
    putRequest
  }
})
