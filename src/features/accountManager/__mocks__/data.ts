import { mockUsers } from '@/features/user/__mocks__/data'

export const mockAccountManagers = new Set(
  mockUsers.filter(user => user.account_manager).map(user => user.id)
)
