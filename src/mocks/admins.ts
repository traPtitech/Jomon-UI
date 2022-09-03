import { rest } from 'msw'

export const admins = [
  rest.get('/api/admins', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
  })
]
