import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { Request as APIRequest } from '/@/lib/apis'
import apis from '/@/lib/apis'

import type { RequestStatus } from '/@/consts/consts'

export interface SearchRequestParams {
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

export interface Request extends Omit<APIRequest, 'created_at' | 'updated_at'> {
  created_at: DateTime
  updated_at: DateTime
}

export const useRequestStore = defineStore('request', () => {
  const toast = useToast()

  const requests = ref<Request[]>()
  const isRequestFetched = ref(false)

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
      requests.value = response.map((request: APIRequest) => {
        return {
          ...request,
          created_at: DateTime.fromISO(request.created_at),
          updated_at: DateTime.fromISO(request.updated_at)
        }
      })
      isRequestFetched.value = true
    } catch {
      toast.error('申請の取得に失敗しました')
    }
  }
  return { requests, isRequestFetched, fetchRequests }
})
