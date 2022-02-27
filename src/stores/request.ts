import axios from 'axios'
import { defineStore } from 'pinia'

type Request = {
  id: string
  status: string
  created_at: string
  updated_at: string
  created_by: string
  amount: number
  title: string
  tags: {
    id: string
    name: string
    description: string
    created_at: string
    updated_at: string
  }[]
  group: {
    id: string
    name: string
    description: string
    budget: number
    created_at: string
    updated_at: string
  }
}

type Params = {
  sort: string
  current_state: string | null
  target: string | null
  since: string
  until: string
  tag: string | null
  group: string | null
}

type RequestRequest = {
  created_by: string
  amount: number
  title: string
  comment: string
  tags: string[]
  group: string
}

export const useRequestStore = defineStore('request', {
  state: () => ({
    requests: Array(43).fill({
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
    }), //new Array<Request>()
    params: {
      //storeじゃなくてよさそう
      sort: 'created_at',
      current_state: null,
      target: null,
      since: '',
      until: '',
      tag: null,
      group: null
    } as Params,
    tagList: new Array<string>(),
    isModalOpen: false
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
    async getRequests() {
      for (let i = 0; i < this.tagList.length; i++) {
        if (i === 0) {
          this.params.tag = this.tagList[i]
        } else {
          this.params.tag += ',' + this.tagList[i]
        }
      }
      const response: Request[] = await axios.get('/api/requests', {
        params: this.params
      })
      this.requests = response
    },
    async postRequest(request: RequestRequest) {
      const response: Request = await axios.post('/api/requests', request)
      this.requests.unshift(response)
    },
    resetParams() {
      this.params = {
        sort: 'created_at',
        current_state: null,
        target: null,
        since: '',
        until: '',
        tag: null,
        group: null
      }
    }
  }
})
