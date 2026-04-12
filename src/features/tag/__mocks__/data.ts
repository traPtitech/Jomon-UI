import { fakerJA as faker } from '@faker-js/faker'

import type { Tag } from '@/lib/apis'

export const createMockTag = () => {
  const updatedAt = faker.date.past()
  const createdAt = faker.date.past({ refDate: updatedAt })

  return {
    id: faker.string.uuid(),
    name: faker.word.words(),
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  }
}

export const mockIdToMockTag = new Map<string, Tag>(
  faker.helpers
    .multiple(createMockTag, {
      count: {
        min: 1,
        max: 100,
      },
    })
    .map(tag => [tag.id, tag])
)

export const getMockTagsByIds = (tagIds: string[]) => {
  const tags = tagIds.map(tagId => mockIdToMockTag.get(tagId))
  return tags.every(tag => tag !== undefined) ? tags : undefined
}
