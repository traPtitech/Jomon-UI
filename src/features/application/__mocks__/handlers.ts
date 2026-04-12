import { HttpResponse, type PathParams, http } from 'msw'

import {
  type Application,
  type ApplicationDetail,
  type ApplicationInput,
  type Comment,
  type CommentInput,
  type StatusDetail,
  type StatusInput,
} from '@/lib/apis'

import { createMockCommentFromCommentInput } from '@/features/applicationComment/__mocks__/data'
import { createMockApplicationStatus } from '@/features/applicationStatus/__mocks__/data'
import { mockIdToMockPartition } from '@/features/partition/__mocks__/data'
import { getMockTagsByIds } from '@/features/tag/__mocks__/data'
import { loggedInUser } from '@/features/user/__mocks__/data'

import {
  createNewApplicationFromApplicationInput,
  mockIdToMockApplicationDetail,
} from './data'

export const applicationHandlers = [
  http.get<never, never, Application[]>('/api/applications', () => {
    // NOTE: クエリパラメータには未対応
    return HttpResponse.json(Array.from(mockIdToMockApplicationDetail.values()))
  }),

  http.get<PathParams, never, ApplicationDetail>(
    '/api/applications/:id',
    ({ params }) => {
      const id = params.id as string
      const applicationDetail = mockIdToMockApplicationDetail.get(id)
      if (!applicationDetail) {
        return new HttpResponse(null, { status: 404 })
      }
      return HttpResponse.json(applicationDetail)
    }
  ),

  http.post<never, ApplicationInput, ApplicationDetail>(
    '/api/applications',
    async ({ request }) => {
      const applicationInput: ApplicationInput = await request.json()
      const newApplication =
        createNewApplicationFromApplicationInput(applicationInput)
      if (!newApplication) {
        return new HttpResponse(null, { status: 400 })
      }
      const newApplicationDetail: ApplicationDetail = {
        ...newApplication,
        comments: [],
        statuses: [
          {
            ...createMockApplicationStatus(),
            created_by: newApplication.created_by,
            status: 'pending_review',
            created_at: newApplication.created_at,
          },
        ],
        files: [],
      }
      mockIdToMockApplicationDetail.set(
        newApplicationDetail.id,
        newApplicationDetail
      )
      return HttpResponse.json(newApplicationDetail)
    }
  ),

  http.put<PathParams, ApplicationInput, ApplicationDetail>(
    '/api/applications/:id',
    async ({ params, request }) => {
      const id = params.id as string
      const existingApplicationDetail = mockIdToMockApplicationDetail.get(id)
      if (!existingApplicationDetail) {
        return new HttpResponse(null, { status: 404 })
      }

      const applicationInput = await request.json()
      if (
        applicationInput.created_by !== existingApplicationDetail.created_by
      ) {
        return new HttpResponse(null, { status: 400 })
      }

      const updatedTags = getMockTagsByIds(applicationInput.tags)
      if (!updatedTags) {
        return new HttpResponse(null, { status: 400 })
      }

      const updatedPartition = mockIdToMockPartition.get(
        applicationInput.partition
      )
      if (!updatedPartition) {
        return new HttpResponse(null, { status: 400 })
      }

      const updatedApplicationDetail = {
        ...existingApplicationDetail,
        ...applicationInput,
        targets: existingApplicationDetail.targets, // FIXME: 今のAPI仕様ではこのエンドポイントのリクエストボディであるApplicationInputはtargetsを更新するための情報が足りておらず、targetsの更新処理を実装できない
        tags: updatedTags,
        partition: updatedPartition,
        updated_at: new Date().toISOString(),
      }
      mockIdToMockApplicationDetail.set(id, updatedApplicationDetail)

      return HttpResponse.json(updatedApplicationDetail)
    }
  ),

  http.post<PathParams, CommentInput, Comment>(
    '/api/applications/:id/comments',
    async ({ request, params }) => {
      const applicationDetail = mockIdToMockApplicationDetail.get(
        params.id as string
      )
      if (!applicationDetail) {
        return new HttpResponse(null, { status: 404 })
      }

      if (!loggedInUser.id) {
        return new HttpResponse(null, { status: 401 })
      }
      const commentInput = await request.json()
      const newComment: Comment = createMockCommentFromCommentInput(
        commentInput,
        loggedInUser.id
      )
      applicationDetail.comments.push(newComment)

      return HttpResponse.json(newComment)
    }
  ),

  http.put<PathParams, StatusInput, StatusDetail>(
    '/api/applications/:id/status',
    async ({ params, request }) => {
      // NOTE: ログインユーザーの権限確認は未実装
      const applicationDetail = mockIdToMockApplicationDetail.get(
        params.id as string
      )
      if (!applicationDetail) {
        return new HttpResponse(null, { status: 404 })
      }

      const statusInput = await request.json()
      const newStatusDetail: StatusDetail = {
        ...statusInput,
        created_by: loggedInUser.id,
        comment: undefined,
        created_at: new Date().toISOString(),
      }

      if (statusInput.comment) {
        const newComment = createMockCommentFromCommentInput(
          {
            comment: statusInput.comment,
          },
          loggedInUser.id
        )
        newStatusDetail.comment = newComment
        applicationDetail.comments.push(newComment)
      }

      applicationDetail.status = statusInput.status
      applicationDetail.statuses.push(newStatusDetail)
      applicationDetail.updated_at = newStatusDetail.created_at

      return HttpResponse.json(newStatusDetail)
    }
  ),
]
