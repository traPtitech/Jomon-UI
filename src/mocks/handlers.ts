import { groups } from './groups'
import { tags } from './tags'
import { users } from './users'

export const handlers = [groups, tags, users].flat()
