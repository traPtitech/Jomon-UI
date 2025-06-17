import { adminHandlers } from '/@/features/admin/mock'
import { fileHandlers } from '/@/features/file/mock'
import { groupHandlers } from '/@/features/group/mock'
import { requestHandlers } from '/@/features/request/mock'
import { tagHandlers } from '/@/features/tag/mock'
import { transactionHandlers } from '/@/features/transaction/mock'
import { userHandlers } from '/@/features/user/mock'

export const handlers = [
  requestHandlers,
  transactionHandlers,
  groupHandlers,
  adminHandlers,
  tagHandlers,
  userHandlers,
  fileHandlers
].flat()
