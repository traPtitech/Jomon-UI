import { HttpResponse, type PathParams, http } from 'msw'

import type { Group, GroupDetail } from '/@/lib/apis'

import type { GroupSeed } from '/@/features/group/model'

export const mockGroup: Group = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'game',
  description: 'game班',
  budget: 250000,
  created_at: '2022-04-05T14:02:15.431Z',
  updated_at: '2022-04-05T14:02:15.431Z'
}
const mockGroups = Array(10).fill(mockGroup)

const mockGroupDetail: GroupDetail = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'SysAd',
  description: 'SysAd班',
  budget: 250000,
  owners: [
    '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    '3fa85f64-5717-4562-b3fc-2c963f66afa7'
  ],
  members: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
  created_at: '2022-04-05T14:02:15.431Z',
  updated_at: '2022-04-05T14:02:15.431Z'
}

export const groupHandlers = [
  http.get('/api/groups', () => {
    return HttpResponse.json(mockGroups)
  }),
  http.get('/api/groups/:id', ({ params }) => {
    const res: GroupDetail = {
      ...mockGroupDetail,
      id: params.id as string
    }
    return HttpResponse.json(res)
  }),
  http.post<PathParams, GroupSeed, GroupDetail>(
    '/api/groups',
    async ({ request }) => {
      const reqBody: GroupSeed = await request.json()
      const res: GroupDetail = {
        ...mockGroupDetail,
        ...reqBody
      }
      return HttpResponse.json(res)
    }
  ),
  http.put<PathParams, GroupSeed, GroupDetail>(
    '/api/groups/:id',
    async ({ request, params }) => {
      const reqBody: GroupSeed = await request.json()
      const res: GroupDetail = {
        ...mockGroupDetail,
        id: params.id as string,
        ...reqBody
      }
      return HttpResponse.json(res)
    }
  ),
  http.delete('/api/groups/:id', () => {
    return HttpResponse.json(null)
  }),
  http.post<PathParams, string[], string[]>(
    '/api/groups/:id/members',
    async ({ request }) => {
      const reqBody: string[] = await request.json()
      return HttpResponse.json(reqBody)
    }
  ),
  http.post<PathParams, string[], string[]>(
    '/api/groups/:id/owners',
    async ({ request }) => {
      const reqBody: string[] = await request.json()
      return HttpResponse.json(reqBody)
    }
  ),
  http.delete('/api/groups/:id/members', () => {
    return HttpResponse.json(null)
  }),
  http.delete('/api/groups/:id/owners', () => {
    return HttpResponse.json(null)
  })
]
