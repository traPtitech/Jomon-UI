import type { RequestStatus } from '/@/features/requestStatus/model'

import { storeToRefs } from 'pinia'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'
import type { RequestDetail } from '/@/features/request/model'
import { computed } from 'vue'

export const useStatusOptions = (request: RequestDetail) => {
  const userStore = useUserStore()
  const requestDetailStore = useRequestDetailStore()
  const { isRequestCreator } = requestDetailStore

  const { me, isAdmin } = storeToRefs(userStore)
  const hasAuthority = isRequestCreator(me.value)

  const showToSubmitted =
    (hasAuthority && request.status === 'fix_required') ||
    (isAdmin.value &&
      (request.status === 'fix_required' || request.status === 'accepted'))
  const showToRequired = isAdmin.value && request.status === 'submitted'
  const showToAccepted = isAdmin.value && request.status === 'submitted'
  const showToRejected = isAdmin.value && request.status === 'submitted'

  const statusOptions = computed<
    { value: RequestStatus; key: string; show: boolean }[]
  >(() => [
    { value: 'submitted', key: '承認待ちにする', show: showToSubmitted }, //TODO: 表示するべきか確認
    { value: 'rejected', key: '却下する', show: showToRejected },
    { value: 'fix_required', key: '要修正にする', show: showToRequired },
    { value: 'accepted', key: '承認する', show: showToAccepted }
  ])
  const showStatusOptions = computed(() =>
    statusOptions.value
      .filter(option => option.show)
      .map(option => ({ value: option.value, key: option.key }))
  )

  return { statusOptions: showStatusOptions.value }
}
