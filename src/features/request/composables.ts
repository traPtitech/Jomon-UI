import { computed } from 'vue'
import type { ApplicationDetail } from './model'
import type { User } from '/@/features/user/model'

export const useRequest = (application: ApplicationDetail) => {
  const isRequestCreator = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.id === application.createdBy
  })

  return { isRequestCreator }
}
