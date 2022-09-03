import { rest } from 'msw'

export const groups = [
  rest.get('/api/groups', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        Array(1000).fill({
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'SysAd',
          description: 'SysAd班',
          budget: 250000,
          created_at: '2022-04-05T14:02:15.431Z',
          updated_at: '2022-04-05T14:02:15.431Z'
        })
      )
    )
  })
]
