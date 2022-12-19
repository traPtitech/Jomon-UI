import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

import type { Tag, Transaction as APITransaction } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertTransaction } from '/@/lib/date'

export type MoneyDirection = 'toTraP' | 'fromTraP'

export const useNewTransaction = (requestId: string) => {
  const toast = useToast()
  const transactionStore = useTransactionStore()
  const requestDetailStore = useRequestDetailStore()
  const tagStore = useTagStore()

  const { transactions } = storeToRefs(transactionStore)
  const { request, targets } = storeToRefs(requestDetailStore)

  const totalAmount =
    request.value?.targets.reduce((a, target) => a + target.amount, 0) ?? 0

  const transaction = ref({
    amount: requestId ? totalAmount : 0,
    targets: requestId ? targets.value.map(target => target.target) : [],
    request: requestId,
    tags: requestId && request.value ? request.value.tags : [],
    group: requestId && request.value ? request.value.group.id : ''
  })
  const moneyDirection = ref<MoneyDirection>('toTraP')

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
    if (moneyDirection.value === 'fromTraP') {
      transaction.value.amount = -transaction.value.amount
    }
    const transactionRequest = {
      ...transaction.value,
      tags: tags.map(tag => tag.id),
      group: transaction.value.group !== '' ? transaction.value.group : null
    }
    try {
      const response: APITransaction[] = (
        await apis.postTransaction(transactionRequest)
      ).data
      const newTransactions = response.map(transaction =>
        convertTransaction(transaction)
      )
      if (transactions.value !== undefined) {
        transactions.value = [...newTransactions, ...transactions.value]
      } else {
        transactions.value = newTransactions
      }
    } catch {
      toast.error('入出金記録の作成に失敗しました')
      return
    }
    toast.success('入出金記録の作成に成功しました')
  }

  return { transaction, moneyDirection, postTransaction }
}
