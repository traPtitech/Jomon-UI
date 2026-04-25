import { fakerJA as faker } from '@faker-js/faker'

import type { ApplicationTarget, PostApplicationTargetInput } from '@/lib/apis'

import { getRandomMockUser } from '@/features/user/__mocks__/data'

export const createMockApplicationTarget = (): ApplicationTarget => {
  const paidAt =
    faker.helpers.maybe(() => faker.date.past().toISOString()) ?? null
  const createdAt = faker.date
    .past({ refDate: paidAt ?? undefined })
    .toISOString()

  return {
    id: faker.string.uuid(),
    amount: faker.number.int({ min: 100, max: 10000 }),
    target: getRandomMockUser().id,
    paid_at: paidAt,
    created_at: createdAt,
  }
}

export const createMockApplicationTargetFromPostApplicationTargetInput = (
  postApplicationTargetInput: PostApplicationTargetInput
) => ({
  ...postApplicationTargetInput,
  id: faker.string.uuid(),
  paid_at: null,
  created_at: new Date().toISOString(),
})
