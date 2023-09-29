import { rest } from 'msw'

const mockAdmins = ['3fa85f64-5717-4562-b3fc-2c963f66afa6']

export const adminHandlers = [
  rest.get('/api/admins', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<string[]>(mockAdmins))
  }),
  rest.post('/api/admins', async (req, res, ctx) => {
    const reqBody: string[] = await req.json()
    return res(ctx.status(200), ctx.json<string[]>(reqBody))
  }),
  rest.delete('/api/admins', (req, res, ctx) => {
    return res(ctx.status(200))
  })
]
