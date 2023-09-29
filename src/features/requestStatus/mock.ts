import type { Status } from '/@/lib/apis'

export const mockRequestStatus: Status = {
  created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  status: 'submitted',
  created_at: '2022-02-12T08:01:37.838Z'
}

export const mockRequestStatuses: Status[] = [
  {
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'submitted',
    created_at: '2022-02-12T08:01:37.838Z'
  },
  {
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'fix_required',
    created_at: '2022-02-13T08:01:37.838Z'
  },
  {
    created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'submitted',
    created_at: '2022-02-18T08:01:37.838Z'
  }
]
