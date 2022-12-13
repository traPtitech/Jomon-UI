import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'
import type { Transaction } from '/@/stores/transaction'

import type { Tag, Transaction as APITransaction } from '/@/lib/apis'
import apis from '/@/lib/apis'

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
    const transactionRequest = {
      ...transaction.value,
      tags: tags.map(tag => tag.id)
    }
    try {
      const response: APITransaction[] = (
        await apis.postTransaction(transactionRequest)
      ).data
      const newTransactions: Transaction[] = response.map(
        (transaction: APITransaction) => {
          return {
            ...transaction,
            created_at: DateTime.fromISO(transaction.created_at),
            updated_at: DateTime.fromISO(transaction.updated_at)
          }
        }
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

  return { transaction, postTransaction }
}
