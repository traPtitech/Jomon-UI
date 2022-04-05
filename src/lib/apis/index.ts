import { Apis, Configuration } from './generated'

export default new Apis(
  new Configuration({
    basePath: '/api'
  })
)

export * from './generated'

export type ErrorResponse = {
  error: string
  message: string
}
