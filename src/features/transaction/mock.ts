import { rest } from 'msw'

import type { Transaction } from '/@/lib/apis'

import { mockGroup } from '/@/features/group/mock'
import { mockTag } from '/@/features/tag/mock'

const mockTransaction: Transaction = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  amount: 1200,
  target: 'hoge株式会社',
  request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
  tags: [mockTag],
  group: mockGroup,
  created_at: '2022-02-09T14:03:53.278Z',
  updated_at: '2022-02-09T14:03:53.278Z'
}

export const transactionHandlers = [
  rest.get('/api/transactions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<Transaction[]>(Array(50).fill(mockTransaction))
    )
  }),
  rest.get('/api/transactions/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<Transaction>(mockTransaction))
  }),
  rest.post('/api/transactions', async (req, res, ctx) => {
    // NOTE: tagsの変換が必要なため、reqBodyが使っていない
    return res(ctx.status(200), ctx.json<Transaction[]>([mockTransaction]))
  }),
  rest.put('/api/transactions/:id', async (req, res, ctx) => {
    // NOTE: tagsの変換が必要なため、reqBodyが使っていない
    return res(ctx.status(200), ctx.json<Transaction>(mockTransaction))
  }),
  rest.delete('/api/transactions/:id', (req, res, ctx) => {
    return res(ctx.status(200))
  })
]
