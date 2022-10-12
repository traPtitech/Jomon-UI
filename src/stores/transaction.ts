import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Transaction } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface Params {
  sort: string
  target: string | null
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
  target: null,
  tag: null,
  group: null
}

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>(
    Array(50)
      .fill({} as Transaction)
      .map((_, i) =>
        i % 2 === 0
          ? {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              amount: 1200,
              target: 'hoge株式会社',
              request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
              tags: [
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2020講習会',
                  description: '2020年度講',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2020講習会',
                  description: '2020年度講習会ああああああ',
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
                  description: '2020年度講習会sssssssssssss',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2021講習会',
                  description: '2020年度講',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2021講習会',
                  description: '2020年度講',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2021講習会',
                  description: '2020年度講',
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
            }
          : {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              amount: -1200,
              target: 'hoge株式会社',
              request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
              tags: [
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2020講習会',
                  description: '2020年度講',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2020講習会',
                  description: '2020年度講習会ああああああ',
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
                  description: '2020年度講習会sssssssssssss',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2021講習会',
                  description: '2020年度講',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2021講習会',
                  description: '2020年度講',
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                },
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: '2021講習会',
                  description: '2020年度講',
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
            }
      )
  )
  const isTransactionFetched = ref(false)

  const fetchTransactions = async (tmpParams: Params = defaultParams) => {
    const params = { ...tmpParams, tag: '' }
    const tmpTagList = tmpParams.tag?.slice() || []
    for (let i = 0; i < tmpTagList.length; i++) {
      if (i === 0) {
        params.tag = tmpTagList[i].id
      } else {
        params.tag += ',' + tmpTagList[i].id
      }
    }
    try {
      transactions.value = (
        await apis.getTransactions(
          params.sort,
          params.target || '',
          params.tag || '',
          params.group || ''
        )
      ).data
      isTransactionFetched.value = true
    } catch (err: any) {
      alert(err.message)
    }
  }
  return {
    transactions,
    isTransactionFetched,
    fetchTransactions
  }
})
