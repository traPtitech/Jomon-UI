import { rest } from 'msw'

export const tags = [
  rest.get('/api/tags', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
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
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          name: '2022講習会',
          created_at: '2022-04-17T05:47:48.187Z',
          updated_at: '2022-04-17T05:47:48.187Z'
        }
      ])
    )
  })
]
