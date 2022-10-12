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
  const transactions = ref<Transaction[]>()
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
