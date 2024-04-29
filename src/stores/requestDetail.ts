import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { RequestDetail, RequestSeed } from '/@/features/request/model'
import type { RequestTarget } from '/@/features/requestTarget/model'
import type { User } from '/@/features/user/model'
import { useFetchRequestUsecase } from '/@/features/request/usecase'

export const useRequestDetailStore = defineStore('requestDetail', () => {
  const request = ref<RequestDetail | null>(null)

  const useRequest = async (id: string) => {
    if (request.value !== null) {
      return request.value
    }
    const newRequest = await useFetchRequestUsecase(id)
    request.value = newRequest
    return newRequest
  }

  const targets = computed((): RequestTarget[] => {
    if (request.value === null) {
      return []
    }
    return request.value.targets.map(target => ({
      target: target.target,
      amount: target.amount
    }))
  })

  const editMode = ref('')
  const editedValue = ref<RequestSeed>({
    createdBy: '',
    title: '',
    content: '',
    targets: [],
    tags: [],
    group: null
  })

  const isRequestCreator = computed(() => (user: User | undefined) => {
    if (!user || request.value === null) return false
    return user.id === request.value.createdBy
  })

  return {
    request,
    useRequest,
    targets,
    editMode,
    editedValue,
    isRequestCreator
  }
})
