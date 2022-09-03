import { admins } from './admins'
import { groups } from './groups'
import { requests } from './requests'
import { tags } from './tags'
import { transactions } from './transactions'
import { users } from './users'

export const handlers = [
  requests,
  transactions,
  groups,
  admins,
  tags,
  users
].flat()
