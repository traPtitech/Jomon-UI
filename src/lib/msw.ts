<<<<<<< HEAD
import { accountManagerHandlers } from '/@/features/accountManager/mock'
import { applicationHandlers } from '/@/features/application/mock'
=======
import { adminHandlers } from '/@/features/admin/mock'
>>>>>>> origin/main
import { fileHandlers } from '/@/features/file/mock'
import { partitionHandlers } from '/@/features/partition/mock'
import { tagHandlers } from '/@/features/tag/mock'
import { userHandlers } from '/@/features/user/mock'

export const handlers = [
<<<<<<< HEAD
  applicationHandlers,
  partitionHandlers,
  accountManagerHandlers,
=======
  requestHandlers,
  transactionHandlers,
  groupHandlers,
  adminHandlers,
>>>>>>> origin/main
  tagHandlers,
  userHandlers,
  fileHandlers
].flat()
