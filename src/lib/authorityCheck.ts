import type { User } from './apis'

export const isAdmin = (user: User | undefined) => {
  if (!user) return false
  return user.admin
}
