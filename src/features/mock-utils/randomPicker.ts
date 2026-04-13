import { fakerJA as faker } from '@faker-js/faker'

export const pickRandomElements = <T>(array: readonly T[]): T[] =>
  array.length > 0
    ? faker.helpers.arrayElements(array, { min: 0, max: array.length })
    : []
