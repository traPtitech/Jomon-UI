import { rest } from 'msw'

export const users = [
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
