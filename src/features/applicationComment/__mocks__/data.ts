import { fakerJA as faker } from '@faker-js/faker'

import type { Comment, CommentInput } from '@/lib/apis'

import { getRandomMockUser } from '@/features/user/__mocks__/data'

export const createMockApplicationComment = (): Comment => {
  const user = getRandomMockUser()
  const updatedAt = faker.date.past()
  const createdAt = faker.date.past({
    refDate: updatedAt,
  })

  return {
    id: faker.string.uuid(),
    user: user.id,
    comment: '## ' + faker.lorem.lines(),
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  }
}

export const createMockCommentFromCommentInput = (
  commentInput: CommentInput,
  loggedInUser: string
): Comment => {
  const now = new Date().toISOString()
  return {
    ...commentInput,
    id: faker.string.uuid(),
    user: loggedInUser,
    created_at: now,
    updated_at: now,
  }
}
