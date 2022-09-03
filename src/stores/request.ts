import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Request } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface Params {
  sort: string
  currentStatus: string | null
  target: string | null
  since: string
  until: string
  tag:
    | {
        id: string
        name: string
        created_at: string
        updated_at: string
      }[]
    | null
  group: string | null
}

const defaultParams: Params = {
  sort: 'created_at',
  currentStatus: null,
  target: null,
  since: '',
  until: '',
  tag: null,
  group: null
}

export const useRequestStore = defineStore('request', () => {
  const requests = ref<Request[]>()
  const tagList = ref<string[]>([])
  const isRequestFetched = ref(false)

  const fetchRequests = async (tmpParams: Params = defaultParams) => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    const params = { ...tmpParams, tag: '' }
    if (
      (tmpParams.since && !rule.test(tmpParams.since)) ||
      (tmpParams.until && !rule.test(tmpParams.until))
    ) {
      alert('日付が不正です')
      return
    }
    const tmpTagList = tmpParams.tag?.slice() ?? []
    params.tag = tmpTagList.map(tag => tag.id).join(',')
    try {
      requests.value = (
        await apis.getRequests(
          params.sort,
          params.currentStatus || '',
          params.target || '',
          params.since,
          params.until,
          params.tag || '',
          params.group || ''
        )
      ).data
    } catch (err) {
      alert(err)
    }
  }
  return { requests, isRequestFetched, fetchRequests, tagList }
})
