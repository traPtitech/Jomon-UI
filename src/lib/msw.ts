import { setupWorker } from 'msw/browser'

import { adminHandlers } from '/@/features/admin/mock'
import { fileHandlers } from '/@/features/file/mock'
import { partitonHandlers } from '/@/features/partiton/mock'
import { requestHandlers } from '/@/features/request/mock'
import { tagHandlers } from '/@/features/tag/mock'
import { userHandlers } from '/@/features/user/mock'

const handlers = [
  requestHandlers,
  partitonHandlers,
  adminHandlers,
  tagHandlers,
  userHandlers,
  fileHandlers
].flat()

export const initMock = () => {
  if (process.env.NODE_ENV === 'development') {
    const worker = setupWorker(...handlers)
    worker.start({
      onUnhandledRequest: 'bypass'
    })
  }
}
