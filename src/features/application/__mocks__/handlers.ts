import { http, HttpResponse, type PathParams } from 'msw'

import type {
  Application,
  ApplicationDetail,
  Comment,
  CommentInput,
  StatusDetail
} from '@/lib/apis'

import {
  mockApplicationComment,
  mockApplicationComments
} from '@/features/applicationComment/__mocks__/handlers'
import {
  mockApplicationStatus,
  mockApplicationStatuses
} from '@/features/applicationStatus/__mocks__/handlers'
import { mockApplicationTargets } from '@/features/applicationTarget/__mocks__/handlers'
import { mockPartition } from '@/features/partition/__mocks__/handlers'
import { mockTags } from '@/features/tag/__mocks__/handlers'

const mockApplication: Application = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  status: 'pending_review',

  created_at: '2022-01-25T13:29:19.918Z',
  updated_at: '2022-01-25T13:29:19.918Z',
  created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'SysAd講習会の開催費用',
  content: `# aaaaa
- aaa
  - bbb`,
  targets: mockApplicationTargets,
  tags: mockTags,
  partition: mockPartition
}

const mockApplicationDetail: ApplicationDetail = {
  ...mockApplication,
  comments: mockApplicationComments,
  statuses: mockApplicationStatuses,
  files: ['3fa85f64-5717-4562-b3fc-2c963f66afa6']
}

export const applicationHandlers = [
  http.get('/api/applications', () => {
    const res: Application[] = Array(50).fill(mockApplication)
    const data = JSON.stringify(res)

    return new Response(data, {
      status: 200
    })
  }),
  http.get('/api/applications/:id', () => {
    const res: ApplicationDetail = mockApplicationDetail
    return HttpResponse.json(res)
  }),
  http.post<PathParams, Application, ApplicationDetail>(
    '/api/applications',
    async ({ request }) => {
      const reqBody: Application = await request.json()
      const res: ApplicationDetail = {
        ...mockApplicationDetail,
        ...reqBody
      }

      return HttpResponse.json(res)
    }
  ),
  http.put('/api/applications/:id', async ({ params }) => {
    // tagsの変換が必要なため、reqBodyを使っていない
    const res: ApplicationDetail = {
      ...mockApplicationDetail,
      id: params.id as string // FIXME: 変換処理書く
    }

    return HttpResponse.json(res)
  }),
  http.post<PathParams, CommentInput, Comment>(
    '/api/applications/:id/comments',
    async ({ request, params }) => {
      const reqBody: CommentInput = await request.json()
      const res: Comment = {
        ...mockApplicationComment,
        id: params.id as string,
        ...reqBody
      }

      return HttpResponse.json(res)
    }
  ),
  http.put('/api/applications/:id/status', async () => {
    // NOTE: commentの変換が必要なため、reqBodyを使っていない
    const res: StatusDetail = mockApplicationStatus

    return HttpResponse.json(res)
  })
]
