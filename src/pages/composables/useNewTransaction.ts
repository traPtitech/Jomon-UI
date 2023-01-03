import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useTagStore } from '/@/stores/tag'
import { useTransactionStore } from '/@/stores/transaction'

import type { RequestDetail } from '/@/lib/apiTypes'
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

export const useNewTransaction = () => {
  const toast = useToast()
  const transactionStore = useTransactionStore()
  const tagStore = useTagStore()
  const { createTagIfNotExist } = tagStore
  const { transactions } = storeToRefs(transactionStore)

  const isSending = ref(false)

  const transaction = reactive<NewTransaction>({
    amount: 0,
    targets: [''],
    request: null,
    tags: [],
    group: null
  })
  const moneyDirection = ref<MoneyDirection>('toTraP')

  const postTransaction = async () => {
    if (transaction.targets.length === 0) {
      toast.warning('取引相手は必須です')
      return
    }
    isSending.value = true
    let tags: Tag[]
    try {
      tags = await createTagIfNotExist(transaction.tags)
    } catch {
      toast.error('新規タグの作成に失敗しました')
      isSending.value = false
      return
    }
    const willPostTransaction = {
      ...transaction,
      amount:
        moneyDirection.value === 'fromTraP'
          ? -transaction.amount
          : transaction.amount,
      tags: tags.map(tag => tag.id)
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
      toast.success('入出金記録を作成しました')
    } catch {
      toast.error('入出金記録の作成に失敗しました')
    }
    isSending.value = false
  }

  const postTransactionFromRequest = async (request: RequestDetail) => {
    const result = confirm('この申請に紐づけて入出金記録を作成しますか？')
    if (!result) return
    isSending.value = true
    const promises: ReturnType<typeof apis.postTransaction>[] =
      request.targets.map(target => {
        const willPostTransaction = {
          amount: target.amount,
          targets: [target.target],
          tags: request.tags.map(tag => tag.id),
          group: request.group.id,
          request: request.id
        }
        return apis.postTransaction(willPostTransaction)
      })
    try {
      const response = (await Promise.all(promises)).map(res => res.data)
      const newTransactions = response.map(transactions =>
        convertTransaction(transactions[0])
      )
      if (transactions.value) {
        transactions.value = [...newTransactions, ...transactions.value]
      } else {
        transactions.value = newTransactions
      }
      toast.success('入出金記録を作成しました')
    } catch {
      toast.error('入出金記録の作成に失敗しました')
    }
    isSending.value = false
  }

  return {
    isSending,
    transaction,
    moneyDirection,
    postTransaction,
    postTransactionFromRequest
  }
}
