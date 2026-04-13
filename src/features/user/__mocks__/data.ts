import { fakerJA as faker } from '@faker-js/faker'

import type { User } from '@/lib/apis'

const mockUserMehm8128: User = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'mehm8128',
  display_name: 'mehm8128',
  account_manager: true,
  created_at: '2022-01-27T13:45:37.048Z',
  updated_at: '2022-01-27T13:45:37.048Z',
  deleted_at: null,
}

const mockUserNagatech: User = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
  name: 'nagatech',
  display_name: 'ながてち',
  account_manager: false,
  created_at: '2022-01-25T13:45:36.048Z',
  updated_at: '2022-01-25T13:45:36.048Z',
  deleted_at: null,
}

export const mockUsers = [mockUserMehm8128, mockUserNagatech]
export const mockUserIds = new Set(mockUsers.map(user => user.id))

export const getRandomMockUser = (): User =>
  faker.helpers.arrayElement(mockUsers)

export const loggedInUser = mockUserMehm8128
