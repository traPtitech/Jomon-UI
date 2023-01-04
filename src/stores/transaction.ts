import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import type { Transaction } from '/@/lib/apiTypes'
import apis from '/@/lib/apis'
import { convertTransaction } from '/@/lib/date'
import { toId } from '/@/lib/parseQueryParams'

interface SearchTransactionParams {
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
  const toast = useToast()
  const route = useRoute()

  const transactions = ref<Transaction[]>()
  const isTransactionFetched = ref(false)

  const groupId = computed(() => toId(route.query.group))
  const requestId = computed(() => toId(route.query.request))
  const filterParams = ref<SearchTransactionParams>({
    sort: 'created_at',
    target: '',
    since: '',
    until: '',
    group: '',
    tags: [],
    request: ''
  })
  watch([groupId, requestId], () => {
    filterParams.value.group = groupId.value
    filterParams.value.request = requestId.value
  })

  const fetchTransactions = async () => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    if (
      (filterParams.value.since && !rule.test(filterParams.value.since)) ||
      (filterParams.value.until && !rule.test(filterParams.value.until))
    ) {
      toast.warning('日付はyyyy-MM-ddの形式で入力してください')
      return
    }
    try {
      const response = (
        await apis.getTransactions(
          filterParams.value.sort,
          filterParams.value.target,
          filterParams.value.since,
          filterParams.value.until,
          filterParams.value.tags.join(','),
          filterParams.value.group,
          filterParams.value.request
        )
      ).data
      transactions.value = response.map(transaction =>
        convertTransaction(transaction)
      )
      isTransactionFetched.value = true
    } catch {
      toast.error('入出金記録の取得に失敗しました')
    }
  }
  return {
    transactions,
    isTransactionFetched,
    filterParams,
    fetchTransactions
  }
})
