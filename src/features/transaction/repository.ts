import apis from '/@/lib/apis'

import { convertTransactionFromData } from './converter'
import type {
  Transaction,
  TransactionCreateSeed,
  TransactionEditSeed,
  TransactionQuerySeed
} from './model'

export const useTransactionRepository = () => {
  return createTransactionRepository()
}

const createTransactionRepository = () => ({
  fetchTransactions: async (
    querySeed: TransactionQuerySeed
  ): Promise<Transaction[]> => {
    const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
    if (
      (querySeed.since && !rule.test(querySeed.since)) ||
      (querySeed.until && !rule.test(querySeed.until))
    ) {
      throw new Error('日付はyyyy-MM-ddの形式で入力してください')
    }

    const { data } = await apis.getTransactions(
      querySeed.sort,
      querySeed.target,
      querySeed.since,
      querySeed.until,
      querySeed.tags.join(','),
      querySeed.group,
      querySeed.request
    )

    return data.map(convertTransactionFromData)
  },

  fetchTransaction: async (id: string): Promise<Transaction> => {
    const { data } = await apis.getTransactionDetail(id)

    return convertTransactionFromData(data)
  },

  createTransaction: async (
    transaction: TransactionCreateSeed
  ): Promise<Transaction[]> => {
    const transactionData = {
      amount: transaction.amount,
      targets: transaction.targets,
      request: transaction.request,
      tags: transaction.tags.map(tag => tag.id),
      group: transaction.group
    }
    const { data } = await apis.postTransaction(transactionData)

    return data.map(convertTransactionFromData)
  },

  editTransaction: async (
    id: string,
    transaction: TransactionEditSeed
  ): Promise<Transaction> => {
    const transactionData = {
      amount: transaction.amount,
      target: transaction.target,
      request: transaction.request,
      tags: transaction.tags.map(tag => tag.id),
      group: transaction.group
    }
    const { data } = await apis.putTransactionDetail(id, transactionData)

    return convertTransactionFromData(data)
  }
})
