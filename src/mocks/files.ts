import { rest } from 'msw'

import mehm8128 from '/public/assets/mehm8128.png'
import mehm8128_circle from '/public/assets/mehm8128_circle.png'
import slide1 from '/public/assets/slide1.png'

export const files = [
  rest.get('/api/files/:id', (req, res, ctx) => {
    switch (req.params.id) {
      case '3fa85f64-5717-4562-b3fc-2c963f66afa6':
        return res(ctx.status(200), ctx.text(mehm8128))
      case '3fa85f64-5717-4562-b3fc-2c963f66afa7':
        return res(ctx.status(200), ctx.text(mehm8128_circle))
      case '3fa85f64-5717-4562-b3fc-2c963f66afa8':
        return res(ctx.status(200), ctx.text(slide1))
      default:
        return res(ctx.status(404))
    }
  }),
  rest.get('/api/files/:id/meta', (req, res, ctx) => {
    let name = ''
    switch (req.params.id) {
      case '3fa85f64-5717-4562-b3fc-2c963f66afa6':
        name = 'mehm8128.png'
        break
      case '3fa85f64-5717-4562-b3fc-2c963f66afa7':
        name = 'mehm8128_circle.png'
        break
      case '3fa85f64-5717-4562-b3fc-2c963f66afa8':
        name = 'slide1.png'
        break
      default:
        return res(ctx.status(404))
    }
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        name: name,
        mime_type: 'image/png',
        created_at: '2021-08-01T00:00:00Z'
      })
    )
  })
]
