import axios from 'axios'
import { defineStore } from 'pinia'

import { Params, Request, RequestResponse } from '../types/requestsTypes'

const defaultParams = {
  sort: 'created_at',
  current_state: null,
  target: null,
  since: '',
  until: '',
  tag: null,
  group: null
}

export const useRequestStore = defineStore('request', {
  state: () => ({
    requests: Array(100).fill({
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
          description: '2021年度講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2022講習会',
          description: '2022年度講習会',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          description: '2020年度講習会',
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
    }), //new Array<RequestResponse>()
    tagList: new Array<string>()
  }),
  getters: {
    requestsLength() {
      return () => this.requests.length
    },
    requestsFilter() {
      return (index: number) => {
        return this.requests.slice((index - 1) * 7, index * 7)
      }
    },
    dateFormatter() {
      return (date: string) => {
        return (
          date.split('-')[0] +
          '年' +
          date.split('-')[1] +
          '月' +
          date.split('-')[2].split('T')[0] +
          '日'
        )
      }
    }
  },
  actions: {
    async getRequests(params: Params = defaultParams) {
      const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
      if (
        (params.since === '' && rule.test(params.until)) ||
        (params.until === '' && rule.test(params.since)) ||
        (rule.test(params.since) && rule.test(params.until)) ||
        (params.since === '' && params.until === '')
      ) {
        for (let i = 0; i < this.tagList.length; i++) {
          if (i === 0) {
            params.tag = this.tagList[i]
          } else {
            params.tag += ',' + this.tagList[i]
          }
        }
        const response: RequestResponse[] = await axios.get('/api/requests', {
          params: params
        })
        this.requests = response
      } else {
        alert('日付が不正です')
      }
    },
    async postRequest(request: Request) {
      const response: RequestResponse = await axios.post(
        '/api/requests',
        request
      )
      this.getRequests()
      return response.id
    }
  }
})