import { HttpResponse, http } from 'msw'

import type { User } from '@/lib/apis'

export const mockUser: User = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'mehm8128',
  display_name: 'mehm8128',
  account_manager: true,
  created_at: '2022-01-27T13:45:37.048Z',
  updated_at: '2022-01-27T13:45:37.048Z',
  deleted_at: '2022-01-27T13:45:37.048Z'
}

const mockUsers: User[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    name: 'nagatech',
    display_name: 'ながてち',
    account_manager: true,
    created_at: '2022-01-25T13:45:36.048Z',
    updated_at: '2022-01-25T13:45:36.048Z',
    deleted_at: '2022-01-25T13:45:36.048Z'
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'mehm8128',
    display_name: 'mehm8128',
    account_manager: true,
    created_at: '2022-01-27T13:45:37.048Z',
    updated_at: '2022-01-27T13:45:37.048Z',
    deleted_at: '2022-01-27T13:45:37.048Z'
  }
]

export const userHandlers = [
  http.get('/api/users', () => {
    const res: User[] = mockUsers
    return HttpResponse.json(res)
  }),
  http.get('/api/users/me', () => {
    const res: User = mockUser
    return HttpResponse.json(res)
  })
]
