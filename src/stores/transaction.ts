import { defineStore } from 'pinia'
import { ref } from 'vue'

import type {
  Transaction,
  TransactionQuerySeed
} from '/@/features/transaction/model'

export const defaultParams: TransactionQuerySeed = {
  sort: 'created_at',
  target: '',
  tags: [],
  since: '',
  until: '',
  group: '',
  request: ''
}

export const directionOptions = [
  {
    key: 'traPへ入金',
    value: 'toTraP'
  },
  {
    key: 'traPから出金',
    value: 'fromTraP'
  }
]

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const isTransactionFetched = ref(false)

  const filterParams = ref<TransactionQuerySeed>({
    sort: 'created_at',
    target: '',
    since: '',
    until: '',
    group: '',
    tags: [],
    request: ''
  })

  return {
    transactions,
    isTransactionFetched,
    filterParams
  }
})
