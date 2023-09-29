import { rest } from 'msw'

import type { Tag } from '/@/lib/apis'

export const mockTag: Tag = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
  name: '2021講習会',
  created_at: '2022-01-25T13:29:19.918Z',
  updated_at: '2022-01-25T13:29:19.918Z'
}

export const tagHandlers = [
  rest.get('/api/tags', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<Tag[]>(Array(10).fill(mockTag)))
  }),
  rest.post('/api/tags', async (req, res, ctx) => {
    const reqBody: Tag = await req.json()
    return res(ctx.status(200), ctx.json<Tag>(reqBody))
  }),
  rest.delete('/api/tags/:id', (req, res, ctx) => {
    return res(ctx.status(200))
  })
]
