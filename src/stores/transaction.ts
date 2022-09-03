import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Transaction } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>()
  const isTransactionFetched = ref(false)

  const fetchTransactions = async (sort: string) => {
    transactions.value = (await apis.getTransactions(sort)).data
    isTransactionFetched.value = true
  }
  return {
    transactions,
    isTransactionFetched,
    fetchTransactions
  }
})
