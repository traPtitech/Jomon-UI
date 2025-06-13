import { ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import type { RequestDetail } from '/@/features/request/model'
import { useFetchRequestUsecase } from '/@/features/request/usecase'

export const useRequestDetailStore = defineComposable('requestDetail', () => {
  const request = ref<RequestDetail | null>(null)

  const useRequest = async (id: string) => {
    if (request.value !== null) {
      return request.value
    }
    const newRequest = await useFetchRequestUsecase(id)
    request.value = newRequest
    return newRequest
  }

  return {
    request,
    useRequest
  }
})
