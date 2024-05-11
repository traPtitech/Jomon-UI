import { http, HttpResponse, type PathParams } from 'msw'

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
  http.get('/api/requests', () => {
    const res: Request[] = Array(50).fill(mockRequest)
    const data = JSON.stringify(res)

    return new Response(data, {
      status: 200
    })
  }),
  http.get('/api/requests/:id', () => {
    const res: RequestDetail = mockRequestDetail
    return HttpResponse.json(res)
  }),
  http.post<PathParams, Request, RequestDetail>(
    '/api/requests',
    async ({ request }) => {
      const reqBody: Request = await request.json()
      const res: RequestDetail = {
        ...mockRequestDetail,
        ...reqBody
      }

      return HttpResponse.json(res)
    }
  ),
  http.put('/api/requests/:id', async ({ params }) => {
    // tagsの変換が必要なため、reqBodyを使っていない
    const res: RequestDetail = {
      ...mockRequestDetail,
      id: params.id as string // FIXME: 変換処理書く
    }

    return HttpResponse.json(res)
  }),
  http.post<PathParams, PostComment, Comment>(
    '/api/requests/:id/comments',
    async ({ request, params }) => {
      const reqBody: PostComment = await request.json()
      const res: Comment = {
        ...mockRequestComment,
        id: params.id as string,
        ...reqBody
      }

      return HttpResponse.json(res)
    }
  ),
  http.put('/api/requests/:id/status', async () => {
    // NOTE: commentの変換が必要なため、reqBodyを使っていない
    const res: StatusDetail = mockRequestStatus

    return HttpResponse.json(res)
  })
]
