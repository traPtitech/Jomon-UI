import { useUserRepository } from './data/repository'
import type { User } from './entities'
import { defineStore, storeToRefs } from 'pinia'

const createUserStore = defineStore('user', {
  state: () => ({
    me: undefined as User | undefined,
    users: [] as User[],
    isUserFetched: false,
    isMeFetched: false
  }),
  getters: {
    isAccountManager: state => Boolean(state.me?.accountManager),
    userOptions: state =>
      state.users.map(user => ({
        key: user.name,
        value: user.id
      })),
    userMap: state =>
      state.users.reduce<Record<string, string>>((acc, user) => {
        acc[user.id] = user.name
        return acc
      }, {})
  },
  actions: {
    async fetchUsers() {
      const repository = useUserRepository()

      try {
        this.users = await repository.fetchUsers()
        this.isUserFetched = true
      } catch (e) {
        throw new Error('ユーザー一覧の取得に失敗しました: ' + String(e))
      }
    },
    async fetchMe() {
      if (this.isMeFetched) return

      const repository = useUserRepository()

      try {
        this.me = await repository.fetchMe()
        this.isMeFetched = true
      } catch {
        throw new Error('ユーザーの取得に失敗しました')
      }
    },
    reset() {
      this.me = undefined
      this.users = []
      this.isUserFetched = false
      this.isMeFetched = false
    }
  }
})

export const useUserStore = () => {
  const store = createUserStore()
  const refs = storeToRefs(store)

  return {
    ...refs,
    fetchUsers: store.fetchUsers,
    fetchMe: store.fetchMe,
    reset: store.reset
  }
}

export type UserStore = ReturnType<typeof useUserStore>
