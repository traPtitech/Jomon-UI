import { DateTime } from 'luxon'

import type { Transaction as TransactionData } from '/@/lib/apis'

import { convertGroupFromData } from '/@/features/group/converter'

import type { Transaction } from './model'

export const convertTransactionFromData = (
  transaction: TransactionData
): Transaction => ({
  id: transaction.id,
  title: transaction.title ?? '',
  amount: transaction.amount,
  target: transaction.target,
  request: transaction.request,
  tags: transaction.tags !== null ? transaction.tags : [],
  group:
    transaction.group !== null ? convertGroupFromData(transaction.group) : null,
  createdAt: DateTime.fromISO(transaction.created_at)
})
