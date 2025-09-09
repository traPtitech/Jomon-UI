import type { ApplicationStatus } from '/@/features/applicationStatus/model'

import { computed } from 'vue'
import { useApplication } from '/@/features/application/composables'
import type { ApplicationDetail } from '/@/features/application/model'
import { useUserStore } from '/@/stores/user'

export const useStatusOptions = (application: ApplicationDetail) => {
  const { me, isAccountManager } = useUserStore()
  const { isApplicationCreator } = useApplication(application)

  const hasAuthority = isApplicationCreator.value(me.value)

  const showToPendingReview =
    (hasAuthority && application.status === 'change_requested') ||
    (isAccountManager.value &&
      (application.status === 'change_requested' ||
        application.status === 'approved'))
  const showToChangeRequested =
    isAccountManager.value && application.status === 'pending_review'
  const showToApproved =
    isAccountManager.value && application.status === 'pending_review'
  const showToRejected =
    isAccountManager.value && application.status === 'pending_review'

  const statusOptions = computed<
    { value: ApplicationStatus; key: string; show: boolean }[]
  >(() => [
    {
      value: 'pending_review',
      key: '承認待ちにする',
      show: showToPendingReview
    },
    {
      value: 'change_requested',
      key: '要修正にする',
      show: showToChangeRequested
    },
    { value: 'approved', key: '承認する', show: showToApproved },
    { value: 'rejected', key: '却下する', show: showToRejected },
    { value: 'payment_finished', key: '支払い済み', show: showToPendingReview }
  ])
  const showStatusOptions = computed(() =>
    statusOptions.value
      .filter(option => option.show)
      .map(option => ({ value: option.value, key: option.key }))
  )

  return { statusOptions: showStatusOptions }
}
