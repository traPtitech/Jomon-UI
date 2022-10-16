import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { Transaction } from '/@/lib/apis'
import apis from '/@/lib/apis'

export interface SearchTransactionParams {
  sort: string
  target: string
  since: string
  until: string
  tag: string[]
  group: string
  request: string
}

export const defaultParams: SearchTransactionParams = {
  sort: 'created_at',
  target: '',
  tag: [],
  since: '',
  until: '',
  group: '',
  request: ''
}

export const useTransactionStore = defineStore('transaction', () => {
  const toast = useToast()

  const transactions = ref<Transaction[]>()
  const isTransactionFetched = ref(false)

  const fetchTransactions = async (
    tmpParams: SearchTransactionParams = defaultParams
  ) => {
    const params = { ...tmpParams, tag: '' }
    if (tmpParams.tag.length > 0) {
      params.tag = tmpParams.tag.join(',')
    }
    try {
      transactions.value = (
        await apis.getTransactions(
          params.sort,
          params.target,
          params.since,
          params.until,
          params.tag,
          params.group,
          params.request
        )
      ).data
      isTransactionFetched.value = true
    } catch {
      toast.error('入出金記録の取得に失敗しました')
    }
  }
  return {
    transactions,
    isTransactionFetched,
    fetchTransactions
  }
})
