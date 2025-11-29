import { computed } from 'vue'

import type { User } from '@/features/user/entities'

import type { ApplicationDetail } from './entities'

export const useApplication = (application: ApplicationDetail) => {
  const isApplicationCreator = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.id === application.createdBy
  })

  return { isApplicationCreator }
}
