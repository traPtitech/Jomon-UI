import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import type { RequestDetail } from '/@/features/request/model'
import type { Tag } from '/@/features/tag/model'
import { createTagIfNotExistUsecase } from '/@/features/tag/usecase'
import type { TransactionCreateSeed } from '/@/features/transaction/model'
import { createTransactionUsecase } from '/@/features/transaction/usecase'
import type { RequestTarget } from '/@/features/requestTarget/model'
import { storeToRefs } from 'pinia'
import { useUserStore } from '/@/stores/user'

export type MoneyDirection = 'toTraP' | 'fromTraP'

export const useNewTransaction = () => {
  const toast = useToast()
  const router = useRouter()
  const userStore = useUserStore()
  const { userMap } = storeToRefs(userStore)

  const isSending = ref(false)

  const transaction = reactive<TransactionCreateSeed>({
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
      tags = await createTagIfNotExistUsecase(transaction.tags)
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
      tags
    }
    try {
      await createTransactionUsecase(willPostTransaction)
      toast.success('入出金記録を作成しました')
    } catch {
      toast.error('入出金記録の作成に失敗しました')
    }
    isSending.value = false
  }

  const postTransactionFromRequest = async (
    request: RequestDetail,
    target: RequestTarget
  ) => {
    const result = confirm(
      `この申請に紐づけて@${
        userMap.value[target.target]
      }の入出金記録を作成しますか？`
    )
    if (!result) return
    isSending.value = true
    const willPostTransaction = {
      amount: target.amount,
      targets: [target.target],
      tags: request.tags,
      group: request.group?.id ?? null,
      request: request.id
    }
    let transactionId
    try {
      transactionId = await createTransactionUsecase(willPostTransaction)
      toast.success('入出金記録を作成しました')
    } catch {
      toast.error('入出金記録の作成に失敗しました')
    }
    isSending.value = false
    router.push(`/transactions/${transactionId}`)
  }

  return {
    isSending,
    transaction,
    moneyDirection,
    postTransaction,
    postTransactionFromRequest
  }
}
