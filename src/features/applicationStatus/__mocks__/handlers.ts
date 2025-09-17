import { http, HttpResponse } from 'msw'
import { Status } from '@/lib/apis'

export const mockApplicationStatus: Status = {
  created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  status: 'pending_review',
  created_at: '2022-02-12T08:01:37.838Z'
}

export const mockApplicationStatuses: Status[] = [
  {
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'pending_review',
    created_at: '2022-02-12T08:01:37.838Z'
  },
  {
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'change_requested',
    created_at: '2022-02-13T08:01:37.838Z'
  },
  {
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'pending_review',
    created_at: '2022-02-18T08:01:37.838Z'
  }
]

export const mockApplicationStatusHandlers = [
  http.put('/api/applications/:id/status', () => {
    return HttpResponse.json(mockApplicationStatus)
  })
]
