import { HttpResponse, type PathParams, http } from 'msw'

import type { PartitionGroup, PartitionGroupInput } from '@/lib/apis'

import {
  createMockPartitionGroup,
  isValidPartitionGroupInput,
  mockIdToMockPartitionGroup,
} from './data'

export const partitionGroupHandlers = [
  http.get<never, never, PartitionGroup[]>('/api/partition-groups', () => {
    return HttpResponse.json(Array.from(mockIdToMockPartitionGroup.values()))
  }),

  http.get<PathParams, never, PartitionGroup>(
    '/api/partition-groups/:id',
    ({ params }) => {
      const partitionGroup = mockIdToMockPartitionGroup.get(params.id as string)
      if (!partitionGroup) {
        return new HttpResponse(null, { status: 404 })
      }
      return HttpResponse.json(partitionGroup)
    }
  ),

  http.post<PathParams, PartitionGroupInput, PartitionGroup>(
    '/api/partition-groups',
    async ({ request }) => {
      const partitionGroupInput = await request.json()
      if (!isValidPartitionGroupInput(partitionGroupInput)) {
        return new HttpResponse(null, { status: 400 })
      }
      const newPartitionGroup: PartitionGroup = {
        ...createMockPartitionGroup(),
        ...partitionGroupInput,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockIdToMockPartitionGroup.set(newPartitionGroup.id, newPartitionGroup)
      return HttpResponse.json(newPartitionGroup)
    }
  ),

  http.put<PathParams, PartitionGroupInput, PartitionGroup>(
    '/api/partition-groups/:id',
    async ({ params, request }) => {
      const id = params.id as string
      const existingPartitionGroup = mockIdToMockPartitionGroup.get(id)
      if (!existingPartitionGroup) {
        return new HttpResponse(null, { status: 404 })
      }
      const partitionGroupInput = await request.json()
      if (!isValidPartitionGroupInput(partitionGroupInput)) {
        return new HttpResponse(null, { status: 400 })
      }
      const updatedPartitionGroup: PartitionGroup = {
        ...existingPartitionGroup,
        ...partitionGroupInput,
        updated_at: new Date().toISOString(),
      }
      mockIdToMockPartitionGroup.set(id, updatedPartitionGroup)
      return HttpResponse.json(updatedPartitionGroup)
    }
  ),

  http.delete<PathParams, never, never>(
    '/api/partition-groups/:id',
    ({ params }) => {
      const id = params.id as string
      if (!mockIdToMockPartitionGroup.has(id)) {
        return new HttpResponse(null, { status: 404 })
      }
      mockIdToMockPartitionGroup.delete(id)
      return HttpResponse.json(null)
    }
  ),
]
