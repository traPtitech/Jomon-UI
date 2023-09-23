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

const defaultParams: SearchRequestParams = {
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  tags: [],
  group: ''
}

export const useRequestStore = defineStore('request', () => {
  const toast = useToast()

  const requests = ref<Request[]>([])
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

  const fetchRequests = async (params: SearchRequestParams = defaultParams) => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    if (
      (params.since && !rule.test(params.since)) ||
      (params.until && !rule.test(params.until))
    ) {
      toast.warning('日付はyyyy-MM-ddの形式で入力してください')
      return
    }
    try {
      const response = (
        await apis.getRequests(
          params.sort,
          params.currentStatus as RequestStatus,
          params.target,
          params.since,
          params.until,
          params.tags.join(','),
          params.group
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
