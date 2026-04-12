import { HttpResponse, http } from 'msw'

import { mockUserIds } from '@/features/user/__mocks__/data'

import { mockAccountManagers } from './data'

export const accountManagerHandlers = [
  http.get<never, never, string[]>('/api/account-managers', () => {
    return HttpResponse.json(Array.from(mockAccountManagers))
  }),

  http.post<never, string[], string[]>(
    '/api/account-managers',
    async ({ request }) => {
      const addingManagers = await request.json()
      if (addingManagers.some(id => !mockUserIds.has(id))) {
        return new HttpResponse(null, { status: 400 })
      }

      addingManagers.forEach(id => mockAccountManagers.add(id))
      return HttpResponse.json(addingManagers)
    }
  ),

  http.delete<never, string[], never>(
    '/api/account-managers',
    async ({ request }) => {
      const deletingManagers = await request.json()
      deletingManagers.forEach(id => mockAccountManagers.delete(id))
      return HttpResponse.json(null)
    }
  ),
]
