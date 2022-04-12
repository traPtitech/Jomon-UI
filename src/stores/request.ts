import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Params } from '../types/requestsTypes'
import type { Request } from '/@/lib/apis'
import apis from '/@/lib/apis'

const defaultParams = {
  sort: 'created_at',
  currentStatus: null,
  target: null,
  since: '',
  until: '',
  tag: null,
  group: null
}

export const useRequestStore = defineStore('request', () => {
  const requests = ref<Request[]>(
    Array(100).fill({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      status: 'submitted',
      created_at: '2022-01-25T13:29:19.918Z',
      updated_at: '2022-01-25T13:29:19.918Z',
      created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      amount: 1200,
      title: 'SysAd講習会の開催費用',
      tags: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2021講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2022講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        }
      ],
      group: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'SysAd',
        description: 'SysAd班',
        budget: 250000,
        created_at: '2022-01-25T13:29:19.918Z',
        updated_at: '2022-01-25T13:29:19.918Z'
      }
    })
  )
  const tagList = ref<string[]>([])

  const requestsFilter = (index: number) => {
    return requests.value.slice((index - 1) * 7, index * 7)
  }
  const fetchRequests = async (params: Params = defaultParams) => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    if (
      (params.since === '' && rule.test(params.until)) ||
      (params.until === '' && rule.test(params.since)) ||
      (rule.test(params.since) && rule.test(params.until)) ||
      (params.since === '' && params.until === '')
    ) {
      for (let i = 0; i < tagList.value.length; i++) {
        if (i === 0) {
          params.tag = tagList.value[i]
        } else {
          params.tag += ',' + tagList.value[i]
        }
      }
      requests.value = (
        await apis.getRequests(
          params.sort,
          params.currentStatus!,
          params.target!,
          params.since,
          params.until,
          params.tag!,
          params.group!
        )
      ).data //nullの場合どうにかする
    } else {
      alert('日付が不正です')
    }
  }
  return { requests, requestsFilter, fetchRequests, tagList }
})
