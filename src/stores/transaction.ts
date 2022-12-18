import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { Transaction } from '/@/lib/apiTypes'
import apis from '/@/lib/apis'
import { convertTransaction } from '/@/lib/date'

export interface SearchTransactionParams {
  sort: string
  target: string
  since: string
  until: string
  tags: string[]
  group: string
  request: string
}

export const defaultParams: SearchTransactionParams = {
  sort: 'created_at',
  target: '',
  tags: [],
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
    params: SearchTransactionParams = defaultParams
  ) => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    if (
      (params.since && !rule.test(params.since)) ||
      (params.until && !rule.test(params.until))
    ) {
      toast.warning('日付はyyyy-MM-ddの形式で入力してください')
      return
    }
    try {
      const response = (
        await apis.getTransactions(
          params.sort,
          params.target,
          params.since,
          params.until,
          params.tags.join(','),
          params.group,
          params.request
        )
      ).data
      transactions.value = convertTransaction(response)
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
