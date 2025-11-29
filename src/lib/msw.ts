import { accountManagerHandlers } from '@/features/accountManager/__mocks__/handlers'
import { applicationHandlers } from '@/features/application/__mocks__/handlers'
import { fileHandlers } from '@/features/file/__mocks__/handlers'
import { partitionHandlers } from '@/features/partition/__mocks__/handlers'
import { partitionGroupHandlers } from '@/features/partitionGroup/__mocks__/handlers'
import { tagHandlers } from '@/features/tag/__mocks__/handlers'
import { userHandlers } from '@/features/user/__mocks__/handlers'

export const handlers = [
  applicationHandlers,
  partitionHandlers,
  partitionGroupHandlers,
  accountManagerHandlers,
  tagHandlers,
  userHandlers,
  fileHandlers,
].flat()
