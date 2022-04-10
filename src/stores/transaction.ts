import axios from 'axios'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Transaction, PostTransaction } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>(
    Array(100).fill({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      amount: 1200,
      target: 'hoge株式会社',
      request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
      tags: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2020講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2021講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2021講習会',
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2021講習会',
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
    })
  )
  const params = ref({
    sort: 'created_at',
    request: '',
    target: '',
    since: '',
    until: '',
    tag: '',
    group: ''
  })
  const isTargetSearchOpen = ref<boolean>(false)

  const transactionsLength = computed(() => {
    return transactions.value.length
  })
  const transactionsFilter = (index: number) => {
    return transactions.value.slice((index - 1) * 10, index * 10)
  }

  const getTransactions = async () => {
    // for (let i = 0; i < this.tagList.length; i++) {
    //   if (i === 0) {
    //     this.params.tag = this.tagList[i]
    //   } else {
    //     this.params.tag += ',' + this.tagList[i]
    //   }
    // }
    transactions.value = (
      await apis.getRequests(
        params.value.sort,
        params.value.target,
        params.value.since,
        params.value.until,
        params.value.tag,
        params.value.group,
        params.value.request
      )
    ).data
  }
  const postTransaction = async (transaction: PostTransaction) => {
    const res = (await apis.postTransaction(transaction)).data
    transactions.value.unshift(res)
  }
  function resetParams() {
    params.value = {
      sort: 'created_at',
      request: '',
      target: '',
      since: '',
      until: '',
      tag: '',
      group: ''
    }
  }

  return {
    transactions,
    transactionsLength,
    transactionsFilter,
    isTargetSearchOpen,
    params,
    getTransactions,
    postTransaction,
    resetParams
  }
})
