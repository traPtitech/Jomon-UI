import { fakerJA as faker } from '@faker-js/faker'

import type { PartitionGroup, PartitionGroupInput } from '@/lib/apis'

export const createMockPartitionGroup = (): PartitionGroup => {
  const updatedAt = faker.date.past()
  const createdAt = faker.date.past({ refDate: updatedAt })

  return {
    id: faker.string.uuid(),
    name: faker.word.words(),
    parent_partition_group: null,
    depth: 1,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  }
}

export const mockIdToMockPartitionGroup = new Map(
  faker.helpers
    .multiple(createMockPartitionGroup, { count: { min: 1, max: 100 } })
    .map(partitionGroup => [partitionGroup.id, partitionGroup])
)

export const getRandomMockPartitionGroup = (): PartitionGroup =>
  faker.helpers.arrayElement(Array.from(mockIdToMockPartitionGroup.values()))

export const isValidPartitionGroupInput = (seed: PartitionGroupInput) => {
  return seed.parent_partition_group === null && seed.depth === 1
}
