import { HttpResponse, type PathParams, http } from 'msw'

import { mockUserMehm8128 } from '@/features/user/__mocks__/handlers'

const mockAccountManagers = [mockUserMehm8128.id]

export const accountManagerHandlers = [
  http.get('/api/account-managers', () => {
    return HttpResponse.json(mockAccountManagers)
  }),
  http.post<PathParams, string[], string[]>(
    '/api/account-managers',
    async ({ request }) => {
      const reqBody: string[] = await request.json()
      return HttpResponse.json(reqBody)
    }
  ),
  http.delete('/api/account-managers', () => {
    return HttpResponse.json(null)
  }),
]
