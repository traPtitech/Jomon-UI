import { useTransactionStore } from '/@/stores/transaction'

import type {
  TransactionCreateSeed,
  TransactionEditSeed
} from '/@/features/transaction/model'

import { useTransactionRepository } from './repository'

export const useFetchTransactionsUsecase = async () => {
  const repository = useTransactionRepository()
  const { transactions, isTransactionFetched, filterParams } =
    useTransactionStore()

  const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
  if (
    (filterParams.value.since && !rule.test(filterParams.value.since)) ||
    (filterParams.value.until && !rule.test(filterParams.value.until))
  ) {
    throw new Error('日付はyyyy-MM-ddの形式で入力してください')
  }

  try {
    transactions.value = await repository.fetchTransactions(filterParams.value)
    isTransactionFetched.value = true
  } catch {
    throw new Error('入出金記録一覧の取得に失敗しました')
  }
}

export const useFetchTransactionUsecase = async (id: string) => {
  const repository = useTransactionRepository()

  try {
    return await repository.fetchTransaction(id)
  } catch {
    throw new Error('入出金記録の取得に失敗しました')
  }
}

export const createTransactionUsecase = async (
  transaction: TransactionCreateSeed
) => {
  const repository = useTransactionRepository()
  const { transactions } = useTransactionStore()

  try {
    const res = await repository.createTransaction(transaction)
    transactions.value.unshift(...res)

    return res
  } catch {
    throw new Error('入出金記録の作成に失敗しました')
  }
}

export const editTransactionUsecase = async (
  id: string,
  transactionSeed: TransactionEditSeed
) => {
  const repository = useTransactionRepository()

  try {
    return await repository.editTransaction(id, transactionSeed)
  } catch {
    throw new Error('入出金記録の更新に失敗しました')
  }
}
