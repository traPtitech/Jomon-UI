import { HttpResponse, type PathParams, http } from 'msw'

const mockAdmins = ['3fa85f64-5717-4562-b3fc-2c963f66afa6']

export const adminHandlers = [
  http.get('/api/admins', () => {
    return HttpResponse.json(mockAdmins)
  }),
  http.post<PathParams, string[], string[]>(
    '/api/admins',
    async ({ request }) => {
      const reqBody: string[] = await request.json()
      return HttpResponse.json(reqBody)
    }
  ),
  http.delete('/api/admins', () => {
    return HttpResponse.json(null)
  })
]
