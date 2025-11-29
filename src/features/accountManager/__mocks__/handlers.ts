import { HttpResponse, type PathParams, http } from 'msw'

const mockAccountManagers = ['3fa85f64-5717-4562-b3fc-2c963f66afa6']

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
