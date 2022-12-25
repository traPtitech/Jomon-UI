import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useTagStore } from '/@/stores/tag'

import type { Transaction } from '/@/lib/apiTypes'
import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { convertTransaction } from '/@/lib/date'

export type MoneyDirection = 'toTraP' | 'fromTraP'

interface EditedValue {
  amount: number
  target: string
  request: string | null
  tags: Tag[]
  group: string
}

export const useEditTransaction = (transaction: Transaction) => {
  const toast = useToast()
  const tagStore = useTagStore()

  const editedValue = ref<EditedValue>({
    amount: transaction.amount,
    target: transaction.target,
    request: transaction.request,
    tags: transaction.tags,
    group: transaction.group.id
  })
  const moneyDirection = ref<MoneyDirection>('toTraP')

  const putTransaction = async (
    emit: (e: 'edited', value: Transaction | undefined) => void
  ) => {
    let tags: Tag[]
    try {
      tags = await tagStore.createTagIfNotExist(editedValue.value.tags)
    } catch {
      return
    }
    const willSendTransaction = {
      ...editedValue.value,
      amount:
        moneyDirection.value === 'toTraP'
          ? editedValue.value.amount
          : -editedValue.value.amount,
      tags: tags.map(tag => tag.id),
      group: editedValue.value.group !== '' ? editedValue.value.group : null
    }
    try {
      const response = (
        await apis.putTransactionDetail(transaction.id, willSendTransaction)
      ).data
      const nextTransaction = convertTransaction(response)
      emit('edited', nextTransaction)
    } catch {
      toast.error('入出金記録の修正に失敗しました')
      emit('edited', undefined)
    }
  }

  return { editedValue, moneyDirection, putTransaction }
}
