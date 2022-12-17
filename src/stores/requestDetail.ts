import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { PostRequest, User, Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertRequestDetail } from '/@/lib/date'
import type { RequestDetail } from '/@/lib/requestDetailTypes'

interface EditedValue {
  created_by: string
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

  const editMode = ref('')
  const editedValue = ref<EditedValue>({
    created_by: '',
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
      const response = (await apis.getRequestDetail(id)).data

      request.value = convertRequestDetail(response)

      editedValue.value = {
        created_by: request.value.created_by,
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
      const response = (await apis.putRequestDetail(id, willPutRequest)).data

      request.value = convertRequestDetail(response)

      toast.success('申請の修正に成功しました')
    } catch {
      toast.error('申請の修正に失敗しました')
    }
  }

  return {
    request,
    targetIds,
    editMode,
    editedValue,
    isRequestCreater,
    fetchRequestDetail,
    putRequest
  }
})
