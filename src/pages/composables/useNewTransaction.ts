import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

import type { Tag, Transaction as APITransaction } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertTransaction } from '/@/lib/date'

export type MoneyDirection = 'toTraP' | 'fromTraP'

interface NewTransaction {
  amount: number
  targets: string[]
  request: string | null
  tags: Tag[]
  group: string | null
}

export const useNewTransaction = (requestId: string) => {
  const toast = useToast()
  const transactionStore = useTransactionStore()
  const requestDetailStore = useRequestDetailStore()
  const tagStore = useTagStore()

  const { transactions } = storeToRefs(transactionStore)
  const { request, targets } = storeToRefs(requestDetailStore)

  const totalAmount =
    request.value?.targets.reduce((a, target) => a + target.amount, 0) ?? 0

  const transaction = reactive<NewTransaction>(
    requestId !== ''
      ? {
          amount: totalAmount,
          targets: targets.value.map(target => target.target),
          request: requestId,
          tags: request.value?.tags ?? [],
          group: request.value?.group.id ?? null
        }
      : {
          amount: 0,
          targets: [],
          request: null,
          tags: [],
          group: null
        }
  )
  const moneyDirection = ref<MoneyDirection>('toTraP')

  const postTransaction = async () => {
    if (transaction.targets.length === 0) {
      toast.warning('払い戻し対象者は必須です')
      return
    }
    let tags: Tag[]
    try {
      tags = await tagStore.createTagIfNotExist(transaction.tags)
    } catch {
      return
    }
    const willPostTransaction = {
      ...transaction,
      amount:
        moneyDirection.value === 'fromTraP'
          ? -transaction.amount
          : transaction.amount,
      tags: tags.map(tag => tag.id),
      group: transaction.group
    }
    try {
      const response: APITransaction[] = (
        await apis.postTransaction(willPostTransaction)
      ).data
      const newTransactions = response.map(transaction =>
        convertTransaction(transaction)
      )
      if (transactions.value) {
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
