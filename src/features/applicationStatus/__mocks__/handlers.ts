import { HttpResponse, http } from 'msw'

import type { Status } from '@/lib/apis'

import { mockUserMehm8128 } from '@/features/user/__mocks__/handlers'

export const mockApplicationStatus: Status = {
  created_by: mockUserMehm8128.id,
  status: 'pending_review',
  created_at: '2022-02-12T08:01:37.838Z',
}

export const mockApplicationStatuses: Status[] = [
  {
    created_by: mockUserMehm8128.id,
    status: 'pending_review',
    created_at: '2022-02-12T08:01:37.838Z',
  },
  {
    created_by: mockUserMehm8128.id,
    status: 'change_requested',
    created_at: '2022-02-13T08:01:37.838Z',
  },
  {
    created_by: mockUserMehm8128.id,
    status: 'pending_review',
    created_at: '2022-02-18T08:01:37.838Z',
  },
]

export const mockApplicationStatusHandlers = [
  http.put('/api/applications/:id/status', () => {
    return HttpResponse.json(mockApplicationStatus)
  }),
]
