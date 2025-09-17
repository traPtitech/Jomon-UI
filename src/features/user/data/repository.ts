import apis from '/@/lib/apis'

import type { User } from '../entities'

export const useUserRepository = () => {
  return createUserRepository()
}

const createUserRepository = () => ({
  fetchUsers: async (): Promise<User[]> => {
    const { data } = await apis.getUsers()
    return data.map(user => ({
      id: user.id,
      name: user.name,
      displayName: user.display_name,
      accountManager: user.account_manager
    }))
  },
  fetchMe: async (): Promise<User> => {
    const { data } = await apis.getMe()
    return {
      id: data.id,
      name: data.name,
      displayName: data.display_name,
      accountManager: data.account_manager
    }
  }
})
