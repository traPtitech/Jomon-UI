import { HttpResponse, http } from 'msw'

import type { User } from '@/lib/apis'

import { loggedInUser, mockUsers } from './data'

export const userHandlers = [
  http.get<never, never, User[]>('/api/users', () => {
    return HttpResponse.json(mockUsers)
  }),
  http.get<never, never, User>('/api/users/me', () => {
    return HttpResponse.json(loggedInUser)
  }),
]
