import axios from 'axios'
import { defineStore } from 'pinia'

type Transaction = {
  id: string
  amount: number
  target: string
  request_id: string
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
  created_at: string
}

type Params = {
  sort: string
  request_id: string | null
  target: string | null
  year: number | null
  since: string
  until: string
  tag: string | null
  group: string | null
}

type TransactionRequest = {
  amount: number
  target: string
  request_id: string
  tags: string[]
  group: string
}

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: Array(50).fill({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      amount: 1200,
      target: 'hoge株式会社',
      request_id: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
      tags: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          description: '2020年度講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          description: '2020年度講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          description: '2020年度講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        }
      ],
      group: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'SysAd',
        description: 'SysAd班',
        budget: 250000,
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      },
      created_at: '2022-02-09T14:03:53.278Z',
      updated_at: '2022-02-09T14:03:53.278Z'
    }),
    params: {
      sort: 'created_at',
      target: null,
      year: null,
      since: '',
      until: '',
      tag: null,
      group: null
    } as Params,
    tagList: new Array<string>(),
    isModalOpen: false
  }),
  getters: {
    transactionsLength() {
      return () => this.transactions.length
    },
    transactionsFilter() {
      return (index: number) => {
        return this.transactions.slice((index - 1) * 10, index * 10)
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
    async getTransactions() {
      for (let i = 0; i < this.tagList.length; i++) {
        if (i === 0) {
          this.params.tag = this.tagList[i]
        } else {
          this.params.tag += ',' + this.tagList[i]
        }
      }
      const response: Transaction[] = await axios.get('/api/transactions', {
        params: this.params
      })
      this.transactions = response
    },
    async postTransaction(transaction: TransactionRequest) {
      const response: Transaction = await axios.post(
        '/api/transactions',
        transaction
      )
      this.transactions.unshift(response)
    },
    resetParams() {
      this.params = {
        sort: 'created_at',
        request_id: null,
        target: null,
        year: null,
        since: '',
        until: '',
        tag: null,
        group: null
      }
    }
  }
})
