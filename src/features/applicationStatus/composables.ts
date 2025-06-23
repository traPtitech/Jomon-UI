import type { ApplicationStatus } from '/@/features/applicationStatus/model'

import { computed } from 'vue'
import { useApplication } from '/@/features/application/composables'
import type { ApplicationDetail } from '/@/features/application/model'
import { useUserStore } from '/@/stores/user'

export const useStatusOptions = (application: ApplicationDetail) => {
  const { me, isAccountManager } = useUserStore()
  const { isApplicationCreator } = useApplication(application)

  const hasAuthority = isApplicationCreator.value(me.value)

  const showToSubmitted =
    (hasAuthority && application.status === 'change_requested') ||
    (isAccountManager.value &&
      (application.status === 'change_requested' ||
        application.status === 'approved'))
  const showToRequired =
    isAccountManager.value && application.status === 'submitted'
  const showToAccepted =
    isAccountManager.value && application.status === 'submitted'
  const showToRejected =
    isAccountManager.value && application.status === 'submitted'

  const statusOptions = computed<
    { value: ApplicationStatus; key: string; show: boolean }[]
  >(() => [
    { value: 'submitted', key: '承認待ちにする', show: showToSubmitted },
    { value: 'change_requested', key: '要修正にする', show: showToRequired },
    { value: 'approved', key: '承認する', show: showToAccepted },
    { value: 'rejected', key: '却下する', show: showToRejected },
    { value: 'payment_finished', key: '支払い済み', show: showToSubmitted }
  ])
  const showStatusOptions = computed(() =>
    statusOptions.value
      .filter(option => option.show)
      .map(option => ({ value: option.value, key: option.key }))
  )

  return { statusOptions: showStatusOptions }
}
