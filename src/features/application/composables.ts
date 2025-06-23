import { computed } from 'vue'
import type { ApplicationDetail } from './model'
import type { User } from '/@/features/user/model'

export const useApplication = (application: ApplicationDetail) => {
  const isApplicationCreator = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.id === application.createdBy
  })

  return { isApplicationCreator }
}
