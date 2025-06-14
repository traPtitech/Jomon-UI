import { http, HttpResponse } from 'msw'

import type { PartitionSeed } from './model'
import { Partition } from '/@/lib/apis'

export const mockPartition: Partition = {
  id: '1',
  name: 'テストパーティション',
  budget: 10000,
  management: {
    category: 'manual',
    state: 'available'
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

const mockPartitions = Array(10).fill(mockPartition)

export const groupHandlers = [
  http.get('/api/partitions', () => {
    return HttpResponse.json(mockPartitions)
  }),

  http.get('/api/partitions/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json(mockPartition)
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/partitions', async ({ request }) => {
    const seed = (await request.json()) as PartitionSeed
    const partition: Partition = {
      ...mockPartition,
      name: seed.name,
      budget: seed.budget,
      management: seed.management
    }
    return HttpResponse.json(partition)
  }),

  http.put('/api/partitions/:id', async ({ request }) => {
    const seed = (await request.json()) as PartitionSeed
    const partition: Partition = {
      ...mockPartition,
      name: seed.name,
      budget: seed.budget,
      management: seed.management
    }
    return HttpResponse.json(partition)
  }),

  http.delete('/api/partitions/:id', () => {
    return new HttpResponse(null, { status: 204 })
  })
]
