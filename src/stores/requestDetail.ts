import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { RequestDetail, RequestSeed } from '/@/features/request/model'
import type { RequestTarget } from '/@/features/requestTarget/model'
import type { User } from '/@/features/user/model'

export const useRequestDetailStore = defineStore('requestDetail', () => {
  const request = ref<RequestDetail>()

  const targets = computed((): RequestTarget[] => {
    if (request.value === undefined) {
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
    if (!user || request.value === undefined) return false
    return user.id === request.value.createdBy
  })

  return {
    request,
    targets,
    editMode,
    editedValue,
    isRequestCreator
  }
})
