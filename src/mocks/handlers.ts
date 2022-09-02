import { rest } from 'msw'

const requests = [
  rest.get('/api/requests', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        Array(3).fill({
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'submitted',
          created_at: '2022-01-25T13:29:19.918Z',
          updated_at: '2022-01-25T13:29:19.918Z',
          created_by: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          amount: 1200,
          title: 'SysAd講習会の開催費用',
          tags: [
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2021講習会',
              created_at: '2022-01-25T13:29:19.918Z',
              updated_at: '2022-01-25T13:29:19.918Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2022講習会',
              created_at: '2022-01-25T13:29:19.918Z',
              updated_at: '2022-01-25T13:29:19.918Z'
            },
            {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '2020講習会',
              created_at: '2022-01-25T13:29:19.918Z',
              updated_at: '2022-01-25T13:29:19.918Z'
            }
          ],
          group: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'SysAd',
            description: 'SysAd班',
            budget: 250000,
            created_at: '2022-01-25T13:29:19.918Z',
            updated_at: '2022-01-25T13:29:19.918Z'
          }
        })
      )
    )
  }),
  rest.get('/api/requests/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.id,
        amount: 1200,
        title: 'SysAd講習会の開催費用',
        created_by: 'mehm8128',
        status: 'submitted',
        content: `# aaaaa
- aaa
  - bbb`,
        targets: [
          {
            id: 'mehm8128',
            amount: 1200,
            target: 'mehm8128',
            paid_at: '2020-01-01',
            created_at: '2020-01-01'
          },
          {
            id: 'nagatech',
            amount: 1500,
            target: 'nagatech',
            paid_at: '2020-01-02',
            created_at: '2020-01-02'
          }
        ],
        comments: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            user: 'mehm8128',
            comment: '# aaaaa\n- aaa \n  - bbb',
            created_at: '2022-02-11T08:01:38.838Z',
            updated_at: '2022-02-11T08:01:38.838Z'
          },
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            user: 'mehm8128',
            comment: '**コメント内容**',
            created_at: '2022-02-14T08:01:38.838Z',
            updated_at: '2022-02-14T08:01:38.838Z'
          }
        ],
        files: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        statuses: [
          {
            created_by: 'mehm8128',
            status: 'submitted',
            created_at: '2022-02-12T08:01:37.838Z'
          },
          {
            created_by: 'mehm8128',
            status: 'fix_required',
            created_at: '2022-02-13T08:01:37.838Z'
          },
          {
            created_by: 'mehm8128',
            status: 'submitted',
            created_at: '2022-02-18T08:01:37.838Z'
          }
        ],
        tags: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
            name: '2020講習会',
            created_at: '2020-02-12T08:01:37.838Z',
            updated_at: '2020-02-12T08:01:37.838Z'
          },
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: '2021講習会',
            created_at: '2021-02-12T08:01:38.838Z',
            updated_at: '2021-02-12T08:01:38.838Z'
          },
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
            name: '2022講習会',
            created_at: '2022-02-12T08:01:39.838Z',
            updated_at: '2022-02-12T08:01:39.838Z'
          }
        ],
        group: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'SysAd',
          description: 'SysAd班',
          budget: 250000,
          created_at: '2022-04-05T14:02:15.431Z',
          updated_at: '2022-04-05T14:02:15.431Z'
        },
        created_at: '2022-02-12T08:01:37.838Z',
        updated_at: '2022-02-12T08:01:37.838Z'
      })
    )
  })
]

const transactions = [
  rest.get('/api/transactions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
          name: '2020講習会',
          created_at: '2022-04-17T05:47:48.187Z',
          updated_at: '2022-04-17T05:47:48.187Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2021講習会',
          created_at: '2022-04-17T05:47:48.187Z',
          updated_at: '2022-04-17T05:47:48.187Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          name: '2022講習会',
          created_at: '2022-04-17T05:47:48.187Z',
          updated_at: '2022-04-17T05:47:48.187Z'
        }
      ])
    )
  })
]

const groups = [
  rest.get('/api/groups', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        Array(1000).fill({
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'SysAd',
          description: 'SysAd班',
          budget: 250000,
          created_at: '2022-04-05T14:02:15.431Z',
          updated_at: '2022-04-05T14:02:15.431Z'
        })
      )
    )
  })
]

const admins = [
  rest.get('/api/admins', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
  })
]

const tags = [
  rest.get('/api/tags', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa5',
          name: '2020講習会',
          created_at: '2022-04-17T05:47:48.187Z',
          updated_at: '2022-04-17T05:47:48.187Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: '2021講習会',
          created_at: '2022-04-17T05:47:48.187Z',
          updated_at: '2022-04-17T05:47:48.187Z'
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          name: '2022講習会',
          created_at: '2022-04-17T05:47:48.187Z',
          updated_at: '2022-04-17T05:47:48.187Z'
        }
      ])
    )
  })
]

const users = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          name: 'nagatech',
          display_name: 'ながてち',
          admin: true,
          created_at: '2022-01-25T13:45:36.048Z',
          updated_at: '2022-01-25T13:45:36.048Z',
          deleted_at: '2022-01-25T13:45:36.048Z'
        },
        {
          name: 'mehm8128',
          display_name: 'mehm8128',
          admin: true,
          created_at: '2022-01-27T13:45:37.048Z',
          updated_at: '2022-01-27T13:45:37.048Z',
          deleted_at: '2022-01-27T13:45:37.048Z'
        }
      ])
    )
  }),
  rest.get('/api/users/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'mehm8128',
        display_name: 'mehm8128',
        admin: true,
        created_at: '2022-01-27T13:45:37.048Z',
        updated_at: '2022-01-27T13:45:37.048Z',
        deleted_at: '2022-01-27T13:45:37.048Z'
      })
    )
  })
]

export const handlers = [
  requests,
  transactions,
  groups,
  admins,
  tags,
  users
].flat()
