import { rest } from 'msw'

export const admins = [
  rest.get('/api/admins', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['3fa85f64-5717-4562-b3fc-2c963f66afa6'])
    )
  })
]
