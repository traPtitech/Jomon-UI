import { HttpResponse, type PathParams, http } from 'msw'

import type { Tag, TagInput } from '@/lib/apis'

import { createMockTag, mockIdToMockTag } from './data'

export const tagHandlers = [
  http.get<never, never, Tag[]>('/api/tags', () => {
    const tags = Array.from(mockIdToMockTag.values())
    return HttpResponse.json(tags)
  }),

  http.post<PathParams, TagInput, Tag>('/api/tags', async ({ request }) => {
    const tagInput = await request.json()
    const newTag = {
      ...createMockTag(),
      ...tagInput,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockIdToMockTag.set(newTag.id, newTag)
    return HttpResponse.json(newTag)
  }),

  http.put<PathParams, TagInput, Tag>(
    '/api/tags/:id',
    async ({ params, request }) => {
      const id = params.id as string
      const existingTag = mockIdToMockTag.get(id)
      if (!existingTag) {
        return new HttpResponse(null, { status: 404 })
      }
      const tagInput = await request.json()
      const updatedTag: Tag = {
        ...existingTag,
        ...tagInput,
        updated_at: new Date().toISOString(),
      }
      mockIdToMockTag.set(id, updatedTag)
      return HttpResponse.json(updatedTag)
    }
  ),

  http.delete<PathParams, never, never>('/api/tags/:id', ({ params }) => {
    const id = params.id as string
    if (!mockIdToMockTag.has(id)) {
      return new HttpResponse(null, { status: 404 })
    }
    mockIdToMockTag.delete(id)
    return HttpResponse.json(null)
  }),
]
