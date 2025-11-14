import type { PartitionGroupSeed } from '../entities'
import type { PartitionGroup } from '@/lib/apis'
import { http, HttpResponse } from 'msw'

export const mockPartitionGroup: PartitionGroup = {
  id: 'group-1',
  name: 'テストパーティショングループ',
  parent_partition_group: null,
  depth: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

const mockPartitionGroups = Array(10).fill(mockPartitionGroup)

export const partitionGroupHandlers = [
  http.get('/api/partition-groups', () => {
    return HttpResponse.json(mockPartitionGroups)
  }),

  http.get('/api/partition-groups/:id', ({ params }) => {
    if (params.id === 'group-1') {
      return HttpResponse.json(mockPartitionGroup)
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/partition-groups', async ({ request }) => {
    const seed = (await request.json()) as PartitionGroupSeed
    const partitionGroup: PartitionGroup = {
      ...mockPartitionGroup,
      name: seed.name,
      parent_partition_group: seed.parentPartitionGroupId,
      depth: seed.depth
    }
    return HttpResponse.json(partitionGroup)
  }),

  http.put('/api/partition-groups/:id', async ({ request }) => {
    const seed = (await request.json()) as PartitionGroupSeed
    const partitionGroup: PartitionGroup = {
      ...mockPartitionGroup,
      name: seed.name,
      parent_partition_group: seed.parentPartitionGroupId,
      depth: seed.depth
    }
    return HttpResponse.json(partitionGroup)
  }),

  http.delete('/api/partition-groups/:id', () => {
    return new HttpResponse(null, { status: 204 })
  })
]
