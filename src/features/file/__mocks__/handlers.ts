import { HttpResponse, http } from 'msw'

import type { FileMeta } from '@/lib/apis'

import mehm8128 from '@/assets/mehm8128.png'
import { mockUserMehm8128 } from '@/features/user/__mocks__/handlers'

const mockFile = mehm8128

const mockFileMeta: FileMeta = {
  id: mockUserMehm8128.id,
  name: 'mehm8128.png',
  mime_type: 'image/png',
  created_at: '2021-08-01T00:00:00Z',
}

export const fileHandlers = [
  http.get('/api/files/:id', () => {
    return HttpResponse.text(mockFile)
  }),
  http.get('/api/files/:id/meta', ({ params }) => {
    const res: FileMeta = { ...mockFileMeta, id: params.id as string }

    return HttpResponse.json(res)
  }),
  http.post('/api/files', () => {
    return HttpResponse.json({ id: mockUserMehm8128.id })
  }),
]
