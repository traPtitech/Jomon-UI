import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { Request } from '/@/lib/apiTypes'
import apis from '/@/lib/apis'
import { convertRequest } from '/@/lib/date'

import type { RequestStatus } from '/@/consts/consts'

interface SearchRequestParams {
  sort: string
  currentStatus: string
  target: string
  since: string
  until: string
  tags: string[]
  group: string
}

export const useRequestStore = defineStore('request', () => {
  const toast = useToast()

  const requests = ref<Request[]>()
  const isRequestFetched = ref(false)

  const filterParams = ref<SearchRequestParams>({
    sort: 'created_at',
    currentStatus: '',
    target: '',
    since: '',
    until: '',
    tags: [],
    group: ''
  })

  const fetchRequests = async () => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    if (
      (filterParams.value.since && !rule.test(filterParams.value.since)) ||
      (filterParams.value.until && !rule.test(filterParams.value.until))
    ) {
      toast.warning('日付はyyyy-MM-ddの形式で入力してください')
      return
    }
    try {
      const response = (
        await apis.getRequests(
          filterParams.value.sort,
          filterParams.value.currentStatus as RequestStatus,
          filterParams.value.target,
          filterParams.value.since,
          filterParams.value.until,
          filterParams.value.tags.join(','),
          filterParams.value.group
        )
      ).data
      requests.value = response.map(request => convertRequest(request))
      isRequestFetched.value = true
    } catch {
      toast.error('申請の取得に失敗しました')
    }
  }
  return { requests, isRequestFetched, filterParams, fetchRequests }
})
