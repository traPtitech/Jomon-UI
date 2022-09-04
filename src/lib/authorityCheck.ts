import type { User } from './apis'

export const isAdmin = (user: User | undefined) => {
  if (!user) return false
  return user.admin
}

export const isCreater = (user: User | undefined, creater: string) => {
  if (!user) return false
  return user.name === creater
}
