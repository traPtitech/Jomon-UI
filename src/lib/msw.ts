import { setupWorker } from 'msw/browser'

import { accountManagerHandlers } from '/@/features/accountManager/mock'
import { applicationHandlers } from '/@/features/application/mock'
import { fileHandlers } from '/@/features/file/mock'
import { partitionHandlers } from '/@/features/partition/mock'
import { tagHandlers } from '/@/features/tag/mock'
import { userHandlers } from '/@/features/user/mock'

const handlers = [
  applicationHandlers,
  partitionHandlers,
  accountManagerHandlers,
  tagHandlers,
  userHandlers,
  fileHandlers
].flat()

export const initMock = () => {
  if (process.env.NODE_ENV === 'development') {
    const worker = setupWorker(...handlers)
    worker.start({
      onUnhandledApplication: 'bypass'
    })
  }
}
