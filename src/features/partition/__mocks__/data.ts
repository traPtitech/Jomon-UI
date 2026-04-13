import { fakerJA as faker } from '@faker-js/faker'

import type { Partition, PartitionInput } from '@/lib/apis'

import {
  getRandomMockPartitionGroup,
  mockIdToMockPartitionGroup,
} from '@/features/partitionGroup/__mocks__/data'

export const createMockPartition = (): Partition => {
  const updatedAt = faker.date.past()
  const createdAt = faker.date.past({ refDate: updatedAt })
  const parentPartitionGroupId = getRandomMockPartitionGroup().id

  return {
    id: faker.string.uuid(),
    name: faker.word.words(),
    budget: faker.helpers.maybe(() => faker.number.int({ min: 0 })) ?? null,
    parent_partition_group: parentPartitionGroupId,
    management: {
      category: 'manual',
      state: faker.helpers.arrayElement(['available', 'unavailable']),
    },
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  }
}

export const mockIdToMockPartition = new Map(
  faker.helpers
    .multiple(createMockPartition, { count: { min: 1, max: 100 } })
    .map(partition => [partition.id, partition])
)

export const getRandomMockPartition = (): Partition =>
  faker.helpers.arrayElement(Array.from(mockIdToMockPartition.values()))

export const isValidPartitionInput = (input: PartitionInput) =>
  mockIdToMockPartitionGroup.has(input.parent_partition_group)
