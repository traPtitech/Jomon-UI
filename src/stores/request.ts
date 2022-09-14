import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Status } from '/@/consts/consts'
import type { Request } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface Params {
  sort: string
  currentStatus: string
  target: string
  since: string
  until: string
  tags: string[]
  group: string
}

const defaultParams: Params = {
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  tags: [],
  group: ''
}

export const useRequestStore = defineStore('request', () => {
  const requests = ref<Request[]>()
  const isRequestFetched = ref(false)

  const fetchRequests = async (params: Params = defaultParams) => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    if (
      (params.since && !rule.test(params.since)) ||
      (params.until && !rule.test(params.until))
    ) {
      alert('日付が不正です')
      return
    }
    try {
      requests.value = (
        await apis.getRequests(
          params.sort,
          params.currentStatus as Status,
          params.target,
          params.since,
          params.until,
          params.tags.join(','),
          params.group
        )
      ).data
    } catch (err) {
      alert(err)
    }
  }
  return { requests, isRequestFetched, fetchRequests }
})
