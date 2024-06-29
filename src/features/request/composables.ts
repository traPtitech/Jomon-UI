import { computed } from 'vue'
import type { RequestDetail } from '/@/features/request/model'
import type { User } from '/@/features/user/model'

export const useRequest = (request: RequestDetail) => {
  const isRequestCreator = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.id === request.createdBy
  })

  return { isRequestCreator }
}
