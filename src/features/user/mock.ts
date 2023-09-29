import { rest } from 'msw'

import type { User } from '/@/lib/apis'

export const mockUser: User = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'mehm8128',
  display_name: 'mehm8128',
  admin: true,
  created_at: '2022-01-27T13:45:37.048Z',
  updated_at: '2022-01-27T13:45:37.048Z',
  deleted_at: '2022-01-27T13:45:37.048Z'
}

const mockUsers: User[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    name: 'nagatech',
    display_name: 'ながてち',
    admin: true,
    created_at: '2022-01-25T13:45:36.048Z',
    updated_at: '2022-01-25T13:45:36.048Z',
    deleted_at: '2022-01-25T13:45:36.048Z'
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'mehm8128',
    display_name: 'mehm8128',
    admin: true,
    created_at: '2022-01-27T13:45:37.048Z',
    updated_at: '2022-01-27T13:45:37.048Z',
    deleted_at: '2022-01-27T13:45:37.048Z'
  }
]

export const userHandlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<User[]>(mockUsers))
  }),
  rest.get('/api/users/me', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<User>(mockUser))
  })
]
