import { rest } from 'msw'

export const transactions = [
  rest.get('/api/transactions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        Array(50).fill({
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          amount: 1200,
          target: 'hoge株式会社',
          request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
          tags: [
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2020講習会',
              description: '2020年度講',
              created_at: '2022-02-09T14:03:53.278Z',
              updated_at: '2022-02-09T14:03:53.278Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2020講習会',
              description: '2020年度講習会ああああああ',
              created_at: '2022-02-09T14:03:53.278Z',
              updated_at: '2022-02-09T14:03:53.278Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2020講習会',
              description: '2020年度講習会',
              created_at: '2022-02-09T14:03:53.278Z',
              updated_at: '2022-02-09T14:03:53.278Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2020講習会',
              description: '2020年度講習会sssssssssssss',
              created_at: '2022-02-09T14:03:53.278Z',
              updated_at: '2022-02-09T14:03:53.278Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2021講習会',
              description: '2020年度講',
              created_at: '2022-02-09T14:03:53.278Z',
              updated_at: '2022-02-09T14:03:53.278Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2021講習会',
              description: '2020年度講',
              created_at: '2022-02-09T14:03:53.278Z',
              updated_at: '2022-02-09T14:03:53.278Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2021講習会',
              description: '2020年度講',
              created_at: '2022-02-09T14:03:53.278Z',
              updated_at: '2022-02-09T14:03:53.278Z'
            }
          ],
          group: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'SysAd',
            description: 'SysAd班',
            budget: 250000,
            created_at: '2022-02-09T14:03:53.278Z',
            updated_at: '2022-02-09T14:03:53.278Z'
          },
          created_at: '2022-02-09T14:03:53.278Z',
          updated_at: '2022-02-09T14:03:53.278Z'
        })
      )
    )
  })
]