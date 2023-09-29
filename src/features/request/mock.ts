import { rest } from 'msw'

import type {
  PostComment,
  RequestDetail,
  Comment,
  StatusDetail,
  Request
} from '/@/lib/apis'

import { mockGroup } from '/@/features/group/mock'
import {
  mockRequestComment,
  mockRequestComments
} from '/@/features/requestComment/mock'
import {
  mockRequestStatus,
  mockRequestStatuses
} from '/@/features/requestStatus/mock'
import { mockRequestTargets } from '/@/features/requestTarget/mock'
import { mockTags } from '/@/features/tag/mock'

const mockRequest: Request = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  status: 'submitted',
  created_at: '2022-01-25T13:29:19.918Z',
  updated_at: '2022-01-25T13:29:19.918Z',
  created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'SysAd講習会の開催費用',
  content: `# aaaaa
- aaa
  - bbb`,
  targets: mockRequestTargets,
  tags: mockTags,
  group: mockGroup
}

const mockRequestDetail: RequestDetail = {
  ...mockRequest,
  comments: mockRequestComments,
  statuses: mockRequestStatuses,
  files: ['3fa85f64-5717-4562-b3fc-2c963f66afa6']
}

export const requestHandlers = [
  rest.get('/api/requests', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<Request[]>(Array(50).fill(mockRequest))
    )
  }),
  rest.get('/api/requests/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<RequestDetail>(mockRequestDetail))
  }),
  rest.post('/api/requests', async (req, res, ctx) => {
    const reqBody: Request = await req.json()
    return res(
      ctx.status(200),
      ctx.json<RequestDetail>({
        ...mockRequestDetail,
        ...reqBody
      })
    )
  }),
  rest.put('/api/requests/:id', async (req, res, ctx) => {
    // tagsの変換が必要なため、reqBodyを使っていない
    return res(
      ctx.status(200),
      ctx.json<RequestDetail>({
        ...mockRequestDetail,
        id: req.params.id as string
      })
    )
  }),
  rest.post('/api/requests/:id/comments', async (req, res, ctx) => {
    const reqBody: PostComment = await req.json()
    return res(
      ctx.status(200),
      ctx.json<Comment>({
        ...mockRequestComment,
        id: req.params.id as string,
        ...reqBody
      })
    )
  }),
  rest.put('/api/requests/:id/status', async (req, res, ctx) => {
    // NOTE: commentの変換が必要なため、reqBodyを使っていない
    return res(
      ctx.status(200),
      ctx.json<StatusDetail>({
        ...mockRequestStatus
      })
    )
  })
]
