import { HttpResponse, http } from 'msw'

import type { Transaction } from '/@/lib/apis'

import { mockGroup } from '/@/features/group/mock'
import { mockTags } from '/@/features/tag/mock'

const mockTransaction: Transaction = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'モックタイトル',
  amount: 1200,
  target: 'hoge株式会社',
  request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
  tags: mockTags,
  group: mockGroup,
  created_at: '2022-02-09T14:03:53.278Z',
  updated_at: '2022-02-09T14:03:53.278Z'
}

export const transactionHandlers = [
  http.get('/api/transactions', () => {
    const res: Transaction[] = Array(50).fill(mockTransaction)

    return HttpResponse.json(res)
  }),
  http.get('/api/transactions/:id', () => {
    const res: Transaction = mockTransaction
    return HttpResponse.json(res)
  }),
  http.post('/api/transactions', async () => {
    // NOTE: tagsの変換が必要なため、reqBodyを使っていない
    const res: Transaction[] = [mockTransaction]

    return HttpResponse.json(res)
  }),
  http.put('/api/transactions/:id', async () => {
    // NOTE: tagsの変換が必要なため、reqBodyを使っていない
    const res: Transaction = mockTransaction

    return HttpResponse.json(res)
  }),
  http.delete('/api/transactions/:id', () => {
    return HttpResponse.json(null)
  })
]
