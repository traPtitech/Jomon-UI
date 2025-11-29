import { useUserRepository } from './data/repository'
import type { User } from './entities'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createUserStore = defineStore('user', () => {
  const me = ref<User | undefined>(undefined)
  const users = ref<User[]>([])
  const isUserFetched = ref(false)
  const isMeFetched = ref(false)

  const isAccountManager = computed(() => Boolean(me.value?.accountManager))
  const userOptions = computed(() =>
    users.value.map(user => ({
      key: user.name,
      value: user.id
    }))
  )
  const userMap = computed(() =>
    users.value.reduce<Record<string, string>>((acc, user) => {
      acc[user.id] = user.name
      return acc
    }, {})
  )

  const fetchUsers = async () => {
    const repository = useUserRepository()

    try {
      users.value = await repository.fetchUsers()
      isUserFetched.value = true
    } catch (e) {
      throw new Error('ユーザー一覧の取得に失敗しました: ' + String(e))
    }
  }

  const fetchMe = async () => {
    if (isMeFetched.value) return

    const repository = useUserRepository()

    try {
      me.value = await repository.fetchMe()
      isMeFetched.value = true
    } catch {
      throw new Error('ユーザーの取得に失敗しました')
    }
  }

  const reset = () => {
    me.value = undefined
    users.value = []
    isUserFetched.value = false
    isMeFetched.value = false
  }

  return {
    me,
    users,
    isUserFetched,
    isMeFetched,
    isAccountManager,
    userOptions,
    userMap,
    fetchUsers,
    fetchMe,
    reset
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
