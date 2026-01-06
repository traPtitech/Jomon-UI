import { HttpResponse, type PathParams, http } from 'msw'

import type { Tag } from '@/lib/apis'

export const mockTag: Tag = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
  name: '2021講習会',
  created_at: '2022-01-25T13:29:19.918Z',
  updated_at: '2022-01-25T13:29:19.918Z',
}

export const mockTags: Tag[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
    name: '2021講習会',
    created_at: '2022-01-25T13:29:19.918Z',
    updated_at: '2022-01-25T13:29:19.918Z',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: '2022講習会',
    created_at: '2022-01-25T13:29:19.918Z',
    updated_at: '2022-01-25T13:29:19.918Z',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    name: '2020講習会',
    created_at: '2022-01-25T13:29:19.918Z',
    updated_at: '2022-01-25T13:29:19.918Z',
  },
]

export const tagHandlers = [
  http.get('/api/tags', () => {
    const res: Tag[] = mockTags

    return HttpResponse.json(res)
  }),
  http.post<PathParams, Tag, Tag>('/api/tags', async ({ request }) => {
    const reqBody: Tag = await request.json()
    return HttpResponse.json(reqBody)
  }),
  http.delete('/api/tags/:id', () => {
    return HttpResponse.json(null)
  }),
]
