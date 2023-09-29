import { rest } from 'msw'

import type { FileMeta } from '/@/lib/apis'

import mehm8128 from '/@/assets/mehm8128.png'

const mockFile = mehm8128

const mockFileMeta: FileMeta = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'mehm8128.png',
  mime_type: 'image/png',
  created_at: '2021-08-01T00:00:00Z'
}

export const fileHandlers = [
  rest.get('/api/files/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(mockFile))
  }),
  rest.get('/api/files/:id/meta', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<FileMeta>({ ...mockFileMeta, id: req.params.id as string })
    )
  }),
  rest.post('/api/files', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    )
  })
]
