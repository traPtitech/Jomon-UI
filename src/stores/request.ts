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
  content: string
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
  current_state: string
  year: string
  target: string
  type: string
  since: string
  until: string
  tag: string
  group: string
}

export const useRequestStore = defineStore('request', {
  state: () => ({
    requests: new Array<Request>()
  }),
  getters: {
    dateFormatter() {
      return (date: string) => {
        date.split('T')[0].split('-')[0] +
          '年' +
          date.split('T')[0].split('-')[1] +
          '月' +
          date.split('T')[0].split('-')[2] +
          '日'
      }
    }
  },
  actions: {
    async getRequests(params: Params) {
      const response: Request[] = await axios.get('/api/requests', { params })
      this.requests = response
    }
  }
})
