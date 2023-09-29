import { rest } from 'msw'

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
  rest.get('/api/groups', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockGroups))
  }),
  rest.get('/api/groups/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<GroupDetail>({
        ...mockGroupDetail,
        id: req.params.id as string
      })
    )
  }),
  rest.post('/api/groups', async (req, res, ctx) => {
    const reqBody: GroupSeed = await req.json()
    return res(
      ctx.status(200),
      ctx.json<GroupDetail>({
        ...mockGroupDetail,
        ...reqBody
      })
    )
  }),
  rest.put('/api/groups/:id', async (req, res, ctx) => {
    const reqBody: GroupSeed = await req.json()
    return res(
      ctx.status(200),
      ctx.json<GroupDetail>({
        ...mockGroupDetail,
        id: req.params.id as string,
        ...reqBody
      })
    )
  }),
  rest.delete('/api/groups/:id', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post('/api/groups/:id/members', async (req, res, ctx) => {
    const reqBody: string[] = await req.json()
    return res(ctx.status(200), ctx.json<string[]>(reqBody))
  }),
  rest.post('/api/groups/:id/owners', async (req, res, ctx) => {
    const reqBody: string[] = await req.json()
    return res(ctx.status(200), ctx.json<string[]>(reqBody))
  }),
  rest.delete('/api/groups/:id/members', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.delete('/api/groups/:id/owners', (req, res, ctx) => {
    return res(ctx.status(200))
  })
]
