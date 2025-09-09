import type { ApplicationTarget } from '/@/lib/apis'

export const mockApplicationTarget: ApplicationTarget = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  amount: 1200,
  target: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  paid_at: '2020-01-01',
  created_at: '2020-01-01'
}

export const mockApplicationTargets: ApplicationTarget[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    amount: 1200,
    target: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    paid_at: '2020-01-01',
    created_at: '2020-01-01'
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    amount: 1500,
    target: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    paid_at: null,
    created_at: '2020-01-02'
  }
]
