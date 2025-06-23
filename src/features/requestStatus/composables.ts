import type { ApplicationStatus } from '/@/features/requestStatus/model'

import { computed } from 'vue'
import { useRequest } from '/@/features/request/composables'
import type { ApplicationDetail } from '/@/features/request/model'
import { useUserStore } from '/@/stores/user'

export const useStatusOptions = (request: ApplicationDetail) => {
  const { me, isAccountManager } = useUserStore()
  const { isRequestCreator } = useRequest(request)

  const hasAuthority = isRequestCreator.value(me.value)

  const showToSubmitted =
    (hasAuthority && request.status === 'change_requested') ||
    (isAccountManager.value &&
      (request.status === 'change_requested' || request.status === 'approved'))
  const showToRequired =
    isAccountManager.value && request.status === 'submitted'
  const showToAccepted =
    isAccountManager.value && request.status === 'submitted'
  const showToRejected =
    isAccountManager.value && request.status === 'submitted'

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
