import type { User } from './apis'

export const isAdminOrGroupOwner = (
  user: User | undefined,
  groupOwners: string[]
) => {
  if (!user) return false
  return user.admin || groupOwners.includes(user.name)
}

export const isAdmin = (user: User | undefined) => {
  if (!user) return false
  return user.admin
}
