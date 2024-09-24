import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import apis from '/@/lib/apis'

import type { Tag } from '/@/features/tag/model'
import { createTagIfNotExistUsecase } from '/@/features/tag/usecase'
import type {
  Transaction,
  TransactionEditSeed
} from '/@/features/transaction/model'
import { editTransactionUsecase } from '/@/features/transaction/usecase'

export type MoneyDirection = 'toTraP' | 'fromTraP'

export const useEditTransaction = (transaction: Transaction) => {
  const toast = useToast()

  const isSending = ref(false)

  const editedValue = ref<TransactionEditSeed>({
    amount: transaction.amount,
    target: transaction.target,
    request: transaction.request,
    tags: transaction.tags,
    group: transaction.group?.id ?? null
  })
  const moneyDirection = ref<MoneyDirection>('toTraP')
  const linkedRequest = ref(
    transaction.request
      ? `https://jomon.trap.jp/requests/${transaction.request}`
      : ''
  )

  const finishEditing = async (
    emit: (e: 'finishEditing', value: Transaction) => void
  ) => {
    isSending.value = true
    let tags: Tag[]
    try {
      tags = await createTagIfNotExistUsecase(editedValue.value.tags)
    } catch {
      toast.error('新規タグの作成に失敗しました')
      isSending.value = false
      return
    }
    const willPutTransaction = {
      ...editedValue.value,
      amount:
        moneyDirection.value === 'toTraP'
          ? editedValue.value.amount
          : -editedValue.value.amount,
      tags
    }
    try {
      const res = await editTransactionUsecase(
        transaction.id,
        willPutTransaction
      )
      toast.success('入出金記録を更新しました')
      emit('finishEditing', res)
    } catch {
      toast.error('入出金記録の修正に失敗しました')
    }
    isSending.value = false
  }

  //TODO:サーバーで上書きしてもらう
  const updateLinkedRequest = async (
    requestURL: string,
    emit: (e: 'finishEditing', value: Transaction) => void
  ) => {
    const requestID = requestURL.split('/').pop() ?? ''
    try {
      await apis.getRequestDetail(requestID)
    } catch {
      toast.error('URLが不正です')
      return
    }
    if (
      !/^https:\/\/jomon.trap.jp\/requests\/[a-f0-9-]{36}$/.test(requestURL)
    ) {
      toast.error('URLが不正です')
      return
    }
    const result = confirm(
      '紐づけている申請を変更すると、入出金記録の情報が新たに紐づける申請の情報で上書きされます。よろしいですか？'
    )
    if (!result) return
    isSending.value = true
    try {
      const willPutTransaction = {
        ...transaction,
        group: transaction.group?.id ?? null
      }
      const res = await editTransactionUsecase(transaction.id, {
        ...willPutTransaction,
        request: requestID
      })
      toast.success('紐づいている申請を更新しました')
      emit('finishEditing', res)
    } catch {
      toast.error('紐づいている申請の更新に失敗しました')
    }
    isSending.value = false
  }

  const unlinkRequest = async (
    emit: (e: 'finishEditing', value: Transaction) => void
  ) => {
    const result = confirm('本当に申請との紐づけを解除しますか？')
    if (!result) return
    isSending.value = true
    try {
      const willPutTransaction = {
        ...transaction,
        group: transaction.group?.id ?? null
      }
      const res = await editTransactionUsecase(transaction.id, {
        ...willPutTransaction,
        request: null
      })
      toast.success('紐づけを解除しました')
      emit('finishEditing', res)
    } catch {
      toast.error('紐づけの解除に失敗しました')
    }
    isSending.value = false
  }

  return {
    isSending,
    editedValue,
    moneyDirection,
    linkedRequest,
    finishEditing,
    updateLinkedRequest,
    unlinkRequest
  }
}
