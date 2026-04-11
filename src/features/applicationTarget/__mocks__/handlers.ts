import type { ApplicationTarget } from '@/lib/apis'

import { mockUserMehm8128 } from '@/features/user/__mocks__/handlers'

export const mockApplicationTarget: ApplicationTarget = {
  id: mockUserMehm8128.id,
  amount: 1200,
  target: mockUserMehm8128.id,
  paid_at: '2020-01-01',
  created_at: '2020-01-01',
}

export const mockApplicationTargets: ApplicationTarget[] = [
  {
    id: mockUserMehm8128.id,
    amount: 1200,
    target: mockUserMehm8128.id,
    paid_at: '2020-01-01',
    created_at: '2020-01-01',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    amount: 1500,
    target: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    paid_at: null,
    created_at: '2020-01-02',
  },
]
