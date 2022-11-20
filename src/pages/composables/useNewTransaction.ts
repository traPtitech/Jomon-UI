import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

import type { Tag, Transaction } from '/@/lib/apis'
import apis from '/@/lib/apis'

export type MoneyDirection = 'plus' | 'minus'

export const useNewTransaction = (requestId: string) => {
  const toast = useToast()
  const transactionStore = useTransactionStore()
  const requestDetailStore = useRequestDetailStore()
  const tagStore = useTagStore()

  const { transactions } = storeToRefs(transactionStore)
  const { request, targetIds } = storeToRefs(requestDetailStore)

  const transaction = ref({
    amount: requestId && request.value ? request.value.amount : 0,
    targets: requestId ? targetIds : [],
    request: requestId,
    tags: requestId && request.value ? request.value.tags : [],
    group: requestId && request.value ? request.value.group.id : ''
  })
  const moneyDirection = ref<MoneyDirection>('plus')

  async function postTransaction() {
    if (transaction.value.targets.length === 0) {
      toast.warning('払い戻し対象者は必須です')
      return
    }
    let tags: Tag[]
    try {
      tags = await tagStore.createTagIfNotExist(transaction.value.tags)
    } catch {
      return
    }
    if (moneyDirection.value === 'minus') {
      transaction.value.amount = -transaction.value.amount
    }
    const transactionRequest = {
      ...transaction.value,
      tags: tags.map(tag => tag.id)
    }
    try {
      const response: Transaction[] = (
        await apis.postTransaction(transactionRequest)
      ).data
      if (transactions.value !== undefined) {
        transactions.value = [...response, ...transactions.value]
      } else {
        transactions.value = response
      }
    } catch {
      toast.error('入出金記録の作成に失敗しました')
      return
    }
    toast.success('入出金記録の作成に成功しました')
  }

  return { transaction, moneyDirection, postTransaction }
}
