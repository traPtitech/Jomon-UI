import { HttpResponse, http } from 'msw'

import type { User } from '@/lib/apis'

export const mockUserMehm8128: User = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'mehm8128',
  display_name: 'mehm8128',
  account_manager: true,
  created_at: '2022-01-27T13:45:37.048Z',
  updated_at: '2022-01-27T13:45:37.048Z',
  deleted_at: '2022-01-27T13:45:37.048Z',
}

export const mockUserNagatech: User = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
  name: 'nagatech',
  display_name: 'ながてち',
  account_manager: true,
  created_at: '2022-01-25T13:45:36.048Z',
  updated_at: '2022-01-25T13:45:36.048Z',
  deleted_at: '2022-01-25T13:45:36.048Z',
}

const mockUsers: User[] = [mockUserMehm8128, mockUserNagatech]

export const userHandlers = [
  http.get('/api/users', () => {
    const res: User[] = mockUsers
    return HttpResponse.json(res)
  }),
  http.get('/api/users/me', () => {
    const res: User = mockUserMehm8128
    return HttpResponse.json(res)
  }),
]
