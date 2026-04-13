import { HttpResponse, type PathParams, http } from 'msw'

import type { Partition, PartitionInput } from '@/lib/apis'

import {
  createMockPartition,
  isValidPartitionInput,
  mockIdToMockPartition,
} from './data'

export const partitionHandlers = [
  http.get<never, never, Partition[]>('/api/partitions', () => {
    return HttpResponse.json(Array.from(mockIdToMockPartition.values()))
  }),

  http.get<PathParams, never, Partition>(
    '/api/partitions/:id',
    ({ params }) => {
      const partition = mockIdToMockPartition.get(params.id as string)
      if (!partition) {
        return new HttpResponse(null, { status: 404 })
      }
      return HttpResponse.json(partition)
    }
  ),

  http.post<PathParams, PartitionInput, Partition>(
    '/api/partitions',
    async ({ request }) => {
      const partitionInput = await request.json()
      if (!isValidPartitionInput(partitionInput)) {
        return new HttpResponse(null, { status: 400 })
      }
      const newPartition: Partition = {
        ...createMockPartition(),
        ...partitionInput,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockIdToMockPartition.set(newPartition.id, newPartition)
      return HttpResponse.json(newPartition)
    }
  ),

  http.put<PathParams, PartitionInput, Partition>(
    '/api/partitions/:id',
    async ({ params, request }) => {
      const id = params.id as string
      const existingMockPartition = mockIdToMockPartition.get(id)
      if (!existingMockPartition) {
        return new HttpResponse(null, { status: 404 })
      }

      const partitionInput = await request.json()
      if (!isValidPartitionInput(partitionInput)) {
        return new HttpResponse(null, { status: 400 })
      }
      const updatedPartition: Partition = {
        ...existingMockPartition,
        ...partitionInput,
        updated_at: new Date().toISOString(),
      }
      mockIdToMockPartition.set(id, updatedPartition)
      return HttpResponse.json(updatedPartition)
    }
  ),

  http.delete<PathParams, never, never>('/api/partitions/:id', ({ params }) => {
    const id = params.id as string
    const existingMockPartition = mockIdToMockPartition.get(id)
    if (!existingMockPartition) {
      return new HttpResponse(null, { status: 404 })
    }
    mockIdToMockPartition.delete(id)
    return HttpResponse.json(null)
  }),
]
