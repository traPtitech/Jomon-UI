import type { PartitionSeed } from '../entities'
import type { Partition } from '@/lib/apis'
import { http, HttpResponse } from 'msw'

export const mockPartition: Partition = {
  id: '1',
  name: 'テストパーティション',
  budget: 10000,
  parent_partition_group: 'group-1',
  management: {
    category: 'manual',
    state: 'available'
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}
export const mockPartitionWithoutBudget: Partition = {
  id: '2',
  name: 'テストパーティション(指定なし)',
  budget: null,
  parent_partition_group: 'group-2',
  management: {
    category: 'manual',
    state: 'available'
  },
  created_at: '2024-01-02T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z'
}
const mockPartitions: Partition[] = [
  ...Array(5).fill(mockPartition),
  ...Array(5).fill(mockPartitionWithoutBudget)
]

export const partitionHandlers = [
  http.get('/api/partitions', () => {
    return HttpResponse.json(mockPartitions)
  }),

  http.get('/api/partitions/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json(mockPartition)
    }
    if (params.id === '2') {
      return HttpResponse.json(mockPartitionWithoutBudget)
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/partitions', async ({ request }) => {
    const seed = (await request.json()) as PartitionSeed
    const partition: Partition = {
      ...mockPartition,
      name: seed.name,
      budget: seed.budget,
      parent_partition_group:
        seed.parentPartitionGroupId || mockPartition.parent_partition_group,
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
      parent_partition_group:
        seed.parentPartitionGroupId || mockPartition.parent_partition_group,
      management: seed.management
    }
    return HttpResponse.json(partition)
  }),

  http.delete('/api/partitions/:id', () => {
    return new HttpResponse(null, { status: 204 })
  })
]
