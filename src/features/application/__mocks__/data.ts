import { fakerJA as faker } from '@faker-js/faker'

import {
  type Application,
  type ApplicationDetail,
  type ApplicationInput,
} from '@/lib/apis'

import { createMockApplicationComment } from '@/features/applicationComment/__mocks__/data'
import { createMockApplicationStatus } from '@/features/applicationStatus/__mocks__/data'
import {
  createMockApplicationTarget,
  createNewApplicationTargetFromApplicationTargetInput,
} from '@/features/applicationTarget/__mocks__/data'
import { mockIdToMockFileEntry } from '@/features/file/__mocks__/data'
import { pickRandomElements } from '@/features/mock-utils/randomPicker'
import {
  getRandomMockPartition,
  mockIdToMockPartition,
} from '@/features/partition/__mocks__/data'
import {
  getMockTagsByIds,
  mockIdToMockTag,
} from '@/features/tag/__mocks__/data'
import { getRandomMockUser, loggedInUser } from '@/features/user/__mocks__/data'

const createMockApplicationDetail = (): ApplicationDetail => {
  const updatedAt = faker.date.past()
  const createdAt = faker.date.past({ refDate: updatedAt })

  const targets = faker.helpers.multiple(createMockApplicationTarget, {
    count: {
      min: 1,
      max: 5,
    },
  })

  const statusDates = faker.date.betweens({
    from: createdAt,
    to: updatedAt,
    count: { min: 1, max: 20 },
  })
  const statuses = statusDates.map(date => ({
    ...createMockApplicationStatus(),
    created_at: date.toISOString(),
  }))
  // statusesの要素数は必ず1以上であるため
  if (targets.every(target => target.paid_at)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    statuses.at(-1)!.status = 'payment_finished'
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStatus = statuses.at(-1)!

  const commentDates = faker.date.betweens({
    from: createdAt,
    to: updatedAt,
    count: { min: 0, max: 20 },
  })
  const comments = commentDates.map(date => ({
    ...createMockApplicationComment(),
    created_at: date.toISOString(),
  }))

  const partition = getRandomMockPartition()

  return {
    id: faker.string.uuid(),
    status: currentStatus.status,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
    created_by: faker.helpers.maybe(getRandomMockUser)?.id ?? loggedInUser.id,
    title: faker.lorem.sentence(),
    content: '# ' + faker.lorem.lines(),
    targets: targets,
    tags: pickRandomElements(Array.from(mockIdToMockTag.values())),
    partition: partition,
    comments: comments,
    statuses: statuses,
    files: pickRandomElements(Array.from(mockIdToMockFileEntry.keys())),
  }
}

export const mockIdToMockApplicationDetail = new Map(
  faker.helpers
    .multiple(createMockApplicationDetail, {
      count: { min: 5, max: 500 },
    })
    .map(applicationDetail => [applicationDetail.id, applicationDetail])
)

export const createNewApplicationFromApplicationInput = (
  applicationInput: ApplicationInput
): Application | undefined => {
  const tags = getMockTagsByIds(applicationInput.tags)
  if (!tags) {
    return undefined
  }

  const targets = applicationInput.targets.map(applicationTargetInput =>
    createNewApplicationTargetFromApplicationTargetInput(applicationTargetInput)
  )

  const partition = mockIdToMockPartition.get(applicationInput.partition)
  if (!partition) {
    return undefined
  }

  return {
    ...applicationInput,
    id: faker.string.uuid(),
    status: 'pending_review',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    targets: targets,
    tags: tags,
    partition: partition,
  }
}
