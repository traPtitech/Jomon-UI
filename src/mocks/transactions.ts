import { rest } from 'msw'

import type { Transaction } from '/@/lib/apis'

export const transactions = [
  rest.get('/api/transactions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        Array(50)
          .fill({} as Transaction)
          .map((_, i) =>
            i % 2 === 0
              ? {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  amount: 1200,
                  target: 'hoge株式会社',
                  request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
                  tags: [
                    {
                      id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
                      name: '2020講習会',
                      created_at: '2022-04-17T05:47:48.187Z',
                      updated_at: '2022-04-17T05:47:48.187Z'
                    },
                    {
                      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                      name: '2021講習会',
                      created_at: '2022-04-17T05:47:48.187Z',
                      updated_at: '2022-04-17T05:47:48.187Z'
                    }
                  ],
                  group: {
                    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
                    name: 'SysAd',
                    description: 'SysAd班',
                    budget: 250000,
                    created_at: '2022-02-09T14:03:53.278Z',
                    updated_at: '2022-02-09T14:03:53.278Z'
                  },
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                }
              : {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  amount: -1200,
                  target: 'hoge株式会社',
                  request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
                  tags: [
                    {
                      id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
                      name: '2020講習会',
                      created_at: '2022-04-17T05:47:48.187Z',
                      updated_at: '2022-04-17T05:47:48.187Z'
                    },
                    {
                      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                      name: '2021講習会',
                      created_at: '2022-04-17T05:47:48.187Z',
                      updated_at: '2022-04-17T05:47:48.187Z'
                    }
                  ],
                  group: {
                    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
                    name: 'SysAd',
                    description: 'SysAd班',
                    budget: 250000,
                    created_at: '2022-02-09T14:03:53.278Z',
                    updated_at: '2022-02-09T14:03:53.278Z'
                  },
                  created_at: '2022-02-09T14:03:53.278Z',
                  updated_at: '2022-02-09T14:03:53.278Z'
                }
          )
      )
    )
  }),
  rest.get('/api/transactions/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        amount: 1200,
        target: 'mehm8128',
        request: 'c2cd9bd7-a4e9-4dbd-a26a-5dbb063a7ae7',
        tags: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa0',
            name: '2020講習会',
            created_at: '2022-04-17T05:47:48.187Z',
            updated_at: '2022-04-17T05:47:48.187Z'
          },
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
            name: '2021講習会',
            created_at: '2022-04-17T05:47:48.187Z',
            updated_at: '2022-04-17T05:47:48.187Z'
          }
        ],
        group: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'SysAd',
          description: 'SysAd班',
          budget: 250000,
          created_at: '2022-04-05T14:02:15.431Z',
          updated_at: '2022-04-05T14:02:15.431Z'
        },
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      })
    )
  })
]
