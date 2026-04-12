import { fakerJA as faker } from '@faker-js/faker'

import type { Status, StatusEnum } from '@/lib/apis'

import { getRandomMockUser } from '@/features/user/__mocks__/data'

export const createMockApplicationStatus = (): Status => ({
  created_by: getRandomMockUser().id,
  status: faker.helpers.arrayElement([
    'pending_review',
    'change_requested',
    'approved',
    'rejected',
  ] satisfies StatusEnum[]),
  created_at: faker.date.past().toISOString(),
})
