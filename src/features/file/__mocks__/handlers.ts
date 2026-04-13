import { fakerJA as faker } from '@faker-js/faker'
import { HttpResponse, type PathParams, http } from 'msw'

import type { FileMeta } from '@/lib/apis'

import { mockIdToMockFileEntry } from './data'

export const fileHandlers = [
  http.get<PathParams, never, File>('/api/files/:id', ({ params }) => {
    const id = params.id as string
    const mockFile = mockIdToMockFileEntry.get(id)
    if (!mockFile) {
      return new HttpResponse(null, { status: 404 })
    }
    return new HttpResponse(mockFile.file, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
  }),

  http.delete<PathParams, never, never>('/api/files/:id', ({ params }) => {
    const id = params.id as string
    if (!mockIdToMockFileEntry.has(id)) {
      return new HttpResponse(null, { status: 404 })
    }
    mockIdToMockFileEntry.delete(id)
    return HttpResponse.json(null)
  }),

  http.get<PathParams, never, FileMeta>('/api/files/:id/meta', ({ params }) => {
    const id = params.id as string
    const mockFileEntry = mockIdToMockFileEntry.get(id)
    if (!mockFileEntry) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(mockFileEntry.meta)
  }),

  http.post<PathParams, FormData, { id: string }>(
    '/api/files',
    async ({ request }) => {
      const formData = await request.formData()
      const file = formData.get('file') as File
      const name = formData.get('name') as string
      const newId = faker.string.uuid()
      mockIdToMockFileEntry.set(newId, {
        file: file,
        meta: {
          id: newId,
          name: name,
          mime_type: file.type,
          created_at: new Date().toISOString(),
        },
      })
      return HttpResponse.json({ id: newId })
    }
  ),
]
